const sessionModel = require(__projdir + '/models/session');
const ticketModel = require(__projdir + '/models/ticket');

module.exports.getAllBySessionId = async function(req, res, next) {
  try {
    let sessionId = req.query.session_id;

    if(!sessionId) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['session_id'], 'error_msg': 'Missing one or more required parameters.'});
    }

    let Ticket = ticketModel(req.mysql);

    let tickets = await Ticket.getAllBySessionId(sessionId);
    res.json({'successful': true, 'data': tickets, 'error_field': [], 'error_msg': ''});
  }
  catch(err) {
    res.status(500);
    res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
  }
};

module.exports.getById = async function(req, res, next) {
  try {
    let ticketId = req.params.ticket_id;

    if(!ticketId) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['ticket_id'], 'error_msg': 'Missing one or more required parameters.'});
    }

    let Ticket = ticketModel(req.mysql);

    let ticket = await Ticket.get(ticketId);
    res.json({'successful': true, 'data': ticket, 'error_field': [], 'error_msg': ''});
  }
  catch(err) {
    res.status(500);
    res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
  }
};

module.exports.create = async function(req, res, next) {
  try {
    let sessionId = req.query.session_id;
    let seatNo    = req.body.seat_no;
    let userId    = req.user_id;

    if(!sessionId || !seatNo) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['session_id', 'seat_no'], 'error_msg': 'Missing one or more required parameters.'});
    }

    let timeOpen = await req.redis.get(`session:${sessionId}:ticket_sell_time_open`);
    let timeEnd  = await req.redis.get(`session:${sessionId}:ticket_sell_time_end`);

    if(!timeOpen || !timeEnd) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': 'Not available yet.'});
    }

    let now   = new Date();
    timeOpen = new Date(timeOpen);
    timeEnd  = new Date(timeEnd);

    if(now < timeOpen || now > timeEnd) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': 'Not booking time yet.'});
    }

    let seats = await req.redis.decr(`session:${sessionId}:open_seats`);
    if(seats < 0) {
      await req.redis.set(`session:${sessionId}:open_seats`, 0);
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': 'No tickets currently available.'});
    }

    // let Session = sessionModel(req.mysql);

    // let session = await Session.get(sessionId);
    // if(Object.keys(session).length === 0)
    //   throw 'Fail to locate the session from the database.';

    // if(seatNo <= 0 || seatNo > session.max_seats) {
    //   res.status(400);
    //   return res.json({'successful': false, 'data': {}, 'error_field': ['seat_no'], 'error_msg': 'One or more parameters contain incorrect values.'});
    // }

    let Ticket = ticketModel(req.mysql);

    let result = await Ticket.create(userId, sessionId, seatNo);
    if(result.affectedRows === 0) {
      throw 'Fail to create the ticket.';
    }

    res.status(201);
    res.json({'successful': true, 'data': {'id': result.insertId}, 'error_field': [], 'error_msg': ''});
  }
  catch(err) {
    await req.redis.incr(`session:${sessionId}:open_seats`); // TODO: sessionId not defined
    if(err.code === 'ER_DUP_ENTRY') {
      res.status(409);
      res.json({'successful': false, 'data': {}, 'error_field': ['seat_no'], 'error_msg': 'This seat has already been occupied. Choose another one.'});
    }
    else {
      res.status(500);
      res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
    }
  }
};

module.exports.update = async function(req, res, next) {
  try {
    let ticketId = req.params.ticket_id;
    let seatNo   = req.body.seat_no;
    let userId   = req.user_id;
    let role     = req.role;

    if(!ticketId || !seatNo) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['ticket_id', 'seat_no'], 'error_msg': 'Missing one or more required parameters.'});
    }

    let Ticket = ticketModel(req.mysql);

    let ticket = await Ticket.get(ticketId);
    if(Object.keys(ticket).length === 0)
      throw 'Fail to locate the ticket from the database.';

    let Session = sessionModel(req.mysql);

    let session = await Session.get(ticket.session_id);

    if(userId !== ticket.user_id && userId !== session.creator_uid && role !== 1) {
      res.status(403);
      return res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': 'No permission to update the ticket.'});
    }

    if(!session.is_active && userId !== session.creator_uid && role !== 1) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['is_active'], 'error_msg': 'Unable to update the ticket. This session is inactive currently.'});
    }

    // TODO: check session time is between event period

    if(seatNo <= 0 || seatNo > session.max_seats) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['seat_no'], 'error_msg': 'One or more parameters contain incorrect values.'});
    }

    let result = await Ticket.update(ticketId, seatNo);
    if(result.affectedRows === 0)
      throw 'Fail to update the ticket in the database.';

    res.status(204);
    return res.end();
  }
  catch(err) {
    if(err.code === 'ER_DUP_ENTRY') {
      res.status(409);
      res.json({'successful': false, 'data': {}, 'error_field': ['seat_no'], 'error_msg': 'This seat has already been occupied. Choose another one.'});
    }
    else {
      res.status(500);
      res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
    }
  }
};

module.exports.delete = async function(req, res, next) {
  try {
    let ticketId = req.params.ticket_id;
    let userId   = req.user_id;
    let role     = req.role;

    if(!ticketId) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['ticket_id'], 'error_msg': 'Missing one or more required parameters.'});
    }

    let Ticket = ticketModel(req.mysql);

    let ticket = await Ticket.get(ticketId);
    if(Object.keys(ticket).length === 0)
      throw 'Fail to locate the ticket from the database.';

    let Session = sessionModel(req.mysql);

    let session = await Session.get(ticket.session_id);

    if(userId !== ticket.user_id && userId !== session.creator_uid && role !== 1) {
      res.status(403);
      return res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': 'No permission to update the ticket.'});
    }

    if(!session.is_active && userId !== session.creator_uid && role !== 1) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['is_active'], 'error_msg': 'Unable to delete the ticket. This session is inactive currently.'});
    }

    // TODO: check session time is between event period

    let result = await Ticket.delete(ticketId);
    if(result.affectedRows === 0)
      throw 'Fail to delete the ticket from the database.';

    let value = await req.redis.get(`session:${ticket.session_id}:open_seats`);
    if(value)
      await req.redis.incr(`session:${ticket.session_id}:open_seats`);

    res.status(204);
    return res.end();
  }
  catch(err) {
    res.status(500);
    res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': err});
  }
};
