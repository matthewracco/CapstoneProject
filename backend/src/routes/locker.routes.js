const express = require('express');
const tenantResolver = require('../middleware/tenantResolver');

const router = express.Router();

/**
 * GET /api/v1/lockers
 * List all lockers for a tenant
 * Requires authentication
 */
router.get('/', tenantResolver, async (req, res, next) => {
  try {
    const Locker = req.tenantDB.model('Locker', require('../models/tenant/Locker'));

    // Get query filters
    const { status, location, type } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (location) filter.location = location;
    if (type) filter.type = type;

    const lockers = await Locker.find(filter);

    res.status(200).json({
      message: 'Lockers retrieved',
      count: lockers.length,
      lockers,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/lockers/:id
 * Get a specific locker
 * Requires authentication
 */
router.get('/:id', tenantResolver, async (req, res, next) => {
  try {
    const Locker = req.tenantDB.model('Locker', require('../models/tenant/Locker'));

    const locker = await Locker.findById(req.params.id);
    if (!locker) {
      return res.status(404).json({ error: 'Locker not found' });
    }

    res.status(200).json({ locker });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
