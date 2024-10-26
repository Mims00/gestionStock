const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route de connexion
router.post('/auth', authController.login);

module.exports = router;
