var sessionModel = require(__projdir + '/models/session');
var ticketModel = require(__projdir + '/models/ticket');

module.exports.getAllBySessionId = async function(req, res, next) {
  try {
    var sessionId = req.query.session_id;

    if(!sessionId) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['session_id'], 'error_msg': 'Missing one or more required parameters.'});
    }

    var Ticket = ticketModel(req.mysql);

    var tickets = await Ticket.getAllBySessionId(sessionId);
    res.json({'successful': true, 'data': tickets, 'error_field': [], 'error_msg': ''});
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
  }
};

module.exports.getById = async function(req, res, next) {
  try {
    var ticketId = req.params.ticket_id;

    if(!ticketId) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['ticket_id'], 'error_msg': 'Missing one or more required parameters.'});
    }

    var Ticket = ticketModel(req.mysql);

    var ticket = await Ticket.get(ticketId);
    res.json({'successful': true, 'data': ticket, 'error_field': [], 'error_msg': ''});
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
  }
};

module.exports.create = async function(req, res, next) {
  try {
    var sessionId = req.query.session_id;
    var seatNo    = req.body.seat_no;
    var userId    = req.user_id;

    if(!sessionId || !seatNo) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['session_id', 'seat_no'], 'error_msg': 'Missing one or more required parameters.'});
    }

    // check session start selling time and Redis DECR
    // if val < 0 return

    var Session = sessionModel(req.mysql);

    var session = await Session.get(sessionId);
    if(Object.keys(session).length === 0)
      throw 'Fail to locate the session from the database.';

    if(seatNo <= 0 || seatNo > session.max_seats) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['seat_no'], 'error_msg': 'One or more parameters contain incorrect values.'});
    }

    var Ticket = ticketModel(req.mysql);

    var count = await Ticket.countTicket(sessionId);
    if(count >= session.max_seats) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['seat_no'], 'error_msg': 'No more empty seats.'});
    }

    var result = await Ticket.create(userId, sessionId, seatNo);
    if(result.affectedRows === 0)
      throw 'Fail to create the ticket.';

    res.status(201);
    res.json({'successful': true, 'data': {'id': result.insertId}, 'error_field': [], 'error_msg': ''});
  }
  catch (err) {
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
    var ticketId = req.params.ticket_id;
    var seatNo   = req.body.seat_no;
    var userId   = req.user_id;
    var role     = req.role;

    if(!ticketId || !seatNo) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['ticket_id', 'seat_no'], 'error_msg': 'Missing one or more required parameters.'});
    }

    var Ticket = ticketModel(req.mysql);

    var ticket = await Ticket.get(ticketId);
    if(Object.keys(ticket).length === 0)
      throw 'Fail to locate the ticket from the database.';

    var Session = sessionModel(req.mysql);

    var session = await Session.get(ticket.session_id);

    if(userId !== ticket.user_id && userId != session.creator_uid && role !== 1) {
      res.status(403);
      return res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': 'No permission to update the ticket.'});
    }

    if(seatNo <= 0 || seatNo > session.max_seats) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['seat_no'], 'error_msg': 'One or more parameters contain incorrect values.'});
    }

    var result = await Ticket.update(ticketId, seatNo);
    if(result.affectedRows === 0)
      throw 'Fail to update the ticket in the database.';

    res.status(204);
    return res.end();
  }
  catch (err) {
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
    var ticketId = req.params.ticket_id;
    var userId   = req.user_id;
    var role     = req.role;

    if(!ticketId) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['ticket_id'], 'error_msg': 'Missing one or more required parameters.'});
    }

    var Ticket = ticketModel(req.mysql);

    var ticket = await Ticket.get(ticketId);
    if(Object.keys(ticket).length === 0)
      throw 'Fail to locate the ticket from the database.';

    if(userId !== ticket.user_id && userId != ticket.creator_uid && role !== 1) {
      res.status(403);
      return res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': 'No permission to update the ticket.'});
    }

    var result = await Ticket.delete(ticketId);
    if(result.affectedRows === 0)
      throw 'Fail to delete the ticket from the database.';

    // TODO: redis INCR

    res.status(204);
    return res.end();
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': err});
  }
};
