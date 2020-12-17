var crypto = require("crypto");

module.exports = function(dbConnection) {

  function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  return {
    create: async function(uname, password, role, name, email) {
      var sql = 'INSERT INTO `user` (`uname`, `password`, `role`, `name`, `email`) VALUES (?, ?, ?, ?, ?)';
      var [result, _] = await dbConnection.query(sql, [uname, hashPassword(password), role, name, email]);

      return result;
    },
    authenticate: async function(uname, password) {
      var sql = 'SELECT `user`.`id`, `uname`, `user`.`name`, `role`, `role`.`name` AS "rname" \
                 FROM `user` \
                 LEFT JOIN `role` \
                 ON `user`.`role` = `role`.`id` \
                 WHERE `uname` = ? AND `password` = ?';
      var [rows, fields] = await dbConnection.query(sql, [uname, hashPassword(password)]);

      if(rows.length === 0)
        return {};

      return rows[0];
    },
    compareRefreshToken: async function(id, refreshToken) {
      var sql = 'SELECT `id`, `role` \
                 FROM `user` \
                 WHERE `id` = ? AND `refresh_token` = ? AND `token_expires_in` > NOW()';
      var [rows, fields] = await dbConnection.query(sql, [id, refreshToken]);
        
      if(rows.length === 0)
        return {};

      return rows[0];
    },
    updateRefreshToken: async function(id, token, expiresIn) {
      var sql = 'UPDATE `user` SET \
                   `refresh_token` = ?, \
                   `token_expires_in` = ?, \
                   `last_login_time` = CURRENT_TIMESTAMP() \
                 WHERE `id` = ?';
      var [result, _] = await dbConnection.query(sql, [token, expiresIn, id]);

      return result;
    },
    getInfo: async function(id) {
      var sql = 'SELECT `user`.`id`, `uname`, `user`.`name`, `email`, `role`, `role`.`name` AS "rname" \
                 FROM `user` \
                 LEFT JOIN `role` \
                 ON `user`.`role` = `role`.`id` \
                 WHERE `user`.`id` = ?';
      var [rows, fields] = await dbConnection.query(sql, [id]);

      if(rows.length === 0)
        return {};

      return rows[0];
    },
    updateInfo: async function(id, uname, name, email) {
      var sql = 'UPDATE `user` SET `uname` = ?, `name` = ?, `email`= ?, `last_update_time` = CURRENT_TIMESTAMP() WHERE `id` = ?';
      var [result, _] = await dbConnection.query(sql, [uname, name, email, id]);

      return result;
    },
    updatePassword: async function(id, passwordNew) {
      var sql = 'UPDATE `user` SET `password` = ?, `last_update_time` = CURRENT_TIMESTAMP() WHERE `id` = ?';
      var [result, _] = await dbConnection.query(sql, [hashPassword(passwordNew), id]);
      
      return result;
    }
  };
};
