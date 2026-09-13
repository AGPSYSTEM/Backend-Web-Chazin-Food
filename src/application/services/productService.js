const { Product, CategoriaProducto, Evento, Variante, FichaTecnica, DetalleFichaInsumo, Insumo } = require('../../persistence/models');

function convertUnits(amount, fromUnit, toUnit) {
  if (!amount || isNaN(amount)) return 0;
  if (!fromUnit || !toUnit) return Number(amount);

  const from = String(fromUnit).toLowerCase().trim();
  const to = String(toUnit).toLowerCase().trim();

  if (from === to) return Number(amount);

  // Normalizar masa / peso
  const isKg = (u) => u.includes('kg') || u.includes('kilo');
  const isGr = (u) => u.includes('gr') || u.includes('gram');
  const isMg = (u) => u.includes('mg') || u.includes('miligram');

  // Normalizar volumen / liquidos
  const isLt = (u) => u.includes('lt') || u.includes('litro');
  const isMl = (u) => u.includes('ml') || u.includes('mililitro') || u.includes('cc');

  // Conversiones peso
  if (isKg(from) && isGr(to)) return Number(amount) * 1000;
  if (isGr(from) && isKg(to)) return Number(amount) / 1000;
  if (isKg(from) && isMg(to)) return Number(amount) * 1000000;
  if (isMg(from) && isKg(to)) return Number(amount) / 1000000;
  if (isGr(from) && isMg(to)) return Number(amount) * 1000;
  if (isMg(from) && isGr(to)) return Number(amount) / 1000;

  // Conversiones volumen
  if (isLt(from) && isMl(to)) return Number(amount) * 1000;
  if (isMl(from) && isLt(to)) return Number(amount) / 1000;

  return Number(amount);
}

function calculateProductStock(ficha) {
  if (!ficha || !Array.isArray(ficha.detalles) || ficha.detalles.length === 0) {
    return {
      stock: 50,
      stockDisponible: 50,
      hasFicha: false,
      insumosCriticos: []
    };
  }

  let minPortions = Infinity;
  const insumosCriticos = [];

  for (const d of ficha.detalles) {
    const rawCantRequerida = Number(d.cantidad || 0);
    const recipeUnit = d.unidadMedida || d.insumo?.unidadMedida || 'und';
    const insumoUnit = d.insumo?.unidadMedida || recipeUnit;
    const insumoStock = Number(d.insumo?.stock || 0);

    // Convertir la cantidad requerida de la receta a la unidad de medida del inventario
    const cantRequeridaEnInsumoUnit = convertUnits(rawCantRequerida, recipeUnit, insumoUnit);

    if (cantRequeridaEnInsumoUnit > 0) {
      const portionsFloat = Number((insumoStock / cantRequeridaEnInsumoUnit).toFixed(6));
      const portionsFromThisInsumo = Math.floor(portionsFloat);
      if (portionsFromThisInsumo < minPortions) {
        minPortions = portionsFromThisInsumo;
      }
      if (portionsFromThisInsumo <= 5) {
        insumosCriticos.push({
          idInsumo: d.idInsumo,
          nombre: d.insumo?.nombre || `Insumo #${d.idInsumo}`,
          stockActual: insumoStock,
          unidadMedida: insumoUnit,
          cantidadRequerida: rawCantRequerida,
          unidadReceta: recipeUnit,
          porcionesPosibles: portionsFromThisInsumo
        });
      }
    }
  }

  const finalStock = minPortions === Infinity ? 50 : Math.max(0, minPortions);
  return {
    stock: finalStock,
    stockDisponible: finalStock,
    hasFicha: true,
    insumosCriticos
  };
}

function formatActiveEventos(rawEventos, now = new Date()) {
  if (!Array.isArray(rawEventos)) return [];
  return rawEventos
    .filter((e) => {
      if (e.estado !== 1 && e.estado !== 'Activo') return false;
      if (e.fechaFin) {
        const finDate = new Date(`${e.fechaFin}T23:59:59`);
        if (now > finDate) return false; // Expirado
      }
      if (e.fechaInicio) {
        const inicioDate = new Date(`${e.fechaInicio}T00:00:00`);
        if (now < inicioDate) return false; // Programado / Aún no inicia
      }
      return true;
    })
    .map((e) => {
      let diasRestantes = null;
      let horasRestantes = null;
      if (e.fechaFin) {
        const finDate = new Date(`${e.fechaFin}T23:59:59`);
        const ms = finDate.getTime() - now.getTime();
        diasRestantes = Math.ceil(ms / (1000 * 60 * 60 * 24));
        horasRestantes = Math.max(0, Math.floor(ms / (1000 * 60 * 60)));
      }
      const label =
        diasRestantes === null
          ? 'Permanente'
          : diasRestantes === 1
          ? `¡Último día! (${horasRestantes}h)`
          : diasRestantes === 0
          ? '¡Termina hoy!'
          : `Quedan ${diasRestantes} días`;

      return {
        id: e.idEvento,
        idEvento: e.idEvento,
        idProducto: e.idProducto,
        tipoEvento: e.tipoEvento,
        descuento: e.descuento,
        nuevoPrecio: e.nuevoPrecio,
        nombreEvento: e.nombreEvento,
        descripcion: e.descripcion,
        fechaInicio: e.fechaInicio,
        fechaFin: e.fechaFin,
        estado: e.estado,
        accionInsumo: e.accionInsumo || null,
        insumosAsociados: e.insumosAsociados ? (typeof e.insumosAsociados === 'string' ? JSON.parse(e.insumosAsociados) : e.insumosAsociados) : [],
        productosAsociados: e.productosAsociados ? (typeof e.productosAsociados === 'string' ? JSON.parse(e.productosAsociados) : e.productosAsociados) : [],
        vigencia: {
          diasRestantes,
          horasRestantes,
          urgente: diasRestantes !== null && diasRestantes <= 3,
          label
        }
      };
    });
}

function resolveComboConfig(rawConfig, prodName, catName) {
  let cfg = null;
  if (rawConfig) {
    try {
      cfg = typeof rawConfig === 'string' ? JSON.parse(rawConfig) : rawConfig;
    } catch (e) {
      cfg = null;
    }
  }

  const pLower = String(prodName || '').toLowerCase();
  const cLower = String(catName || '').toLowerCase();
  const isCombo = cLower.includes('combo') || pLower.includes('combo');

  if (cfg && typeof cfg === 'object' && cfg.esCombo !== undefined) {
    return {
      esCombo: Boolean(cfg.esCombo),
      cantidadBebidas: Math.max(1, Number(cfg.cantidadBebidas) || 1),
      bebidasPermitidas: Array.isArray(cfg.bebidasPermitidas) ? cfg.bebidasPermitidas : []
    };
  }

  // Fallback inteligente para combos de catálogo
  if (isCombo) {
    let cant = 1;
    if (pLower.includes('familiar') || pLower.includes('4 personas') || pLower.includes('4 pers')) {
      cant = 4;
    } else if (pLower.includes('pareja') || pLower.includes('amigos') || pLower.includes('2 personas') || pLower.includes('duo') || pLower.includes('dúo')) {
      cant = 2;
    }
    return {
      esCombo: true,
      cantidadBebidas: cant,
      bebidasPermitidas: []
    };
  }

  return {
    esCombo: false,
    cantidadBebidas: 0,
    bebidasPermitidas: []
  };
}

class ProductService {
  static async getProducts() {
    const { sequelize } = require('../../persistence/config/db');
    const [salesRows] = await sequelize.query(`
      SELECT v.idProducto, COALESCE(SUM(dvp.cantidad), 0) as totalVendidos
      FROM detalleventaproducto dvp
      JOIN variante v ON dvp.idVariante = v.idVariante
      GROUP BY v.idProducto
    `);
    const salesMap = {};
    for (const r of salesRows) {
      salesMap[r.idProducto] = Number(r.totalVendidos || 0);
    }

    const products = await Product.findAll({
      attributes: ['idProducto', 'idCategoriaProducto', 'nombre', 'descripcion', 'imagen', 'estado', 'precio', 'adiciones', 'configuracionCombo'],
      include: [
        { model: CategoriaProducto, as: 'categoriaProducto', attributes: ['idCategoriaProducto', 'nombre'] },
        { model: Variante, as: 'variantes', attributes: ['idVariante', 'nombre', 'precio'] },
        { model: Evento, as: 'eventos', required: false, where: { estado: 1 } },
        {
          model: FichaTecnica,
          as: 'fichaTecnica',
          required: false,
          where: { estado: 1 },
          include: [
            {
              model: DetalleFichaInsumo,
              as: 'detalles',
              include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'stock', 'stockMinimo', 'unidadMedida', 'precioUnitario', 'estado'] }]
            }
          ]
        }
      ]
    });

    const now = new Date();
    return products
      .filter(p => p.idProducto !== 0 && !p.nombre?.startsWith('__SISTEMA'))
      .map(p => {
        let adiciones = [];
        try {
          adiciones = typeof p.adiciones === 'string' ? JSON.parse(p.adiciones) : (p.adiciones || []);
        } catch (e) {
          adiciones = [];
        }

        const primeraVariante = Array.isArray(p.variantes) && p.variantes.length > 0 ? p.variantes[0] : null;
        const realPrecio = p.precio !== undefined && p.precio !== null && parseFloat(p.precio) > 0
          ? parseFloat(p.precio)
          : (primeraVariante ? parseFloat(primeraVariante.precio || 0) : 0);

        const variantes = Array.isArray(p.variantes) && p.variantes.length > 0
          ? p.variantes.map(v => ({ id: v.idVariante, idVariante: v.idVariante, nombre: v.nombre, precio: parseFloat(v.precio || 0) }))
          : [{ id: p.idProducto, idVariante: p.idProducto, nombre: p.nombre, precio: realPrecio }];

        const stockInfo = calculateProductStock(p.fichaTecnica);
        const realVentas = Number(salesMap[p.idProducto] || 0);

        return {
          _id: p.idProducto,
          id: p.idProducto,
          idProducto: p.idProducto,
          nombre: p.nombre,
          precio: realPrecio,
          descripcion: p.descripcion || '',
          imagen: p.imagen || '',
          idCategoriaProducto: p.idCategoriaProducto,
          categoriaId: p.idCategoriaProducto,
          categoria: p.categoriaProducto ? p.categoriaProducto.nombre : '',
          estado: p.estado === 1 ? 'Activo' : 'Inactivo',
          stock: stockInfo.stock,
          stockDisponible: stockInfo.stockDisponible,
          hasFicha: stockInfo.hasFicha,
          insumosCriticos: stockInfo.insumosCriticos,
          variantes,
          adiciones,
          configuracionCombo: resolveComboConfig(p.configuracionCombo, p.nombre, p.categoriaProducto?.nombre || p.categoria),
          eventos: formatActiveEventos(p.eventos, now),
          ventas: realVentas,
          totalVendidos: realVentas
        };
      });
  }

  static async getProductById(id) {
    const { sequelize } = require('../../persistence/config/db');
    const [salesRows] = await sequelize.query(`
      SELECT COALESCE(SUM(dvp.cantidad), 0) as totalVendidos
      FROM detalleventaproducto dvp
      JOIN variante v ON dvp.idVariante = v.idVariante
      WHERE v.idProducto = ?
    `, { replacements: [id] });
    const realVentas = salesRows.length > 0 ? Number(salesRows[0].totalVendidos || 0) : 0;

    const p = await Product.findByPk(id, {
      attributes: ['idProducto', 'idCategoriaProducto', 'nombre', 'descripcion', 'imagen', 'estado', 'precio', 'adiciones', 'configuracionCombo'],
      include: [
        { model: CategoriaProducto, as: 'categoriaProducto', attributes: ['idCategoriaProducto', 'nombre'] },
        { model: Variante, as: 'variantes', attributes: ['idVariante', 'nombre', 'precio'] },
        { model: Evento, as: 'eventos', required: false, where: { estado: 1 } },
        {
          model: FichaTecnica,
          as: 'fichaTecnica',
          required: false,
          where: { estado: 1 },
          include: [
            {
              model: DetalleFichaInsumo,
              as: 'detalles',
              include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'stock', 'stockMinimo', 'unidadMedida', 'precioUnitario', 'estado'] }]
            }
          ]
        }
      ]
    });
    if (!p) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }

    let adiciones = [];
    try {
      adiciones = typeof p.adiciones === 'string' ? JSON.parse(p.adiciones) : (p.adiciones || []);
    } catch (e) {
      adiciones = [];
    }

    const primeraVariante = Array.isArray(p.variantes) && p.variantes.length > 0 ? p.variantes[0] : null;
    const realPrecio = p.precio !== undefined && p.precio !== null && parseFloat(p.precio) > 0
      ? parseFloat(p.precio)
      : (primeraVariante ? parseFloat(primeraVariante.precio || 0) : 0);

    const variantes = Array.isArray(p.variantes) && p.variantes.length > 0
      ? p.variantes.map(v => ({ id: v.idVariante, idVariante: v.idVariante, nombre: v.nombre, precio: parseFloat(v.precio || 0) }))
      : [{ id: p.idProducto, idVariante: p.idProducto, nombre: p.nombre, precio: realPrecio }];

    const stockInfo = calculateProductStock(p.fichaTecnica);

    return {
      _id: p.idProducto,
      id: p.idProducto,
      idProducto: p.idProducto,
      nombre: p.nombre,
      precio: realPrecio,
      descripcion: p.descripcion || '',
      imagen: p.imagen || '',
      idCategoriaProducto: p.idCategoriaProducto,
      categoriaId: p.idCategoriaProducto,
      categoria: p.categoriaProducto ? p.categoriaProducto.nombre : '',
      estado: p.estado === 1 ? 'Activo' : 'Inactivo',
      stock: stockInfo.stock,
      stockDisponible: stockInfo.stockDisponible,
      hasFicha: stockInfo.hasFicha,
      insumosCriticos: stockInfo.insumosCriticos,
      variantes,
      adiciones,
      configuracionCombo: resolveComboConfig(p.configuracionCombo, p.nombre, p.categoriaProducto?.nombre || p.categoria),
      eventos: formatActiveEventos(p.eventos, new Date()),
      ventas: realVentas,
      totalVendidos: realVentas
    };
  }

  static async createProduct(data) {
    const { nombre, precio, descripcion, imagen, categoria, adiciones, idCategoriaProducto, estado, configuracionCombo } = data;
    if (!nombre || !nombre.trim()) {
      const error = new Error('El nombre del producto es obligatorio');
      error.statusCode = 400;
      throw error;
    }

    const existing = await Product.findOne({ where: { nombre: nombre.trim() } });
    if (existing) {
      const error = new Error('Ya existe un producto registrado con ese nombre');
      error.statusCode = 400;
      throw error;
    }

    const normalizedCategoria = typeof categoria === 'string' ? categoria.trim() : '';
    let resolvedCatId = idCategoriaProducto;

    if (!resolvedCatId && normalizedCategoria) {
      const catObj = await CategoriaProducto.findOne({ where: { nombre: normalizedCategoria } });
      if (catObj) resolvedCatId = catObj.idCategoriaProducto;
    }

    if (!resolvedCatId) {
      const firstCat = await CategoriaProducto.findOne();
      resolvedCatId = firstCat ? firstCat.idCategoriaProducto : 1;
    }

    const normalizedEstado = estado === 'Inactivo' || estado === 0 || estado === '0' ? 0 : 1;

    const product = await Product.create({
      idCategoriaProducto: resolvedCatId,
      nombre: nombre.trim(),
      descripcion: descripcion || '',
      imagen: imagen || '',
      categoria: categoria || '',
      estado: normalizedEstado,
      adiciones: adiciones ? JSON.stringify(adiciones) : '[]',
      configuracionCombo: configuracionCombo ? (typeof configuracionCombo === 'object' ? JSON.stringify(configuracionCombo) : configuracionCombo) : null
    });

    if (precio !== undefined && precio !== null && precio !== '') {
      await Variante.create({
        idProducto: product.idProducto,
        nombre: `${nombre.trim()} - base`,
        precio: Number(precio) || 0,
        estado: normalizedEstado
      });
    }

    return this.getProductById(product.idProducto);
  }

  static async updateProduct(id, data) {
    const p = await Product.findByPk(id);
    if (!p) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const { nombre, precio, descripcion, imagen, categoria, adiciones, estado, idCategoriaProducto, configuracionCombo } = data;

    // Si la imagen se actualiza o se quita, y existía una imagen previa en Cloudinary, eliminarla
    if (imagen !== undefined && p.imagen && p.imagen !== imagen) {
      const { deleteImage } = require('../../infrastructure/services/cloudinaryService');
      deleteImage(p.imagen).catch((err) => console.warn('⚠️ Error al eliminar imagen anterior de producto:', err.message));
    }

    if (nombre !== undefined) p.nombre = nombre.trim();
    if (descripcion !== undefined) p.descripcion = descripcion;
    if (imagen !== undefined) p.imagen = imagen;
    if (estado !== undefined) {
      p.estado = estado === 'Activo' || estado === 1 ? 1 : 0;
    }

    if (idCategoriaProducto) {
      p.idCategoriaProducto = idCategoriaProducto;
    } else if (categoria !== undefined && categoria !== null && categoria !== '') {
      const catObj = await CategoriaProducto.findOne({ where: { nombre: categoria } });
      if (catObj) p.idCategoriaProducto = catObj.idCategoriaProducto;
    }

    if (adiciones !== undefined) p.adiciones = JSON.stringify(adiciones);
    if (configuracionCombo !== undefined) {
      p.configuracionCombo = typeof configuracionCombo === 'object' ? JSON.stringify(configuracionCombo) : configuracionCombo;
    }

    await p.save();

    if (precio !== undefined && precio !== null && precio !== '') {
      let variante = await Variante.findOne({ where: { idProducto: id } });
      if (!variante) {
        variante = await Variante.create({
          idProducto: id,
          nombre: `${p.nombre} - base`,
          precio: Number(precio) || 0,
          estado: 1
        });
      } else {
        variante.precio = Number(precio) || 0;
        await variante.save();
      }
    }

    return this.getProductById(id);
  }

  static async deleteProduct(id) {
    const p = await Product.findByPk(id);
    if (!p) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const imagenAEliminar = p.imagen;

    const { sequelize } = require('../../persistence/config/db');
    const t = await sequelize.transaction();

    try {
      // 1. Eliminar reseñas asociadas
      await sequelize.query('DELETE FROM resena WHERE idProducto = ?', {
        replacements: [id],
        transaction: t
      });

      // 2. Eliminar descuentos vinculados a eventos de este producto
      await sequelize.query(
        'DELETE FROM descuento WHERE idEvento IN (SELECT idEvento FROM evento WHERE idProducto = ?)',
        { replacements: [id], transaction: t }
      );

      // 3. Eliminar eventos asociados al producto
      await sequelize.query('DELETE FROM evento WHERE idProducto = ?', {
        replacements: [id],
        transaction: t
      });

      // 4. Eliminar detalles de fichas técnicas y fichas técnicas del producto
      await sequelize.query(
        'DELETE FROM detallefichainsumo WHERE idFichaTecnica IN (SELECT idFichaTecnica FROM fichatecnica WHERE idProducto = ?)',
        { replacements: [id], transaction: t }
      );
      await sequelize.query('DELETE FROM fichatecnica WHERE idProducto = ?', {
        replacements: [id],
        transaction: t
      });

      // 5. Eliminar registros de detalle de venta asociados a las variantes de este producto
      await sequelize.query(
        'DELETE FROM detalleventaproducto WHERE idVariante IN (SELECT idVariante FROM variante WHERE idProducto = ?)',
        { replacements: [id], transaction: t }
      );

      // 6. Eliminar variantes del producto (resuelve la restricción variante_ibfk_1)
      await sequelize.query('DELETE FROM variante WHERE idProducto = ?', {
        replacements: [id],
        transaction: t
      });

      // 7. Eliminar el producto de forma definitiva
      await sequelize.query('DELETE FROM producto WHERE idProducto = ?', {
        replacements: [id],
        transaction: t
      });

      await t.commit();

      // Eliminar imagen de Cloudinary si existía
      if (imagenAEliminar) {
        const { deleteImage } = require('../../infrastructure/services/cloudinaryService');
        deleteImage(imagenAEliminar).catch((err) => console.warn('⚠️ Error al eliminar imagen de Cloudinary del producto borrado:', err.message));
      }

      const { resetAutoIncrement } = require('../../infrastructure/utils/dbUtils');
      await resetAutoIncrement('producto', 'idProducto');
      await resetAutoIncrement('variante', 'idVariante');

      return { success: true, message: 'Producto eliminado correctamente' };
    } catch (err) {
      await t.rollback();
      console.error('Error al eliminar producto en cascada:', err);
      throw err;
    }
  }
}

module.exports = ProductService;
