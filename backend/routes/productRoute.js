const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

/**
 * @route GET /api/products
 * @desc Get all products
 * @access Public
 */
router.get('/', productController.getAllProducts);

/**
 * @route GET /api/products/:id
 * @desc Get a product by ID
 * @access Public
 */
router.get('/:id', productController.getProductById);

/**
 * @route GET /api/products/user
 * @desc Get all products of logged in user
 * @access Private
 */
router.get('/user/me', authMiddleware, productController.getUserProducts);

/**
 * @route POST /api/products
 * @desc Create a new product
 * @access Private
 */
router.post('/', authMiddleware, productController.createProduct);

/**
 * @route PUT /api/products/:id
 * @desc Update a product
 * @access Private
 */
router.put('/:id', authMiddleware, productController.updateProduct);

/**
 * @route DELETE /api/products/:id
 * @desc Delete a product
 * @access Private
 */
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;
