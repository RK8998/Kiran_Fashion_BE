const mongoose = require('mongoose');
const { Schema } = mongoose;

const salesSchema = new Schema(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: 'products',
      required: true
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    base_amount: {
      type: Schema.Types.Double,
      required: true
    },
    sell_amount: {
      type: Schema.Types.Double,
      required: true
    },
    discount: {
      type: Schema.Types.Double,
      default: 0
      // required: true
    },
    profit: {
      type: Schema.Types.Double,
      // required: true
      default: 0
    },
    remark: {
      type: Schema.Types.String,
      default: ''
    },
    deleted_at: {
      type: Schema.Types.Date,
      default: null
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

salesSchema.index({ base_amount: 1, sell_amount: 1, profit: 1 });

/**
 * ✅ Pre-save middleware
 * This will calculate profit before inserting or updating using save()
 */
salesSchema.pre('save', function (next) {
  this.profit = this.sell_amount - this.discount - this.base_amount;
  next();
});

/**
 * ✅ Pre-update middleware for findOneAndUpdate
 * We need to calculate profit manually when updating base_amount or sell_amount
 */
// salesSchema.pre('findOneAndUpdate', function (next) {
//   const update = this.getUpdate();

//   if (update.base_amount !== undefined || update.sell_amount !== undefined) {
//     const baseAmount = update.base_amount ?? this._update.base_amount;
//     const sellAmount = update.sell_amount ?? this._update.sell_amount;

//     // If both exist, calculate profit
//     if (baseAmount !== undefined && sellAmount !== undefined) {
//       update.profit = sellAmount - baseAmount;
//     }
//   }

//   next();
// });

salesSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();

  const baseAmount = update.base_amount ?? this._update.base_amount;
  const sellAmount = update.sell_amount ?? this._update.sell_amount;
  const discount = update.discount ?? this._update.discount ?? 0;

  if (baseAmount !== undefined && sellAmount !== undefined) {
    update.profit = sellAmount - discount - baseAmount;
  }

  next();
});

module.exports = mongoose.model('sales', salesSchema);
