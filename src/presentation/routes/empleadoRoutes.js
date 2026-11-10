const express = require('express');
const router = express.Router();
const {
  getEmpleados,
  getEmpleadoById,
  createEmpleado,
  updateEmpleado,
  toggleEstadoEmpleado,
  deleteEmpleado,
  restoreEmpleado
} = require('../controllers/empleadoController');

router.get('/', getEmpleados);
router.post('/', createEmpleado);
router.get('/:id', getEmpleadoById);
router.put('/:id', updateEmpleado);
router.patch('/:id/estado', toggleEstadoEmpleado);
router.put('/:id/estado', toggleEstadoEmpleado);
router.delete('/:id', deleteEmpleado);
router.patch('/:id/restaurar', restoreEmpleado);
router.put('/:id/restaurar', restoreEmpleado);

module.exports = router;

