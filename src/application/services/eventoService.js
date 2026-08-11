const { Evento } = require('../../persistence/models');

class EventoService {
  static async getAll() {
    const eventos = await Evento.findAll({ order: [['idEvento', 'ASC']] });
    return eventos.map((e) => ({
      id: e.idEvento,
      idEvento: e.idEvento,
      nombreEvento: e.nombreEvento,
      nombre: e.nombreEvento,
      descripcion: e.descripcion || '',
      fechaInicio: e.fechaInicio,
      fechaFin: e.fechaFin,
      estado: e.estado === 1 ? 'Activo' : 'Inactivo'
    }));
  }

  static async getById(id) {
    const e = await Evento.findByPk(id);
    if (!e) {
      const error = new Error('Evento no encontrado');
      error.statusCode = 404;
      throw error;
    }
    return {
      id: e.idEvento,
      idEvento: e.idEvento,
      nombreEvento: e.nombreEvento,
      nombre: e.nombreEvento,
      descripcion: e.descripcion || '',
      fechaInicio: e.fechaInicio,
      fechaFin: e.fechaFin,
      estado: e.estado === 1 ? 'Activo' : 'Inactivo'
    };
  }

  static async create(data) {
    const { nombreEvento, nombre, descripcion, fechaInicio, fechaFin, estado } = data;
    const finalNombre = nombreEvento || nombre;

    if (!finalNombre || !finalNombre.trim()) {
      const error = new Error('El título/nombre del evento es obligatorio');
      error.statusCode = 400;
      throw error;
    }

    const today = new Date().toISOString().split('T')[0];
    const created = await Evento.create({
      nombreEvento: finalNombre.trim(),
      descripcion: descripcion || '',
      fechaInicio: fechaInicio || today,
      fechaFin: fechaFin || today,
      estado: estado === 'Inactivo' || estado === 0 ? 0 : 1
    });

    return this.getById(created.idEvento);
  }

  static async update(id, data) {
    const e = await Evento.findByPk(id);
    if (!e) {
      const error = new Error('Evento no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const { nombreEvento, nombre, descripcion, fechaInicio, fechaFin, estado } = data;
    const finalNombre = nombreEvento || nombre;

    if (finalNombre !== undefined && finalNombre.trim()) {
      e.nombreEvento = finalNombre.trim();
    }
    if (descripcion !== undefined) {
      e.descripcion = descripcion;
    }
    if (fechaInicio !== undefined) {
      e.fechaInicio = fechaInicio;
    }
    if (fechaFin !== undefined) {
      e.fechaFin = fechaFin;
    }
    if (estado !== undefined) {
      e.estado = estado === 'Activo' || estado === 1 ? 1 : 0;
    }

    await e.save();
    return this.getById(id);
  }

  static async delete(id) {
    const e = await Evento.findByPk(id);
    if (!e) {
      const error = new Error('Evento no encontrado');
      error.statusCode = 404;
      throw error;
    }

    await e.destroy();

    // Reorder IDs if needed to maintain gapless sequence
    const all = await Evento.findAll({ order: [['idEvento', 'ASC']] });
    for (let i = 0; i < all.length; i++) {
      if (all[i].idEvento !== i + 1) {
        await Evento.update({ idEvento: i + 1 }, { where: { idEvento: all[i].idEvento } });
      }
    }

    return { message: 'Evento eliminado correctamente' };
  }
}

module.exports = EventoService;
