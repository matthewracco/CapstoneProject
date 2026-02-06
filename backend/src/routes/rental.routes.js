const express = require('express');
const tenantResolver = require('../middleware/tenantResolver');

const router = express.Router();

/**
 * POST /api/v1/rentals
 * Create a rental
 * Requires authentication
 * Body: { lockerId }
 */
router.post('/', tenantResolver, async (req, res, next) => {
  try {
    const { lockerId } = req.body;

    if (!lockerId) {
      return res.status(400).json({ error: 'lockerId is required' });
    }

    const Rental = req.tenantDB.model('Rental', require('../models/tenant/Rental'));
    const Locker = req.tenantDB.model('Locker', require('../models/tenant/Locker'));

    // Check if locker exists and is available
    const locker = await Locker.findById(lockerId);
    if (!locker) {
      return res.status(404).json({ error: 'Locker not found' });
    }

    if (locker.status !== 'available') {
      return res.status(400).json({ error: 'Locker is not available' });
    }

    // Create rental
    const rental = await Rental.create({
      userId: req.user.userId,
      lockerId,
      rentalCode: `RENTAL-${Date.now()}`,
    });

    // Update locker status
    await Locker.findByIdAndUpdate(lockerId, { status: 'occupied' });

    res.status(201).json({
      message: 'Rental created successfully',
      rental,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/rentals
 * Get rentals for current user
 * Requires authentication
 */
router.get('/', tenantResolver, async (req, res, next) => {
  try {
    const Rental = req.tenantDB.model('Rental', require('../models/tenant/Rental'));

    const rentals = await Rental.find({ userId: req.user.userId });

    res.status(200).json({
      message: 'Rentals retrieved',
      count: rentals.length,
      rentals,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/rentals/:id/complete
 * Complete a rental (return locker)
 * Requires authentication
 */
router.post('/:id/complete', tenantResolver, async (req, res, next) => {
  try {
    const Rental = req.tenantDB.model('Rental', require('../models/tenant/Rental'));
    const Locker = req.tenantDB.model('Locker', require('../models/tenant/Locker'));

    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).json({ error: 'Rental not found' });
    }

    if (rental.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to complete this rental' });
    }

    if (rental.status !== 'active') {
      return res.status(400).json({ error: 'Rental is not active' });
    }

    // Update rental
    rental.status = 'completed';
    rental.endTime = new Date();
    await rental.save();

    // Update locker status back to available
    await Locker.findByIdAndUpdate(rental.lockerId, { status: 'available' });

    res.status(200).json({
      message: 'Rental completed successfully',
      rental,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
