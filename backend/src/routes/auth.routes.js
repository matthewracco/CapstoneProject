const express = require('express');
const { body, validationResult } = require('express-validator');
const AuthService = require('../services/authService');
const { connectPlatformDB, getTenantDB } = require('../config/database');

const router = express.Router();

/**
 * POST /api/v1/auth/register
 * Register a new user for a tenant
 * Body: { tenantId, email, password, name }
 */
router.post('/register', [
  body('tenantId').notEmpty().withMessage('tenantId is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Name is required'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { tenantId, email, password, name } = req.body;

    // Get tenant database
    const tenantDB = await getTenantDB(tenantId);

    // Register user
    const user = await AuthService.register(tenantDB, email, password, name);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/auth/login
 * Login a user
 * Body: { tenantId, email, password }
 */
router.post('/login', [
  body('tenantId').notEmpty().withMessage('tenantId is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { tenantId, email, password } = req.body;

    // Get tenant database
    const tenantDB = await getTenantDB(tenantId);

    // Login user
    const result = await AuthService.login(tenantDB, tenantId, email, password);

    res.status(200).json({
      message: 'Login successful',
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;
