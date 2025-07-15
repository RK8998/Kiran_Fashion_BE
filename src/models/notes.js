const mongoose = require('mongoose');
const { Schema } = mongoose;

const notesSchema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      required: true
    },
    description: {
      type: Schema.Types.String,
      default: ''
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'users',
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
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
);

notesSchema.index({ title: 'text' });

module.exports = mongoose.model('notes', notesSchema);
