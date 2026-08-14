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
      estado: e.estado === 1 ? 'Activo' : 'Inactivo',
      idProducto: e.idProducto,
      tipoEvento: e.tipoEvento,
      descuento: e.descuento,
      nuevoPrecio: e.nuevoPrecio,
      accionInsumo: e.accionInsumo,
      insumosAsociados: e.insumosAsociados ? JSON.parse(e.insumosAsociados) : []
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
      estado: e.estado === 1 ? 'Activo' : 'Inactivo',
      idProducto: e.idProducto,
      tipoEvento: e.tipoEvento,
      descuento: e.descuento,
      nuevoPrecio: e.nuevoPrecio,
      accionInsumo: e.accionInsumo,
      insumosAsociados: e.insumosAsociados ? JSON.parse(e.insumosAsociados) : []
    };
  }

  static async create(data) {
    const { 
      nombreEvento, nombre, descripcion, fechaInicio, fechaFin, estado,
      productoId, tipoEvento, descuento, nuevoPrecio, accion, insumos, isTemporal
    } = data;
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
      fechaInicio: isTemporal ? fechaInicio : null,
      fechaFin: isTemporal ? fechaFin : null,
      estado: estado === 'Inactivo' || estado === 0 ? 0 : 1,
      idProducto: productoId || null,
      tipoEvento: tipoEvento || null,
      descuento: descuento || null,
      nuevoPrecio: nuevoPrecio || null,
      accionInsumo: accion || null,
      insumosAsociados: insumos ? JSON.stringify(insumos) : null
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

    const { 
      nombreEvento, nombre, descripcion, fechaInicio, fechaFin, estado,
      productoId, tipoEvento, descuento, nuevoPrecio, accion, insumos, isTemporal
    } = data;
    const finalNombre = nombreEvento || nombre;

    if (finalNombre !== undefined && finalNombre.trim()) {
      e.nombreEvento = finalNombre.trim();
    }
    if (descripcion !== undefined) e.descripcion = descripcion;
    if (isTemporal !== undefined) {
      if (isTemporal) {
        if (fechaInicio !== undefined) e.fechaInicio = fechaInicio;
        if (fechaFin !== undefined) e.fechaFin = fechaFin;
      } else {
        e.fechaInicio = null;
        e.fechaFin = null;
      }
    } else {
       if (fechaInicio !== undefined) e.fechaInicio = fechaInicio;
       if (fechaFin !== undefined) e.fechaFin = fechaFin;
    }
    
    if (estado !== undefined) e.estado = estado === 'Activo' || estado === 1 ? 1 : 0;
    if (productoId !== undefined) e.idProducto = productoId;
    if (tipoEvento !== undefined) e.tipoEvento = tipoEvento;
    if (descuento !== undefined) e.descuento = descuento;
    if (nuevoPrecio !== undefined) e.nuevoPrecio = nuevoPrecio;
    if (accion !== undefined) e.accionInsumo = accion;
    if (insumos !== undefined) e.insumosAsociados = insumos ? JSON.stringify(insumos) : null;

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
