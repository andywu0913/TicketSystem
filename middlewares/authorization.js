module.exports = function(roles = []) {
  return function(req, res, next) {
    var role = req.role;

    if(!role || !roles.includes(role)) {
      res.status(403);
      res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': '403 Forbidden.'});
    }

    next();
  };
};
