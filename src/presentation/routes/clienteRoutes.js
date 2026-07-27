const express = require('express');
const router = express.Router();
const { getClientes, getClienteById, createCliente, updateCliente, deleteCliente } = require('../controllers/clienteController');

router.route('/')
  .get(getClientes)
  .post(createCliente);

router.route('/:id')
  .get(getClienteById)
  .put(updateCliente)
  .delete(deleteCliente);

module.exports = router;
