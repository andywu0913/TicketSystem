const crypto = require('crypto');

module.exports.hashPassword = function(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) {
        reject(err);
      }
      resolve(`scrypt64:${salt}:${derivedKey.toString('hex')}`);
    });
  });
};

module.exports.verifyPassword = function(password, hash) {
  return new Promise((resolve, reject) => {
    const [type, salt, key] = hash.split(':');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) {
        reject(err);
      }
      resolve(key === derivedKey.toString('hex'));
    });
  });
};
