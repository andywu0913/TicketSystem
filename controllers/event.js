var eventModel = require(__projdir + '/models/event');
var sessionModel = require(__projdir + '/models/session');

module.exports.findAll = async function(req, res, next) {
  try {
    let start_id   = req.query.start_id || null;
    let row_counts = req.query.row_counts || 10;

    if(isNaN(row_counts)) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['row_counts'], 'error_msg': 'One or more fields contain incorrect values.'});
    }

    var events = await eventModel.getMultiple(start_id, parseInt(row_counts));
    res.json({'successful': true, 'data': events, 'error_field': [], 'error_msg': ''});
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': err});
  }
};

module.exports.find = async function(req, res, next) {
  try {
    var event_id = req.params.event_id;

    if(!event_id) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['event_id'], 'error_msg': 'Missing one or more required parameters.'});
    }

    var event = await eventModel.getSingle(event_id);
    res.json({'successful': true, 'data': event, 'error_field': [], 'error_msg': ''});
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
  }
};

module.exports.create = async function(req, res, next) {
  try {
    var name        = req.body.name;
    var description = req.body.description;
    var start_date  = req.body.start_date;
    var end_date    = req.body.end_date;
    var user_id     = req.user_id;

    if(!name || !description || !start_date || !end_date) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['name', 'description', 'start_date', 'end_date'], 'error_msg': 'Missing one or more required parameters.'});
    }

    start_date = new Date(start_date);
    end_date   = new Date(end_date);

    if(name.length > 50 || start_date.toString() === 'Invalid Date' || end_date.toString() === 'Invalid Date') {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['name', 'start_date', 'end_date'], 'error_msg': 'One or more parameters contain incorrect values.'});
    }

    var result = await eventModel.create(name, description, start_date, end_date, user_id);
    if(result.affectedRows === 0)
      throw 'Fail to create the event.';

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
    var event_id    = req.params.event_id;
    var name        = req.body.name;
    var description = req.body.description;
    var start_date  = req.body.start_date;
    var end_date    = req.body.end_date;
    var user_id     = req.user_id;
    var role        = req.role;

    if(!event_id || !name || !description || !start_date || !end_date) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['event_id', 'name', 'description', 'start_date', 'end_date'], 'error_msg': 'Missing one or more required parameters.'});
    }

    start_date = new Date(start_date);
    end_date   = new Date(end_date);

    if(name.length > 50 || start_date.toString() === 'Invalid Date' || end_date.toString() === 'Invalid Date') {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['name', 'start_date', 'end_date'], 'error_msg': 'One or more parameters contain incorrect values.'});
    }

    var event = await eventModel.getSingle(event_id);
    if(Object.keys(event).length === 0)
      throw 'Fail to locate the event from the database.';

    if(user_id !== event.creator_uid && role !== 1) {
      res.status(403);
      return res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': 'No permission to update the event.'});
    }

    var result = await eventModel.update(event_id, name, description, start_date, end_date);
    if(result.affectedRows === 0)
      throw 'Fail to update the event in the database.';

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
    var event_id = req.params.event_id;
    var user_id  = req.user_id;
    var role     = req.role;

    if(!event_id) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['event_id'], 'error_msg': 'Missing one or more required parameters.'});
    }

    var event = await eventModel.getSingle(event_id);
    if(Object.keys(event).length === 0)
      throw 'Fail to locate the event from the database.';

    if(user_id !== event.creator_uid && role !== 1) {
      res.status(403);
      return res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': 'No permission to delete the event.'});
    }

    var session = await sessionModel.getAllByEventId(event_id);
    if(session.length > 0) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': 'One or more sessions exist under current event.\nDelete those sessions first.'});
    }

    var result = await eventModel.delete(event_id);
    if(result.affectedRows === 0)
      throw 'Fail to delete the event from the database.';

    res.status(204);
    return res.end();
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': err});
  }
};
