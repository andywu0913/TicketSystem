const Errors = require('@utils/Errors');
const ReturnObject = require('@utils/ReturnObject');

module.exports = function(roles = []) {
  return function(req, res, next) {
    const returnObject = new ReturnObject([]);
    try {
      const { role } = req;

      if (!role || !roles.includes(role)) {
        throw new Errors.ForbiddenError('403 Forbidden.');
      }
      next();
    } catch (err) {
      returnObject.setError(err.message);
      res.status(err.statusCode).json(returnObject);
    }
  };
};
