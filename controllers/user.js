const axios = require('axios');

const UserModel = require(`${__projdir}/models/user`);

const jwtUtility = require(`${__projdir}/utils/jwtUtility`);
const passwordUtility = require(`${__projdir}/utils/passwordUtility`);

const Errors = require(`${__projdir}/utils/Errors`);
const ReturnCode = require(`${__projdir}/utils/ReturnCode`);
const ReturnObject = require(`${__projdir}/utils/ReturnObject`);

const oauth = require(`${__projdir}/config/oauth`);

module.exports.login = async function(req, res) {
  const returnObject = new ReturnObject({});
  try {
    const { uname, password } = req.body;

    if (!uname || !password) {
      throw new Errors.BadRequestError('Missing one or more required parameters.', ['uname', 'password']);
    }

    const User = UserModel(req.mysql);

    const loginInfo = await User.getLoginInfo(uname);
    if (Object.keys(loginInfo).length === 0 || !await passwordUtility.verifyPassword(password, loginInfo.password)) {
      throw new Errors.UnauthorizedError('Either username or password is incorrect.', ['uname', 'password']);
    }

    const { id: userId, role, name } = loginInfo;

    const accessToken = await jwtUtility.create.accessToken({ user_id: userId, role, name }, '35m');
    const refreshToken = await jwtUtility.create.refreshToken();

    // access token expiration time: 30 mins
    // access token expiration tolerance time: 5 mins
    // refresh token expiration time: 10 hrs

    const expiresIn = new Date();
    expiresIn.setHours(expiresIn.getHours() + 10);
    const result = await User.updateRefreshToken(userId, refreshToken, expiresIn);
    if (result.affectedRows === 0) {
      throw new Errors.InternalServerError('Fail to update new refresh token to the database.');
    }

    returnObject.setData({ access_token: accessToken, expires_in: [30 * 60, 'sec'], refresh_token: refreshToken });
    res.status(ReturnCode.OK).json(returnObject);
  } catch (err) {
    returnObject.setError(err.message, err.fields);
    res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};

module.exports.loginWithGitHub = async function(req, res) {
  const returnObject = new ReturnObject({});
  try {
    const { code } = req.body;

    if (!code) {
      throw new Errors.BadRequestError('Missing one or more required parameters.', ['code']);
    }

    const { exchangeAccessTokenURL, clientId, clientSecret } = oauth.GitHub;

    const response1 = await axios.post(exchangeAccessTokenURL, { client_id: clientId, client_secret: clientSecret, code }, { headers: { Accept: 'application/json' } });
    if (response1.status !== 200) {
      throw new Errors.InternalServerError('Fail to obtain access token from GitHub Server.');
    }

    const { requestUserResourceURL } = oauth.GitHub;
    const { token_type: tokenType, access_token: token } = response1.data;

    const response2 = await axios.get(requestUserResourceURL, { headers: { Authorization: `${tokenType} ${token}`, Accept: 'application/json' } });
    if (response2.status !== 200) {
      throw new Errors.InternalServerError('Fail to obtain user info from GitHub server.');
    }

    const userInfo = response2.data;

    let User = UserModel(req.mysql);

    let loginInfo = await User.getGitHubLoginInfo(userInfo.id);

    // new user create info
    if (Object.keys(loginInfo).length === 0) {
      const { requestUserEmailURL } = oauth.GitHub;
      const response3 = await axios.get(requestUserEmailURL, { headers: { Authorization: `${tokenType} ${token}`, Accept: 'application/json' } });
      const { email } = response3.data.find((e) => e.primary);

      const connection = await req.mysql.getConnection();
      User = UserModel(connection);
      await connection.beginTransaction();
      try {
        const result1 = await User.create(`github:${userInfo.login}-${userInfo.id}`, `${tokenType}:${token}`, 3, userInfo.name, email);
        if (result1.affectedRows === 0) {
          throw new Errors.InternalServerError('Fail to add user in the database.');
        }

        const result2 = await User.linkWithGitHub(result1.insertId, userInfo.id);
        if (result2.affectedRows === 0) {
          throw new Errors.InternalServerError('Fail to link user with GitHub in the database.');
        }

        await connection.commit();

        loginInfo = await User.getGitHubLoginInfo(userInfo.id);
      } catch (err) {
        await connection.rollback();
        throw err;
      } finally {
        connection.release();
      }
    }

    const { id: userId, role, name } = loginInfo;

    const accessToken = await jwtUtility.create.accessToken({ user_id: userId, role, name }, '35m');
    const refreshToken = await jwtUtility.create.refreshToken();

    // access token expiration time: 30 mins
    // access token expiration tolerance time: 5 mins
    // refresh token expiration time: 10 hrs

    const expiresIn = new Date();
    expiresIn.setHours(expiresIn.getHours() + 10);
    const result = await User.updateRefreshToken(userId, refreshToken, expiresIn);
    if (result.affectedRows === 0) {
      throw new Errors.InternalServerError('Fail to update new refresh token to the database.');
    }

    returnObject.setData({ access_token: accessToken, expires_in: [30 * 60, 'sec'], refresh_token: refreshToken });
    res.status(ReturnCode.OK).json(returnObject);
  } catch (err) {
    returnObject.setError(err.message, err.fields);
    res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};

module.exports.refreshLoginToken = async function(req, res) {
  const returnObject = new ReturnObject({});
  try {
    let { refresh_token: refreshToken } = req.body;
    const userId = req.user_id;

    if (!refreshToken) {
      throw new Errors.BadRequestError('Missing one or more required parameters.', ['refresh_token']);
    }

    const User = UserModel(req.mysql);

    let result = await User.compareRefreshToken(userId, refreshToken);
    if (Object.keys(result).length === 0) {
      throw new Errors.UnauthorizedError('Current session is invalid. Try login again.');
    }

    const accessToken = await jwtUtility.create.accessToken({ user_id: result.id, role: result.role, name: result.name }, '35m');
    refreshToken = await jwtUtility.create.refreshToken();

    // access token expiration time: 30 mins
    // access token expiration tolerance time: 5 mins
    // refresh token expiration time: 10 hrs

    const expiresIn = new Date();
    expiresIn.setHours(expiresIn.getHours() + 10);

    result = await User.updateRefreshToken(userId, refreshToken, expiresIn);
    if (result.affectedRows === 0) {
      throw new Errors.InternalServerError('Fail to update new refresh token to the database.');
    }

    returnObject.setData({ access_token: accessToken, expires_in: [30 * 60, 'sec'], refresh_token: refreshToken });
    res.status(ReturnCode.OK).json(returnObject);
  } catch (err) {
    returnObject.setError(err.message, err.fields);
    res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};

module.exports.logout = async function(req, res) {
  const returnObject = new ReturnObject({});
  try {
    const userId = req.user_id;

    const User = UserModel(req.mysql);

    const result = await User.revokeRefreshToken(userId);
    if (result.affectedRows === 0) {
      throw new Errors.InternalServerError('Fail to revoke refresh token.');
    }

    res.status(ReturnCode.NO_CONTENT).end();
  } catch (err) {
    returnObject.setError(err.message);
    res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};

module.exports.create = async function(req, res) {
  const returnObject = new ReturnObject({});
  try {
    const { uname, password, role = 3, name, email } = req.body;

    if (!uname || !password || !name || !email) {
      throw new Errors.BadRequestError('Missing one or more required parameters.', ['uname', 'password', 'name', 'email']);
    }

    if (uname.length > 64 || name.length > 64 || email.length > 64) {
      throw new Errors.BadRequestError('One or more parameters contain incorrect values.', ['uname', 'name', 'email']);
    }

    const User = UserModel(req.mysql);

    const result = await User.create(uname, await passwordUtility.hashPassword(password), role, name, email);

    if (result.affectedRows === 0) {
      throw new Errors.InternalServerError('Fail to revoke refresh token.');
    }

    returnObject.setData({ id: result.insertId, uname, role, name, email });
    res.status(ReturnCode.CREATED).json(returnObject);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      returnObject.setError('This username is already in use.', ['uname']);
      res.status(ReturnCode.CONFLICT);
    } else {
      returnObject.setError(err.message, err.fields);
      res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR);
    }
    res.json(returnObject);
  }
};

module.exports.get = async function(req, res) {
  const returnObject = new ReturnObject({});
  try {
    const userId = req.user_id;

    const User = UserModel(req.mysql);

    const userInfo = await User.getInfo(userId);

    if (Object.keys(userInfo).length === 0) {
      throw new Errors.InternalServerError('Fail to get user info from the database.');
    }

    returnObject.setData(userInfo);
    res.status(ReturnCode.OK).json(returnObject);
  } catch (err) {
    returnObject.setError(err.message);
    res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};

module.exports.getAll = async function(req, res) {
  const returnObject = new ReturnObject([]);
  try {
    const User = UserModel(req.mysql);

    const usersInfo = await User.getAllInfo();

    returnObject.setData(usersInfo);
    res.status(ReturnCode.OK).json(returnObject);
  } catch (err) {
    returnObject.setError(err.message);
    res.status(ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};

module.exports.updateInfo = async function(req, res) {
  const returnObject = new ReturnObject({});
  try {
    const { uname, name, email } = req.body;
    const userId = req.user_id;

    if (!uname || !name || !email) {
      throw new Errors.BadRequestError('Missing one or more required parameters.', ['uname', 'name', 'email']);
    }

    if (uname.length > 64 || name.length > 64 || email.length > 64) {
      throw new Errors.BadRequestError('One or more parameters contain incorrect values.', ['uname', 'name', 'email']);
    }

    const User = UserModel(req.mysql);

    const result = await User.updateInfo(userId, uname, name, email);
    if (result.affectedRows === 0) {
      throw new Errors.InternalServerError('Fail to update user info to the database.');
    }

    res.status(ReturnCode.NO_CONTENT).end();
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      returnObject.setError('This username is already in use.', ['uname']);
      res.status(ReturnCode.CONFLICT);
    } else {
      returnObject.setError(err.message, err.fields);
      res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR);
    }
    res.json(returnObject);
  }
};

module.exports.updateInfoById = async function(req, res) {
  const returnObject = new ReturnObject({});
  try {
    const { name, email, role } = req.body;
    const userId = req.params.user_id;

    if (!name || !email || !role || !userId) {
      throw new Errors.BadRequestError('Missing one or more required parameters.', ['name', 'email', 'role', 'user_id']);
    }

    if (name.length > 64 || email.length > 64 || role < 1 || role > 3) {
      throw new Errors.BadRequestError('One or more parameters contain incorrect values.', ['name', 'email', 'role', 'user_id']);
    }

    const User = UserModel(req.mysql);

    const result = await User.updateInfoFromAdmin(userId, name, email, role);
    if (result.affectedRows === 0) {
      throw new Errors.InternalServerError('Fail to update user info to the database.');
    }

    res.status(ReturnCode.NO_CONTENT).end();
  } catch (err) {
    returnObject.setError(err.message, err.fields);
    res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};

module.exports.updatePassword = async function(req, res) {
  const returnObject = new ReturnObject({});
  try {
    const { password_current: passwordCurrent, password_new: passwordNew } = req.body;
    const userId = req.user_id;

    if (!passwordCurrent || !passwordNew) {
      throw new Errors.BadRequestError('Missing one or more required parameters.', ['password_current', 'password_new']);
    }

    const User = UserModel(req.mysql);

    const userInfo = await User.getInfo(userId);
    if (Object.keys(userInfo).length === 0) {
      throw new Errors.InternalServerError('Fail to locate user info from the database');
    }

    const loginInfo = await User.getLoginInfo(userInfo.uname);
    if (Object.keys(loginInfo).length === 0 || !await passwordUtility.verifyPassword(passwordCurrent, loginInfo.password)) {
      throw new Errors.UnauthorizedError('Current password is incorrect.', ['password_current']);
    }

    const result = await User.updatePassword(userId, await passwordUtility.hashPassword(passwordNew));
    if (result.affectedRows === 0) {
      throw new Errors.InternalServerError('Fail to update user password to the database.');
    }

    res.status(ReturnCode.NO_CONTENT).end();
  } catch (err) {
    returnObject.setError(err.message, err.fields);
    res.status(err.statusCode || ReturnCode.INTERNAL_SERVER_ERROR).json(returnObject);
  }
};
