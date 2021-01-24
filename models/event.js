module.exports = function(dbConnection) {
  return {
    create: async function(name, description, startDate, endDate, creatorUid) {
      const sql = 'INSERT INTO `event` (`name`, `description`, `start_date`, `end_date`, `creator_uid`) \
                   VALUES (?, ?, ?, ?, ?)';
      let [result, _] = await dbConnection.execute(sql, [name, description, startDate, endDate, creatorUid]);

      return result;
    },
    getMultiple: async function(startId, rowCounts) {
      let sql;
      let params;

      if(startId) {
        sql = 'SELECT `id`, `name`, `description`, `start_date`, `end_date` \
               FROM `event` \
               WHERE `id` < ? \
               ORDER BY `id` DESC \
               LIMIT ?';
        params = [startId, rowCounts];
      }
      else {
        sql = 'SELECT `id`, `name`, `description`, `start_date`, `end_date` \
               FROM `event` \
               ORDER BY `id` DESC \
               LIMIT ?';
        params = [rowCounts];
      }

      let [rows, fields] = await dbConnection.execute(sql, params);

      return rows;
    },
    getMultipleByCreator: async function(creator) {
      sql = 'SELECT `id`, `name`, `description`, `start_date`, `end_date`, `create_time` \
             FROM `event` \
             WHERE `creator_uid` = ? \
             ORDER BY `id` DESC';
      let [rows, fields] = await dbConnection.execute(sql, [creator]);

      return rows;
    },
    get: async function(id) {
      const sql = 'SELECT `id`, `name`, `description`, `start_date`, `end_date`, `creator_uid` \
                   FROM `event` \
                   WHERE `id` = ?';
      let [rows, fields] = await dbConnection.execute(sql, [id]);

      if(rows.length === 0)
        return {};

      return rows[0];
    },
    update: async function(id, name, description, startDate, endDate) {
      const sql = 'UPDATE `event` \
                   SET `name` = ?, `description` = ?, `start_date` = ?, `end_date` = ? \
                   WHERE `id` = ?';
      let [result, _] = await dbConnection.execute(sql, [name, description, startDate, endDate, id]);

      return result;
    },
    delete: async function(id) {
      const sql = 'DELETE FROM `event` WHERE `id` = ?';
      let [result, _] = await dbConnection.execute(sql, [id]);

      return result;
    }
  };
};
