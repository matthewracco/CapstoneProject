const AppError = require("../utils/AppError");

module.exports = function attachUser(req, res, next) {

  const auth = typeof req.auth === "function" ? req.auth() : req.auth;

  if (!auth?.userId) {
    return next(new AppError("Unauthorized", 401, "UNAUTHORIZED"));
  }

  req.user = { userId: auth.userId };
  next();
};