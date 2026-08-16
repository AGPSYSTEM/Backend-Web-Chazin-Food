const express = require('express');
const router = express.Router();
const { getClientes, getClientesStats, getClienteById, createCliente, updateCliente, deleteCliente } = require('../controllers/clienteController');

router.route('/')
  .get(getClientes)
  .post(createCliente);

router.get('/stats', getClientesStats);

router.route('/:id')
  .get(getClienteById)
  .put(updateCliente)
  .delete(deleteCliente);

module.exports = router;
