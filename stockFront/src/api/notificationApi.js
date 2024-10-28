// routes/notificationRoute.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Routes pour les notifications
router.post('/', notificationController.createNotification); 
router.get('/', notificationController.getAllNotifications); 
router.put('/:id/read', notificationController.markAsRead); 

module.exports = router;
