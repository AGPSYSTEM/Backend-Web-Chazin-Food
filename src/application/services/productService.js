const { Product } = require('../../persistence/models');

class ProductService {
  static async getProducts() {
    const products = await Product.findAll();
    return products.map(p => {
      let adiciones = [];
      try {
        adiciones = typeof p.adiciones === 'string' ? JSON.parse(p.adiciones) : (p.adiciones || []);
      } catch (e) {
        adiciones = [];
      }
      return {
        _id: p.id,
        id: p.id,
        nombre: p.nombre,
        precio: parseFloat(p.precio),
        descripcion: p.descripcion || '',
        imagen: p.imagen || '',
        stock: p.stock || 0,
        categoria: p.categoria || '',
        adiciones
      };
    });
  }

  static async getProductById(id) {
    const p = await Product.findByPk(id);
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
      _id: p.id,
      id: p.id,
      nombre: p.nombre,
      precio: parseFloat(p.precio),
      descripcion: p.descripcion || '',
      imagen: p.imagen || '',
      stock: p.stock || 0,
      categoria: p.categoria || '',
      adiciones
    };
  }

  static async createProduct(data) {
    const { nombre, precio, descripcion, imagen, stock, categoria, adiciones } = data;
    if (!nombre || precio === undefined) {
      const error = new Error('Nombre y precio del producto son obligatorios');
      error.statusCode = 400;
      throw error;
    }

    const product = await Product.create({
      nombre,
      precio,
      descripcion: descripcion || '',
      imagen: imagen || '',
      stock: stock || 0,
      categoria: categoria || '',
      adiciones: adiciones ? JSON.stringify(adiciones) : '[]'
    });

    return this.getProductById(product.id);
  }

  static async updateProduct(id, data) {
    const p = await Product.findByPk(id);
    if (!p) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const { nombre, precio, descripcion, imagen, stock, categoria, adiciones } = data;
    if (nombre !== undefined) p.nombre = nombre;
    if (precio !== undefined) p.precio = precio;
    if (descripcion !== undefined) p.descripcion = descripcion;
    if (imagen !== undefined) p.imagen = imagen;
    if (stock !== undefined) p.stock = stock;
    if (categoria !== undefined) p.categoria = categoria;
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
    await p.destroy();
    return { message: 'Producto eliminado correctamente' };
  }
}

module.exports = ProductService;
