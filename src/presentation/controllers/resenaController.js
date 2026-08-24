const ResenaService = require('../../application/services/resenaService');

const getProductResenas = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const data = await ResenaService.getByProducto(parseInt(idProducto, 10));
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getRatingsBulk = async (req, res, next) => {
  try {
    // expects ?ids=1,2,3
    const idsParam = req.query.ids || '';
    const ids = idsParam.split(',').map(id => parseInt(id.trim(), 10)).filter(n => !isNaN(n));
    const data = await ResenaService.getRatingResumenBulk(ids);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getMiResena = async (req, res, next) => {
  try {
    const idUsuario = req.user?.id || req.user?.idUsuario;
    const { idProducto } = req.params;
    const data = await ResenaService.getMia(idUsuario, parseInt(idProducto, 10));
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createResena = async (req, res, next) => {
  try {
    const idUsuario = req.user?.id || req.user?.idUsuario;
    const { idProducto, puntuacion, comentario } = req.body;
    const data = await ResenaService.create(idUsuario, { idProducto, puntuacion, comentario });
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

const updateResena = async (req, res, next) => {
  try {
    const idUsuario = req.user?.id || req.user?.idUsuario;
    const idResena = parseInt(req.params.id, 10);
    const { puntuacion, comentario } = req.body;
    const data = await ResenaService.update(idResena, idUsuario, { puntuacion, comentario });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const deleteResena = async (req, res, next) => {
  try {
    const idUsuario = req.user?.id || req.user?.idUsuario;
    const idResena = parseInt(req.params.id, 10);
    const data = await ResenaService.delete(idResena, idUsuario);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProductResenas,
  getRatingsBulk,
  getMiResena,
  createResena,
  updateResena,
  deleteResena
};
