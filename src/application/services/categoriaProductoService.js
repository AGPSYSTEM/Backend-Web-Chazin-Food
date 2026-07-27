const { CategoriaProducto, Product } = require('../../persistence/models');

class CategoriaProductoService {
  static async getAll() {
    const categorias = await CategoriaProducto.findAll();
    const list = await Promise.all(categorias.map(async (cat) => {
      const cantidad = await Product.count({ where: { idCategoriaProducto: cat.idCategoriaProducto } });
      return {
        id: cat.idCategoriaProducto,
        idCategoriaProducto: cat.idCategoriaProducto,
        nombre: cat.nombre,
        descripcion: cat.descripcion || '',
        estado: cat.estado === 1 ? 'Activo' : 'Inactivo',
        cantidad
      };
    }));
    return list;
  }

  static async getById(id) {
    const cat = await CategoriaProducto.findByPk(id);
    if (!cat) {
      const error = new Error('Categoría de producto no encontrada');
      error.statusCode = 404;
      throw error;
    }
    const cantidad = await Product.count({ where: { idCategoriaProducto: id } });
    return {
      id: cat.idCategoriaProducto,
      idCategoriaProducto: cat.idCategoriaProducto,
      nombre: cat.nombre,
      descripcion: cat.descripcion || '',
      estado: cat.estado === 1 ? 'Activo' : 'Inactivo',
      cantidad
    };
  }

  static async create({ nombre, descripcion }) {
    if (!nombre || !nombre.trim()) {
      const error = new Error('El nombre de la categoría es obligatorio');
      error.statusCode = 400;
      throw error;
    }

    const existing = await CategoriaProducto.findOne({ where: { nombre: nombre.trim() } });
    if (existing) {
      const error = new Error('Ya existe una categoría de producto con ese nombre');
      error.statusCode = 400;
      throw error;
    }

    const category = await CategoriaProducto.create({
      nombre: nombre.trim(),
      descripcion: descripcion || '',
      estado: 1
    });

    return this.getById(category.idCategoriaProducto);
  }

  static async update(id, data) {
    const cat = await CategoriaProducto.findByPk(id);
    if (!cat) {
      const error = new Error('Categoría de producto no encontrada');
      error.statusCode = 404;
      throw error;
    }

    if (data.nombre) cat.nombre = data.nombre.trim();
    if (data.descripcion !== undefined) cat.descripcion = data.descripcion;
    if (data.estado !== undefined) {
      cat.estado = data.estado === 'Activo' || data.estado === 1 ? 1 : 0;
    }

    await cat.save();
    return this.getById(id);
  }

  static async delete(id) {
    const cat = await CategoriaProducto.findByPk(id);
    if (!cat) {
      const error = new Error('Categoría de producto no encontrada');
      error.statusCode = 404;
      throw error;
    }

    const cantidadProductos = await Product.count({ where: { idCategoriaProducto: id } });
    if (cantidadProductos > 0) {
      const error = new Error('No se puede eliminar la categoría porque tiene productos asociados');
      error.statusCode = 400;
      throw error;
    }

    await cat.destroy();
    return { message: 'Categoría de producto eliminada exitosamente' };
  }
}

module.exports = CategoriaProductoService;
