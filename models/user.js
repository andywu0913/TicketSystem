module.exports = function(dbConnection) {
  return {
    create: async function(uname, password, role, name, email) {
      var sql = 'INSERT INTO `user` (`uname`, `password`, `role`, `name`, `email`) \
                 VALUES (?, ?, ?, ?, ?)';
      var [result, _] = await dbConnection.execute(sql, [uname, hashPassword(password), role, name, email]);

      return result;
    },
    getInfo: async function(id) {
      var sql = 'SELECT `user`.`id`, `uname`, `user`.`name`, `email`, `role`, `role`.`name` AS "rname" \
                 FROM `user` \
                 LEFT JOIN `role` ON `user`.`role` = `role`.`id` \
                 WHERE `user`.`id` = ?';
      var [rows, fields] = await dbConnection.execute(sql, [id]);

      if(rows.length === 0)
        return {};

      return rows[0];
    },
    updateInfo: async function(id, uname, name, email) {
      var sql = 'UPDATE `user` \
                 SET `uname` = ?, `name` = ?, `email`= ?, `last_update_time` = NOW() \
                 WHERE `id` = ?';
      var [result, _] = await dbConnection.execute(sql, [uname, name, email, id]);

      return result;
    },
    compareRefreshToken: async function(id, refreshToken) {
      var sql = 'SELECT `id`, `role` \
                 FROM `user` \
                 WHERE `id` = ? AND refresh_token` = ? AND `token_expires_in` > NOW()';
      var [rows, fields] = await dbConnection.execute(sql, [id, refreshToken]);
        
      if(rows.length === 0)
        return {};

      return rows[0];
    },
    updateRefreshToken: async function(id, token, expiresIn) {
      var sql = 'UPDATE `user` \
                 SET `refresh_token` = ?, `token_expires_in` = ?, `last_login_time` = NOW() \
                 WHERE `id` = ?';
      var [result, _] = await dbConnection.execute(sql, [token, expiresIn, id]);

      return result;
    },
    getLoginInfo: async function(uname) {
      var sql = 'SELECT `id`, `uname`, `password`, `role` \
                 FROM `user` \
                 WHERE `uname` = ?';
      var [rows, fields] = await dbConnection.execute(sql, [uname]);

      if(rows.length === 0)
        return {};

      return rows[0];
    },
    updatePassword: async function(id, passwordNew) {
      var sql = 'UPDATE `user` SET `password` = ?, `last_update_time` = NOW() WHERE `id` = ?';
      var [result, _] = await dbConnection.execute(sql, [passwordNew, id]);

      return result;
    }
  };
};
