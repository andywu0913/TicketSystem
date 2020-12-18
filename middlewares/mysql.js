var mysql = require('mysql2/promise');

var config = require(__projdir + '/config/mysql');

var pool = mysql.createPool(config);

module.exports = async function(req, res, next) {
  req.mysql = pool;
  next();
};
