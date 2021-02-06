module.exports = function(dbConnection) {
  return {
    async create(name, description, startDate, endDate, creatorUid) {
      const sql = 'INSERT INTO `event` \
                               (`name`, \
                                `description`, \
                                `start_date`, \
                                `end_date`, \
                                `creator_uid`) \
                   VALUES      (?, ?, ?, ?, ?)';
      const [result] = await dbConnection.execute(sql, [name, description, startDate, endDate, creatorUid]);

      return result;
    },
    async getMultiple(startId, rowCounts) {
      const params = [];
      let sql = 'SELECT `id`, \
                        `name`, \
                        `description`, \
                        `start_date`, \
                        `end_date` \
                 FROM   `event` ';
      if (startId) {
        sql += 'WHERE  `id` < ? ';
        params.push(startId);
      }
      sql += 'ORDER BY `id` DESC \
              LIMIT ?';
      params.push(rowCounts);

      const [rows] = await dbConnection.execute(sql, params);

      return rows;
    },
    async getMultipleByCreator(creator) {
      const sql = 'SELECT `id`, \
                          `name`, \
                          `description`, \
                          `start_date`, \
                          `end_date`, \
                          `create_time` \
                   FROM   `event` \
                   WHERE  `creator_uid` = ? \
                   ORDER BY `id` DESC';
      const [rows] = await dbConnection.execute(sql, [creator]);

      return rows;
    },
    async get(id) {
      const sql = 'SELECT `id`, \
                          `name`, \
                          `description`, \
                          `start_date`, \
                          `end_date`, \
                          `creator_uid` \
                   FROM   `event` \
                   WHERE  `id` = ?';
      const [rows] = await dbConnection.execute(sql, [id]);

      if (rows.length === 0) {
        return {};
      }

      return rows[0];
    },
    async update(id, name, description, startDate, endDate) {
      const sql = 'UPDATE `event` \
                   SET    `name` = ?, \
                          `description` = ?, \
                          `start_date` = ?, \
                          `end_date` = ? \
                   WHERE  `id` = ?';
      const [result] = await dbConnection.execute(sql, [name, description, startDate, endDate, id]);

      return result;
    },
    async delete(id) {
      const sql = 'DELETE FROM `event` \
                   WHERE  `id` = ?';
      const [result] = await dbConnection.execute(sql, [id]);

      return result;
    },
  };
};
