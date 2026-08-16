const connectDB = require('../../persistence/config/db');

/**
 * Resets the AUTO_INCREMENT value for a given table.
 * If total rows === 0, resets AUTO_INCREMENT to 1.
 * If total rows > 0, sets AUTO_INCREMENT to MAX(primaryKey) + 1.
 */
async function resetAutoIncrement(tableName, primaryKeyColumn = 'id') {
  try {
    const sequelize = connectDB.sequelize;
    const [results] = await sequelize.query(`SELECT COUNT(*) as total FROM \`${tableName}\` WHERE \`${primaryKeyColumn}\` > 0`);
    const total = results && results[0] ? parseInt(results[0].total || 0, 10) : 0;
    
    if (total === 0) {
      await sequelize.query(`ALTER TABLE \`${tableName}\` AUTO_INCREMENT = 1;`);
    } else if (primaryKeyColumn) {
      const [maxRes] = await sequelize.query(`SELECT IFNULL(MAX(\`${primaryKeyColumn}\`), 0) + 1 as nextId FROM \`${tableName}\` WHERE \`${primaryKeyColumn}\` > 0`);
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
 * Excludes technical records with ID <= 0 (e.g. system zero variant).
 */
async function resequenceTableIds(tableName, primaryKeyColumn = 'id', fkTables = []) {
  try {
    const sequelize = connectDB.sequelize;
    // Skip reserved ID=0 rows (used by placeholder records)
    const [rows] = await sequelize.query(`SELECT \`${primaryKeyColumn}\` FROM \`${tableName}\` WHERE \`${primaryKeyColumn}\` > 0 ORDER BY \`${primaryKeyColumn}\` ASC`);
    
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

/**
 * Creates the inactive, reserved category/product/variant with ID 0 used only
 * by technical sheets of insumos. Keeping real rows preserves the foreign-key
 * protection for every product variant.
 */
async function ensureFichaTecnicaInsumoVariantZero() {
  const sequelize = connectDB.sequelize;
  const transaction = await sequelize.transaction();
  let originalSqlMode;

  try {
    const [[mode]] = await sequelize.query('SELECT @@SESSION.sql_mode AS sqlMode', { transaction });
    originalSqlMode = mode.sqlMode || '';
    const sqlModeWithZero = originalSqlMode.includes('NO_AUTO_VALUE_ON_ZERO')
      ? originalSqlMode
      : [originalSqlMode, 'NO_AUTO_VALUE_ON_ZERO'].filter(Boolean).join(',');
    await sequelize.query('SET SESSION sql_mode = ?', { replacements: [sqlModeWithZero], transaction });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { transaction });

    // 1. Category
    const [categories] = await sequelize.query(
      "SELECT `idCategoriaProducto`, `nombre` FROM `categoriaproducto` WHERE `idCategoriaProducto` = 0 OR `nombre` = '__SISTEMA_VARIANTE_CERO__' FOR UPDATE",
      { transaction }
    );
    const categoryZero = categories.find(c => Number(c.idCategoriaProducto) === 0);
    const categoryByName = categories.find(c => c.nombre === '__SISTEMA_VARIANTE_CERO__');

    if (categoryByName && Number(categoryByName.idCategoriaProducto) !== 0) {
      await sequelize.query(
        "UPDATE `categoriaproducto` SET `idCategoriaProducto` = 0 WHERE `nombre` = '__SISTEMA_VARIANTE_CERO__'",
        { transaction }
      );
    } else if (!categoryZero && !categoryByName) {
      await sequelize.query(
        "INSERT INTO `categoriaproducto` (`idCategoriaProducto`, `nombre`, `descripcion`, `estado`) VALUES (0, '__SISTEMA_VARIANTE_CERO__', 'Registro técnico para fichas de insumos sin variante', 0)",
        { transaction }
      );
    }

    // 2. Product
    const [products] = await sequelize.query(
      "SELECT `idProducto`, `nombre` FROM `producto` WHERE `idProducto` = 0 OR `nombre` = '__SISTEMA_VARIANTE_CERO__' FOR UPDATE",
      { transaction }
    );
    const productZero = products.find(p => Number(p.idProducto) === 0);
    const productByName = products.find(p => p.nombre === '__SISTEMA_VARIANTE_CERO__');

    if (productByName && Number(productByName.idProducto) !== 0) {
      await sequelize.query(
        "UPDATE `producto` SET `idProducto` = 0, `idCategoriaProducto` = 0 WHERE `nombre` = '__SISTEMA_VARIANTE_CERO__'",
        { transaction }
      );
    } else if (!productZero && !productByName) {
      await sequelize.query(
        "INSERT INTO `producto` (`idProducto`, `idCategoriaProducto`, `nombre`, `descripcion`, `estado`, `precio`, `stock`, `categoria`) VALUES (0, 0, '__SISTEMA_VARIANTE_CERO__', 'Registro técnico para fichas de insumos sin variante', 0, 0, 0, '__SISTEMA_VARIANTE_CERO__')",
        { transaction }
      );
    }

    // 3. Variant
    const [variants] = await sequelize.query(
      "SELECT `idVariante`, `idProducto`, `nombre` FROM `variante` WHERE `idVariante` = 0 OR `nombre` = '__SISTEMA_VARIANTE_CERO__' FOR UPDATE",
      { transaction }
    );
    const variantZero = variants.find(v => Number(v.idVariante) === 0);
    const variantByName = variants.find(v => v.nombre === '__SISTEMA_VARIANTE_CERO__');

    if (variantByName && (Number(variantByName.idVariante) !== 0 || Number(variantByName.idProducto) !== 0)) {
      await sequelize.query(
        "UPDATE `variante` SET `idVariante` = 0, `idProducto` = 0 WHERE `nombre` = '__SISTEMA_VARIANTE_CERO__'",
        { transaction }
      );
    } else if (!variantZero && !variantByName) {
      await sequelize.query(
        "INSERT INTO `variante` (`idVariante`, `idProducto`, `nombre`, `precio`, `estado`) VALUES (0, 0, '__SISTEMA_VARIANTE_CERO__', 0, 0)",
        { transaction }
      );
    }

    await sequelize.query("UPDATE `fichatecnica` SET `idVariante` = 0 WHERE `tipo` = 'INSUMO' AND `idVariante` IS NULL", { transaction });
    await sequelize.query("UPDATE `fichatecnica` SET `idInsumo` = NULL WHERE `idInsumo` = 0", { transaction });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { transaction });
    await sequelize.query('SET SESSION sql_mode = ?', { replacements: [originalSqlMode], transaction });
    await transaction.commit();
  } catch (error) {
    if (originalSqlMode !== undefined) {
      await sequelize.query('SET SESSION sql_mode = ?', { replacements: [originalSqlMode], transaction }).catch(() => {});
    }
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { transaction }).catch(() => {});
    await transaction.rollback();
    throw error;
  }
}

/**
 * Converts the legacy UTC values stored in fichatecnica.fechaCreacion to
 * Colombia local time (UTC-5). The migration key makes this safe to run on
 * every startup without changing the same records twice.
 */
async function ensureFichaTecnicaColombiaTimezone() {
  const sequelize = connectDB.sequelize;
  const transaction = await sequelize.transaction();

  try {
    await sequelize.query(
      'CREATE TABLE IF NOT EXISTS `sistemamigracion` (`clave` VARCHAR(100) NOT NULL PRIMARY KEY, `fechaAplicacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)',
      { transaction }
    );
    const [[migration]] = await sequelize.query(
      "SELECT `clave` FROM `sistemamigracion` WHERE `clave` = 'fichatecnica_fecha_colombia_utc5' FOR UPDATE",
      { transaction }
    );

    if (!migration) {
      await sequelize.query(
        'UPDATE `fichatecnica` SET `fechaCreacion` = DATE_SUB(`fechaCreacion`, INTERVAL 5 HOUR) WHERE `fechaCreacion` IS NOT NULL',
        { transaction }
      );
      await sequelize.query(
        "INSERT INTO `sistemamigracion` (`clave`) VALUES ('fichatecnica_fecha_colombia_utc5')",
        { transaction }
      );
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

/**
 * Ensures table `evento` contains required idProducto and promotion columns
 */
async function ensureEventoColumnsSchema() {
  try {
    const sequelize = connectDB.sequelize;
    const [cols] = await sequelize.query("SHOW COLUMNS FROM `evento` LIKE 'idProducto'");
    if (cols.length === 0) {
      await sequelize.query(
        "ALTER TABLE `evento` ADD COLUMN `idProducto` INT NULL AFTER `idEvento`, ADD COLUMN `tipoEvento` VARCHAR(50) NULL AFTER `idProducto`, ADD COLUMN `descuento` DECIMAL(10,2) NULL AFTER `tipoEvento`, ADD COLUMN `nuevoPrecio` DECIMAL(10,2) NULL AFTER `descuento`, ADD COLUMN `accionInsumo` VARCHAR(20) NULL AFTER `nuevoPrecio`, ADD COLUMN `insumosAsociados` TEXT NULL AFTER `accionInsumo`"
      );
    }
  } catch (err) {
    console.warn("Error ensuring evento columns schema:", err.message);
  }
}

module.exports = {
  resetAutoIncrement,
  resequenceTableIds,
  resequenceAllCoreTables,
  ensureFichaTecnicaTrashSchema,
  ensureFichaTecnicaInsumoVariantZero,
  ensureFichaTecnicaColombiaTimezone,
  ensureEventoColumnsSchema
};
