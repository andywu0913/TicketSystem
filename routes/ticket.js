var express = require('express');
var router = express.Router();

var authentication = require(__projdir + '/middlewares/authentication');
var authorization = require(__projdir + '/middlewares/authorization');

var ticketController = require(__projdir + '/controllers/ticket');

router.get('/', authentication, authorization(roles = [1, 2]), ticketController.getAllBySessionId);

router.post('/', authentication, ticketController.create);

router.get('/:ticket_id', authentication, ticketController.getById);

router.put('/:ticket_id', authentication, ticketController.update);

router.delete('/:ticket_id', authentication, ticketController.delete);

module.exports = router;
