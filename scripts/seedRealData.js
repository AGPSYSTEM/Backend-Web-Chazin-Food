/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🌱 SCRIPT DE POBLAMIENTO DE DATOS REALES: CHAZIN FOOD
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * Ejecutar con: node scripts/seedRealData.js
 *
 * 1. Limpia datos basura (categorías 'ssss', '1', productos 'test', 'test1', insumos 'samuel', etc.)
 * 2. Puebla categorías gastronómicas oficiales
 * 3. Puebla insumos reales con stock positivo, stock mínimo y costos
 * 4. Puebla insumos preparados (sub-recetas de cocina)
 * 5. Puebla productos gastronómicos reales con variantes y precios
 * 6. Puebla fichas técnicas completas con gramajes e instrucciones
 * 7. Puebla adiciones reales vinculadas a insumos
 * 8. Puebla eventos y promociones comerciales
 */

const {
  sequelize,
  CategoriaInsumo,
  CategoriaProducto,
  Insumo,
  InsumoPreparado,
  DetalleInsumoPreparadoInsumo,
  Product,
  Variante,
  FichaTecnica,
  DetalleFichaInsumo,
  Adicion,
  Evento,
  Descuento,
  Proveedor
} = require('../src/persistence/models');

async function seed() {
  console.log('🚀 Iniciando proceso de saneamiento y carga de datos reales en Chazin Food...');

  const t = await sequelize.transaction();

  try {
    // ═══════════════════════════════════════════════════════════════
    // 1. LIMPIEZA DE DATOS BASURA Y DE PRUEBA
    // ═══════════════════════════════════════════════════════════════
    console.log('\n🧹 1. Depurando registros de prueba y datos basura...');

    const { Op } = require('sequelize');
    // Desactivar productos basura y de prueba heredados (IDs 1 al 9: test, test1, pizzas de prueba, textos dummy)
    const testProducts = await Product.findAll({
      where: {
        [Op.or]: [
          { idProducto: { [Op.lte]: 9 } },
          { nombre: { [Op.in]: ['test', 'test1', 'prueba', 'TEST', 'TEST1', 'Test', 'Test1', 'Pizza Hawaiana Mediana'] } }
        ]
      },
      transaction: t
    });

    for (const p of testProducts) {
      console.log(`   - Desactivando producto legado/prueba: ${p.nombre} (ID: ${p.idProducto})`);
      await Variante.update({ estado: 0 }, { where: { idProducto: p.idProducto }, transaction: t });
      await FichaTecnica.update({ estado: 0 }, { where: { idProducto: p.idProducto }, transaction: t });
      await p.update({ estado: 0 }, { transaction: t });
    }

    // Eliminar categorías de productos basura y reasignar productos vinculados
    const basuraCats = ['ssss', 'Hamburguesas Artesanales', '1', 'fghjk', '3', '4', '5', '6', '7', 'dfg'];
    for (const bCat of basuraCats) {
      const cat = await CategoriaProducto.findOne({ where: { nombre: bCat }, transaction: t });
      if (cat) {
        // Reasignar cualquier producto residual a la categoría oficial de Hamburguesas (ID 3)
        await Product.update({ idCategoriaProducto: 3 }, { where: { idCategoriaProducto: cat.idCategoriaProducto }, transaction: t });
        console.log(`   - Eliminando categoría basura: ${cat.nombre} (ID: ${cat.idCategoriaProducto})`);
        await CategoriaProducto.destroy({ where: { idCategoriaProducto: cat.idCategoriaProducto }, transaction: t });
      }
    }

    // Eliminar o marcar como eliminados insumos basura
    const basuraInsumos = ['samuel', 'Yeison Food', 'Alexis', 'papa2', 'aguacate'];
    for (const bIns of basuraInsumos) {
      const ins = await Insumo.findOne({ where: { nombre: bIns }, transaction: t });
      if (ins) {
        console.log(`   - Marcando insumo basura como eliminado: ${ins.nombre} (ID: ${ins.idInsumo})`);
        ins.eliminado = 1;
        ins.estado = 0;
        ins.stock = 0;
        await ins.save({ transaction: t });
      }
    }

    // Corregir 'Pan de Arina' si existe stock negativo o renombrar a Pan Brioche
    const panArina = await Insumo.findOne({ where: { nombre: 'Pan de Arina' }, transaction: t });
    if (panArina) {
      panArina.eliminado = 1;
      panArina.stock = 0;
      await panArina.save({ transaction: t });
    }

    // ═══════════════════════════════════════════════════════════════
    // 2. CATEGORÍAS DE PRODUCTO OFICIALES
    // ═══════════════════════════════════════════════════════════════
    console.log('\n📂 2. Asegurando categorías gastronómicas oficiales...');

    const categoriasProdData = [
      { idCategoriaProducto: 1, nombre: 'Perros Calientes', descripcion: 'Perros calientes americanos y especiales con queso gratinado', icon: '🌭' },
      { idCategoriaProducto: 2, nombre: 'Combos', descripcion: 'Combos familiares y de pareja con papas y bebidas', icon: '🍱' },
      { idCategoriaProducto: 3, nombre: 'Hamburguesas', descripcion: 'Hamburguesas artesanales de res y pollo', icon: '🍔' },
      { idCategoriaProducto: 4, nombre: 'Bebidas', descripcion: 'Gaseosas, jugos y bebidas refrescantes', icon: '🥤' },
      { idCategoriaProducto: 5, nombre: 'Salchipapas Gourmet', descripcion: 'Papas a la francesa con variedad de carnes y salsas', icon: '🍟' }
    ];

    for (const cat of categoriasProdData) {
      const existing = await CategoriaProducto.findByPk(cat.idCategoriaProducto, { transaction: t });
      if (existing) {
        await existing.update({ nombre: cat.nombre, descripcion: cat.descripcion, icon: cat.icon, estado: 1 }, { transaction: t });
      } else {
        await CategoriaProducto.create(cat, { transaction: t });
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // 3. CATEGORÍAS DE INSUMOS OFICIALES
    // ═══════════════════════════════════════════════════════════════
    console.log('\n📦 3. Asegurando categorías de insumos...');

    const categoriasInsData = [
      { idCategoriaInsumo: 1, nombre: 'Panadería y Masas', descripcion: 'Panes artesanales y bases' },
      { idCategoriaInsumo: 2, nombre: 'Lácteos y Quesos', descripcion: 'Quesos cheddar, mozzarella y mantequillas' },
      { idCategoriaInsumo: 3, nombre: 'Vegetales y Frescos', descripcion: 'Lechuga, tomate, cebolla y papas' },
      { idCategoriaInsumo: 4, nombre: 'Salsas y Aderezos', descripcion: 'Salsas de la casa, mayonesa y aderezos' },
      { idCategoriaInsumo: 5, nombre: 'Bebidas Embotelladas', descripcion: 'Gaseosas y aguas' },
      { idCategoriaInsumo: 10, nombre: 'Cárnicos y Proteínas', descripcion: 'Carnes de res, pollo, salchichas y tocinetas' }
    ];

    for (const ci of categoriasInsData) {
      const existing = await CategoriaInsumo.findByPk(ci.idCategoriaInsumo, { transaction: t });
      if (existing) {
        await existing.update({ nombre: ci.nombre, descripcion: ci.descripcion, estado: 1 }, { transaction: t });
      } else {
        await CategoriaInsumo.create(ci, { transaction: t });
      }
    }

    // Proveedor por defecto
    let proveedor = await Proveedor.findOne({ where: { estado: 1 }, transaction: t });
    if (!proveedor) {
      proveedor = await Proveedor.create({
        nombre: 'Distribuidora Gastronómica Chazin',
        numeroDocumento: '900123456-1',
        telefono: '3101234567',
        correo: 'proveedores@chazinfood.com',
        direccion: 'Calle 50 # 45-20, Medellín',
        estado: 1
      }, { transaction: t });
    }
    const idProveedor = proveedor.idProveedor;

    // ═══════════════════════════════════════════════════════════════
    // 4. INSUMOS REALES (STOCK POSITIVO Y COSTOS)
    // ═══════════════════════════════════════════════════════════════
    console.log('\n🥩 4. Poblando insumos reales y saneando stock...');

    const insumosReales = [
      { nombre: 'Pan Brioche Artesanal', idCategoriaInsumo: 1, unidadMedida: 'und', stock: 150.00, stockMinimo: 20.00, precioUnitario: 1400.00, descripcion: 'Pan brioche con mantequilla y ajonjolí' },
      { nombre: 'Pan Perro Americano', idCategoriaInsumo: 1, unidadMedida: 'und', stock: 100.00, stockMinimo: 15.00, precioUnitario: 1100.00, descripcion: 'Pan artesanal para perro caliente' },
      { nombre: 'Carne de Res Molida 80/20', idCategoriaInsumo: 10, unidadMedida: 'kg', stock: 45.00, stockMinimo: 8.00, precioUnitario: 28000.00, descripcion: 'Carne 100% de res para hamburguesas' },
      { nombre: 'Pechuga de Pollo Fresca', idCategoriaInsumo: 10, unidadMedida: 'kg', stock: 30.00, stockMinimo: 6.00, precioUnitario: 19000.00, descripcion: 'Filetes de pechuga fresca desmechada o crispy' },
      { nombre: 'Salchicha Americana Premium', idCategoriaInsumo: 10, unidadMedida: 'und', stock: 120.00, stockMinimo: 20.00, precioUnitario: 1800.00, descripcion: 'Salchicha tipo americana para perros calientes' },
      { nombre: 'Salchicha Suiza Ahumada', idCategoriaInsumo: 10, unidadMedida: 'und', stock: 80.00, stockMinimo: 15.00, precioUnitario: 2600.00, descripcion: 'Salchicha suiza artesanal ahumada' },
      { nombre: 'Tocineta Ahumada en Tiras', idCategoriaInsumo: 10, unidadMedida: 'kg', stock: 20.00, stockMinimo: 4.00, precioUnitario: 34000.00, descripcion: 'Tiras de tocineta ahumada crujiente' },
      { nombre: 'Queso Cheddar en Lonchas', idCategoriaInsumo: 2, unidadMedida: 'und', stock: 250.00, stockMinimo: 30.00, precioUnitario: 700.00, descripcion: 'Lonchas de queso cheddar fundible' },
      { nombre: 'Queso Mozzarella Rallado', idCategoriaInsumo: 2, unidadMedida: 'kg', stock: 25.00, stockMinimo: 5.00, precioUnitario: 25000.00, descripcion: 'Queso mozzarella para gratinar' },
      { nombre: 'Papas a la Francesa Corte Delgado', idCategoriaInsumo: 3, unidadMedida: 'kg', stock: 60.00, stockMinimo: 10.00, precioUnitario: 9800.00, descripcion: 'Papas prefritas congeladas corte fino' },
      { nombre: 'Lechuga Batavia Fresca', idCategoriaInsumo: 3, unidadMedida: 'kg', stock: 18.00, stockMinimo: 3.00, precioUnitario: 4500.00, descripcion: 'Lechuga fresca crujiente' },
      { nombre: 'Tomate Chonto Maduro', idCategoriaInsumo: 3, unidadMedida: 'kg', stock: 20.00, stockMinimo: 4.00, precioUnitario: 5200.00, descripcion: 'Tomates frescos en rodajas' },
      { nombre: 'Cebolla Cabezona Blanca', idCategoriaInsumo: 3, unidadMedida: 'kg', stock: 22.00, stockMinimo: 4.00, precioUnitario: 3900.00, descripcion: 'Cebolla fresca para caramelizar y aderezos' },
      { nombre: 'Jalapeños en Rodajas', idCategoriaInsumo: 3, unidadMedida: 'kg', stock: 10.00, stockMinimo: 2.00, precioUnitario: 14500.00, descripcion: 'Jalapeños encurtidos picantes' },
      { nombre: 'Salsa de Tomate Heinz', idCategoriaInsumo: 4, unidadMedida: 'kg', stock: 15.00, stockMinimo: 3.00, precioUnitario: 12500.00, descripcion: 'Salsa de tomate clásica' },
      { nombre: 'Mostaza Americana', idCategoriaInsumo: 4, unidadMedida: 'kg', stock: 10.00, stockMinimo: 2.00, precioUnitario: 11500.00, descripcion: 'Mostaza amarilla tradicional' },
      { nombre: 'Mayonesa Real', idCategoriaInsumo: 4, unidadMedida: 'kg', stock: 16.00, stockMinimo: 3.00, precioUnitario: 13800.00, descripcion: 'Base de mayonesa cremosa' },
      { nombre: 'Coca-Cola Original 400ml', idCategoriaInsumo: 5, unidadMedida: 'und', stock: 96.00, stockMinimo: 24.00, precioUnitario: 2700.00, descripcion: 'Gaseosa Coca-Cola botella PET 400ml' },
      { nombre: 'Manzana Postobón 400ml', idCategoriaInsumo: 5, unidadMedida: 'und', stock: 72.00, stockMinimo: 20.00, precioUnitario: 2400.00, descripcion: 'Gaseosa sabor Manzana Postobón 400ml' },
      { nombre: 'Agua Cristal sin Gas 500ml', idCategoriaInsumo: 5, unidadMedida: 'und', stock: 60.00, stockMinimo: 15.00, precioUnitario: 1800.00, descripcion: 'Agua purificada sin gas' }
    ];

    const insumosMap = new Map();

    for (const insData of insumosReales) {
      let ins = await Insumo.findOne({ where: { nombre: insData.nombre }, transaction: t });
      if (ins) {
        await ins.update({
          stock: insData.stock,
          stockMinimo: insData.stockMinimo,
          precioUnitario: insData.precioUnitario,
          unidadMedida: insData.unidadMedida,
          idCategoriaInsumo: insData.idCategoriaInsumo,
          idProveedor: idProveedor,
          descripcion: insData.descripcion,
          estado: 1,
          eliminado: 0
        }, { transaction: t });
      } else {
        ins = await Insumo.create({
          ...insData,
          idProveedor: idProveedor,
          estado: 1,
          eliminado: 0
        }, { transaction: t });
      }
      insumosMap.set(ins.nombre, ins);
    }

    // ═══════════════════════════════════════════════════════════════
    // 5. INSUMOS PREPARADOS REALES
    // ═══════════════════════════════════════════════════════════════
    console.log('\n🥣 5. Poblando insumos preparados (recetas base)...');

    const preparadosData = [
      {
        nombre: 'Salsa Chazin Especial',
        descripcion: 'Salsa exclusiva de la casa a base de mayonesa, mostaza y especias',
        unidadMedida: 'lt',
        rendimiento: 1.00,
        unidadRendimiento: 'lt',
        costoTotal: 8500.00,
        ingredientes: [
          { insumoNombre: 'Mayonesa Real', cantidad: 0.60, unidadMedida: 'kg' },
          { insumoNombre: 'Salsa de Tomate Heinz', cantidad: 0.25, unidadMedida: 'kg' },
          { insumoNombre: 'Mostaza Americana', cantidad: 0.15, unidadMedida: 'kg' }
        ]
      },
      {
        nombre: 'Cebolla Caramelizada Chazin',
        descripcion: 'Cebolla blanca salteada a fuego lento con mantequilla y azúcar morena',
        unidadMedida: 'kg',
        rendimiento: 0.50,
        unidadRendimiento: 'kg',
        costoTotal: 4200.00,
        ingredientes: [
          { insumoNombre: 'Cebolla Cabezona Blanca', cantidad: 1.00, unidadMedida: 'kg' }
        ]
      },
      {
        nombre: 'Carne Sazonada Artesanal 150g',
        descripcion: 'Porciones de 150g de carne molida 80/20 sazonada con sal marina y pimienta',
        unidadMedida: 'und',
        rendimiento: 10.00,
        unidadRendimiento: 'und',
        costoTotal: 42000.00,
        ingredientes: [
          { insumoNombre: 'Carne de Res Molida 80/20', cantidad: 1.50, unidadMedida: 'kg' }
        ]
      }
    ];

    const preparadosMap = new Map();

    for (const prep of preparadosData) {
      let prepRow = await InsumoPreparado.findOne({ where: { nombre: prep.nombre }, transaction: t });
      if (!prepRow) {
        prepRow = await InsumoPreparado.create({
          nombre: prep.nombre,
          descripcion: prep.descripcion,
          unidadMedida: prep.unidadMedida,
          rendimiento: prep.rendimiento,
          unidadRendimiento: prep.unidadRendimiento,
          costoTotal: prep.costoTotal,
          estado: 1,
          eliminado: 0
        }, { transaction: t });
      } else {
        await prepRow.update({
          descripcion: prep.descripcion,
          unidadMedida: prep.unidadMedida,
          rendimiento: prep.rendimiento,
          costoTotal: prep.costoTotal,
          estado: 1,
          eliminado: 0
        }, { transaction: t });
        await DetalleInsumoPreparadoInsumo.destroy({ where: { idPreparado: prepRow.id }, transaction: t });
      }

      for (const ing of prep.ingredientes) {
        const ins = insumosMap.get(ing.insumoNombre);
        if (ins) {
          await DetalleInsumoPreparadoInsumo.create({
            idPreparado: prepRow.id,
            idInsumo: ins.idInsumo,
            cantidad: ing.cantidad,
            unidadMedida: ing.unidadMedida,
            precioUnitario: ins.precioUnitario
          }, { transaction: t });
        }
      }
      preparadosMap.set(prep.nombre, prepRow);
    }

    // ═══════════════════════════════════════════════════════════════
    // 6. PRODUCTOS REALES Y VARIANTES
    // ═══════════════════════════════════════════════════════════════
    console.log('\n🍔 6. Poblando productos reales del menú...');

    const productosReales = [
      {
        nombre: 'Hamburguesa Clásica Chazin',
        precio: 18000.00,
        idCategoriaProducto: 3,
        categoria: 'Hamburguesas',
        descripcion: 'Pan brioche artesanal, carne 100% res 150g, queso cheddar fundido, tocineta ahumada, lechuga fresca, tomate y salsa Chazin.',
        imagen: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
        variantes: [
          { nombre: 'Clásica 150g', precio: 18000.00 }
        ],
        receta: [
          { insumo: 'Pan Brioche Artesanal', cantidad: 1.00, unidad: 'und' },
          { insumo: 'Carne de Res Molida 80/20', cantidad: 0.15, unidad: 'kg' },
          { insumo: 'Queso Cheddar en Lonchas', cantidad: 1.00, unidad: 'und' },
          { insumo: 'Tocineta Ahumada en Tiras', cantidad: 0.03, unidad: 'kg' },
          { insumo: 'Lechuga Batavia Fresca', cantidad: 0.02, unidad: 'kg' },
          { insumo: 'Tomate Chonto Maduro', cantidad: 0.03, unidad: 'kg' }
        ],
        ficha: {
          tiempoPreparacion: 10,
          rendimiento: '1 porción',
          procedimiento: '1. Tostar el pan brioche en plancha con mantequilla.\n2. Sellar la carne 150g en plancha a 200°C por 3 min por lado.\n3. Colocar la loncha de cheddar sobre la carne y tapar para fundir.\n4. Dorar las tiras de tocineta hasta que queden crocantes.\n5. En la base del pan untar salsa Chazin, colocar lechuga, rodajas de tomate, la carne con queso y la tocineta.\n6. Coronar con la tapa superior y servir caliente.',
          especificaciones: 'Servir con temperatura interna mínima de 71°C en la carne.',
          informacionNutricional: 'Calorías: ~650 kcal | Proteína: 38g | Carbohidratos: 42g | Grasas: 34g',
          vidaUtil: 'Consumo inmediato (máx 15 minutos en mesa)'
        }
      },
      {
        nombre: 'Hamburguesa Doble Carne & Tocineta',
        precio: 25000.00,
        idCategoriaProducto: 3,
        categoria: 'Hamburguesas',
        descripcion: 'Para los más exigentes: Doble carne 150g (300g total), doble queso cheddar, doble tocineta crujiente, cebolla caramelizada y salsa especial.',
        imagen: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
        variantes: [
          { nombre: 'Doble Carne 300g', precio: 25000.00 }
        ],
        receta: [
          { insumo: 'Pan Brioche Artesanal', cantidad: 1.00, unidad: 'und' },
          { insumo: 'Carne de Res Molida 80/20', cantidad: 0.30, unidad: 'kg' },
          { insumo: 'Queso Cheddar en Lonchas', cantidad: 2.00, unidad: 'und' },
          { insumo: 'Tocineta Ahumada en Tiras', cantidad: 0.06, unidad: 'kg' },
          { insumo: 'Cebolla Cabezona Blanca', cantidad: 0.04, unidad: 'kg' }
        ],
        ficha: {
          tiempoPreparacion: 12,
          rendimiento: '1 porción grande',
          procedimiento: '1. Sellar 2 carnes de 150g en plancha caliente.\n2. Fundir una loncha de queso cheddar sobre cada carne.\n3. Montar piso doble con tocineta crocante y cebolla caramelizada.\n4. Servir con pan brioche dorado.',
          especificaciones: 'Carne término 3/4 o bien cocida según preferencia.',
          informacionNutricional: 'Calorías: ~980 kcal | Proteína: 65g | Grasas: 58g',
          vidaUtil: 'Consumo inmediato'
        }
      },
      {
        nombre: 'Hamburguesa Pollo Crispy Gourmet',
        precio: 21000.00,
        idCategoriaProducto: 3,
        categoria: 'Hamburguesas',
        descripcion: 'Filete de pechuga empanizada estilo sureño super crujiente, queso mozzarella gratinado, lechuga y salsa tártara de la casa.',
        imagen: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80',
        variantes: [
          { nombre: 'Pollo Crispy 180g', precio: 21000.00 }
        ],
        receta: [
          { insumo: 'Pan Brioche Artesanal', cantidad: 1.00, unidad: 'und' },
          { insumo: 'Pechuga de Pollo Fresca', cantidad: 0.18, unidad: 'kg' },
          { insumo: 'Queso Mozzarella Rallado', cantidad: 0.04, unidad: 'kg' },
          { insumo: 'Lechuga Batavia Fresca', cantidad: 0.02, unidad: 'kg' },
          { insumo: 'Tomate Chonto Maduro', cantidad: 0.03, unidad: 'kg' }
        ],
        ficha: {
          tiempoPreparacion: 11,
          rendimiento: '1 porción',
          procedimiento: '1. Freír el filete de pechuga empanizado a 175°C por 6 minutos hasta dorado intenso.\n2. Gratinar queso mozzarella encima.\n3. Montar sobre pan brioche con lechuga fresca y salsa tártara.',
          especificaciones: 'Pechuga cocida completamente a mínimo 74°C.',
          informacionNutricional: 'Calorías: ~720 kcal | Proteína: 45g | Grasas: 32g',
          vidaUtil: 'Consumo inmediato'
        }
      },
      {
        nombre: 'Perro Caliente Especial Americano',
        precio: 14000.00,
        idCategoriaProducto: 1,
        categoria: 'Perros Calientes',
        descripcion: 'Pan suave con salchicha americana premium, tocineta picada crocante, queso mozzarella fundido, papas chips trituradas y salsas.',
        imagen: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=600&auto=format&fit=crop&q=80',
        variantes: [
          { nombre: 'Perro Especial', precio: 14000.00 }
        ],
        receta: [
          { insumo: 'Pan Perro Americano', cantidad: 1.00, unidad: 'und' },
          { insumo: 'Salchicha Americana Premium', cantidad: 1.00, unidad: 'und' },
          { insumo: 'Tocineta Ahumada en Tiras', cantidad: 0.03, unidad: 'kg' },
          { insumo: 'Queso Mozzarella Rallado', cantidad: 0.04, unidad: 'kg' }
        ],
        ficha: {
          tiempoPreparacion: 8,
          rendimiento: '1 porción',
          procedimiento: '1. Calentar el pan al vapor por 2 minutos.\n2. Asar la salchicha americana en la plancha.\n3. Colocar la salchicha en el pan, agregar tocineta crocante picada.\n4. Cubrir con queso mozzarella y gratinar con soplete o salamandra.',
          especificaciones: 'Servir caliente con queso derretido elástico.',
          informacionNutricional: 'Calorías: ~540 kcal | Proteína: 22g | Grasas: 28g',
          vidaUtil: 'Consumo inmediato'
        }
      },
      {
        nombre: 'Perro Suizo Chazin',
        precio: 17000.00,
        idCategoriaProducto: 1,
        categoria: 'Perros Calientes',
        descripcion: 'Salchicha suiza gigante ahumada, cebolla caramelizada dulce, queso mozzarella fundido, tocineta y salsa tártara artesanal.',
        imagen: 'https://images.unsplash.com/photo-1541214113241-21578d2d9b62?w=600&auto=format&fit=crop&q=80',
        variantes: [
          { nombre: 'Perro Suizo Gourmet', precio: 17000.00 }
        ],
        receta: [
          { insumo: 'Pan Perro Americano', cantidad: 1.00, unidad: 'und' },
          { insumo: 'Salchicha Suiza Ahumada', cantidad: 1.00, unidad: 'und' },
          { insumo: 'Tocineta Ahumada en Tiras', cantidad: 0.03, unidad: 'kg' },
          { insumo: 'Queso Mozzarella Rallado', cantidad: 0.05, unidad: 'kg' },
          { insumo: 'Cebolla Cabezona Blanca', cantidad: 0.03, unidad: 'kg' }
        ],
        ficha: {
          tiempoPreparacion: 9,
          rendimiento: '1 porción',
          procedimiento: '1. Asar la salchicha suiza con incisiones diagonales para resaltar su sabor ahumado.\n2. Montar en pan caliente, bañar con cebolla caramelizada.\n3. Cubrir con mozzarella y tocineta picada.',
          especificaciones: 'Salchicha bien dorada por fuera y jugosa.',
          informacionNutricional: 'Calorías: ~680 kcal | Proteína: 29g | Grasas: 38g',
          vidaUtil: 'Consumo inmediato'
        }
      },
      {
        nombre: 'Salchipapa Salvaje Gourmet',
        precio: 23000.00,
        idCategoriaProducto: 5,
        categoria: 'Salchipapas Gourmet',
        descripcion: 'Abundante porción de papas a la francesa crujientes, salchicha americana, salchicha suiza ahumada, tocineta picada y lluvia de queso mozzarella.',
        imagen: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&auto=format&fit=crop&q=80',
        variantes: [
          { nombre: 'Salchipapa Personal Grande', precio: 23000.00 }
        ],
        receta: [
          { insumo: 'Papas a la Francesa Corte Delgado', cantidad: 0.25, unidad: 'kg' },
          { insumo: 'Salchicha Americana Premium', cantidad: 1.00, unidad: 'und' },
          { insumo: 'Salchicha Suiza Ahumada', cantidad: 0.50, unidad: 'und' },
          { insumo: 'Tocineta Ahumada en Tiras', cantidad: 0.04, unidad: 'kg' },
          { insumo: 'Queso Mozzarella Rallado', cantidad: 0.06, unidad: 'kg' }
        ],
        ficha: {
          tiempoPreparacion: 12,
          rendimiento: '1 porción generosa',
          procedimiento: '1. Freír 250g de papas a la francesa a 180°C por 4-5 min hasta crocancia dorada.\n2. Saltear las salchichas en rodajas y tocineta en la plancha.\n3. Servir cama de papas, colocar carnes encima, cubrir con mozzarella y gratinar.',
          especificaciones: 'Papas crujientes sin exceso de aceite.',
          informacionNutricional: 'Calorías: ~890 kcal | Proteína: 35g | Grasas: 52g',
          vidaUtil: 'Consumo inmediato'
        }
      },
      {
        nombre: 'Combo Pareja Chazin',
        precio: 38000.00,
        idCategoriaProducto: 2,
        categoria: 'Combos',
        descripcion: 'El favorito para compartir: 2 Hamburguesas Clásicas Chazin + Porción de Papas Grandes + 2 Gaseosas a elección.',
        imagen: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&auto=format&fit=crop&q=80',
        variantes: [
          { nombre: 'Combo Pareja Completo', precio: 38000.00 }
        ],
        receta: [
          { insumo: 'Pan Brioche Artesanal', cantidad: 2.00, unidad: 'und' },
          { insumo: 'Carne de Res Molida 80/20', cantidad: 0.30, unidad: 'kg' },
          { insumo: 'Queso Cheddar en Lonchas', cantidad: 2.00, unidad: 'und' },
          { insumo: 'Tocineta Ahumada en Tiras', cantidad: 0.06, unidad: 'kg' },
          { insumo: 'Papas a la Francesa Corte Delgado', cantidad: 0.20, unidad: 'kg' },
          { insumo: 'Coca-Cola Original 400ml', cantidad: 2.00, unidad: 'und' }
        ],
        ficha: {
          tiempoPreparacion: 14,
          rendimiento: '2 personas',
          procedimiento: '1. Elaborar simultáneamente 2 Hamburguesas Clásicas según su receta estándar.\n2. Freír 200g de papas a la francesa doradas.\n3. Empacar en bandeja con las 2 hamburguesas, papas centrales y entregar con 2 gaseosas bien frías.',
          especificaciones: 'Servir todo al mismo tiempo para que mantenga temperatura.',
          informacionNutricional: 'Calorías: ~1800 kcal total combo',
          vidaUtil: 'Consumo inmediato'
        }
      },
      {
        nombre: 'Gaseosa Coca-Cola 400ml',
        precio: 4500.00,
        idCategoriaProducto: 4,
        categoria: 'Bebidas',
        descripcion: 'Gaseosa Coca-Cola original personal 400ml en botella PET bien fría.',
        imagen: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
        variantes: [
          { nombre: 'Botella 400ml', precio: 4500.00 }
        ],
        receta: [
          { insumo: 'Coca-Cola Original 400ml', cantidad: 1.00, unidad: 'und' }
        ],
        ficha: {
          tiempoPreparacion: 1,
          rendimiento: '1 porción',
          procedimiento: 'Tomar de la nevera a temperatura entre 2°C y 4°C y entregar cerrada con vaso con hielo si el cliente lo solicita.',
          especificaciones: 'Bebida fría sin abolladuras.',
          informacionNutricional: 'Calorías: 170 kcal | Azúcares: 42g',
          vidaUtil: 'Según fecha de vencimiento en envase'
        }
      },
      {
        nombre: 'Gaseosa Manzana Postobón 400ml',
        precio: 4000.00,
        idCategoriaProducto: 4,
        categoria: 'Bebidas',
        descripcion: 'Gaseosa Manzana Postobón tradicional 400ml bien fría.',
        imagen: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
        variantes: [
          { nombre: 'Botella 400ml', precio: 4000.00 }
        ],
        receta: [
          { insumo: 'Manzana Postobón 400ml', cantidad: 1.00, unidad: 'und' }
        ],
        ficha: {
          tiempoPreparacion: 1,
          rendimiento: '1 porción',
          procedimiento: 'Tomar de la nevera a 2°C - 4°C y entregar al comensal.',
          especificaciones: 'Fría, sin abrir.',
          informacionNutricional: 'Calorías: 160 kcal',
          vidaUtil: 'Según fecha de vencimiento'
        }
      },
      {
        nombre: 'Agua Cristal sin Gas 500ml',
        precio: 3000.00,
        idCategoriaProducto: 4,
        categoria: 'Bebidas',
        descripcion: 'Agua pura sin gas en botella de 500ml.',
        imagen: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
        variantes: [
          { nombre: 'Botella 500ml', precio: 3000.00 }
        ],
        receta: [
          { insumo: 'Agua Cristal sin Gas 500ml', cantidad: 1.00, unidad: 'und' }
        ],
        ficha: {
          tiempoPreparacion: 1,
          rendimiento: '1 porción',
          procedimiento: 'Entregar botella fría con sello intacto.',
          especificaciones: '100% pura y fría.',
          informacionNutricional: 'Calorías: 0 kcal',
          vidaUtil: '12 meses'
        }
      }
    ];

    for (const pData of productosReales) {
      let prod = await Product.findOne({ where: { nombre: pData.nombre }, transaction: t });
      if (!prod) {
        prod = await Product.create({
          nombre: pData.nombre,
          precio: pData.precio,
          idCategoriaProducto: pData.idCategoriaProducto,
          categoria: pData.categoria,
          descripcion: pData.descripcion,
          imagen: pData.imagen,
          estado: 1
        }, { transaction: t });
      } else {
        await prod.update({
          precio: pData.precio,
          idCategoriaProducto: pData.idCategoriaProducto,
          categoria: pData.categoria,
          descripcion: pData.descripcion,
          imagen: pData.imagen,
          estado: 1
        }, { transaction: t });
      }

      // Variantes
      let mainVarId = null;
      for (const vData of pData.variantes) {
        let vRow = await Variante.findOne({ where: { idProducto: prod.idProducto, nombre: vData.nombre }, transaction: t });
        if (!vRow) {
          vRow = await Variante.create({
            idProducto: prod.idProducto,
            nombre: vData.nombre,
            precio: vData.precio,
            estado: 1
          }, { transaction: t });
        } else {
          await vRow.update({ precio: vData.precio, estado: 1 }, { transaction: t });
        }
        if (!mainVarId) mainVarId = vRow.idVariante;
      }

      // Ficha Técnica
      let ficha = await FichaTecnica.findOne({ where: { idProducto: prod.idProducto }, transaction: t });
      if (!ficha) {
        ficha = await FichaTecnica.create({
          idProducto: prod.idProducto,
          idInsumo: null,
          idVariante: mainVarId,
          tipo: 'PRODUCTO',
          tiempoPreparacion: pData.ficha.tiempoPreparacion,
          rendimiento: pData.ficha.rendimiento,
          procedimiento: pData.ficha.procedimiento,
          especificaciones: pData.ficha.especificaciones,
          informacionNutricional: pData.ficha.informacionNutricional,
          vidaUtil: pData.ficha.vidaUtil,
          estado: 1
        }, { transaction: t });
      } else {
        await ficha.update({
          idProducto: prod.idProducto,
          idInsumo: null,
          idVariante: mainVarId,
          tipo: 'PRODUCTO',
          tiempoPreparacion: pData.ficha.tiempoPreparacion,
          rendimiento: pData.ficha.rendimiento,
          procedimiento: pData.ficha.procedimiento,
          especificaciones: pData.ficha.especificaciones,
          informacionNutricional: pData.ficha.informacionNutricional,
          vidaUtil: pData.ficha.vidaUtil,
          estado: 1
        }, { transaction: t });
        await DetalleFichaInsumo.destroy({ where: { idFichaTecnica: ficha.idFichaTecnica }, transaction: t });
      }

      // Insumos de la Ficha Técnica
      for (const itemReceta of pData.receta) {
        const ins = insumosMap.get(itemReceta.insumo);
        if (ins) {
          await DetalleFichaInsumo.create({
            idFichaTecnica: ficha.idFichaTecnica,
            idInsumo: ins.idInsumo,
            cantidad: itemReceta.cantidad,
            unidadMedida: itemReceta.unidad
          }, { transaction: t });
        }
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // 7. ADICIONES REALES VINCULADAS A INSUMOS
    // ═══════════════════════════════════════════════════════════════
    console.log('\n🥓 7. Poblando adiciones reales con inventario vinculante...');

    const adicionesReales = [
      { nombre: 'Extra Tocineta Ahumada (2 tiras)', precio: 3500.00, insumoNombre: 'Tocineta Ahumada en Tiras', descripcion: '2 tiras crujientes de tocineta ahumada artesanal' },
      { nombre: 'Extra Queso Cheddar (2 lonchas)', precio: 2500.00, insumoNombre: 'Queso Cheddar en Lonchas', descripcion: 'Doble loncha de queso cheddar americano derretido' },
      { nombre: 'Porción Papas a la Francesa (150g)', precio: 5000.00, insumoNombre: 'Papas a la Francesa Corte Delgado', descripcion: 'Porción individual de papas fritas doradas y crocantes' },
      { nombre: 'Porción Cebolla Caramelizada (50g)', precio: 2000.00, insumoNombre: 'Cebolla Cabezona Blanca', descripcion: 'Cebolla blanca caramelizada al punto dulce' },
      { nombre: 'Jalapeños Picantes Extra (40g)', precio: 2000.00, insumoNombre: 'Jalapeños en Rodajas', descripcion: 'Rodajas de jalapeño encurtido con picante medio' },
      { nombre: 'Salsa Chazin Especial Adicional', precio: 1500.00, insumoNombre: 'Salsa de Tomate Heinz', descripcion: 'Pote extra de 50g con salsa secreta de la casa' }
    ];

    for (const adData of adicionesReales) {
      const ins = insumosMap.get(adData.insumoNombre);
      if (ins) {
        let adRow = await Adicion.findOne({ where: { nombre: adData.nombre }, transaction: t });
        if (!adRow) {
          await Adicion.create({
            nombre: adData.nombre,
            precio: adData.precio,
            idInsumo: ins.idInsumo,
            descripcion: adData.descripcion,
            estado: 1
          }, { transaction: t });
        } else {
          await adRow.update({
            precio: adData.precio,
            idInsumo: ins.idInsumo,
            descripcion: adData.descripcion,
            estado: 1
          }, { transaction: t });
        }
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // 8. EVENTOS Y PROMOCIONES COMERCIALES REALES
    // ═══════════════════════════════════════════════════════════════
    console.log('\n🎉 8. Poblando eventos y promociones comerciales...');

    const hoy = new Date();
    const inicio = new Date(hoy);
    inicio.setDate(hoy.getDate() - 2);
    const fin = new Date(hoy);
    fin.setDate(hoy.getDate() + 45); // Vigente por 45 días

    const fInicioStr = inicio.toISOString().split('T')[0];
    const fFinStr = fin.toISOString().split('T')[0];

    const eventosData = [
      {
        nombreEvento: 'Jueves 2x1 de Burger Artesanal',
        tipoEvento: 'PROMOCION_2X1',
        descuento: 50.00,
        nuevoPrecio: 18000.00,
        descripcion: 'Compra una Hamburguesa Clásica Chazin y lleva la segunda con 50% de descuento todos los jueves.',
        fechaInicio: fInicioStr,
        fechaFin: fFinStr,
        estado: 1,
        descuentoModel: {
          nombreDescuento: '2x1 Jueves Burger',
          tipoDescuento: 'PORCENTAJE',
          porcentaje: 50.00
        }
      },
      {
        nombreEvento: 'Super Fin de Semana Chazin (15% OFF)',
        tipoEvento: 'DESCUENTO_GENERAL',
        descuento: 15.00,
        nuevoPrecio: null,
        descripcion: '15% de descuento en todos los combos y hamburguesas por compras en línea superiores a $30.000 COP.',
        fechaInicio: fInicioStr,
        fechaFin: fFinStr,
        estado: 1,
        descuentoModel: {
          nombreDescuento: '15% Descuento Finde',
          tipoDescuento: 'PORCENTAJE',
          porcentaje: 15.00
        }
      },
      {
        nombreEvento: 'Combo Pareja Festivo',
        tipoEvento: 'COMBO_ESPECIAL',
        descuento: 10.00,
        nuevoPrecio: 34000.00,
        descripcion: 'Combo Pareja Chazin a precio especial de $34.000 (Ahorro de $4.000) por temporada.',
        fechaInicio: fInicioStr,
        fechaFin: fFinStr,
        estado: 1,
        descuentoModel: {
          nombreDescuento: 'Combo Pareja Promo',
          tipoDescuento: 'VALOR FIJO',
          valorFijo: 4000.00
        }
      }
    ];

    for (const evData of eventosData) {
      let ev = await Evento.findOne({ where: { nombreEvento: evData.nombreEvento }, transaction: t });
      if (!ev) {
        ev = await Evento.create({
          nombreEvento: evData.nombreEvento,
          tipoEvento: evData.tipoEvento,
          descuento: evData.descuento,
          nuevoPrecio: evData.nuevoPrecio,
          descripcion: evData.descripcion,
          fechaInicio: evData.fechaInicio,
          fechaFin: evData.fechaFin,
          estado: 1
        }, { transaction: t });
      } else {
        await ev.update({
          tipoEvento: evData.tipoEvento,
          descuento: evData.descuento,
          nuevoPrecio: evData.nuevoPrecio,
          descripcion: evData.descripcion,
          fechaInicio: evData.fechaInicio,
          fechaFin: evData.fechaFin,
          estado: 1
        }, { transaction: t });
      }

      if (evData.descuentoModel) {
        let desc = await Descuento.findOne({ where: { idEvento: ev.idEvento }, transaction: t });
        if (!desc) {
          await Descuento.create({
            idEvento: ev.idEvento,
            nombreDescuento: evData.descuentoModel.nombreDescuento,
            tipoDescuento: evData.descuentoModel.tipoDescuento,
            porcentaje: evData.descuentoModel.porcentaje || null,
            valorFijo: evData.descuentoModel.valorFijo || null,
            estado: 1
          }, { transaction: t });
        } else {
          await desc.update({
            nombreDescuento: evData.descuentoModel.nombreDescuento,
            tipoDescuento: evData.descuentoModel.tipoDescuento,
            porcentaje: evData.descuentoModel.porcentaje || null,
            valorFijo: evData.descuentoModel.valorFijo || null,
            estado: 1
          }, { transaction: t });
        }
      }
    }

    await t.commit();
    console.log('\n✅ ¡Poblamiento y saneamiento completado exitosamente!');
    console.log('────────────────────────────────────────────────────────────');
    console.log('✨ Resumen:');
    console.log(`   - Categorías gastronómicas actualizadas: ${categoriasProdData.length}`);
    console.log(`   - Insumos reales activos con stock positivo: ${insumosReales.length}`);
    console.log(`   - Insumos preparados (sub-recetas): ${preparadosData.length}`);
    console.log(`   - Productos reales con fichas técnicas: ${productosReales.length}`);
    console.log(`   - Adiciones con descuento de insumos: ${adicionesReales.length}`);
    console.log(`   - Eventos y promociones comerciales: ${eventosData.length}`);
    console.log('────────────────────────────────────────────────────────────\n');
  } catch (err) {
    await t.rollback();
    console.error('❌ Error durante el poblamiento de datos:', err);
    process.exit(1);
  }
}

seed().then(() => process.exit(0));
