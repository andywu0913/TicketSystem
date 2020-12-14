var express = require('express');
var authentication = require(__projdir + '/middlewares/authentication');
var authorization = require(__projdir + '/middlewares/authorization');
var eventModel = require(__projdir + '/models/event');
var sessionModel = require(__projdir + '/models/session');
var router = express.Router();

router.get('/', async function(req, res, next) {
  try {
    var event_id = req.query.event_id;

    if(!event_id) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['event_id'], 'error_msg': 'Missing one or more required parameters.'});
    }

    var event = await sessionModel.getAllByEventId(event_id);
    res.json({'successful': true, 'data': event, 'error_field': [], 'error_msg': ''});
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
  }
});

router.post('/', authentication, authorization(roles = [1, 2]), async function(req, res, next) {
  try {
    var event_id              = req.query.event_id;
    var time                  = req.body.time;
    var address               = req.body.address;
    var ticket_sell_time_open = req.body.ticket_sell_time_open;
    var ticket_sell_time_end  = req.body.ticket_sell_time_end;
    var max_seats             = req.body.max_seats;
    var price                 = req.body.price;
    var user_id               = req.session.user_id;
    var role                  = req.session.role;

    if(!event_id || !time || !address || !ticket_sell_time_open || !ticket_sell_time_end || !max_seats || !price) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['event_id', 'time', 'address', 'ticket_sell_time_open', 'ticket_sell_time_end', 'max_seats', 'price'], 'error_msg': 'Missing one or more required parameters.'});
    }

    time                  = new Date(time);
    ticket_sell_time_open = new Date(ticket_sell_time_open);
    ticket_sell_time_end  = new Date(ticket_sell_time_end);

    if(address.length > 64 || time.toString() === 'Invalid Date' || ticket_sell_time_open.toString() === 'Invalid Date'|| ticket_sell_time_end.toString() === 'Invalid Date' || max_seats < 0 || price < 0) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['event_id', 'time', 'address', 'ticket_sell_time_open', 'ticket_sell_time_end', 'max_seats', 'price'], 'error_msg': 'One or more parameters contain incorrect values.'});
    }

    var event = await eventModel.getSingle(event_id);
    if(Object.keys(event).length === 0)
      throw 'Fail to locate the event from the database.';

    if(user_id !== event.creator_uid && role !== 1) {
      res.status(403);
      return res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': 'No permission to create the session under this event.'});
    }

    var result = await sessionModel.create(event_id, time, address, ticket_sell_time_open, ticket_sell_time_end, max_seats, price);
    if(result.affectedRows === 0)
      throw 'Fail to create the session.';

    res.status(201);
    res.json({'successful': true, 'data': {'id': result.insertId}, 'error_field': [], 'error_msg': ''});
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
  }
});

router.put('/:session_id', authentication, authorization(roles = [1, 2]), async function(req, res, next) {
  try {
    var session_id            = req.params.session_id;
    var time                  = req.body.time;
    var address               = req.body.address;
    var ticket_sell_time_open = req.body.ticket_sell_time_open;
    var ticket_sell_time_end  = req.body.ticket_sell_time_end;
    var max_seats             = req.body.max_seats;
    var price                 = req.body.price;
    var user_id               = req.session.user_id;
    var role                  = req.session.role;

    if(!session_id || !time || !address || !ticket_sell_time_open || !ticket_sell_time_end || !max_seats || !price) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['session_id', 'time', 'address', 'ticket_sell_time_open', 'ticket_sell_time_end', 'max_seats', 'price'], 'error_msg': 'Missing one or more required parameters.'});
    }

    time                  = new Date(time);
    ticket_sell_time_open = new Date(ticket_sell_time_open);
    ticket_sell_time_end  = new Date(ticket_sell_time_end);

    if(address.length > 64 || time.toString() === 'Invalid Date' || ticket_sell_time_open.toString() === 'Invalid Date'|| ticket_sell_time_end.toString() === 'Invalid Date' || max_seats < 0 || price < 0) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['session_id', 'time', 'address', 'ticket_sell_time_open', 'ticket_sell_time_end', 'max_seats', 'price'], 'error_msg': 'One or more parameters contain incorrect values.'});
    }

    var session = await sessionModel.getSingle(session_id);
    if(Object.keys(session).length === 0)
      throw 'Fail to locate the session from the database.';

    if(user_id !== session.creator_uid && role !== 1) {
      res.status(403);
      return res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': 'No permission to update the session.'});
    }

    // TODO: check the total number of ticket sold out before reducing the max_seats

    var result = await sessionModel.update(session_id, time, address, ticket_sell_time_open, ticket_sell_time_end, max_seats, price);
    if(result.affectedRows === 0)
      throw 'Fail to update the session in the database.';

    res.status(204);
    return res.end();
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': err});
  }
});

router.delete('/:session_id', authentication, authorization(roles = [1, 2]), async function(req, res, next) {
  try {
    var session_id = req.params.session_id;
    var user_id    = req.session.user_id;
    var role       = req.session.role;

    if(!session_id) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['session_id'], 'error_msg': 'Missing one or more required parameters.'});
    }

    var session = await sessionModel.getSingle(session_id);
    if(Object.keys(session).length === 0)
      throw 'Fail to locate the session from the database.';

    if(user_id !== session.creator_uid && role !== 1) {
      res.status(403);
      return res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': 'No permission to delete the session.'});
    }

    // TODO: check the tickets sold out before deleting the max_seats

    var result = await sessionModel.delete(session_id);
    if(result.affectedRows === 0)
      throw 'Fail to delete the session from the database.';

    res.status(204);
    return res.end();
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': err});
  }
});

module.exports = router;
