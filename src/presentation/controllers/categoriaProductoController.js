const CategoriaProductoService = require('../../application/services/categoriaProductoService');
/*Recibe la petición para consultar todas las categorías, llama al método getAll() del servicio y devuelve la lista en formato JSON*/
const getCategorias = async (req, res, next) => {
  try {
    const categorias = await CategoriaProductoService.getAll();
    res.json(categorias);
  } catch (error) {
    next(error);
  }
};
/*Obtiene una categoría específica utilizando el ID recibido en la URL y devuelve su información. */
const getCategoriaById = async (req, res, next) => {
  try {
    const categoria = await CategoriaProductoService.getById(req.params.id);
    res.json(categoria);
  } catch (error) {
    next(error);
  }
};
/*Recibe los datos enviados por el cliente, llama al servicio
 para crear la categoría y responde con código HTTP 201, indicando que el recurso fue creado correctamente.*/
const createCategoria = async (req, res, next) => {
  try {
    const categoria = await CategoriaProductoService.create(req.body);
    res.status(201).json(categoria);
  } catch (error) {
    next(error);
  }
};
/*Recibe el ID y los nuevos datos de la categoría, llama al servicio para actualizarla y devuelve la información actualizada. */
const updateCategoria = async (req, res, next) => {
  try {
    const categoria = await CategoriaProductoService.update(req.params.id, req.body);
    res.json(categoria);
  } catch (error) {
    next(error);
  }
};
/*Recibe el ID de la categoría, llama al servicio para eliminarla y devuelve un mensaje con el resultado.*/
const deleteCategoria = async (req, res, next) => {
  try {
    const result = await CategoriaProductoService.delete(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategorias, getCategoriaById, createCategoria, updateCategoria, deleteCategoria };
