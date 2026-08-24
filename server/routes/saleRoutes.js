const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createSale,
  getSales,
  getSaleById,
  getDashboardStats,
  sendCustomerBill,
  getCustomerHistory
} = require('../controllers/saleController');

// All sales routes are secured under Cashier JWT session
router.use(protect);

router.post('/', createSale);
router.post('/send-bill', sendCustomerBill);
router.get('/', getSales);
router.get('/customers', getCustomerHistory);
router.get('/dashboard-stats', getDashboardStats);
router.get('/:identifier', getSaleById);

module.exports = router;
