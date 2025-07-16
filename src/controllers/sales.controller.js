const SalesModel = require('../models/sales');
const { sendErrorResponse, sendSuccessResponse } = require('../utils/response');
const { ApiResponse } = require('../utils/constants');
const mongoose = require('mongoose');

const getSalesListController = async (req, res) => {
  try {
    const { page, rows, start_date, end_date } = req.query;
    const offset = (page - 1) * rows;

    // Build filter object
    const filter = { deleted_at: null };

    if (start_date || end_date) {
      filter.created_at = {};

      if (start_date) {
        filter.created_at['$gte'] = new Date(start_date);
      }

      if (end_date) {
        // Add 1 day to include end_date full day
        const endDateObj = new Date(end_date);
        endDateObj.setHours(23, 59, 59, 999);
        filter.created_at['$lte'] = endDateObj;
      }
    }

    const results = await SalesModel.find(filter).skip(offset).limit(rows).sort({ created_at: -1 });

    const total = await SalesModel.countDocuments(filter);

    sendSuccessResponse(res, {
      ...ApiResponse.SUCCESS,
      message: 'Sales List fetched successfully.',
      data: { results, total }
    });
  } catch (error) {
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Something went wrong.',
      error
    });
  }
};

const getSalesByIdController = async (req, res) => {
  try {
    const salesId = req.params.id;

    if (!salesId) {
      return sendErrorResponse(res, {
        ...ApiResponse.BAD_REQUEST,
        message: 'Sales ID is required'
      });
    }

    // const sales = await SalesModel.findOne({ _id: salesId });
    const sales = await SalesModel.findOne({ $and: [{ _id: salesId }, { deleted_at: null }] })
      .populate('product_id')
      .populate('user_id', '-password')
      .lean();

    // const sales = await SalesModel.aggregate([
    //   { $match: { _id: new mongoose.Types.ObjectId(salesId), deleted_at: null } },
    //   {
    //     $lookup: {
    //       from: 'products',
    //       localField: 'product_id',
    //       foreignField: '_id',
    //       as: 'product'
    //     }
    //   },
    //   {
    //     $unwind: '$product'
    //   },
    //   {
    //     $lookup: {
    //       from: 'users',
    //       localField: 'user_id',
    //       foreignField: '_id',
    //       as: 'user'
    //     }
    //   },
    //   {
    //     $unwind: '$user'
    //   },
    //   {
    //     $project: { 'user.password': 0 }
    //   }
    // ]);

    if (!sales) {
      return sendErrorResponse(res, { ...ApiResponse.NOT_FOUND, message: 'Entry not found.' });
    }

    sendSuccessResponse(res, {
      ...ApiResponse.SUCCESS,
      message: 'Sale found successfully.',
      data: sales
    });
  } catch (error) {
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Something went wrong.',
      error
    });
  }
};

const createSalesController = async (req, res) => {
  try {
    const data = req.body;

    // const profit = (data.sell_amount - data.base_amount).toFixed(2);

    const newSales = new SalesModel({
      ...data,
      user_id: req.user._id
      // profit: Number(profit)
    });

    await newSales.save();

    sendSuccessResponse(res, {
      ...ApiResponse.SUCCESS,
      message: 'Sales Created Successfully.',
      data: newSales
    });
  } catch (error) {
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Something went wrong.',
      error
    });
  }
};

const deleteSalesController = async (req, res) => {
  try {
    const salesId = req.params.id;

    if (!salesId) {
      return sendErrorResponse(res, {
        ...ApiResponse.BAD_REQUEST,
        message: 'Sales ID is required'
      });
    }

    const deleteSales = await SalesModel.findByIdAndUpdate(
      salesId,
      { deleted_at: new Date() },
      { new: true }
    );

    if (!deleteSales) {
      return sendErrorResponse(res, { ...ApiResponse.NOT_FOUND, message: 'Entry not found.' });
    }

    sendSuccessResponse(res, {
      ...ApiResponse.SUCCESS,
      message: 'Entry Deleted Successfully.',
      data: deleteSales
    });
  } catch (error) {
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Something went wrong.',
      error
    });
  }
};

const updateSalesController = async (req, res) => {
  try {
    const salesId = req.params.id;
    const data = req.body;

    if (!salesId) {
      return sendErrorResponse(res, {
        ...ApiResponse.BAD_REQUEST,
        message: 'Sales ID is required'
      });
    }

    const updatedSales = await SalesModel.findByIdAndUpdate(
      { _id: salesId, deleted_at: null },
      { ...data },
      { new: true, runValidators: true }
    );

    if (!updatedSales) {
      return sendErrorResponse(res, { ...ApiResponse.NOT_FOUND, message: 'Entry not found.' });
    }

    sendSuccessResponse(res, {
      ...ApiResponse.SUCCESS,
      message: 'Update entry successfully.',
      data: updatedSales
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
  createSalesController,
  getSalesListController,
  getSalesByIdController,
  deleteSalesController,
  updateSalesController
};
