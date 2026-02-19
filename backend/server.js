require("dotenv").config();
const createApp = require("./src/app");

const app = createApp();

const PORT = process.env.PORT || 5050;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening port ${PORT}`);
});
