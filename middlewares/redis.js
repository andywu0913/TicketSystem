const Redis = require('ioredis');

const config = require(__projdir + '/config/redis');

const redis = new Redis(config);

module.exports = function(req, res, next) {
  req.redis = redis;
  next();
};
