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

class ProductService {
  static async getProducts() {
    const products = await Product.findAll({
      attributes: ['idProducto', 'idCategoriaProducto', 'nombre', 'descripcion', 'imagen', 'estado', 'precio', 'adiciones'],
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
              include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'stock', 'stockMinimo', 'unidadMedida', 'estado'] }]
            }
          ]
        }
      ]
    });

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
          eventos: p.eventos || []
        };
      });
  }

  static async getProductById(id) {
    const p = await Product.findByPk(id, {
      attributes: ['idProducto', 'idCategoriaProducto', 'nombre', 'descripcion', 'imagen', 'estado', 'precio', 'adiciones'],
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
              include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'stock', 'stockMinimo', 'unidadMedida', 'estado'] }]
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
      eventos: p.eventos || []
    };
  }

  static async createProduct(data) {
    const { nombre, precio, descripcion, imagen, categoria, adiciones, idCategoriaProducto, estado } = data;
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
      adiciones: adiciones ? JSON.stringify(adiciones) : '[]'
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

    const { nombre, precio, descripcion, imagen, categoria, adiciones, estado, idCategoriaProducto } = data;
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

    // Delete associated ficha técnica and its details
    const { FichaTecnica, DetalleFichaInsumo } = require('../../persistence/models');
    const ficha = await FichaTecnica.findOne({ where: { idProducto: id } });
    if (ficha) {
      await DetalleFichaInsumo.destroy({ where: { idFichaTecnica: ficha.idFichaTecnica } });
      await ficha.destroy();
    }

    await p.destroy();
    const { resetAutoIncrement } = require('../../infrastructure/utils/dbUtils');
    await resetAutoIncrement('producto', 'idProducto');
    return { message: 'Producto eliminado correctamente' };
  }
}

module.exports = ProductService;
