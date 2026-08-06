const express = require('express');
const router = express.Router();
const {
  createSale,
  getSales,
  getSaleById,
  getDashboardStats,
  sendCustomerBill,
  getCustomerHistory
} = require('../controllers/saleController');

router.post('/', createSale);
router.post('/send-bill', sendCustomerBill);
router.get('/', getSales);
router.get('/customers', getCustomerHistory);
router.get('/dashboard-stats', getDashboardStats);
router.get('/:identifier', getSaleById);

module.exports = router;
