const mysql = require('mysql2/promise');

const config = require('@config/mysql');

const pool = mysql.createPool(config);

module.exports = function(req, res, next) {
  req.mysql = pool;
  next();
};
