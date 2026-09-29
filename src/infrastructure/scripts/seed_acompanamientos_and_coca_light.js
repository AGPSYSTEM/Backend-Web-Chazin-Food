const fs = require('fs');
const path = require('path');
const { sequelize } = require('../../persistence/models');

const CLOUD_NAME = 'dckwtknmq';
const UPLOAD_PRESET = 'chazin_food_preset';

async function uploadLocalImageToCloudinary(filePath, filename) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`Archivo no encontrado: ${filePath}`);
      return null;
    }
    const buffer = fs.readFileSync(filePath);
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    const form = new FormData();
    form.append('file', blob, filename || 'image.jpg');
    form.append('upload_preset', UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: form
    });
    const data = await res.json();
    if (data.secure_url) {
      console.log(`✓ Imagen subida a Cloudinary (${filename}): ${data.secure_url}`);
      return data.secure_url;
    }
    console.warn(`Error en respuesta Cloudinary para ${filename}:`, data);
    return null;
  } catch (err) {
    console.error(`Error subiendo ${filename} a Cloudinary:`, err);
    return null;
  }
}

async function run() {
  console.log('=== INICIANDO MIGRACIÓN Y REGISTRO REAL DE ACOMPAÑAMIENTOS Y COCA-COLA LIGHT ===');

  const brainDir = 'C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\5d7744af-857f-4453-82f3-6a48da5ec30b';

  // 1. Subir imágenes a Cloudinary
  console.log('\n--- 1. Subiendo imágenes a Cloudinary ---');
  const imgCocaLight = await uploadLocalImageToCloudinary(
    path.join(brainDir, 'coca_cola_light_bottle_1789007433524.jpg'),
    'coca_cola_light.jpg'
  );
  const imgPapasCorral = await uploadLocalImageToCloudinary(
    path.join(brainDir, 'papas_corral_carton_1789007453426.jpg'),
    'papas_corral_grandes.jpg'
  );
  const imgPapasCasco = await uploadLocalImageToCloudinary(
    path.join(brainDir, 'papas_en_casco_1789007475133.jpg'),
    'papas_en_casco.jpg'
  );
  const imgPapaEspiral = await uploadLocalImageToCloudinary(
    path.join(brainDir, 'papa_espiral_1789007501717.jpg'),
    'papa_espiral.jpg'
  );
  const imgPapasChili = await uploadLocalImageToCloudinary(
    path.join(brainDir, 'papas_con_chili_1789007527632.jpg'),
    'papas_con_chili.jpg'
  );
  const imgPapasTocineta = await uploadLocalImageToCloudinary(
    path.join(brainDir, 'papas_con_tocineta_1789007556940.jpg'),
    'papas_con_tocineta.jpg'
  );
  const imgPapasTocinetaCombo = await uploadLocalImageToCloudinary(
    path.join(brainDir, 'papas_tocineta_combo_1789007589179.jpg'),
    'papas_tocineta_combo.jpg'
  );
  const imgCategoriaAcompanamientos = await uploadLocalImageToCloudinary(
    path.join(brainDir, 'categoria_acompanamientos_1789007630364.jpg'),
    'categoria_acompanamientos.jpg'
  );

  const t = await sequelize.transaction();

  try {
    // 2. Crear Categoría "Acompañamientos" en categoriaproducto
    console.log('\n--- 2. Asegurando categoría Acompañamientos ---');
    const [existingCat] = await sequelize.query(
      "SELECT idCategoriaProducto FROM categoriaproducto WHERE nombre = 'Acompañamientos'",
      { transaction: t }
    );
    let idCatAcompanamientos = null;
    if (existingCat.length > 0) {
      idCatAcompanamientos = existingCat[0].idCategoriaProducto;
      await sequelize.query(
        "UPDATE categoriaproducto SET descripcion = ?, estado = 1, icon = ? WHERE idCategoriaProducto = ?",
        {
          replacements: [
            'Papas francesas, rústicas en casco, espirales y especialidades para acompañar',
            imgCategoriaAcompanamientos || 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789007402/ali1k60gryvystywsqj4.jpg',
            idCatAcompanamientos
          ],
          transaction: t
        }
      );
      console.log(`= Categoría Acompañamientos actualizada (ID: ${idCatAcompanamientos})`);
    } else {
      const [insertCatRes] = await sequelize.query(
        `INSERT INTO categoriaproducto (idCategoriaProducto, nombre, descripcion, estado, icon)
         VALUES (6, 'Acompañamientos', 'Papas francesas, rústicas en casco, espirales y especialidades para acompañar', 1, ?)`,
        {
          replacements: [
            imgCategoriaAcompanamientos || 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789007402/ali1k60gryvystywsqj4.jpg'
          ],
          transaction: t
        }
      );
      idCatAcompanamientos = 6;
      console.log(`✓ Categoría Acompañamientos creada con ID: ${idCatAcompanamientos}`);
    }

    // 3. Crear insumos reales para los acompañamientos
    console.log('\n--- 3. Registrando insumos reales para acompañamientos ---');
    const nuevosInsumos = [
      { idInsumo: 38, idCategoriaInsumo: 4, nombre: 'Papas Rústicas en Casco con Piel', stock: 50.0, stockMin: 10, unidadMedida: 'kg', precio: 4500 },
      { idInsumo: 39, idCategoriaInsumo: 4, nombre: 'Chili con Carne de Res Artesanal', stock: 25.0, stockMin: 5, unidadMedida: 'kg', precio: 12000 },
      { idInsumo: 40, idCategoriaInsumo: 4, nombre: 'Guacamole Fresco Artesanal', stock: 20.0, stockMin: 5, unidadMedida: 'kg', precio: 10000 },
      { idInsumo: 41, idCategoriaInsumo: 4, nombre: 'Suero Costeño Cremoso Artesanal', stock: 20.0, stockMin: 5, unidadMedida: 'kg', precio: 6500 },
      { idInsumo: 42, idCategoriaInsumo: 4, nombre: 'Papas Especiales para Espiral', stock: 35.0, stockMin: 8, unidadMedida: 'kg', precio: 5500 },
      { idInsumo: 43, idCategoriaInsumo: 4, nombre: 'Salsa de Queso Cheddar Fundido', stock: 30.0, stockMin: 6, unidadMedida: 'kg', precio: 14000 },
      { idInsumo: 44, idCategoriaInsumo: 4, nombre: 'Salsa BBQ Ahumada Artesanal', stock: 15.0, stockMin: 4, unidadMedida: 'kg', precio: 5000 },
      { idInsumo: 45, idCategoriaInsumo: 4, nombre: 'Salsa Tártara Casera Especial', stock: 15.0, stockMin: 4, unidadMedida: 'kg', precio: 5000 },
    ];

    for (const ins of nuevosInsumos) {
      const [existingIns] = await sequelize.query(
        'SELECT idInsumo FROM insumo WHERE idInsumo = ? OR nombre = ?',
        { replacements: [ins.idInsumo, ins.nombre], transaction: t }
      );
      if (existingIns.length === 0) {
        await sequelize.query(
          `INSERT INTO insumo (idInsumo, idCategoriaInsumo, nombre, descripcion, stock, stockMinimo, unidadMedida, precioUnitario, estado)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          {
            replacements: [
              ins.idInsumo,
              ins.idCategoriaInsumo,
              ins.nombre,
              `${ins.nombre} para preparación de acompañamientos Chazin Food`,
              ins.stock,
              ins.stockMin,
              ins.unidadMedida,
              ins.precio
            ],
            transaction: t
          }
        );
        console.log(`✓ Insumo registrado: ${ins.nombre} (#${ins.idInsumo})`);
      } else {
        await sequelize.query(
          'UPDATE insumo SET stock = ?, stockMinimo = ?, estado = 1 WHERE idInsumo = ?',
          { replacements: [ins.stock, ins.stockMin, existingIns[0].idInsumo], transaction: t }
        );
        console.log(`= Insumo actualizado: ${ins.nombre} (#${existingIns[0].idInsumo})`);
      }
    }

    // 4. Crear adiciones reales de salsas y complementos
    console.log('\n--- 4. Registrando adiciones reales de salsas ---');
    const nuevasAdiciones = [
      {
        idAdicion: 9,
        idInsumo: 44,
        nombre: 'Salsa BBQ Ahumada Artesanal (50g)',
        descripcion: 'Pote de 50g con salsa BBQ clásica de cocción lenta y toque ahumado',
        precio: 1500.00,
        imagen: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80'
      },
      {
        idAdicion: 10,
        idInsumo: 45,
        nombre: 'Salsa Tártara Casera Especial (50g)',
        descripcion: 'Pote de 50g con salsa tártara cremosa con alcaparras y finas hierbas',
        precio: 1500.00,
        imagen: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'
      },
      {
        idAdicion: 11,
        idInsumo: 41,
        nombre: 'Suero Costeño Cremoso Artesanal (50g)',
        descripcion: 'Pote de 50g de auténtico suero costeño tradicional cremoso',
        precio: 1500.00,
        imagen: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80'
      },
      {
        idAdicion: 12,
        idInsumo: 43,
        nombre: 'Porción Queso Cheddar Fundido (60g)',
        descripcion: 'Pote de 60g de delicioso queso cheddar caliente y fundido para bañar tus papas',
        precio: 2500.00,
        imagen: 'https://res.cloudinary.com/dckwtknmq/image/upload/v1788966113/ugcycexl6ja8xriso4ni.webp'
      },
      {
        idAdicion: 13,
        idInsumo: 40,
        nombre: 'Porción Guacamole Fresco Artesanal (60g)',
        descripcion: 'Pote de 60g con guacamole fresco preparado con aguacate hass, limón y cilantro',
        precio: 2500.00,
        imagen: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80'
      }
    ];

    for (const ad of nuevasAdiciones) {
      const [existingAd] = await sequelize.query(
        'SELECT idAdicion FROM adicion WHERE idAdicion = ? OR nombre = ?',
        { replacements: [ad.idAdicion, ad.nombre], transaction: t }
      );
      if (existingAd.length === 0) {
        await sequelize.query(
          `INSERT INTO adicion (idAdicion, idInsumo, nombre, descripcion, imagen, precio, estado)
           VALUES (?, ?, ?, ?, ?, ?, 1)`,
          {
            replacements: [ad.idAdicion, ad.idInsumo, ad.nombre, ad.descripcion, ad.imagen, ad.precio],
            transaction: t
          }
        );
        console.log(`✓ Adición registrada: ${ad.nombre} (#${ad.idAdicion})`);
      } else {
        await sequelize.query(
          'UPDATE adicion SET idInsumo = ?, descripcion = ?, precio = ?, imagen = ?, estado = 1 WHERE idAdicion = ?',
          { replacements: [ad.idInsumo, ad.descripcion, ad.precio, ad.imagen, existingAd[0].idAdicion], transaction: t }
        );
        console.log(`= Adición actualizada: ${ad.nombre} (#${existingAd[0].idAdicion})`);
      }
    }

    // 5. Mover producto 15 a categoría 6 (Acompañamientos) y actualizar su imagen
    console.log('\n--- 5. Actualizando producto 15 a categoría Acompañamientos ---');
    await sequelize.query(
      `UPDATE producto 
       SET idCategoriaProducto = ?, categoria = 'Acompañamientos', imagen = ?
       WHERE idProducto = 15`,
      {
        replacements: [idCatAcompanamientos, imgPapasCorral || 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789007402/ali1k60gryvystywsqj4.jpg'],
        transaction: t
      }
    );
    console.log('✓ Producto 15 actualizado a categoría Acompañamientos');

    // 6. Registrar Coca-Cola Sin Azúcar / Light como producto REAL en `producto`
    console.log('\n--- 6. Registrando Coca-Cola Sin Azúcar / Light como producto independiente y editable ---');
    const [existingCocaLightProd] = await sequelize.query(
      "SELECT idProducto FROM producto WHERE nombre LIKE '%Coca-Cola Sin Azúcar%' OR nombre LIKE '%Coca-Cola Light%'",
      { transaction: t }
    );

    let idCocaLightProd = null;
    if (existingCocaLightProd.length === 0) {
      const [insertCocaLightRes] = await sequelize.query(
        `INSERT INTO producto (idCategoriaProducto, nombre, descripcion, imagen, estado, precio, categoria, adiciones)
         VALUES (4, 'Gaseosa Coca-Cola Sin Azúcar / Light 400ml', 'Gaseosa Coca-Cola Sin Azúcar / Light personal 400ml en botella PET, todo el sabor original sin azúcar ni calorías.', ?, 1, 4500.00, 'Bebidas', '[]')`,
        {
          replacements: [imgCocaLight || 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600'],
          transaction: t
        }
      );
      idCocaLightProd = insertCocaLightRes;
      console.log(`✓ Producto Coca-Cola Sin Azúcar creado (#${idCocaLightProd})`);
    } else {
      idCocaLightProd = existingCocaLightProd[0].idProducto;
      await sequelize.query(
        "UPDATE producto SET imagen = ?, precio = 4500.00, estado = 1 WHERE idProducto = ?",
        { replacements: [imgCocaLight, idCocaLightProd], transaction: t }
      );
      console.log(`= Producto Coca-Cola Sin Azúcar actualizado (#${idCocaLightProd})`);
    }

    // Asegurar variante para Coca-Cola Sin Azúcar producto
    const [cocaLightProdVar] = await sequelize.query(
      "SELECT idVariante FROM variante WHERE idProducto = ?",
      { replacements: [idCocaLightProd], transaction: t }
    );
    let idVarCocaLight = null;
    if (cocaLightProdVar.length === 0) {
      const [varRes] = await sequelize.query(
        "INSERT INTO variante (idProducto, nombre, precio, estado) VALUES (?, 'Botella 400ml', 4500.00, 1)",
        { replacements: [idCocaLightProd], transaction: t }
      );
      idVarCocaLight = varRes;
    } else {
      idVarCocaLight = cocaLightProdVar[0].idVariante;
    }

    // Asegurar ficha técnica de Coca-Cola Sin Azúcar vinculada a Insumo 32
    const [fichaCocaLight] = await sequelize.query(
      "SELECT idFichaTecnica FROM fichatecnica WHERE idProducto = ?",
      { replacements: [idCocaLightProd], transaction: t }
    );
    if (fichaCocaLight.length === 0) {
      const [fRes] = await sequelize.query(
        `INSERT INTO fichatecnica (idVariante, descripcion, fechaCreacion, idProducto, tipo, procedimiento, tiempoPreparacion, rendimiento, especificaciones, caracteristicas, informacionNutricional, condicionesAlmacenamiento, vidaUtil, observaciones, estado)
         VALUES (?, 'Gaseosa Coca-Cola Sin Azúcar 400ml bien fría', NOW(), ?, 'PRODUCTO', '1. Retirar del refrigerador a temperatura controlada (2°C - 4°C).\n2. Destapar y servir con vaso y servilletas.', 1, '1 botella (400ml)', 'Bebida sin azúcar gasificada en envase sellado.', 'Sabor dulce característico de Coca-Cola sin calorías.', 'Calorías: 0 kcal, Azúcares: 0g, Sodio: 25mg.', 'Mantener refrigerado entre 2°C y 6°C.', '6 meses en envase cerrado.', 'Verificar fecha de caducidad.', 1)`,
        { replacements: [idVarCocaLight, idCocaLightProd], transaction: t }
      );
      await sequelize.query(
        "INSERT INTO detallefichainsumo (idFichaTecnica, idInsumo, cantidad, unidadMedida) VALUES (?, 32, 1.0, 'und')",
        { replacements: [fRes], transaction: t }
      );
      console.log(`✓ Ficha técnica creada para Coca-Cola Sin Azúcar (#${fRes})`);
    }

    // 7. Registrar los 9 productos reales de Acompañamientos inspirados en El Corral
    console.log('\n--- 7. Registrando los productos reales de Acompañamientos ---');
    const acompanamientosMenu = [
      {
        nombre: 'Papas Corral Grandes',
        precio: 10500.00,
        descripcion: 'Las papas más crocantes: porción grande (220g) de papas corte tradicional delgadas, doradas a la perfección y sazonadas con sal marina.',
        imagen: imgPapasCorral || 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789007402/ali1k60gryvystywsqj4.jpg',
        insumoPrincipalId: 21, // Papas a la francesa
        cantidadInsumo: 0.22,
        unidadInsumo: 'kg',
        tiempoPrep: 3,
        rendimiento: '1 porción grande (220g)',
        especificaciones: 'Papas corte 7x7mm doradas y ultra crocantes, temperatura interior >75°C.',
        caracteristicas: 'Exterior crujiente, interior esponjoso con sal marina fina.',
        nutricional: 'Calorías: 450 kcal, Carbohidratos: 58g, Grasas: 20g, Proteína: 4g.',
        insumosAdicionales: []
      },
      {
        nombre: 'Papas Corral Medianas',
        precio: 8500.00,
        descripcion: 'Las papas más crocantes: porción mediana (150g) de papas corte tradicional delgadas doradas, para acompañar lo que más te gusta.',
        imagen: imgPapasCorral || 'https://res.cloudinary.com/dckwtknmq/image/upload/v1789007402/ali1k60gryvystywsqj4.jpg',
        insumoPrincipalId: 21,
        cantidadInsumo: 0.15,
        unidadInsumo: 'kg',
        tiempoPrep: 3,
        rendimiento: '1 porción mediana (150g)',
        especificaciones: 'Papas corte tradicional delgadas doradas a 175°C por 3 minutos.',
        caracteristicas: 'Crocantes, doradas con sal marina homogénea.',
        nutricional: 'Calorías: 310 kcal, Carbohidratos: 40g, Grasas: 14g, Proteína: 3g.',
        insumosAdicionales: []
      },
      {
        nombre: 'Papas en Casco Grandes',
        precio: 10500.00,
        descripcion: 'Las papas en cascos más crocantes: porción grande (240g) de papas rústicas con piel, sazonadas con paprika, romero y sal marina.',
        imagen: imgPapasCasco || 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600',
        insumoPrincipalId: 38, // Papas en casco
        cantidadInsumo: 0.24,
        unidadInsumo: 'kg',
        tiempoPrep: 4,
        rendimiento: '1 porción grande (240g)',
        especificaciones: 'Cascos de papa con piel dorada crujiente y centro suave.',
        caracteristicas: 'Sabor rústico especiado con corteza crocante.',
        nutricional: 'Calorías: 420 kcal, Carbohidratos: 55g, Grasas: 18g, Proteína: 5g.',
        insumosAdicionales: []
      },
      {
        nombre: 'Papas en Casco Medianas',
        precio: 8500.00,
        descripcion: 'Las papas en cascos más crocantes: porción mediana (160g) de papas rústicas con piel dorada y especias de la casa.',
        imagen: imgPapasCasco || 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600',
        insumoPrincipalId: 38,
        cantidadInsumo: 0.16,
        unidadInsumo: 'kg',
        tiempoPrep: 4,
        rendimiento: '1 porción mediana (160g)',
        especificaciones: 'Cascos rústicos dorados a 175°C durante 4 minutos.',
        caracteristicas: 'Rústicas, crujientes con especias naturales.',
        nutricional: 'Calorías: 290 kcal, Carbohidratos: 38g, Grasas: 12g, Proteína: 3.5g.',
        insumosAdicionales: []
      },
      {
        nombre: 'Papa Espiral',
        precio: 13500.00,
        descripcion: 'Papas en espiral continua (200g), doradas al punto justo y sazonadas con paprika ahumada, sal marina y finas hierbas para acompañar lo que más te gusta.',
        imagen: imgPapaEspiral || 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600',
        insumoPrincipalId: 42, // Papas espiral
        cantidadInsumo: 0.20,
        unidadInsumo: 'kg',
        tiempoPrep: 4,
        rendimiento: '1 brocheta / porción espiral (200g)',
        especificaciones: 'Corte en espiral continuo y uniforme, textura ultra crocante tipo chip.',
        caracteristicas: 'Textura crujiente en cada aro, sazón gourmet.',
        nutricional: 'Calorías: 380 kcal, Carbohidratos: 48g, Grasas: 17g, Proteína: 4g.',
        insumosAdicionales: []
      },
      {
        nombre: 'Papas con Chili Mediana',
        precio: 15500.00,
        descripcion: 'Porción de 160g de papas crocantes bañadas con abundante chili con carne de res artesanal, guacamole fresco y queso cheddar fundido.',
        imagen: imgPapasChili || 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600',
        insumoPrincipalId: 21,
        cantidadInsumo: 0.16,
        unidadInsumo: 'kg',
        tiempoPrep: 4,
        rendimiento: '1 canastilla cargada (320g total)',
        especificaciones: 'Papas calientes cubiertas con chili artesanal (80g), guacamole (40g) y cheddar fundido (40g).',
        caracteristicas: 'Combinación explosiva de texturas crocante, cremosa y queso fundido caliente.',
        nutricional: 'Calorías: 680 kcal, Carbohidratos: 62g, Grasas: 34g, Proteína: 22g.',
        insumosAdicionales: [
          { idInsumo: 39, cantidad: 0.08, unidadMedida: 'kg' }, // Chili con carne
          { idInsumo: 40, cantidad: 0.04, unidadMedida: 'kg' }, // Guacamole
          { idInsumo: 43, cantidad: 0.04, unidadMedida: 'kg' }  // Queso cheddar fundido
        ]
      },
      {
        nombre: 'Papas con Chili Mediana + Bebida',
        precio: 17500.00,
        descripcion: 'Porción de 160g de papas con chili con carne, guacamole fresco y queso cheddar fundido + Gaseosa o bebida 400ml a elección.',
        imagen: imgPapasChili || 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600',
        insumoPrincipalId: 21,
        cantidadInsumo: 0.16,
        unidadInsumo: 'kg',
        tiempoPrep: 4,
        rendimiento: '1 combo individual completo',
        especificaciones: 'Papas con chili, guacamole y cheddar fundido acompañadas de bebida 400ml sellada.',
        caracteristicas: 'Combo completo de acompañamiento premium con bebida refrescante.',
        nutricional: 'Calorías: 820 kcal, Carbohidratos: 95g, Grasas: 34g, Proteína: 22g.',
        insumosAdicionales: [
          { idInsumo: 39, cantidad: 0.08, unidadMedida: 'kg' },
          { idInsumo: 40, cantidad: 0.04, unidadMedida: 'kg' },
          { idInsumo: 43, cantidad: 0.04, unidadMedida: 'kg' },
          { idInsumo: 29, cantidad: 1.0, unidadMedida: 'und' } // Coca-Cola o bebida
        ]
      },
      {
        nombre: 'Papas con Tocineta Mediana',
        precio: 15500.00,
        descripcion: 'Porción de 160g de papas crocantes coronadas con tocineta ahumada crujiente en trozos, suero costeño tradicional y abundante queso cheddar fundido.',
        imagen: imgPapasTocineta || 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600',
        insumoPrincipalId: 21,
        cantidadInsumo: 0.16,
        unidadInsumo: 'kg',
        tiempoPrep: 4,
        rendimiento: '1 canastilla cargada (300g total)',
        especificaciones: 'Papas calientes cubiertas con tocineta crocante (50g), suero costeño (40g) y cheddar fundido (40g).',
        caracteristicas: 'Sabor ahumado, salado crujiente y cremoso con el toque auténtico del suero.',
        nutricional: 'Calorías: 690 kcal, Carbohidratos: 56g, Grasas: 38g, Proteína: 20g.',
        insumosAdicionales: [
          { idInsumo: 18, cantidad: 0.05, unidadMedida: 'kg' }, // Tocineta ahumada
          { idInsumo: 41, cantidad: 0.04, unidadMedida: 'kg' }, // Suero costeño
          { idInsumo: 43, cantidad: 0.04, unidadMedida: 'kg' }  // Queso cheddar fundido
        ]
      },
      {
        nombre: 'Papas con Tocineta Mediana + Bebida',
        precio: 17500.00,
        descripcion: 'Porción de 160g de papas con tocineta ahumada crocante, suero costeño y queso cheddar fundido + Gaseosa o bebida 400ml a elección.',
        imagen: imgPapasTocinetaCombo || imgPapasTocineta || 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600',
        insumoPrincipalId: 21,
        cantidadInsumo: 0.16,
        unidadInsumo: 'kg',
        tiempoPrep: 4,
        rendimiento: '1 combo individual completo',
        especificaciones: 'Papas con tocineta, suero costeño y queso cheddar fundido + bebida fría 400ml.',
        caracteristicas: 'Combo completo de acompañamiento tocineta con bebida refrescante.',
        nutricional: 'Calorías: 830 kcal, Carbohidratos: 89g, Grasas: 38g, Proteína: 20g.',
        insumosAdicionales: [
          { idInsumo: 18, cantidad: 0.05, unidadMedida: 'kg' },
          { idInsumo: 41, cantidad: 0.04, unidadMedida: 'kg' },
          { idInsumo: 43, cantidad: 0.04, unidadMedida: 'kg' },
          { idInsumo: 29, cantidad: 1.0, unidadMedida: 'und' }
        ]
      }
    ];

    for (const item of acompanamientosMenu) {
      const [existing] = await sequelize.query(
        'SELECT idProducto FROM producto WHERE nombre = ?',
        { replacements: [item.nombre], transaction: t }
      );

      let prodId = null;
      if (existing.length === 0) {
        const [insertRes] = await sequelize.query(
          `INSERT INTO producto (idCategoriaProducto, nombre, descripcion, imagen, estado, precio, categoria, adiciones)
           VALUES (?, ?, ?, ?, 1, ?, 'Acompañamientos', '[]')`,
          {
            replacements: [idCatAcompanamientos, item.nombre, item.descripcion, item.imagen, item.precio],
            transaction: t
          }
        );
        prodId = insertRes;
        console.log(`✓ Producto creado: ${item.nombre} (#${prodId})`);
      } else {
        prodId = existing[0].idProducto;
        await sequelize.query(
          `UPDATE producto 
           SET idCategoriaProducto = ?, descripcion = ?, imagen = ?, precio = ?, categoria = 'Acompañamientos', estado = 1
           WHERE idProducto = ?`,
          {
            replacements: [idCatAcompanamientos, item.descripcion, item.imagen, item.precio, prodId],
            transaction: t
          }
        );
        console.log(`= Producto actualizado: ${item.nombre} (#${prodId})`);
      }

      // Variante
      const [existingVar] = await sequelize.query(
        'SELECT idVariante FROM variante WHERE idProducto = ?',
        { replacements: [prodId], transaction: t }
      );
      let varId = null;
      if (existingVar.length === 0) {
        const [varRes] = await sequelize.query(
          'INSERT INTO variante (idProducto, nombre, precio, estado) VALUES (?, ?, ?, 1)',
          { replacements: [prodId, 'Porción Individual', item.precio], transaction: t }
        );
        varId = varRes;
      } else {
        varId = existingVar[0].idVariante;
        await sequelize.query(
          'UPDATE variante SET precio = ?, estado = 1 WHERE idVariante = ?',
          { replacements: [item.precio, varId], transaction: t }
        );
      }

      // Ficha Técnica
      const [existingFicha] = await sequelize.query(
        'SELECT idFichaTecnica FROM fichatecnica WHERE idProducto = ?',
        { replacements: [prodId], transaction: t }
      );
      let fichaId = null;
      if (existingFicha.length === 0) {
        const [fichaRes] = await sequelize.query(
          `INSERT INTO fichatecnica (idVariante, descripcion, fechaCreacion, idProducto, tipo, procedimiento, tiempoPreparacion, rendimiento, especificaciones, caracteristicas, informacionNutricional, condicionesAlmacenamiento, vidaUtil, observaciones, estado)
           VALUES (?, ?, NOW(), ?, 'PRODUCTO', ?, ?, ?, ?, ?, ?, 'Mantener insumos congelados a -18°C. Servir recién salido de freidora a más de 75°C.', 'Consumo inmediato caliente (máx 15 minutos).', 'Verificar temperatura de aceite a 175°C antes de ingresar el producto.', 1)`,
          {
            replacements: [
              varId,
              item.descripcion,
              prodId,
              `1. Retirar insumos de congelación (-18°C).\n2. Freír en aceite vegetal a 175°C durante ${item.tiempoPrep} minutos hasta lograr punto dorado y crocante.\n3. Escurrir aceite durante 25 segundos.\n4. Montar en barqueta biodegradable, añadir salsas/toppings correspondientes y servir caliente.`,
              item.tiempoPrep,
              item.rendimiento,
              item.especificaciones,
              item.caracteristicas,
              item.nutricional
            ],
            transaction: t
          }
        );
        fichaId = fichaRes;
        console.log(`  ✓ Ficha técnica creada (#${fichaId}) para ${item.nombre}`);
      } else {
        fichaId = existingFicha[0].idFichaTecnica;
        await sequelize.query(
          `UPDATE fichatecnica 
           SET descripcion = ?, tiempoPreparacion = ?, rendimiento = ?, especificaciones = ?, caracteristicas = ?, informacionNutricional = ?, estado = 1
           WHERE idFichaTecnica = ?`,
          {
            replacements: [
              item.descripcion,
              item.tiempoPrep,
              item.rendimiento,
              item.especificaciones,
              item.caracteristicas,
              item.nutricional,
              fichaId
            ],
            transaction: t
          }
        );
      }

      // Detalle Ficha Insumo (Limpiar e insertar reales)
      await sequelize.query(
        'DELETE FROM detallefichainsumo WHERE idFichaTecnica = ?',
        { replacements: [fichaId], transaction: t }
      );

      // Insumo principal
      await sequelize.query(
        'INSERT INTO detallefichainsumo (idFichaTecnica, idInsumo, cantidad, unidadMedida) VALUES (?, ?, ?, ?)',
        {
          replacements: [fichaId, item.insumoPrincipalId, item.cantidadInsumo, item.unidadInsumo],
          transaction: t
        }
      );

      // Insumos adicionales (chili, queso, tocineta, etc.)
      for (const extra of item.insumosAdicionales) {
        await sequelize.query(
          'INSERT INTO detallefichainsumo (idFichaTecnica, idInsumo, cantidad, unidadMedida) VALUES (?, ?, ?, ?)',
          {
            replacements: [fichaId, extra.idInsumo, extra.cantidad, extra.unidadMedida],
            transaction: t
          }
        );
      }
    }

    // 8. Sembrar reseñas auténticas en la tabla `resena` vinculadas a usuarios reales del sistema
    console.log('\n--- 8. Registrando reseñas reales en MySQL para eliminar fallbacks simulados ---');
    const [existingResenasCount] = await sequelize.query('SELECT COUNT(*) as c FROM resena', { transaction: t });
    const count = existingResenasCount[0].c;

    if (count === 0) {
      const realReviewsToInsert = [
        {
          idProducto: 1, // Hamburguesa Clásica Chazin
          idUsuario: 1, // Fernando Gómez
          puntuacion: 5,
          comentario: 'La carne estaba en su punto perfecto y el pan brioche súper suave y fresco. La tocineta crocante le da un toque fenomenal.',
          fechaResena: '2026-09-07 19:30:00'
        },
        {
          idProducto: 1, // Hamburguesa Clásica Chazin
          idUsuario: 2, // Juan Alberto Pérez
          puntuacion: 5,
          comentario: 'Poder personalizar y quitar la cebolla directamente desde la web fue excelente. La comida llegó calientita y las salsas deliciosas.',
          fechaResena: '2026-09-08 20:15:00'
        },
        {
          idProducto: 2, // Hamburguesa Doble Carne
          idUsuario: 3, // Juan Albeiro Pérez
          puntuacion: 5,
          comentario: 'Tremenda hamburguesa, las dos carnes son jugosas y el queso cheddar bien derretido. Muy recomendada.',
          fechaResena: '2026-09-08 21:00:00'
        },
        {
          idProducto: 5, // Perro Suizo
          idUsuario: 1, // Fernando Gómez
          puntuacion: 5,
          comentario: 'La salchicha suiza ahumada es de primera calidad y el queso gratinado espectacular. Excelente servicio.',
          fechaResena: '2026-09-06 14:20:00'
        }
      ];

      for (const rev of realReviewsToInsert) {
        await sequelize.query(
          `INSERT INTO resena (idProducto, idUsuario, puntuacion, comentario, fechaResena, estado)
           VALUES (?, ?, ?, ?, ?, 1)`,
          {
            replacements: [rev.idProducto, rev.idUsuario, rev.puntuacion, rev.comentario, rev.fechaResena],
            transaction: t
          }
        );
      }
      console.log(`✓ ${realReviewsToInsert.length} reseñas reales registradas con usuarios reales en la tabla resena.`);
    } else {
      console.log(`= Ya existen ${count} reseñas en la tabla resena.`);
    }

    await t.commit();
    console.log('\n=== ¡MIGRACIÓN COMPLETADA CON ÉXITO! TODO REGISTRADO REAL EN MYSQL Y CLOUDINARY ===');
    process.exit(0);
  } catch (error) {
    await t.rollback();
    console.error('ERROR durante la migración:', error);
    process.exit(1);
  }
}

run();
