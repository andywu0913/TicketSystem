var mysql = require('mysql');

var config = require(__projdir + '/config/db').mysql;

module.exports.create = function(name, description, creator_uid) {
  return new Promise(function(resolve, reject) {
    var connection = mysql.createConnection(config);
    connection.connect();
    var sql = 'INSERT INTO `event` (`name`, `description`, `creator_uid`) VALUES (?, ?, ?)';
    connection.query(sql, [name, description, creator_uid], function (err, result) {
      if (err)
        reject(err);
      else
        resolve(result);
    });
    connection.end();
  });
};

module.exports.getMultiple = function(start_id, row_counts) {
  return new Promise(function(resolve, reject) {
    var sql_latest = 'SELECT `id`, `name`, `description` FROM `event`                ORDER BY `id` DESC LIMIT ?';
    var sql_offset = 'SELECT `id`, `name`, `description` FROM `event` WHERE `id` < ? ORDER BY `id` DESC LIMIT ?';
    var sql_params_latest = [row_counts];
    var sql_params_offset = [start_id, row_counts];

    var connection = mysql.createConnection(config);
    connection.connect();
    connection.query(start_id? sql_offset : sql_latest, start_id? sql_params_offset : sql_params_latest, function (err, result) {
      if (err)
        reject(err);
      else
        resolve(result);
    });
    connection.end();
  });
};

module.exports.getSingle = function(id) {
  return new Promise(function(resolve, reject) {
    var connection = mysql.createConnection(config);
    connection.connect();
    var sql = 'SELECT `id`, `name`, `description`, `creator_uid` FROM `event` WHERE `id` = ?';
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

module.exports.update = function(id, name, description) {
  return new Promise(function(resolve, reject) {
    var connection = mysql.createConnection(config);
    connection.connect();
    var sql = 'UPDATE `event` SET `name` = ?, `description` = ? WHERE `id` = ?';
    connection.query(sql, [name, description, id], function (err, result) {
      if (err)
        reject(err);
      else
        resolve(result);
    });
    connection.end();
  });
};

module.exports.delete = function(id) {
  return new Promise(function(resolve, reject) {
    var connection = mysql.createConnection(config);
    connection.connect();
    var sql = 'DELETE FROM `event` WHERE `id` = ?';
    connection.query(sql, [id], function (err, result) {
      if (err)
        reject(err);
      else
        resolve(result);
    });
    connection.end();
  });
};
