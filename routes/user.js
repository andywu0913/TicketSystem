const express = require('express');
const router = express.Router();

const authentication = require(__projdir + '/middlewares/authentication');

const userController = require(__projdir + '/controllers/user');

router.post('/login', userController.login);

router.post('/refresh', authentication, userController.refreshLoginToken);

router.all('/logout', userController.logout);

router.post('/', userController.create);

router.get('/', authentication, userController.getById);

router.put('/', authentication, userController.updateInfo);

router.put('/password', authentication, userController.updatePassword);

module.exports = router;
