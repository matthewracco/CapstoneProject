const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const lockerRoutes = require('./routes/locker.routes');
const rentalRoutes = require('./routes/rental.routes');
const errorHandler = require('./middleware/errorHandler');

/**
 * Create and configure the Express app
 */
function createApp() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check route (no auth required)
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
  });

  // Routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/lockers', lockerRoutes);
  app.use('/api/v1/rentals', rentalRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
