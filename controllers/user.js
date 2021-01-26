const axios = require('axios');
const crypto = require('crypto');

const userModel = require(__projdir + '/models/user');

const jwt = require(__projdir + '/utils/jwt');

const oauth = require(__projdir + '/config/oauth');

function hashPassword(password) {
  return new Promise(function(resolve, reject) {
    let salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, function(err, derivedKey) {
      if(err)
        reject(err);
      resolve('scrypt64' + ':' + salt + ':' + derivedKey.toString('hex'));
    });
  });
}

function verifyPassword(password, hash) {
  return new Promise(function(resolve, reject) {
    let [type, salt, key] = hash.split(':');
    crypto.scrypt(password, salt, 64, function(err, derivedKey) {
      if(err)
        reject(err);
      resolve(key === derivedKey.toString('hex'));
    });
  });
}

module.exports.login = async function(req, res) {
  try {
    let uname    = req.body.uname;
    let password = req.body.password;

    if(!uname || !password) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['uname', 'password'], 'error_msg': 'Missing one or more required parameters.'});
    }

    let User = userModel(req.mysql);

    let loginInfo = await User.getLoginInfo(uname);
    if(Object.keys(loginInfo).length === 0 || !await verifyPassword(password, loginInfo.password)) {
      res.status(401);
      return res.json({'successful': false, 'data': {}, 'error_field': ['uname', 'password'], 'error_msg': 'Either username or password is incorrect.'});
    }

    let userId = loginInfo.id;
    let role   = loginInfo.role;
    let name   = loginInfo.name;

    let accessToken = await jwt.create.accessToken({'user_id': userId, 'role': role, 'name': name}, exp = '35m');
    let refreshToken = await jwt.create.refreshToken();

    // access token expiration time: 30 mins
    // access token expiration tolerance time: 5 mins
    // refresh token expiration time: 10 hrs

    let expiresIn = new Date();
    expiresIn.setHours(expiresIn.getHours() + 10);
    let result = await User.updateRefreshToken(userId, refreshToken, expiresIn);
    if(result.affectedRows === 0)
      throw 'Fail to update new refresh token to the database.';

    res.json({'successful': true, 'data': {'access_token': accessToken, 'expires_in': [30 * 60, 'sec'], 'refresh_token': refreshToken}, 'error_field': [], 'error_msg': ''});
  }
  catch(err) {
    res.status(500);
    res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
  }
};

module.exports.loginWithGitHub = async function(req, res) {
  try {
    let code = req.body.code;

    if(!code) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['code'], 'error_msg': 'Missing one or more required parameters.'});
    }

    let exchangeAccessTokenURL = oauth.GitHub.exchangeAccessTokenURL;
    let clientId = oauth.GitHub.clientId;
    let clientSecret = oauth.GitHub.clientSecret;

    let response1 = await axios.post(exchangeAccessTokenURL, {'client_id': clientId, 'client_secret': clientSecret, 'code': code}, {'headers': {'Accept': 'application/json'}});
    if(response1.status !== 200)
      throw 'Fail to obtain access token from GitHub Server.';

    let requestUserResourceURL = oauth.GitHub.requestUserResourceURL;
    let tokenType = response1.data.token_type;
    let token = response1.data.access_token;

    let response2 = await axios.get(requestUserResourceURL, {'headers': {'Authorization': `${tokenType} ${token}`, 'Accept': 'application/json'}});
    if(response2.status !== 200)
      throw 'Fail to obtain user info from GitHub server.';

    let userInfo = response2.data;

    let User = userModel(req.mysql);

    // compare db user info
    let loginInfo = await User.getGitHubLoginInfo(userInfo.id);
    if(Object.keys(loginInfo).length === 0) {
      let requestUserEmailURL = oauth.GitHub.requestUserEmailURL;
      let response3 = await axios.get(requestUserEmailURL, {'headers': {'Authorization': `${tokenType} ${token}`, 'Accept': 'application/json'}});
      let email = response3.data.filter((e) => e.primary)[0].email;

      let connection = await req.mysql.getConnection();
      User = userModel(connection);
      await connection.beginTransaction();
      try {
        let result1 = await User.create(`github:${userInfo.login}-${userInfo.id}`, `${tokenType}:${token}`, 3, userInfo.name, email);
        if(result1.affectedRows === 0)
          throw 'Fail to add user in the database.';

        let result2 = await User.linkWithGitHub(result1.insertId, userInfo.id);
        if(result2.affectedRows === 0)
          throw 'Fail to link user with GitHub in the database.';

        await connection.commit();

        loginInfo = await User.getGitHubLoginInfo(userInfo.id);
      }
      catch(err) {
        await connection.rollback();
        throw err;
      }
      finally {
        connection.release();
      }
    }

    let userId = loginInfo.id;
    let role   = loginInfo.role;
    let name   = loginInfo.name;

    let accessToken = await jwt.create.accessToken({'user_id': userId, 'role': role, 'name': name}, exp = '35m');
    let refreshToken = await jwt.create.refreshToken();

    // access token expiration time: 30 mins
    // access token expiration tolerance time: 5 mins
    // refresh token expiration time: 10 hrs

    let expiresIn = new Date();
    expiresIn.setHours(expiresIn.getHours() + 10);
    let result = await User.updateRefreshToken(userId, refreshToken, expiresIn);
    if(result.affectedRows === 0)
      throw 'Fail to update new refresh token to the database.';

    res.json({'successful': true, 'data': {'access_token': accessToken, 'expires_in': [30 * 60, 'sec'], 'refresh_token': refreshToken}, 'error_field': [], 'error_msg': ''});
  }
  catch(err) {
    res.status(500);
    res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
  }
};

module.exports.refreshLoginToken = async function(req, res) {
  try {
    let refreshToken = req.body.refresh_token;
    let userId       = req.user_id;
    let role         = req.role;

    if(!refreshToken) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['refresh_token'], 'error_msg': 'Missing one or more required parameters.'});
    }

    let User = userModel(req.mysql);

    let result = await User.compareRefreshToken(userId, refreshToken);
    if(Object.keys(result).length === 0) {
      res.status(401);
      return res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': 'Current session is invalid. Try login again.'});
    }

    let accessToken = await jwt.create.accessToken({'user_id': result.id, 'role': result.role, 'name': result.name}, exp = '35m');
    refreshToken = await jwt.create.refreshToken();

    // access token expiration time: 30 mins
    // access token expiration tolerance time: 5 mins
    // refresh token expiration time: 10 hrs

    let expiresIn = new Date();
    expiresIn.setHours(expiresIn.getHours() + 10);

    result = await User.updateRefreshToken(userId, refreshToken, expiresIn);
    if(result.affectedRows === 0)
      throw 'Fail to update new refresh token to the database.';

    res.json({'successful': true, 'data': {'access_token': accessToken, 'expires_in': [30 * 60, 'sec'], 'refresh_token': refreshToken}, 'error_field': [], 'error_msg': ''});
  }
  catch(err) {
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
    let uname    = req.body.uname;
    let password = req.body.password;
    let role     = 3; // Default role: user
    let name     = req.body.name;
    let email    = req.body.email;

    if(!uname || !password || !name || !email) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['uname', 'password', 'name', 'email'], 'error_msg': 'Missing one or more required parameters.'});
    }

    if(uname.length > 64 || name.length > 64 || email.length > 64) {
      res.status(400);
      return res.json({'successful': false, 'data': {}, 'error_field': ['uname', 'name', 'email'], 'error_msg': 'One or more parameters contain incorrect values.'});
    }

    let User = userModel(req.mysql);

    let result = await User.create(uname, await hashPassword(password), role, name, email);

    // TODO: return access token and refresh token

    if(result.affectedRows === 0)
      throw 'Fail to add user in the database.';

    res.status(201);
    res.json({'successful': true, 'data': {'id': result.insertId, 'uname': uname, 'role': role, 'name': name, 'email': email}, 'error_field': [], 'error_msg': ''});
  }
  catch(err) {
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

module.exports.get = async function(req, res) {
  try {
    let userId = req.user_id;

    let User = userModel(req.mysql);

    let userInfo = await User.getInfo(userId);

    if(Object.keys(userInfo).length === 0)
      throw 'Fail to get user info from the database.';

    res.json({'successful': true, 'data': userInfo, 'error_field': [], 'error_msg': ''});
  }
  catch(err) {
    res.status(500);
    res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
  }
};

module.exports.getAll = async function(req, res) {
  try {
    let User = userModel(req.mysql);

    let usersInfo = await User.getAllInfo();
    res.json({'successful': true, 'data': usersInfo, 'error_field': [], 'error_msg': ''});
  }
  catch(err) {
    res.status(500);
    res.json({'successful': false, 'data': {}, 'error_field': [], 'error_msg': err});
  }
};

module.exports.updateInfo = async function(req, res) {
  try {
    let uname  = req.body.uname;
    let name   = req.body.name;
    let email  = req.body.email;
    let userId = req.user_id;

    if(!uname || !name || !email) {
      res.status(400);
      res.json({'successful': false, 'data': [], 'error_field': ['uname', 'name', 'email'], 'error_msg': 'Missing one or more required parameters.'});
    }

    if(uname.length > 64 || name.length > 64 || email.length > 64) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['uname', 'name', 'email'], 'error_msg': 'One or more parameters contain incorrect values.'});
    }

    let User = userModel(req.mysql);

    let result = await User.updateInfo(userId, uname, name, email);
    if(result.affectedRows === 0)
      throw 'Fail to update user info to the database.';

    res.status(204);
    res.end();
  }
  catch(err) {
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

module.exports.updateInfoById = async function(req, res) {
  try {
    let name   = req.body.name;
    let email  = req.body.email;
    let role  = req.body.role;
    let userId = req.params.user_id;

    if(!name || !email || !role || !userId) {
      res.status(400);
      res.json({'successful': false, 'data': [], 'error_field': ['name', 'email', 'role', 'user_id'], 'error_msg': 'Missing one or more required parameters.'});
    }

    if(name.length > 64 || email.length > 64 || role < 1 || role > 3) {
      res.status(400);
      return res.json({'successful': false, 'data': [], 'error_field': ['name', 'email', 'role', 'user_id'], 'error_msg': 'One or more parameters contain incorrect values.'});
    }

    let User = userModel(req.mysql);

    let result = await User.updateInfoFromAdmin(userId, name, email, role);
    if(result.affectedRows === 0)
      throw 'Fail to update user info to the database.';

    res.status(204);
    res.end();
  }
  catch(err) {
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
    let passwordCurrent = req.body.password_current;
    let passwordNew     = req.body.password_new;
    let userId          = req.user_id;

    if(!passwordCurrent || !passwordNew) {
      res.status(400);
      res.json({'successful': false, 'data': [], 'error_field': ['password_current', 'password_new'], 'error_msg': 'Missing one or more required parameters.'});
    }

    // TODO: password constraint validation

    let User = userModel(req.mysql);

    let userInfo = await User.getInfo(userId);
    if(Object.keys(userInfo).length === 0)
      throw 'Fail to locate user info from the database.';

    let loginInfo = await User.getLoginInfo(userInfo.uname);
    if(Object.keys(loginInfo).length === 0 || !await verifyPassword(passwordCurrent, loginInfo.password)) {
      res.status(401);
      return res.json({'successful': false, 'data': [], 'error_field': ['password_current'], 'error_msg': 'Current password is incorrect.'});
    }

    let result = await User.updatePassword(userId, await hashPassword(passwordNew));
    if(result.affectedRows === 0)
      throw 'Fail to update user password to the database.';

    res.status(204);
    res.end();
  }
  catch(err) {
    res.status(500);
    res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': err});
  }
};
