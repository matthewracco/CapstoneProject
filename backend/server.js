require("dotenv").config();
const createApp = require("./src/app");
const { startExpiryChecker } = require("./src/jobs/expiryChecker");

const PORT = process.env.PORT || 5050;

const app = createApp();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);

  // Start background cron jobs
  startExpiryChecker();
  console.log("Expiry checker cron jobs started");
});
