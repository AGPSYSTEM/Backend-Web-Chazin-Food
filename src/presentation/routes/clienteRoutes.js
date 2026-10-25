const express = require('express');
const router = express.Router();
const { getClientes, getClientesStats, getClienteById, createCliente, updateCliente, deleteCliente, getFidelidadCatalogo } = require('../controllers/clienteController');
const { protect, requirePrivilege } = require('../../infrastructure/middlewares/authMiddleware');

router.get('/fidelidad/catalogo', getFidelidadCatalogo);

router.route('/')
  .get(protect, getClientes)
  .post(protect, requirePrivilege(['Clientes', 'Gestión de Ventas'], 'Crear'), createCliente);

router.get('/stats', protect, getClientesStats);

router.route('/:id')
  .get(protect, getClienteById)
  .put(protect, requirePrivilege('Clientes', 'Editar'), updateCliente)
  .delete(protect, requirePrivilege('Clientes', 'Eliminar'), deleteCliente);

module.exports = router;
