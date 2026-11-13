const { Insumo, CategoriaInsumo, Proveedor, FichaTecnica, DetalleFichaInsumo, Trazabilidad, DetalleInsumoPreparadoInsumo, LoteInsumo, DetalleCompraInsumo } = require('../../persistence/models');
const database = require('../../persistence/config/db');

function getColombiaDateISO() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
}

function isLoteExpiredByDateOrState(lote, todayCol = getColombiaDateISO()) {
  if (!lote) return false;
  if (lote.estado === 'VENCIDO') return true;
  if (lote.estado === 'AGOTADO') return false;
  const fechaStr = lote.fechaVencimiento ? String(lote.fechaVencimiento).slice(0, 10) : null;
  return Boolean(fechaStr && fechaStr <= todayCol);
}

function formatInsumo(i, options = {}) {
  const todayCol = getColombiaDateISO();
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
    estado: isLoteExpiredByDateOrState(l, todayCol) ? 'VENCIDO' : (l.estado || 'ACTIVO'),
    estaVencido: isLoteExpiredByDateOrState(l, todayCol)
  }));

  const stockNum = parseFloat(i.stock || 0);
  const countCompras = options.comprasMap ? (options.comprasMap.get(Number(i.idInsumo)) || 0) : 0;
  const tieneCompras = countCompras > 0;
  const tieneStockActivo = stockNum > 0;
  const puedeEliminarse = !tieneStockActivo && !tieneCompras;

  return {
    idInsumo: i.idInsumo,
    id: i.idInsumo,
    nombre: i.nombre,
    idCategoriaInsumo: i.idCategoriaInsumo,
    stock: stockNum,
    stockMinimo: parseFloat(i.stockMinimo || 0),
    stockMaximo: parseFloat(i.stockMaximo !== undefined && i.stockMaximo !== null ? i.stockMaximo : 100),
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
    incluyeIva: i.incluyeIva ? 1 : 0,
    porcentajeIva: (i.incluyeIva && (i.porcentajeIva === undefined || i.porcentajeIva === null || Number(i.porcentajeIva) === 0))
      ? 19.00
      : parseFloat(i.porcentajeIva || 0),
    categoria: catNombre,
    categoriaNombre: catNombre,
    proveedor: provNombre,
    proveedorNombre: provNombre,
    lotes: lotesList,
    tieneCompras,
    totalCompras: countCompras,
    tieneStockActivo,
    puedeEliminarse
  };
}

class InsumoService {
  static async checkVencimientos() {
    try {
      const today = getColombiaDateISO();
      const { Op } = require('sequelize');

      // 1. Lotes con fecha de vencimiento cumplida o pasada que sigan activos
      const lotesVencidos = await LoteInsumo.findAll({
        where: {
          fechaVencimiento: { [Op.lte]: today },
          estado: 'ACTIVO'
        },
        include: [{ model: Insumo, as: 'insumo' }]
      });

      const affectedInsumosMap = new Map();

      for (const lote of lotesVencidos) {
        await lote.update({ estado: 'VENCIDO' });
        if (lote.insumo) {
          affectedInsumosMap.set(lote.idInsumo, lote.insumo);
        }
      }

      // 2. Insumos con fecha de vencimiento directa cumplida y estado activo
      const directVencidos = await Insumo.findAll({
        where: {
          eliminado: 0,
          estado: 1,
          fechaVencimiento: { [Op.lte]: today }
        }
      });
      for (const ins of directVencidos) {
        affectedInsumosMap.set(ins.idInsumo, ins);
      }

      // 3. Inactivar insumos solo si no tienen lotes vigentes y su stock es <= 0
      const inactivados = [];
      for (const [idInsumo, insumo] of affectedInsumosMap.entries()) {
        const remainingStock = Math.max(0, Number(insumo.stock || 0));
        const activeLotesCount = await LoteInsumo.count({
          where: {
            idInsumo,
            estado: 'ACTIVO',
            fechaVencimiento: { [Op.gt]: today },
            cantidadDisponible: { [Op.gt]: 0 }
          }
        }).catch(() => 0);

        if (remainingStock > 0 || activeLotesCount > 0) {
          continue;
        }

        if (Number(insumo.estado) === 1 || insumo.estado === 'Activo' || insumo.estado === '1') {
          await Insumo.update({ estado: 0 }, { where: { idInsumo } });
          inactivados.push({
            idInsumo,
            id: idInsumo,
            nombre: insumo.nombre,
            stock: remainingStock,
            unidadMedida: insumo.unidadMedida
          });

          await Trazabilidad.create({
            tipo: 'Inactivación por Vencimiento',
            entidadNombre: insumo.nombre,
            detalle: `El insumo "${insumo.nombre}" fue inactivado automáticamente por cumplimiento de fecha de vencimiento de lote. Requiere reabastecimiento en el módulo de compras.`,
            idInsumo,
            tipoMovimiento: 'Ajuste',
            cantidad: 0,
            motivo: 'Lote vencido',
            skipStockUpdate: true
          }).catch(() => { });
        }
      }

      return inactivados;
    } catch (err) {
      console.warn('[InsumoService.checkVencimientos] Error:', err.message);
      return [];
    }
  }

  static async getComprasMap() {
    try {
      const { Op } = require('sequelize');
      const { Compra } = require('../../persistence/models');
      const detalleCounts = await DetalleCompraInsumo.findAll({
        attributes: ['idInsumo', [database.sequelize.fn('COUNT', database.sequelize.col('DetalleCompraInsumo.idDetalleCompra')), 'totalCompras']],
        include: [{
          model: Compra,
          as: 'compra',
          attributes: [],
          where: {
            estado: { [Op.notIn]: ['CANCELADA', 'ANULADA'] }
          }
        }],
        group: ['idInsumo'],
        raw: true
      });
      const comprasMap = new Map();
      (detalleCounts || []).forEach(dc => {
        comprasMap.set(Number(dc.idInsumo), Number(dc.totalCompras || 0));
      });
      return comprasMap;
    } catch {
      return new Map();
    }
  }

  static async getAll() {
    const nowTs = Date.now();
    if (!this._lastVencimientoCheckAt || nowTs - this._lastVencimientoCheckAt >= 3 * 60 * 1000) {
      await this.checkVencimientos();
      this._lastVencimientoCheckAt = Date.now();
    }
    const [insumos, comprasMap] = await Promise.all([
      Insumo.findAll({
        where: { eliminado: 0 },
        include: [
          { model: CategoriaInsumo, as: 'categoria', required: false },
          { model: Proveedor, as: 'proveedor', required: false },
          { model: LoteInsumo, as: 'lotes', required: false }
        ]
      }),
      this.getComprasMap()
    ]);

    return insumos.map(i => formatInsumo(i, { comprasMap }));
  }

  static async getDeleted() {
    const [insumos, comprasMap] = await Promise.all([
      Insumo.findAll({
        where: { eliminado: 1 },
        include: [
          { model: CategoriaInsumo, as: 'categoria', required: false },
          { model: Proveedor, as: 'proveedor', required: false },
          { model: LoteInsumo, as: 'lotes', required: false }
        ]
      }),
      this.getComprasMap()
    ]);

    return insumos.map(i => formatInsumo(i, { comprasMap }));
  }

  static async getById(idInsumo) {
    const id = parseInt(idInsumo, 10);
    const { Op } = require('sequelize');
    const { Compra } = require('../../persistence/models');
    const [i, count] = await Promise.all([
      Insumo.findByPk(id, {
        include: [
          { model: CategoriaInsumo, as: 'categoria', required: false },
          { model: Proveedor, as: 'proveedor', required: false },
          { model: LoteInsumo, as: 'lotes', required: false }
        ]
      }),
      DetalleCompraInsumo.count({
        where: { idInsumo: id },
        include: [{
          model: Compra,
          as: 'compra',
          where: {
            estado: { [Op.notIn]: ['CANCELADA', 'ANULADA'] }
          }
        }]
      }).catch(() => 0)
    ]);

    if (!i) {
      const error = new Error('Insumo no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const comprasMap = new Map([[id, count]]);
    return formatInsumo(i, { comprasMap });
  }

  static async create(insumoData) {
    let {
      nombre, idCategoriaInsumo, stock, stockMinimo, stockMaximo,
      fechaExpedicion, fechaVencimiento, unidadMedida,
      precioUnitario, idProveedor, descripcion, estado,
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

    if (idProveedor) {
      const provExists = await Proveedor.findByPk(parseInt(idProveedor));
      if (!provExists) idProveedor = null;
    }

    if (idCategoriaInsumo) {
      const catExists = await CategoriaInsumo.findByPk(parseInt(idCategoriaInsumo));
      if (!catExists) {
        const firstCat = await CategoriaInsumo.findOne();
        idCategoriaInsumo = firstCat ? (firstCat.idCategoriaInsumo || firstCat.id) : null;
      }
    }

    const minVal = stockMinimo !== undefined && stockMinimo !== null ? parseFloat(stockMinimo) : 0;
    const maxVal = stockMaximo !== undefined && stockMaximo !== null ? parseFloat(stockMaximo) : 100;
    if (maxVal < minVal) {
      const error = new Error('La cantidad máxima no puede ser inferior a la cantidad mínima.');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEstado = estado !== undefined
      ? (estado === 'Activo' || estado === 1 || estado === '1' ? 1 : 0)
      : 1;

    const transaction = await database.sequelize.transaction();
    try {
      const insumo = await Insumo.create({
        nombre: nombre.trim(),
        idCategoriaInsumo: idCategoriaInsumo ? parseInt(idCategoriaInsumo) : null,
        stock: stock !== undefined && stock !== null ? parseFloat(stock) : 0,
        stockMinimo: minVal,
        stockMaximo: maxVal,
        fechaExpedicion: (fechaExpedicion && String(fechaExpedicion).trim() !== '') ? fechaExpedicion : null,
        fechaVencimiento: (fechaVencimiento && String(fechaVencimiento).trim() !== '') ? fechaVencimiento : null,
        unidadMedida: unidadMedida || 'und',
        precioUnitario: precioUnitario !== undefined && precioUnitario !== null ? parseFloat(precioUnitario) : 0,
        idProveedor: idProveedor ? parseInt(idProveedor) : null,
        descripcion: descripcion || '',
        esAdicion: insumoData.esAdicion ? 1 : 0,
        precioAdicion: insumoData.precioAdicion !== undefined && insumoData.precioAdicion !== null ? parseFloat(insumoData.precioAdicion) : 0,
        imagen: insumoData.imagen || null,
        incluyeIva: insumoData.incluyeIva ? 1 : 0,
        porcentajeIva: insumoData.incluyeIva
          ? (insumoData.porcentajeIva !== undefined && insumoData.porcentajeIva !== null && insumoData.porcentajeIva !== ""
            ? parseFloat(insumoData.porcentajeIva)
            : 19.00)
          : 0.00,
        estado: normalizedEstado
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
        usuarioId: insumoData.usuarioId || null,
        skipStockUpdate: true
      }, { transaction });

      await transaction.commit();
      return this.getById(insumo.idInsumo);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async update(idInsumo, insumoData, options = {}) {
    const transaction = await database.sequelize.transaction();
    try {
      const insumo = await Insumo.findByPk(idInsumo, { transaction });
      if (!insumo) {
        const error = new Error('Insumo no encontrado');
        error.statusCode = 404;
        throw error;
      }

      let {
        stockMinimo, stockMaximo, descripcion, estado, fichaTecnica
      } = insumoData;

      // ── Campos editables: Stock Mínimo, Stock Máximo, Descripción, Estado, IVA y Adición ──
      // Los datos maestros (nombre, categoría, unidad, precio/costo y stock) son inmutables
      if (stockMinimo !== undefined && stockMinimo !== null && stockMinimo !== '') {
        insumo.stockMinimo = parseFloat(stockMinimo);
      }
      if (stockMaximo !== undefined && stockMaximo !== null && stockMaximo !== '') {
        const minVal = stockMinimo !== undefined ? parseFloat(stockMinimo) : parseFloat(insumo.stockMinimo || 0);
        const maxVal = parseFloat(stockMaximo);
        if (maxVal < minVal) {
          const error = new Error('La cantidad máxima no puede ser inferior a la cantidad mínima.');
          error.statusCode = 400;
          throw error;
        }
        insumo.stockMaximo = maxVal;
      }
      if (descripcion !== undefined) {
        insumo.descripcion = descripcion;
      }
      if (estado !== undefined) {
        insumo.estado = (estado === 'Activo' || estado === 1 || estado === '1') ? 1 : 0;
      }
      if (insumoData.esAdicion !== undefined) {
        insumo.esAdicion = (insumoData.esAdicion === 1 || insumoData.esAdicion === true || insumoData.esAdicion === '1') ? 1 : 0;
      }
      if (insumoData.precioAdicion !== undefined && insumoData.precioAdicion !== null && insumoData.precioAdicion !== '') {
        insumo.precioAdicion = parseFloat(insumoData.precioAdicion || 0);
      }
      if (insumoData.imagen !== undefined) {
        insumo.imagen = insumoData.imagen || null;
      }
      if (insumoData.incluyeIva !== undefined) {
        const llevaIva = (insumoData.incluyeIva === 1 || insumoData.incluyeIva === true || insumoData.incluyeIva === '1') ? 1 : 0;
        insumo.incluyeIva = llevaIva;
        insumo.porcentajeIva = llevaIva
          ? (insumoData.porcentajeIva !== undefined && insumoData.porcentajeIva !== null && insumoData.porcentajeIva !== ""
            ? parseFloat(insumoData.porcentajeIva)
            : 19.00)
          : 0.00;
      }

      // En caso de actualización completa administrativa interna (ej. migraciones o scripts autorizados)
      if (options.allowFullUpdate) {
        let {
          nombre, idCategoriaInsumo, stock, unidadMedida, precioUnitario,
          fechaExpedicion, fechaVencimiento, idProveedor
        } = insumoData;
        if (nombre !== undefined) insumo.nombre = nombre.trim();
        if (idCategoriaInsumo !== undefined) insumo.idCategoriaInsumo = idCategoriaInsumo ? parseInt(idCategoriaInsumo) : null;
        if (stock !== undefined) insumo.stock = parseFloat(stock);
        if (fechaExpedicion !== undefined) insumo.fechaExpedicion = (fechaExpedicion && String(fechaExpedicion).trim() !== '') ? fechaExpedicion : null;
        if (fechaVencimiento !== undefined) insumo.fechaVencimiento = (fechaVencimiento && String(fechaVencimiento).trim() !== '') ? fechaVencimiento : null;
        if (unidadMedida !== undefined) insumo.unidadMedida = unidadMedida;
        if (precioUnitario !== undefined) insumo.precioUnitario = parseFloat(precioUnitario);
        if (idProveedor !== undefined) insumo.idProveedor = idProveedor ? parseInt(idProveedor) : null;
        if (insumoData.esAdicion !== undefined) insumo.esAdicion = insumoData.esAdicion ? 1 : 0;
        if (insumoData.precioAdicion !== undefined) insumo.precioAdicion = parseFloat(insumoData.precioAdicion || 0);
        if (insumoData.imagen !== undefined) insumo.imagen = insumoData.imagen || null;
        if (insumoData.incluyeIva !== undefined) {
          const llevaIva = insumoData.incluyeIva ? 1 : 0;
          insumo.incluyeIva = llevaIva;
          insumo.porcentajeIva = llevaIva ? (parseFloat(insumoData.porcentajeIva) || 19.00) : 0.00;
        }
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
        usuarioId: insumoData.usuarioId || options?.usuarioId || null,
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

      // ── Validar stock activo: No se puede eliminar si tiene stock > 0 ──
      if (Number(insumo.stock || 0) > 0) {
        const error = new Error(`No se puede eliminar el insumo "${insumo.nombre}" porque cuenta con un stock activo de ${insumo.stock} ${insumo.unidadMedida || 'und'}. Para eliminarlo, su stock debe ser 0.`);
        error.statusCode = 400;
        throw error;
      }

      // ── Validar compras activas: Se puede eliminar si las compras fueron canceladas y stock es 0 ──
      const { Op } = require('sequelize');
      const { Compra } = require('../../persistence/models');
      const activeComprasCount = await DetalleCompraInsumo.count({
        where: { idInsumo },
        include: [{
          model: Compra,
          as: 'compra',
          where: {
            estado: { [Op.notIn]: ['CANCELADA', 'ANULADA'] }
          }
        }],
        transaction
      });
      if (activeComprasCount > 0) {
        const error = new Error(`No se puede eliminar el insumo "${insumo.nombre}" porque cuenta con ${activeComprasCount} compra(s) activa(s). Para eliminarlo, debes cancelar la compra del insumo primero.`);
        error.statusCode = 400;
        throw error;
      }

      // ── Validar si aún existen lotes con disponibilidad activa ──
      const activeLotesCount = await LoteInsumo.count({
        where: {
          idInsumo,
          cantidadDisponible: { [Op.gt]: 0 },
          estado: 'ACTIVO'
        },
        transaction
      });
      if (activeLotesCount > 0) {
        const error = new Error(`No se puede eliminar el insumo "${insumo.nombre}" porque cuenta con ${activeLotesCount} lote(s) con stock disponible.`);
        error.statusCode = 400;
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

    // ── Validar stock activo y compras ──
    if (Number(insumo.stock || 0) > 0) {
      const error = new Error(`No se puede eliminar definitivamente el insumo "${insumo.nombre}" porque cuenta con un stock activo de ${insumo.stock} ${insumo.unidadMedida || 'und'}.`);
      error.statusCode = 400;
      throw error;
    }

    const { Op } = require('sequelize');
    const { Compra } = require('../../persistence/models');
    const activeComprasCount = await DetalleCompraInsumo.count({
      where: { idInsumo: id },
      include: [{
        model: Compra,
        as: 'compra',
        where: {
          estado: { [Op.notIn]: ['CANCELADA', 'ANULADA'] }
        }
      }]
    });
    if (activeComprasCount > 0) {
      const error = new Error(`No se puede eliminar definitivamente el insumo "${insumo.nombre}" porque cuenta con ${activeComprasCount} compra(s) activa(s). Para eliminarlo, se debe cancelar la compra del insumo primero.`);
      error.statusCode = 400;
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
      await DetalleInsumoPreparadoInsumo.destroy({ where: { idInsumo: id } }).catch(() => { });
    }

    // Eliminar registros de trazabilidad asociados a este insumo
    if (Trazabilidad) {
      await Trazabilidad.destroy({ where: { idInsumo: id } }).catch(() => { });
    }

    await insumo.destroy();

    const TrazabilidadService = require('./trazabilidadService');
    await TrazabilidadService.create({
      tipo: 'Eliminado permanente',
      entidadNombre: nombreInsumo,
      detalle: `Se eliminó permanentemente el insumo: ${nombreInsumo}`,
      motivo: 'Eliminación física definitiva'
    }).catch(() => { });

    const { resetAutoIncrement } = require('../../infrastructure/utils/dbUtils');
    await resetAutoIncrement('insumo', 'idInsumo');
    await resequenceTableIds('fichatecnica', 'idFichaTecnica', [
      { table: 'detallefichainsumo', column: 'idFichaTecnica' }
    ]);

    return { message: 'Insumo y su ficha técnica eliminados físicamente' };
  }

  /**
   * Elimina uno o todos los lotes vencidos de un insumo y resta su stock disponible.
   */
  static async _removeExpiredLotes(idInsumo, targetLoteId = null, options = {}) {
    const insumoId = parseInt(idInsumo, 10);
    if (!insumoId || isNaN(insumoId)) {
      const error = new Error('ID de insumo no válido');
      error.statusCode = 400;
      throw error;
    }

    const todayCol = getColombiaDateISO();
    const TrazabilidadService = require('./trazabilidadService');
    const sequelize = database.sequelize;

    const result = await sequelize.transaction(async (t) => {
      const insumo = await Insumo.findByPk(insumoId, { transaction: t, lock: t.LOCK.UPDATE });
      if (!insumo || Number(insumo.eliminado) === 1) {
        const error = new Error('Insumo no encontrado');
        error.statusCode = 404;
        throw error;
      }

      const lotesWhere = { idInsumo: insumoId };
      if (targetLoteId !== null && targetLoteId !== undefined) {
        const loteIdNum = parseInt(targetLoteId, 10);
        if (!loteIdNum || isNaN(loteIdNum)) {
          const error = new Error('ID de lote no válido');
          error.statusCode = 400;
          throw error;
        }
        lotesWhere.idLote = loteIdNum;
      }

      const candidatos = await LoteInsumo.findAll({
        where: lotesWhere,
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      if (targetLoteId !== null && targetLoteId !== undefined) {
        if (!candidatos.length) {
          const error = new Error('Lote no encontrado para este insumo');
          error.statusCode = 404;
          throw error;
        }
        if (!isLoteExpiredByDateOrState(candidatos[0], todayCol)) {
          const error = new Error('Solo se pueden eliminar lotes que se encuentren vencidos.');
          error.statusCode = 400;
          throw error;
        }
      }

      const lotesAEliminar = candidatos.filter((l) => isLoteExpiredByDateOrState(l, todayCol));
      if (!lotesAEliminar.length) {
        const error = new Error('No se encontraron lotes vencidos para retirar en este insumo.');
        error.statusCode = 400;
        throw error;
      }

      const cantidadDescontada = Number(
        lotesAEliminar.reduce((acc, lote) => {
          const disp = lote.cantidadDisponible !== undefined && lote.cantidadDisponible !== null
            ? lote.cantidadDisponible
            : lote.cantidad;
          return acc + Math.max(0, Number(disp || 0));
        }, 0).toFixed(3)
      );

      const deletedLotes = lotesAEliminar.map((l) => ({
        idLote: l.idLote,
        numeroLote: l.numeroLote,
        cantidadDescontada: Math.max(0, Number(l.cantidadDisponible ?? l.cantidad ?? 0)),
        fechaVencimiento: l.fechaVencimiento
      }));

      await LoteInsumo.destroy({
        where: {
          idInsumo: insumoId,
          idLote: lotesAEliminar.map((l) => l.idLote)
        },
        transaction: t
      });

      const stockAnterior = Math.max(0, Number(insumo.stock || 0));
      const nuevoStock = Math.max(0, Number((stockAnterior - cantidadDescontada).toFixed(3)));

      const lotesRestantes = await LoteInsumo.findAll({
        where: { idInsumo: insumoId },
        order: [['fechaVencimiento', 'ASC']],
        transaction: t
      });

      const proximoActivo = lotesRestantes.find(
        (l) => !isLoteExpiredByDateOrState(l, todayCol) && Number(l.cantidadDisponible || 0) > 0 && l.fechaVencimiento
      );
      const cualquierRestante = lotesRestantes.find((l) => l.fechaVencimiento);
      const nuevaFechaVencimiento = proximoActivo
        ? proximoActivo.fechaVencimiento
        : (cualquierRestante ? cualquierRestante.fechaVencimiento : null);

      await insumo.update(
        {
          stock: nuevoStock,
          fechaVencimiento: nuevaFechaVencimiento
        },
        { transaction: t }
      );

      const codigosResumen = deletedLotes.map((d) => d.numeroLote || `#${d.idLote}`).join(', ');
      const unidad = insumo.unidadMedida || 'und';
      await TrazabilidadService.create(
        {
          tipo: 'Retiro Lote Vencido',
          entidadNombre: insumo.nombre,
          idInsumo: insumo.idInsumo,
          tipoMovimiento: 'Salida',
          cantidad: cantidadDescontada,
          motivo: `Retiro de lote(s) vencido(s): ${codigosResumen}`,
          detalle: `Se eliminó ${deletedLotes.length} lote(s) vencido(s) (${codigosResumen}) de "${insumo.nombre}", descontando ${cantidadDescontada} ${unidad} del stock (${stockAnterior} -> ${nuevoStock}).`,
          usuarioId: options.usuarioId || null,
          skipStockUpdate: true
        },
        { transaction: t }
      );

      return {
        deletedCount: deletedLotes.length,
        deletedLotes,
        cantidadDescontada,
        stockAnterior,
        nuevoStock
      };
    });

    const insumoActualizado = await this.getById(insumoId);
    return {
      message: result.deletedCount === 1
        ? `Lote vencido eliminado. Se descontaron ${result.cantidadDescontada} ${insumoActualizado.unidadMedida || 'und'} del stock.`
        : `${result.deletedCount} lotes vencidos eliminados. Se descontaron ${result.cantidadDescontada} ${insumoActualizado.unidadMedida || 'und'} del stock.`,
      ...result,
      insumo: insumoActualizado
    };
  }

  static async deleteExpiredLote(idInsumo, idLote, options = {}) {
    return this._removeExpiredLotes(idInsumo, idLote, options);
  }

  static async deleteExpiredLotesByInsumo(idInsumo, options = {}) {
    return this._removeExpiredLotes(idInsumo, null, options);
  }
}

InsumoService.getColombiaDateISO = getColombiaDateISO;
InsumoService.isLoteExpiredByDateOrState = isLoteExpiredByDateOrState;

module.exports = InsumoService;
