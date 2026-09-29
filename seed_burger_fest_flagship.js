const fs = require('fs');
const path = require('path');
const { Product, Variante, FichaTecnica, DetalleFichaInsumo, Evento } = require('./src/persistence/models');

const IMAGE_PATH = 'C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\5d7744af-857f-4453-82f3-6a48da5ec30b\\burger_fest_evento_1789010680238.jpg';

async function uploadToCloudinary(filePath) {
  console.log('Uploading photo to Cloudinary...', filePath);
  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
  const formData = new FormData();
  formData.append('file', blob, 'burger_fest_trufada.jpg');
  formData.append('upload_preset', 'chazin_food_preset');

  const res = await fetch('https://api.cloudinary.com/v1_1/dckwtknmq/image/upload', {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  console.log('Cloudinary upload success! URL:', json.secure_url);
  return json.secure_url;
}

async function run() {
  try {
    let imageUrl = '';
    if (fs.existsSync(IMAGE_PATH)) {
      imageUrl = await uploadToCloudinary(IMAGE_PATH);
    } else {
      console.warn('Image not found at path, skipping upload');
    }

    // 1. Check if Burger Fest Product already exists
    let prod = await Product.findOne({
      where: { nombre: 'Hamburguesa Burger Fest Trufada Chazin (Edición Especial)' }
    });

    if (!prod) {
      console.log('Creating flagship Burger Fest product...');
      prod = await Product.create({
        idCategoriaProducto: 3, // Hamburguesas
        nombre: 'Hamburguesa Burger Fest Trufada Chazin (Edición Especial)',
        descripcion: 'Creada exclusivamente para el Burger Fest 2026. 180g de carne angus madurada a la parrilla, queso gouda ahumado fundido, reducción de cebolla al vino tinto, tocineta crocante caramelizada en maple y nuestra legendaria mayonesa trufada en pan brioche dorado artesanal.',
        precio: 28000.00, // Precio normal de carta
        imagen: imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80',
        adiciones: '[]',
        estado: 1
      });
      console.log('Created product ID:', prod.idProducto);

      // Create Variante
      const variante = await Variante.create({
        idProducto: prod.idProducto,
        nombre: 'Edición Especial Burger Fest',
        precio: 24000.00, // Precio conmemorativo
        estado: 1
      });
      console.log('Created variante ID:', variante.idVariante);

      // Create Ficha Técnica
      const ficha = await FichaTecnica.create({
        idProducto: prod.idProducto,
        idVariante: variante.idVariante,
        tipo: 'PRODUCTO',
        descripcion: 'Ficha técnica oficial de preparación para Burger Fest 2026',
        procedimiento: '1. Sellar la carne angus 180g a la parrilla por 3 min por lado a término medio-jugoso.\n2. Fundir queso gouda ahumado sobre la carne.\n3. Tostar pan brioche con mantequilla artesanal.\n4. Untar mayonesa trufada en ambas caras del pan.\n5. Montar cebolla al vino tinto y tocineta crocante en maple.\n6. Servir caliente en empaque conmemorativo del Burger Fest.',
        tiempoPreparacion: 14,
        rendimiento: '1 hamburguesa gourmet',
        estado: 1
      });
      console.log('Created ficha técnica ID:', ficha.idFichaTecnica);

      // Vincular insumos reales para cálculo de stock
      await DetalleFichaInsumo.create({
        idFichaTecnica: ficha.idFichaTecnica,
        idInsumo: 12, // Pan Brioche Artesanal
        cantidad: 1,
        unidadMedida: 'und'
      });
      await DetalleFichaInsumo.create({
        idFichaTecnica: ficha.idFichaTecnica,
        idInsumo: 14, // Carne de Res Molida 80/20
        cantidad: 0.18,
        unidadMedida: 'kg'
      });
      console.log('Insumos vinculados a la ficha técnica.');
    } else {
      console.log('Product already exists with ID:', prod.idProducto);
      if (imageUrl) {
        prod.imagen = imageUrl;
        await prod.save();
        console.log('Updated product image URL.');
      }
    }

    // 2. Create or update Evento for Burger Fest
    let eventoFest = await Evento.findOne({
      where: { idProducto: prod.idProducto }
    });

    if (!eventoFest) {
      console.log('Creating Event for Burger Fest...');
      eventoFest = await Evento.create({
        nombreEvento: 'Chazin Burger Fest 2026 - Edición Limitada',
        descripcion: 'Participante oficial en el festival gastronómico del año. Receta conmemorativa de tiempo limitado con $4.000 de ahorro directo, pan brioche artesanal y salsa trufada secreta.',
        idProducto: prod.idProducto,
        tipoEvento: 'EDICION_LIMITADA',
        descuento: 14.28,
        nuevoPrecio: 24000.00,
        fechaInicio: '2026-09-01',
        fechaFin: '2026-10-31',
        estado: 1
      });
      console.log('Created Evento Fest ID:', eventoFest.idEvento);
    } else {
      console.log('Evento Fest already exists with ID:', eventoFest.idEvento);
      eventoFest.nuevoPrecio = 24000.00;
      eventoFest.descuento = 14.28;
      eventoFest.fechaInicio = '2026-09-01';
      eventoFest.fechaFin = '2026-10-31';
      eventoFest.estado = 1;
      await eventoFest.save();
    }

    // 3. Link Evento 4 (Combo Pareja Festivo) to Product 7 (Combo Pareja Chazin)
    const ev4 = await Evento.findByPk(4);
    if (ev4) {
      ev4.idProducto = 7;
      ev4.nuevoPrecio = 34000.00;
      ev4.descuento = 10.52;
      ev4.fechaInicio = '2026-09-01';
      ev4.fechaFin = '2026-10-31';
      ev4.estado = 1;
      await ev4.save();
      console.log('Linked Evento 4 to Product 7 (Combo Pareja Chazin).');
    }

    console.log('FLAGSHIP SEED COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('Error in seed_burger_fest_flagship:', err);
    process.exit(1);
  }
}

run();
