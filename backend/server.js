require('dotenv').config();
const createApp = require('./src/app');
const { connectPlatformDB } = require('./src/config/database');

const PORT = process.env.PORT || 5000;

/**
 * Start the server
 */
async function startServer() {
  try {
    // Connect to platform database
    await connectPlatformDB();

    // Create and start Express app
    const app = createApp();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
