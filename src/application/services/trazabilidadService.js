const { Trazabilidad, Insumo, User } = require('../../persistence/models');

class TrazabilidadService {
  static async getAll() {
    const registros = await Trazabilidad.findAll({
      include: [
        { model: Insumo, as: 'insumo', required: false },
        { model: User, as: 'usuario', required: false }
      ],
      order: [['fecha', 'DESC']]
    });

    return registros.map(r => ({
      idTrazabilidad: r.idTrazabilidad || r.id,
      id: r.idTrazabilidad || r.id,
      tipo: r.tipo || (r.tipoMovimiento ? r.tipoMovimiento.toLowerCase() : 'crear'),
      entidadNombre: r.entidadNombre || (r.insumo ? r.insumo.nombre : 'General'),
      detalle: r.detalle || (r.motivo ? `${r.tipoMovimiento || 'Movimiento'}: ${r.motivo}` : 'Registro de trazabilidad'),
      leido: Number(r.leido || 0),
      fecha: r.fecha || new Date(),
      idInsumo: r.idInsumo || null,
      tipoMovimiento: r.tipoMovimiento || null,
      cantidad: r.cantidad ? parseFloat(r.cantidad) : null,
      motivo: r.motivo || '',
      usuarioId: r.usuarioId || null,
      usuarioNombre: r.usuario ? r.usuario.nombre : 'Sistema'
    }));
  }

  static async create(data) {
    const {
      tipo, entidadNombre, detalle,
      idInsumo, tipoMovimiento, cantidad, motivo, usuarioId
    } = data || {};

    const finalTipo = tipo || (tipoMovimiento ? tipoMovimiento.toLowerCase() : 'crear');
    const finalEntidadNombre = entidadNombre || (idInsumo ? `Insumo #${idInsumo}` : 'Sistema');
    const finalDetalle = detalle || motivo || `${finalTipo} en trazabilidad`;

    if (idInsumo && cantidad !== undefined && tipoMovimiento) {
      try {
        const insumo = await Insumo.findByPk(idInsumo);
        if (insumo) {
          const cantNum = parseFloat(cantidad);
          if (tipoMovimiento === 'Entrada') {
            insumo.stock = parseFloat(insumo.stock || 0) + cantNum;
          } else if (tipoMovimiento === 'Salida') {
            insumo.stock = Math.max(0, parseFloat(insumo.stock || 0) - cantNum);
          }
          await insumo.save();
        }
      } catch (err) {
        console.warn('Advertencia al actualizar stock en trazabilidad:', err.message);
      }
    }

    const registro = await Trazabilidad.create({
      tipo: finalTipo,
      entidadNombre: finalEntidadNombre,
      detalle: finalDetalle,
      leido: 0,
      idInsumo: idInsumo || null,
      tipoMovimiento: tipoMovimiento || null,
      cantidad: cantidad !== undefined && cantidad !== null ? parseFloat(cantidad) : null,
      motivo: motivo || null,
      usuarioId: usuarioId || null,
      fecha: new Date()
    });

    return registro;
  }

  static async markAllAsRead() {
    await Trazabilidad.update({ leido: 1 }, { where: { leido: 0 } });
    return { message: 'Todos los registros de trazabilidad fueron marcados como leídos' };
  }

  static async clearAll() {
    await Trazabilidad.destroy({ where: {} });
    return { message: 'Historial de trazabilidad limpiado correctamente' };
  }
}

module.exports = TrazabilidadService;
