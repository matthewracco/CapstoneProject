require('dotenv').config();
const createApp = require('./src/app');
const { connectPlatformDB } = require('./src/config/database');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectPlatformDB();

    const app = createApp();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
