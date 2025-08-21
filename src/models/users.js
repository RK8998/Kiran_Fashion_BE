const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { ROLES } = require('../utils/constants');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    phone: {
      type: Schema.Types.Number,
      required: true,
      unique: true,
      match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },
    isActive: {
      type: Schema.Types.Boolean,
      default: true
    },
    role: {
      type: Schema.Types.String,
      enum: [ROLES.admin, ROLES.user],
      default: 'user'
    },
    password: {
      type: Schema.Types.String,
      required: true
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

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.index({ name: 'text', email: 'text', phone: 'text' });

module.exports = mongoose.model('users', userSchema);
