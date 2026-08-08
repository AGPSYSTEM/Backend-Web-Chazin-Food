const ProduccionService = require('../../application/services/produccionService');
/*Obtiene todas las órdenes de producción. */
const getOrdenes = async (req, res, next) => {
  try {
    const ordenes = await ProduccionService.getAll();
    res.json(ordenes);
  } catch (error) {
    next(error);
  }
};
/*Crea una nueva orden de producción y responde con el código HTTP 201." */
const createOrden = async (req, res, next) => {
  try {
    const orden = await ProduccionService.create(req.body);
    res.status(201).json(orden);
  } catch (error) {
    next(error);
  }
};
/*Actualiza el estado de una orden de producción utilizando su ID.*/
const updateEstadoOrden = async (req, res, next) => {
  try {
    const orden = await ProduccionService.updateEstado(req.params.id, req.body.estado);
    res.json(orden);
  } catch (error) {
    next(error);
  }
};
/*Elimina una orden de producción. */
const deleteOrden = async (req, res, next) => {
  try {
    const result = await ProduccionService.delete(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { getOrdenes, createOrden, updateEstadoOrden, deleteOrden };
