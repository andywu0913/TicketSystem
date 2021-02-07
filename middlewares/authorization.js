const ReturnObject = require(`${__projdir}/utils/ReturnObject`);

const Errors = require(`${__projdir}/utils/Errors`);

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
