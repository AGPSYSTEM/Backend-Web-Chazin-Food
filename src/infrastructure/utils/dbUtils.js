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

/**
 * Resequences primary key IDs consecutively (1, 2, 3...) when a row is deleted.
 * Also updates foreign key references in child tables.
 * Finally resets AUTO_INCREMENT to MAX + 1 (or 1 if empty).
 */
async function resequenceTableIds(tableName, primaryKeyColumn = 'id', fkTables = []) {
  try {
    const sequelize = connectDB.sequelize;
    const [rows] = await sequelize.query(`SELECT \`${primaryKeyColumn}\` FROM \`${tableName}\` ORDER BY \`${primaryKeyColumn}\` ASC`);
    
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    let newId = 1;
    for (const r of rows) {
      const oldId = r[primaryKeyColumn];
      if (oldId !== newId) {
        await sequelize.query(`UPDATE \`${tableName}\` SET \`${primaryKeyColumn}\` = ? WHERE \`${primaryKeyColumn}\` = ?`, { replacements: [newId, oldId] });
        for (const fkItem of fkTables) {
          const table = typeof fkItem === 'string' ? fkItem : fkItem.table;
          const column = typeof fkItem === 'string' ? primaryKeyColumn : fkItem.column;
          await sequelize.query(`UPDATE \`${table}\` SET \`${column}\` = ? WHERE \`${column}\` = ?`, { replacements: [newId, oldId] });
        }
      }
      newId++;
    }
    
    await sequelize.query(`ALTER TABLE \`${tableName}\` AUTO_INCREMENT = ${newId};`);
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  } catch (err) {
    console.warn(`Error resequencing IDs for ${tableName}:`, err.message);
  }
}

/**
 * Resequences all core system tables so IDs remain strictly continuous (1, 2, 3...)
 */
async function resequenceAllCoreTables() {
  try {
    await resequenceTableIds('fichatecnica', 'idFichaTecnica', [{ table: 'detallefichainsumo', column: 'idFichaTecnica' }]);
    await resequenceTableIds('insumo', 'idInsumo', [{ table: 'detallefichainsumo', column: 'idInsumo' }, { table: 'detallecomprainsumo', column: 'idInsumo' }]);
    await resequenceTableIds('producto', 'idProducto', [{ table: 'fichatecnica', column: 'idProducto' }, { table: 'variante', column: 'idProducto' }]);
    await resequenceTableIds('proveedor', 'idProveedor', [{ table: 'insumo', column: 'idProveedor' }, { table: 'compra', column: 'idProveedor' }]);
    await resequenceTableIds('categoriainsumo', 'idCategoriaInsumo', [{ table: 'insumo', column: 'idCategoriaInsumo' }]);
    await resequenceTableIds('categoriaproducto', 'idCategoriaProducto', [{ table: 'producto', column: 'idCategoriaProducto' }]);
  } catch (err) {
    console.warn('Error resequencing core tables:', err.message);
  }
}

/**
 * Adds the logical-deletion state to technical sheets in installations created
 * before the field existed. Existing sheets remain active by default.
 */
async function ensureFichaTecnicaTrashSchema() {
  const sequelize = connectDB.sequelize;
  const [columns] = await sequelize.query("SHOW COLUMNS FROM `fichatecnica` LIKE 'estado'");
  if (columns.length === 0) {
    await sequelize.query('ALTER TABLE `fichatecnica` ADD COLUMN `estado` TINYINT NOT NULL DEFAULT 1 AFTER `observaciones`');
  }
}

module.exports = { resetAutoIncrement, resequenceTableIds, resequenceAllCoreTables, ensureFichaTecnicaTrashSchema };
