/**
 * Script de Auditoría y Limpieza de Imágenes Huérfanas en Cloudinary
 * 
 * Uso:
 *   node scripts/cleanup_orphan_cloudinary_images.js           -> Modo auditoría (--dry-run por defecto)
 *   node scripts/cleanup_orphan_cloudinary_images.js --force   -> Modo eliminación definitiva de imágenes basura
 */

const dotenv = require('dotenv');
dotenv.config();

const { sequelize, Product, CategoriaProducto, Adicion } = require('../src/persistence/models');
const cloudinary = require('../src/infrastructure/config/cloudinary');
const { extractPublicId } = require('../src/infrastructure/services/cloudinaryService');

async function runCleanup() {
  const isForce = process.argv.includes('--force') || process.argv.includes('--delete');

  console.log('\n===============================================================');
  console.log('🧹 AUDITORÍA Y LIMPIEZA DE IMÁGENES HUÉRFANAS EN CLOUDINARY');
  console.log(`Modo: ${isForce ? '⚠️ ELIMINACIÓN REAL (--force)' : '🔍 REPORTE Y AUDITORÍA (--dry-run)'}`);
  console.log('===============================================================\n');

  const config = cloudinary.config();
  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    console.error('❌ ERROR: Faltan credenciales de Cloudinary en Backend .env');
    console.error('Asegúrate de tener configurado:');
    console.error('  CLOUDINARY_CLOUD_NAME=dckwtknmq');
    console.error('  CLOUDINARY_API_KEY=tu_api_key');
    console.error('  CLOUDINARY_API_SECRET=tu_api_secret\n');
    process.exit(1);
  }

  try {
    // 1. Obtener todas las imágenes válidas en la base de datos
    console.log('1️⃣ Consultando imágenes activas registradas en MySQL...');
    const [productos] = await sequelize.query("SELECT imagen FROM producto WHERE imagen IS NOT NULL AND imagen != ''");
    const [categorias] = await sequelize.query("SELECT icon FROM categoriaproducto WHERE icon IS NOT NULL AND icon != ''");
    const [adiciones] = await sequelize.query("SELECT imagen FROM adicion WHERE imagen IS NOT NULL AND imagen != ''");

    const activePublicIds = new Set();

    const registerUrl = (url) => {
      const pid = extractPublicId(url);
      if (pid) activePublicIds.add(pid);
    };

    productos.forEach(p => registerUrl(p.imagen));
    categorias.forEach(c => registerUrl(c.icon));
    adiciones.forEach(a => registerUrl(a.imagen));

    console.log(`   ✓ Total de imágenes registradas en uso en MySQL: ${activePublicIds.size}`);
    console.log(`     - Productos: ${productos.length}`);
    console.log(`     - Categorías: ${categorias.length}`);
    console.log(`     - Adiciones: ${adiciones.length}\n`);

    // 2. Obtener lista de recursos en Cloudinary
    console.log('2️⃣ Consultando archivos almacenados en la cuenta de Cloudinary...');
    let allCloudinaryAssets = [];
    let nextCursor = null;

    do {
      const res = await cloudinary.api.resources({
        type: 'upload',
        max_results: 500,
        next_cursor: nextCursor
      });
      allCloudinaryAssets = allCloudinaryAssets.concat(res.resources || []);
      nextCursor = res.next_cursor;
    } while (nextCursor);

    console.log(`   ✓ Total de archivos encontrados en Cloudinary: ${allCloudinaryAssets.length}\n`);

    // 3. Identificar imágenes huérfanas / basura
    const includeSamples = process.argv.includes('--include-samples');
    const isSample = (id) => id.startsWith('samples/') || id.startsWith('cld-sample') || id === 'sample';

    const orphanAssets = allCloudinaryAssets.filter(asset => {
      if (!includeSamples && isSample(asset.public_id)) return false;
      return !activePublicIds.has(asset.public_id);
    });
    const totalOrphanBytes = orphanAssets.reduce((sum, a) => sum + (a.bytes || 0), 0);
    const totalOrphanMB = (totalOrphanBytes / (1024 * 1024)).toFixed(2);

    console.log('3️⃣ Resultados de la auditoría:');
    console.log(`   - Imágenes activas y preservadas: ${allCloudinaryAssets.length - orphanAssets.length}`);
    console.log(`   - Imágenes huérfanas / basura detectadas: ${orphanAssets.length} (${totalOrphanMB} MB)\n`);

    if (orphanAssets.length === 0) {
      console.log('🎉 ¡Tu cuenta de Cloudinary está 100% limpia! No se detectaron imágenes basura.');
      process.exit(0);
    }

    console.log('📋 Lista de imágenes huérfanas:');
    orphanAssets.forEach((a, i) => {
      console.log(`   [${i + 1}] ${a.public_id}.${a.format} (${(a.bytes / 1024).toFixed(1)} KB) - ${a.secure_url}`);
    });

    // 4. Si es modo force, proceder a eliminarlas
    if (isForce) {
      console.log('\n4️⃣ Eliminando imágenes basura en Cloudinary...');
      let deletedCount = 0;
      let failedCount = 0;

      for (const asset of orphanAssets) {
        try {
          const delRes = await cloudinary.uploader.destroy(asset.public_id, { invalidate: true });
          if (delRes.result === 'ok' || delRes.result === 'not found') {
            deletedCount++;
            console.log(`   ✓ Eliminada: ${asset.public_id}`);
          } else {
            failedCount++;
            console.warn(`   ⚠️ Falló: ${asset.public_id} (${delRes.result})`);
          }
        } catch (delErr) {
          failedCount++;
          console.error(`   ❌ Error eliminando ${asset.public_id}:`, delErr.message);
        }
      }

      console.log('\n===============================================================');
      console.log(`✅ LIMPIEZA FINALIZADA: ${deletedCount} imágenes eliminadas (${totalOrphanMB} MB liberados).`);
      if (failedCount > 0) console.log(`⚠️ ${failedCount} imágenes no pudieron ser eliminadas.`);
      console.log('===============================================================\n');
    } else {
      console.log('\n💡 NOTA: Estás en modo auditoría (--dry-run). No se eliminó ningún archivo.');
      console.log('Para eliminar definitivamente estas imágenes basura, ejecuta:');
      console.log('   node scripts/cleanup_orphan_cloudinary_images.js --force\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n💥 Error durante la ejecución del script:', error.message);
    process.exit(1);
  }
}

runCleanup();
