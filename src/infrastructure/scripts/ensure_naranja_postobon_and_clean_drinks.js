const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'chazinfood',
    port: process.env.DB_PORT || 3306
  });

  console.log('[MIGRATION] Connected to MySQL database.');

  try {
    // 1. Fix Product 38 category
    await conn.query(`
      UPDATE producto 
      SET categoria = 'Bebidas', idCategoriaProducto = 4 
      WHERE idProducto = 38
    `);
    console.log('[MIGRATION] Updated product 38 category to Bebidas.');

    // 2. Ensure Insumo 48 for Naranja Postobón
    const [ins48] = await conn.query('SELECT * FROM insumo WHERE idInsumo = 48 OR nombre LIKE ?', ['%Naranja Postob%']);
    let insumoNaranjaId = 48;
    if (ins48.length === 0) {
      await conn.query(`
        INSERT INTO insumo (idInsumo, idCategoriaInsumo, nombre, descripcion, stock, stockMinimo, unidadMedida, precioUnitario, estado)
        VALUES (48, 4, 'Gaseosa Naranja Postobón 400ml', 'Gaseosa Naranja Postobón 400ml para venta directa', 60.00, 10.00, 'und', 2500.00, 1)
      `);
      console.log('[MIGRATION] Inserted Insumo 48 (Gaseosa Naranja Postobón 400ml).');
    } else {
      insumoNaranjaId = ins48[0].idInsumo;
      await conn.query(`
        UPDATE insumo 
        SET stock = GREATEST(stock, 50.00), estado = 1 
        WHERE idInsumo = ?
      `, [insumoNaranjaId]);
      console.log(`[MIGRATION] Insumo Naranja exists with ID ${insumoNaranjaId}.`);
    }

    // 3. Ensure Product 39 (Gaseosa Naranja Postobón 400ml)
    const [prod39] = await conn.query('SELECT * FROM producto WHERE idProducto = 39 OR nombre LIKE ?', ['%Naranja Postob%']);
    let prodNaranjaId = 39;
    if (prod39.length === 0) {
      await conn.query(`
        INSERT INTO producto (idProducto, idCategoriaProducto, nombre, descripcion, imagen, estado, precio, categoria)
        VALUES (39, 4, 'Gaseosa Naranja Postobón 400ml', 'Refrescante gaseosa sabor a naranja tradicional de Postobón.', '/images/drinks/images__Gaseosa_naranja_-removebg-preview.png', 1, 8500.00, 'Bebidas')
      `);
      console.log('[MIGRATION] Inserted Product 39 (Gaseosa Naranja Postobón 400ml).');
    } else {
      prodNaranjaId = prod39[0].idProducto;
      await conn.query(`
        UPDATE producto 
        SET categoria = 'Bebidas', idCategoriaProducto = 4, estado = 1 
        WHERE idProducto = ?
      `, [prodNaranjaId]);
      console.log(`[MIGRATION] Product Naranja exists with ID ${prodNaranjaId}.`);
    }

    // 4. Ensure variants for Product 39
    const [vars39] = await conn.query('SELECT * FROM variante WHERE idProducto = ?', [prodNaranjaId]);
    const has15L = vars39.some(v => v.nombre.includes('1.5'));
    const has25L = vars39.some(v => v.nombre.includes('2.5') || v.nombre.includes('Mega'));

    if (!has15L) {
      await conn.query(`
        INSERT INTO variante (idProducto, nombre, precio, estado, imagen)
        VALUES (?, 'Botella 1.5 Litros', 8500.00, 1, '/images/drinks/naranga_1.5-removebg-preview.png')
      `, [prodNaranjaId]);
      console.log('[MIGRATION] Inserted 1.5L variant for Naranja.');
    }
    if (!has25L) {
      await conn.query(`
        INSERT INTO variante (idProducto, nombre, precio, estado, imagen)
        VALUES (?, 'Mega Botella 2.5 Litros', 12000.00, 1, '/images/drinks/postob_n_naranja_2.5l_1_-removebg-preview.png')
      `, [prodNaranjaId]);
      console.log('[MIGRATION] Inserted 2.5L variant for Naranja.');
    }

    // 5. Ensure Ficha Técnica for Product 39 linked to Insumo Naranja
    const [ficha39] = await conn.query('SELECT * FROM fichatecnica WHERE idProducto = ? AND estado = 1', [prodNaranjaId]);
    let fichaNaranjaId;
    if (ficha39.length === 0) {
      const [resF] = await conn.query(`
        INSERT INTO fichatecnica (idProducto, idVariante, descripcion, tipo, estado)
        VALUES (?, NULL, 'Receta y consumo directo de botella Gaseosa Naranja Postobón', 'PRODUCTO', 1)
      `, [prodNaranjaId]);
      fichaNaranjaId = resF.insertId;
      console.log(`[MIGRATION] Created Ficha Técnica ${fichaNaranjaId} for Naranja.`);
    } else {
      fichaNaranjaId = ficha39[0].idFichaTecnica;
    }

    // Check DetalleFichaInsumo
    const [detFicha39] = await conn.query('SELECT * FROM detallefichainsumo WHERE idFichaTecnica = ?', [fichaNaranjaId]);
    if (detFicha39.length === 0) {
      await conn.query(`
        INSERT INTO detallefichainsumo (idFichaTecnica, idInsumo, cantidad)
        VALUES (?, ?, 1.00)
      `, [fichaNaranjaId, insumoNaranjaId]);
      console.log(`[MIGRATION] Linked Ficha ${fichaNaranjaId} to Insumo ${insumoNaranjaId}.`);
    }

    // 6. Ensure Ficha for Product 38 (Uva) linked to Insumo 47 (Gaseosa Uva)
    const [ficha38] = await conn.query('SELECT * FROM fichatecnica WHERE idProducto = 38 AND estado = 1');
    if (ficha38.length > 0) {
      const f38Id = ficha38[0].idFichaTecnica;
      const [det38] = await conn.query('SELECT * FROM detallefichainsumo WHERE idFichaTecnica = ?', [f38Id]);
      if (det38.length === 0) {
        await conn.query(`
          INSERT INTO detallefichainsumo (idFichaTecnica, idInsumo, cantidad)
          VALUES (?, 47, 1.00)
        `, [f38Id]);
        console.log(`[MIGRATION] Linked Ficha Uva to Insumo 47.`);
      }
    }

    console.log('[MIGRATION] Finished successfully!');
  } catch (err) {
    console.error('[MIGRATION] Error:', err);
  } finally {
    await conn.end();
  }
}

run();
