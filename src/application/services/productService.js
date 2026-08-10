const { Product, CategoriaProducto } = require('../../persistence/models');

class ProductService {
  static async getProducts() {
    const products = await Product.findAll({
      include: [{ model: CategoriaProducto, as: 'categoriaProducto', attributes: ['idCategoriaProducto', 'nombre'] }]
    });
    return products.map(p => {
      let adiciones = [];
      try {
        adiciones = typeof p.adiciones === 'string' ? JSON.parse(p.adiciones) : (p.adiciones || []);
      } catch (e) {
        adiciones = [];
      }
      return {
        _id: p.idProducto,
        id: p.idProducto,
        idProducto: p.idProducto,
        nombre: p.nombre,
        precio: parseFloat(p.precio || 0),
        descripcion: p.descripcion || '',
        imagen: p.imagen || '',
        stock: p.stock || 0,
        idCategoriaProducto: p.idCategoriaProducto,
        categoria: p.categoriaProducto ? p.categoriaProducto.nombre : (p.categoria || ''),
        estado: p.estado === 1 ? 'Activo' : 'Inactivo',
        adiciones
      };
    });
  }

  static async getProductById(id) {
    const p = await Product.findByPk(id, {
      include: [{ model: CategoriaProducto, as: 'categoriaProducto', attributes: ['idCategoriaProducto', 'nombre'] }]
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

    return {
      _id: p.idProducto,
      id: p.idProducto,
      idProducto: p.idProducto,
      nombre: p.nombre,
      precio: parseFloat(p.precio || 0),
      descripcion: p.descripcion || '',
      imagen: p.imagen || '',
      stock: p.stock || 0,
      idCategoriaProducto: p.idCategoriaProducto,
      categoria: p.categoriaProducto ? p.categoriaProducto.nombre : (p.categoria || ''),
      estado: p.estado === 1 ? 'Activo' : 'Inactivo',
      adiciones
    };
  }

  static async createProduct(data) {
    const { nombre, precio, descripcion, imagen, stock, categoria, adiciones, idCategoriaProducto } = data;
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

    // Resolve category ID
    let resolvedCatId = idCategoriaProducto;
    if (!resolvedCatId && categoria) {
      const catObj = await CategoriaProducto.findOne({ where: { nombre: categoria } });
      if (catObj) resolvedCatId = catObj.idCategoriaProducto;
    }
    if (!resolvedCatId) {
      const firstCat = await CategoriaProducto.findOne();
      resolvedCatId = firstCat ? firstCat.idCategoriaProducto : 1;
    }

    const product = await Product.create({
      idCategoriaProducto: resolvedCatId,
      nombre: nombre.trim(),
      precio: precio || 0,
      descripcion: descripcion || '',
      imagen: imagen || '',
      stock: stock || 0,
      categoria: categoria || '',
      adiciones: adiciones ? JSON.stringify(adiciones) : '[]'
    });

    return this.getProductById(product.idProducto);
  }

  static async updateProduct(id, data) {
    const p = await Product.findByPk(id);
    if (!p) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const { nombre, precio, descripcion, imagen, stock, categoria, adiciones, estado, idCategoriaProducto } = data;
    if (nombre !== undefined) p.nombre = nombre.trim();
    if (precio !== undefined) p.precio = precio;
    if (descripcion !== undefined) p.descripcion = descripcion;
    if (imagen !== undefined) p.imagen = imagen;
    if (stock !== undefined) p.stock = stock;
    if (estado !== undefined) {
      p.estado = estado === 'Activo' || estado === 1 ? 1 : 0;
    }

    if (idCategoriaProducto) {
      p.idCategoriaProducto = idCategoriaProducto;
    } else if (categoria !== undefined) {
      p.categoria = categoria;
      const catObj = await CategoriaProducto.findOne({ where: { nombre: categoria } });
      if (catObj) p.idCategoriaProducto = catObj.idCategoriaProducto;
    }

    if (adiciones !== undefined) p.adiciones = JSON.stringify(adiciones);

    await p.save();
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
