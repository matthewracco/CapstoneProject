require("dotenv").config();
const createApp = require("./src/app");

const PORT = process.env.PORT ;

const app = createApp();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
