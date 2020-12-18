var eventModel = require(__projdir + '/models/event');
var sessionModel = require(__projdir + '/models/session');

module.exports.find = async function(req, res, next) {
  try {
    var eventId = req.query.event_id;

    if(!eventId) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['event_id'], 'error_msg': 'Missing one or more required parameters.'});
    }

    var Session = sessionModel(req.mysql);

    var event = await Session.getAllByEventId(eventId);
    res.json({'successful': true, 'data': event, 'error_field': [], 'error_msg': ''});
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
  }
};

module.exports.create = async function(req, res, next) {
  try {
    var eventId            = req.query.event_id;
    var time               = req.body.time;
    var address            = req.body.address;
    var ticketSellTimeOpen = req.body.ticket_sell_time_open;
    var ticketSellTimeEnd  = req.body.ticket_sell_time_end;
    var maxSeats           = req.body.max_seats;
    var price              = req.body.price;
    var userId             = req.user_id;
    var role               = req.role;

    if(!eventId || !time || !address || !ticketSellTimeOpen || !ticketSellTimeEnd || !maxSeats || !price) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['event_id', 'time', 'address', 'ticket_sell_time_open', 'ticket_sell_time_end', 'max_seats', 'price'], 'error_msg': 'Missing one or more required parameters.'});
    }

    time               = new Date(time);
    ticketSellTimeOpen = new Date(ticketSellTimeOpen);
    ticketSellTimeEnd  = new Date(ticketSellTimeEnd);

    if(address.length > 64 || time.toString() === 'Invalid Date' || ticketSellTimeOpen.toString() === 'Invalid Date'|| ticketSellTimeEnd.toString() === 'Invalid Date' || maxSeats < 0 || price < 0) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['event_id', 'time', 'address', 'ticket_sell_time_open', 'ticket_sell_time_end', 'max_seats', 'price'], 'error_msg': 'One or more parameters contain incorrect values.'});
    }

    var Event = eventModel(req.mysql);

    var event = await Event.get(eventId);
    if(Object.keys(event).length === 0)
      throw 'Fail to locate the event from the database.';

    if(userId !== event.creator_uid && role !== 1) {
      res.status(403);
      return res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': 'No permission to create the session under this event.'});
    }

    var Session = sessionModel(req.mysql);

    var result = await Session.create(eventId, time, address, ticketSellTimeOpen, ticketSellTimeEnd, maxSeats, price);
    if(result.affectedRows === 0)
      throw 'Fail to create the session.';

    res.status(201);
    res.json({'successful': true, 'data': {'id': result.insertId}, 'error_field': [], 'error_msg': ''});
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
  }
};

module.exports.update = async function(req, res, next) {
  try {
    var sessionId          = req.params.session_id;
    var time               = req.body.time;
    var address            = req.body.address;
    var ticketSellTimeOpen = req.body.ticket_sell_time_open;
    var ticketSellTimeEnd  = req.body.ticket_sell_time_end;
    var maxSeats           = req.body.max_seats;
    var price              = req.body.price;
    var userId             = req.user_id;
    var role               = req.role;

    if(!sessionId || !time || !address || !ticketSellTimeOpen || !ticketSellTimeEnd || !maxSeats || !price) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['session_id', 'time', 'address', 'ticket_sell_time_open', 'ticket_sell_time_end', 'max_seats', 'price'], 'error_msg': 'Missing one or more required parameters.'});
    }

    time               = new Date(time);
    ticketSellTimeOpen = new Date(ticketSellTimeOpen);
    ticketSellTimeEnd  = new Date(ticketSellTimeEnd);

    if(address.length > 64 || time.toString() === 'Invalid Date' || ticketSellTimeOpen.toString() === 'Invalid Date'|| ticketSellTimeEnd.toString() === 'Invalid Date' || maxSeats < 0 || price < 0) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['session_id', 'time', 'address', 'ticket_sell_time_open', 'ticket_sell_time_end', 'max_seats', 'price'], 'error_msg': 'One or more parameters contain incorrect values.'});
    }

    var Session = sessionModel(req.mysql);

    var session = await Session.get(sessionId);
    if(Object.keys(session).length === 0)
      throw 'Fail to locate the session from the database.';

    if(userId !== session.creator_uid && role !== 1) {
      res.status(403);
      return res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': 'No permission to update the session.'});
    }

    // TODO: check the total number of ticket sold out before reducing the maxSeats

    var result = await Session.update(sessionId, time, address, ticketSellTimeOpen, ticketSellTimeEnd, maxSeats, price);
    if(result.affectedRows === 0)
      throw 'Fail to update the session in the database.';

    res.status(204);
    return res.end();
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': err});
  }
};

module.exports.delete = async function(req, res, next) {
  try {
    var sessionId = req.params.session_id;
    var userId    = req.user_id;
    var role      = req.role;

    if(!sessionId) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['session_id'], 'error_msg': 'Missing one or more required parameters.'});
    }

    var Session = sessionModel(req.mysql);

    var session = await Session.get(sessionId);
    if(Object.keys(session).length === 0)
      throw 'Fail to locate the session from the database.';

    if(userId !== session.creator_uid && role !== 1) {
      res.status(403);
      return res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': 'No permission to delete the session.'});
    }

    // TODO: check the tickets sold out before deleting the maxSeats

    var result = await Session.delete(sessionId);
    if(result.affectedRows === 0)
      throw 'Fail to delete the session from the database.';

    res.status(204);
    return res.end();
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': err});
  }
};