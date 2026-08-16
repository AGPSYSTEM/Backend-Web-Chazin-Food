const { Product, CategoriaProducto, Evento, Variante } = require('../../persistence/models');

class ProductService {
  static async getProducts() {
    const products = await Product.findAll({
      attributes: ['idProducto', 'idCategoriaProducto', 'nombre', 'descripcion', 'imagen', 'estado', 'precio', 'adiciones'],
      include: [
        { model: CategoriaProducto, as: 'categoriaProducto', attributes: ['idCategoriaProducto', 'nombre'] },
        { model: Variante, as: 'variantes', attributes: ['idVariante', 'nombre', 'precio'] },
        { model: Evento, as: 'eventos', required: false, where: { estado: 1 } }
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
        { model: Evento, as: 'eventos', required: false, where: { estado: 1 } }
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
