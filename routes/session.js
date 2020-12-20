var express = require('express');
var router = express.Router();

var authentication = require(__projdir + '/middlewares/authentication');
var authorization = require(__projdir + '/middlewares/authorization');

var sessionController = require(__projdir + '/controllers/session');

router.get('/', sessionController.getAllByEventId);

router.post('/', authentication, authorization(roles = [1, 2]), sessionController.create);

router.post('/:session_id/activation', authentication, authorization(roles = [1, 2]), sessionController.activation);

router.put('/:session_id', authentication, authorization(roles = [1, 2]), sessionController.update);

router.delete('/:session_id', authentication, authorization(roles = [1, 2]), sessionController.delete);

module.exports = router;
