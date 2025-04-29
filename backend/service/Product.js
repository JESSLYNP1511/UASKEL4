const Product = require('../models/Product');

class ProductService {
  /**
   * Create a new product
   * @param {Object} productData - Product data
   * @param {String} userId - ID of the authenticated user
   * @returns {Object} - Created product
   */
  async createProduct(productData, userId) {
    try {
      const product = new Product({
        ...productData,
        user: userId
      });

      await product.save();
      return product;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all products belonging to a user
   * @param {String} userId - ID of the authenticated user
   * @returns {Array} - User's products
   */
  async getUserProducts(userId) {
    try {
      return await Product.find({ user: userId });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all products
   * @returns {Array} - All products
   */
  async getAllProducts() {
    try {
      return await Product.find().populate('user', 'username');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a product by ID
   * @param {String} productId - Product ID
   * @returns {Object} - Found product
   */
  async getProductById(productId) {
    try {
      const product = await Product.findById(productId).populate('user', 'username');
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a product
   * @param {String} productId - Product ID
   * @param {Object} updateData - Data to update
   * @param {String} userId - ID of the authenticated user
   * @returns {Object} - Updated product
   */
  async updateProduct(productId, updateData, userId) {
    try {
      // Find product and verify ownership
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error('Product not found');
      }

      // Check if the user is the owner
      if (product.user.toString() !== userId) {
        throw new Error('Not authorized to update this product');
      }

      // Update the product
      Object.keys(updateData).forEach(key => {
        product[key] = updateData[key];
      });

      product.updatedAt = Date.now();
      await product.save();

      return product;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a product
   * @param {String} productId - Product ID
   * @param {String} userId - ID of the authenticated user
   * @returns {Boolean} - Deletion success
   */
  async deleteProduct(productId, userId) {
    try {
      // Find product and verify ownership
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error('Product not found');
      }

      // Check if the user is the owner
      if (product.user.toString() !== userId) {
        throw new Error('Not authorized to delete this product');
      }

      // Delete the product
      await Product.findByIdAndDelete(productId);

      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProductService();
