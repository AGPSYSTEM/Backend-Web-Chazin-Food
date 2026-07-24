const { CategoriaInsumo, Insumo } = require('../../persistence/models');

class CategoryService {
  static async getAllCategories() {
    const categories = await CategoriaInsumo.findAll();
    const list = await Promise.all(categories.map(async (cat) => {
      const cantidad = await Insumo.count({ where: { idCategoriaInsumo: cat.id } });
      return {
        id: cat.id,
        idCategoriaInsumo: cat.id,
        nombre: cat.nombre,
        descripcion: cat.descripcion || '',
        estado: cat.estado === 1 || cat.estado === 'Activo' ? 'Activo' : 'Inactivo',
        cantidad
      };
    }));
    return list;
  }

  static async getCategoryById(id) {
    const cat = await CategoriaInsumo.findByPk(id);
    if (!cat) {
      const error = new Error('Categoría no encontrada');
      error.statusCode = 404;
      throw error;
    }
    const cantidad = await Insumo.count({ where: { idCategoriaInsumo: id } });
    return {
      id: cat.id,
      idCategoriaInsumo: cat.id,
      nombre: cat.nombre,
      descripcion: cat.descripcion || '',
      estado: cat.estado === 1 || cat.estado === 'Activo' ? 'Activo' : 'Inactivo',
      cantidad
    };
  }

  static async createCategory({ nombre, descripcion }) {
    if (!nombre || !nombre.trim()) {
      const error = new Error('El nombre de la categoría es obligatorio');
      error.statusCode = 400;
      throw error;
    }

    const existing = await CategoriaInsumo.findOne({ where: { nombre: nombre.trim() } });
    if (existing) {
      const error = new Error('Ya existe una categoría con ese nombre');
      error.statusCode = 400;
      throw error;
    }

    const category = await CategoriaInsumo.create({
      nombre: nombre.trim(),
      descripcion: descripcion || '',
      estado: 1
    });

    return this.getCategoryById(category.id);
  }

  static async updateCategory(id, data) {
    const cat = await CategoriaInsumo.findByPk(id);
    if (!cat) {
      const error = new Error('Categoría no encontrada');
      error.statusCode = 404;
      throw error;
    }

    if (data.nombre) cat.nombre = data.nombre.trim();
    if (data.descripcion !== undefined) cat.descripcion = data.descripcion;
    if (data.estado !== undefined) {
      cat.estado = data.estado === 'Activo' || data.estado === 1 ? 1 : 0;
    }

    await cat.save();
    return this.getCategoryById(id);
  }

  static async deleteCategory(id) {
    const cat = await CategoriaInsumo.findByPk(id);
    if (!cat) {
      const error = new Error('Categoría no encontrada');
      error.statusCode = 404;
      throw error;
    }

    const cantidadInsumos = await Insumo.count({ where: { idCategoriaInsumo: id } });
    if (cantidadInsumos > 0) {
      const error = new Error('No se puede eliminar la categoría porque cuenta con insumos asociados');
      error.statusCode = 400;
      throw error;
    }

    await cat.destroy();
    return { message: 'Categoría eliminada exitosamente' };
  }
}

module.exports = CategoryService;
