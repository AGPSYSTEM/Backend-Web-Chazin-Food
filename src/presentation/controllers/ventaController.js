const VentaService = require('../../application/services/ventaService');
const { Cliente } = require('../../persistence/models');

const isClienteRole = (user) => String(user?.rol || '').toLowerCase().trim() === 'cliente';

/**
 * Devuelve true si la venta pertenece al cliente autenticado (por cuenta de usuario o registro de cliente).
 */
const ventaPerteneceAlCliente = (venta, idUsuario, idCliente) => {
  if (!venta) return false;
  if (idCliente && Number(venta.idCliente) === Number(idCliente)) return true;
  if (idUsuario && Number(venta.idUsuario) === Number(idUsuario) && !idCliente) return true;
  return false;
};

const getClienteIdDeUsuario = async (idUsuario) => {
  if (!idUsuario) return null;
  const cliente = await Cliente.findOne({ where: { idUsuario } });
  return cliente ? cliente.idCliente : null;
};

const getVentas = async (req, res, next) => {
  try {
    const filter = {
      periodo: req.query.periodo,
      estado: req.query.estado,
      search: req.query.search,
      fechaInicio: req.query.fechaInicio,
      fechaFin: req.query.fechaFin
    };
    const ventas = await VentaService.getAll(filter);

    // Los clientes solo pueden consultar sus propios pedidos ("Mis Pedidos")
    if (isClienteRole(req.user)) {
      const idUsuario = req.user.idUsuario || req.user.id;
      const idCliente = await getClienteIdDeUsuario(idUsuario);
      return res.json(ventas.filter(v => ventaPerteneceAlCliente(v, idUsuario, idCliente)));
    }

    res.json(ventas);
  } catch (error) {
    next(error);
  }
};

const getVentasStats = async (req, res, next) => {
  try {
    const filter = {
      periodo: req.query.periodo,
      estado: req.query.estado
    };
    const stats = await VentaService.getStats(filter);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

const getVentaById = async (req, res, next) => {
  try {
    const venta = await VentaService.getById(req.params.id);
    if (isClienteRole(req.user)) {
      const idUsuario = req.user.idUsuario || req.user.id;
      const idCliente = await getClienteIdDeUsuario(idUsuario);
      if (!ventaPerteneceAlCliente(venta, idUsuario, idCliente)) {
        return res.status(403).json({ message: 'No tienes permiso para consultar este pedido.' });
      }
    }
    res.json(venta);
  } catch (error) {
    next(error);
  }
};

const createVenta = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    // Si hay sesión, el usuario autenticado es quien registra la venta (evita suplantación)
    if (req.user) {
      payload.idUsuario = req.user.idUsuario || req.user.id || payload.idUsuario;
    }
    const venta = await VentaService.create(payload);
    res.status(201).json(venta);
  } catch (error) {
    next(error);
  }
};

const updateEstadoVenta = async (req, res, next) => {
  try {
    const venta = await VentaService.updateEstado(req.params.id, req.body.estado);
    res.json(venta);
  } catch (error) {
    next(error);
  }
};

const updateTiempoEntregaVenta = async (req, res, next) => {
  try {
    const venta = await VentaService.updateTiempoEntrega(req.params.id, req.body.tiempoEstimadoEntrega || req.body.tiempoEstimado);
    res.json(venta);
  } catch (error) {
    next(error);
  }
};

const aprobarPagoVenta = async (req, res, next) => {
  try {
    const venta = await VentaService.aprobarPago(req.params.id, req.user);
    res.json({ message: 'Pago aprobado exitosamente. El pedido ha pasado a producción.', venta });
  } catch (error) {
    next(error);
  }
};

const cancelarVenta = async (req, res, next) => {
  try {
    // Un cliente solo puede cancelar sus propios pedidos y mientras sigan pendientes
    if (isClienteRole(req.user)) {
      const venta = await VentaService.getById(req.params.id);
      const idUsuario = req.user.idUsuario || req.user.id;
      const idCliente = await getClienteIdDeUsuario(idUsuario);
      if (!ventaPerteneceAlCliente(venta, idUsuario, idCliente)) {
        return res.status(403).json({ message: 'No tienes permiso para cancelar este pedido.' });
      }
      if (String(venta.estadoEntrega || '').toUpperCase() !== 'PENDIENTE') {
        return res.status(400).json({ message: 'Solo puedes cancelar pedidos que aún no han entrado a preparación.' });
      }
    }
    const venta = await VentaService.cancelar(req.params.id);
    res.json(venta);
  } catch (error) {
    next(error);
  }
};

module.exports = { getVentas, getVentasStats, getVentaById, createVenta, updateEstadoVenta, updateTiempoEntregaVenta, cancelarVenta, aprobarPagoVenta };
