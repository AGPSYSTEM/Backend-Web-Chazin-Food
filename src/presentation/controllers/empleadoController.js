const { Empleado, User, Role } = require('../../persistence/models');
const { Op } = require('sequelize');

/**
 * Normaliza cualquier formato de estado a 'Activo', 'Inactivo' o 'Incapacitado'
 */
const normalizeEstadoValue = (val) => {
  if (val === undefined || val === null || val === '') return 'Activo';
  const str = String(val).trim();
  const lower = str.toLowerCase();
  if (lower === 'incapacitado' || str === '2') return 'Incapacitado';
  if (lower === 'inactivo' || str === '0' || val === false) return 'Inactivo';
  return 'Activo';
};

/**
 * Listar empleados (soporta búsqueda, filtrado por estado, rol/cargo, y papelera)
 */
const getEmpleados = async (req, res, next) => {
  try {
    const { search, estado, cargo, rol, papelera } = req.query;
    const where = {};

    if (papelera === 'true') {
      where.eliminado = 1;
    } else {
      where.eliminado = 0;
    }

    if (estado !== undefined && estado !== '' && estado !== 'Todos') {
      if (estado === 'Activo' || estado === '1') {
        where.estado = { [Op.in]: ['Activo', 1, '1'] };
      } else if (estado === 'Inactivo' || estado === '0') {
        where.estado = { [Op.in]: ['Inactivo', 0, '0'] };
      } else if (estado === 'Incapacitado' || estado === '2') {
        where.estado = { [Op.in]: ['Incapacitado', 2, '2'] };
      } else {
        where.estado = estado;
      }
    }

    const filtroRol = (rol || cargo || '').trim();
    if (filtroRol && filtroRol !== 'Todos') {
      where.cargo = filtroRol;
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      where[Op.or] = [
        { nombre: { [Op.like]: q } },
        { apellidos: { [Op.like]: q } },
        { numeroDocumento: { [Op.like]: q } },
        { cargo: { [Op.like]: q } },
        { correo: { [Op.like]: q } },
        { telefono: { [Op.like]: q } }
      ];
    }

    const empleados = await Empleado.findAll({
      where,
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['idUsuario', 'nombre', 'apellidos', 'email', 'estado', 'idRol'],
          include: [
            {
              model: Role,
              as: 'rolInfo',
              attributes: ['idRol', 'nombre'],
              required: false
            }
          ],
          required: false
        }
      ],
      order: [['idEmpleado', 'ASC']]
    });

    res.json(empleados);
  } catch (error) {
    next(error);
  }
};

/**
 * Consultar un empleado por su ID
 */
const getEmpleadoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const empleado = await Empleado.findByPk(id, {
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['idUsuario', 'nombre', 'apellidos', 'email', 'estado', 'idRol'],
          include: [
            {
              model: Role,
              as: 'rolInfo',
              attributes: ['idRol', 'nombre'],
              required: false
            }
          ],
          required: false
        }
      ]
    });

    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    res.json(empleado);
  } catch (error) {
    next(error);
  }
};

/**
 * Registrar un nuevo empleado
 */
const createEmpleado = async (req, res, next) => {
  try {
    const {
      nombre,
      apellidos,
      tipoDocumento = 'C.C.',
      numeroDocumento,
      telefono,
      correo,
      direccion,
      cargo,
      rol,
      fechaInicio,
      fechaFin,
      fechaContratacion,
      tipoContrato = 'Término Fijo',
      salario = 0,
      turno = 'Completo',
      estado = 'Activo',
      idUsuario,
      foto
    } = req.body;

    const rolFinal = (rol || cargo || '').trim();

    if (!nombre || !apellidos || !numeroDocumento || !rolFinal) {
      return res.status(400).json({
        message: 'Los campos Número de Documento, Nombres, Apellidos y Rol son obligatorios'
      });
    }

    const docTrim = String(numeroDocumento).trim();
    if (docTrim.length < 5) {
      return res.status(400).json({
        message: 'El número de documento debe tener al menos 5 dígitos'
      });
    }

    const fInicio = fechaInicio || fechaContratacion || new Date().toISOString().split('T')[0];
    const fFin = fechaFin ? String(fechaFin).split('T')[0] : null;

    if (fFin && fInicio && fFin < fInicio) {
      return res.status(400).json({
        message: 'La fecha de finalización no puede ser anterior a la fecha de inicio de contratación'
      });
    }

    // Validar que el número de documento sea único
    const existe = await Empleado.findOne({
      where: {
        numeroDocumento: docTrim,
        eliminado: 0
      }
    });

    if (existe) {
      return res.status(400).json({
        message: `Ya existe un empleado registrado con el documento ${docTrim}`
      });
    }

    // Regla de estado automático: Si hoy es posterior a fechaFin, el contrato finalizó
    let estadoFinal = normalizeEstadoValue(estado);
    const todayStr = new Date().toISOString().split('T')[0];
    if (fFin && todayStr > fFin && estadoFinal === 'Activo') {
      estadoFinal = 'Inactivo';
    }

    const nuevoEmpleado = await Empleado.create({
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      tipoDocumento: tipoDocumento || 'C.C.',
      numeroDocumento: docTrim,
      telefono: telefono ? telefono.trim() : null,
      correo: correo ? correo.trim() : null,
      direccion: direccion ? direccion.trim() : null,
      cargo: rolFinal,
      fechaContratacion: fInicio,
      fechaInicio: fInicio,
      fechaFin: fFin,
      tipoContrato: tipoContrato || 'Término Fijo',
      salario: Number(salario) || 0,
      turno: turno || 'Completo',
      estado: estadoFinal,
      eliminado: 0,
      idUsuario: idUsuario ? Number(idUsuario) : null,
      foto: foto || null
    });

    res.status(201).json(nuevoEmpleado);
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar información del empleado
 */
const updateEmpleado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const empleado = await Empleado.findByPk(id);

    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    const {
      nombre,
      apellidos,
      tipoDocumento,
      numeroDocumento,
      telefono,
      correo,
      direccion,
      cargo,
      rol,
      fechaInicio,
      fechaFin,
      fechaContratacion,
      tipoContrato,
      salario,
      turno,
      estado,
      idUsuario,
      foto
    } = req.body;

    const rolFinal = (rol !== undefined ? rol : cargo !== undefined ? cargo : empleado.cargo || '').trim();

    // Si cambió el documento, validar que no choque con otro
    if (numeroDocumento && numeroDocumento.trim() !== empleado.numeroDocumento) {
      const docTrim = numeroDocumento.trim();
      const existe = await Empleado.findOne({
        where: {
          numeroDocumento: docTrim,
          idEmpleado: { [Op.ne]: id },
          eliminado: 0
        }
      });
      if (existe) {
        return res.status(400).json({
          message: `El documento ${docTrim} ya está en uso por otro empleado`
        });
      }
    }

    const fInicio = fechaInicio !== undefined ? fechaInicio : (fechaContratacion !== undefined ? fechaContratacion : empleado.fechaInicio || empleado.fechaContratacion);
    const fFin = fechaFin !== undefined ? (fechaFin ? String(fechaFin).split('T')[0] : null) : empleado.fechaFin;

    if (fFin && fInicio && fFin < fInicio) {
      return res.status(400).json({
        message: 'La fecha de finalización no puede ser anterior a la fecha de inicio de contratación'
      });
    }

    let estadoFinal = estado !== undefined ? normalizeEstadoValue(estado) : empleado.estado;
    const todayStr = new Date().toISOString().split('T')[0];
    if (fFin && todayStr > fFin && estadoFinal === 'Activo') {
      estadoFinal = 'Inactivo';
    }

    await empleado.update({
      nombre: nombre !== undefined ? nombre.trim() : empleado.nombre,
      apellidos: apellidos !== undefined ? apellidos.trim() : empleado.apellidos,
      tipoDocumento: tipoDocumento !== undefined ? tipoDocumento : empleado.tipoDocumento,
      numeroDocumento: numeroDocumento !== undefined ? numeroDocumento.trim() : empleado.numeroDocumento,
      telefono: telefono !== undefined ? telefono.trim() : empleado.telefono,
      correo: correo !== undefined ? correo.trim() : empleado.correo,
      direccion: direccion !== undefined ? direccion.trim() : empleado.direccion,
      cargo: rolFinal || empleado.cargo,
      fechaContratacion: fInicio,
      fechaInicio: fInicio,
      fechaFin: fFin,
      tipoContrato: tipoContrato !== undefined ? tipoContrato : empleado.tipoContrato,
      salario: salario !== undefined ? Number(salario) : empleado.salario,
      turno: turno !== undefined ? turno : empleado.turno,
      estado: estadoFinal,
      idUsuario: idUsuario !== undefined ? (idUsuario ? Number(idUsuario) : null) : empleado.idUsuario,
      foto: foto !== undefined ? foto : empleado.foto
    });

    res.json(empleado);
  } catch (error) {
    next(error);
  }
};

/**
 * Cambiar estado activo/inactivo
 */
const toggleEstadoEmpleado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const empleado = await Empleado.findByPk(id);

    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    const esActivo = empleado.estado === 'Activo' || empleado.estado === 1 || empleado.estado === '1';
    const nuevoEstado = esActivo ? 'Inactivo' : 'Activo';
    await empleado.update({ estado: nuevoEstado });

    res.json({
      message: `Empleado ${nuevoEstado === 'Activo' ? 'activado' : 'desactivado'} exitosamente`,
      idEmpleado: empleado.idEmpleado,
      estado: nuevoEstado
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar empleado (borrado lógico a la papelera)
 */
const deleteEmpleado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const empleado = await Empleado.findByPk(id);

    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    await empleado.update({ eliminado: 1, estado: 0 });

    res.json({
      message: 'Empleado enviado a la papelera exitosamente',
      idEmpleado: empleado.idEmpleado
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Restaurar empleado desde la papelera
 */
const restoreEmpleado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const empleado = await Empleado.findByPk(id);

    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    await empleado.update({ eliminado: 0, estado: 'Activo' });

    res.json({
      message: 'Empleado restaurado exitosamente',
      idEmpleado: empleado.idEmpleado
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmpleados,
  getEmpleadoById,
  createEmpleado,
  updateEmpleado,
  toggleEstadoEmpleado,
  deleteEmpleado,
  restoreEmpleado
};

