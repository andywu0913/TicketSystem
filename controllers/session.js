const eventModel = require(__projdir + '/models/event');
const sessionModel = require(__projdir + '/models/session');
const ticketModel = require(__projdir + '/models/ticket');

module.exports.getAllByEventId = async function(req, res, next) {
  try {
    let eventId = req.query.event_id;

    if(!eventId) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['event_id'], 'error_msg': 'Missing one or more required parameters.'});
    }

    let Session = sessionModel(req.mysql);

    let sessions = await Session.getAllByEventId(eventId);

    await Promise.all(sessions.map(async function(session) {
      let seats = await req.redis.hget(`session:${session.id}`, 'open_seats');
      session.open_seats = seats === null ? null : parseInt(seats);
    }));
    res.json({'successful': true, 'data': sessions, 'error_field': [], 'error_msg': ''});
  }
  catch(err) {
    res.status(500);
    res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
  }
};

module.exports.create = async function(req, res, next) {
  try {
    let eventId            = req.query.event_id;
    let time               = req.body.time;
    let address            = req.body.address;
    let ticketSellTimeOpen = req.body.ticket_sell_time_open;
    let ticketSellTimeEnd  = req.body.ticket_sell_time_end;
    let maxSeats           = req.body.max_seats;
    let price              = req.body.price;
    let userId             = req.user_id;
    let role               = req.role;

    if(!eventId || !time || !address || !ticketSellTimeOpen || !ticketSellTimeEnd || !maxSeats || !price) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['event_id', 'time', 'address', 'ticket_sell_time_open', 'ticket_sell_time_end', 'max_seats', 'price'], 'error_msg': 'Missing one or more required parameters.'});
    }

    time               = new Date(time);
    ticketSellTimeOpen = new Date(ticketSellTimeOpen);
    ticketSellTimeEnd  = new Date(ticketSellTimeEnd);

    if(address.length > 64 || time.toString() === 'Invalid Date' || ticketSellTimeOpen.toString() === 'Invalid Date' || ticketSellTimeEnd.toString() === 'Invalid Date' || maxSeats < 0 || price < 0) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['event_id', 'time', 'address', 'ticket_sell_time_open', 'ticket_sell_time_end', 'max_seats', 'price'], 'error_msg': 'One or more parameters contain incorrect values.'});
    }

    let Event = eventModel(req.mysql);

    let event = await Event.get(eventId);
    if(Object.keys(event).length === 0)
      throw 'Fail to locate the event from the database.';

    // TODO: check session time is between event period

    if(userId !== event.creator_uid && role !== 1) {
      res.status(403);
      return res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': 'No permission to create the session under this event.'});
    }

    let Session = sessionModel(req.mysql);

    let result = await Session.create(eventId, time, address, ticketSellTimeOpen, ticketSellTimeEnd, maxSeats, price);
    if(result.affectedRows === 0)
      throw 'Fail to create the session.';

    res.status(201);
    res.json({'successful': true, 'data': {'id': result.insertId}, 'error_field': [], 'error_msg': ''});
  }
  catch(err) {
    res.status(500);
    res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
  }
};

module.exports.getAvailableSeats = async function(req, res, next) {
  try {
    let sessionId = req.params.session_id;

    if(!sessionId) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['session_id'], 'error_msg': 'Missing one or more required parameters.'});
    }

    let seats = await req.redis.hget(`session:${sessionId}`, 'open_seats');
    seats = seats === null ? null : parseInt(seats);
    res.json({'successful': true, 'data': {'open_seats': seats}, 'error_field': [], 'error_msg': ''});
  }
  catch(err) {
    res.status(500);
    res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': err});
  }
};

module.exports.activation = async function(req, res, next) {
  try {
    let sessionId  = req.params.session_id;
    let activation = req.body.activation;
    let userId     = req.user_id;
    let role       = req.role;

    if(!sessionId) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['session_id'], 'error_msg': 'Missing one or more required parameters.'});
    }

    let Session = sessionModel(req.mysql);

    let session = await Session.get(sessionId);
    if(Object.keys(session).length === 0) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['session_id'], 'error_msg': 'Fail to locate the session from the database.'});
    }

    if(userId !== session.creator_uid && role !== 1) {
      res.status(403);
      return res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': 'No permission to update the session.'});
    }

    if(activation) {
      let Ticket = ticketModel(req.mysql);
      let count = await Ticket.countTicket(sessionId);

      let result = await Session.activation(sessionId, true);
      if(result.affectedRows === 0)
        throw 'Fail to set the session activation status in the database.';

      await req.redis.hset(
        `session:${sessionId}`,
        'name',                  session.name,
        'ticket_sell_time_open', session.ticket_sell_time_open,
        'ticket_sell_time_end',  session.ticket_sell_time_end,
        'open_seats',            session.max_seats - count,
        'is_active',             true
      );
    }
    else {
      try {
        await req.redis.hset(`session:${sessionId}`, 'is_active', false);

        let result = await Session.activation(sessionId, false);
        if(result.affectedRows === 0) {
          throw 'Fail to set the session activation status in the database.';
        }

        await req.redis.del(`session:${sessionId}`);
      }
      catch(err) {
        await req.redis.set(`session:${sessionId}:is_active`, true);
        throw err;
      }
    }

    res.status(204);
    res.end();
  }
  catch(err) {
    res.status(500);
    res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': err});
  }
};

module.exports.update = async function(req, res, next) {
  try {
    let sessionId          = req.params.session_id;
    let time               = req.body.time;
    let address            = req.body.address;
    let ticketSellTimeOpen = req.body.ticket_sell_time_open;
    let ticketSellTimeEnd  = req.body.ticket_sell_time_end;
    let maxSeats           = req.body.max_seats;
    let price              = req.body.price;
    let userId             = req.user_id;
    let role               = req.role;

    if(!sessionId || !time || !address || !ticketSellTimeOpen || !ticketSellTimeEnd || !maxSeats || !price) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['session_id', 'time', 'address', 'ticket_sell_time_open', 'ticket_sell_time_end', 'max_seats', 'price'], 'error_msg': 'Missing one or more required parameters.'});
    }

    time               = new Date(time);
    ticketSellTimeOpen = new Date(ticketSellTimeOpen);
    ticketSellTimeEnd  = new Date(ticketSellTimeEnd);

    if(address.length > 64 || time.toString() === 'Invalid Date' || ticketSellTimeOpen.toString() === 'Invalid Date' || ticketSellTimeEnd.toString() === 'Invalid Date' || maxSeats < 0 || price < 0) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['session_id', 'time', 'address', 'ticket_sell_time_open', 'ticket_sell_time_end', 'max_seats', 'price'], 'error_msg': 'One or more parameters contain incorrect values.'});
    }

    let Session = sessionModel(req.mysql);

    let session = await Session.get(sessionId);
    if(Object.keys(session).length === 0) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['session_id'], 'error_msg': 'Fail to locate the session from the database.'});
    }

    if(userId !== session.creator_uid && role !== 1) {
      res.status(403);
      return res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': 'No permission to update the session.'});
    }

    if(session.is_active) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['is_active'], 'error_msg': 'Unable to update the active session. Please deactivate it first.'});
    }

    // TODO: check session time is between event period
    // TODO: check the total number of ticket sold out before reducing the maxSeats

    let result = await Session.update(sessionId, time, address, ticketSellTimeOpen, ticketSellTimeEnd, maxSeats, price);
    if(result.affectedRows === 0)
      throw 'Fail to update the session in the database.';

    res.status(204);
    res.end();
  }
  catch(err) {
    res.status(500);
    res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': err});
  }
};

module.exports.delete = async function(req, res, next) {
  try {
    let sessionId = req.params.session_id;
    let userId    = req.user_id;
    let role      = req.role;

    if(!sessionId) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['session_id'], 'error_msg': 'Missing one or more required parameters.'});
    }

    let Session = sessionModel(req.mysql);

    let session = await Session.get(sessionId);
    if(Object.keys(session).length === 0) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['session_id'], 'error_msg': 'Fail to locate the session from the database.'});
    }

    if(userId !== session.creator_uid && role !== 1) {
      res.status(403);
      return res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': 'No permission to delete the session.'});
    }

    if(session.is_active) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['is_active'], 'error_msg': 'Unable to delete the active session. Please deactivate it first.'});
    }

    let Ticket = ticketModel(req.mysql);

    let tickets = await Ticket.getAllBySessionId(sessionId);
    if(tickets.length > 0) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': 'One or more tickets exist under current session. Cannot delete the session.'});
    }

    let result = await Session.delete(sessionId);
    if(result.affectedRows === 0)
      throw 'Fail to delete the session from the database.';

    res.status(204);
    res.end();
  }
  catch(err) {
    res.status(500);
    res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': err});
  }
};
