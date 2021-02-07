const express = require('express');

const router = express.Router();

const authentication = require('@middlewares/authentication');
const authorization = require('@middlewares/authorization');

const sessionController = require('@controllers/session');

router.get('/', sessionController.getAllByEventId);

router.post('/', authentication(), authorization([1, 2]), sessionController.create);

router.get('/:session_id', sessionController.getById);

router.get('/:session_id/seats', sessionController.getAvailableSeats);

router.post('/:session_id/activation', authentication(), authorization([1, 2]), sessionController.activation);

router.put('/:session_id', authentication(), authorization([1, 2]), sessionController.update);

router.delete('/:session_id', authentication(), authorization([1, 2]), sessionController.delete);

module.exports = router;
