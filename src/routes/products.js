const express = require('express');
const router = express.Router();

const {
  getProductsListController,
  getProductByIdController,
  createProductController,
  deleteProductController,
  updateProductController
} = require('../controllers/products.controller');

const { authenticate } = require('../middleware/authenticate');

router.get('/', authenticate, getProductsListController);
router.get('/:id', authenticate, getProductByIdController);
router.post('/', authenticate, createProductController);
router.delete('/:id', authenticate, deleteProductController);
router.put('/:id', authenticate, updateProductController);

module.exports = { productRoutes: router };
