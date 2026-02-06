const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');

/**
 * Authentication service
 */
class AuthService {
  /**
   * Register a new user
   */
  static async register(tenantDB, email, password, name) {
    const User = tenantDB.model('User', require('../models/tenant/User'));

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    return user;
  }

  /**
   * Login user
   */
  static async login(tenantDB, tenantId, email, password) {
    const User = tenantDB.model('User', require('../models/tenant/User'));

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      tenantId,
      email: user.email,
      role: user.role,
    });

    return { token, user: { id: user._id, email: user.email, name: user.name } };
  }
}

module.exports = AuthService;
