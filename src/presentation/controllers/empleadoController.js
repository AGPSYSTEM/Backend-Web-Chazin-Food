const { Empleado, User, Role } = require('../../persistence/models');
const { Op } = require('sequelize');

/**
 * Listar empleados (soporta búsqueda, filtrado por estado, cargo, y papelera)
 */
const getEmpleados = async (req, res, next) => {
  try {
    const { search, estado, cargo, papelera } = req.query;
    const where = {};

    if (papelera === 'true') {
      where.eliminado = 1;
    } else {
      where.eliminado = 0;
    }

    if (estado !== undefined && estado !== '' && estado !== 'Todos') {
      where.estado = estado === 'Activo' || estado === '1' ? 1 : 0;
    }

    if (cargo && cargo !== 'Todos') {
      where.cargo = cargo;
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
      fechaContratacion,
      tipoContrato = 'Término Fijo',
      salario = 0,
      turno = 'Completo',
      estado = 1,
      idUsuario,
      foto
    } = req.body;

    if (!nombre || !apellidos || !numeroDocumento || !cargo) {
      return res.status(400).json({
        message: 'Los campos Nombre, Apellidos, Número de Documento y Cargo son obligatorios'
      });
    }

    // Validar que el número de documento sea único
    const existe = await Empleado.findOne({
      where: {
        numeroDocumento: numeroDocumento.trim(),
        eliminado: 0
      }
    });

    if (existe) {
      return res.status(400).json({
        message: `Ya existe un empleado registrado con el documento ${numeroDocumento}`
      });
    }

    const nuevoEmpleado = await Empleado.create({
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      tipoDocumento: tipoDocumento || 'C.C.',
      numeroDocumento: numeroDocumento.trim(),
      telefono: telefono ? telefono.trim() : null,
      correo: correo ? correo.trim() : null,
      direccion: direccion ? direccion.trim() : null,
      cargo: cargo.trim(),
      fechaContratacion: fechaContratacion || new Date(),
      tipoContrato: tipoContrato || 'Término Fijo',
      salario: Number(salario) || 0,
      turno: turno || 'Completo',
      estado: estado === 0 || estado === false ? 0 : 1,
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
      fechaContratacion,
      tipoContrato,
      salario,
      turno,
      estado,
      idUsuario,
      foto
    } = req.body;

    // Si cambió el documento, validar que no choque con otro
    if (numeroDocumento && numeroDocumento.trim() !== empleado.numeroDocumento) {
      const existe = await Empleado.findOne({
        where: {
          numeroDocumento: numeroDocumento.trim(),
          idEmpleado: { [Op.ne]: id },
          eliminado: 0
        }
      });
      if (existe) {
        return res.status(400).json({
          message: `El documento ${numeroDocumento} ya está en uso por otro empleado`
        });
      }
    }

    await empleado.update({
      nombre: nombre !== undefined ? nombre.trim() : empleado.nombre,
      apellidos: apellidos !== undefined ? apellidos.trim() : empleado.apellidos,
      tipoDocumento: tipoDocumento !== undefined ? tipoDocumento : empleado.tipoDocumento,
      numeroDocumento: numeroDocumento !== undefined ? numeroDocumento.trim() : empleado.numeroDocumento,
      telefono: telefono !== undefined ? telefono.trim() : empleado.telefono,
      correo: correo !== undefined ? correo.trim() : empleado.correo,
      direccion: direccion !== undefined ? direccion.trim() : empleado.direccion,
      cargo: cargo !== undefined ? cargo.trim() : empleado.cargo,
      fechaContratacion: fechaContratacion !== undefined ? fechaContratacion : empleado.fechaContratacion,
      tipoContrato: tipoContrato !== undefined ? tipoContrato : empleado.tipoContrato,
      salario: salario !== undefined ? Number(salario) : empleado.salario,
      turno: turno !== undefined ? turno : empleado.turno,
      estado: estado !== undefined ? (estado === 0 || estado === false ? 0 : 1) : empleado.estado,
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

    const nuevoEstado = empleado.estado === 1 ? 0 : 1;
    await empleado.update({ estado: nuevoEstado });

    res.json({
      message: `Empleado ${nuevoEstado === 1 ? 'activado' : 'desactivado'} exitosamente`,
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

    await empleado.update({ eliminado: 0, estado: 1 });

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

