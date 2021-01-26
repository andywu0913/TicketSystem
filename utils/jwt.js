const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const secret = require(__projdir + '/config/jwt').secret;

module.exports.create = {
  accessToken: function(payload, exp = '6h') {
    return new Promise(function(resolve, reject) {
      jwt.sign(payload, secret, {'expiresIn': exp}, function(err, token) {
        if(err)
          reject('Fail to create JWT token.');
        resolve(token);
      });
    });
  },
  refreshToken: function() {
    return new Promise(function(resolve, reject) {
      // Create random string as refresh token
      // 32 byte encoded to hex is 64 characters
      let token = crypto.randomBytes(32).toString('hex');
      resolve(token);
    });
  }
};

module.exports.decode = function(token, ignoreExpiration) {
  return new Promise(function(resolve, reject) {
    jwt.verify(token, secret, {'ignoreExpiration': ignoreExpiration}, function(err, payload) {
      if(err)
        // TokenExpiredError
        // JsonWebTokenError
        // NotBeforeError
        reject(err);

      resolve(payload);
    });
  });
};
