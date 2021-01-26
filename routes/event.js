const express = require('express');
const router = express.Router();

const authentication = require(__projdir + '/middlewares/authentication');
const authorization = require(__projdir + '/middlewares/authorization');

const eventController = require(__projdir + '/controllers/event');

router.get('/', eventController.getMultipleByConstraints);

router.get('/:event_id', eventController.getById);

router.get('/creator/:creator_uid', eventController.getMultipleByCreator);

router.post('/', authentication(), authorization(roles = [1, 2]), eventController.create);

router.put('/:event_id', authentication(), authorization(roles = [1, 2]), eventController.update);

router.delete('/:event_id', authentication(), authorization(roles = [1, 2]), eventController.delete);

module.exports = router;
