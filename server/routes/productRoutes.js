const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductByBarcode,
  lookupPublicBarcode,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStock,
  compareWholesale,
  placeWholesaleOrder
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/low-stock', getLowStock);
router.post('/wholesale-compare', compareWholesale);
router.post('/wholesale-order', placeWholesaleOrder);
router.get('/barcode/:barcode', getProductByBarcode);
router.get('/public-barcode/:barcode', lookupPublicBarcode);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
