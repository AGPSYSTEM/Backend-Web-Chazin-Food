const { Insumo, CategoriaInsumo, Proveedor, FichaTecnica, DetalleFichaInsumo, Trazabilidad, DetalleInsumoPreparadoInsumo, LoteInsumo } = require('../../persistence/models');
const database = require('../../persistence/config/db');

function formatInsumo(i) {
  const catNombre = i.categoria ? i.categoria.nombre : 'Sin categoría';
  const provNombre = i.proveedor ? i.proveedor.nombre : 'Sin Proveedor';
  const lotesList = (i.lotes || []).map(l => ({
    idLote: l.idLote,
    idInsumo: l.idInsumo,
    idCompra: l.idCompra,
    numeroLote: l.numeroLote,
    cantidad: parseFloat(l.cantidad || 0),
    cantidadDisponible: parseFloat(l.cantidadDisponible !== undefined ? l.cantidadDisponible : l.cantidad || 0),
    fechaVencimiento: l.fechaVencimiento || null,
    estado: l.estado || 'ACTIVO'
  }));

  return {
    idInsumo: i.idInsumo,
    id: i.idInsumo,
    nombre: i.nombre,
    idCategoriaInsumo: i.idCategoriaInsumo,
    stock: parseFloat(i.stock || 0),
    stockMinimo: parseFloat(i.stockMinimo || 0),
    fechaExpedicion: i.fechaExpedicion || null,
    fechaVencimiento: i.fechaVencimiento || null,
    unidadMedida: i.unidadMedida,
    precioUnitario: parseFloat(i.precioUnitario || 0),
    idProveedor: i.idProveedor,
    descripcion: i.descripcion || '',
    estado: i.estado,
    esAdicion: i.esAdicion ? 1 : 0,
    precioAdicion: parseFloat(i.precioAdicion || 0),
    imagen: i.imagen || '',
    categoria: catNombre,
    categoriaNombre: catNombre,
    proveedor: provNombre,
    proveedorNombre: provNombre,
    lotes: lotesList
  };
}

class InsumoService {
  static async getAll() {
    const insumos = await Insumo.findAll({
      where: { eliminado: 0 },
      include: [
        { model: CategoriaInsumo, as: 'categoria', required: false },
        { model: Proveedor, as: 'proveedor', required: false },
        { model: LoteInsumo, as: 'lotes', required: false }
      ]
    });

    return insumos.map(formatInsumo);
  }

  static async getDeleted() {
    const insumos = await Insumo.findAll({
      where: { eliminado: 1 },
      include: [
        { model: CategoriaInsumo, as: 'categoria', required: false },
        { model: Proveedor, as: 'proveedor', required: false },
        { model: LoteInsumo, as: 'lotes', required: false }
      ]
    });

    return insumos.map(formatInsumo);
  }

  static async getById(idInsumo) {
    const i = await Insumo.findByPk(idInsumo, {
      include: [
        { model: CategoriaInsumo, as: 'categoria', required: false },
        { model: Proveedor, as: 'proveedor', required: false },
        { model: LoteInsumo, as: 'lotes', required: false }
      ]
    });

    if (!i) {
      const error = new Error('Insumo no encontrado');
      error.statusCode = 404;
      throw error;
    }

    return formatInsumo(i);
  }

  static async create(insumoData) {
    let {
      nombre, idCategoriaInsumo, stock, stockMinimo,
      fechaExpedicion, fechaVencimiento, unidadMedida,
      precioUnitario, idProveedor, descripcion,
      categoria, proveedor, fichaTecnica
    } = insumoData;

    if (!nombre || !nombre.trim()) {
      const error = new Error('El nombre del insumo es requerido');
      error.statusCode = 400;
      throw error;
    }

    if (!idCategoriaInsumo && categoria) {
      const cat = await CategoriaInsumo.findOne({ where: { nombre: categoria } });
      if (cat) idCategoriaInsumo = cat.idCategoriaInsumo;
    }

    if (!idProveedor && proveedor) {
      const prov = await Proveedor.findOne({ where: { nombre: proveedor } });
      if (prov) idProveedor = prov.idProveedor;
    }

    const existing = await Insumo.findOne({ where: { nombre: nombre.trim(), eliminado: 0 } });
    if (existing) {
      const error = new Error('Ya existe un insumo activo registrado con ese nombre');
      error.statusCode = 400;
      throw error;
    }

    const transaction = await database.sequelize.transaction();
    try {
      const insumo = await Insumo.create({
        nombre: nombre.trim(),
        idCategoriaInsumo: idCategoriaInsumo ? parseInt(idCategoriaInsumo) : null,
        stock: stock !== undefined && stock !== null ? parseFloat(stock) : 0,
        stockMinimo: stockMinimo !== undefined && stockMinimo !== null ? parseFloat(stockMinimo) : 0,
        fechaExpedicion: fechaExpedicion || null,
        fechaVencimiento: fechaVencimiento || null,
        unidadMedida: unidadMedida || 'und',
        precioUnitario: precioUnitario !== undefined && precioUnitario !== null ? parseFloat(precioUnitario) : 0,
        idProveedor: idProveedor ? parseInt(idProveedor) : null,
        descripcion: descripcion || '',
        esAdicion: insumoData.esAdicion ? 1 : 0,
        precioAdicion: insumoData.precioAdicion !== undefined && insumoData.precioAdicion !== null ? parseFloat(insumoData.precioAdicion) : 0,
        imagen: insumoData.imagen || null,
        estado: 1
      }, { transaction });

      if (fichaTecnica) {
        const FichaTecnicaService = require('./fichaTecnicaService');
        await FichaTecnicaService.saveForInsumo(insumo.idInsumo, fichaTecnica, {
          transaction,
          skipReload: true
        });
      }

      const TrazabilidadService = require('./trazabilidadService');
      await TrazabilidadService.create({
        tipo: 'Creado',
        entidadNombre: insumo.nombre,
        detalle: `Se creó un nuevo insumo en el inventario: ${insumo.nombre}`,
        idInsumo: insumo.idInsumo,
        tipoMovimiento: 'Entrada',
        cantidad: insumo.stock,
        motivo: 'Registro inicial de insumo',
        usuarioId: data.usuarioId || (options && options.usuarioId) || null,
        skipStockUpdate: true
      }, { transaction });

      await transaction.commit();
      return this.getById(insumo.idInsumo);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async update(idInsumo, insumoData) {
    const transaction = await database.sequelize.transaction();
    try {
      const insumo = await Insumo.findByPk(idInsumo, { transaction });
      if (!insumo) {
        const error = new Error('Insumo no encontrado');
        error.statusCode = 404;
        throw error;
      }

      let {
        nombre, idCategoriaInsumo, stock, stockMinimo,
        fechaExpedicion, fechaVencimiento, unidadMedida,
        precioUnitario, idProveedor, descripcion, estado,
        categoria, proveedor, fichaTecnica
      } = insumoData;

      if (!idCategoriaInsumo && categoria) {
        const cat = await CategoriaInsumo.findOne({ where: { nombre: categoria } });
        if (cat) idCategoriaInsumo = cat.idCategoriaInsumo;
      }

      if (!idProveedor && proveedor) {
        const prov = await Proveedor.findOne({ where: { nombre: proveedor } });
        if (prov) idProveedor = prov.idProveedor;
      }

      if (nombre !== undefined) insumo.nombre = nombre.trim();
      if (idCategoriaInsumo !== undefined) insumo.idCategoriaInsumo = idCategoriaInsumo ? parseInt(idCategoriaInsumo) : null;
      if (stock !== undefined) insumo.stock = parseFloat(stock);
      if (stockMinimo !== undefined) insumo.stockMinimo = parseFloat(stockMinimo);
      if (fechaExpedicion !== undefined) insumo.fechaExpedicion = fechaExpedicion || null;
      if (fechaVencimiento !== undefined) insumo.fechaVencimiento = fechaVencimiento || null;
      if (unidadMedida !== undefined) insumo.unidadMedida = unidadMedida;
      if (precioUnitario !== undefined) insumo.precioUnitario = parseFloat(precioUnitario);
      if (idProveedor !== undefined) insumo.idProveedor = idProveedor ? parseInt(idProveedor) : null;
      if (descripcion !== undefined) insumo.descripcion = descripcion;
      if (insumoData.esAdicion !== undefined) insumo.esAdicion = insumoData.esAdicion ? 1 : 0;
      if (insumoData.precioAdicion !== undefined) insumo.precioAdicion = parseFloat(insumoData.precioAdicion || 0);
      if (insumoData.imagen !== undefined) insumo.imagen = insumoData.imagen || null;
      if (estado !== undefined) {
        insumo.estado = (estado === 'Activo' || estado === 1 || estado === '1') ? 1 : 0;
      }

      await insumo.save({ transaction });

      if (fichaTecnica) {
        const FichaTecnicaService = require('./fichaTecnicaService');
        await FichaTecnicaService.saveForInsumo(idInsumo, fichaTecnica, {
          transaction,
          skipReload: true
        });
      }

      const TrazabilidadService = require('./trazabilidadService');
      await TrazabilidadService.create({
        tipo: 'Editado',
        entidadNombre: insumo.nombre,
        detalle: `Se actualizaron los datos del insumo: ${insumo.nombre}`,
        idInsumo: insumo.idInsumo,
        motivo: 'Actualización de datos',
        usuarioId: data.usuarioId || (options && options.usuarioId) || null,
        skipStockUpdate: true
      }, { transaction });

      await transaction.commit();
      return this.getById(idInsumo);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async softDelete(idInsumo, options = {}) {
    const transaction = await database.sequelize.transaction();

    try {
      const insumo = await Insumo.findByPk(idInsumo, { transaction });
      if (!insumo) {
        const error = new Error('Insumo no encontrado');
        error.statusCode = 404;
        throw error;
      }

      insumo.eliminado = 1;
      await insumo.save({ transaction });

      const FichaTecnicaService = require('./fichaTecnicaService');
      await FichaTecnicaService.softDeleteByInsumoId(idInsumo, { transaction });

      const TrazabilidadService = require('./trazabilidadService');
      await TrazabilidadService.create({
        tipo: 'Eliminado',
        entidadNombre: insumo.nombre,
        detalle: `Se movió a la papelera el insumo: ${insumo.nombre}`,
        idInsumo: insumo.idInsumo,
        motivo: 'Envío a papelera',
        usuarioId: options.usuarioId || null,
        skipStockUpdate: true
      }, { transaction });

      await transaction.commit();
      return { message: 'Insumo y ficha técnica movidos a la papelera' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async restore(idInsumo, options = {}) {
    const transaction = await database.sequelize.transaction();

    try {
      const insumo = await Insumo.findByPk(idInsumo, { transaction });
      if (!insumo) {
        const error = new Error('Insumo no encontrado');
        error.statusCode = 404;
        throw error;
      }

      insumo.eliminado = 0;
      await insumo.save({ transaction });

      const FichaTecnicaService = require('./fichaTecnicaService');
      await FichaTecnicaService.restoreByInsumoId(idInsumo, { transaction });

      const TrazabilidadService = require('./trazabilidadService');
      await TrazabilidadService.create({
        tipo: 'Restaurado',
        entidadNombre: insumo.nombre,
        detalle: `Se restauró el insumo en el inventario: ${insumo.nombre}`,
        idInsumo: insumo.idInsumo,
        motivo: 'Restauración desde papelera',
        usuarioId: options.usuarioId || null,
        skipStockUpdate: true
      }, { transaction });

      await transaction.commit();
      return this.getById(idInsumo);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async hardDelete(idInsumo) {
    const id = parseInt(idInsumo, 10);
    const insumo = await Insumo.findByPk(id);
    if (!insumo) {
      const error = new Error('Insumo no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const nombreInsumo = insumo.nombre;

    const { resequenceTableIds } = require('../../infrastructure/utils/dbUtils');

    // Delete ALL associated fichas técnicas de este insumo (pueden haber múltiples)
    const fichas = await FichaTecnica.findAll({ where: { idInsumo: id } });
    if (fichas && fichas.length > 0) {
      for (const ficha of fichas) {
        await DetalleFichaInsumo.destroy({ where: { idFichaTecnica: ficha.idFichaTecnica } });
        await ficha.destroy();
      }
    }

    // Eliminar también cualquier referencia a este insumo como ingrediente en detalles de otras fichas
    await DetalleFichaInsumo.destroy({ where: { idInsumo: id } });

    // Eliminar referencias en detalle de insumos preparados si las hubiera
    if (DetalleInsumoPreparadoInsumo) {
      await DetalleInsumoPreparadoInsumo.destroy({ where: { idInsumo: id } }).catch(() => {});
    }

    // Eliminar registros de trazabilidad asociados a este insumo
    if (Trazabilidad) {
      await Trazabilidad.destroy({ where: { idInsumo: id } }).catch(() => {});
    }

    await insumo.destroy();

    const TrazabilidadService = require('./trazabilidadService');
    await TrazabilidadService.create({
      tipo: 'Eliminado permanente',
      entidadNombre: nombreInsumo,
      detalle: `Se eliminó permanentemente el insumo: ${nombreInsumo}`,
      motivo: 'Eliminación física definitiva'
    }).catch(() => {});

    const { resetAutoIncrement } = require('../../infrastructure/utils/dbUtils');
    await resetAutoIncrement('insumo', 'idInsumo');
    await resequenceTableIds('fichatecnica', 'idFichaTecnica', [
      { table: 'detallefichainsumo', column: 'idFichaTecnica' }
    ]);

    return { message: 'Insumo y su ficha técnica eliminados físicamente' };
  }
}

module.exports = InsumoService;
