module.exports = function(dbConnection) {
  return {
    async create(uname, password, role, name, email) {
      const sql = 'INSERT INTO `user` \
                               (`uname`, \
                                `password`, \
                                `role`, \
                                `name`, \
                                `email`) \
                   VALUES      (?, ?, ?, ?, ?)';
      const [result] = await dbConnection.execute(sql, [uname, password, role, name, email]);

      return result;
    },
    async linkWithGitHub(id, gid) {
      const sql = 'INSERT INTO `user_github` \
                               (`id`, `github_id`) \
                   VALUES      (?, ?)';
      const [result] = await dbConnection.execute(sql, [id, gid]);

      return result;
    },
    async getInfo(id) {
      const sql = 'SELECT `user`.`id`, \
                          `github_id`, \
                          `uname`, \
                          `user`.`name`, \
                          `email`, \
                          `role`, \
                          `role`.`name` AS "rname" \
                   FROM   `user` \
                          LEFT JOIN `role` \
                                 ON `user`.`role` = `role`.`id` \
                          LEFT JOIN `user_github` \
                                 ON `user`.`id` = `user_github`.`id` \
                   WHERE  `user`.`id` = ?';
      const [rows] = await dbConnection.execute(sql, [id]);

      if (rows.length === 0) {
        return {};
      }

      return rows[0];
    },
    async getAllInfo() {
      const sql = 'SELECT `user`.`id`, \
                          `uname`, \
                          `user`.`name`, \
                          `email`, \
                          `role`, \
                          `role`.`name` AS "rname", \
                          `last_login_time` \
                   FROM   `user` \
                          LEFT JOIN `role` \
                                 ON `user`.`role` = `role`.`id`';
      const [rows] = await dbConnection.execute(sql);

      return rows;
    },
    async updateInfo(id, uname, name, email) {
      const sql = 'UPDATE `user` \
                   SET    `uname` = ?, \
                          `name` = ?, \
                          `email` = ?, \
                          `last_update_time` = NOW() \
                   WHERE  `id` = ?';
      const [result] = await dbConnection.execute(sql, [uname, name, email, id]);

      return result;
    },
    async updateInfoFromAdmin(id, name, email, role) {
      const sql = 'UPDATE `user` \
                   SET    `name` = ?, \
                          `email` = ?, \
                          `role` = ?, \
                          `last_update_time` = NOW() \
                   WHERE  `id` = ?';
      const [result] = await dbConnection.execute(sql, [name, email, role, id]);

      return result;
    },
    async compareRefreshToken(id, refreshToken) {
      const sql = 'SELECT `id`, \
                          `role`, \
                          `name` \
                   FROM   `user` \
                   WHERE  `id` = ? \
                          AND `refresh_token` = ? \
                          AND `token_expires_in` > NOW()';
      const [rows] = await dbConnection.execute(sql, [id, refreshToken]);

      if (rows.length === 0) {
        return {};
      }

      return rows[0];
    },
    async updateRefreshToken(id, token, expiresIn) {
      const sql = 'UPDATE `user` \
                   SET    `refresh_token` = ?, \
                          `token_expires_in` = ?, \
                          `last_login_time` = NOW() \
                   WHERE  `id` = ?';
      const [result] = await dbConnection.execute(sql, [token, expiresIn, id]);

      return result;
    },
    async getLoginInfo(uname) {
      const sql = 'SELECT `id`, \
                          `uname`, \
                          `password`, \
                          `role`, \
                          `name` \
                   FROM   `user` \
                   WHERE  `uname` = ?';
      const [rows] = await dbConnection.execute(sql, [uname]);

      if (rows.length === 0) {
        return {};
      }

      return rows[0];
    },
    async getGitHubLoginInfo(id) {
      const sql = 'SELECT `user`.`id`, \
                          `github_id`, \
                          `uname`, \
                          `role`, \
                          `name` \
                   FROM   `user_github` \
                          LEFT JOIN `user` \
                                 ON `user_github`.`id` = `user`.`id` \
                   WHERE  `github_id` = ?';
      const [rows] = await dbConnection.execute(sql, [id]);

      if (rows.length === 0) {
        return {};
      }

      return rows[0];
    },
    async updatePassword(id, passwordNew) {
      const sql = 'UPDATE `user` \
                   SET    `password` = ?, \
                          `last_update_time` = NOW() \
                   WHERE  `id` = ?';
      const [result] = await dbConnection.execute(sql, [passwordNew, id]);

      return result;
    },
    async revokeRefreshToken(id) {
      const sql = 'UPDATE `user` \
                   SET    `refresh_token` = "", \
                          `token_expires_in` = NULL \
                   WHERE  `id` = ?';
      const [result] = await dbConnection.execute(sql, [id]);

      return result;
    },
  };
};
