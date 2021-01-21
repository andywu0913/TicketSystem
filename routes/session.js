const express = require('express');
const router = express.Router();

const authentication = require(__projdir + '/middlewares/authentication');
const authorization = require(__projdir + '/middlewares/authorization');

const sessionController = require(__projdir + '/controllers/session');

router.get('/', sessionController.getAllByEventId);

router.post('/', authentication, authorization(roles = [1, 2]), sessionController.create);

router.get('/:session_id/seats', sessionController.getAvailableSeats);

router.post('/:session_id/activation', authentication, authorization(roles = [1, 2]), sessionController.activation);

router.put('/:session_id', authentication, authorization(roles = [1, 2]), sessionController.update);

router.delete('/:session_id', authentication, authorization(roles = [1, 2]), sessionController.delete);

module.exports = router;
