const User = require('../models/User');
const jwt = require('jsonwebtoken');

class UserService {
  /**
   * Create a new user account
   * @param {Object} userData - User data (username, email, password)
   * @returns {Object} - Created user and token
   */
  async signup(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [
          { email: userData.email },
          { username: userData.username }
        ]
      });

      if (existingUser) {
        if (existingUser.email === userData.email) {
          throw new Error('Email already in use');
        } else {
          throw new Error('Username already taken');
        }
      }

      // Create new user
      const user = new User(userData);
      await user.save();

      // Generate JWT token
      const token = this.generateToken(user);

      // Return user data (excluding password) and token
      const userResponse = user.toObject();
      delete userResponse.password;

      return { user: userResponse, token };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sign in existing user
   * @param {String} email - User email
   * @param {String} password - User password
   * @returns {Object} - User data and token
   */
  async signin(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      const token = this.generateToken(user);

      // Return user data (excluding password) and token
      const userResponse = user.toObject();
      delete userResponse.password;

      return { user: userResponse, token };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate JWT token for user authentication
   * @param {Object} user - User document
   * @returns {String} - JWT token
   */
  generateToken(user) {
    return jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
  }
}

module.exports = new UserService();
