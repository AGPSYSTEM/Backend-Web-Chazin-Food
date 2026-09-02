const { InsumoPreparado, DetalleInsumoPreparadoInsumo, Insumo, FichaTecnica, DetalleFichaInsumo } = require('../../persistence/models');

class InsumoPreparadoService {
  static async getAll() {
    const preparados = await InsumoPreparado.findAll({
      where: { eliminado: 0 },
      include: [
        {
          model: DetalleInsumoPreparadoInsumo,
          as: 'detalles',
          include: [{ model: Insumo, as: 'insumo' }]
        },
        {
          model: FichaTecnica,
          as: 'fichaTecnica',
          required: false,
          where: { estado: 1 },
          include: [
            {
              model: DetalleFichaInsumo,
              as: 'detalles',
              include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'unidadMedida'] }]
            }
          ]
        }
      ]
    });

    return preparados.map(p => {
      const insumos = p.detalles ? p.detalles.map(d => ({
        idDetalle: d.idDetalle,
        idInsumo: d.idInsumo,
        insumoNombre: d.insumo ? d.insumo.nombre : '',
        cantidad: parseFloat(d.cantidad || 0),
        unidadMedida: d.unidadMedida,
        precioUnitario: parseFloat(d.precioUnitario || 0),
        subtotal: parseFloat(d.cantidad || 0) * parseFloat(d.precioUnitario || 0)
      })) : [];

      return {
        id: p.id,
        nombre: p.nombre,
        descripcion: p.descripcion || '',
        unidadMedida: p.unidadMedida || 'und',
        estado: p.estado,
        eliminado: p.eliminado || 0,
        rendimiento: parseFloat(p.rendimiento || 1),
        unidadRendimiento: p.unidadRendimiento || 'und',
        precioVenta: parseFloat(p.precioVenta || 0),
        costoTotal: parseFloat(p.costoTotal || 0),
        fechaCreacion: p.fechaCreacion,
        insumos,
        componentes: insumos,
        fichaTecnica: p.fichaTecnica || null
      };
    });
  }

  static async getDeleted() {
    const preparados = await InsumoPreparado.findAll({
      where: { eliminado: 1 },
      include: [
        {
          model: DetalleInsumoPreparadoInsumo,
          as: 'detalles',
          include: [{ model: Insumo, as: 'insumo' }]
        }
      ]
    });

    return preparados.map(p => {
      const insumos = p.detalles ? p.detalles.map(d => ({
        idDetalle: d.idDetalle,
        idInsumo: d.idInsumo,
        insumoNombre: d.insumo ? d.insumo.nombre : '',
        cantidad: parseFloat(d.cantidad || 0),
        unidadMedida: d.unidadMedida,
        precioUnitario: parseFloat(d.precioUnitario || 0),
        subtotal: parseFloat(d.cantidad || 0) * parseFloat(d.precioUnitario || 0)
      })) : [];

      return {
        id: p.id,
        nombre: p.nombre,
        descripcion: p.descripcion || '',
        unidadMedida: p.unidadMedida || 'und',
        estado: p.estado,
        rendimiento: parseFloat(p.rendimiento || 1),
        unidadRendimiento: p.unidadRendimiento || 'und',
        precioVenta: parseFloat(p.precioVenta || 0),
        costoTotal: parseFloat(p.costoTotal || 0),
        fechaCreacion: p.fechaCreacion,
        insumos,
        componentes: insumos
      };
    });
  }

  static async getById(id) {
    const p = await InsumoPreparado.findByPk(id, {
      include: [
        {
          model: DetalleInsumoPreparadoInsumo,
          as: 'detalles',
          include: [{ model: Insumo, as: 'insumo' }]
        },
        {
          model: FichaTecnica,
          as: 'fichaTecnica',
          required: false,
          where: { estado: 1 },
          include: [
            {
              model: DetalleFichaInsumo,
              as: 'detalles',
              include: [{ model: Insumo, as: 'insumo', attributes: ['idInsumo', 'nombre', 'unidadMedida'] }]
            }
          ]
        }
      ]
    });

    if (!p) {
      const error = new Error('Insumo preparado no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const insumos = p.detalles ? p.detalles.map(d => ({
      idDetalle: d.idDetalle,
      idInsumo: d.idInsumo,
      insumoNombre: d.insumo ? d.insumo.nombre : '',
      cantidad: parseFloat(d.cantidad || 0),
      unidadMedida: d.unidadMedida,
      precioUnitario: parseFloat(d.precioUnitario || 0),
      subtotal: parseFloat(d.cantidad || 0) * parseFloat(d.precioUnitario || 0)
    })) : [];

    return {
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion || '',
      unidadMedida: p.unidadMedida || 'und',
      estado: p.estado,
      rendimiento: parseFloat(p.rendimiento || 1),
      unidadRendimiento: p.unidadRendimiento || 'und',
      precioVenta: parseFloat(p.precioVenta || 0),
      costoTotal: parseFloat(p.costoTotal || 0),
      fechaCreacion: p.fechaCreacion,
      insumos,
      componentes: insumos,
      fichaTecnica: p.fichaTecnica || null
    };
  }

  static async create(data) {
    const { nombre, descripcion, unidadMedida, rendimiento, unidadRendimiento, precioVenta, insumos, componentes, costoTotal: inputCosto, estado, fichaTecnica } = data;
    if (!nombre) {
      const error = new Error('El nombre del insumo preparado es requerido');
      error.statusCode = 400;
      throw error;
    }

    const itemsList = insumos || componentes || [];
    let costoTotal = 0;
    itemsList.forEach(item => {
      costoTotal += parseFloat(item.cantidad || 0) * parseFloat(item.precioUnitario || 0);
    });

    if (costoTotal === 0 && inputCosto) {
      costoTotal = parseFloat(inputCosto) || 0;
    }

    const estadoNum = (estado === 'Inactivo' || estado === 0 || estado === '0') ? 0 : 1;

    const preparado = await InsumoPreparado.create({
      nombre,
      descripcion: descripcion || '',
      unidadMedida: unidadMedida || 'und',
      estado: estadoNum,
      rendimiento: rendimiento || 1,
      unidadRendimiento: unidadRendimiento || 'und',
      precioVenta: precioVenta || 0,
      costoTotal,
      fechaCreacion: new Date()
    });

    for (const item of itemsList) {
      await DetalleInsumoPreparadoInsumo.create({
        idPreparado: preparado.id,
        idInsumo: item.idInsumo,
        cantidad: item.cantidad,
        unidadMedida: item.unidadMedida || 'und',
        precioUnitario: item.precioUnitario || 0
      });
    }

    if (fichaTecnica) {
      const FichaTecnicaService = require('./fichaTecnicaService');
      await FichaTecnicaService.saveForInsumoPreparado(preparado.id, fichaTecnica);
    }

    const TrazabilidadService = require('./trazabilidadService');
    await TrazabilidadService.create({
      tipo: 'Creado',
      entidadNombre: preparado.nombre,
      detalle: `Se creó el insumo preparado: ${preparado.nombre}`,
      motivo: 'Registro inicial de insumo preparado',
      skipStockUpdate: true
    }).catch(() => {});

    return this.getById(preparado.id);
  }

  static async update(id, data) {
    const p = await InsumoPreparado.findByPk(id);
    if (!p) {
      const error = new Error('Insumo preparado no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const { nombre, descripcion, unidadMedida, rendimiento, unidadRendimiento, precioVenta, insumos, componentes, costoTotal: inputCosto, estado, fichaTecnica } = data;

    if (nombre !== undefined) p.nombre = nombre;
    if (descripcion !== undefined) p.descripcion = descripcion;
    if (unidadMedida !== undefined) p.unidadMedida = unidadMedida;
    if (rendimiento !== undefined) p.rendimiento = rendimiento;
    if (unidadRendimiento !== undefined) p.unidadRendimiento = unidadRendimiento;
    if (precioVenta !== undefined) p.precioVenta = precioVenta;
    if (estado !== undefined) {
      p.estado = (estado === 'Activo' || estado === 1 || estado === '1') ? 1 : 0;
    }

    const itemsList = insumos || componentes;
    if (itemsList && Array.isArray(itemsList)) {
      let costoTotal = 0;
      itemsList.forEach(item => {
        costoTotal += parseFloat(item.cantidad || 0) * parseFloat(item.precioUnitario || 0);
      });
      if (costoTotal === 0 && inputCosto) {
        costoTotal = parseFloat(inputCosto) || 0;
      }
      p.costoTotal = costoTotal;

      await DetalleInsumoPreparadoInsumo.destroy({ where: { idPreparado: id } });
      for (const item of itemsList) {
        await DetalleInsumoPreparadoInsumo.create({
          idPreparado: id,
          idInsumo: item.idInsumo,
          cantidad: item.cantidad,
          unidadMedida: item.unidadMedida || 'und',
          precioUnitario: item.precioUnitario || 0
        });
      }
    }

    await p.save();

    if (fichaTecnica) {
      const FichaTecnicaService = require('./fichaTecnicaService');
      await FichaTecnicaService.saveForInsumoPreparado(id, fichaTecnica);
    }

    const TrazabilidadService = require('./trazabilidadService');
    await TrazabilidadService.create({
      tipo: 'Editado',
      entidadNombre: p.nombre,
      detalle: `Se actualizaron los datos del insumo preparado: ${p.nombre}`,
      motivo: 'Actualización de insumo preparado',
      skipStockUpdate: true
    }).catch(() => {});

    return this.getById(id);
  }

  static async softDelete(id) {
    const p = await InsumoPreparado.findByPk(id);
    if (!p) {
      const error = new Error('Insumo preparado no encontrado');
      error.statusCode = 404;
      throw error;
    }

    p.eliminado = 1;
    await p.save();

    const TrazabilidadService = require('./trazabilidadService');
    await TrazabilidadService.create({
      tipo: 'Eliminado',
      entidadNombre: p.nombre,
      detalle: `Se movió a la papelera el insumo preparado: ${p.nombre}`,
      motivo: 'Envío a papelera de preparado',
      skipStockUpdate: true
    }).catch(() => {});

    return { message: 'Insumo preparado movido a la papelera' };
  }

  static async restore(id) {
    const p = await InsumoPreparado.findByPk(id);
    if (!p) {
      const error = new Error('Insumo preparado no encontrado');
      error.statusCode = 404;
      throw error;
    }

    p.eliminado = 0;
    await p.save();

    const TrazabilidadService = require('./trazabilidadService');
    await TrazabilidadService.create({
      tipo: 'Restaurado',
      entidadNombre: p.nombre,
      detalle: `Se restauró el insumo preparado: ${p.nombre}`,
      motivo: 'Restauración desde papelera de preparado',
      skipStockUpdate: true
    }).catch(() => {});

    return this.getById(id);
  }

  static async hardDelete(id) {
    const p = await InsumoPreparado.findByPk(id);
    if (!p) {
      const error = new Error('Insumo preparado no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const nombrePreparado = p.nombre;

    await DetalleInsumoPreparadoInsumo.destroy({ where: { idPreparado: id } });
    await p.destroy();

    const TrazabilidadService = require('./trazabilidadService');
    await TrazabilidadService.create({
      tipo: 'Eliminado permanente',
      entidadNombre: nombrePreparado,
      detalle: `Se eliminó permanentemente el insumo preparado: ${nombrePreparado}`,
      motivo: 'Eliminación física definitiva de preparado',
      skipStockUpdate: true
    }).catch(() => {});

    const count = await InsumoPreparado.count();
    if (count === 0) {
      const connectDB = require('../../persistence/config/db');
      await connectDB.sequelize.query('ALTER TABLE `insumopreparado` AUTO_INCREMENT = 1;');
    }

    return { message: 'Insumo preparado eliminado físicamente' };
  }
}

module.exports = InsumoPreparadoService;
