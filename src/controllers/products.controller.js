const ProductModel = require('../models/products.js');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { ApiResponse } = require('../utils/constants');
const { DEFAULT_SORT_ORDER } = require('../constant/app.constant.js');

const getProductsListController = async (req, res) => {
  try {
    const { page, rows, search = '', sort = DEFAULT_SORT_ORDER } = req.query;
    const offset = (page - 1) * rows;

    const filter = { deleted_at: null };
    if (search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter['name'] = regex;
    }

    const sortValue = sort === 'asc' ? 1 : -1;

    const results = await ProductModel.find(filter)
      .skip(offset)
      .limit(rows)
      .sort({ _id: sortValue });
    const totalRecords = await ProductModel.countDocuments(filter);

    sendSuccessResponse(res, {
      ...ApiResponse.SUCCESS,
      data: { results, total: totalRecords },
      message: 'Products fetched successfully'
    });
  } catch (error) {
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Something went wrong.',
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
      message: error.message || 'Something went wrong.',
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
      message: error.message || 'Something went wrong.',
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
      message: error.message || 'Something went wrong.',
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
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Something went wrong.',
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
