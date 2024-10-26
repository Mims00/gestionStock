const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getAllOrders);
router.post('/', orderController.createOrder);
router.put('/:orderId', orderController.updateOrder);
router.patch('/:orderId/cancel', orderController.cancelOrder);
router.patch('/:orderId/validate', orderController.validateOrder);
router.delete('/:orderId', orderController.deleteOrder);
router.get('/customer/:customerId', orderController.getOrdersByCustomer);
router.get('/:orderId/details', orderController.getOrderDetails);
router.get('/top-selling-products', orderController.getTopSellingProducts);
router.get('/sales/monthly', orderController.getMonthlySales);
router.get('/metrics', orderController.getMetrics);



module.exports = router;
