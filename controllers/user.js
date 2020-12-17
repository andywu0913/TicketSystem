var userModel = require(__projdir + '/models/user');

var jwt = require(__projdir + '/utils/jwt');

module.exports.login = async function(req, res) {
  try {
    var uname    = req.body.uname;
    var password = req.body.password;

    if(!uname || !password) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['uname', 'password'], 'error_msg': 'Missing one or more required parameters.'});
    }

    var User = userModel(req.mysql);

    var loginInfo = await User.authenticate(uname, password);
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

    var result = await User.updateRefreshToken(userId, refreshToken, expiresIn);
    if(result.affectedRows === 0)
      throw 'Fail to update new refresh token to the database.';

    res.json({'successful': true, 'data': {'access_token': accessToken, 'expires_in': 30 * 60, 'refresh_token': refreshToken}, 'error_field': [], 'error_msg': ''});
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
  }
};

module.exports.refreshLoginToken = async function(req, res) {
  try {
    var userId       = req.user_id;
    var role         = req.role;
    var refreshToken = req.body.refresh_token;

    if(!refreshToken) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['refresh_token'], 'error_msg': 'Missing one or more required parameters.'});
    }

    var User = userModel(req.mysql);

    var result = await User.compareRefreshToken(userId, refreshToken);
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

    var result = await User.updateRefreshToken(userId, refreshToken, expiresIn);
    if(result.affectedRows === 0)
      throw 'Fail to update new refresh token to the database.';

    res.json({'successful': true, 'data': {'access_token': accessToken, 'expires_in': 30 * 60, 'refresh_token': refreshToken}, 'error_field': [], 'error_msg': ''});
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
  }
};

module.exports.logout = function(req, res) {
  // TODO: delete refreshToken from database
  res.json({'successful': true, 'data': [], 'error_field': [], 'error_msg': ''});
};

module.exports.create = async function(req, res) {
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

    var User = userModel(req.mysql);

    var result = await User.create(uname, password, role, name, email);

    // TODO: return access token and refresh token

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
};

module.exports.find = async function(req, res) {
  try {
    var userId   = req.user_id;

    var User = userModel(req.mysql);

    var userInfo = await User.getInfo(userId);

    if(Object.keys(userInfo).length === 0)
      throw 'Fail to get user info from the database.';

    res.json({'successful': true, 'data': userInfo, 'error_field': [], 'error_msg': ''});
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
  }
};

module.exports.updateInfo = async function(req, res) {
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

    var User = userModel(req.mysql);

    var result = await User.updateInfo(userId, uname, name, email);
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
};

module.exports.updatePassword = async function(req, res) {
  try {
    var userId          = req.user_id;
    var passwordCurrent = req.body.password_current;
    var passwordNew     = req.body.password_new;

    if(!passwordCurrent || !passwordNew) {
      res.status(400);
      res.json({'successful': false, 'data': [], 'error_field': ['password_current', 'password_new'], 'error_msg': 'Missing one or more required parameters.'});
    }

    // TODO: password constraint validation

    var User = userModel(req.mysql);

    var userInfo = await User.getInfo(userId);
    if(Object.keys(userInfo).length === 0)
      throw 'Fail to locate user info from the database.';

    var authentication = await User.authenticate(userInfo.uname, passwordCurrent);
    if(Object.keys(authentication).length === 0) {
      res.status(401);
      return res.json({'successful': false, 'data': [], 'error_field': ['password_current'], 'error_msg': 'Your current password is incorrect.'});
    }

    var result = await User.updatePassword(userId, passwordNew);
    if(result.affectedRows === 0)
      throw 'Fail to update user password to the database.';

    res.status(204);
    return res.end();
  }
  catch (err) {
    res.status(500);
    res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': err});
  }
};
