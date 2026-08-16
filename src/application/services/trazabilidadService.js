const { Trazabilidad, Insumo, User } = require('../../persistence/models');

function formatFecha(d) {
  if (!d) return '';
  const dateObj = new Date(d);
  if (isNaN(dateObj.getTime())) return String(d);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(dateObj.getDate())}/${pad(dateObj.getMonth() + 1)}/${dateObj.getFullYear()} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
}

class TrazabilidadService {
  static async getAll(filter = {}) {
    const where = {};
    if (filter.idInsumo) {
      where.idInsumo = filter.idInsumo;
    }
    if (filter.tipo) {
      where.tipo = filter.tipo;
    }

    const registros = await Trazabilidad.findAll({
      where,
      include: [
        { model: Insumo, as: 'insumo', required: false },
        { model: User, as: 'usuario', required: false }
      ],
      order: [['fecha', 'DESC']]
    });

    return registros.map(r => {
      let tipoLabel = 'Creado';
      const rawTipo = (r.tipo || r.tipoMovimiento || '').toLowerCase();
      if (rawTipo.includes('compra') || rawTipo.includes('reabastec') || rawTipo === 'entrada') {
        tipoLabel = 'Reabastecimiento';
      } else if (rawTipo.includes('edit') || rawTipo === 'modificar') {
        tipoLabel = 'Editado';
      } else if (rawTipo.includes('eliminado permanente') || rawTipo.includes('harddelete')) {
        tipoLabel = 'Eliminado permanente';
      } else if (rawTipo.includes('elimin') || rawTipo === 'inactivar') {
        tipoLabel = 'Eliminado';
      } else if (rawTipo.includes('restaur')) {
        tipoLabel = 'Restaurado';
      } else if (rawTipo.includes('estado') || rawTipo.includes('cambio')) {
        tipoLabel = 'Estado Cambiado';
      }

      return {
        idTrazabilidad: r.idTrazabilidad || r.id,
        id: `tz-${r.idTrazabilidad || r.id}`,
        tipo: tipoLabel,
        tipoRaw: r.tipo || '',
        nombre: r.entidadNombre || (r.insumo ? r.insumo.nombre : 'Registro'),
        descripcion: r.detalle || (r.motivo ? `${r.tipoMovimiento || 'Movimiento'}: ${r.motivo}` : 'Registro de trazabilidad'),
        fecha: formatFecha(r.fecha),
        fechaRaw: r.fecha || new Date(),
        leido: Number(r.leido || 0),
        idInsumo: r.idInsumo || null,
        tipoMovimiento: r.tipoMovimiento || null,
        cantidad: r.cantidad ? parseFloat(r.cantidad) : null,
        motivo: r.motivo || '',
        usuarioId: r.usuarioId || null,
        usuarioNombre: r.usuario ? r.usuario.nombre : 'Sistema'
      };
    });
  }

  static async getUnreadCount() {
    const count = await Trazabilidad.count({ where: { leido: 0 } });
    return { unreadCount: count };
  }

  static async create(data) {
    const {
      tipo, entidadNombre, detalle,
      idInsumo, tipoMovimiento, cantidad, motivo, usuarioId,
      skipStockUpdate
    } = data || {};

    const finalTipo = tipo || (tipoMovimiento ? tipoMovimiento.toLowerCase() : 'crear');
    const finalEntidadNombre = entidadNombre || (idInsumo ? `Insumo #${idInsumo}` : 'Sistema');
    const finalDetalle = detalle || motivo || `${finalTipo} en trazabilidad`;

    // Solo actualizar stock si NO se indica skipStockUpdate
    // (compraService ya maneja su propio ajuste de stock y pasa skipStockUpdate: true)
    if (!skipStockUpdate && idInsumo && cantidad !== undefined && tipoMovimiento) {
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
