const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

const JWT_SECRET = process.env.JWT_SECRET || "smartlocker-secret-key-change-in-prod";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "smartlocker-refresh-secret";

const BCRYPT_ROUNDS = 12;
const MAX_FAILED_LOGINS = 5;
const LOCKOUT_MINUTES = 15;

function sanitizeUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

function generateTokens(user) {
  const payload = {
    userId: user.id,
    tenantId: user.tenantId,
    role: user.role,
    email: user.email,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });

  return { token, refreshToken };
}

async function register({ tenantId, email, password, name }) {
  const existing = await prisma.user.findUnique({
    where: { tenantId_email: { tenantId, email } },
  });

  if (existing) {
    throw new AppError("User already exists", 409, "USER_EXISTS");
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: { tenantId, email, passwordHash, name },
  });

  const tokens = generateTokens(user);

  return { user: sanitizeUser(user), ...tokens };
}

async function login({ tenantId, email, password }) {
  const user = await prisma.user.findUnique({
    where: { tenantId_email: { tenantId, email } },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  // Check lockout
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const remainingMs = user.lockedUntil.getTime() - Date.now();
    const remainingMin = Math.ceil(remainingMs / 60000);
    throw new AppError(
      `Account locked. Try again in ${remainingMin} minute(s).`,
      423,
      "ACCOUNT_LOCKED"
    );
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    const failedLogins = user.failedLogins + 1;
    const updates = { failedLogins };

    if (failedLogins >= MAX_FAILED_LOGINS) {
      updates.lockedUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
      updates.failedLogins = 0;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updates,
    });

    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  // Reset failed attempts on successful login
  await prisma.user.update({
    where: { id: user.id },
    data: { failedLogins: 0, lockedUntil: null },
  });

  const tokens = generateTokens(user);

  return { user: sanitizeUser(user), ...tokens };
}

async function refreshToken(token) {
  if (!token) {
    throw new AppError("Refresh token required", 400, "TOKEN_REQUIRED");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, REFRESH_SECRET);
  } catch (err) {
    throw new AppError("Invalid or expired refresh token", 401, "INVALID_TOKEN");
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  const tokens = generateTokens(user);

  return { user: sanitizeUser(user), ...tokens };
}

module.exports = {
  register,
  login,
  refreshToken,
  generateTokens,
};
