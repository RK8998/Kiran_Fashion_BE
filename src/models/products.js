const mongoose = require('mongoose');
const { Schema } = mongoose;

const productsSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      trim: true
    },
    base_amount: {
      type: Schema.Types.Double,
      required: true
    },
    sell_amount: {
      type: Schema.Types.Double,
      required: true
    },
    remark: {
      type: Schema.Types.String,
      trim: true,
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

productsSchema.index({ name: 'text' }, { unique: true });

module.exports = mongoose.model('products', productsSchema);
