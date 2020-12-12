var express = require('express');
var userModel = require(__projdir + '/models/user');
var router = express.Router();

router.post('/login', async function(req, res, next) {
  try {
    var uname = req.body.uname;
    var password = req.body.password;

    if(!uname || !password) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['uname', 'password'], 'error_msg': 'Missing one or more required parameters.'});
    }

    var login_info = await userModel.authenticate(uname, password);
    if(Object.keys(login_info).length === 0) {
      res.status(401);
      return res.json({'successful': false, 'data': [], 'error_field': ['uname', 'password'], 'error_msg': 'Either username or password is incorrect.'});
    }

    req.session.user_id = login_info.id;
    res.json({'successful': true, 'data': login_info, 'error_field': [], 'error_msg': ''});
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': err});
  }
});

router.all('/logout', function(req, res, next) {
  req.session.destroy();
  res.json({'successful': true, 'data': [], 'error_field': [], 'error_msg': ''});
});

router.post('/', async function(req, res, next) {
  try {
    var uname = req.body.uname;
    var password = req.body.password;
    var role = 2; //Default role: user
    var name = req.body.name;
    var email = req.body.email;

    if(!uname || !password || !name || !email) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['uname', 'password', 'name', 'email'], 'error_msg': 'Missing one or more required parameters.'});
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
      res.json({'successful': false, 'data': [], 'error_field': ['uname'], 'error_msg': 'This username is already in use.'});
    }
    else {
      res.status(500);
      res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': err});
    }
  }
});

router.use(function (req, res, next) {
  var user_id = req.session.user_id;
  if(!user_id) {
    res.status(401);
    res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': '401 Unauthorized.'});
  }
  else
    next();
});

router.get('/', async function(req, res, next) {
  try {
    var user_id = req.session.user_id;
    var user_info = await userModel.getInfo(user_id);

    if(user_info.length === 0)
      throw 'Fail to get user info from the database.';

    res.json({'successful': true, 'data': user_info, 'error_field': [], 'error_msg': ''});
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': err});
  }
});

router.put('/', async function(req, res, next) {
  try {
    var user_id = req.session.user_id;

    var uname = req.body.uname;
    var name = req.body.name;
    var email = req.body.email;

    if(uname && name && email) {
      var result = await userModel.updateInfo(user_id, uname, name, email);

      if(result.affectedRows === 0)
        throw 'Fail to update user info in the database.';

      res.status(204);
      return res.end();
    }

    var password_current = req.body.password_current;
    var password_new = req.body.password_new;

    if(password_current && password_new) {
      var user_info = await userModel.getInfo(user_id);
      if(user_info.length === 0)
        throw 'Fail to locate user info from the database.';

      var authentication = await userModel.authenticate(user_info.uname, password_current);
      if(Object.keys(authentication).length === 0) {
        res.status(401);
        return res.json({'successful': false, 'data': [], 'error_field': ['password_current'], 'error_msg': 'Your current password is incorrect.'});
      }

      var result = await userModel.updatePassword(user_id, password_new);
      if(result.affectedRows === 0)
        throw 'Fail to update user password in the database.';

      res.status(204);
      return res.end();
    }

    res.status(400);
    res.json({'successful': false, 'data': [], 'error_field': ['uname', 'name', 'email', 'password_current', 'password_new'], 'error_msg': 'Missing one or more required parameters.'});
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

module.exports = router;
