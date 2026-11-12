const { Proveedor, TipoProveedor, TipoDocumento, Insumo, Compra } = require('../../persistence/models');
const { Sequelize, Op } = require('sequelize');

class ProveedorService {
  static async getTipos() {
    const [tiposProveedor, tiposDocumento] = await Promise.all([
      TipoProveedor.findAll({ raw: true }),
      TipoDocumento.findAll({ raw: true })
    ]);
    return { tiposProveedor, tiposDocumento };
  }

  static async getAll() {
    const [proveedores, comprasCounts, insumosCounts] = await Promise.all([
      Proveedor.findAll({
        where: { eliminado: 0 },
        include: [
          { model: TipoProveedor, as: 'tipoProveedor' },
          { model: TipoDocumento, as: 'tipoDocumento' }
        ]
      }),
      Compra.findAll({
        attributes: ['idProveedor', [Sequelize.fn('COUNT', Sequelize.col('idCompra')), 'count']],
        group: ['idProveedor'],
        raw: true
      }).catch(() => []),
      Insumo.findAll({
        attributes: ['idProveedor', [Sequelize.fn('COUNT', Sequelize.col('idInsumo')), 'count']],
        group: ['idProveedor'],
        raw: true
      }).catch(() => [])
    ]);

    const comprasMap = {};
    comprasCounts.forEach(c => { comprasMap[c.idProveedor] = parseInt(c.count) || 0; });
    const insumosMap = {};
    insumosCounts.forEach(i => { insumosMap[i.idProveedor] = parseInt(i.count) || 0; });

    return proveedores.map(p => ({
      ...this._mapProveedor(p),
      comprasCount: comprasMap[p.idProveedor] || 0,
      tieneCompras: (comprasMap[p.idProveedor] || 0) > 0,
      insumosCount: insumosMap[p.idProveedor] || 0
    }));
  }

  static async getPapelera() {
    const [proveedores, comprasCounts, insumosCounts] = await Promise.all([
      Proveedor.findAll({
        where: { eliminado: 1 },
        include: [
          { model: TipoProveedor, as: 'tipoProveedor' },
          { model: TipoDocumento, as: 'tipoDocumento' }
        ]
      }),
      Compra.findAll({
        attributes: ['idProveedor', [Sequelize.fn('COUNT', Sequelize.col('idCompra')), 'count']],
        group: ['idProveedor'],
        raw: true
      }).catch(() => []),
      Insumo.findAll({
        attributes: ['idProveedor', [Sequelize.fn('COUNT', Sequelize.col('idInsumo')), 'count']],
        group: ['idProveedor'],
        raw: true
      }).catch(() => [])
    ]);

    const comprasMap = {};
    comprasCounts.forEach(c => { comprasMap[c.idProveedor] = parseInt(c.count) || 0; });
    const insumosMap = {};
    insumosCounts.forEach(i => { insumosMap[i.idProveedor] = parseInt(i.count) || 0; });

    return proveedores.map(p => ({
      ...this._mapProveedor(p),
      comprasCount: comprasMap[p.idProveedor] || 0,
      tieneCompras: (comprasMap[p.idProveedor] || 0) > 0,
      insumosCount: insumosMap[p.idProveedor] || 0
    }));
  }

  static async getById(idProveedor) {
    const p = await Proveedor.findByPk(idProveedor, {
      include: [
        { model: TipoProveedor, as: 'tipoProveedor' },
        { model: TipoDocumento, as: 'tipoDocumento' }
      ]
    });
    if (!p) {
      const error = new Error('Proveedor no encontrado');
      error.statusCode = 404;
      throw error;
    }
    const [comprasCount, insumosCount, ultimasCompras] = await Promise.all([
      Compra.count({ where: { idProveedor } }).catch(() => 0),
      Insumo.count({ where: { idProveedor } }).catch(() => 0),
      Compra.findAll({
        where: { idProveedor },
        limit: 10,
        order: [['idCompra', 'DESC']],
        attributes: ['idCompra', 'numeroFactura', 'fechaFactura', 'total', 'estado'],
        raw: true
      }).catch(() => [])
    ]);

    const mapped = this._mapProveedor(p);
    return {
      ...mapped,
      comprasCount,
      tieneCompras: comprasCount > 0,
      insumosCount,
      ultimasCompras
    };
  }

  static _mapProveedor(p) {
    const docNombre = p.tipoDocumento ? p.tipoDocumento.nombre : (p.idTipoDocumento === 3 ? 'NIT' : 'CC');
    const isJuridica = p.idTipoDocumento === 3 || docNombre === 'NIT';

    let clasificacionArr = [];
    if (p.clasificacion) {
      try {
        if (typeof p.clasificacion === 'string' && (p.clasificacion.startsWith('[') || p.clasificacion.startsWith('{'))) {
          clasificacionArr = JSON.parse(p.clasificacion);
        } else if (typeof p.clasificacion === 'string') {
          clasificacionArr = p.clasificacion.split(',').map(s => s.trim()).filter(Boolean);
        }
      } catch (_) {
        clasificacionArr = [String(p.clasificacion).trim()];
      }
    }
    if (!Array.isArray(clasificacionArr) || clasificacionArr.length === 0) {
      const defaultTipo = p.tipoProveedor ? p.tipoProveedor.nombre : (p.idTipoProveedor === 2 ? 'Proveedor' : p.idTipoProveedor === 3 ? 'Fabricante' : 'Mayorista');
      clasificacionArr = [defaultTipo];
    }
    clasificacionArr = [...new Set(clasificacionArr.map(c => {
      const low = String(c).toLowerCase();
      if (low.includes('distrib') || low.includes('prov')) return 'Proveedor';
      if (low.includes('fabri')) return 'Fabricante';
      return 'Mayorista';
    }))];

    const tipoProvNombre = clasificacionArr.join(', ');

    return {
      idProveedor: p.idProveedor,
      id: p.idProveedor,
      nombre: p.nombre,
      idTipoProveedor: p.idTipoProveedor || 1,
      clasificacion: clasificacionArr,
      tiposProveedor: clasificacionArr,
      tipoProveedor: tipoProvNombre,
      tipoProveedorNombre: tipoProvNombre,
      esMayorista: clasificacionArr.includes('Mayorista'),
      esProveedor: clasificacionArr.includes('Proveedor'),
      esFabricante: clasificacionArr.includes('Fabricante'),
      idTipoDocumento: p.idTipoDocumento || (isJuridica ? 3 : 1),
      tipoDocumento: docNombre,
      tipoPersona: isJuridica ? 'Jurídica' : 'Natural',
      numeroDocumento: p.numeroDocumento || '',
      nit: p.numeroDocumento || '',
      documento: p.numeroDocumento || '',
      telefono: p.telefono || '',
      correo: p.correo || '',
      email: p.correo || '',
      direccion: p.direccion || '',
      nombreContacto: p.nombreContacto || '',
      contacto: p.nombreContacto || '',
      estado: p.estado === 1 ? 'Activo' : 'Inactivo',
      eliminado: p.eliminado || 0
    };
  }

  static async create(data) {
    let {
      nombre, numeroDocumento, nit, documento, telefono, correo, email,
      direccion, tipoPersona, idTipoProveedor, tipoProveedor,
      idTipoDocumento, estado, nombreContacto, contacto
    } = data;

    const finalNumeroDocumento = numeroDocumento || nit || documento || '';
    const finalCorreo = correo || email || '';
    let finalNombreContacto = nombreContacto || contacto || '';

    // Validaciones estructuradas
    const errores = [];

    if (!nombre || !String(nombre).trim())
      errores.push({ campo: 'nombre', mensaje: 'El nombre del proveedor es requerido.' });

    if (!finalNumeroDocumento || !String(finalNumeroDocumento).trim())
      errores.push({ campo: 'numeroDocumento', mensaje: 'El número de documento es obligatorio.' });
    else if (!/^[\d.\-\s]+$/.test(String(finalNumeroDocumento).trim()))
      errores.push({ campo: 'numeroDocumento', mensaje: 'El número de documento solo puede contener dígitos, puntos y guiones.' });

    if (!telefono || !String(telefono).trim())
      errores.push({ campo: 'telefono', mensaje: 'El teléfono es obligatorio.' });
    else if (!/^[\d\s+\-()]+$/.test(String(telefono).trim()))
      errores.push({ campo: 'telefono', mensaje: 'El teléfono solo puede contener dígitos. No se permiten letras.' });

    if (!finalNombreContacto || !String(finalNombreContacto).trim())
      errores.push({ campo: 'nombreContacto', mensaje: 'La persona de contacto es obligatoria.' });
    else if (/\d/.test(String(finalNombreContacto)))
      errores.push({ campo: 'nombreContacto', mensaje: 'El nombre de contacto no puede contener números.' });

    if (errores.length > 0) {
      const error = new Error('Error de validación');
      error.statusCode = 400;
      error.errores = errores;
      throw error;
    }

    const existing = await Proveedor.findOne({ where: { nombre: nombre.trim() } });
    if (existing) {
      const error = new Error('Ya existe un proveedor registrado con ese nombre');
      error.statusCode = 400;
      throw error;
    }

    if (finalNumeroDocumento && String(finalNumeroDocumento).trim()) {
      const existingDoc = await Proveedor.findOne({
        where: { numeroDocumento: String(finalNumeroDocumento).trim() }
      });
      if (existingDoc) {
        const error = new Error(`Ya existe un proveedor registrado con el número de documento / NIT: ${finalNumeroDocumento}`);
        error.statusCode = 400;
        throw error;
      }
    }

    // Determinar idTipoProveedor (1: Mayorista, 2: Distribuidor, 3: Fabricante)
    let parsedTipoProv = Number(idTipoProveedor);
    if (!parsedTipoProv || isNaN(parsedTipoProv)) {
      if (tipoProveedor === 'Distribuidor') parsedTipoProv = 2;
      else if (tipoProveedor === 'Fabricante') parsedTipoProv = 3;
      else parsedTipoProv = 1; // Mayorista
    }

    // Determinar idTipoDocumento y tipoPersona
    let parsedTipoDoc = Number(idTipoDocumento);
    const esJuridica = tipoPersona === 'Jurídica' || parsedTipoDoc === 3;
    if (esJuridica) {
      parsedTipoDoc = 3; // NIT
    } else {
      if (!parsedTipoDoc || parsedTipoDoc === 3) parsedTipoDoc = 1; // CC por defecto para Natural
    }

    // Si es Persona Natural y no viene nombre de contacto, autocompletar con el nombre principal
    if (!esJuridica && (!finalNombreContacto || !String(finalNombreContacto).trim())) {
      finalNombreContacto = nombre.trim();
    }

    const estadoInt = (estado === undefined || estado === 'Activo' || estado === 1 || estado === '1') ? 1 : 0;

    const rawClasif = data.tiposProveedor || data.clasificacion;
    let clasificacionStr = null;
    if (Array.isArray(rawClasif) && rawClasif.length > 0) {
      clasificacionStr = JSON.stringify(rawClasif);
    } else if (typeof rawClasif === 'string' && rawClasif.trim()) {
      clasificacionStr = JSON.stringify(rawClasif.split(',').map(s => s.trim()).filter(Boolean));
    }

    const proveedor = await Proveedor.create({
      nombre: nombre.trim(),
      idTipoProveedor: parsedTipoProv,
      clasificacion: clasificacionStr,
      idTipoDocumento: parsedTipoDoc,
      numeroDocumento: finalNumeroDocumento,
      telefono: telefono || '',
      correo: finalCorreo,
      direccion: direccion || '',
      nombreContacto: finalNombreContacto,
      estado: estadoInt
    });

    const TrazabilidadService = require('./trazabilidadService');
    await TrazabilidadService.create({
      tipo: 'Creado',
      entidadNombre: proveedor.nombre,
      detalle: `Se registró el proveedor en el sistema: ${proveedor.nombre}`,
      motivo: 'Registro inicial de proveedor',
      usuarioId: data.usuarioId || null
    }).catch(() => {});

    return this.getById(proveedor.idProveedor);
  }

  static async update(idProveedor, data) {
    const p = await Proveedor.findByPk(idProveedor);
    if (!p) {
      const error = new Error('Proveedor no encontrado');
      error.statusCode = 404;
      throw error;
    }

    let {
      nombre, numeroDocumento, nit, documento, telefono, correo, email,
      direccion, tipoPersona, idTipoProveedor, tipoProveedor,
      idTipoDocumento, estado, nombreContacto, contacto
    } = data;

    const finalNumeroDocumento = numeroDocumento !== undefined ? numeroDocumento : (nit !== undefined ? nit : documento);
    const finalCorreo = correo !== undefined ? correo : email;
    const finalNombreContacto = nombreContacto !== undefined ? nombreContacto : contacto;

    const errores = [];

    if (finalNumeroDocumento !== undefined && String(finalNumeroDocumento).trim() !== '') {
      if (!/^[\d]+$/.test(String(finalNumeroDocumento).trim()))
        errores.push({ campo: 'numeroDocumento', mensaje: 'El número de documento solo puede contener dígitos, sin puntos ni guiones.' });
    }

    if (telefono !== undefined && String(telefono).trim() !== '') {
      if (!/^[\d\s+\-()]+$/.test(String(telefono).trim()))
        errores.push({ campo: 'telefono', mensaje: 'El teléfono solo puede contener dígitos. No se permiten letras.' });
    }

    if (finalNombreContacto !== undefined && String(finalNombreContacto).trim() !== '') {
      if (/\d/.test(String(finalNombreContacto)))
        errores.push({ campo: 'nombreContacto', mensaje: 'El nombre de contacto no puede contener números.' });
    }

    if (errores.length > 0) {
      const error = new Error('Error de validación');
      error.statusCode = 400;
      error.errores = errores;
      throw error;
    }

    if (finalNumeroDocumento && String(finalNumeroDocumento).trim()) {
      const { Op } = require('sequelize');
      const existingDoc = await Proveedor.findOne({
        where: {
          numeroDocumento: String(finalNumeroDocumento).trim(),
          idProveedor: { [Op.ne]: idProveedor }
        }
      });
      if (existingDoc) {
        const error = new Error(`Ya existe otro proveedor registrado con el número de documento / NIT: ${finalNumeroDocumento}`);
        error.statusCode = 400;
        throw error;
      }
    }

    if (nombre !== undefined) p.nombre = nombre.trim();
    if (finalNumeroDocumento !== undefined) p.numeroDocumento = finalNumeroDocumento || '';
    if (telefono !== undefined) p.telefono = telefono || '';
    if (finalCorreo !== undefined) p.correo = finalCorreo || '';
    if (direccion !== undefined) p.direccion = direccion || '';
    if (finalNombreContacto !== undefined) p.nombreContacto = finalNombreContacto || '';

    // Actualizar tipo de proveedor y clasificacion
    const rawClasif = data.tiposProveedor || data.clasificacion;
    if (rawClasif !== undefined) {
      if (Array.isArray(rawClasif) && rawClasif.length > 0) {
        p.clasificacion = JSON.stringify(rawClasif);
      } else if (typeof rawClasif === 'string' && rawClasif.trim()) {
        p.clasificacion = JSON.stringify(rawClasif.split(',').map(s => s.trim()).filter(Boolean));
      }
    }

    if (idTipoProveedor !== undefined) {
      p.idTipoProveedor = Number(idTipoProveedor) || p.idTipoProveedor;
    } else if (tipoProveedor !== undefined) {
      if (tipoProveedor === 'Distribuidor' || tipoProveedor === 'Proveedor') p.idTipoProveedor = 2;
      else if (tipoProveedor === 'Fabricante') p.idTipoProveedor = 3;
      else if (tipoProveedor === 'Mayorista') p.idTipoProveedor = 1;
    }

    // Actualizar tipo de documento / persona
    if (tipoPersona !== undefined) {
      if (tipoPersona === 'Jurídica') p.idTipoDocumento = 3;
      else if (p.idTipoDocumento === 3) p.idTipoDocumento = 1;
    }
    if (idTipoDocumento !== undefined) {
      p.idTipoDocumento = Number(idTipoDocumento) || p.idTipoDocumento;
    }

    if (estado !== undefined) p.estado = (estado === 'Activo' || estado === 1) ? 1 : 0;

    await p.save();

    const TrazabilidadService = require('./trazabilidadService');
    await TrazabilidadService.create({
      tipo: 'Editado',
      entidadNombre: p.nombre,
      detalle: `Se actualizaron los datos del proveedor: ${p.nombre}`,
      motivo: 'Actualización de datos',
      usuarioId: data.usuarioId || null
    }).catch(() => {});

    return this.getById(idProveedor);
  }

  static async toggleEstado(idProveedor, estado, options = {}) {
    const p = await Proveedor.findByPk(idProveedor);
    if (!p) {
      const error = new Error('Proveedor no encontrado');
      error.statusCode = 404;
      throw error;
    }

    let nuevoEstado = 1;
    if (estado !== undefined) {
      nuevoEstado = (estado === 'Activo' || estado === 1 || estado === '1' || estado === true) ? 1 : 0;
    } else {
      nuevoEstado = p.estado === 1 ? 0 : 1;
    }

    p.estado = nuevoEstado;
    await p.save();

    const TrazabilidadService = require('./trazabilidadService');
    await TrazabilidadService.create({
      tipo: 'Estado Cambiado',
      entidadNombre: p.nombre,
      detalle: `El proveedor ${p.nombre} cambió su estado a ${nuevoEstado === 1 ? 'Activo' : 'Inactivo'}`,
      motivo: 'Cambio de estado',
      usuarioId: options.usuarioId || null
    }).catch(() => {});

    return this.getById(idProveedor);
  }

  static async delete(idProveedor, options = {}) {
    const p = await Proveedor.findByPk(idProveedor);
    if (!p) {
      const error = new Error('Proveedor no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const comprasAsociadas = await Compra.count({ where: { idProveedor } });
    if (comprasAsociadas > 0) {
      const error = new Error(`No se puede eliminar el proveedor "${p.nombre}" porque tiene ${comprasAsociadas} compra(s) registrada(s) en el sistema.`);
      error.statusCode = 400;
      throw error;
    }

    p.eliminado = 1;
    await p.save();

    const TrazabilidadService = require('./trazabilidadService');
    await TrazabilidadService.create({
      tipo: 'Eliminado',
      entidadNombre: p.nombre,
      detalle: `Se envió a la papelera el proveedor: ${p.nombre}`,
      motivo: 'Papelera de reciclaje',
      usuarioId: options.usuarioId || null
    }).catch(() => {});

    return { message: 'Proveedor enviado a la papelera exitosamente' };
  }

  static async restore(idProveedor, options = {}) {
    const p = await Proveedor.findByPk(idProveedor);
    if (!p) {
      const error = new Error('Proveedor no encontrado');
      error.statusCode = 404;
      throw error;
    }
    p.eliminado = 0;
    await p.save();

    const TrazabilidadService = require('./trazabilidadService');
    await TrazabilidadService.create({
      tipo: 'Restaurado',
      entidadNombre: p.nombre,
      detalle: `Se restauró el proveedor desde la papelera: ${p.nombre}`,
      motivo: 'Restauración desde papelera',
      usuarioId: options.usuarioId || null
    }).catch(() => {});

    return this.getById(idProveedor);
  }

  static async deletePermanente(idProveedor, options = {}) {
    const p = await Proveedor.findByPk(idProveedor);
    if (!p) {
      const error = new Error('Proveedor no encontrado');
      error.statusCode = 404;
      throw error;
    }

    const comprasAsociadas = await Compra.count({ where: { idProveedor } });
    if (comprasAsociadas > 0) {
      const error = new Error(`No se puede eliminar el proveedor "${p.nombre}" porque tiene ${comprasAsociadas} compra(s) registrada(s) en el sistema.`);
      error.statusCode = 400;
      throw error;
    }

    const insumosAsociados = await Insumo.count({ where: { idProveedor } });
    if (insumosAsociados > 0) {
      const error = new Error(`No se puede eliminar el proveedor "${p.nombre}" porque tiene ${insumosAsociados} insumo(s) asociado(s).`);
      error.statusCode = 400;
      throw error;
    }

    const nombreProv = p.nombre;
    await p.destroy();

    const TrazabilidadService = require('./trazabilidadService');
    await TrazabilidadService.create({
      tipo: 'Eliminado permanente',
      entidadNombre: nombreProv,
      detalle: `Se eliminó permanentemente el proveedor: ${nombreProv}`,
      motivo: 'Eliminación física definitiva',
      usuarioId: options.usuarioId || null
    }).catch(() => {});

    const { resequenceTableIds } = require('../../infrastructure/utils/dbUtils');
    await resequenceTableIds('proveedor', 'idProveedor', ['insumo', 'compra']);

    return { message: 'Proveedor eliminado permanentemente' };
  }
}

module.exports = ProveedorService;
