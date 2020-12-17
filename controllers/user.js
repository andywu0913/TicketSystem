var express = require('express');
var authentication = require(__projdir + '/middlewares/authentication');
var jwt = require(__projdir + '/utils/jwt');
var userModel = require(__projdir + '/models/user');
var router = express.Router();

router.post('/login', async function(req, res, next) {
  try {
    var uname    = req.body.uname;
    var password = req.body.password;

    if(!uname || !password) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['uname', 'password'], 'error_msg': 'Missing one or more required parameters.'});
    }

    var loginInfo = await userModel.authenticate(uname, password);
    if(Object.keys(loginInfo).length === 0) {
      res.status(401);
      return res.json({'successful': false, 'data': {}, 'error_field': ['uname', 'password'], 'error_msg': 'Either username or password is incorrect.'});
    }

    var userId = loginInfo.id;
    var role   = loginInfo.role;

    var accessToken = await jwt.create.accessToken({'user_id': userId, 'role': role}, exp = '35m');
    var refreshToken = await jwt.create.refreshToken();
    
    // access token expiration time: 30 mins
    // access token expiration tolerance time: 5 mins
    // refresh token expiration time: 10 hrs

    var expiresIn = new Date();
    expiresIn.setDate(expiresIn.getHours() + 10);

    var result = await userModel.updateRefreshToken(userId, refreshToken, expiresIn);
    if(result.affectedRows === 0)
      throw 'Fail to update new refresh token to the database.';

    res.json({'successful': true, 'data': {'access_token': accessToken, 'expires_in': 30 * 60, 'refresh_token': refreshToken}, 'error_field': [], 'error_msg': ''});
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
  }
});

router.post('/refresh', authentication, async function(req, res, next) {
  try {
    var userId       = req.user_id;
    var role         = req.role;
    var refreshToken = req.body.refresh_token;

    if(!refreshToken) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['refresh_token'], 'error_msg': 'Missing one or more required parameters.'});
    }

    var result = await userModel.compareRefreshToken(userId, refreshToken);
    if(Object.keys(result).length === 0) {
      res.status(401);
      return res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': 'Current session is invalid. Try login again.'});
    }

    var accessToken = await jwt.create.accessToken({'user_id': userId, 'role': role}, exp = '35m');
    refreshToken = await jwt.create.refreshToken();

    // access token expiration time: 30 mins
    // access token expiration tolerance time: 5 mins
    // refresh token expiration time: 10 hrs

    var expiresIn = new Date();
    expiresIn.setDate(expiresIn.getHours() + 10);

    var result = await userModel.updateRefreshToken(userId, refreshToken, expiresIn);
    if(result.affectedRows === 0)
      throw 'Fail to update new refresh token to the database.';

    res.json({'successful': true, 'data': {'access_token': accessToken, 'expires_in': 30 * 60, 'refresh_token': refreshToken}, 'error_field': [], 'error_msg': ''});
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
  }
});

router.all('/logout', function(req, res, next) {
  // TODO: delete refreshToken from database
  res.json({'successful': true, 'data': [], 'error_field': [], 'error_msg': ''});
});

router.post('/', async function(req, res, next) {
  try {
    var uname    = req.body.uname;
    var password = req.body.password;
    var role     = 3; //Default role: user
    var name     = req.body.name;
    var email    = req.body.email;

    if(!uname || !password || !name || !email) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['uname', 'password', 'name', 'email'], 'error_msg': 'Missing one or more required parameters.'});
    }

    if(uname.length > 16 || name.length > 64 || email.length > 64) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['uname', 'name', 'email'], 'error_msg': 'One or more parameters contain incorrect values.'});
    }

    var result = await userModel.create(uname, password, role, name, email);

    if(result.affectedRows === 0)
      throw 'Fail to add user in the database.';

    res.status(201);
    res.json({'successful': true, 'data': {'id': result.insertId, 'uname': uname, 'role': role, 'name': name, 'email': email}, 'error_field': [], 'error_msg': ''});
  }
  catch (err) {
    if(err.code === 'ER_DUP_ENTRY') {
      res.status(409);
      res.json({'successful': false, 'data': {}, 'error_field': ['uname'], 'error_msg': 'This username is already in use.'});
    }
    else {
      res.status(500);
      res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
    }
  }
});

router.get('/', authentication, async function(req, res, next) {
  try {
    var userId   = req.user_id;
    var userInfo = await userModel.getInfo(userId);

    if(Object.keys(userInfo).length === 0)
      throw 'Fail to get user info from the database.';

    res.json({'successful': true, 'data': userInfo, 'error_field': [], 'error_msg': ''});
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
  }
});

router.put('/', authentication, async function(req, res, next) {
  try {
    var userId = req.user_id;
    var uname  = req.body.uname;
    var name   = req.body.name;
    var email  = req.body.email;

    if(!uname || !name || !email) {
      res.status(400);
      res.json({'successful': false, 'data': [], 'error_field': ['uname', 'name', 'email'], 'error_msg': 'Missing one or more required parameters.'});
    }

    if(uname.length > 16 || name.length > 64 || email.length > 64) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['uname', 'name', 'email'], 'error_msg': 'One or more parameters contain incorrect values.'});
    }

    var result = await userModel.updateInfo(userId, uname, name, email);
    if(result.affectedRows === 0)
      throw 'Fail to update user info to the database.';

    res.status(204);
    return res.end();
  }
  catch (err) {
    if(err.code === 'ER_DUP_ENTRY') {
      res.status(409);
      res.json({'successful': false, 'data': [], 'error_field': ['uname'], 'error_msg': 'This username is already in use.'});
    }
    else {
      res.status(500);
      res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': err});
    }
  }
});

router.put('/password', authentication, async function(req, res, next) {
  try {
    var userId          = req.user_id;
    var passwordCurrent = req.body.password_current;
    var passwordNew     = req.body.password_new;

    if(!passwordCurrent || !passwordNew) {
      res.status(400);
      res.json({'successful': false, 'data': [], 'error_field': ['password_current', 'password_new'], 'error_msg': 'Missing one or more required parameters.'});
    }

    // TODO: password constraint validation

    var userInfo = await userModel.getInfo(userId);
    if(Object.keys(userInfo).length === 0)
      throw 'Fail to locate user info from the database.';

    var authentication = await userModel.authenticate(userInfo.uname, passwordCurrent);
    if(Object.keys(authentication).length === 0) {
      res.status(401);
      return res.json({'successful': false, 'data': [], 'error_field': ['password_current'], 'error_msg': 'Your current password is incorrect.'});
    }

    var result = await userModel.updatePassword(userId, passwordNew);
    if(result.affectedRows === 0)
      throw 'Fail to update user password to the database.';

    res.status(204);
    return res.end();
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': err});
  }
});

module.exports = router;
