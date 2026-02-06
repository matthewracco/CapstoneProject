const mongoose = require('mongoose');

/**
 * Rental model (tenant-specific database)
 * Fields: id, userId, lockerId, startTime, endTime, status, rentalCode, totalCost, createdAt
 */
const rentalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lockerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Locker',
      required: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    rentalCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = rentalSchema;
