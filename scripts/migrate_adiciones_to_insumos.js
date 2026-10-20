const { sequelize } = require('../src/persistence/models');

async function runMigration() {
  const queryInterface = sequelize.getQueryInterface();

  console.log('--- Starting Migration: Adiciones to Insumos ---');

  // 1. Add columns to `insumo` if they don't already exist
  const [cols] = await sequelize.query('DESCRIBE insumo');
  const colNames = cols.map(c => c.Field);

  if (!colNames.includes('esAdicion')) {
    console.log('Adding column `esAdicion` to `insumo`...');
    await sequelize.query('ALTER TABLE `insumo` ADD COLUMN `esAdicion` TINYINT(1) NOT NULL DEFAULT 0 AFTER `estado`');
  } else {
    console.log('Column `esAdicion` already exists in `insumo`.');
  }

  if (!colNames.includes('precioAdicion')) {
    console.log('Adding column `precioAdicion` to `insumo`...');
    await sequelize.query('ALTER TABLE `insumo` ADD COLUMN `precioAdicion` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER `esAdicion`');
  } else {
    console.log('Column `precioAdicion` already exists in `insumo`.');
  }

  if (!colNames.includes('imagen')) {
    console.log('Adding column `imagen` to `insumo`...');
    await sequelize.query('ALTER TABLE `insumo` ADD COLUMN `imagen` VARCHAR(255) NULL AFTER `precioAdicion`');
  } else {
    console.log('Column `imagen` already exists in `insumo`.');
  }

  // 2. Check if table `adicion` exists
  const [tables] = await sequelize.query("SHOW TABLES LIKE 'adicion'");
  if (tables.length > 0) {
    console.log('Table `adicion` exists. Migrating data to `insumo`...');

    // Migrate adiciones data to insumo
    await sequelize.query(`
      UPDATE insumo i
      JOIN adicion a ON i.idInsumo = a.idInsumo
      SET 
        i.esAdicion = 1,
        i.precioAdicion = IF(a.precio > 0, a.precio, i.precioAdicion),
        i.imagen = IF(a.imagen IS NOT NULL AND a.imagen != '', a.imagen, i.imagen)
    `);

    // 3. Update detalleventaadicion so idAdicion references idInsumo
    const [dvaTables] = await sequelize.query("SHOW TABLES LIKE 'detalleventaadicion'");
    if (dvaTables.length > 0) {
      console.log('Updating `detalleventaadicion` to reference `insumo(idInsumo)`...');
      try {
        await sequelize.query(`
          UPDATE detalleventaadicion dva
          JOIN adicion a ON dva.idAdicion = a.idAdicion
          SET dva.idAdicion = a.idInsumo
        `);
      } catch (err) {
        console.warn('Notice updating detalleventaadicion rows:', err.message);
      }

      // Check foreign keys on detalleventaadicion
      const [fks] = await sequelize.query(`
        SELECT CONSTRAINT_NAME 
        FROM information_schema.KEY_COLUMN_USAGE 
        WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'detalleventaadicion' 
          AND COLUMN_NAME = 'idAdicion'
          AND REFERENCED_TABLE_NAME IS NOT NULL
      `);

      for (const fk of fks) {
        console.log(`Dropping FK constraint ${fk.CONSTRAINT_NAME} from detalleventaadicion...`);
        try {
          await sequelize.query(`ALTER TABLE \`detalleventaadicion\` DROP FOREIGN KEY \`${fk.CONSTRAINT_NAME}\``);
        } catch (e) {
          console.warn('Error dropping FK:', e.message);
        }
      }

      // Add new FK to insumo
      try {
        console.log('Adding new FK on detalleventaadicion(idAdicion) -> insumo(idInsumo)...');
        await sequelize.query(`
          ALTER TABLE \`detalleventaadicion\`
          ADD CONSTRAINT \`fk_detalleventaadicion_insumo\`
          FOREIGN KEY (\`idAdicion\`) REFERENCES \`insumo\` (\`idInsumo\`)
          ON DELETE CASCADE ON UPDATE CASCADE
        `);
      } catch (e) {
        console.warn('Notice adding new FK to insumo (may already exist or index mismatch):', e.message);
      }
    }

    // 4. Drop table `adicion`
    console.log('Dropping table `adicion`...');
    await sequelize.query('DROP TABLE IF EXISTS `adicion`');
    console.log('Table `adicion` successfully dropped.');
  } else {
    console.log('Table `adicion` does not exist (already dropped).');
  }

  // 5. Verification
  const [insumoAds] = await sequelize.query('SELECT idInsumo, nombre, esAdicion, precioAdicion, imagen FROM insumo WHERE esAdicion = 1');
  console.log(`Verification: Found ${insumoAds.length} insumos marked as adición:`);
  insumoAds.forEach(item => {
    console.log(`- [ID: ${item.idInsumo}] ${item.nombre}: $${item.precioAdicion} (img: ${item.imagen || 'none'})`);
  });

  console.log('--- Migration Completed Successfully ---');
}

runMigration()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
