const connectDB = require('../../persistence/config/db');

/**
 * Resets the AUTO_INCREMENT value for a given table.
 * If total rows === 0, resets AUTO_INCREMENT to 1.
 * If total rows > 0, sets AUTO_INCREMENT to MAX(primaryKey) + 1.
 */
async function resetAutoIncrement(tableName, primaryKeyColumn = 'id') {
  try {
    const sequelize = connectDB.sequelize;
    const [results] = await sequelize.query(`SELECT COUNT(*) as total FROM \`${tableName}\``);
    const total = results && results[0] ? parseInt(results[0].total || 0, 10) : 0;
    
    if (total === 0) {
      await sequelize.query(`ALTER TABLE \`${tableName}\` AUTO_INCREMENT = 1;`);
    } else if (primaryKeyColumn) {
      const [maxRes] = await sequelize.query(`SELECT IFNULL(MAX(\`${primaryKeyColumn}\`), 0) + 1 as nextId FROM \`${tableName}\``);
      const nextId = maxRes && maxRes[0] ? parseInt(maxRes[0].nextId || 1, 10) : 1;
      await sequelize.query(`ALTER TABLE \`${tableName}\` AUTO_INCREMENT = ${nextId};`);
    }
  } catch (err) {
    console.warn(`Error resetting auto increment for ${tableName}:`, err.message);
  }
}

module.exports = { resetAutoIncrement };
