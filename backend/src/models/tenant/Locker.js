const mongoose = require('mongoose');

const lockerSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
    },
    lockerNumber: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'maintenance'],
      default: 'available',
    },
    qrCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    accessCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    type: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium',
    },
    tier: {
      type: String,
      enum: ['standard', 'premium'],
      default: 'standard',
    },
  },
  { timestamps: true }
);

module.exports = lockerSchema;
