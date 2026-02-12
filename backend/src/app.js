const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const lockerRoutes = require('./routes/locker.routes');
const rentalRoutes = require('./routes/rental.routes');
const errorHandler = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
  });

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/lockers', lockerRoutes);
  app.use('/api/v1/rentals', rentalRoutes);

  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  app.use(errorHandler);

  return app;
}

module.exports = createApp;
