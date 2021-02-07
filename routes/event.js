const express = require('express');

const router = express.Router();

const authentication = require('@middlewares/authentication');
const authorization = require('@middlewares/authorization');

const eventController = require('@controllers/event');

router.get('/', eventController.getMultipleByConstraints);

router.get('/:event_id', eventController.getById);

router.get('/creator/:creator_uid', eventController.getMultipleByCreator);

router.post('/', authentication(), authorization([1, 2]), eventController.create);

router.put('/:event_id', authentication(), authorization([1, 2]), eventController.update);

router.delete('/:event_id', authentication(), authorization([1, 2]), eventController.delete);

module.exports = router;
