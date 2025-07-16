const express = require('express');
const router = express.Router();
const {
  createSalesController,
  deleteSalesController,
  getSalesByIdController,
  getSalesListController,
  updateSalesController
} = require('../controllers/sales.controller');
const { authenticate } = require('../middleware/authenticate');

router.get('/', authenticate, getSalesListController);
router.get('/:id', authenticate, getSalesByIdController);
router.post('/', authenticate, createSalesController);
router.delete('/:id', authenticate, deleteSalesController);
router.put('/:id', authenticate, updateSalesController);

module.exports = { salesRoutes: router };
