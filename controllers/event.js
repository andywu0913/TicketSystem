const eventModel = require(__projdir + '/models/event');
const sessionModel = require(__projdir + '/models/session');

module.exports.getMultipleByConstraints = async function(req, res, next) {
  try {
    let startId   = req.query.start_id || null;
    let rowCounts = req.query.row_counts || 10;

    if(isNaN(rowCounts)) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['row_counts'], 'error_msg': 'One or more fields contain incorrect values.'});
    }

    let Event = eventModel(req.mysql);

    let events = await Event.getMultiple(startId, parseInt(rowCounts));
    res.json({'successful': true, 'data': events, 'error_field': [], 'error_msg': ''});
  }
  catch(err) {
    res.status(500);
    res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': err});
  }
};

module.exports.getMultipleByCreator = async function(req, res, next) {
  try {
    let creator = req.params.creator_uid;

    if(isNaN(creator)) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['creator_uid'], 'error_msg': 'One or more fields contain incorrect values.'});
    }

    let Event = eventModel(req.mysql);

    let events = await Event.getMultipleByCreator(creator);
    res.json({'successful': true, 'data': events, 'error_field': [], 'error_msg': ''});
  }
  catch(err) {
    res.status(500);
    res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': err});
  }
};

module.exports.getById = async function(req, res, next) {
  try {
    let eventId = req.params.event_id;

    if(!eventId) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['event_id'], 'error_msg': 'Missing one or more required parameters.'});
    }

    let Event = eventModel(req.mysql);

    let event = await Event.get(eventId);
    res.json({'successful': true, 'data': event, 'error_field': [], 'error_msg': ''});
  }
  catch(err) {
    res.status(500);
    res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
  }
};

module.exports.create = async function(req, res, next) {
  try {
    let name        = req.body.name;
    let description = req.body.description;
    let startDate   = req.body.start_date;
    let endDate     = req.body.end_date;
    let userId      = req.user_id;

    if(!name || !description || !startDate || !endDate) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['name', 'description', 'start_date', 'end_date'], 'error_msg': 'Missing one or more required parameters.'});
    }

    startDate = new Date(startDate);
    endDate   = new Date(endDate);

    if(name.length > 50 || startDate.toString() === 'Invalid Date' || endDate.toString() === 'Invalid Date') {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['name', 'description', 'start_date', 'end_date'], 'error_msg': 'One or more parameters contain incorrect values.'});
    }

    let Event = eventModel(req.mysql);

    let result = await Event.create(name, description, startDate, endDate, userId);
    if(result.affectedRows === 0)
      throw 'Fail to create the event.';

    res.status(201);
    res.json({'successful': true, 'data': {'id': result.insertId}, 'error_field': [], 'error_msg': ''});
  }
  catch(err) {
    res.status(500);
    res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
  }
};

module.exports.update = async function(req, res, next) {
  try {
    let eventId     = req.params.event_id;
    let name        = req.body.name;
    let description = req.body.description;
    let startDate   = req.body.start_date;
    let endDate     = req.body.end_date;
    let userId      = req.user_id;
    let role        = req.role;

    if(!eventId || !name || !description || !startDate || !endDate) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['event_id', 'name', 'description', 'start_date', 'end_date'], 'error_msg': 'Missing one or more required parameters.'});
    }

    startDate = new Date(startDate);
    endDate   = new Date(endDate);

    if(name.length > 50 || startDate.toString() === 'Invalid Date' || endDate.toString() === 'Invalid Date') {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['name', 'start_date', 'end_date'], 'error_msg': 'One or more parameters contain incorrect values.'});
    }

    let Event = eventModel(req.mysql);

    let event = await Event.get(eventId);
    if(Object.keys(event).length === 0)
      throw 'Fail to locate the event from the database.';

    if(userId !== event.creator_uid && role !== 1) {
      res.status(403);
      return res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': 'No permission to update the event.'});
    }

    let result = await Event.update(eventId, name, description, startDate, endDate);
    if(result.affectedRows === 0)
      throw 'Fail to update the event in the database.';

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
    let eventId  = req.params.event_id;
    let userId   = req.user_id;
    let role     = req.role;

    if(!eventId) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['event_id'], 'error_msg': 'Missing one or more required parameters.'});
    }

    let Event = eventModel(req.mysql);

    let event = await Event.get(eventId);
    if(Object.keys(event).length === 0)
      throw 'Fail to locate the event from the database.';

    if(userId !== event.creator_uid && role !== 1) {
      res.status(403);
      return res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': 'No permission to delete the event.'});
    }

    let Session = sessionModel(req.mysql);

    let session = await Session.getAllByEventId(eventId);
    if(session.length > 0) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': 'One or more sessions exist under current event. Delete those sessions first.'});
    }

    let result = await Event.delete(eventId);
    if(result.affectedRows === 0)
      throw 'Fail to delete the event from the database.';

    res.status(204);
    res.end();
  }
  catch(err) {
    res.status(500);
    res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': err});
  }
};
