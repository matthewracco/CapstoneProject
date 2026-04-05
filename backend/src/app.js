const express = require("express");
const cors = require("cors");

const lockerRoutes = require("./routes/locker.routes");
const rentalRoutes = require("./routes/rental.routes");
const meRoutes = require("./routes/me.route");

const { clerkMiddleware, requireAuth, requireTenant } = require("./middleware/clerkTenant");
const attachUser = require("./middleware/attachUser");

const errorHandler = require("./middleware/errorHandler");
const AppError = require("./utils/AppError");

function createApp() {
  const app = express();

  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
  });

  const api = express.Router();

  api.use(clerkMiddleware());
  api.use(requireAuth());
  api.use(requireTenant);
  api.use(attachUser);

  api.use("/me", meRoutes);
  api.use("/lockers", lockerRoutes);
  api.use("/rentals", rentalRoutes);

  app.use("/api/v1", api);

  app.use((req, res, next) => {
    next(new AppError("Route not found", 404, "ROUTE_NOT_FOUND", { path: req.originalUrl }));
  });

  app.use(errorHandler);

  return app;
}
module.exports = createApp;