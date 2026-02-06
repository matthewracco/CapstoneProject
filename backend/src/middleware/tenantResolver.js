const { verifyToken } = require('../utils/jwt');
const { getTenantDB } = require('../config/database');

/**
 * Middleware to extract tenantId from JWT and attach tenant DB connection
 * Assumes token is in Authorization header: "Bearer <token>"
 */
async function tenantResolver(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix
    const decoded = verifyToken(token);

    if (!decoded.tenantId || !decoded.userId) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    // Attach decoded token and tenant info to request
    req.user = {
      userId: decoded.userId,
      tenantId: decoded.tenantId,
      role: decoded.role || 'user',
    };

    // Get and attach tenant database connection
    req.tenantDB = await getTenantDB(decoded.tenantId);

    next();
  } catch (error) {
    console.error('TenantResolver error:', error.message);
    res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = tenantResolver;
