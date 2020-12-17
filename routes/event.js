var express = require('express');
var router = express.Router();

var authentication = require(__projdir + '/middlewares/authentication');
var authorization = require(__projdir + '/middlewares/authorization');

var eventController = require(__projdir + '/controllers/event');

router.get('/', eventController.findMultiple);

router.get('/:event_id', eventController.find);

router.post('/', authentication, authorization(roles = [1, 2]), eventController.create);

router.put('/:event_id', authentication, authorization(roles = [1, 2]), eventController.update);

router.delete('/:event_id', authentication, authorization(roles = [1, 2]), eventController.delete);

module.exports = router;
