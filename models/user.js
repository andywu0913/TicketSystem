var crypto = require("crypto");
var mysql = require('mysql');

var config = require(__projdir + '/config/db').mysql;

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

module.exports.create = function(uname, password, role, name, email) {
  return new Promise(function(resolve, reject) {
    var connection = mysql.createConnection(config);
    connection.connect();
    var sql = 'INSERT INTO `user` (`uname`, `password`, `role`, `name`, `email`) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [uname, hashPassword(password), role, name, email], function (err, result) {
      if (err)
        reject(err);
      else
        resolve(result);
    });
    connection.end();
  });
};

module.exports.authenticate = function(uname, password) {
  return new Promise(function(resolve, reject) {
    var connection = mysql.createConnection(config);
    connection.connect();
    var sql = 'SELECT `user`.`id`, `uname`, `user`.`name`, `role`, `role`.`name` AS "rname" \
               FROM `user` \
               LEFT JOIN `role` \
               ON `user`.`role` = `role`.`id` \
               WHERE `uname` = ? AND `password` = ?';
    connection.query(sql, [uname, hashPassword(password)], function (err, result) {
      if (err)
        reject(err);
      else if(result.length)
        resolve(result[0]);
      else
        resolve({});
    });
    connection.end();
  });
};

module.exports.getInfo = function(id) {
  return new Promise(function(resolve, reject) {
    var connection = mysql.createConnection(config);
    connection.connect();
    var sql = 'SELECT `user`.`id`, `uname`, `user`.`name`, `email`, `role`, `role`.`name` AS "rname" \
               FROM `user` \
               LEFT JOIN `role` \
               ON `user`.`role` = `role`.`id` \
               WHERE `user`.`id` = ?';
    connection.query(sql, [id], function (err, result) {
      if (err)
        reject(err);
      else if(result.length)
        resolve(result[0]);
      else
        resolve({});
    });
    connection.end();
  });
};

module.exports.updateInfo = function(id, uname, name, email) {
  return new Promise(function(resolve, reject) {
    var connection = mysql.createConnection(config);
    connection.connect();
    var sql = 'UPDATE `user` SET `uname` = ?, `name` = ?, `email`= ?, `last_update_time` = CURRENT_TIMESTAMP() WHERE `id` = ?';
    connection.query(sql, [uname, name, email, id], function (err, result) {
      if (err)
        reject(err);
      else
        resolve(result);
    });
    connection.end();
  });
};

module.exports.updatePassword = function(id, password_new) {
  return new Promise(function(resolve, reject) {
    var connection = mysql.createConnection(config);
    connection.connect();
    var sql = 'UPDATE `user` SET `password` = ?, `last_update_time` = CURRENT_TIMESTAMP() WHERE `id` = ?';
    connection.query(sql, [hashPassword(password_new), id], function (err, result) {
      if (err)
        reject(err);
      else
        resolve(result);
    });
    connection.end();
  });
};

