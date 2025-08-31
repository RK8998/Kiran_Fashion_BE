const { ApiResponse } = require('../utils/constants');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const SalesModel = require('../models/sales');

const getDashboardDataController = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    // Build filter object
    const filter = { deleted_at: null };

    if (start_date && end_date) {
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
    } else {
      // Todays date filter set if not get start date and end date from params.

      filter.created_at = {};
      filter.created_at['$gte'] = new Date();

      // Add 1 day to include end_date full day
      const endDateObj = new Date();
      endDateObj.setHours(23, 59, 59, 999);
      filter.created_at['$lte'] = endDateObj;
    }

    // ✅ Totals in one query
    const totalsAgg = await SalesModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalProfit: { $sum: '$profit' },
          totalSales: { $sum: '$sell_amount' },
          totalProducts: { $sum: 1 }
        }
      }
    ]);

    const { totalProfit = 0, totalSales = 0, totalProducts = 0 } = totalsAgg[0] || {};

    const dashboardData = {
      counts: { totalProfit, totalSales, totalProducts }
    };

    sendSuccessResponse(res, {
      ...ApiResponse.SUCCESS,
      message: 'Dashboard data fetched successfully.',
      data: dashboardData
    });
  } catch (error) {
    sendErrorResponse(res, {
      ...ApiResponse.INTERNAL_SERVER_ERROR,
      message: error.message || 'Something went wrong.',
      error
    });
  }
};

module.exports = { getDashboardDataController };
