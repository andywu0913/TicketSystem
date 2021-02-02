module.exports = function(dbConnection) {
  return {
    create: async function(id, sessionId, seatNo) {
      const sql = 'INSERT INTO `ticket` (`user_id`, `session_id`, `seat_no`) \
                   VALUES (?, ?, ?)';
      let [result, _] = await dbConnection.execute(sql, [id, sessionId, seatNo]);

      return result;
    },
    countTicket: async function(sessionId) {
      const sql = 'SELECT COUNT(*) AS "count"\
                   FROM `ticket` \
                   WHERE `session_id` = ?';
      let [rows, fields] = await dbConnection.execute(sql, [sessionId]);

      return rows[0]['count'];
    },
    getAllBySessionId: async function(sessionId) {
      const sql = 'SELECT `ticket`.`id`, `session_id`, `user_id`, `name`, `email`, `seat_no`, `create_time` AS "book_time" \
                   FROM `ticket` \
                   LEFT JOIN `user` ON `ticket`.`user_id` = `user`.`id` \
                   WHERE `session_id` = ? \
                   ORDER BY `seat_no`';
      let [rows, fields] = await dbConnection.execute(sql, [sessionId]);

      return rows;
    },
    getAllByUserId: async function(userId) {
      const sql = 'SELECT `ticket`.`id`, `event_id`, `name`, `creator_uid` AS "event_creator_uid", `session_id`, `time`, `address`, `price`, `user_id`, `seat_no`, `ticket`.`create_time`, `is_active` AS "session_is_active" \
                   FROM `ticket` \
                   LEFT JOIN `session` ON `ticket`.`session_id` = `session`.`id` \
                   LEFT JOIN `event` ON `session`.`event_id` = `event`.`id` \
                   WHERE `user_id` = ? \
                   ORDER BY `create_time` DESC';
      let [rows, fields] = await dbConnection.execute(sql, [userId]);

      return rows;
    },
    get: async function(id) {
      const sql = 'SELECT `ticket`.`id`, `event_id`, `name`, `creator_uid` AS "event_creator_uid", `session_id`, `time`, `address`, `price`, `user_id`, `seat_no`, `ticket`.`create_time`, `is_active` AS "session_is_active" \
                   FROM `ticket` \
                   LEFT JOIN `session` ON `ticket`.`session_id` = `session`.`id` \
                   LEFT JOIN `event` ON `session`.`event_id` = `event`.`id` \
                   WHERE `ticket`.`id` = ?';
      let [rows, fields] = await dbConnection.execute(sql, [id]);

      if(rows.length === 0)
        return {};

      return rows[0];
    },
    update: async function(id, seatNo) {
      const sql = 'UPDATE `ticket` \
                   SET `seat_no`= ? \
                   WHERE `id` = ?';
      let [result, _] = await dbConnection.execute(sql, [seatNo, id]);

      return result;
    },
    delete: async function(id) {
      const sql = 'DELETE FROM `ticket` WHERE `id` = ?';
      let [result, _] = await dbConnection.execute(sql, [id]);

      return result;
    }
  };
};
