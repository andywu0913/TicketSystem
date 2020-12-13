var express = require('express');
var eventModel = require(__projdir + '/models/event');
var router = express.Router();

router.get('/', async function(req, res, next) {
  try {
    let start_id   = req.query.start_id || null;
    let row_counts = req.query.row_counts || 10;

    var events = await eventModel.getMultiple(start_id, parseInt(row_counts));
    res.json({'successful': true, 'data': events, 'error_field': [], 'error_msg': ''});
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': err});
  }
});

router.get('/:event_id', async function(req, res, next) {
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
});

// Login required for the operations below
router.use(function (req, res, next) {
  var user_id = req.session.user_id;
  if(!user_id) {
    res.status(401);
    return res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': '401 Unauthorized.'});
  }
  next();
});

// User role: (Admin or Host) is required for the functions below
router.use(function (req, res, next) {
  var role = req.session.role || 99;
  if(role > 2){
    res.status(403);
    return res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': '403 Forbidden.'});
  }
  next();
});

router.post('/', async function(req, res, next) {
  try {
    var name        = req.body.name;
    var description = req.body.description;
    var user_id     = req.session.user_id;

    if(!name || !description) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['name', 'description'], 'error_msg': 'Missing one or more required parameters.'});
    }

    var result = await eventModel.create(name, description, user_id);
    if(result.affectedRows === 0)
      throw 'Fail to create the event.';

    res.status(201);
    res.json({'successful': true, 'data': {'id': result.insertId, 'name': name, 'description': description}, 'error_field': [], 'error_msg': ''});
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
  }
});

router.put('/', async function(req, res, next) {
  try {
    var event_id    = req.body.event_id;
    var name        = req.body.name;
    var description = req.body.description;
    var user_id     = req.session.user_id;
    var role        = req.session.role;

    if(!event_id || !name || !description) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['event_id', 'name', 'description'], 'error_msg': 'Missing one or more required parameters.'});
    }

    var event = await eventModel.getSingle(event_id);
    if(Object.keys(event).length === 0)
      throw 'Fail to locate the event from the database.';

    if(user_id !== event.creator_uid && role !== 1) {
      res.status(403);
      return res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': 'No permission to update the event.'});
    }

    var result = await eventModel.update(event_id, name, description);
    if(result.affectedRows === 0)
      throw 'Fail to update the event in the database.';

    res.status(204);
    return res.end();
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': err});
  }
});

router.delete('/', async function(req, res, next) {
  try {
    var event_id = req.body.event_id;
    var user_id  = req.session.user_id;
    var role     = req.session.role;

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
});

module.exports = router;
