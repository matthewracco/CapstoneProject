const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const lockerRoutes = require("./routes/locker.routes");
const rentalRoutes = require("./routes/rental.routes");
const statsRoutes = require("./routes/stats.routes");
const paymentRoutes = require("./routes/payment.routes");
const notificationRoutes = require("./routes/notification.routes");
const userRoutes = require("./routes/user.routes");
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

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/lockers", lockerRoutes);
  app.use("/api/v1/rentals", rentalRoutes);
  app.use("/api/v1/stats", statsRoutes);
  app.use("/api/v1/payments", paymentRoutes);
  app.use("/api/v1/notifications", notificationRoutes);
  app.use("/api/v1/users", userRoutes);

  app.use((req, res, next) => {
    next(new AppError("Route not found", 404, "ROUTE_NOT_FOUND", { path: req.originalUrl }));
  });
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
