require("dotenv").config();
const createApp = require("./src/app");

const PORT = process.env.PORT || 5050;

const app = createApp();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
