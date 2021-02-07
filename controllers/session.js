const EventModel = require('@models/event');
const SessionModel = require('@models/session');
const TicketModel = require('@models/ticket');

const Errors = require('@utils/Errors');
const ReturnCode = require('@utils/ReturnCode');
const ReturnObject = require('@utils/ReturnObject');

module.exports.getAllByEventId = async function(req, res) {
  const returnObject = new ReturnObject([]);
  try {
    const { event_id: eventId } = req.query;

    if (!eventId) {
      throw new Errors.BadRequestError('Missing one or more required parameters.', ['event_id']);
    }

    const Session = SessionModel(req.mysql);

    const sessions = await Session.getAllByEventId(eventId);

    await Promise.all(sessions.map(async (session) => {
      const seats = await req.redis.hget(`session:${session.id}`, 'open_seats');
      session.open_seats = seats && parseInt(seats, 10);
    }));

    returnObject.setData(sessions);
    res.status(ReturnCode.OK).json(returnObject);
  } catch (err) {
    returnObject.setError(err.message, err.fields);
    res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};

module.exports.getById = async function(req, res) {
  const returnObject = new ReturnObject({});
  try {
    const { session_id: sessionId } = req.params;

    if (!sessionId) {
      throw new Errors.BadRequestError('Missing one or more required parameters.', ['session_id']);
    }

    const Session = SessionModel(req.mysql);

    const session = await Session.get(sessionId);

    returnObject.setData(session);
    res.status(ReturnCode.OK).json(returnObject);
  } catch (err) {
    returnObject.setError(err.message, err.fields);
    res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};

module.exports.create = async function(req, res) {
  const returnObject = new ReturnObject({});
  try {
    const { event_id: eventId } = req.query;
    let { time, ticket_sell_time_open: ticketSellTimeOpen, ticket_sell_time_end: ticketSellTimeEnd } = req.body;
    const { address, max_seats: maxSeats, price } = req.body;
    const { user_id: userId, role } = req;

    if (!eventId || !time || !address || !ticketSellTimeOpen || !ticketSellTimeEnd || !maxSeats || !price) {
      throw new Errors.BadRequestError('Missing one or more required parameters.', ['event_id', 'time', 'address', 'ticket_sell_time_open', 'ticket_sell_time_end', 'max_seats', 'price']);
    }

    time = new Date(time);
    ticketSellTimeOpen = new Date(ticketSellTimeOpen);
    ticketSellTimeEnd = new Date(ticketSellTimeEnd);

    if (address.length > 64 || time.toString() === 'Invalid Date' || ticketSellTimeOpen.toString() === 'Invalid Date' || ticketSellTimeEnd.toString() === 'Invalid Date' || maxSeats < 0 || price < 0) {
      throw new Errors.BadRequestError('One or more parameters contain incorrect values.', ['event_id', 'time', 'address', 'ticket_sell_time_open', 'ticket_sell_time_end', 'max_seats', 'price']);
    }

    const Event = EventModel(req.mysql);

    const event = await Event.get(eventId);
    if (Object.keys(event).length === 0) {
      throw new Errors.BadRequestError('Fail to locate the event from the database.', ['event_id']);
    }

    // TODO: check session time is between event period

    if (userId !== event.creator_uid && role !== 1) {
      throw new Errors.ForbiddenError('No permission to create the session under this event.');
    }

    const Session = SessionModel(req.mysql);

    const result = await Session.create(eventId, time, address, ticketSellTimeOpen, ticketSellTimeEnd, maxSeats, price);
    if (result.affectedRows === 0) {
      throw new Errors.InternalServerError('Fail to create the session.');
    }

    returnObject.setData({ id: result.insertId });
    res.status(ReturnCode.CREATED).json(returnObject);
  } catch (err) {
    returnObject.setError(err.message, err.fields);
    res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};

module.exports.getAvailableSeats = async function(req, res) {
  const returnObject = new ReturnObject({});
  try {
    const { session_id: sessionId } = req.params;

    if (!sessionId) {
      throw new Errors.BadRequestError('Missing one or more required parameters.', ['session_id']);
    }

    let seats = await req.redis.hget(`session:${sessionId}`, 'open_seats');
    seats = seats && parseInt(seats, 10);

    returnObject.setData({ open_seats: seats });
    res.status(ReturnCode.OK).json(returnObject);
  } catch (err) {
    returnObject.setError(err.message);
    res.status(ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};

module.exports.activation = async function(req, res) {
  const returnObject = new ReturnObject({});
  try {
    const { session_id: sessionId } = req.params;
    const { activation } = req.body;
    const { user_id: userId, role } = req;

    if (!sessionId) {
      throw new Errors.BadRequestError('Missing one or more required parameters.', ['session_id']);
    }

    const Session = SessionModel(req.mysql);

    const session = await Session.get(sessionId);
    if (Object.keys(session).length === 0) {
      throw new Errors.BadRequestError('Fail to locate the session from the database.', ['session_id']);
    }

    if (userId !== session.creator_uid && role !== 1) {
      throw new Errors.ForbiddenError('No permission to update the session.');
    }

    if (activation) {
      const Ticket = TicketModel(req.mysql);
      const count = await Ticket.countTicket(sessionId);

      const result = await Session.activation(sessionId, true);
      if (result.affectedRows === 0) {
        throw new Errors.InternalServerError('Fail to set the session activation status in the database.');
      }

      await req.redis.hset(
        `session:${sessionId}`,
        'name', session.name,
        'ticket_sell_time_open', session.ticket_sell_time_open,
        'ticket_sell_time_end', session.ticket_sell_time_end,
        'open_seats', session.max_seats - count,
        'is_active', true,
      );
    } else {
      try {
        await req.redis.hset(`session:${sessionId}`, 'is_active', false);

        const result = await Session.activation(sessionId, false);
        if (result.affectedRows === 0) {
          throw new Errors.InternalServerError('Fail to set the session activation status in the database.');
        }

        await req.redis.del(`session:${sessionId}`);
      } catch (err) {
        await req.redis.set(`session:${sessionId}:is_active`, true);
        throw err;
      }
    }

    res.status(ReturnCode.NO_CONTENT).end();
  } catch (err) {
    returnObject.setError(err.message, err.fields);
    res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};

module.exports.update = async function(req, res) {
  const returnObject = new ReturnObject({});
  try {
    const { session_id: sessionId } = req.params;
    let { time, ticket_sell_time_open: ticketSellTimeOpen, ticket_sell_time_end: ticketSellTimeEnd } = req.body;
    const { address, max_seats: maxSeats, price } = req.body;
    const { user_id: userId, role } = req;

    if (!sessionId || !time || !address || !ticketSellTimeOpen || !ticketSellTimeEnd || !maxSeats || !price) {
      throw new Errors.BadRequestError('Missing one or more required parameters.', ['session_id', 'time', 'address', 'ticket_sell_time_open', 'ticket_sell_time_end', 'max_seats', 'price']);
    }

    time = new Date(time);
    ticketSellTimeOpen = new Date(ticketSellTimeOpen);
    ticketSellTimeEnd = new Date(ticketSellTimeEnd);

    if (address.length > 64 || time.toString() === 'Invalid Date' || ticketSellTimeOpen.toString() === 'Invalid Date' || ticketSellTimeEnd.toString() === 'Invalid Date' || maxSeats < 0 || price < 0) {
      throw new Errors.BadRequestError('One or more parameters contain incorrect values.', ['session_id', 'time', 'address', 'ticket_sell_time_open', 'ticket_sell_time_end', 'max_seats', 'price']);
    }

    const Session = SessionModel(req.mysql);

    const session = await Session.get(sessionId);
    if (Object.keys(session).length === 0) {
      throw new Errors.BadRequestError('Fail to locate the session from the database.', ['session_id']);
    }

    if (userId !== session.creator_uid && role !== 1) {
      throw new Errors.ForbiddenError('No permission to update the session.');
    }

    if (session.is_active) {
      throw new Errors.BadRequestError('Unable to update the active session. Please deactivate it first.', ['is_active']);
    }

    // TODO: check session time is between event period
    // TODO: check the total number of ticket sold out before reducing the maxSeats

    const result = await Session.update(sessionId, time, address, ticketSellTimeOpen, ticketSellTimeEnd, maxSeats, price);
    if (result.affectedRows === 0) {
      throw new Errors.InternalServerError('Fail to update the session in the database.');
    }

    res.status(ReturnCode.NO_CONTENT).end();
  } catch (err) {
    returnObject.setError(err.message, err.fields);
    res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};

module.exports.delete = async function(req, res) {
  const returnObject = new ReturnObject({});
  try {
    const { session_id: sessionId } = req.params;
    const { user_id: userId, role } = req;

    if (!sessionId) {
      throw new Errors.BadRequestError('Missing one or more required parameters.', ['session_id']);
    }

    const Session = SessionModel(req.mysql);

    const session = await Session.get(sessionId);
    if (Object.keys(session).length === 0) {
      throw new Errors.BadRequestError('Fail to locate the session from the database.', ['session_id']);
    }

    if (userId !== session.creator_uid && role !== 1) {
      throw new Errors.ForbiddenError('No permission to delete the session.');
    }

    if (session.is_active) {
      throw new Errors.BadRequestError('Unable to delete the active session. Please deactivate it first.', ['is_active']);
    }

    const Ticket = TicketModel(req.mysql);

    const tickets = await Ticket.getAllBySessionId(sessionId);
    if (tickets.length > 0) {
      throw new Errors.BadRequestError('One or more tickets exist under current session. Cannot delete the session.');
    }

    const result = await Session.delete(sessionId);
    if (result.affectedRows === 0) {
      throw new Errors.InternalServerError('Fail to delete the session from the database.');
    }

    res.status(ReturnCode.NO_CONTENT).end();
  } catch (err) {
    returnObject.setError(err.message, err.fields);
    res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};
