const EventModel = require('@models/event');
const SessionModel = require('@models/session');

const Errors = require('@utils/Errors');
const ReturnCode = require('@utils/ReturnCode');
const ReturnObject = require('@utils/ReturnObject');

module.exports.getMultipleByConstraints = async function(req, res) {
  const returnObject = new ReturnObject([]);
  try {
    const { start_id: startId, row_counts: rowCounts = 10 } = req.query;

    if (!/^\d+$/.test(rowCounts)) {
      throw new Errors.BadRequestError('One or more fields contain incorrect values.', ['row_counts']);
    }

    const Event = EventModel(req.mysql);

    const events = await Event.getMultiple(startId, rowCounts);

    returnObject.setData(events);
    res.status(ReturnCode.OK).json(returnObject);
  } catch (err) {
    returnObject.setError(err.message, err.fields);
    res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};

module.exports.getMultipleByCreator = async function(req, res) {
  const returnObject = new ReturnObject([]);
  try {
    const { creator_uid: creator } = req.params;

    if (!creator) {
      throw new Errors.BadRequestError('Missing one or more required parameters.', ['creator_uid']);
    }

    const Event = EventModel(req.mysql);

    const events = await Event.getMultipleByCreator(creator);

    returnObject.setData(events);
    res.status(ReturnCode.OK).json(returnObject);
  } catch (err) {
    returnObject.setError(err.message, err.fields);
    res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};

module.exports.getById = async function(req, res) {
  const returnObject = new ReturnObject({});
  try {
    const { event_id: eventId } = req.params;

    if (!eventId) {
      throw new Errors.BadRequestError('Missing one or more required parameters.', ['event_id']);
    }

    const Event = EventModel(req.mysql);

    const event = await Event.get(eventId);

    returnObject.setData(event);
    res.status(ReturnCode.OK).json(returnObject);
  } catch (err) {
    returnObject.setError(err.message, err.fields);
    res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};

module.exports.create = async function(req, res) {
  const returnObject = new ReturnObject({});
  try {
    const { name, description } = req.body;
    let { start_date: startDate, end_date: endDate } = req.body;
    const userId = req.user_id;

    if (!name || !description || !startDate || !endDate) {
      throw new Errors.BadRequestError('Missing one or more required parameters.', ['name', 'description', 'start_date', 'end_date']);
    }

    startDate = new Date(startDate);
    endDate = new Date(endDate);

    if (name.length > 50 || startDate.toString() === 'Invalid Date' || endDate.toString() === 'Invalid Date') {
      throw new Errors.BadRequestError('One or more parameters contain incorrect values.', ['name', 'description', 'start_date', 'end_date']);
    }

    const Event = EventModel(req.mysql);

    const result = await Event.create(name, description, startDate, endDate, userId);
    if (result.affectedRows === 0) {
      throw new Errors.InternalServerError('Fail to create the event.');
    }

    returnObject.setData({ id: result.insertId });
    res.status(ReturnCode.CREATED).json(returnObject);
  } catch (err) {
    returnObject.setError(err.message, err.fields);
    res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};

module.exports.update = async function(req, res) {
  const returnObject = new ReturnObject({});
  try {
    const { event_id: eventId } = req.params;
    const { name, description } = req.body;
    let { start_date: startDate, end_date: endDate } = req.body;
    const { user_id: userId, role } = req;

    if (!eventId || !name || !description || !startDate || !endDate) {
      throw new Errors.BadRequestError('Missing one or more required parameters.', ['event_id', 'name', 'description', 'start_date', 'end_date']);
    }

    startDate = new Date(startDate);
    endDate = new Date(endDate);

    if (name.length > 50 || startDate.toString() === 'Invalid Date' || endDate.toString() === 'Invalid Date') {
      throw new Errors.BadRequestError('One or more parameters contain incorrect values.', ['name', 'start_date', 'end_date']);
    }

    const Event = EventModel(req.mysql);

    const event = await Event.get(eventId);
    if (Object.keys(event).length === 0) {
      throw new Errors.BadRequestError('Fail to locate the event from the database.', ['event_id']);
    }

    if (userId !== event.creator_uid && role !== 1) {
      throw new Errors.ForbiddenError('No permission to update the event.');
    }

    const result = await Event.update(eventId, name, description, startDate, endDate);
    if (result.affectedRows === 0) {
      throw new Errors.InternalServerError('Fail to update the event in the database.');
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
    const { event_id: eventId } = req.params;
    const { user_id: userId, role } = req;

    if (!eventId) {
      throw new Errors.BadRequestError('Missing one or more required parameters.', ['event_id']);
    }

    const Event = EventModel(req.mysql);

    const event = await Event.get(eventId);
    if (Object.keys(event).length === 0) {
      throw new Errors.BadRequestError('Fail to locate the event from the database.', ['event_id']);
    }

    if (userId !== event.creator_uid && role !== 1) {
      throw new Errors.ForbiddenError('No permission to delete the event.');
    }

    const Session = SessionModel(req.mysql);

    const session = await Session.getAllByEventId(eventId);
    if (session.length > 0) {
      throw new Errors.BadRequestError('One or more sessions exist under current event. Delete those sessions first.');
    }

    const result = await Event.delete(eventId);
    if (result.affectedRows === 0) {
      throw new Errors.InternalServerError('Fail to delete the event from the database.');
    }

    res.status(ReturnCode.NO_CONTENT).end();
  } catch (err) {
    returnObject.setError(err.message, err.fields);
    res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};
