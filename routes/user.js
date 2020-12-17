var express = require('express');
var router = express.Router();

var authentication = require(__projdir + '/middlewares/authentication');

var userController = require(__projdir + '/controllers/user');

router.post('/login', userController.login);

router.post('/refresh', authentication, userController.refreshLoginToken);

router.all('/logout', userController.logout);

router.post('/', userController.create);

router.get('/', authentication, userController.find);

router.put('/', authentication, userController.updateInfo);

router.put('/password', authentication, userController.updatePassword);

module.exports = router;
