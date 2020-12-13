module.exports = function(req, res, next) {
  var user_id = req.session.user_id;
  if(!user_id) {
    res.status(401);
    return res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': '401 Unauthorized.'});
  }
  next();
};
