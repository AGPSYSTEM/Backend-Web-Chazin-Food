const { sequelize, FichaTecnica, DetalleFichaInsumo, Variante, Insumo, Product } = require('../../persistence/models');

async function ensureCocaLightFicha() {
  console.log('=== VERIFICANDO FICHA TÉCNICA PARA VARIANTE COCA-COLA LIGHT / SIN AZÚCAR ===');
  
  try {
    // 1. Buscar variante 20 (Coca-Cola Sin Azúcar / Light 400ml)
    const var20 = await Variante.findByPk(20);
    if (!var20) {
      console.warn('Variante 20 no encontrada en la BD.');
    } else {
      console.log(`Variante 20 encontrada: ${var20.nombre} (idProducto: ${var20.idProducto})`);
    }

    // 2. Buscar Insumo 32 (Coca-Cola Sin Azúcar / Light 400ml)
    const ins32 = await Insumo.findByPk(32);
    if (!ins32) {
      console.error('Insumo 32 no encontrado en la BD.');
      process.exit(1);
    }
    console.log(`Insumo 32 encontrado: ${ins32.nombre} (Stock: ${ins32.stock})`);

    // 3. Verificar si existe FichaTecnica para idVariante = 20
    let fichaVar20 = await FichaTecnica.findOne({
      where: { idVariante: 20, estado: 1 },
      include: [{ model: DetalleFichaInsumo, as: 'detalles' }]
    });

    if (fichaVar20) {
      console.log(`Ficha técnica para idVariante 20 ya existe (ID: ${fichaVar20.idFichaTecnica})`);
      const hasIns32 = fichaVar20.detalles.some(d => d.idInsumo === 32);
      if (!hasIns32) {
        console.log('Actualizando detalle de ficha técnica a Insumo 32...');
        await DetalleFichaInsumo.destroy({ where: { idFichaTecnica: fichaVar20.idFichaTecnica } });
        await DetalleFichaInsumo.create({
          idFichaTecnica: fichaVar20.idFichaTecnica,
          idInsumo: 32,
          cantidad: 1.0,
          unidadMedida: 'und'
        });
      }
    } else {
      console.log('Creando ficha técnica para idVariante = 20 (Producto 8, Insumo 32)...');
      const newFicha = await FichaTecnica.create({
        idProducto: 8,
        idVariante: 20,
        tipo: 'PRODUCTO',
        descripcion: 'Gaseosa Coca-Cola Sin Azúcar / Light personal 400ml en botella PET bien fría',
        fechaCreacion: new Date(),
        procedimiento: '1. Retirar del refrigerador a temperatura controlada (2°C - 4°C).\n2. Servir con vaso y servilletas.',
        tiempoPreparacion: 1,
        rendimiento: '1 botella (400ml)',
        especificaciones: 'Bebida sin azúcar gasificada en envase sellado.',
        caracteristicas: 'Sabor característico Coca-Cola sin azúcar ni calorías.',
        informacionNutricional: 'Calorías: 0 kcal, Azúcares: 0g, Sodio: 25mg.',
        condicionesAlmacenamiento: 'Mantener refrigerado entre 2°C y 6°C.',
        vidaUtil: '6 meses en envase cerrado.',
        observaciones: 'Descontar Insumo 32 (Coca-Cola Sin Azúcar / Light 400ml).',
        estado: 1
      });

      await DetalleFichaInsumo.create({
        idFichaTecnica: newFicha.idFichaTecnica,
        idInsumo: 32,
        cantidad: 1.0,
        unidadMedida: 'und'
      });
      console.log(`✓ Ficha técnica creada con éxito (ID: ${newFicha.idFichaTecnica}) vinculada a Variante 20 e Insumo 32.`);
    }

    // 4. También verificar para Variante 22 (Pepsi Light / Black 400ml) si existe Insumo 34
    const var22 = await Variante.findByPk(22);
    const ins34 = await Insumo.findByPk(34);
    if (var22 && ins34) {
      let fichaVar22 = await FichaTecnica.findOne({
        where: { idVariante: 22, estado: 1 }
      });
      if (!fichaVar22) {
        console.log('Creando ficha técnica para Variante 22 (Pepsi Light, Insumo 34)...');
        const newFichaPepsi = await FichaTecnica.create({
          idProducto: 11,
          idVariante: 22,
          tipo: 'PRODUCTO',
          descripcion: 'Gaseosa Pepsi Light / Black 400ml bien fría',
          fechaCreacion: new Date(),
          procedimiento: '1. Retirar del refrigerador.\n2. Servir bien fría.',
          tiempoPreparacion: 1,
          rendimiento: '1 botella (400ml)',
          especificaciones: 'Bebida de cola sin azúcar.',
          caracteristicas: 'Sabor Pepsi intenso sin calorías.',
          informacionNutricional: 'Calorías: 0 kcal, Azúcares: 0g.',
          condicionesAlmacenamiento: 'Refrigerado entre 2°C y 6°C.',
          vidaUtil: '6 meses.',
          observaciones: 'Descontar Insumo 34 (Pepsi Light / Black 400ml).',
          estado: 1
        });
        await DetalleFichaInsumo.create({
          idFichaTecnica: newFichaPepsi.idFichaTecnica,
          idInsumo: 34,
          cantidad: 1.0,
          unidadMedida: 'und'
        });
        console.log(`✓ Ficha técnica creada para Variante 22 e Insumo 34 (ID: ${newFichaPepsi.idFichaTecnica}).`);
      }
    }

    console.log('=== VERIFICACIÓN COMPLETADA ===');
    process.exit(0);
  } catch (err) {
    console.error('Error durante la verificación:', err);
    process.exit(1);
  }
}

ensureCocaLightFicha();
