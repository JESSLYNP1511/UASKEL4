const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

/**
 * @route POST /api/users/signup
 * @desc Register a new user
 * @access Public
 */
router.post('/signup', userController.signup);

/**
 * @route POST /api/users/signin
 * @desc Authenticate user & get token
 * @access Public
 */
router.post('/signin', userController.signin);

module.exports = router;
