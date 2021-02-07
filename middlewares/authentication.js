const ReturnObject = require(`${__projdir}/utils/ReturnObject`);

const Errors = require(`${__projdir}/utils/Errors`);

const jwtUtility = require(`${__projdir}/utils/jwtUtility`);

module.exports = function(ignoreExpiration = false) {
  return async function(req, res, next) {
    const returnObject = new ReturnObject([]);
    try {
      const { authorization: auth } = req.headers;

      if (!auth) {
        throw new Errors.ForbiddenError('401 Unauthorized.');
      }

      let token;
      let payload;

      try {
        [, token] = auth.split(' ');
        payload = await jwtUtility.decode(token, ignoreExpiration);
      } catch (err) {
        throw new Errors.ForbiddenError('JWT token is invalid.');
      }

      if (!payload.user_id || !payload.role) {
        throw new Errors.InternalServerError('JWT token contents are unrecognizable.');
      }

      req.user_id = payload.user_id;
      req.role = payload.role;

      next();
    } catch (err) {
      returnObject.setError(err.message);
      res.status(err.statusCode).json(returnObject);
    }
  };
};
