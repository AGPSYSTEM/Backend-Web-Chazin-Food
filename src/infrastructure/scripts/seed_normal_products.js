const { sequelize } = require('../../persistence/models');

const normalProducts = [
  // ==========================================
  // 1. HAMBURGUESAS (idCategoriaProducto: 3)
  // ==========================================
  {
    nombre: 'Hamburguesa BBQ Bacon Chazin',
    idCategoriaProducto: 3,
    categoria: 'Hamburguesas',
    precio: 22000.00,
    descripcion: 'Carne artesanal de res 150g a la parrilla bañada en abundante salsa BBQ ahumada, tocineta ahumada crujiente, doble queso cheddar fundido, cebolla caramelizada y pan brioche artesanal dorado con mantequilla.',
    imagen: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    variantes: [
      { nombre: 'Individual BBQ Bacon 150g', precio: 22000.00 },
      { nombre: 'Doble Carne BBQ Bacon 300g', precio: 28000.00 }
    ],
    receta: [
      { idInsumo: 12, cantidad: 1.00, unidadMedida: 'und' }, // Pan Brioche
      { idInsumo: 14, cantidad: 0.15, unidadMedida: 'kg' },  // Carne de Res
      { idInsumo: 18, cantidad: 0.04, unidadMedida: 'kg' },  // Tocineta
      { idInsumo: 19, cantidad: 2.00, unidadMedida: 'und' }, // Queso Cheddar
      { idInsumo: 24, cantidad: 0.04, unidadMedida: 'kg' },  // Cebolla
      { idInsumo: 44, cantidad: 0.03, unidadMedida: 'kg' }   // Salsa BBQ
    ],
    ficha: {
      tiempoPreparacion: 10,
      rendimiento: '1 porción',
      procedimiento: '1. Tostar el pan brioche artesanal en plancha con mantequilla por 1 min.\n2. Sellar la carne 150g a 200°C por 3 min por lado.\n3. Glasear la carne con salsa BBQ ahumada y colocar dos lonchas de queso cheddar hasta fundir.\n4. Dorar la tocineta hasta que quede crujiente.\n5. Montar en la base del pan la cebolla caramelizada, la carne glaseada con cheddar, la tocineta y cerrar.',
      especificaciones: 'Carne jugosa término 3/4 o bien cocida a mínimo 71°C. Salsa BBQ brillante.',
      caracteristicas: 'Sabor intenso ahumado, dulce y salado con textura crocante.',
      informacionNutricional: 'Calorías: ~780 kcal | Proteína: 42g | Carbohidratos: 48g | Grasas: 44g',
      condicionesAlmacenamiento: 'Servicio en caliente inmediato.',
      vidaUtil: 'Consumo inmediato (máximo 15 min en mesa)'
    }
  },
  {
    nombre: 'Hamburguesa Mexicana Chazin',
    idCategoriaProducto: 3,
    categoria: 'Hamburguesas',
    precio: 23500.00,
    descripcion: '150g de carne de res 80/20, guacamole fresco artesanal, rodajas de jalapeños picantes, queso mozzarella fundido, lechuga batavia fresca y salsa de la casa en pan brioche suave.',
    imagen: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
    variantes: [
      { nombre: 'Mexicana Clásica', precio: 23500.00 },
      { nombre: 'Extra Picante con Doble Jalapeño', precio: 25000.00 }
    ],
    receta: [
      { idInsumo: 12, cantidad: 1.00, unidadMedida: 'und' }, // Pan Brioche
      { idInsumo: 14, cantidad: 0.15, unidadMedida: 'kg' },  // Carne de Res
      { idInsumo: 40, cantidad: 0.05, unidadMedida: 'kg' },  // Guacamole Fresco
      { idInsumo: 25, cantidad: 0.02, unidadMedida: 'kg' },  // Jalapeños
      { idInsumo: 20, cantidad: 0.04, unidadMedida: 'kg' },  // Queso Mozzarella
      { idInsumo: 22, cantidad: 0.02, unidadMedida: 'kg' }   // Lechuga Batavia
    ],
    ficha: {
      tiempoPreparacion: 10,
      rendimiento: '1 porción',
      procedimiento: '1. Dorar suavemente el pan brioche.\n2. Asar la carne 150g a punto perfecto.\n3. Fundir queso mozzarella sobre la carne con campana de vapor.\n4. Untar abundante guacamole fresco en la base del pan, poner la cama de lechuga fresca, montar la carne con queso y coronar con rodajas de jalapeño.',
      especificaciones: 'Guacamole preparado fresco del día, no oxidado.',
      caracteristicas: 'Equilibrio perfecto entre cremosidad del guacamole y toque picante del jalapeño.',
      informacionNutricional: 'Calorías: ~720 kcal | Proteína: 39g | Carbohidratos: 40g | Grasas: 41g',
      condicionesAlmacenamiento: 'Servir recién montada.',
      vidaUtil: 'Consumo inmediato'
    }
  },
  {
    nombre: 'Hamburguesa Campesina Chazin',
    idCategoriaProducto: 3,
    categoria: 'Hamburguesas',
    precio: 23000.00,
    descripcion: 'Carne de res 150g a la plancha con queso mozzarella gratinado, tocineta ahumada crujiente, cebolla blanca salteada, rodajas de tomate chonto fresco, lechuga batavia y salsa tártara artesanal.',
    imagen: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    variantes: [
      { nombre: 'Individual Campesina', precio: 23000.00 }
    ],
    receta: [
      { idInsumo: 12, cantidad: 1.00, unidadMedida: 'und' }, // Pan Brioche
      { idInsumo: 14, cantidad: 0.15, unidadMedida: 'kg' },  // Carne de Res
      { idInsumo: 20, cantidad: 0.04, unidadMedida: 'kg' },  // Queso Mozzarella
      { idInsumo: 18, cantidad: 0.03, unidadMedida: 'kg' },  // Tocineta
      { idInsumo: 24, cantidad: 0.03, unidadMedida: 'kg' },  // Cebolla
      { idInsumo: 23, cantidad: 0.03, unidadMedida: 'kg' },  // Tomate
      { idInsumo: 22, cantidad: 0.02, unidadMedida: 'kg' },  // Lechuga
      { idInsumo: 45, cantidad: 0.02, unidadMedida: 'kg' }   // Salsa Tártara
    ],
    ficha: {
      tiempoPreparacion: 11,
      rendimiento: '1 porción',
      procedimiento: '1. Sellar carne de res y fundir mozzarella encima.\n2. Saltear cebolla blanca hasta punto cristalino.\n3. Montar base con salsa tártara casera, lechuga, tomate, carne con queso, tocineta crocante y cebolla salteada.',
      especificaciones: 'Verduras frescas seleccionadas y tocineta bien dorada.',
      caracteristicas: 'Sabor tradicional hogareño y balance vegetal fresco.',
      informacionNutricional: 'Calorías: ~690 kcal | Proteína: 40g | Carbohidratos: 38g | Grasas: 38g',
      condicionesAlmacenamiento: 'Servir de inmediato.',
      vidaUtil: 'Consumo inmediato'
    }
  },

  // ==========================================
  // 2. PERROS CALIENTES (idCategoriaProducto: 1)
  // ==========================================
  {
    nombre: 'Perro Caliente Mexicano',
    idCategoriaProducto: 1,
    categoria: 'Perros Calientes',
    precio: 16000.00,
    descripcion: 'Pan tierno de perro americano con salchicha americana premium dorada a la plancha, guacamole fresco artesanal, salsa de queso cheddar fundido, tocineta crujiente picada y rodajas de jalapeños.',
    imagen: 'https://images.unsplash.com/photo-1627054234591-6287e0ce3ec2?w=600&auto=format&fit=crop&q=80',
    variantes: [
      { nombre: 'Perro Mexicano Clásico', precio: 16000.00 }
    ],
    receta: [
      { idInsumo: 13, cantidad: 1.00, unidadMedida: 'und' },  // Pan Perro
      { idInsumo: 16, cantidad: 1.00, unidadMedida: 'und' },  // Salchicha Americana
      { idInsumo: 40, cantidad: 0.04, unidadMedida: 'kg' },   // Guacamole
      { idInsumo: 43, cantidad: 0.03, unidadMedida: 'kg' },   // Salsa Cheddar
      { idInsumo: 18, cantidad: 0.02, unidadMedida: 'kg' },   // Tocineta
      { idInsumo: 25, cantidad: 0.015, unidadMedida: 'kg' }  // Jalapeños
    ],
    ficha: {
      tiempoPreparacion: 8,
      rendimiento: '1 porción',
      procedimiento: '1. Calentar pan al vapor.\n2. Dorar salchicha americana en plancha.\n3. Colocar salchicha en el pan, bañar con salsa de queso cheddar fundido y guacamole artesanal.\n4. Espolvorear tocineta crujiente y coronar con jalapeños.',
      especificaciones: 'Pan caliente y suave, salchicha bien caliente.',
      caracteristicas: 'Sabores vivos estilo tex-mex.',
      informacionNutricional: 'Calorías: ~560 kcal | Proteína: 21g | Grasas: 31g',
      condicionesAlmacenamiento: 'Servir recién elaborado.',
      vidaUtil: 'Consumo inmediato'
    }
  },
  {
    nombre: 'Perro Criollo Especial Chazin',
    idCategoriaProducto: 1,
    categoria: 'Perros Calientes',
    precio: 16500.00,
    descripcion: 'Pan suave americano con salchicha americana y salchicha suiza ahumada, lluvia de tocineta crocante, queso mozzarella gratinado al soplete y cremoso suero costeño artesanal.',
    imagen: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=600&auto=format&fit=crop&q=80',
    variantes: [
      { nombre: 'Perro Criollo Gourmet', precio: 16500.00 }
    ],
    receta: [
      { idInsumo: 13, cantidad: 1.00, unidadMedida: 'und' },  // Pan Perro
      { idInsumo: 16, cantidad: 1.00, unidadMedida: 'und' },  // Salchicha Americana
      { idInsumo: 17, cantidad: 0.50, unidadMedida: 'und' },  // Salchicha Suiza
      { idInsumo: 18, cantidad: 0.03, unidadMedida: 'kg' },   // Tocineta
      { idInsumo: 20, cantidad: 0.04, unidadMedida: 'kg' },   // Queso Mozzarella
      { idInsumo: 41, cantidad: 0.025, unidadMedida: 'kg' }  // Suero Costeño
    ],
    ficha: {
      tiempoPreparacion: 8,
      rendimiento: '1 porción',
      procedimiento: '1. Dorar salchicha americana y trozos de salchicha suiza.\n2. Montar en pan caliente, cubrir con queso mozzarella y gratinar.\n3. Agregar lluvia de tocineta crocante y terminar con hilo de suero costeño cremoso.',
      especificaciones: 'Queso fundido elástico y tocineta crocante.',
      caracteristicas: 'Toque auténtico colombiano con suero costeño artesanal.',
      informacionNutricional: 'Calorías: ~610 kcal | Proteína: 27g | Grasas: 36g',
      condicionesAlmacenamiento: 'Servir caliente.',
      vidaUtil: 'Consumo inmediato'
    }
  },

  // ==========================================
  // 3. SALCHIPAPAS GOURMET (idCategoriaProducto: 5)
  // ==========================================
  {
    nombre: 'Salchipapa Criolla Chazin',
    idCategoriaProducto: 5,
    categoria: 'Salchipapas Gourmet',
    precio: 21000.00,
    descripcion: 'Cama abundante de papas a la francesa corte delgado doradas y crujientes, rodajas de salchicha americana doradita, tocineta crujiente, queso mozzarella gratinado, salsa de queso cheddar fundido y suero costeño.',
    imagen: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&auto=format&fit=crop&q=80',
    variantes: [
      { nombre: 'Porción Personal Grande', precio: 21000.00 },
      { nombre: 'Familiar para Compartir (2 Personas)', precio: 34000.00 }
    ],
    receta: [
      { idInsumo: 21, cantidad: 0.25, unidadMedida: 'kg' },  // Papas Francesas
      { idInsumo: 16, cantidad: 1.50, unidadMedida: 'und' }, // Salchicha Americana
      { idInsumo: 18, cantidad: 0.04, unidadMedida: 'kg' },  // Tocineta
      { idInsumo: 20, cantidad: 0.05, unidadMedida: 'kg' },  // Queso Mozzarella
      { idInsumo: 41, cantidad: 0.03, unidadMedida: 'kg' },  // Suero Costeño
      { idInsumo: 43, cantidad: 0.03, unidadMedida: 'kg' }   // Salsa Cheddar
    ],
    ficha: {
      tiempoPreparacion: 12,
      rendimiento: '1 porción abundante',
      procedimiento: '1. Freír 250g de papas a la francesa a 180°C hasta que estén crujientes y doradas.\n2. Saltear rodajas de salchicha americana y tocineta en la plancha.\n3. Servir papas, colocar salchichas y tocineta, cubrir con mozzarella y gratinar con soplete.\n4. Bañar con salsa cheddar y toques de suero costeño.',
      especificaciones: 'Papas secas y crocantes, servir inmediatamente para evitar que el queso enfríe.',
      caracteristicas: 'Generosa, quesuda y crocante.',
      informacionNutricional: 'Calorías: ~840 kcal | Proteína: 31g | Grasas: 48g',
      condicionesAlmacenamiento: 'Consumo inmediato.',
      vidaUtil: 'Consumo inmediato'
    }
  },
  {
    nombre: 'Salchipapa Costeña Chazin',
    idCategoriaProducto: 5,
    categoria: 'Salchipapas Gourmet',
    precio: 22500.00,
    descripcion: 'Papas a la francesa doraditas con salchicha suiza ahumada en rodajas, generosa capa de suero costeño tradicional, tocineta ahumada picada, queso mozzarella gratinado y salsa tártara de la casa.',
    imagen: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80',
    variantes: [
      { nombre: 'Porción Costeña Grande', precio: 22500.00 }
    ],
    receta: [
      { idInsumo: 21, cantidad: 0.25, unidadMedida: 'kg' },  // Papas Francesas
      { idInsumo: 17, cantidad: 1.50, unidadMedida: 'und' }, // Salchicha Suiza
      { idInsumo: 18, cantidad: 0.04, unidadMedida: 'kg' },  // Tocineta
      { idInsumo: 20, cantidad: 0.05, unidadMedida: 'kg' },  // Queso Mozzarella
      { idInsumo: 41, cantidad: 0.04, unidadMedida: 'kg' },  // Suero Costeño
      { idInsumo: 45, cantidad: 0.03, unidadMedida: 'kg' }   // Salsa Tártara
    ],
    ficha: {
      tiempoPreparacion: 12,
      rendimiento: '1 porción grande',
      procedimiento: '1. Freír papas a 180°C.\n2. Dorar en plancha la salchicha suiza ahumada.\n3. Servir cama de papas, colocar la salchicha suiza, fundir mozzarella y bañar con suero costeño abundante y salsa tártara artesanal.',
      especificaciones: 'Sabor ahumado característico de la salchicha suiza.',
      caracteristicas: 'Combinación tradicional costeña con frescura láctea.',
      informacionNutricional: 'Calorías: ~890 kcal | Proteína: 34g | Grasas: 52g',
      condicionesAlmacenamiento: 'Servir recién salida.',
      vidaUtil: 'Consumo inmediato'
    }
  },

  // ==========================================
  // 4. COMBOS (idCategoriaProducto: 2)
  // ==========================================
  {
    nombre: 'Combo Personal Chazin',
    idCategoriaProducto: 2,
    categoria: 'Combos',
    precio: 24500.00,
    descripcion: 'El combo ideal para disfrutar solo: 1 Hamburguesa Clásica Chazin (150g de carne de res, queso cheddar, tocineta crocante) + Porción individual de Papas a la Francesa (150g) + 1 Gaseosa 400ml bien fría a elección.',
    imagen: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&auto=format&fit=crop&q=80',
    variantes: [
      { nombre: 'Combo con Coca-Cola Original 400ml', precio: 24500.00 },
      { nombre: 'Combo con Postobón Manzana 400ml', precio: 24500.00 },
      { nombre: 'Combo con Coca-Cola Sin Azúcar 400ml', precio: 24500.00 }
    ],
    receta: [
      { idInsumo: 12, cantidad: 1.00, unidadMedida: 'und' },  // Pan Brioche
      { idInsumo: 14, cantidad: 0.15, unidadMedida: 'kg' },   // Carne de Res
      { idInsumo: 19, cantidad: 1.00, unidadMedida: 'und' },  // Queso Cheddar
      { idInsumo: 18, cantidad: 0.03, unidadMedida: 'kg' },   // Tocineta
      { idInsumo: 21, cantidad: 0.15, unidadMedida: 'kg' },   // Papas Francesas
      { idInsumo: 29, cantidad: 1.00, unidadMedida: 'und' }   // Coca-Cola 400ml
    ],
    ficha: {
      tiempoPreparacion: 12,
      rendimiento: '1 persona',
      procedimiento: '1. Armar Hamburguesa Clásica en pan brioche con carne 150g, queso cheddar y tocineta.\n2. Freír 150g de papas a la francesa crujientes.\n3. Servir en bandeja combo con bebida fría seleccionada.',
      especificaciones: 'Todo caliente y listo para entregar al mismo tiempo.',
      caracteristicas: 'Almuerzo o cena completa e individual.',
      informacionNutricional: 'Calorías: ~1050 kcal total combo',
      condicionesAlmacenamiento: 'Servicio en caliente con bebida fría.',
      vidaUtil: 'Consumo inmediato'
    }
  },
  {
    nombre: 'Combo Familiar Chazin (4 Personas)',
    idCategoriaProducto: 2,
    categoria: 'Combos',
    precio: 68000.00,
    descripcion: 'El banquete perfecto para compartir con familia o amigos: 2 Hamburguesas Clásicas Chazin + 2 Perros Calientes Especiales Americanos + 2 Porciones grandes de Papas a la Francesa (400g total) + 4 Gaseosas 400ml.',
    imagen: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&auto=format&fit=crop&q=80',
    variantes: [
      { nombre: 'Combo Familiar 4 Personas', precio: 68000.00 }
    ],
    receta: [
      { idInsumo: 12, cantidad: 2.00, unidadMedida: 'und' },  // 2 Pan Brioche
      { idInsumo: 13, cantidad: 2.00, unidadMedida: 'und' },  // 2 Pan Perro
      { idInsumo: 14, cantidad: 0.30, unidadMedida: 'kg' },   // 300g Carne de Res
      { idInsumo: 16, cantidad: 2.00, unidadMedida: 'und' },  // 2 Salchichas Americanas
      { idInsumo: 19, cantidad: 2.00, unidadMedida: 'und' },  // 2 Queso Cheddar
      { idInsumo: 20, cantidad: 0.08, unidadMedida: 'kg' },   // 80g Queso Mozzarella
      { idInsumo: 18, cantidad: 0.10, unidadMedida: 'kg' },   // 100g Tocineta
      { idInsumo: 21, cantidad: 0.40, unidadMedida: 'kg' },   // 400g Papas
      { idInsumo: 29, cantidad: 4.00, unidadMedida: 'und' }   // 4 Gaseosas
    ],
    ficha: {
      tiempoPreparacion: 16,
      rendimiento: '4 personas',
      procedimiento: '1. Elaborar simultáneamente las 2 Hamburguesas Clásicas y los 2 Perros Especiales.\n2. Freír 400g de papas a la francesa en freidora hasta dorar.\n3. Disponer todo en bandeja familiar o empaque de fiesta con salsas y las 4 bebidas frías.',
      especificaciones: 'Coordinar cocina para que todas las preparaciones salgan a la misma temperatura.',
      caracteristicas: 'Máximo ahorro y variedad para 4 comensales.',
      informacionNutricional: 'Calorías: ~3600 kcal total combo',
      condicionesAlmacenamiento: 'Servir inmediatamente.',
      vidaUtil: 'Consumo inmediato'
    }
  },
  {
    nombre: 'Combo Perro Amigos (2 Personas)',
    idCategoriaProducto: 2,
    categoria: 'Combos',
    precio: 32000.00,
    descripcion: 'Diseñado para dos: 2 Perros Calientes Especiales Americanos con queso mozzarella fundido y tocineta crocante + Porción doble de Papas Francesas crujientes (250g) + 2 Gaseosas frías 400ml.',
    imagen: 'https://images.unsplash.com/photo-1541214113241-21578d2d9b62?w=600&auto=format&fit=crop&q=80',
    variantes: [
      { nombre: 'Combo Dúo Perros Calientes', precio: 32000.00 }
    ],
    receta: [
      { idInsumo: 13, cantidad: 2.00, unidadMedida: 'und' },  // 2 Pan Perro
      { idInsumo: 16, cantidad: 2.00, unidadMedida: 'und' },  // 2 Salchichas Americanas
      { idInsumo: 20, cantidad: 0.08, unidadMedida: 'kg' },   // Queso Mozzarella
      { idInsumo: 18, cantidad: 0.06, unidadMedida: 'kg' },   // Tocineta
      { idInsumo: 21, cantidad: 0.25, unidadMedida: 'kg' },   // 250g Papas
      { idInsumo: 29, cantidad: 2.00, unidadMedida: 'und' }   // 2 Gaseosas
    ],
    ficha: {
      tiempoPreparacion: 10,
      rendimiento: '2 personas',
      procedimiento: '1. Asar 2 salchichas americanas y calentar los panes.\n2. Montar perros con tocineta picada y queso mozzarella gratinado.\n3. Servir con 250g de papas francesas calientes y 2 bebidas.',
      especificaciones: 'Servir en conjunto.',
      caracteristicas: 'Dúo delicioso de perros americanos con papas.',
      informacionNutricional: 'Calorías: ~1650 kcal total',
      condicionesAlmacenamiento: 'Consumo inmediato.',
      vidaUtil: 'Consumo inmediato'
    }
  }
];

async function seedNormalProducts() {
  const t = await sequelize.transaction();
  try {
    console.log('--- Iniciando registro de PRODUCTOS NORMALES (sin eventos) en Chazin Food ---');

    // 1. Limpieza preventiva del producto de prueba temporal #27 ("sdfghj")
    console.log('\n--- 1. Limpieza de datos temporales / de prueba ---');
    const [testProds] = await sequelize.query(
      "SELECT idProducto FROM producto WHERE nombre = 'sdfghj' OR idProducto = 27",
      { transaction: t }
    );
    if (testProds.length > 0) {
      for (const tp of testProds) {
        await sequelize.query('DELETE FROM detallefichainsumo WHERE idFichaTecnica IN (SELECT idFichaTecnica FROM fichatecnica WHERE idProducto = ?)', {
          replacements: [tp.idProducto],
          transaction: t
        });
        await sequelize.query('DELETE FROM fichatecnica WHERE idProducto = ?', {
          replacements: [tp.idProducto],
          transaction: t
        });
        await sequelize.query('DELETE FROM variante WHERE idProducto = ?', {
          replacements: [tp.idProducto],
          transaction: t
        });
        await sequelize.query('DELETE FROM producto WHERE idProducto = ?', {
          replacements: [tp.idProducto],
          transaction: t
        });
        console.log(`✓ Producto de prueba eliminado correctamente (ID: ${tp.idProducto})`);
      }
    } else {
      console.log('= No se encontraron productos de prueba para limpiar.');
    }

    // 2. Registro de cada Producto Normal
    console.log('\n--- 2. Creando e insertando productos normales con variantes y recetas ---');

    for (const item of normalProducts) {
      // Verificar si ya existe por nombre
      const [existing] = await sequelize.query(
        'SELECT idProducto FROM producto WHERE nombre = ?',
        { replacements: [item.nombre], transaction: t }
      );

      let prodId = null;
      if (existing.length === 0) {
        const [res] = await sequelize.query(
          `INSERT INTO producto (idCategoriaProducto, nombre, descripcion, imagen, estado, precio, categoria, adiciones)
           VALUES (?, ?, ?, ?, 1, ?, ?, '[]')`,
          {
            replacements: [
              item.idCategoriaProducto,
              item.nombre,
              item.descripcion,
              item.imagen,
              item.precio,
              item.categoria
            ],
            transaction: t
          }
        );
        prodId = res;
        console.log(`\n+ [NUEVO PRODUCTO] #${prodId}: ${item.nombre} ($${item.precio})`);
      } else {
        prodId = existing[0].idProducto;
        await sequelize.query(
          `UPDATE producto 
           SET idCategoriaProducto = ?, descripcion = ?, imagen = ?, estado = 1, precio = ?, categoria = ?
           WHERE idProducto = ?`,
          {
            replacements: [
              item.idCategoriaProducto,
              item.descripcion,
              item.imagen,
              item.precio,
              item.categoria,
              prodId
            ],
            transaction: t
          }
        );
        console.log(`\n= [ACTUALIZADO PRODUCTO] #${prodId}: ${item.nombre}`);
      }

      // Variantes
      let firstVarId = null;
      for (const v of item.variantes) {
        const [existingVar] = await sequelize.query(
          'SELECT idVariante FROM variante WHERE idProducto = ? AND nombre = ?',
          { replacements: [prodId, v.nombre], transaction: t }
        );

        if (existingVar.length === 0) {
          const [vRes] = await sequelize.query(
            'INSERT INTO variante (idProducto, nombre, precio, estado) VALUES (?, ?, ?, 1)',
            { replacements: [prodId, v.nombre, v.precio], transaction: t }
          );
          if (!firstVarId) firstVarId = vRes;
          console.log(`  + Variante creada: "${v.nombre}" - $${v.precio} (ID: ${vRes})`);
        } else {
          if (!firstVarId) firstVarId = existingVar[0].idVariante;
          await sequelize.query(
            'UPDATE variante SET precio = ?, estado = 1 WHERE idVariante = ?',
            { replacements: [v.precio, existingVar[0].idVariante], transaction: t }
          );
          console.log(`  = Variante actualizada: "${v.nombre}" - $${v.precio}`);
        }
      }

      // Ficha Técnica
      const [existingFicha] = await sequelize.query(
        'SELECT idFichaTecnica FROM fichatecnica WHERE idProducto = ?',
        { replacements: [prodId], transaction: t }
      );

      let fichaId = null;
      if (existingFicha.length === 0) {
        const [fRes] = await sequelize.query(
          `INSERT INTO fichatecnica (
            idVariante, descripcion, fechaCreacion, idProducto, tipo, 
            procedimiento, tiempoPreparacion, rendimiento, especificaciones, 
            caracteristicas, informacionNutricional, condicionesAlmacenamiento, 
            vidaUtil, observaciones, estado
          ) VALUES (?, ?, NOW(), ?, 'PRODUCTO', ?, ?, ?, ?, ?, ?, ?, ?, 'Receta e insumos estandarizados Chazin Food.', 1)`,
          {
            replacements: [
              firstVarId,
              item.descripcion,
              prodId,
              item.ficha.procedimiento,
              item.ficha.tiempoPreparacion,
              item.ficha.rendimiento,
              item.ficha.especificaciones,
              item.ficha.caracteristicas,
              item.ficha.informacionNutricional,
              item.ficha.condicionesAlmacenamiento,
              item.ficha.vidaUtil
            ],
            transaction: t
          }
        );
        fichaId = fRes;
        console.log(`  + Ficha Técnica creada (ID: ${fichaId})`);
      } else {
        fichaId = existingFicha[0].idFichaTecnica;
        await sequelize.query(
          `UPDATE fichatecnica SET
            idVariante = ?, descripcion = ?, procedimiento = ?, tiempoPreparacion = ?, 
            rendimiento = ?, especificaciones = ?, caracteristicas = ?, 
            informacionNutricional = ?, condicionesAlmacenamiento = ?, vidaUtil = ?, estado = 1
           WHERE idFichaTecnica = ?`,
          {
            replacements: [
              firstVarId,
              item.descripcion,
              item.ficha.procedimiento,
              item.ficha.tiempoPreparacion,
              item.ficha.rendimiento,
              item.ficha.especificaciones,
              item.ficha.caracteristicas,
              item.ficha.informacionNutricional,
              item.ficha.condicionesAlmacenamiento,
              item.ficha.vidaUtil,
              fichaId
            ],
            transaction: t
          }
        );
        console.log(`  = Ficha Técnica actualizada (ID: ${fichaId})`);
      }

      // Detalle de Insumos de la Receta
      // Limpiar detalles previos para sincronizar la receta completa
      await sequelize.query('DELETE FROM detallefichainsumo WHERE idFichaTecnica = ?', {
        replacements: [fichaId],
        transaction: t
      });

      for (const rec of item.receta) {
        await sequelize.query(
          `INSERT INTO detallefichainsumo (idFichaTecnica, idInsumo, cantidad, unidadMedida)
           VALUES (?, ?, ?, ?)`,
          {
            replacements: [fichaId, rec.idInsumo, rec.cantidad, rec.unidadMedida],
            transaction: t
          }
        );
      }
      console.log(`  + Receta enlazada: ${item.receta.length} insumos de inventario.`);
    }

    await t.commit();
    console.log('\n===============================================================');
    console.log('¡TODOS LOS PRODUCTOS NORMALES FUERON SEMBRADOS SATISFACTORIAMENTE!');
    console.log('===============================================================');
    process.exit(0);
  } catch (error) {
    await t.rollback();
    console.error('ERROR crítico al sembrar productos normales:', error);
    process.exit(1);
  }
}

seedNormalProducts();
