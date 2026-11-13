const { fn, col } = require('sequelize');
const { CategoriaInsumo, Insumo } = require('../../persistence/models');

class CategoryService {
  static async getAllCategories() {
    const [categories, conteos] = await Promise.all([
      CategoriaInsumo.findAll(),
      Insumo.findAll({
        where: { eliminado: 0 },
        attributes: ['idCategoriaInsumo', [fn('COUNT', col('idInsumo')), 'cantidad']],
        group: ['idCategoriaInsumo'],
        raw: true
      }).catch(() => [])
    ]);
    const conteoMap = new Map(
      conteos.map(c => [Number(c.idCategoriaInsumo), Number(c.cantidad || 0)])
    );
    return categories.map((cat) => ({
      id: cat.id,
      idCategoriaInsumo: cat.id,
      nombre: cat.nombre,
      descripcion: cat.descripcion || '',
      icon: cat.icon || null,
      estado: cat.estado === 1 || cat.estado === 'Activo' ? 'Activo' : 'Inactivo',
      cantidad: conteoMap.get(Number(cat.id)) || 0
    }));
  }

  static async getCategoryById(id) {
    const cat = await CategoriaInsumo.findByPk(id);
    if (!cat) {
      const error = new Error('Categoría no encontrada');
      error.statusCode = 404;
      throw error;
    }
    const cantidad = await Insumo.count({ where: { idCategoriaInsumo: id, eliminado: 0 } });
    return {
      id: cat.id,
      idCategoriaInsumo: cat.id,
      nombre: cat.nombre,
      descripcion: cat.descripcion || '',
      icon: cat.icon || null,
      estado: cat.estado === 1 || cat.estado === 'Activo' ? 'Activo' : 'Inactivo',
      cantidad
    };
  }

  static async createCategory({ nombre, descripcion, icon, estado }) {
    const trimmedNombre = String(nombre || '').trim();
    if (!trimmedNombre) {
      const error = new Error('El nombre de la categoría es obligatorio');
      error.statusCode = 400;
      throw error;
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(trimmedNombre) || trimmedNombre.length < 2) {
      const error = new Error('El nombre de la categoría solo puede contener letras y espacios (sin números ni caracteres especiales).');
      error.statusCode = 400;
      throw error;
    }

    const existing = await CategoriaInsumo.findOne({ where: { nombre: trimmedNombre } });
    if (existing) {
      const error = new Error('Ya existe una categoría con ese nombre');
      error.statusCode = 400;
      throw error;
    }

    const category = await CategoriaInsumo.create({
      nombre: trimmedNombre,
      descripcion: descripcion || '',
      icon: icon || null,
      estado: estado === 'Inactivo' || estado === 0 ? 0 : 1
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

    if (data.nombre !== undefined) {
      const trimmedNombre = String(data.nombre || '').trim();
      if (!trimmedNombre) {
        const error = new Error('El nombre de la categoría no puede estar vacío');
        error.statusCode = 400;
        throw error;
      }
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(trimmedNombre) || trimmedNombre.length < 2) {
        const error = new Error('El nombre de la categoría solo puede contener letras y espacios (sin números ni caracteres especiales).');
        error.statusCode = 400;
        throw error;
      }
      const existing = await CategoriaInsumo.findOne({ where: { nombre: trimmedNombre } });
      if (existing && existing.id !== Number(id)) {
        const error = new Error('Ya existe otra categoría con ese nombre');
        error.statusCode = 400;
        throw error;
      }
      cat.nombre = trimmedNombre;
    }
    if (data.descripcion !== undefined) cat.descripcion = data.descripcion;
    if (data.icon !== undefined) cat.icon = data.icon;
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

    const cantidadInsumos = await Insumo.count({ where: { idCategoriaInsumo: id, eliminado: 0 } });
    if (cantidadInsumos > 0) {
      const error = new Error('No se puede eliminar la categoría porque cuenta con insumos asociados');
      error.statusCode = 400;
      throw error;
    }

    // Desasociar insumos en papelera / eliminados
    await Insumo.update({ idCategoriaInsumo: null }, { where: { idCategoriaInsumo: id } });

    await cat.destroy();

    const { resequenceTableIds } = require('../../infrastructure/utils/dbUtils');
    await resequenceTableIds('categoriainsumo', 'idCategoriaInsumo', ['insumo']);

    return { message: 'Categoría eliminada exitosamente' };
  }
}

module.exports = CategoryService;
