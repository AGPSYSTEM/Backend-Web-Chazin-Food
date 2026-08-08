const ProductService = require('../../application/services/productService');
/*Obtiene todos los productos llamando al método getProducts() del servicio y devuelve la información en formato JSON. */
const getProducts = async (req, res, next) => {
  try {
    const products = await ProductService.getProducts();
    res.json(products);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};
/*Busca un producto por su ID y devuelve su información. */
const getProductById = async (req, res, next) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};
/*Recibe los datos enviados por el cliente, crea un nuevo producto y responde con el código HTTP 201,
 indicando que el recurso fue creado correctamente.*/
const createProduct = async (req, res, next) => {
  try {
    const createdProduct = await ProductService.createProduct(req.body);
    res.status(201).json(createdProduct);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};
/*Actualiza un producto utilizando el ID recibido y los nuevos datos enviados por el cliente. */
const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await ProductService.updateProduct(req.params.id, req.body);
    res.json(updatedProduct);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};
/*Elimina un producto y devuelve un mensaje confirmando la operación." */
const deleteProduct = async (req, res, next) => {
  try {
    const result = await ProductService.deleteProduct(req.params.id);
    res.json(result);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
