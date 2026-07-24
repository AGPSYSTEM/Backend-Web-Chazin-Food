const OrderService = require('../../application/services/orderService');

const createOrder = async (req, res, next) => {
  try {
    const clienteId = req.user ? (req.user._id || req.user.id) : null;
    const createdOrder = await OrderService.createOrder({
      ...req.body,
      clienteId
    });
    res.status(201).json(createdOrder);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await OrderService.getOrders();
    res.json(orders);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await OrderService.getOrderById(req.params.id);
    res.json(order);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { estado } = req.body;
    const updatedOrder = await OrderService.updateOrderStatus(req.params.id, estado);
    res.json(updatedOrder);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
