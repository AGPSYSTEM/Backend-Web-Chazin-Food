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
      const t = (r.tipo || '').toLowerCase();
      const mov = (r.tipoMovimiento || '').toLowerCase();
      const dLower = (r.detalle || '').toLowerCase();
      const mLower = (r.motivo || '').toLowerCase();

      const isCancelCompra = t.includes('cancel') || t.includes('anula') || t.includes('reversa')
        || (mov === 'salida' && (t.includes('compra') || dLower.includes('compra') || mLower.includes('compra')))
        || dLower.includes('cancelaci') || dLower.includes('anulaci') || dLower.includes('reversa')
        || mLower.includes('cancelaci') || mLower.includes('anulaci') || mLower.includes('reversa');

      if (isCancelCompra) {
        tipoLabel = 'Cancelación de Compra';
      } else if (t.includes('consumo') || dLower.includes('consumo')) {
        tipoLabel = 'Consumo por Venta';
      } else if (t.includes('crea') || t === 'nuevo' || t === 'registro') {
        tipoLabel = 'Creado';
      } else if (t.includes('edit') || t.includes('modif') || t === 'actualizado') {
        tipoLabel = 'Editado';
      } else if (t.includes('eliminado permanente') || t.includes('harddelete') || t.includes('definitivo')) {
        tipoLabel = 'Eliminado permanente';
      } else if (t.includes('elimin') || t.includes('papelera') || t === 'inactivar') {
        tipoLabel = 'Eliminado';
      } else if (t.includes('restaur')) {
        tipoLabel = 'Restaurado';
      } else if (t.includes('compra') || t.includes('reabastec') || mov === 'entrada') {
        tipoLabel = 'Reabastecimiento';
      } else if (mov === 'salida') {
        tipoLabel = 'Salida de Stock';
      } else if (t.includes('estado') || t.includes('cambio')) {
        tipoLabel = 'Estado Cambiado';
      }

      return {
        idTrazabilidad: r.idTrazabilidad || r.id,
        id: `tz-${r.idTrazabilidad || r.id}`,
        tipo: tipoLabel,
        tipoRaw: r.tipo || '',
        esCancelacion: isCancelCompra || mov === 'salida',
        nombre: r.entidadNombre || (r.insumo ? r.insumo.nombre : 'Registro'),
        descripcion: r.detalle || (r.motivo ? `${r.tipoMovimiento || 'Movimiento'}: ${r.motivo}` : 'Registro de trazabilidad'),
        fecha: formatFecha(r.fecha),
        fechaRaw: r.fecha || new Date(),
        leido: Number(r.leido || 0),
        idInsumo: r.idInsumo || null,
        tipoMovimiento: r.tipoMovimiento || (isCancelCompra ? 'Salida' : 'Entrada'),
        cantidad: r.cantidad ? parseFloat(r.cantidad) : null,
        motivo: r.motivo || '',
        usuarioId: r.usuarioId || null,
        usuarioNombre: r.usuario
          ? ([(r.usuario.nombre || '').trim(), (r.usuario.apellidos || '').trim()].filter(Boolean).join(' ') || r.usuario.nombre || 'Usuario')
          : (r.usuarioId ? `Usuario #${r.usuarioId}` : 'Sistema')
      };
    });
  }

  static async getUnreadCount() {
    const count = await Trazabilidad.count({ where: { leido: 0 } });
    return { unreadCount: count };
  }

  static async create(data, options = {}) {
    const {
      tipo, entidadNombre, detalle,
      idInsumo, tipoMovimiento, cantidad, motivo, usuarioId,
      skipStockUpdate
    } = data || {};

    const finalTipo = tipo || (tipoMovimiento ? tipoMovimiento.toLowerCase() : 'crear');
    const finalEntidadNombre = entidadNombre || (idInsumo ? `Insumo #${idInsumo}` : 'Sistema');
    const finalDetalle = detalle || motivo || `${finalTipo} en trazabilidad`;

    // Solo actualizar stock si NO se indica skipStockUpdate
    if (!skipStockUpdate && idInsumo && cantidad !== undefined && tipoMovimiento) {
      try {
        const insumo = await Insumo.findByPk(idInsumo, { transaction: options.transaction });
        if (insumo) {
          const cantNum = parseFloat(cantidad);
          if (tipoMovimiento === 'Entrada') {
            insumo.stock = parseFloat(insumo.stock || 0) + cantNum;
          } else if (tipoMovimiento === 'Salida') {
            insumo.stock = Math.max(0, parseFloat(insumo.stock || 0) - cantNum);
          }
          await insumo.save({ transaction: options.transaction });
        }
      } catch (err) {
        console.warn('Advertencia al actualizar stock en trazabilidad:', err.message);
      }
    }

    try {
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
      }, { transaction: options.transaction });

      return registro;
    } catch (tzErr) {
      console.warn('Advertencia al crear registro de trazabilidad:', tzErr.message);
      return null;
    }
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
