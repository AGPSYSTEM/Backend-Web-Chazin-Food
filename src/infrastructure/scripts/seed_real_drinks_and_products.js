const { sequelize } = require('../../persistence/models');

async function seedRealProducts() {
  const t = await sequelize.transaction();
  try {
    console.log('--- Iniciando registro de productos y variantes reales en MySQL ---');

    // 1. Insumos para las bebidas y complementos
    const insumosToInsert = [
      { idInsumo: 32, nombre: 'Coca-Cola Sin Azúcar / Light 400ml', stock: 60.0, unidadMedida: 'und' },
      { idInsumo: 33, nombre: 'Pepsi Regular 400ml', stock: 70.0, unidadMedida: 'und' },
      { idInsumo: 34, nombre: 'Pepsi Light / Black 400ml', stock: 45.0, unidadMedida: 'und' },
      { idInsumo: 35, nombre: 'Gaseosa Colombiana Postobón 400ml', stock: 65.0, unidadMedida: 'und' },
      { idInsumo: 36, nombre: 'Gaseosa Sprite 400ml', stock: 55.0, unidadMedida: 'und' },
      { idInsumo: 37, nombre: 'Gaseosa Cuatro Toronja 400ml', stock: 50.0, unidadMedida: 'und' },
    ];

    for (const ins of insumosToInsert) {
      const [existing] = await sequelize.query('SELECT idInsumo FROM insumo WHERE idInsumo = ? OR nombre = ?', {
        replacements: [ins.idInsumo, ins.nombre],
        transaction: t
      });
      if (existing.length === 0) {
        await sequelize.query(
          `INSERT INTO insumo (idInsumo, idCategoriaInsumo, nombre, descripcion, stock, stockMinimo, unidadMedida, precioUnitario, estado)
           VALUES (?, 4, ?, ?, ?, 10, ?, 2500, 1)`,
          {
            replacements: [ins.idInsumo, ins.nombre, `${ins.nombre} para venta directa`, ins.stock, ins.unidadMedida],
            transaction: t
          }
        );
        console.log(`+ Insumo insertado: ${ins.nombre} (#${ins.idInsumo})`);
      }
    }

    // 2. Actualizar variantes de Coca-Cola (idProducto: 8)
    await sequelize.query(
      "UPDATE variante SET nombre = 'Coca-Cola Sabor Original 400ml' WHERE idVariante = 17 AND idProducto = 8",
      { transaction: t }
    );
    console.log('+ Variante 17 actualizada: Coca-Cola Sabor Original 400ml');

    const [cocaLightVar] = await sequelize.query(
      "SELECT idVariante FROM variante WHERE idProducto = 8 AND nombre LIKE '%Sin Azúcar%'",
      { transaction: t }
    );
    if (cocaLightVar.length === 0) {
      await sequelize.query(
        "INSERT INTO variante (idProducto, nombre, precio, estado) VALUES (8, 'Coca-Cola Sin Azúcar / Light 400ml', 4500.00, 1)",
        { transaction: t }
      );
      console.log('+ Variante agregada a Coca-Cola: Coca-Cola Sin Azúcar / Light 400ml');
    }

    // 3. Registrar productos reales que faltaban: Pepsi, Colombiana, Sprite, Cuatro, Porción Papas
    const productsToInsert = [
      {
        nombre: 'Gaseosa Pepsi 400ml',
        idCategoriaProducto: 4,
        precio: 4000.0,
        descripcion: 'Gaseosa Pepsi personal 400ml en botella PET bien fría, con su inconfundible sabor burbujeante.',
        imagen: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=600&auto=format&fit=crop&q=80',
        categoria: 'Bebidas',
        insumoId: 33,
        variantes: [
          { nombre: 'Pepsi Regular 400ml', precio: 4000.0 },
          { nombre: 'Pepsi Light / Black 400ml', precio: 4000.0 }
        ]
      },
      {
        nombre: 'Gaseosa Colombiana Postobón 400ml',
        idCategoriaProducto: 4,
        precio: 4000.0,
        descripcion: 'La bebida de nuestra tierra: Gaseosa Colombiana Postobón tradicional 400ml refrescante.',
        imagen: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
        categoria: 'Bebidas',
        insumoId: 35,
        variantes: [
          { nombre: 'Colombiana Botella 400ml', precio: 4000.0 }
        ]
      },
      {
        nombre: 'Gaseosa Sprite 400ml',
        idCategoriaProducto: 4,
        precio: 4500.0,
        descripcion: 'Gaseosa Sprite lima-limón 400ml, refrescante sabor cítrico y gasificación intensa.',
        imagen: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=600&auto=format&fit=crop&q=80',
        categoria: 'Bebidas',
        insumoId: 36,
        variantes: [
          { nombre: 'Sprite Botella 400ml', precio: 4500.0 }
        ]
      },
      {
        nombre: 'Gaseosa Cuatro Toronja 400ml',
        idCategoriaProducto: 4,
        precio: 4500.0,
        descripcion: 'Gaseosa Cuatro sabor toronja cítrica 400ml, ideal para acompañar tus hamburguesas y perros.',
        imagen: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
        categoria: 'Bebidas',
        insumoId: 37,
        variantes: [
          { nombre: 'Cuatro Botella 400ml', precio: 4500.0 }
        ]
      },
      {
        nombre: 'Porción Papas a la Francesa (150g)',
        idCategoriaProducto: 5,
        precio: 5000.0,
        descripcion: 'Porción generosa de 150g de papas a la francesa corte delgado doradas y crujientes con sal marina.',
        imagen: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80',
        categoria: 'Salchipapas Gourmet',
        insumoId: 21,
        insumoCant: 0.15,
        insumoUnit: 'kg',
        variantes: [
          { nombre: 'Porción Individual 150g', precio: 5000.0 }
        ]
      }
    ];

    for (const p of productsToInsert) {
      const [existingProd] = await sequelize.query(
        'SELECT idProducto FROM producto WHERE nombre = ?',
        { replacements: [p.nombre], transaction: t }
      );

      let prodId = null;
      if (existingProd.length === 0) {
        const [res] = await sequelize.query(
          `INSERT INTO producto (idCategoriaProducto, nombre, descripcion, imagen, estado, precio, categoria, adiciones)
           VALUES (?, ?, ?, ?, 1, ?, ?, '[]')`,
          {
            replacements: [p.idCategoriaProducto, p.nombre, p.descripcion, p.imagen, p.precio, p.categoria],
            transaction: t
          }
        );
        prodId = res;
        console.log(`+ Producto insertado: ${p.nombre} (#${prodId})`);
      } else {
        prodId = existingProd[0].idProducto;
        console.log(`= Producto ya existente: ${p.nombre} (#${prodId})`);
      }

      // Variantes
      let firstVarId = null;
      for (const v of p.variantes) {
        const [existingVar] = await sequelize.query(
          'SELECT idVariante FROM variante WHERE idProducto = ? AND nombre = ?',
          { replacements: [prodId, v.nombre], transaction: t }
        );
        if (existingVar.length === 0) {
          const [varRes] = await sequelize.query(
            'INSERT INTO variante (idProducto, nombre, precio, estado) VALUES (?, ?, ?, 1)',
            { replacements: [prodId, v.nombre, v.precio], transaction: t }
          );
          if (!firstVarId) firstVarId = varRes;
          console.log(`  + Variante creada: ${v.nombre} (#${varRes})`);
        } else {
          if (!firstVarId) firstVarId = existingVar[0].idVariante;
        }
      }

      // Ficha técnica
      const [existingFicha] = await sequelize.query(
        'SELECT idFichaTecnica FROM fichatecnica WHERE idProducto = ?',
        { replacements: [prodId], transaction: t }
      );

      if (existingFicha.length === 0 && firstVarId) {
        const [fichaRes] = await sequelize.query(
          `INSERT INTO fichatecnica (idVariante, descripcion, fechaCreacion, idProducto, tipo, procedimiento, tiempoPreparacion, rendimiento, especificaciones, caracteristicas, informacionNutricional, condicionesAlmacenamiento, vidaUtil, observaciones, estado)
           VALUES (?, ?, NOW(), ?, 'PRODUCTO', '1. Tomar insumo de inventario refrigerado o bodega.\n2. Servir a temperatura adecuada.', 2, '1 porción', 'Servir en óptimas condiciones.', 'Sabor fresco y auténtico de la marca.', 'Porción estándar.', 'Mantener refrigerado o a temperatura ambiente según el producto.', 'Consumo inmediato.', 'Producto garantizado de alta calidad.', 1)`,
          {
            replacements: [firstVarId, p.descripcion, prodId],
            transaction: t
          }
        );
        const fichaId = fichaRes;

        // Detalle de insumo
        await sequelize.query(
          `INSERT INTO detallefichainsumo (idFichaTecnica, idInsumo, cantidad, unidadMedida)
           VALUES (?, ?, ?, ?)`,
          {
            replacements: [fichaId, p.insumoId, p.insumoCant || 1.0, p.insumoUnit || 'und'],
            transaction: t
          }
        );
        console.log(`  + Ficha técnica creada (#${fichaId}) para producto #${prodId}`);
      }
    }

    await t.commit();
    console.log('--- ¡Todos los productos y variantes reales registrados exitosamente en MySQL! ---');
    process.exit(0);
  } catch (err) {
    await t.rollback();
    console.error('Error sembrando productos reales:', err);
    process.exit(1);
  }
}

seedRealProducts();
