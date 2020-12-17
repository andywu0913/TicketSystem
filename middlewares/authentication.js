var jwt = require(__projdir + '/utils/jwt');

module.exports = async function(req, res, next) {
  var auth = req.headers.authorization;

  if(!auth) {
    res.status(401);
    return res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': '401 Unauthorized.'});
  }

  try {
    var token = auth.split(' ')[1];
    var payload = await jwt.decode(token);
  }
  catch (err) {
    res.status(401);
    return res.json({'successful': false, 'data': [], 'error_field': [], 'error_msg': 'JWT token is invalid.'});
  }

  if(!payload.user_id || !payload.role) {
    res.status(500);
    return res.json({'successful': false, 'data': [], 'error_field': ['user_id', 'role'], 'error_msg': 'JWT token contents are unrecognizable.'});
  }

  req.user_id = payload.user_id;
  req.role = payload.role;
  
  next();
};