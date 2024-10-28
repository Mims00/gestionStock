const express = require('express');
const router = express.Router();
const delivererController = require('../controllers/delivererController');

router.get('/', delivererController.getAllDeliverers);
router.post('/', delivererController.createDeliverer);
router.put('/:id', delivererController.updateDeliverer);
router.delete('/:id', delivererController.deleteDeliverer);
router.get('/:id/orders', delivererController.getDelivererOrders);

module.exports = router;
