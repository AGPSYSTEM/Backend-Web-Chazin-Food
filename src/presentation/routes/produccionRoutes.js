const express = require('express');
const router = express.Router();
const { getOrdenes, createOrden, updateEstadoOrden, deleteOrden } = require('../controllers/produccionController');

router.route('/')
  .get(getOrdenes)
  .post(createOrden);

router.route('/:id')
  .delete(deleteOrden);

router.put('/:id/estado', updateEstadoOrden);

module.exports = router;
