const express = require('express');
const router = express.Router();

const authentication = require(__projdir + '/middlewares/authentication');
const authorization = require(__projdir + '/middlewares/authorization');

const userController = require(__projdir + '/controllers/user');

router.post('/login', userController.login);

router.post('/login/github', userController.loginWithGitHub);

router.post('/refresh', authentication(ignoreExpiration = true), userController.refreshLoginToken);

router.all('/logout', userController.logout);

router.post('/', userController.create);

router.get('/', authentication(), userController.get);

router.get('/all', authentication(), authorization(roles = [1]), userController.getAll);

router.put('/', authentication(), userController.updateInfo);

router.put('/password', authentication(), userController.updatePassword);

router.put('/:user_id', authentication(), authorization(roles = [1]), userController.updateInfoById);

module.exports = router;
