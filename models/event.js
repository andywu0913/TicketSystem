module.exports = function(dbConnection) {
  return {
    create: async function(name, description, startDate, endDate, creatorUid) {
      var sql = 'INSERT INTO `event` (`name`, `description`, `start_date`, `end_date`, `creator_uid`) VALUES (?, ?, ?, ?, ?)';
      var [result, _] = await dbConnection.query(sql, [name, description, startDate, endDate, creatorUid]);
      
      return result;
    },
    getMultiple: async function(startId, rowCounts) {
      if(startId) {
        var sql = 'SELECT `id`, `name`, `description`, `start_date`, `end_date` FROM `event` WHERE `id` < ? ORDER BY `id` DESC LIMIT ?';
        var params = [startId, rowCounts];
      }
      else {
        var sql = 'SELECT `id`, `name`, `description`, `start_date`, `end_date` FROM `event`                ORDER BY `id` DESC LIMIT ?';
        var params = [rowCounts];
      }

      var [rows, fields] = await dbConnection.query(sql, params);
      
      return rows;
    },
    get: async function(id) {
      var sql = 'SELECT `id`, `name`, `description`, `start_date`, `end_date`, `creator_uid` FROM `event` WHERE `id` = ?';
      var [rows, fields] = await dbConnection.query(sql, [id]);

      if(rows.length === 0)
        return {};

      return rows[0];
    },
    update: async function(id, name, description, startDate, endDate) {
      var sql = 'UPDATE `event` SET `name` = ?, `description` = ?, `start_date` = ?, `end_date` = ? WHERE `id` = ?';
      var [result, _] = await dbConnection.query(sql, [name, description, startDate, endDate, id]);
      
      return result;
    },
    delete: async function(id) {
      var sql = 'DELETE FROM `event` WHERE `id` = ?';
      var [result, _] = await dbConnection.query(sql, [id]);
      
      return result;
    }
  };
};
