const { Op } = require('sequelize');
const { Resena, Product, User, Venta, DetalleVentaProducto, Variante } = require('../../persistence/models');

class ResenaService {
  /**
   * Obtiene todas las reseñas activas de un producto con info del usuario.
   */
  static async getByProducto(idProducto) {
    const resenas = await Resena.findAll({
      where: { idProducto, estado: 1 },
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['idUsuario', 'nombre', 'apellidos']
        }
      ],
      order: [['fechaResena', 'DESC']]
    });

    const total = resenas.length;
    const promedio = total > 0
      ? Math.round((resenas.reduce((s, r) => s + r.puntuacion, 0) / total) * 10) / 10
      : 0;

    return {
      promedio,
      total,
      resenas: resenas.map(r => ({
        id: r.idResena,
        idUsuario: r.idUsuario,
        nombre: `${r.usuario?.nombre || ''} ${r.usuario?.apellidos || ''}`.trim(),
        puntuacion: r.puntuacion,
        comentario: r.comentario,
        fecha: r.fechaResena
      }))
    };
  }

  /**
   * Obtiene el resumen de rating de múltiples productos a la vez (para lista de productos).
   * Retorna { [idProducto]: { promedio, total } }
   */
  static async getRatingResumenBulk(idProductos = []) {
    if (!idProductos.length) return {};

    const resenas = await Resena.findAll({
      where: { idProducto: { [Op.in]: idProductos }, estado: 1 },
      attributes: ['idProducto', 'puntuacion']
    });

    const mapa = {};
    resenas.forEach(r => {
      if (!mapa[r.idProducto]) mapa[r.idProducto] = { suma: 0, total: 0 };
      mapa[r.idProducto].suma += r.puntuacion;
      mapa[r.idProducto].total += 1;
    });

    const resultado = {};
    Object.entries(mapa).forEach(([id, { suma, total }]) => {
      resultado[id] = {
        promedio: Math.round((suma / total) * 10) / 10,
        total
      };
    });
    return resultado;
  }

  /**
   * Verifica si el usuario ha comprado ese producto (tiene al menos 1 venta entregada/aprobada con ese producto).
   */
  static async usuarioComproProducto(idUsuario, idProducto) {
    // Buscamos ventas del usuario con detalles que contengan variantes del producto
    const variantes = await Variante.findAll({
      where: { idProducto },
      attributes: ['idVariante']
    });
    const varianteIds = variantes.map(v => v.idVariante);
    if (!varianteIds.length) return false;

    const cliente = await User.findByPk(idUsuario, {
      include: [{ association: 'clienteInfo', attributes: ['idCliente'] }]
    });
    if (!cliente?.clienteInfo) return false;

    const idCliente = cliente.clienteInfo.idCliente;

    const venta = await Venta.findOne({
      where: {
        idCliente,
        estadoEntrega: { [Op.in]: ['ENTREGADO', 'LISTO', 'EN_CAMINO'] }
      },
      include: [{
        model: DetalleVentaProducto,
        as: 'detalles',
        where: { idVariante: { [Op.in]: varianteIds } },
        required: true
      }]
    });

    return !!venta;
  }

  /**
   * Crea una nueva reseña. Valida: usuario compró el producto, una reseña por producto.
   */
  static async create(idUsuario, { idProducto, puntuacion, comentario }) {
    // Validar puntuación
    const pts = parseInt(puntuacion, 10);
    if (isNaN(pts) || pts < 1 || pts > 5) {
      const err = new Error('La puntuación debe ser un número entre 1 y 5.');
      err.statusCode = 400;
      throw err;
    }

    // Verificar que compró el producto
    const compro = await this.usuarioComproProducto(idUsuario, idProducto);
    if (!compro) {
      const err = new Error('Solo puedes reseñar productos que hayas comprado.');
      err.statusCode = 403;
      throw err;
    }

    // Una reseña por usuario por producto
    const existente = await Resena.findOne({ where: { idUsuario, idProducto, estado: 1 } });
    if (existente) {
      const err = new Error('Ya has dejado una reseña para este producto. Puedes editarla.');
      err.statusCode = 409;
      throw err;
    }

    const resena = await Resena.create({
      idUsuario,
      idProducto,
      puntuacion: pts,
      comentario: (comentario || '').trim(),
      fechaResena: new Date(),
      estado: 1
    });

    return { id: resena.idResena, puntuacion: resena.puntuacion, comentario: resena.comentario };
  }

  /**
   * Actualiza la reseña propia del usuario.
   */
  static async update(idResena, idUsuario, { puntuacion, comentario }) {
    const resena = await Resena.findOne({ where: { idResena, idUsuario, estado: 1 } });
    if (!resena) {
      const err = new Error('Reseña no encontrada o no tienes permisos para editarla.');
      err.statusCode = 404;
      throw err;
    }

    const pts = parseInt(puntuacion, 10);
    if (!isNaN(pts) && pts >= 1 && pts <= 5) resena.puntuacion = pts;
    if (comentario !== undefined) resena.comentario = (comentario || '').trim();
    await resena.save();

    return { id: resena.idResena, puntuacion: resena.puntuacion, comentario: resena.comentario };
  }

  /**
   * Elimina (soft-delete) la reseña propia del usuario.
   */
  static async delete(idResena, idUsuario) {
    const resena = await Resena.findOne({ where: { idResena, idUsuario, estado: 1 } });
    if (!resena) {
      const err = new Error('Reseña no encontrada o no tienes permisos para eliminarla.');
      err.statusCode = 404;
      throw err;
    }
    resena.estado = 0;
    await resena.save();
    return { message: 'Reseña eliminada correctamente.' };
  }

  /**
   * Obtiene la reseña propia del usuario para un producto.
   */
  static async getMia(idUsuario, idProducto) {
    const resena = await Resena.findOne({ where: { idUsuario, idProducto, estado: 1 } });
    if (!resena) return null;
    return { id: resena.idResena, puntuacion: resena.puntuacion, comentario: resena.comentario };
  }
}

module.exports = ResenaService;
