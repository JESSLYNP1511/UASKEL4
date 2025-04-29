const productService = require('../service/Product');

class ProductController {
  /**
   * Create a new product
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async createProduct(req, res, next) {
    try {
      const { name, description, price, quantity } = req.body;

      // Validate request
      if (!name || !price) {
        return res.status(400).json({
          success: false,
          message: 'Please provide product name and price'
        });
      }

      // Get user ID from authenticated user
      const userId = req.user.id;

      // Create product
      const product = await productService.createProduct(
        { name, description, price, quantity },
        userId
      );

      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all products belonging to authenticated user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getUserProducts(req, res, next) {
    try {
      const userId = req.user.id;

      const products = await productService.getUserProducts(userId);

      return res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all products
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getAllProducts(req, res, next) {
    try {
      const products = await productService.getAllProducts();

      return res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a product by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getProductById(req, res, next) {
    try {
      const { id } = req.params;

      const product = await productService.getProductById(id);

      return res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      if (error.message === 'Product not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * Update a product
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description, price, quantity } = req.body;
      const userId = req.user.id;

      // Update product
      const product = await productService.updateProduct(
        id,
        { name, description, price, quantity },
        userId
      );

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: product
      });
    } catch (error) {
      if (error.message === 'Product not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      if (error.message === 'Not authorized to update this product') {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * Delete a product
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await productService.deleteProduct(id, userId);

      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Product not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      if (error.message === 'Not authorized to delete this product') {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }
}

module.exports = new ProductController();
