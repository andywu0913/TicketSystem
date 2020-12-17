var mysql = require('mysql2/promise');

var config = require(__projdir + '/config/db').mysql;

module.exports = async function(req, res, next) {
  var pool = await mysql.createPool(config);
  req.mysql = pool;
  next();
};
