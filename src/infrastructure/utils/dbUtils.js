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
 * Safely resets AUTO_INCREMENT on core tables without rewriting primary keys
 * (rewriting PKs with FOREIGN_KEY_CHECKS=0 corrupts child references in loteinsumo,
 * trazabilidad, evento, resena, detallecombo, detalleventaadicion, etc.).
 */
async function resequenceAllCoreTables() {
  try {
    await resetAutoIncrement('fichatecnica', 'idFichaTecnica');
    await resetAutoIncrement('insumo', 'idInsumo');
    await resetAutoIncrement('producto', 'idProducto');
    await resetAutoIncrement('proveedor', 'idProveedor');
    await resetAutoIncrement('categoriainsumo', 'idCategoriaInsumo');
    await resetAutoIncrement('categoriaproducto', 'idCategoriaProducto');
  } catch (err) {
    console.warn('Error resetting auto increment on core tables:', err.message);
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

  try {
    const [verCols] = await sequelize.query("SHOW COLUMNS FROM `fichatecnica` LIKE 'versionActual'");
    if (!verCols || verCols.length === 0) {
      await sequelize.query('ALTER TABLE `fichatecnica` ADD COLUMN `versionActual` INT NOT NULL DEFAULT 1 AFTER `observaciones`');
    }
    const [iniCols] = await sequelize.query("SHOW COLUMNS FROM `fichatecnica` LIKE 'fechaInicioVigencia'");
    if (!iniCols || iniCols.length === 0) {
      await sequelize.query('ALTER TABLE `fichatecnica` ADD COLUMN `fechaInicioVigencia` DATETIME NULL AFTER `versionActual`');
      await sequelize.query('UPDATE `fichatecnica` SET `fechaInicioVigencia` = `fechaCreacion` WHERE `fechaInicioVigencia` IS NULL');
    }
    const [histCols] = await sequelize.query("SHOW COLUMNS FROM `fichatecnica` LIKE 'versionesAnteriores'");
    if (!histCols || histCols.length === 0) {
      await sequelize.query('ALTER TABLE `fichatecnica` ADD COLUMN `versionesAnteriores` LONGTEXT NULL AFTER `fechaInicioVigencia`');
    }
  } catch (err) {
    console.warn('[DB Migration] ⚠️ Error asegurando columnas de versionamiento en fichatecnica:', err.message);
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
        "INSERT INTO `producto` (`idProducto`, `idCategoriaProducto`, `nombre`, `descripcion`, `estado`, `precio`, `categoria`) VALUES (0, 0, '__SISTEMA_VARIANTE_CERO__', 'Registro técnico para fichas de insumos sin variante', 0, 0, '__SISTEMA_VARIANTE_CERO__')",
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
    await sequelize.query("UPDATE `fichatecnica` SET `idInsumo` = NULL WHERE `idInsumo` = '0'", { transaction });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { transaction });
    await sequelize.query('SET SESSION sql_mode = ?', { replacements: [originalSqlMode], transaction });
    await transaction.commit();
  } catch (error) {
    if (originalSqlMode !== undefined) {
      await sequelize.query('SET SESSION sql_mode = ?', { replacements: [originalSqlMode], transaction }).catch(() => { });
    }
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { transaction }).catch(() => { });
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
    const columnsToCheck = [
      { name: 'idProducto', sql: 'ALTER TABLE `evento` ADD COLUMN `idProducto` INT NULL' },
      { name: 'tipoEvento', sql: 'ALTER TABLE `evento` ADD COLUMN `tipoEvento` VARCHAR(50) NULL' },
      { name: 'descuento', sql: 'ALTER TABLE `evento` ADD COLUMN `descuento` DECIMAL(10,2) NULL' },
      { name: 'nuevoPrecio', sql: 'ALTER TABLE `evento` ADD COLUMN `nuevoPrecio` DECIMAL(10,2) NULL' },
      { name: 'accionInsumo', sql: 'ALTER TABLE `evento` ADD COLUMN `accionInsumo` VARCHAR(20) NULL' },
      { name: 'insumosAsociados', sql: 'ALTER TABLE `evento` ADD COLUMN `insumosAsociados` TEXT NULL' },
      { name: 'productosAsociados', sql: 'ALTER TABLE `evento` ADD COLUMN `productosAsociados` TEXT NULL' },
      { name: 'icono', sql: 'ALTER TABLE `evento` ADD COLUMN `icono` VARCHAR(50) NULL' },
      { name: 'imagen', sql: 'ALTER TABLE `evento` ADD COLUMN `imagen` VARCHAR(500) NULL' }
    ];

    for (const col of columnsToCheck) {
      const [existing] = await sequelize.query(`SHOW COLUMNS FROM \`evento\` LIKE '${col.name}'`);
      if (!existing || existing.length === 0) {
        await sequelize.query(col.sql);
        console.log(`[DB Migration] Columna ${col.name} agregada a tabla evento`);
      }
    }
  } catch (err) {
    console.warn("Error ensuring evento columns schema:", err.message);
  }
}

/**
 * Automatically syncs and repairs any sales in table `venta` where `total = 0` or `subtotal = 0`
 * by calculating the real sum from `observaciones` (JSON products) or `detalleventaproducto`.
 */
async function syncVentasTotals() {
  try {
    const sequelize = connectDB.sequelize;
    const [ventasZero] = await sequelize.query(
      "SELECT idVenta, subtotal, total, descuentoAplicado, observaciones FROM `venta` WHERE total = 0 OR subtotal = 0"
    );

    if (ventasZero && ventasZero.length > 0) {
      for (const v of ventasZero) {
        let obsData = {};
        if (v.observaciones) {
          try {
            obsData = typeof v.observaciones === 'string' && v.observaciones.startsWith('{')
              ? JSON.parse(v.observaciones)
              : {};
          } catch (e) { }
        }

        let calcSubtotal = 0;
        if (Array.isArray(obsData.productos) && obsData.productos.length > 0) {
          calcSubtotal = obsData.productos.reduce((s, p) => {
            const itemAdds = Array.isArray(p.adiciones)
              ? p.adiciones.reduce((sa, a) => sa + (Number(a.precio || 0)), 0)
              : 0;
            const pUnit = Number(p.precioUnitario || p.precio || 0) + itemAdds;
            const pTot = Number(p.total || 0) > 0 ? Number(p.total) : pUnit * Number(p.cantidad || 1);
            return s + pTot;
          }, 0);
        }

        if (calcSubtotal === 0) {
          const [detalles] = await sequelize.query(
            "SELECT cantidad, precioUnitario, subtotal FROM `detalleventaproducto` WHERE idVenta = :idVenta",
            { replacements: { idVenta: v.idVenta } }
          );
          if (detalles && detalles.length > 0) {
            calcSubtotal = detalles.reduce((s, d) => s + (Number(d.subtotal || 0) || (Number(d.precioUnitario || 0) * Number(d.cantidad || 1))), 0);
          }
        }

        if (calcSubtotal > 0) {
          const desc = parseFloat(v.descuentoAplicado || 0);
          const calcTotal = Math.max(0, calcSubtotal - desc);
          await sequelize.query(
            "UPDATE `venta` SET `subtotal` = :subtotal, `total` = :total WHERE `idVenta` = :idVenta",
            { replacements: { subtotal: calcSubtotal, total: calcTotal, idVenta: v.idVenta } }
          );
        }
      }
    }
  } catch (err) {
    console.warn("Error syncing ventas totals:", err.message);
  }
}

/**
 * Ensures table `categoriaproducto` contains the `icon` column
 */
async function ensureCategoriaProductoIconSchema() {
  try {
    const sequelize = connectDB.sequelize;
    const [cols] = await sequelize.query("SHOW COLUMNS FROM `categoriaproducto` LIKE 'icon'");
    if (cols.length === 0) {
      await sequelize.query(
        "ALTER TABLE `categoriaproducto` ADD COLUMN `icon` VARCHAR(255) NULL AFTER `descripcion`"
      );
    }
  } catch (err) {
    console.warn("Error ensuring categoriaproducto icon schema:", err.message);
  }
}

async function ensureCategoriaInsumoIconSchema() {
  try {
    const sequelize = connectDB.sequelize;
    const [cols] = await sequelize.query("SHOW COLUMNS FROM `categoriainsumo` LIKE 'icon'");
    if (cols.length === 0) {
      await sequelize.query(
        "ALTER TABLE `categoriainsumo` ADD COLUMN `icon` VARCHAR(255) NULL AFTER `descripcion`"
      );
    }
  } catch (err) {
    console.warn("Error ensuring categoriainsumo icon schema:", err.message);
  }
}

async function ensureConfiguracionComboSchema() {
  try {
    const sequelize = connectDB.sequelize;
    const [cols] = await sequelize.query("SHOW COLUMNS FROM `producto` LIKE 'configuracionCombo'");
    if (cols.length === 0) {
      await sequelize.query(
        "ALTER TABLE `producto` ADD COLUMN `configuracionCombo` TEXT NULL AFTER `adiciones`"
      );
    }
  } catch (err) {
    console.warn("Error ensuring producto configuracionCombo schema:", err.message);
  }
}

/**
 * Ensures table `venta` contains the `estadoAprobacion` column.
 * Also backfills existing rows: orders already in PREPARANDO/LISTO/ENTREGADO get APROBADO,
 * orders in CANCELADO get RECHAZADO, and PENDIENTE stays PENDIENTE.
 */
async function ensureVentaAprobacionSchema() {
  try {
    const sequelize = connectDB.sequelize;

    // Check and add estadoAprobacion column
    const [colsAprobacion] = await sequelize.query("SHOW COLUMNS FROM `venta` LIKE 'estadoAprobacion'");
    if (colsAprobacion.length === 0) {
      await sequelize.query(
        "ALTER TABLE `venta` ADD COLUMN `estadoAprobacion` ENUM('PENDIENTE','APROBADO','RECHAZADO') DEFAULT 'PENDIENTE' AFTER `observaciones`"
      );
      console.log('[DB Migration] Columna estadoAprobacion agregada a tabla venta');

      // Backfill: orders already in progress or completed should be marked APROBADO
      await sequelize.query(
        "UPDATE `venta` SET `estadoAprobacion` = 'APROBADO' WHERE `estadoEntrega` IN ('PREPARANDO','LISTO','EN_CAMINO','ENTREGADO')"
      );
      // Backfill: cancelled orders should be marked RECHAZADO
      await sequelize.query(
        "UPDATE `venta` SET `estadoAprobacion` = 'RECHAZADO' WHERE `estadoEntrega` = 'CANCELADO'"
      );
      console.log('[DB Migration] Backfill de estadoAprobacion completado');
    }

    // Ensure deprecated column `aprobado` is dropped if still present
    const [colsAprobado] = await sequelize.query("SHOW COLUMNS FROM `venta` LIKE 'aprobado'");
    if (colsAprobado.length > 0) {
      await sequelize.query("ALTER TABLE `venta` DROP COLUMN `aprobado`");
      console.log('[DB Migration] Columna obsoleta aprobado eliminada de tabla venta');
    }
  } catch (err) {
    console.warn('[DB Migration] Error asegurando esquema de estadoAprobacion en venta:', err.message);
  }
}

/**
 * Ensures table `usuario` contains `numeroDocumento` column and backfills existing users
 */
async function ensureUsuarioDocumentoSchema() {
  try {
    const sequelize = connectDB.sequelize;
    const [cols] = await sequelize.query("SHOW COLUMNS FROM `usuario` LIKE 'numeroDocumento'");
    if (!cols || cols.length === 0) {
      await sequelize.query("ALTER TABLE `usuario` ADD COLUMN `numeroDocumento` VARCHAR(50) NULL AFTER `tipoDocumento`");
      console.log('[DB Migration] Columna numeroDocumento agregada a tabla usuario');
    }
    // Backfill any empty numeroDocumento with idUsuario if applicable
    await sequelize.query("UPDATE `usuario` SET `numeroDocumento` = CAST(`idUsuario` AS CHAR) WHERE `numeroDocumento` IS NULL OR `numeroDocumento` = ''");
    console.log('[DB Migration] Esquema numeroDocumento en usuario verificado.');

    // Ensure foto column exists in usuario
    const [fotoCols] = await sequelize.query("SHOW COLUMNS FROM `usuario` LIKE 'foto'");
    if (!fotoCols || fotoCols.length === 0) {
      await sequelize.query("ALTER TABLE `usuario` ADD COLUMN `foto` TEXT NULL AFTER `fechaRegistro`");
      console.log('[DB Migration] Columna foto agregada a tabla usuario');
    }
  } catch (err) {
    console.warn('[DB Migration] Error asegurando columna numeroDocumento/foto en usuario:', err.message);
  }
}

async function ensureResenaSchema() {
  const sequelize = connectDB.sequelize;
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS \`resena\` (
        \`idResena\` INT NOT NULL AUTO_INCREMENT,
        \`idProducto\` INT NOT NULL,
        \`idUsuario\` INT NOT NULL,
        \`puntuacion\` TINYINT NOT NULL DEFAULT 5,
        \`comentario\` TEXT,
        \`fechaResena\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        \`estado\` TINYINT DEFAULT 1,
        PRIMARY KEY (\`idResena\`),
        KEY \`idx_resena_producto\` (\`idProducto\`),
        KEY \`idx_resena_usuario\` (\`idUsuario\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('[DB] Tabla resena verificada/creada correctamente.');
  } catch (err) {
    console.warn('[DB] Error asegurando tabla resena:', err.message);
  }
}

async function ensureNoNegativeStock() {
  const sequelize = connectDB.sequelize;
  try {
    await sequelize.query('UPDATE `insumo` SET `stock` = 0 WHERE `stock` < 0');
    await sequelize.query('UPDATE `insumo` SET `stockMinimo` = 0 WHERE `stockMinimo` < 0');
    console.log('[DB] Stock negativo verificado y saneado a 0.');
  } catch (err) {
    console.warn('[DB] Error saneando stock negativo:', err.message);
  }
}

/**
 * Ensures 'eliminado' column exists in 'insumo' and 'insumopreparado' tables
 * to support logical deletion / recycle bin.
 */
async function ensureInsumoEliminadoSchema() {
  const sequelize = connectDB.sequelize;
  try {
    const [insumoCols] = await sequelize.query("SHOW COLUMNS FROM `insumo` LIKE 'eliminado'");
    if (insumoCols.length === 0) {
      await sequelize.query('ALTER TABLE `insumo` ADD COLUMN `eliminado` TINYINT NOT NULL DEFAULT 0 AFTER `estado`');
      console.log('[DB] ✅ Columna insumo.eliminado agregada exitosamente.');
    }
  } catch (err) {
    console.warn('[DB] ⚠️ Error asegurando columna insumo.eliminado:', err.message);
  }

  try {
    const [prepCols] = await sequelize.query("SHOW COLUMNS FROM `insumopreparado` LIKE 'eliminado'");
    if (prepCols.length === 0) {
      await sequelize.query('ALTER TABLE `insumopreparado` ADD COLUMN `eliminado` TINYINT NOT NULL DEFAULT 0 AFTER `estado`');
      console.log('[DB] ✅ Columna insumopreparado.eliminado agregada exitosamente.');
    }
  } catch (err) {
    console.warn('[DB] ⚠️ Error asegurando columna insumopreparado.eliminado:', err.message);
  }
}

/**
 * Ensures 'idCategoriaInsumo' column in 'insumo' allows NULL
 * so that deleting categories or assigning unclassified items does not violate FK constraints.
 */
async function ensureInsumoCategoriaNullableSchema() {
  const sequelize = connectDB.sequelize;
  try {
    const [cols] = await sequelize.query("SHOW COLUMNS FROM `insumo` LIKE 'idCategoriaInsumo'");
    if (cols.length > 0 && cols[0].Null === 'NO') {
      await sequelize.query('ALTER TABLE `insumo` MODIFY `idCategoriaInsumo` INT NULL');
      console.log('[DB] ✅ Columna insumo.idCategoriaInsumo modificada a NULL exitosamente.');
    }
  } catch (err) {
    console.warn('[DB] ⚠️ Error asegurando columna idCategoriaInsumo nullable:', err.message);
  }
}

/**
 * Ensures food products (Hamburguesas, Perros, Salchipapas, Combos, etc.)
 * have their appropriate additions configured in `producto.adiciones`
 * if they are currently null or empty '[]'.
 */
async function ensureProductoAdicionesDefaultSchema() {
  const { Product, Insumo } = require('../../persistence/models');
  try {
    const activeAdiciones = await Insumo.findAll({ where: { esAdicion: 1, estado: 1, eliminado: 0 } });
    if (!activeAdiciones || activeAdiciones.length === 0) return;

    const adicMap = {};
    activeAdiciones.forEach(a => {
      adicMap[a.idInsumo] = {
        idAdicion: a.idInsumo,
        idInsumo: a.idInsumo,
        nombre: a.nombre,
        precio: parseFloat(a.precioAdicion || 0),
        imagen: a.imagen || ''
      };
    });

    const products = await Product.findAll();
    let updatedCount = 0;

    for (const prod of products) {
      if (prod.idProducto === 0 || prod.nombre?.startsWith('__SISTEMA')) continue;

      let currentAdiciones = [];
      try {
        currentAdiciones = typeof prod.adiciones === 'string' ? JSON.parse(prod.adiciones) : (prod.adiciones || []);
      } catch (e) {
        currentAdiciones = [];
      }

      // Si no tiene adiciones configuradas y pertenece a categorías de comida rápida
      if (!Array.isArray(currentAdiciones) || currentAdiciones.length === 0) {
        const catId = prod.idCategoriaProducto;
        let adicIds = [];

        if (catId === 3) {
          // Hamburguesas
          adicIds = [3, 4, 5, 6, 7, 8, 9, 10, 12, 13];
        } else if (catId === 1) {
          // Perros Calientes
          adicIds = [3, 4, 5, 7, 8, 10, 12];
        } else if (catId === 5) {
          // Salchipapas Gourmet
          adicIds = [3, 4, 11, 12, 13, 7, 8, 9, 10];
        } else if (catId === 2) {
          // Combos
          adicIds = [3, 4, 5, 8, 9, 10, 12, 13];
        } else if (catId === 6) {
          // Acompañamientos / Papas con toppings
          const pNameLower = (prod.nombre || '').toLowerCase();
          if (!pNameLower.includes('gaseosa') && !pNameLower.includes('agua')) {
            adicIds = [3, 4, 12, 11, 7, 8, 9, 10];
          }
        }

        if (adicIds.length > 0) {
          const formatted = adicIds.map(id => adicMap[id]).filter(Boolean);
          if (formatted.length > 0) {
            prod.adiciones = JSON.stringify(formatted);
            await prod.save();
            updatedCount++;
          }
        }
      }
    }

    if (updatedCount > 0) {
      console.log(`[DB] ✅ Adiciones predeterminadas configuradas exitosamente en ${updatedCount} productos de comida.`);
    }
  } catch (err) {
    console.warn('[DB] ⚠️ Error asegurando adiciones por defecto:', err.message);
  }
}

async function ensureInsumoAdicionSchema() {
  const sequelize = connectDB.sequelize;
  try {
    const [cols] = await sequelize.query("DESCRIBE insumo");
    const colNames = cols.map(c => c.Field);
    if (!colNames.includes('esAdicion')) {
      await sequelize.query("ALTER TABLE `insumo` ADD COLUMN `esAdicion` TINYINT(1) NOT NULL DEFAULT 0 AFTER `estado`");
    }
    if (!colNames.includes('precioAdicion')) {
      await sequelize.query("ALTER TABLE `insumo` ADD COLUMN `precioAdicion` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER `esAdicion`");
    }
    if (!colNames.includes('imagen')) {
      await sequelize.query("ALTER TABLE `insumo` ADD COLUMN `imagen` VARCHAR(255) NULL AFTER `precioAdicion`");
    }
    if (!colNames.includes('incluyeIva')) {
      await sequelize.query("ALTER TABLE `insumo` ADD COLUMN `incluyeIva` TINYINT(1) NOT NULL DEFAULT 0 AFTER `imagen`");
    }
    await sequelize.query("DROP TABLE IF EXISTS `adicion`");
  } catch (err) {
    console.warn('[DB] ⚠️ Error verificando schema de adiciones en insumo:', err.message);
  }
}

async function ensureVarianteImagenSchema() {
  try {
    const sequelize = connectDB.sequelize;
    const [cols] = await sequelize.query("SHOW COLUMNS FROM `variante` LIKE 'imagen'");
    if (cols.length === 0) {
      await sequelize.query("ALTER TABLE `variante` ADD COLUMN `imagen` VARCHAR(255) NULL AFTER `precio`");
      console.log('[DB Migration] Columna imagen agregada a tabla variante');
    }
  } catch (err) {
    console.warn('[DB Migration] Error asegurando columna imagen en variante:', err.message);
  }
}

async function ensureVarianteInsumoSchema() {
  try {
    const sequelize = connectDB.sequelize;
    // 1. Asegurar columna descripcion en tabla variante
    const [descCols] = await sequelize.query("SHOW COLUMNS FROM `variante` LIKE 'descripcion'");
    if (!descCols || descCols.length === 0) {
      await sequelize.query("ALTER TABLE `variante` ADD COLUMN `descripcion` TEXT NULL AFTER `nombre`");
      console.log('[DB Migration] Columna descripcion agregada a tabla variante');
    }

    // 2. Crear tabla variante_insumo para modificaciones/deltas de ingredientes por variante
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS \`variante_insumo\` (
        \`idVarianteInsumo\` INT NOT NULL AUTO_INCREMENT,
        \`idVariante\` INT NOT NULL,
        \`tipoAccion\` ENUM('AGREGAR', 'REEMPLAZAR', 'MODIFICAR_CANTIDAD', 'QUITAR') NOT NULL DEFAULT 'AGREGAR',
        \`idInsumo\` INT NOT NULL,
        \`idInsumoReemplazado\` INT NULL DEFAULT NULL,
        \`cantidad\` DECIMAL(10, 3) NOT NULL DEFAULT 1.000,
        \`unidadMedida\` VARCHAR(20) NOT NULL DEFAULT 'und',
        \`observaciones\` VARCHAR(255) NULL DEFAULT NULL,
        PRIMARY KEY (\`idVarianteInsumo\`),
        KEY \`idx_varins_variante\` (\`idVariante\`),
        KEY \`idx_varins_insumo\` (\`idInsumo\`),
        KEY \`idx_varins_insumoreemp\` (\`idInsumoReemplazado\`),
        CONSTRAINT \`fk_varins_variante\` FOREIGN KEY (\`idVariante\`) REFERENCES \`variante\` (\`idVariante\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`fk_varins_insumo\` FOREIGN KEY (\`idInsumo\`) REFERENCES \`insumo\` (\`idInsumo\`) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT \`fk_varins_insumoreemp\` FOREIGN KEY (\`idInsumoReemplazado\`) REFERENCES \`insumo\` (\`idInsumo\`) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('[DB Migration] Tabla variante_insumo verificada/creada');
  } catch (err) {
    console.warn('[DB Migration] ⚠️ Error asegurando schema de variante_insumo:', err.message);
  }
}

async function ensureCompraLotesYCancelacionSchema() {
  const sequelize = connectDB.sequelize;
  try {
    // 1. Crear tabla loteinsumo si no existe
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS \`loteinsumo\` (
        \`idLote\` INT AUTO_INCREMENT PRIMARY KEY,
        \`idInsumo\` INT NOT NULL,
        \`idCompra\` INT NULL,
        \`numeroLote\` VARCHAR(100) NOT NULL,
        \`cantidad\` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        \`cantidadDisponible\` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        \`fechaVencimiento\` DATE NULL,
        \`fechaCreacion\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        \`estado\` VARCHAR(30) DEFAULT 'ACTIVO',
        KEY \`idx_lote_insumo\` (\`idInsumo\`),
        KEY \`idx_lote_compra\` (\`idCompra\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('[DB] ✅ Tabla loteinsumo verificada/creada correctamente.');

    // 2. Columnas en compra para cancelación
    const [colsCompra] = await sequelize.query("DESCRIBE `compra`");
    const compraColNames = colsCompra.map(c => c.Field);
    if (!compraColNames.includes('motivoCancelacion')) {
      await sequelize.query("ALTER TABLE `compra` ADD COLUMN `motivoCancelacion` VARCHAR(500) NULL");
      console.log('[DB Migration] Columna motivoCancelacion agregada a tabla compra');
    }
    if (!compraColNames.includes('detallesCancelacion')) {
      await sequelize.query("ALTER TABLE `compra` ADD COLUMN `detallesCancelacion` TEXT NULL");
      console.log('[DB Migration] Columna detallesCancelacion agregada a tabla compra');
    }
    if (!compraColNames.includes('usuarioCancelacionId')) {
      await sequelize.query("ALTER TABLE `compra` ADD COLUMN `usuarioCancelacionId` INT NULL");
      console.log('[DB Migration] Columna usuarioCancelacionId agregada a tabla compra');
    }
    if (!compraColNames.includes('fechaCancelacion')) {
      await sequelize.query("ALTER TABLE `compra` ADD COLUMN `fechaCancelacion` DATETIME NULL");
      console.log('[DB Migration] Columna fechaCancelacion agregada a tabla compra');
    }
    if (!compraColNames.includes('numeroFactura')) {
      await sequelize.query("ALTER TABLE `compra` ADD COLUMN `numeroFactura` VARCHAR(100) NULL AFTER `idProveedor`");
      console.log('[DB Migration] Columna numeroFactura agregada a tabla compra');
    }
    if (!compraColNames.includes('fechaFactura')) {
      await sequelize.query("ALTER TABLE `compra` ADD COLUMN `fechaFactura` DATE NULL AFTER `numeroFactura`");
      console.log('[DB Migration] Columna fechaFactura agregada a tabla compra');
    }
    if (!compraColNames.includes('incluyeIva')) {
      await sequelize.query("ALTER TABLE `compra` ADD COLUMN `incluyeIva` TINYINT(1) NOT NULL DEFAULT 0 AFTER `total`");
      console.log('[DB Migration] Columna incluyeIva agregada a tabla compra');
    }
    if (!compraColNames.includes('subtotal')) {
      await sequelize.query("ALTER TABLE `compra` ADD COLUMN `subtotal` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 AFTER `total`");
      console.log('[DB Migration] Columna subtotal agregada a tabla compra');
    }
    if (!compraColNames.includes('iva')) {
      await sequelize.query("ALTER TABLE `compra` ADD COLUMN `iva` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 AFTER `subtotal`");
      console.log('[DB Migration] Columna iva agregada a tabla compra');
    }

    // 2.1 Asegurar que idProveedor en compra permita NULL (compra genérica sin proveedor)
    try {
      const idProvCol = colsCompra.find(c => c.Field === 'idProveedor');
      if (idProvCol && idProvCol.Null === 'NO') {
        await sequelize.query("ALTER TABLE `compra` MODIFY COLUMN `idProveedor` INT(11) NULL");
        console.log('[DB Migration] ✅ Columna compra.idProveedor ahora es NULLABLE para compras genéricas.');
      }
    } catch (altErr) {
      console.warn('[DB Migration] ⚠️ Error modificando compra.idProveedor a NULL:', altErr.message);
    }

    // 3. Columnas en detallecomprainsumo para lotes
    const [colsDetalle] = await sequelize.query("DESCRIBE `detallecomprainsumo`");
    const detalleColNames = colsDetalle.map(c => c.Field);
    if (!detalleColNames.includes('lotes')) {
      await sequelize.query("ALTER TABLE `detallecomprainsumo` ADD COLUMN `lotes` TEXT NULL");
      console.log('[DB Migration] Columna lotes agregada a tabla detallecomprainsumo');
    }
    if (!detalleColNames.includes('numeroLote')) {
      await sequelize.query("ALTER TABLE `detallecomprainsumo` ADD COLUMN `numeroLote` VARCHAR(100) NULL");
      console.log('[DB Migration] Columna numeroLote agregada a tabla detallecomprainsumo');
    }
    if (!detalleColNames.includes('fechaVencimiento')) {
      await sequelize.query("ALTER TABLE `detallecomprainsumo` ADD COLUMN `fechaVencimiento` DATE NULL");
      console.log('[DB Migration] Columna fechaVencimiento agregada a tabla detallecomprainsumo');
    }
  } catch (err) {
    console.warn('[DB Migration] ⚠️ Error asegurando esquema de lotes y cancelación de compras:', err.message);
  }
}

/**
 * Ensures Acta de Revisión schema fixes:
 * - Drops duplicate trigger `trg_EntradaInventario` (+200% stock bug)
 * - Adds `insumo.stockMaximo` (Ítem 58)
 * - Expands `cliente.direccion` to TEXT and adds `cliente.estado` (Ítem 119)
 * - Adds `proveedor.eliminado` (Ítem 67)
 * - Removes `PENDIENTE` purchases and widens `compra.estado` / `pago.metodoPago` (Ítems 86, 122)
 * - Adds `venta.origen` and `venta.tiempoEstimadoEntrega` (Ítems 123, 124)
 * - Creates relational `detallecombo` table (Ítems 97, 106)
 */
async function ensureActaRevisionSchema() {
  const sequelize = connectDB.sequelize;
  try {
    // 1. Eliminar trigger duplicado de entrada de inventario (en motores MySQL estándar)
    await sequelize.query('DROP TRIGGER IF EXISTS `trg_EntradaInventario`');
  } catch (err) {
    // TiDB Cloud Serverless no soporta triggers por diseño distribuido (el stock se gestiona transaccionalmente en CompraService)
    if (!err.message.includes('TRIGGER') && !err.message.includes('syntax')) {
      console.warn('[DB Migration] ⚠️ No se pudo eliminar trg_EntradaInventario:', err.message);
    }
  }

  try {
    // 2. insumo.stockMaximo
    const [insCols] = await sequelize.query("SHOW COLUMNS FROM `insumo` LIKE 'stockMaximo'");
    if (!insCols || insCols.length === 0) {
      await sequelize.query("ALTER TABLE `insumo` ADD COLUMN `stockMaximo` DECIMAL(10, 2) NOT NULL DEFAULT 100.00 AFTER `stockMinimo`");
      await sequelize.query("UPDATE `insumo` SET `stockMaximo` = GREATEST(`stock` * 2, `stockMinimo` * 3, 100) WHERE `stockMaximo` <= 0 OR `stockMaximo` < `stockMinimo`");
      console.log('[DB Migration] ✅ Columna insumo.stockMaximo agregada.');
    }
  } catch (err) {
    console.warn('[DB Migration] ⚠️ Error asegurando insumo.stockMaximo:', err.message);
  }

  try {
    // 3. cliente.direccion TEXT + cliente.estado
    const [cliDirCols] = await sequelize.query("SHOW COLUMNS FROM `cliente` LIKE 'direccion'");
    if (cliDirCols && cliDirCols.length > 0 && String(cliDirCols[0].Type || '').toLowerCase().includes('varchar')) {
      await sequelize.query("ALTER TABLE `cliente` MODIFY COLUMN `direccion` TEXT NULL");
      console.log('[DB Migration] ✅ Columna cliente.direccion ampliada a TEXT.');
    }
    const [cliEstCols] = await sequelize.query("SHOW COLUMNS FROM `cliente` LIKE 'estado'");
    if (!cliEstCols || cliEstCols.length === 0) {
      await sequelize.query("ALTER TABLE `cliente` ADD COLUMN `estado` TINYINT NOT NULL DEFAULT 1");
      console.log('[DB Migration] ✅ Columna cliente.estado agregada.');
    }
  } catch (err) {
    console.warn('[DB Migration] ⚠️ Error asegurando columnas en cliente:', err.message);
  }

  try {
    // 4. proveedor.eliminado y proveedor.clasificacion (Mayorista, Proveedor, Fabricante)
    const [provCols] = await sequelize.query("SHOW COLUMNS FROM `proveedor` LIKE 'eliminado'");
    if (!provCols || provCols.length === 0) {
      await sequelize.query("ALTER TABLE `proveedor` ADD COLUMN `eliminado` TINYINT NOT NULL DEFAULT 0 AFTER `estado`");
      console.log('[DB Migration] ✅ Columna proveedor.eliminado agregada.');
    }
    const [clasifCols] = await sequelize.query("SHOW COLUMNS FROM `proveedor` LIKE 'clasificacion'");
    if (!clasifCols || clasifCols.length === 0) {
      await sequelize.query("ALTER TABLE `proveedor` ADD COLUMN `clasificacion` VARCHAR(255) NULL AFTER `idTipoProveedor`");
      console.log('[DB Migration] ✅ Columna proveedor.clasificacion agregada.');
    }
  } catch (err) {
    console.warn('[DB Migration] ⚠️ Error asegurando columnas de proveedor:', err.message);
  }

  try {
    // 4.1 insumopreparado: porcion minima de adicion (cantidad, unidad, precio)
    const [pmCantCols] = await sequelize.query("SHOW COLUMNS FROM `insumopreparado` LIKE 'porcionMinimaCantidad'");
    if (!pmCantCols || pmCantCols.length === 0) {
      await sequelize.query("ALTER TABLE `insumopreparado` ADD COLUMN `porcionMinimaCantidad` DECIMAL(10, 2) NULL DEFAULT 1 AFTER `precioVenta`");
    }
    const [pmUniCols] = await sequelize.query("SHOW COLUMNS FROM `insumopreparado` LIKE 'porcionMinimaUnidad'");
    if (!pmUniCols || pmUniCols.length === 0) {
      await sequelize.query("ALTER TABLE `insumopreparado` ADD COLUMN `porcionMinimaUnidad` VARCHAR(50) NULL DEFAULT 'und' AFTER `porcionMinimaCantidad`");
    }
    const [pmPrecioCols] = await sequelize.query("SHOW COLUMNS FROM `insumopreparado` LIKE 'porcionMinimaPrecio'");
    if (!pmPrecioCols || pmPrecioCols.length === 0) {
      await sequelize.query("ALTER TABLE `insumopreparado` ADD COLUMN `porcionMinimaPrecio` DECIMAL(10, 2) NULL DEFAULT 0 AFTER `porcionMinimaUnidad`");
    }
  } catch (err) {
    console.warn('[DB Migration] ⚠️ Error asegurando columnas de insumopreparado:', err.message);
  }

  try {
    // 4.2 insumo: porcion minima de adicion y costoPreparacion
    const [insPmCant] = await sequelize.query("SHOW COLUMNS FROM `insumo` LIKE 'porcionMinimaCantidad'");
    if (!insPmCant || insPmCant.length === 0) {
      await sequelize.query("ALTER TABLE `insumo` ADD COLUMN `porcionMinimaCantidad` DECIMAL(10, 2) NULL DEFAULT 1 AFTER `precioAdicion`");
    }
    const [insPmUni] = await sequelize.query("SHOW COLUMNS FROM `insumo` LIKE 'porcionMinimaUnidad'");
    if (!insPmUni || insPmUni.length === 0) {
      await sequelize.query("ALTER TABLE `insumo` ADD COLUMN `porcionMinimaUnidad` VARCHAR(50) NULL DEFAULT 'und' AFTER `porcionMinimaCantidad`");
    }
    const [insCostoPrep] = await sequelize.query("SHOW COLUMNS FROM `insumo` LIKE 'costoPreparacion'");
    if (!insCostoPrep || insCostoPrep.length === 0) {
      await sequelize.query("ALTER TABLE `insumo` ADD COLUMN `costoPreparacion` DECIMAL(10, 2) NULL DEFAULT 0 AFTER `precioUnitario`");
    }
  } catch (err) {
    console.warn('[DB Migration] ⚠️ Error asegurando columnas de insumo:', err.message);
  }

  try {
    // 5. compra.estado sin PENDIENTE y pago.metodoPago compatible con WOMPI
    await sequelize.query("ALTER TABLE `compra` MODIFY COLUMN `estado` VARCHAR(30) NOT NULL DEFAULT 'RECIBIDA'");
    await sequelize.query("UPDATE `compra` SET `estado` = 'RECIBIDA' WHERE `estado` = 'PENDIENTE'");
    await sequelize.query("ALTER TABLE `pago` MODIFY COLUMN `metodoPago` VARCHAR(50) NOT NULL");
  } catch (err) {
    console.warn('[DB Migration] ⚠️ Error actualizando compra.estado / pago.metodoPago:', err.message);
  }

  try {
    // 6. venta.origen y venta.tiempoEstimadoEntrega
    const [origenCols] = await sequelize.query("SHOW COLUMNS FROM `venta` LIKE 'origen'");
    if (!origenCols || origenCols.length === 0) {
      await sequelize.query("ALTER TABLE `venta` ADD COLUMN `origen` VARCHAR(30) NULL AFTER `observaciones`");
    }
    const [tiempoCols] = await sequelize.query("SHOW COLUMNS FROM `venta` LIKE 'tiempoEstimadoEntrega'");
    if (!tiempoCols || tiempoCols.length === 0) {
      await sequelize.query("ALTER TABLE `venta` ADD COLUMN `tiempoEstimadoEntrega` VARCHAR(60) NULL AFTER `origen`");
    }
  } catch (err) {
    console.warn('[DB Migration] ⚠️ Error asegurando venta.origen / tiempoEstimadoEntrega:', err.message);
  }

  try {
    // 7. Tabla relacional detallecombo para Combos (Ítems 97 y 106)
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS \`detallecombo\` (
        \`idDetalleCombo\` INT AUTO_INCREMENT PRIMARY KEY,
        \`idCombo\` INT NOT NULL,
        \`idProducto\` INT NOT NULL,
        \`cantidad\` INT NOT NULL DEFAULT 1,
        \`esOpcional\` TINYINT(1) NOT NULL DEFAULT 0,
        \`grupoSeleccion\` VARCHAR(80) NULL,
        KEY \`idx_combo_id\` (\`idCombo\`),
        KEY \`idx_combo_prod\` (\`idProducto\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('[DB] ✅ Tabla relacional detallecombo verificada/creada.');
  } catch (err) {
    console.warn('[DB Migration] ⚠️ Error asegurando tabla detallecombo:', err.message);
  }

  try {
    // 8. Asegurar tipos de documento PPT y TI en tabla tipodocumento (Ítems 21, 120)
    await sequelize.query("INSERT IGNORE INTO `tipodocumento` (`nombre`) VALUES ('PPT'), ('TI')");
  } catch (err) {
    console.warn('[DB Migration] ⚠️ Error asegurando tipodocumento PPT/TI:', err.message);
  }
}

/**
 * Asegura la creación y esquema de la tabla devolucion para el módulo de devoluciones
 */
async function ensureDevolucionSchema() {
  const sequelize = connectDB.sequelize;
  try {
    // Asegurar columnas de tabla devolucion para el módulo de devoluciones
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS \`devolucion\` (
        \`idDevolucion\` INT(11) NOT NULL AUTO_INCREMENT,
        \`idVenta\` INT(11) NOT NULL,
        \`idCliente\` INT(11) DEFAULT NULL,
        \`motivo\` VARCHAR(255) NOT NULL,
        \`tipoResolucion\` VARCHAR(50) NOT NULL DEFAULT 'CAMBIO_PRODUCTO',
        \`productosDevueltos\` LONGTEXT DEFAULT NULL,
        \`valorDevuelto\` DECIMAL(12, 2) DEFAULT 0.00,
        \`descripcion\` TEXT DEFAULT NULL,
        \`evidencia\` VARCHAR(500) DEFAULT NULL,
        \`estado\` VARCHAR(50) DEFAULT 'PENDIENTE',
        \`motivoRechazo\` TEXT DEFAULT NULL,
        \`accionRealizada\` TEXT DEFAULT NULL,
        \`fecha\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        \`fechaResolucion\` DATETIME DEFAULT NULL,
        \`usuarioResolucionId\` INT(11) DEFAULT NULL,
        PRIMARY KEY (\`idDevolucion\`),
        KEY \`idx_devolucion_venta\` (\`idVenta\`),
        KEY \`idx_devolucion_cliente\` (\`idCliente\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    const [dTipoRes] = await sequelize.query("SHOW COLUMNS FROM `devolucion` LIKE 'tipoResolucion'");
    if (!dTipoRes || dTipoRes.length === 0) {
      await sequelize.query("ALTER TABLE `devolucion` ADD COLUMN `tipoResolucion` VARCHAR(50) NOT NULL DEFAULT 'CAMBIO_PRODUCTO' AFTER `motivo`");
    }
    const [dCli] = await sequelize.query("SHOW COLUMNS FROM `devolucion` LIKE 'idCliente'");
    if (!dCli || dCli.length === 0) {
      await sequelize.query("ALTER TABLE `devolucion` ADD COLUMN `idCliente` INT(11) NULL AFTER `idVenta`");
    }
    const [dProds] = await sequelize.query("SHOW COLUMNS FROM `devolucion` LIKE 'productosDevueltos'");
    if (!dProds || dProds.length === 0) {
      await sequelize.query("ALTER TABLE `devolucion` ADD COLUMN `productosDevueltos` LONGTEXT NULL AFTER `tipoResolucion`");
    }
    const [dEvi] = await sequelize.query("SHOW COLUMNS FROM `devolucion` LIKE 'evidencia'");
    if (!dEvi || dEvi.length === 0) {
      await sequelize.query("ALTER TABLE `devolucion` ADD COLUMN `evidencia` VARCHAR(500) NULL AFTER `descripcion`");
    }
    const [dRechazo] = await sequelize.query("SHOW COLUMNS FROM `devolucion` LIKE 'motivoRechazo'");
    if (!dRechazo || dRechazo.length === 0) {
      await sequelize.query("ALTER TABLE `devolucion` ADD COLUMN `motivoRechazo` TEXT NULL AFTER `estado`");
    }
    const [dAccion] = await sequelize.query("SHOW COLUMNS FROM `devolucion` LIKE 'accionRealizada'");
    if (!dAccion || dAccion.length === 0) {
      await sequelize.query("ALTER TABLE `devolucion` ADD COLUMN `accionRealizada` TEXT NULL AFTER `motivoRechazo`");
    }
    const [dFResol] = await sequelize.query("SHOW COLUMNS FROM `devolucion` LIKE 'fechaResolucion'");
    if (!dFResol || dFResol.length === 0) {
      await sequelize.query("ALTER TABLE `devolucion` ADD COLUMN `fechaResolucion` DATETIME NULL AFTER `fecha`");
    }
    const [dUserResol] = await sequelize.query("SHOW COLUMNS FROM `devolucion` LIKE 'usuarioResolucionId'");
    if (!dUserResol || dUserResol.length === 0) {
      await sequelize.query("ALTER TABLE `devolucion` ADD COLUMN `usuarioResolucionId` INT(11) NULL AFTER `fechaResolucion`");
    }
    await sequelize.query("ALTER TABLE `devolucion` MODIFY COLUMN `estado` VARCHAR(50) NOT NULL DEFAULT 'PENDIENTE'");
    const [dDatosReem] = await sequelize.query("SHOW COLUMNS FROM `devolucion` LIKE 'datosReembolso'");
    if (!dDatosReem || dDatosReem.length === 0) {
      await sequelize.query("ALTER TABLE `devolucion` ADD COLUMN `datosReembolso` TEXT NULL AFTER `valorDevuelto`");
    }
    const [dEstReem] = await sequelize.query("SHOW COLUMNS FROM `devolucion` LIKE 'estadoReembolso'");
    if (!dEstReem || dEstReem.length === 0) {
      await sequelize.query("ALTER TABLE `devolucion` ADD COLUMN `estadoReembolso` VARCHAR(40) NULL AFTER `datosReembolso`");
    }
    const [dRefReem] = await sequelize.query("SHOW COLUMNS FROM `devolucion` LIKE 'referenciaReembolso'");
    if (!dRefReem || dRefReem.length === 0) {
      await sequelize.query("ALTER TABLE `devolucion` ADD COLUMN `referenciaReembolso` VARCHAR(150) NULL AFTER `estadoReembolso`");
    }
    const [dIdVentReemp] = await sequelize.query("SHOW COLUMNS FROM `devolucion` LIKE 'idVentaReemplazo'");
    if (!dIdVentReemp || dIdVentReemp.length === 0) {
      await sequelize.query("ALTER TABLE `devolucion` ADD COLUMN `idVentaReemplazo` INT(11) NULL AFTER `usuarioResolucionId`");
    }
    const [dCodVentReemp] = await sequelize.query("SHOW COLUMNS FROM `devolucion` LIKE 'codigoVentaReemplazo'");
    if (!dCodVentReemp || dCodVentReemp.length === 0) {
      await sequelize.query("ALTER TABLE `devolucion` ADD COLUMN `codigoVentaReemplazo` VARCHAR(60) NULL AFTER `idVentaReemplazo`");
    }
    console.log('[DB] ✅ Tabla y columnas de devolucion verificadas/aseguradas.');
  } catch (err) {
    console.warn('[DB Migration] ⚠️ Error asegurando columnas de devolucion:', err.message);
  }
}

async function ensureInsumoIvaManualSchema() {
  const sequelize = connectDB.sequelize;
  try {
    // 1. Columna porcentajeIva en tabla insumo
    const [insIvaCols] = await sequelize.query("SHOW COLUMNS FROM `insumo` LIKE 'porcentajeIva'");
    if (!insIvaCols || insIvaCols.length === 0) {
      await sequelize.query("ALTER TABLE `insumo` ADD COLUMN `porcentajeIva` DECIMAL(5, 2) DEFAULT 0.00 AFTER `incluyeIva`");
      console.log('[DB Migration] ✅ Columna insumo.porcentajeIva agregada.');
    }
    // Inicializar insumos existentes que tengan incluyeIva = 1 con porcentajeIva = 19
    await sequelize.query("UPDATE `insumo` SET `porcentajeIva` = 19.00 WHERE `incluyeIva` = 1 AND (`porcentajeIva` IS NULL OR `porcentajeIva` = 0.00)");

    // 2. Columnas iva, porcentajeIva, incluyeIva en tabla detallecomprainsumo
    const [detIvaCols] = await sequelize.query("SHOW COLUMNS FROM `detallecomprainsumo` LIKE 'iva'");
    if (!detIvaCols || detIvaCols.length === 0) {
      await sequelize.query("ALTER TABLE `detallecomprainsumo` ADD COLUMN `iva` DECIMAL(12, 2) DEFAULT 0.00 AFTER `subtotal`");
      console.log('[DB Migration] ✅ Columna detallecomprainsumo.iva agregada.');
    }
    const [detPctCols] = await sequelize.query("SHOW COLUMNS FROM `detallecomprainsumo` LIKE 'porcentajeIva'");
    if (!detPctCols || detPctCols.length === 0) {
      await sequelize.query("ALTER TABLE `detallecomprainsumo` ADD COLUMN `porcentajeIva` DECIMAL(5, 2) DEFAULT 0.00 AFTER `iva`");
      console.log('[DB Migration] ✅ Columna detallecomprainsumo.porcentajeIva agregada.');
    }
    const [detIncCols] = await sequelize.query("SHOW COLUMNS FROM `detallecomprainsumo` LIKE 'incluyeIva'");
    if (!detIncCols || detIncCols.length === 0) {
      await sequelize.query("ALTER TABLE `detallecomprainsumo` ADD COLUMN `incluyeIva` TINYINT(1) DEFAULT 0 AFTER `porcentajeIva`");
      console.log('[DB Migration] ✅ Columna detallecomprainsumo.incluyeIva agregada.');
    }
    console.log('[DB] ✅ Esquema de IVA manual para insumos y compras verificado.');
  } catch (err) {
    console.warn('[DB Migration] ⚠️ Error asegurando esquema de IVA manual:', err.message);
  }
}

/**
 * Asegura la creación y esquema de la tabla empleado para el subproceso de Gestión de Empleados
 */
async function ensureEmpleadoSchema() {
  const sequelize = connectDB.sequelize;
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS \`empleado\` (
        \`idEmpleado\` INT(11) NOT NULL AUTO_INCREMENT,
        \`nombre\` VARCHAR(100) NOT NULL,
        \`apellidos\` VARCHAR(100) NOT NULL,
        \`tipoDocumento\` VARCHAR(20) NOT NULL DEFAULT 'C.C.',
        \`numeroDocumento\` VARCHAR(50) NOT NULL,
        \`telefono\` VARCHAR(30) DEFAULT NULL,
        \`correo\` VARCHAR(150) DEFAULT NULL,
        \`direccion\` VARCHAR(255) DEFAULT NULL,
        \`cargo\` VARCHAR(100) NOT NULL,
        \`fechaContratacion\` DATE DEFAULT NULL,
        \`fechaInicio\` DATE DEFAULT NULL,
        \`fechaFin\` DATE DEFAULT NULL,
        \`tipoContrato\` VARCHAR(50) DEFAULT 'Término Fijo',
        \`salario\` DECIMAL(12,2) DEFAULT '0.00',
        \`turno\` VARCHAR(50) DEFAULT 'Completo',
        \`estado\` VARCHAR(20) DEFAULT 'Activo',
        \`eliminado\` TINYINT(4) DEFAULT 0,
        \`idUsuario\` INT(11) DEFAULT NULL,
        \`foto\` TEXT DEFAULT NULL,
        PRIMARY KEY (\`idEmpleado\`),
        UNIQUE KEY \`UK_Empleado_Documento\` (\`numeroDocumento\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Migraciones seguras si la tabla ya existía
    try {
      const [cols] = await sequelize.query("SHOW COLUMNS FROM `empleado`");
      const colNames = (cols || []).map((c) => c.Field || c.field || c.COLUMN_NAME);

      if (!colNames.includes('fechaInicio')) {
        await sequelize.query("ALTER TABLE `empleado` ADD COLUMN `fechaInicio` DATE DEFAULT NULL AFTER `fechaContratacion`");
        await sequelize.query("UPDATE `empleado` SET `fechaInicio` = `fechaContratacion` WHERE `fechaInicio` IS NULL");
      }

      if (!colNames.includes('fechaFin')) {
        await sequelize.query("ALTER TABLE `empleado` ADD COLUMN `fechaFin` DATE DEFAULT NULL AFTER `fechaInicio`");
      }

      const estadoCol = (cols || []).find((c) => (c.Field || c.field) === 'estado');
      if (estadoCol && String(estadoCol.Type || estadoCol.type).toLowerCase().includes('tinyint')) {
        await sequelize.query("ALTER TABLE `empleado` MODIFY COLUMN `estado` VARCHAR(20) DEFAULT 'Activo'");
        await sequelize.query("UPDATE `empleado` SET `estado` = 'Activo' WHERE `estado` = '1'");
        await sequelize.query("UPDATE `empleado` SET `estado` = 'Inactivo' WHERE `estado` = '0'");
      }
    } catch (migErr) {
      console.warn('[DB Migration] Nota asegurando columnas fechaFin/estado en empleado:', migErr.message);
    }

    const [rows] = await sequelize.query("SELECT COUNT(*) as count FROM `empleado`");
    if (rows && rows[0] && Number(rows[0].count) === 0) {
      await sequelize.query(`
        INSERT INTO \`empleado\` (\`idUsuario\`, \`nombre\`, \`apellidos\`, \`tipoDocumento\`, \`numeroDocumento\`, \`telefono\`, \`correo\`, \`direccion\`, \`cargo\`, \`fechaContratacion\`, \`fechaInicio\`, \`fechaFin\`, \`tipoContrato\`, \`salario\`, \`turno\`, \`estado\`, \`eliminado\`) VALUES
        (4, 'Admin', 'Sistema', 'C.C.', '1020304050', '3190000001', 'admin@chazinfood.com', 'Sede Principal Chazin Food', 'Administrador', '2026-01-01', '2026-01-01', NULL, 'Término Indefinido', 2500000.00, 'Completo', 'Activo', 0),
        (27, 'Magnolia', 'Pripra', 'C.C.', '1010101010', '1010101010', 'magnolia@gmail.com', 'Calle 10 # 45-20', 'Cocinero', '2026-01-15', '2026-01-15', '2026-12-31', 'Término Fijo', 1600000.00, 'Mañana - Tarde', 'Activo', 0),
        (24, 'Vendedor Principal', 'Chazin', 'C.C.', '1030405060', '3001234567', 'vendedor@chazinfood.com', 'Carrera 50 # 32-15', 'Vendedor', '2026-02-01', '2026-02-01', '2026-12-31', 'Término Fijo', 1400000.00, 'Tarde - Noche', 'Activo', 0);
      `);
      console.log('[DB] ✅ Tabla empleado inicializada con datos semilla.');
    }
  } catch (err) {
    console.warn('[DB Migration] ⚠️ Error asegurando tabla empleado:', err.message);
  }
}

/**
 * Aplica los precios reales de mercado en Medellín (COP) a los 43 insumos
 * y garantiza disponibilidad de inventario para que hamburguesas y combos
 * no queden bloqueados en estado "AGOTADO POR EL MOMENTO".
 */
async function ensurePreciosRealesInsumosYStock() {
  const sequelize = connectDB.sequelize;
  try {
    const preciosReales = [
      { id: 1, precio: 2500, unidad: 'und' },
      { id: 2, precio: 9500, unidad: 'paq' },
      { id: 5, precio: 3800, unidad: 'kg' },
      { id: 7, precio: 6500, unidad: 'Unidad' },
      { id: 8, precio: 2200, unidad: 'und' },
      { id: 9, precio: 30000, unidad: 'Kg' },
      { id: 10, precio: 4000, unidad: 'Kg' },
      { id: 12, precio: 2000, unidad: 'und' },
      { id: 13, precio: 1400, unidad: 'und' },
      { id: 14, precio: 28000, unidad: 'kg' },
      { id: 15, precio: 17500, unidad: 'kg' },
      { id: 16, precio: 1500, unidad: 'und' },
      { id: 17, precio: 3000, unidad: 'und' },
      { id: 18, precio: 35000, unidad: 'kg' },
      { id: 19, precio: 750, unidad: 'und' },
      { id: 20, precio: 26000, unidad: 'kg' },
      { id: 21, precio: 9500, unidad: 'kg' },
      { id: 22, precio: 4000, unidad: 'kg' },
      { id: 23, precio: 4200, unidad: 'kg' },
      { id: 24, precio: 3500, unidad: 'kg' },
      { id: 25, precio: 16000, unidad: 'kg' },
      { id: 26, precio: 11500, unidad: 'kg' },
      { id: 27, precio: 10000, unidad: 'kg' },
      { id: 28, precio: 14000, unidad: 'kg' },
      { id: 29, precio: 2500, unidad: 'und' },
      { id: 30, precio: 2100, unidad: 'und' },
      { id: 31, precio: 1300, unidad: 'und' },
      { id: 32, precio: 2500, unidad: 'und' },
      { id: 33, precio: 2100, unidad: 'und' },
      { id: 34, precio: 2100, unidad: 'und' },
      { id: 35, precio: 2100, unidad: 'und' },
      { id: 36, precio: 2500, unidad: 'und' },
      { id: 37, precio: 2500, unidad: 'und' },
      { id: 38, precio: 9800, unidad: 'kg' },
      { id: 39, precio: 18000, unidad: 'kg' },
      { id: 40, precio: 15000, unidad: 'kg' },
      { id: 41, precio: 12000, unidad: 'kg' },
      { id: 42, precio: 5000, unidad: 'kg' },
      { id: 43, precio: 18000, unidad: 'kg' },
      { id: 44, precio: 11000, unidad: 'kg' },
      { id: 45, precio: 12000, unidad: 'kg' },
      { id: 47, precio: 2100, unidad: 'Unidad' },
      { id: 48, precio: 2100, unidad: 'und' }
    ];

    for (const item of preciosReales) {
      await sequelize.query(
        `UPDATE \`insumo\` SET \`precioUnitario\` = ${item.precio}, \`unidadMedida\` = '${item.unidad}' WHERE \`idInsumo\` = ${item.id}`
      );
    }

    // Abastecer inventario de ingredientes base para que las recetas y combos tengan disponibilidad activa
    const stockGarantizado = [
      { id: 12, minStock: 110 }, // Pan Brioche Artesanal
      { id: 13, minStock: 100 }, // Pan Perro Americano
      { id: 14, minStock: 50 },  // Carne de Res Molida 80/20 (kg)
      { id: 15, minStock: 30 },  // Pechuga de Pollo Fresca (kg)
      { id: 16, minStock: 120 }, // Salchicha Americana
      { id: 17, minStock: 60 },  // Salchicha Suiza
      { id: 18, minStock: 25 },  // Tocineta Ahumada (kg)
      { id: 19, minStock: 180 }, // Queso Cheddar (und)
      { id: 20, minStock: 25 },  // Queso Mozzarella (kg)
      { id: 21, minStock: 60 },  // Papas Francesa (kg)
      { id: 22, minStock: 20 },  // Lechuga Batavia (kg)
      { id: 23, minStock: 20 },  // Tomate Chonto (kg)
      { id: 24, minStock: 25 },  // Cebolla Cabezona (kg)
      { id: 26, minStock: 15 },  // Salsa Tomate (kg)
      { id: 27, minStock: 15 },  // Mostaza (kg)
      { id: 28, minStock: 15 }   // Mayonesa (kg)
    ];

    for (const s of stockGarantizado) {
      await sequelize.query(
        `UPDATE \`insumo\` SET \`stock\` = ${s.minStock}, \`estado\` = 1 WHERE \`idInsumo\` = ${s.id} AND (\`stock\` <= 0 OR \`stock\` IS NULL)`
      );
    }

    // Insumos complementarios de cocina y salsas
    const extras = [
      { id: 44, minStock: 20 },
      { id: 45, minStock: 15 },
      { id: 43, minStock: 30 },
      { id: 40, minStock: 20 },
      { id: 38, minStock: 30 }
    ];
    for (const s of extras) {
      await sequelize.query('UPDATE insumo SET stock = ' + s.minStock + ', estado = 1 WHERE idInsumo = ' + s.id + ' AND (stock <= 0 OR stock IS NULL)');
    }
    await sequelize.query('UPDATE insumo SET estado = 1 WHERE eliminado = 0 AND (stock > 0 OR stock IS NULL)');
    await sequelize.query('UPDATE insumo SET fechaVencimiento = NULL WHERE fechaVencimiento IS NOT NULL AND fechaVencimiento <= CURDATE()');

    console.log('[DB] ✅ Precios reales de Medellín (43 insumos) y stock de producción garantizados.');
  } catch (err) {
    console.warn('[DB Migration] ⚠️ Error asegurando precios reales de insumos:', err.message);
  }
}

module.exports = {
  resetAutoIncrement,
  resequenceTableIds,
  resequenceAllCoreTables,
  ensureFichaTecnicaTrashSchema,
  ensureFichaTecnicaInsumoVariantZero,
  ensureFichaTecnicaColombiaTimezone,
  ensureEventoColumnsSchema,
  syncVentasTotals,
  ensureCategoriaProductoIconSchema,
  ensureCategoriaInsumoIconSchema,
  ensureConfiguracionComboSchema,
  ensureVarianteImagenSchema,
  ensureVentaAprobacionSchema,
  ensureUsuarioDocumentoSchema,
  ensureResenaSchema,
  ensureNoNegativeStock,
  ensureInsumoEliminadoSchema,
  ensureInsumoCategoriaNullableSchema,
  ensureInsumoAdicionSchema,
  ensureProductoAdicionesDefaultSchema,
  ensureCompraLotesYCancelacionSchema,
  ensureActaRevisionSchema,
  ensureEmpleadoSchema,
  ensureDevolucionSchema,
  ensureInsumoIvaManualSchema,
  ensurePreciosRealesInsumosYStock,
  ensureVarianteInsumoSchema
};
