const ClienteService = require('../../application/services/clienteService');

const getClientes = async (req, res, next) => {
  try {
    const clientes = await ClienteService.getAll();
    res.json(clientes);
  } catch (error) {
    next(error);
  }
};

const getClienteById = async (req, res, next) => {
  try {
    const cliente = await ClienteService.getById(req.params.id);
    res.json(cliente);
  } catch (error) {
    next(error);
  }
};

const createCliente = async (req, res, next) => {
  try {
    const cliente = await ClienteService.create(req.body);
    res.status(201).json(cliente);
  } catch (error) {
    next(error);
  }
};

const updateCliente = async (req, res, next) => {
  try {
    const cliente = await ClienteService.update(req.params.id, req.body);
    res.json(cliente);
  } catch (error) {
    next(error);
  }
};

const deleteCliente = async (req, res, next) => {
  try {
    const result = await ClienteService.delete(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { getClientes, getClienteById, createCliente, updateCliente, deleteCliente };
