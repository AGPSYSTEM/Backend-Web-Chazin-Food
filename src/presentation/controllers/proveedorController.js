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
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const updateProveedor = async (req, res, next) => {
  try {
    const actualizado = await ProveedorService.update(req.params.id, req.body);
    res.json(actualizado);
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

module.exports = {
  getProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor,
};
