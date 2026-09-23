const { sequelize } = require('../src/persistence/models');

async function addDrinkSizesAndPostobonFlavors() {
  const t = await sequelize.transaction();
  try {
    console.log('--- Actualizando tamaños de bebidas y sabores Postobón ---');

    // 1. Insumos para Postobón Uva y Naranja si no existen
    const insumosPostobon = [
      { idInsumo: 46, nombre: 'Gaseosa Uva Postobón 400ml', stock: 60.0, precioUnitario: 2400.0 },
      { idInsumo: 47, nombre: 'Gaseosa Naranja Postobón 400ml', stock: 60.0, precioUnitario: 2400.0 },
    ];

    for (const ins of insumosPostobon) {
      const [exists] = await sequelize.query(
        'SELECT idInsumo FROM insumo WHERE idInsumo = ? OR nombre = ?',
        { replacements: [ins.idInsumo, ins.nombre], transaction: t }
      );
      if (exists.length === 0) {
        await sequelize.query(
          `INSERT INTO insumo (idInsumo, idCategoriaInsumo, nombre, descripcion, stock, stockMinimo, unidadMedida, precioUnitario, estado)
           VALUES (?, 4, ?, ?, ?, 10, 'und', ?, 1)`,
          {
            replacements: [ins.idInsumo, ins.nombre, `${ins.nombre} para venta directa`, ins.stock, ins.precioUnitario],
            transaction: t
          }
        );
        console.log(`+ Insumo creado: ${ins.nombre}`);
      }
    }

    // 2. Productos Postobón Uva y Postobón Naranja
    const newProducts = [
      {
        nombre: 'Gaseosa Uva Postobón 400ml',
        descripcion: 'Gaseosa Postobón sabor Uva dulce y burbujeante, bien fría para acompañar tus comidas.',
        precio: 4000.0,
        categoria: 'Bebidas',
        idCategoriaProducto: 4,
        imagen: 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789001495/qy8wy9igmgb0wppnjavw.png', // Fallback or custom
        variantes: [
          { nombre: 'Botella 400 ml', precio: 4000.0 },
          { nombre: 'Botella 1.5 Litros', precio: 8500.0 },
          { nombre: 'Mega Botella 2.5 Litros', precio: 12000.0 }
        ]
      },
      {
        nombre: 'Gaseosa Naranja Postobón 400ml',
        descripcion: 'Gaseosa Postobón sabor Naranja cítrica y refrescante, ideal para acompañar tus hamburguesas y perros.',
        precio: 4000.0,
        categoria: 'Bebidas',
        idCategoriaProducto: 4,
        imagen: 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789001495/qy8wy9igmgb0wppnjavw.png',
        variantes: [
          { nombre: 'Botella 400 ml', precio: 4000.0 },
          { nombre: 'Botella 1.5 Litros', precio: 8500.0 },
          { nombre: 'Mega Botella 2.5 Litros', precio: 12000.0 }
        ]
      }
    ];

    for (const p of newProducts) {
      const [existing] = await sequelize.query(
        'SELECT idProducto FROM producto WHERE nombre = ?',
        { replacements: [p.nombre], transaction: t }
      );
      let prodId;
      if (existing.length === 0) {
        const [res] = await sequelize.query(
          `INSERT INTO producto (nombre, descripcion, precio, categoria, idCategoriaProducto, imagen, estado)
           VALUES (?, ?, ?, ?, ?, ?, 1)`,
          {
            replacements: [p.nombre, p.descripcion, p.precio, p.categoria, p.idCategoriaProducto, p.imagen],
            transaction: t
          }
        );
        prodId = res;
        console.log(`+ Producto creado: ${p.nombre} (#${prodId})`);
      } else {
        prodId = existing[0].idProducto;
      }

      // Variantes de tamaños
      for (const v of p.variantes) {
        const [vExist] = await sequelize.query(
          'SELECT idVariante FROM variante WHERE idProducto = ? AND nombre = ?',
          { replacements: [prodId, v.nombre], transaction: t }
        );
        if (vExist.length === 0) {
          await sequelize.query(
            'INSERT INTO variante (idProducto, nombre, precio, estado) VALUES (?, ?, ?, 1)',
            { replacements: [prodId, v.nombre, v.precio], transaction: t }
          );
          console.log(`  + Variante creada para ${p.nombre}: ${v.nombre} ($${v.precio})`);
        }
      }
    }

    // 3. Añadir tamaños (400 ml, 1.5 Litros, 2.5 Litros) a las bebidas existentes
    const drinksSizeUpdates = [
      {
        idProducto: 9, // Manzana Postobón
        sizes: [
          { nombre: 'Botella 400 ml', precio: 4000.0, currentNameMatch: '400ml' },
          { nombre: 'Botella 1.5 Litros', precio: 8500.0 },
          { nombre: 'Mega Botella 2.5 Litros', precio: 12000.0 }
        ]
      },
      {
        idProducto: 12, // Colombiana Postobón
        sizes: [
          { nombre: 'Botella 400 ml', precio: 4000.0, currentNameMatch: '400ml' },
          { nombre: 'Botella 1.5 Litros', precio: 8500.0 },
          { nombre: 'Mega Botella 2.5 Litros', precio: 12000.0 }
        ]
      },
      {
        idProducto: 8, // Coca-Cola
        sizes: [
          { nombre: 'Botella 1.5 Litros', precio: 9500.0 },
          { nombre: 'Mega Botella 2.5 Litros', precio: 13500.0 }
        ]
      },
      {
        idProducto: 11, // Pepsi
        sizes: [
          { nombre: 'Botella 1.5 Litros', precio: 8500.0 },
          { nombre: 'Mega Botella 2.5 Litros', precio: 12000.0 }
        ]
      },
      {
        idProducto: 13, // Sprite
        sizes: [
          { nombre: 'Botella 1.5 Litros', precio: 9500.0 },
          { nombre: 'Mega Botella 2.5 Litros', precio: 13500.0 }
        ]
      },
      {
        idProducto: 14, // Quatro Toronja
        sizes: [
          { nombre: 'Botella 1.5 Litros', precio: 9500.0 },
          { nombre: 'Mega Botella 2.5 Litros', precio: 13500.0 }
        ]
      },
      {
        idProducto: 16, // Coca-Cola Sin Azúcar
        sizes: [
          { nombre: 'Botella 1.5 Litros', precio: 9500.0 },
          { nombre: 'Mega Botella 2.5 Litros', precio: 13500.0 }
        ]
      }
    ];

    for (const d of drinksSizeUpdates) {
      for (const s of d.sizes) {
        const [exist] = await sequelize.query(
          'SELECT idVariante FROM variante WHERE idProducto = ? AND (nombre = ? OR nombre LIKE ?)',
          { replacements: [d.idProducto, s.nombre, `%${s.nombre}%`], transaction: t }
        );
        if (exist.length === 0) {
          await sequelize.query(
            'INSERT INTO variante (idProducto, nombre, precio, estado) VALUES (?, ?, ?, 1)',
            { replacements: [d.idProducto, s.nombre, s.precio], transaction: t }
          );
          console.log(`+ Variante agregada a producto #${d.idProducto}: ${s.nombre} ($${s.precio})`);
        }
      }
    }

    await t.commit();
    console.log('--- ¡Actualización de bebidas y variantes completada con éxito! ---');
    process.exit(0);
  } catch (err) {
    await t.rollback();
    console.error('Error al actualizar variantes de bebidas:', err);
    process.exit(1);
  }
}

addDrinkSizesAndPostobonFlavors();
