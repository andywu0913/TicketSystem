const express = require('express');

const router = express.Router();

const authentication = require('@middlewares/authentication');
const authorization = require('@middlewares/authorization');

const userController = require('@controllers/user');

router.post('/login', userController.login);

router.post('/login/github', userController.loginWithGitHub);

router.post('/refresh', authentication(true), userController.refreshLoginToken);

router.get('/logout', authentication(true), userController.logout);

router.post('/', userController.create);

router.get('/', authentication(), userController.get);

router.get('/all', authentication(), authorization([1]), userController.getAll);

router.put('/', authentication(), userController.updateInfo);

router.put('/password', authentication(), userController.updatePassword);

router.put('/:user_id', authentication(), authorization([1]), userController.updateInfoById);

module.exports = router;
