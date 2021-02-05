module.exports = function Session(dbConnection) {
  return {
    async create(eventId, time, address, ticketSellTimeOpen, ticketSellTimeEnd, maxSeats, price) {
      const sql = 'INSERT INTO `session` \
                              (`event_id`, \
                               `time`, \
                               `address`, \
                               `ticket_sell_time_open`, \
                               `ticket_sell_time_end`, \
                               `max_seats`, \
                               `price`) \
                   VALUES     (?, ?, ?, ?, ?, ?, ?)';
      const [result] = await dbConnection.execute(sql, [eventId, time, address, ticketSellTimeOpen, ticketSellTimeEnd, maxSeats, price]);

      return result;
    },
    async getAllByEventId(eventId) {
      const sql = 'SELECT `id`, \
                          `event_id`, \
                          `time`, \
                          `address`, \
                          `ticket_sell_time_open`, \
                          `ticket_sell_time_end`, \
                          `max_seats`, \
                          `price`, \
                          `is_active` \
                   FROM   `session` \
                   WHERE  `event_id` = ? \
                   ORDER BY `time`';
      const [rows] = await dbConnection.execute(sql, [eventId]);

      return rows;
    },
    async get(id) {
      const sql = 'SELECT `event_id`, \
                          `start_date`, \
                          `end_date`, \
                          `name`, \
                          `session`.`id` AS "session_id", \
                          `time`, \
                          `address`, \
                          `ticket_sell_time_open`, \
                          `ticket_sell_time_end`, \
                          `max_seats`, \
                          `price`, \
                          `creator_uid`, \
                          `is_active` \
                   FROM   `session` \
                          LEFT JOIN `event` \
                                 ON `session`.`event_id` = `event`.`id` \
                   WHERE  `session`.`id` = ?';
      const [rows] = await dbConnection.execute(sql, [id]);

      if (rows.length === 0) {
        return {};
      }

      return rows[0];
    },
    async activation(id, activation) {
      const sql = 'UPDATE `session` \
                   SET    `is_active`= ? \
                   WHERE  `id` = ?';
      const [result] = await dbConnection.execute(sql, [activation, id]);

      return result;
    },
    async update(id, time, address, ticketSellTimeOpen, ticketSellTimeEnd, maxSeats, price) {
      const sql = 'UPDATE `session` \
                   SET    `time` = ?, \
                          `address` = ?, \
                          `ticket_sell_time_open` = ?, \
                          `ticket_sell_time_end` = ?, \
                          `max_seats` = ?, \
                          `price` = ? \
                   WHERE  `id` = ?';
      const [result] = await dbConnection.execute(sql, [time, address, ticketSellTimeOpen, ticketSellTimeEnd, maxSeats, price, id]);

      return result;
    },
    async delete(id) {
      const sql = 'DELETE FROM `session` \
                   WHERE  `id` = ?';
      const [result] = await dbConnection.execute(sql, [id]);

      return result;
    },
  };
};
