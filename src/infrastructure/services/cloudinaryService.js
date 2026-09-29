const cloudinary = require('../config/cloudinary');

/**
 * Extrae de forma precisa el public_id de un recurso de Cloudinary a partir de su URL.
 * Soporta versiones (v12345/), transformaciones (c_limit,w_1000/) y carpetas anidadas.
 * Devuelve null si la URL no corresponde a Cloudinary o no contiene un public_id válido.
 * 
 * @param {string} url - URL completa de la imagen
 * @returns {string|null} - public_id del asset o null
 */
function extractPublicId(url) {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return null;
  }

  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/');
    const uploadIdx = parts.indexOf('upload');
    if (uploadIdx === -1) return null;

    const rest = parts.slice(uploadIdx + 1);
    let publicIdParts = [];
    let versionFound = false;

    // Si existe segmento de versión v<número>, el public_id comienza inmediatamente después
    for (let i = 0; i < rest.length; i++) {
      if (/^v\d+$/.test(rest[i])) {
        versionFound = true;
        publicIdParts = rest.slice(i + 1);
        break;
      }
    }

    // Si no tiene versión, descartar posibles parámetros de transformación iniciales
    if (!versionFound) {
      if (rest[0] && (rest[0].includes(',') || /^[a-z]_[a-z0-9]+/i.test(rest[0]))) {
        publicIdParts = rest.slice(1);
      } else {
        publicIdParts = rest;
      }
    }

    if (publicIdParts.length === 0) return null;

    const fullPath = publicIdParts.join('/');
    // Quitar la extensión de archivo (.jpg, .png, .webp, etc.)
    return fullPath.replace(/\.[^/.]+$/, '');
  } catch (err) {
    return null;
  }
}

/**
 * Elimina una imagen de Cloudinary a partir de su URL o public_id.
 * Es completamente resiliente y seguro: si faltan credenciales o la URL no es de Cloudinary,
 * no lanza excepciones no controladas ni bloquea la base de datos.
 * 
 * @param {string} urlOrPublicId - URL completa o public_id de la imagen
 * @returns {Promise<{success: boolean, skipped?: boolean, reason?: string, result?: string, publicId?: string}>}
 */
async function deleteImage(urlOrPublicId) {
  if (!urlOrPublicId || typeof urlOrPublicId !== 'string') {
    return { success: false, skipped: true, reason: 'URL o public_id vacío' };
  }

  // Si parece una URL (contiene http/https), extraer el public_id
  let publicId = urlOrPublicId;
  if (urlOrPublicId.startsWith('http://') || urlOrPublicId.startsWith('https://')) {
    publicId = extractPublicId(urlOrPublicId);
    if (!publicId) {
      // Es una URL externa (Unsplash, local, emoji, etc.) -> no hacer nada
      return { success: false, skipped: true, reason: 'No es una URL de Cloudinary' };
    }
  }

  // Verificar credenciales mínimas configuradas en backend
  const config = cloudinary.config();
  if (!config.api_key || !config.api_secret || !config.cloud_name) {
    console.warn(
      `⚠️ [Cloudinary] No se pudo eliminar "${publicId}": falta configurar CLOUDINARY_API_KEY o CLOUDINARY_API_SECRET en Backend .env`
    );
    return {
      success: false,
      skipped: true,
      reason: 'Faltan credenciales CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET en Backend .env',
      publicId
    };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
    const isSuccess = result.result === 'ok' || result.result === 'not found';
    
    if (result.result === 'ok') {
      console.log(`✅ [Cloudinary] Imagen eliminada exitosamente: ${publicId}`);
    } else if (result.result === 'not found') {
      console.log(`ℹ️ [Cloudinary] La imagen no existía o ya había sido eliminada: ${publicId}`);
    } else {
      console.warn(`⚠️ [Cloudinary] Respuesta inesperada al eliminar ${publicId}:`, result);
    }

    return {
      success: isSuccess,
      result: result.result,
      publicId
    };
  } catch (error) {
    console.error(`❌ [Cloudinary] Error eliminando imagen ${publicId}:`, error.message);
    return {
      success: false,
      error: error.message,
      publicId
    };
  }
}

module.exports = {
  extractPublicId,
  deleteImage
};
