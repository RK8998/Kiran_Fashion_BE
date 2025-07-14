const ProductModel = require('../models/products.js');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { ApiResponse } = require('../utils/constants');

const getProductsListController = async (req, res) => {
  try {
    const { page, rows } = req.query;
    const offset = (page - 1) * rows;

    const filter = { deleted_at: null };
    const results = await ProductModel.find(filter).skip(offset).limit(rows);
    const totalRecords = await ProductModel.countDocuments(filter);

    sendSuccessResponse(res, {
      ...ApiResponse.SUCCESS,
      data: { results, totalRecords },
      message: 'Products fetched successfully'
    });
  } catch (error) {
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to create user',
      error
    });
  }
};

const getProductByIdController = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return sendErrorResponse(res, {
        ...ApiResponse.BAD_REQUEST,
        message: 'Product ID is required'
      });
    }

    const product = await ProductModel.findOne({ _id: productId, deleted_at: null });

    if (!product) {
      return sendErrorResponse(res, {
        ...ApiResponse.NOT_FOUND,
        message: 'Product Not Found.'
      });
    }

    sendSuccessResponse(res, {
      ...ApiResponse.SUCCESS,
      data: product,
      message: 'Products fetched successfully'
    });
  } catch (error) {
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to create user',
      error
    });
  }
};

const createProductController = async (req, res) => {
  try {
    const data = req.body;

    const newProduct = new ProductModel({ ...data });

    await newProduct.save();

    sendSuccessResponse(res, {
      ...ApiResponse.SUCCESS,
      data: newProduct,
      message: 'Products created successfully'
    });
  } catch (error) {
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to create user',
      error
    });
  }
};

const deleteProductController = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return sendErrorResponse(res, {
        ...ApiResponse.BAD_REQUEST,
        message: 'Product ID is required'
      });
    }

    const product = await ProductModel.findOne({
      _id: productId,
      deleted_at: null
    });

    if (!product) {
      return sendErrorResponse(res, {
        ...ApiResponse.NOT_FOUND,
        data: null,
        message: 'Product Not found'
      });
    }

    const deletedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        deleted_at: new Date()
      },
      { new: true }
    );

    if (!deletedProduct)
      return sendErrorResponse(res, {
        ...ApiResponse.BAD_REQUEST,
        message: 'Failed to delete Product.'
      });

    sendSuccessResponse(res, {
      ...ApiResponse.SUCCESS,
      data: deletedProduct,
      message: 'Product deleted successfully.'
    });
  } catch (error) {
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to create user',
      error
    });
  }
};

const updateProductController = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;

    const updatedProduct = await ProductModel.findOneAndUpdate(
      { _id: productId, deleted_at: null },
      data,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedProduct) {
      return sendSuccessResponse(res, {
        ...ApiResponse.NOT_FOUND,
        message: 'Product not found',
        data: []
      });
    }

    sendSuccessResponse(res, {
      ...ApiResponse.SUCCESS,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    // res.status(500).json({ error: 'Failed to create user' });
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Failed to create user',
      error
    });
  }
};

module.exports = {
  getProductsListController,
  getProductByIdController,
  createProductController,
  deleteProductController,
  updateProductController
};
