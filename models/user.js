module.exports = function(dbConnection) {
  return {
    create: async function(uname, password, role, name, email) {
      const sql = 'INSERT INTO `user` (`uname`, `password`, `role`, `name`, `email`) \
                   VALUES (?, ?, ?, ?, ?)';
      let [result, _] = await dbConnection.execute(sql, [uname, password, role, name, email]);

      return result;
    },
    linkWithGitHub: async function(id, gid) {
      const sql = 'INSERT INTO `user_github` (`id`, `github_id`) \
                   VALUES (?, ?)';
      let [result, _] = await dbConnection.execute(sql, [id, gid]);

      return result;
    },
    getInfo: async function(id) {
      const sql = 'SELECT `user`.`id`, `uname`, `user`.`name`, `email`, `role`, `role`.`name` AS "rname" \
                   FROM `user` \
                   LEFT JOIN `role` ON `user`.`role` = `role`.`id` \
                   WHERE `user`.`id` = ?';
      let [rows, fields] = await dbConnection.execute(sql, [id]);

      if(rows.length === 0)
        return {};

      return rows[0];
    },
    getAllInfo: async function() {
      const sql = 'SELECT `user`.`id`, `uname`, `user`.`name`, `email`, `role`, `role`.`name` AS "rname", `last_login_time` \
                   FROM `user` \
                   LEFT JOIN `role` ON `user`.`role` = `role`.`id`';
      let [rows, fields] = await dbConnection.execute(sql);

      return rows;
    },
    updateInfo: async function(id, uname, name, email) {
      const sql = 'UPDATE `user` \
                   SET `uname` = ?, `name` = ?, `email`= ?, `last_update_time` = NOW() \
                   WHERE `id` = ?';
      let [result, _] = await dbConnection.execute(sql, [uname, name, email, id]);

      return result;
    },
    updateInfoFromAdmin: async function(id, name, email, role) {
      const sql = 'UPDATE `user` \
                   SET `name` = ?, `email`= ?, `role` = ?, `last_update_time` = NOW() \
                   WHERE `id` = ?';
      let [result, _] = await dbConnection.execute(sql, [name, email, role, id]);

      return result;
    },
    compareRefreshToken: async function(id, refreshToken) {
      const sql = 'SELECT `id`, `role`, `name` \
                   FROM `user` \
                   WHERE `id` = ? AND `refresh_token` = ? AND `token_expires_in` > NOW()';
      let [rows, fields] = await dbConnection.execute(sql, [id, refreshToken]);

      if(rows.length === 0)
        return {};

      return rows[0];
    },
    updateRefreshToken: async function(id, token, expiresIn) {
      const sql = 'UPDATE `user` \
                   SET `refresh_token` = ?, `token_expires_in` = ?, `last_login_time` = NOW() \
                   WHERE `id` = ?';
      let [result, _] = await dbConnection.execute(sql, [token, expiresIn, id]);

      return result;
    },
    getLoginInfo: async function(uname) {
      const sql = 'SELECT `id`, `uname`, `password`, `role`, `name` \
                   FROM `user` \
                   WHERE `uname` = ?';
      let [rows, fields] = await dbConnection.execute(sql, [uname]);

      if(rows.length === 0)
        return {};

      return rows[0];
    },
    getGitHubLoginInfo: async function(id) {
      const sql = 'SELECT `user`.`id`, `github_id`, `uname`, `role`, `name` \
                   FROM `user_github` \
                   LEFT JOIN `user` ON `user_github`.`id` = `user`.`id` \
                   WHERE `github_id` = ?';
      let [rows, fields] = await dbConnection.execute(sql, [id]);

      if(rows.length === 0)
        return {};

      return rows[0];
    },
    updatePassword: async function(id, passwordNew) {
      const sql = 'UPDATE `user` SET `password` = ?, `last_update_time` = NOW() WHERE `id` = ?';
      let [result, _] = await dbConnection.execute(sql, [passwordNew, id]);

      return result;
    },
    revokeRefreshToken: async function(id) {
      const sql = 'UPDATE `user` SET `refresh_token` = "", `token_expires_in` = NULL WHERE `id` = ?';
      let [result, _] = await dbConnection.execute(sql, [id]);

      return result;
    }
  };
};
