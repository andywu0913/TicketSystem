const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { secret } = require('@config/jwt');

module.exports.create = {
  accessToken(payload, exp = '6h') {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, secret, { expiresIn: exp }, (err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      });
    });
  },
  refreshToken() {
    return new Promise((resolve) => {
      // Create random string as refresh token
      // 32 byte encoded to hex is 64 characters
      const token = crypto.randomBytes(32).toString('hex');
      resolve(token);
    });
  },
};

module.exports.decode = function(token, ignoreExpiration) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, { ignoreExpiration }, (err, payload) => {
      if (err) {
        // TokenExpiredError
        // JsonWebTokenError
        // NotBeforeError
        reject(err);
      }

      resolve(payload);
    });
  });
};
