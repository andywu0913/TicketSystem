const express = require('express');

const router = express.Router();

const authentication = require('@middlewares/authentication');
const authorization = require('@middlewares/authorization');

const ticketController = require('@controllers/ticket');

router.get('/', authentication(), ticketController.getAllByUserId);

router.get('/session/:session_id', authentication(), authorization([1, 2]), ticketController.getAllBySessionId);

router.post('/', authentication(), ticketController.create);

router.get('/:ticket_id', authentication(), ticketController.getById);

router.put('/:ticket_id', authentication(), ticketController.update);

router.delete('/:ticket_id', authentication(), ticketController.delete);

module.exports = router;
