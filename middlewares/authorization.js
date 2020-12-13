module.exports = function(roles = []) {
  return function(req, res, next) {
    var role = req.session.role;

    if(role && roles.includes(role))
      next();
    else {
      res.status(403);
      res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': '403 Forbidden.'});
    }
  };
};
