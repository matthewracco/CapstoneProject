const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');

class AuthService {
 
  static async register(tenantDB, email, password, name) {
    const User = tenantDB.model('User', require('../models/tenant/User'));

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    return user;
  }

  static async login(tenantDB, tenantId, email, password) {
    const User = tenantDB.model('User', require('../models/tenant/User'));

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

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
