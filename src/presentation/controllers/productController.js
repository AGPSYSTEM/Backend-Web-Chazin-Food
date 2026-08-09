const ProductService = require('../../application/services/productService');

const getProducts = async (req, res, next) => {
  try {
    const products = await ProductService.getProducts();
    res.json(products);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const createdProduct = await ProductService.createProduct(req.body);
    res.status(201).json(createdProduct);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await ProductService.updateProduct(req.params.id, req.body);
    res.json(updatedProduct);
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

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
