var Redis = require('ioredis');

var config = require(__projdir + '/config/redis');

var redis = new Redis(config);

module.exports = async function(req, res, next) {
  req.redis = redis;
  next();
};
