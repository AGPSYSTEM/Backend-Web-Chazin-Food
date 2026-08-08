const { CategoriaProducto, Product } = require('../../persistence/models');
const { Op } = require('sequelize');

class CategoriaProductoService {
  /* Obtiene todas las categorías registradas en la base de datos y
 además cuenta cuántos productos pertenecen a cada categoría para devolver esa información al cliente*/
  static async getAll() {
    const categorias = await CategoriaProducto.findAll();
    const list = await Promise.all(categorias.map(async (cat) => {
      const cantidad = await Product.count({
        where: {
          [Op.or]: [
            { idCategoriaProducto: cat.idCategoriaProducto },
            { categoria: cat.nombre }
          ]
        }
      });
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

  /*Busca una categoría por su ID. Si no existe, devuelve un error 404 indicando que la categoría no fue encontrada.*/
  static async getById(id) {
    const cat = await CategoriaProducto.findByPk(id);
    if (!cat) {
      const error = new Error('Categoría de producto no encontrada');
      error.statusCode = 404;
      throw error;
    }
    const cantidad = await Product.count({
      where: {
        [Op.or]: [
          { idCategoriaProducto: id },
          { categoria: cat.nombre }
        ]
      }
    });
    return {
      id: cat.idCategoriaProducto,
      idCategoriaProducto: cat.idCategoriaProducto,
      nombre: cat.nombre,
      descripcion: cat.descripcion || '',
      estado: cat.estado === 1 ? 'Activo' : 'Inactivo',
      cantidad
    };
  }
  /*Crea una nueva categoría.
   Antes de guardarla valida que el nombre no esté vacío y que no exista otra categoría con el mismo nombre. */
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
  /*Actualiza la información de una categoría existente, como el nombre, la descripción y el estado. */
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
  /*Elimina una categoría únicamente si no tiene productos asociados.
   Si existen productos relacionados, genera un error para evitar inconsistencias en la base de datos. */
  static async delete(id) {
    const cat = await CategoriaProducto.findByPk(id);
    if (!cat) {
      const error = new Error('Categoría de producto no encontrada');
      error.statusCode = 404;
      throw error;
    }

    const cantidadProductos = await Product.count({
      where: {
        [Op.or]: [
          { idCategoriaProducto: id },
          { categoria: cat.nombre }
        ]
      }
    });

    if (cantidadProductos > 0) {
      const error = new Error(`No se puede eliminar la categoría "${cat.nombre}" porque tiene ${cantidadProductos} producto(s) asociado(s).`);
      error.statusCode = 400;
      throw error;
    }

    await cat.destroy();
    const { resequenceTableIds } = require('../../infrastructure/utils/dbUtils');
    await resequenceTableIds('categoriaproducto', 'idCategoriaProducto', ['producto']);

    return { message: 'Categoría de producto eliminada exitosamente' };
  }
}

module.exports = CategoriaProductoService;
