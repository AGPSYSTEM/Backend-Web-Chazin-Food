require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function migrate() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'chazinfood'
  });

  console.log('Connected to database:', process.env.DB_NAME);
  await conn.query('SET FOREIGN_KEY_CHECKS = 0;');

  // 1. Move all existing clients (currently idRol = 3) to idRol = 4
  const [updateUsers] = await conn.query('UPDATE usuario SET idRol = 4 WHERE idRol = 3;');
  console.log(`Updated ${updateUsers.affectedRows} client users to idRol = 4`);

  // 2. Ensure roles 3 (Vendedor) and 4 (Cliente) exist with exact names and descriptions
  await conn.query("INSERT INTO rol (idRol, nombre, descripcion, estado) VALUES (3, 'Vendedor', 'Módulo de Punto de Venta y Gestión Comercial', 1) ON DUPLICATE KEY UPDATE nombre='Vendedor', descripcion='Módulo de Punto de Venta y Gestión Comercial', estado=1;");
  await conn.query("INSERT INTO rol (idRol, nombre, descripcion, estado) VALUES (4, 'Cliente', 'Acceso a compras y perfil de cliente', 1) ON DUPLICATE KEY UPDATE nombre='Cliente', descripcion='Acceso a compras y perfil de cliente', estado=1;");

  console.log('Role records synchronized: ID 1 = Administrador, ID 2 = Cocinero, ID 3 = Vendedor, ID 4 = Cliente');

  // 3. Ensure permissions exist
  const targetPerms = [
    'Punto de Venta',
    'Vendedor',
    'Ventas',
    'Clientes',
    'Gestión de Ventas',
    'Categoría Productos',
    'Productos'
  ];

  for (const p of targetPerms) {
    const [existingPerm] = await conn.query('SELECT idPermiso FROM permiso WHERE nombrePermiso = ?;', [p]);
    if (existingPerm.length === 0) {
      await conn.query('INSERT INTO permiso (nombrePermiso) VALUES (?);', [p]);
    }
  }

  // 4. Assign permissions to Vendedor (idRol = 3) and Cliente (idRol = 4)
  await conn.query('DELETE FROM rolpermiso WHERE idRol = 3;');
  const [permRows] = await conn.query('SELECT idPermiso, nombrePermiso FROM permiso WHERE nombrePermiso IN (?);', [targetPerms]);
  for (const pr of permRows) {
    await conn.query('INSERT INTO rolpermiso (idRol, idPermiso) VALUES (3, ?);', [pr.idPermiso]);
  }
  console.log('Permissions assigned to Vendedor:', permRows.map(p => p.nombrePermiso));

  const clientePerms = ['Producción', 'Productos', 'Ventas', 'Clientes'];
  await conn.query('DELETE FROM rolpermiso WHERE idRol = 4;');
  const [cliPermRows] = await conn.query('SELECT idPermiso, nombrePermiso FROM permiso WHERE nombrePermiso IN (?);', [clientePerms]);
  for (const cpr of cliPermRows) {
    await conn.query('INSERT INTO rolpermiso (idRol, idPermiso) VALUES (4, ?);', [cpr.idPermiso]);
  }
  console.log('Permissions assigned to Cliente:', cliPermRows.map(p => p.nombrePermiso));

  // 5. Create or update user vendedor@chazinfood.com
  const passHash = await bcrypt.hash('vendedor123', 10);
  const [existing] = await conn.query('SELECT idUsuario FROM usuario WHERE email = ?;', ['vendedor@chazinfood.com']);
  if (existing.length > 0) {
    await conn.query(
      'UPDATE usuario SET nombre = ?, apellidos = ?, contrasena = ?, idRol = 3, estado = ? WHERE idUsuario = ?;',
      ['Vendedor Principal', 'Chazin', passHash, 'ACTIVO', existing[0].idUsuario]
    );
    console.log('Updated existing vendedor user (ID: ' + existing[0].idUsuario + ')');
  } else {
    const [insRes] = await conn.query(
      'INSERT INTO usuario (nombre, apellidos, tipoDocumento, telefono, email, contrasena, idRol, estado, fechaRegistro) VALUES (?, ?, ?, ?, ?, ?, 3, ?, NOW());',
      ['Vendedor Principal', 'Chazin', 'C.C.', '3001234567', 'vendedor@chazinfood.com', passHash, 'ACTIVO']
    );
    console.log('Created new vendedor user with ID:', insRes.insertId);
  }

  await conn.query('SET FOREIGN_KEY_CHECKS = 1;');

  // Check and display final state
  const [roles] = await conn.query('SELECT * FROM rol ORDER BY idRol ASC;');
  console.log('Final Roles in DB:', roles);

  const [vendorUser] = await conn.query('SELECT idUsuario, nombre, email, idRol, estado FROM usuario WHERE email = ?;', ['vendedor@chazinfood.com']);
  console.log('Vendor User Details:', vendorUser[0]);

  await conn.end();
  console.log('Migration successfully completed!');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
