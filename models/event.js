var mysql = require('mysql');

var config = require(__projdir + '/config/db').mysql;

module.exports.create = function(name, description, start_date, end_date, creator_uid) {
  return new Promise(function(resolve, reject) {
    var connection = mysql.createConnection(config);
    connection.connect();
    var sql = 'INSERT INTO `event` (`name`, `description`, `start_date`, `end_date`, `creator_uid`) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [name, description, start_date, end_date, creator_uid], function (err, result) {
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
    var sql_latest = 'SELECT `id`, `name`, `description`, `start_date`, `end_date` FROM `event`                ORDER BY `id` DESC LIMIT ?';
    var sql_offset = 'SELECT `id`, `name`, `description`, `start_date`, `end_date` FROM `event` WHERE `id` < ? ORDER BY `id` DESC LIMIT ?';
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
    var sql = 'SELECT `id`, `name`, `description`, `start_date`, `end_date`, `creator_uid` FROM `event` WHERE `id` = ?';
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

module.exports.update = function(id, name, description, start_date, end_date) {
  return new Promise(function(resolve, reject) {
    var connection = mysql.createConnection(config);
    connection.connect();
    var sql = 'UPDATE `event` SET `name` = ?, `description` = ?, `start_date` = ?, `end_date` = ? WHERE `id` = ?';
    connection.query(sql, [name, description, start_date, end_date, id], function (err, result) {
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
