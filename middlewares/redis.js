const Redis = require('ioredis');

const config = require('@config/redis');

const redis = new Redis(config);

module.exports = function(req, res, next) {
  req.redis = redis; // TODO: using .multi() with singleton might cause problems???
  next();
};
