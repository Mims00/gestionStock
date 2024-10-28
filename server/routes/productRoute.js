const express = require('express');
const router = express.Router();
const { createProduct,getProduct,getProductById,updateProduct,deleteProduct, searchProductByName,getProductTrends } = require('../controllers/productController');

router.post('/', createProduct);
router.get('/', getProduct);


router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/trends', getProductTrends);
router.get('/:id', getProductById);
router.get('/:name',searchProductByName);
module.exports = router;
