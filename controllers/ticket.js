const SessionModel = require('@models/session');
const TicketModel = require('@models/ticket');

const Errors = require('@utils/Errors');
const ReturnCode = require('@utils/ReturnCode');
const ReturnObject = require('@utils/ReturnObject');

module.exports.getAllByUserId = async function(req, res) {
  const returnObject = new ReturnObject([]);
  try {
    const userId = req.user_id;

    const Ticket = TicketModel(req.mysql);

    const tickets = await Ticket.getAllByUserId(userId);

    returnObject.setData(tickets);
    res.status(ReturnCode.OK).json(returnObject);
  } catch (err) {
    returnObject.setError(err.message);
    res.status(ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};

module.exports.getAllBySessionId = async function(req, res) {
  const returnObject = new ReturnObject([]);
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
      throw new Errors.ForbiddenError('No permission to get the tickets from this session.');
    }

    const Ticket = TicketModel(req.mysql);

    const tickets = await Ticket.getAllBySessionId(sessionId);

    returnObject.setData(tickets);
    res.status(ReturnCode.OK).json(returnObject);
  } catch (err) {
    returnObject.setError(err.message, err.fields);
    res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};

module.exports.getById = async function(req, res) {
  const returnObject = new ReturnObject({});
  try {
    const { ticket_id: ticketId } = req.params;
    const { user_id: userId, role } = req;

    if (!ticketId) {
      throw new Errors.BadRequestError('Missing one or more required parameters.', ['ticket_id']);
    }

    const Ticket = TicketModel(req.mysql);

    const ticket = await Ticket.get(ticketId);

    if (userId !== ticket.user_id && userId !== ticket.creator_uid && role !== 1) {
      throw new Errors.ForbiddenError('No permission to get the ticket.');
    }

    returnObject.setData(ticket);
    res.status(ReturnCode.OK).json(returnObject);
  } catch (err) {
    returnObject.setError(err.message, err.fields);
    res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};

module.exports.create = async function(req, res) {
  const returnObject = new ReturnObject({});
  try {
    const { session_id: sessionId } = req.query;
    const { seat_no: seatNo } = req.body;
    const userId = req.user_id;

    if (!sessionId || !seatNo) {
      throw new Errors.BadRequestError('Missing one or more required parameters.', ['session_id', 'seat_no']);
    }

    const isActive = await req.redis.hget(`session:${sessionId}`, 'is_active'); // TODO
    let timeOpen = await req.redis.hget(`session:${sessionId}`, 'ticket_sell_time_open');
    let timeEnd = await req.redis.hget(`session:${sessionId}`, 'ticket_sell_time_end');

    if (isActive === 'false' || !timeOpen || !timeEnd) {
      throw new Errors.BadRequestError('Not available yet.');
    }

    const now = new Date();
    timeOpen = new Date(timeOpen);
    timeEnd = new Date(timeEnd);

    if (now < timeOpen) {
      throw new Errors.BadRequestError('Not booking time yet.');
    }

    if (now > timeEnd) {
      throw new Errors.BadRequestError('Booking time is over.');
    }

    const seats = await req.redis.hincrby(`session:${sessionId}`, 'open_seats', -1);
    if (seats < 0) {
      await req.redis.hincrby(`session:${sessionId}`, 'open_seats', 1);
      throw new Errors.BadRequestError('No tickets currently available.');
    }

    try {
      const Session = SessionModel(req.mysql);

      const session = await Session.get(sessionId);
      if (Object.keys(session).length === 0) {
        throw new Errors.BadRequestError('Fail to locate the session from the database.', ['session_id']);
      }

      if (seatNo <= 0 || seatNo > session.max_seats) {
        throw new Errors.BadRequestError('The selected seat is not valid.', ['seat_no']);
      }

      const Ticket = TicketModel(req.mysql);

      const result = await Ticket.create(userId, sessionId, seatNo);
      if (result.affectedRows === 0) {
        throw new Errors.InternalServerError('Fail to create the ticket.');
      }

      returnObject.setData({ id: result.insertId });
      res.status(ReturnCode.CREATED).json(returnObject);
    } catch (err) {
      await req.redis.hincrby(`session:${sessionId}`, 'open_seats', 1);
      if (err.code === 'ER_DUP_ENTRY') {
        throw new Errors.ConflictError('This seat has already been occupied. Choose another one.', ['seat_no']);
      }
      throw err;
    }
  } catch (err) {
    returnObject.setError(err.message, err.fields);
    res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};

module.exports.update = async function(req, res) {
  const returnObject = new ReturnObject({});
  try {
    const { ticket_id: ticketId } = req.params;
    const { seat_no: seatNo } = req.body;
    const { user_id: userId, role } = req;

    if (!ticketId || !seatNo) {
      throw new Errors.BadRequestError('Missing one or more required parameters.', ['ticket_id', 'seat_no']);
    }

    const Ticket = TicketModel(req.mysql);

    const ticket = await Ticket.get(ticketId);
    if (Object.keys(ticket).length === 0) {
      throw new Errors.BadRequestError('Fail to locate the ticket from the database.', ['ticket_id']);
    }

    const Session = SessionModel(req.mysql);

    const session = await Session.get(ticket.session_id);

    if (userId !== ticket.user_id && userId !== session.creator_uid && role !== 1) {
      throw new Errors.ForbiddenError('No permission to update the ticket.');
    }

    if (!session.is_active && userId !== session.creator_uid && role !== 1) {
      throw new Errors.BadRequestError('Unable to update the ticket. This session is inactive currently.', ['is_active']);
    }

    if (seatNo <= 0 || seatNo > session.max_seats) {
      throw new Errors.BadRequestError('The selected seat is not valid.', ['seat_no']);
    }

    const result = await Ticket.update(ticketId, seatNo);
    if (result.affectedRows === 0) {
      throw new Errors.InternalServerError('Fail to update the ticket in the database.');
    }

    res.status(ReturnCode.NO_CONTENT).end();
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      returnObject.setError('This seat has already been occupied. Choose another one.', ['seat_no']);
      res.status(ReturnCode.CONFLICT);
    } else {
      returnObject.setError(err.message, err.fields);
      res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR);
    }
    res.json(returnObject);
  }
};

module.exports.delete = async function(req, res) {
  const returnObject = new ReturnObject({});
  try {
    const { ticket_id: ticketId } = req.params;
    const { user_id: userId, role } = req;

    if (!ticketId) {
      throw new Errors.BadRequestError('Missing one or more required parameters.', ['ticket_id']);
    }

    const Ticket = TicketModel(req.mysql);

    const ticket = await Ticket.get(ticketId);
    if (Object.keys(ticket).length === 0) {
      throw new Errors.BadRequestError('Fail to locate the ticket from the database.', ['ticket_id']);
    }

    const Session = SessionModel(req.mysql);

    const session = await Session.get(ticket.session_id);

    if (userId !== ticket.user_id && userId !== session.creator_uid && role !== 1) {
      throw new Errors.ForbiddenError('No permission to delete the ticket.');
    }

    if (!session.is_active && userId !== session.creator_uid && role !== 1) {
      throw new Errors.BadRequestError('Unable to delete the ticket. This session is inactive currently.', ['is_active']);
    }

    const result = await Ticket.delete(ticketId);
    if (result.affectedRows === 0) {
      throw new Errors.InternalServerError('Fail to delete the ticket from the database.');
    }

    await req.redis.hincrby(`session:${ticket.session_id}`, 'open_seats', 1);

    res.status(ReturnCode.NO_CONTENT).end();
  } catch (err) {
    returnObject.setError(err.message, err.fields);
    res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};
