const userService = require('../service/User');

class UserController {
  /**
   * Handle user registration
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async signup(req, res, next) {
    try {
      const { username, email, password } = req.body;

      // Validate request body
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide username, email and password'
        });
      }

      // Call signup service
      const result = await userService.signup({ username, email, password });

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      // Handle specific errors
      if (error.message.includes('already')) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }

      // Pass any other errors to the error handler
      next(error);
    }
  }

  /**
   * Handle user login
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async signin(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validate request body
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and password'
        });
      }

      // Call signin service
      const result = await userService.signin(email, password);

      return res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        data: result
      });
    } catch (error) {
      // Handle authentication errors
      if (error.message === 'Invalid email or password') {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }

      // Pass any other errors to the error handler
      next(error);
    }
  }
}

module.exports = new UserController();
