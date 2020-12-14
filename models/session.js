var mysql = require('mysql');

var config = require(__projdir + '/config/db').mysql;

module.exports.create = function(event_id, time, address, ticket_sell_time_open, ticket_sell_time_end, max_seats, price) {
  return new Promise(function(resolve, reject) {
    var connection = mysql.createConnection(config);
    connection.connect();
    var sql = 'INSERT INTO `session`(`event_id`, `time`, `address`, `ticket_sell_time_open`, `ticket_sell_time_end`, `max_seats`, `price`) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [event_id, time, address, ticket_sell_time_open, ticket_sell_time_end, max_seats, price], function (err, result) {
      if (err)
        reject(err);
      else
        resolve(result);
    });
    connection.end();
  });
};

module.exports.getAllByEventId = function(event_id) {
  return new Promise(function(resolve, reject) {
    var connection = mysql.createConnection(config);
    connection.connect();
    var sql = 'SELECT `id`, `event_id`, `time`, `address`, `ticket_sell_time_open`, `ticket_sell_time_end`, `max_seats`, `price` \
               FROM `session` \
               WHERE `event_id` = ? \
               ORDER BY `time`';
    connection.query(sql, [event_id], function (err, result) {
      if (err)
        reject(err);
      else
        resolve(result);
    });
    connection.end();
  });
};

module.exports.getSingle = function(session_id) {
  return new Promise(function(resolve, reject) {
    var connection = mysql.createConnection(config);
    connection.connect();
    var sql = 'SELECT `event_id`, `name`, `session`.`id` AS "session_id", `time`, `address`, `ticket_sell_time_open`, `ticket_sell_time_end`, `max_seats`, `price`, `creator_uid` \
               FROM `session`  \
               LEFT JOIN `event` \
               ON `session`.`event_id` = `event`.`id` \
               WHERE `session`.`id` = ? \
               ORDER BY `time`';

    connection.query(sql, [session_id], function (err, result) {
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

module.exports.update = function(id, time, address, ticket_sell_time_open, ticket_sell_time_end, max_seats, price) {
  return new Promise(function(resolve, reject) {
    var connection = mysql.createConnection(config);
    connection.connect();
    var sql = 'UPDATE `session` SET `time`= ?,`address`= ?,`ticket_sell_time_open`= ?,`ticket_sell_time_end`= ?,`max_seats`= ?,`price`= ? WHERE `id` = ?';
    connection.query(sql, [time, address, ticket_sell_time_open, ticket_sell_time_end, max_seats, price, id], function (err, result) {
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
    var sql = 'DELETE FROM `session` WHERE `id` = ?';
    connection.query(sql, [id], function (err, result) {
      if (err)
        reject(err);
      else
        resolve(result);
    });
    connection.end();
  });
};
