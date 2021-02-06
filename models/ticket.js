module.exports = function(dbConnection) {
  return {
    async create(id, sessionId, seatNo) {
      const sql = 'INSERT INTO `ticket` \
                               (`user_id`, \
                                `session_id`, \
                                `seat_no`) \
                   VALUES      (?, ?, ?)';
      const [result] = await dbConnection.execute(sql, [id, sessionId, seatNo]);

      return result;
    },
    async countTicket(sessionId) {
      const sql = 'SELECT COUNT(*) AS "count" \
                   FROM   `ticket` \
                   WHERE  `session_id` = ?';
      const [rows] = await dbConnection.execute(sql, [sessionId]);

      return rows[0].count;
    },
    async getAllBySessionId(sessionId) {
      const sql = 'SELECT `ticket`.`id`, \
                          `session_id`, \
                          `user_id`, \
                          `name`, \
                          `email`, \
                          `seat_no`, \
                          `create_time` AS "book_time" \
                   FROM   `ticket` \
                          LEFT JOIN `user` \
                                 ON `ticket`.`user_id` = `user`.`id` \
                   WHERE  `session_id` = ? \
                   ORDER  BY `seat_no`';
      const [rows] = await dbConnection.execute(sql, [sessionId]);

      return rows;
    },
    async getAllByUserId(userId) {
      const sql = 'SELECT `ticket`.`id`, \
                          `event_id`, \
                          `name`, \
                          `creator_uid` AS "event_creator_uid", \
                          `session_id`, \
                          `time`, \
                          `address`, \
                          `price`, \
                          `user_id`, \
                          `seat_no`, \
                          `ticket`.`create_time`, \
                          `is_active`   AS "session_is_active" \
                   FROM   `ticket` \
                          LEFT JOIN `session` \
                                 ON `ticket`.`session_id` = `session`.`id` \
                          LEFT JOIN `event` \
                                 ON `session`.`event_id` = `event`.`id` \
                   WHERE  `user_id` = ? \
                   ORDER  BY `create_time` DESC';
      const [rows] = await dbConnection.execute(sql, [userId]);

      return rows;
    },
    async get(id) {
      const sql = 'SELECT `ticket`.`id`, \
                          `event_id`, \
                          `name`, \
                          `creator_uid` AS "event_creator_uid", \
                          `session_id`, \
                          `time`, \
                          `address`, \
                          `price`, \
                          `user_id`, \
                          `seat_no`, \
                          `ticket`.`create_time`, \
                          `is_active`   AS "session_is_active" \
                   FROM   `ticket` \
                          LEFT JOIN `session` \
                                 ON `ticket`.`session_id` = `session`.`id` \
                          LEFT JOIN `event` \
                                 ON `session`.`event_id` = `event`.`id` \
                   WHERE  `ticket`.`id` = ?';
      const [rows] = await dbConnection.execute(sql, [id]);

      if (rows.length === 0) {
        return {};
      }

      return rows[0];
    },
    async update(id, seatNo) {
      const sql = 'UPDATE `ticket` \
                   SET    `seat_no`= ? \
                   WHERE  `id` = ?';
      const [result] = await dbConnection.execute(sql, [seatNo, id]);

      return result;
    },
    async delete(id) {
      const sql = 'DELETE FROM `ticket` \
                   WHERE  `id` = ?';
      const [result] = await dbConnection.execute(sql, [id]);

      return result;
    },
  };
};
