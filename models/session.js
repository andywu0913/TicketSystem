module.exports = function(dbConnection) {
  return {
    create: async function(eventId, time, address, ticketSellTimeOpen, ticketSellTimeEnd, maxSeats, price) {
      const sql = 'INSERT INTO `session` (`event_id`, `time`, `address`, `ticket_sell_time_open`, `ticket_sell_time_end`, `max_seats`, `price`) \
                   VALUES (?, ?, ?, ?, ?, ?, ?)';
      let [result, _] = await dbConnection.execute(sql, [eventId, time, address, ticketSellTimeOpen, ticketSellTimeEnd, maxSeats, price]);

      return result;
    },
    getAllByEventId: async function(eventId) {
      const sql = 'SELECT `id`, `event_id`, `time`, `address`, `ticket_sell_time_open`, `ticket_sell_time_end`, `max_seats`, `price`, `is_active` \
                   FROM `session` \
                   WHERE `event_id` = ? \
                   ORDER BY `time`';
      let [rows, fields] = await dbConnection.execute(sql, [eventId]);

      return rows;
    },
    get: async function(id) {
      const sql = 'SELECT `event_id`, `name`, `session`.`id` AS "session_id", `time`, `address`, `ticket_sell_time_open`, `ticket_sell_time_end`, `max_seats`, `price`, `creator_uid`, `is_active` \
                   FROM `session` \
                   LEFT JOIN `event` ON `session`.`event_id` = `event`.`id` \
                   WHERE `session`.`id` = ?';
      let [rows, fields] = await dbConnection.execute(sql, [id]);

      if(rows.length === 0)
        return {};

      return rows[0];
    },
    activation: async function(id, activation) {
      const sql = 'UPDATE `session` \
                   SET `is_active`= ? \
                   WHERE `id` = ?';
      let [result, _] = await dbConnection.execute(sql, [activation, id]);

      return result;
    },
    update: async function(id, time, address, ticketSellTimeOpen, ticketSellTimeEnd, maxSeats, price) {
      const sql = 'UPDATE `session` \
                   SET `time`= ?,`address`= ?,`ticket_sell_time_open`= ?,`ticket_sell_time_end`= ?,`max_seats`= ?,`price`= ? \
                   WHERE `id` = ?';
      let [result, _] = await dbConnection.execute(sql, [time, address, ticketSellTimeOpen, ticketSellTimeEnd, maxSeats, price, id]);

      return result;
    },
    delete: async function(id) {
      const sql = 'DELETE FROM `session` WHERE `id` = ?';
      let [result, _] = await dbConnection.execute(sql, [id]);

      return result;
    }
  };
};
