module.exports = function(dbConnection) {
  return {
    create: async function(eventId, time, address, ticketSellTimeOpen, ticketSellTimeEnd, maxSeats, price) {
      var sql = 'INSERT INTO `session`(`event_id`, `time`, `address`, `ticket_sell_time_open`, `ticket_sell_time_end`, `max_seats`, `price`) VALUES (?, ?, ?, ?, ?, ?, ?)';
      var [result, _] = await dbConnection.execute(sql, [eventId, time, address, ticketSellTimeOpen, ticketSellTimeEnd, maxSeats, price]);
      
      return result;
    },
    getAllByEventId: async function(eventId) {
      var sql = 'SELECT `id`, `event_id`, `time`, `address`, `ticket_sell_time_open`, `ticket_sell_time_end`, `max_seats`, `price` \
                 FROM `session` \
                 WHERE `event_id` = ? \
                 ORDER BY `time`';
      var [rows, fields] = await dbConnection.execute(sql, [eventId]);
      
      return rows;
    },
    get: async function(sessionId) {
      var sql = 'SELECT `event_id`, `name`, `session`.`id` AS "session_id", `time`, `address`, `ticket_sell_time_open`, `ticket_sell_time_end`, `max_seats`, `price`, `creator_uid` \
                 FROM `session`  \
                 LEFT JOIN `event` \
                 ON `session`.`event_id` = `event`.`id` \
                 WHERE `session`.`id` = ? \
                 ORDER BY `time`';
      var [rows, fields] = await dbConnection.execute(sql, [sessionId]);
      
      if(rows.length === 0)
        return {};

      return rows[0];
    },
    update: async function(id, time, address, ticketSellTimeOpen, ticketSellTimeEnd, maxSeats, price) {
      var sql = 'UPDATE `session` SET `time`= ?,`address`= ?,`ticket_sell_time_open`= ?,`ticket_sell_time_end`= ?,`max_seats`= ?,`price`= ? WHERE `id` = ?';
      var [result, _] = await dbConnection.execute(sql, [time, address, ticketSellTimeOpen, ticketSellTimeEnd, maxSeats, price, id]);
      
      return result;
    },
    delete: async function(id) {
      var sql = 'DELETE FROM `session` WHERE `id` = ?';
      var [result, _] = await dbConnection.execute(sql, [id]);
      
      return result;
    },
  };
};
