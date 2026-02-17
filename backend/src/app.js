const express = require("express");
const cors = require("cors");
const lockerRoutes = require("./routes/locker.routes");
const rentalRoutes = require("./routes/rental.routes");
const errorHandler = require("./middleware/errorHandler");
const AppError = require("./utils/AppError");

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
  });

  app.use("/api/v1/lockers", lockerRoutes);
  app.use("/api/v1/rentals", rentalRoutes);

  app.use((req, res, next) => {
    next(new AppError("Route not found", 404, "ROUTE_NOT_FOUND", { path: req.originalUrl }));
  });
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
