const ProveedorService = require('../../application/services/proveedorService');

const getProveedores = async (req, res, next) => {
  try {
    const proveedores = await ProveedorService.getAll();
    res.json(proveedores);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const getProveedorById = async (req, res, next) => {
  try {
    const proveedor = await ProveedorService.getById(req.params.id);
    res.json(proveedor);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const createProveedor = async (req, res, next) => {
  try {
    const nuevoProveedor = await ProveedorService.create(req.body);
    res.status(201).json(nuevoProveedor);
  } catch (error) {
    const status = error.statusCode || 500;
    if (error.errores) {
      return res.status(status).json({
        mensaje: error.message,
        errores: error.errores,
      });
    }
    res.status(status);
    next(error);
  }
};

const updateProveedor = async (req, res, next) => {
  try {
    const actualizado = await ProveedorService.update(req.params.id, req.body);
    res.json(actualizado);
  } catch (error) {
    const status = error.statusCode || 500;
    if (error.errores) {
      return res.status(status).json({
        mensaje: error.message,
        errores: error.errores,
      });
    }
    res.status(status);
    next(error);
  }
};

const toggleProveedorEstado = async (req, res, next) => {
  try {
    const { estado } = req.body;
    const result = await ProveedorService.toggleEstado(req.params.id, estado);
    res.json(result);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const deleteProveedor = async (req, res, next) => {
  try {
    const result = await ProveedorService.delete(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const restoreProveedor = async (req, res, next) => {
  try {
    const restaurado = await ProveedorService.restore(req.params.id);
    res.json(restaurado);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const deletePermanenteProveedor = async (req, res, next) => {
  try {
    const result = await ProveedorService.deletePermanente(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

module.exports = {
  getProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  toggleProveedorEstado,
  deleteProveedor,
  restoreProveedor,
  deletePermanenteProveedor,
};
