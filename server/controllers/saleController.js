const supabase = require('../config/supabase');
const { mockProducts } = require('./productController');

const mockSales = [];

const formatSale = (s) => ({
  _id: s.id,
  id: s.id,
  invoiceNo: s.invoice_no || s.invoiceNo,
  items: s.items || [],
  subtotal: Number(s.subtotal),
  tax: Number(s.tax || 0),
  discount: Number(s.discount || 0),
  grandTotal: Number(s.grand_total || s.grandTotal),
  paymentMethod: s.payment_method || s.paymentMethod,
  customer: s.customer || { name: 'Walk-in Customer', phone: '' },
  cashierName: s.cashier_name || s.cashierName,
  createdAt: s.created_at || s.createdAt
});

const hasSupabase = () =>
  !!(supabase && process.env.SUPABASE_URL && !String(process.env.SUPABASE_URL).includes('your-project'));

const SALE_SELECT =
  'id, invoice_no, items, subtotal, tax, discount, grand_total, payment_method, customer, cashier_name, created_at';

async function fetchSalesFromDb(userEmail, limit = 200) {
  if (!hasSupabase()) return null;
  const { data, error } = await supabase
    .from('sales')
    .select(SALE_SELECT)
    .eq('user_email', userEmail)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data || []).map(formatSale);
}

function buildCustomerHistory(sales) {
  const map = new Map();
  for (const sale of sales) {
    const phone = String(sale.customer?.phone || '').replace(/\D/g, '');
    const name = sale.customer?.name || 'Walk-in Customer';
    const key = phone || `name:${name.toLowerCase()}`;
    if (!map.has(key)) {
      map.set(key, {
        key,
        name,
        phone: phone || '',
        visitCount: 0,
        totalSpent: 0,
        lastVisit: null,
        bills: []
      });
    }
    const row = map.get(key);
    if (name && name !== 'Walk-in Customer') row.name = name;
    if (phone) row.phone = phone;
    row.visitCount += 1;
    row.totalSpent += Number(sale.grandTotal || 0);
    const created = sale.createdAt ? new Date(sale.createdAt) : new Date();
    if (!row.lastVisit || created > new Date(row.lastVisit)) row.lastVisit = created.toISOString();
    row.bills.push({
      id: sale._id || sale.id,
      invoiceNo: sale.invoiceNo,
      grandTotal: Number(sale.grandTotal || 0),
      items: sale.items || [],
      paymentMethod: sale.paymentMethod,
      createdAt: sale.createdAt,
      cashierName: sale.cashierName
    });
  }
  return Array.from(map.values())
    .map((c) => ({
      ...c,
      totalSpent: Math.round(c.totalSpent * 100) / 100,
      bills: c.bills.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }))
    .sort((a, b) => new Date(b.lastVisit || 0) - new Date(a.lastVisit || 0));
}

// @desc Process new sale invoice checkout & update inventory stock in Supabase
// @route POST /api/sales
exports.createSale = async (req, res, next) => {
  try {
    const { items, subtotal, tax, discount, grandTotal, paymentMethod, customer, cashierName } = req.body;
    const userEmail = req.user?.email || 'cashier@quickbill.com';

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
    }

    const invoiceNo = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const salePayload = {
      invoice_no: invoiceNo,
      items,
      subtotal: Number(subtotal),
      tax: Number(tax || 0),
      discount: Number(discount || 0),
      grand_total: Number(grandTotal),
      payment_method: paymentMethod || 'cash',
      customer: customer || { name: 'Walk-in Customer', phone: '' },
      cashier_name: cashierName || (req.user ? req.user.name : 'Cashier'),
      user_email: userEmail
    };

    let sale;
    if (hasSupabase()) {
      const { data, error } = await supabase.from('sales').insert([salePayload]).select(SALE_SELECT).single();
      if (error) throw error;
      sale = formatSale(data);

      // Decrement product stock in Supabase for this specific user/shop's inventory
      for (const item of items) {
        if (item.barcode) {
          const { data: prod } = await supabase
            .from('products')
            .select('id, stock_quantity')
            .eq('barcode', item.barcode)
            .eq('user_email', userEmail)
            .single();
          if (prod) {
            const newStock = Math.max(0, Number(prod.stock_quantity) - item.quantity);
            await supabase.from('products').update({ stock_quantity: newStock }).eq('id', prod.id).eq('user_email', userEmail);
          }
        }
      }
    } else {
      const id = `sale_${Date.now()}`;
      sale = formatSale({ id, ...salePayload, created_at: new Date().toISOString() });
      mockSales.unshift({ id, ...salePayload, user_email: userEmail, createdAt: new Date() });

      // Decrement mock stock isolated to this user's inventory
      for (const item of items) {
        const mockP = mockProducts.find(p => p.barcode === item.barcode && p.user_email === userEmail);
        if (mockP) {
          mockP.stock_quantity = Math.max(0, Number(mockP.stock_quantity || 0) - item.quantity);
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Sale completed successfully',
      sale
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get sales history from Supabase (efficient select + limit)
// @route GET /api/sales
exports.getSales = async (req, res, next) => {
  try {
    const userEmail = req.user?.email || 'cashier@quickbill.com';
    const limit = Math.min(500, Math.max(1, parseInt(req.query.limit, 10) || 200));
    let sales = [];

    if (hasSupabase()) {
      try {
        const dbSales = await fetchSalesFromDb(userEmail, limit);
        sales = dbSales || [];
      } catch (dbErr) {
        console.warn('[Sales Fetch Notice]:', dbErr.message);
        sales = mockSales.filter(s => s.user_email === userEmail).map(formatSale);
      }
    } else {
      sales = mockSales.filter(s => s.user_email === userEmail).map(formatSale);
    }

    res.json({
      success: true,
      count: sales.length,
      sales,
      customers: buildCustomerHistory(sales)
    });
  } catch (error) {
    next(error);
  }
};

// @desc Aggregated customer purchase history (name, phone, bills, totals)
// @route GET /api/sales/customers
exports.getCustomerHistory = async (req, res, next) => {
  try {
    const userEmail = req.user?.email || 'cashier@quickbill.com';
    let sales = [];
    if (hasSupabase()) {
      try {
        sales = (await fetchSalesFromDb(userEmail, 500)) || [];
      } catch (e) {
        sales = mockSales.filter(s => s.user_email === userEmail).map(formatSale);
      }
    } else {
      sales = mockSales.filter(s => s.user_email === userEmail).map(formatSale);
    }

    const customers = buildCustomerHistory(sales);
    res.json({ success: true, count: customers.length, customers });
  } catch (error) {
    next(error);
  }
};

// @desc Get single sale invoice by ID or InvoiceNo from Supabase
// @route GET /api/sales/:identifier
exports.getSaleById = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const userEmail = req.user?.email || 'cashier@quickbill.com';
    let sale = null;

    if (hasSupabase()) {
      const { data } = await supabase
        .from('sales')
        .select(SALE_SELECT)
        .eq('user_email', userEmail)
        .or(`id.eq.${identifier},invoice_no.eq.${identifier}`)
        .maybeSingle();
      if (data) sale = formatSale(data);
    }

    if (!sale) {
      const found = mockSales.find(s => (s.id === identifier || s.invoiceNo === identifier || s.invoice_no === identifier) && s.user_email === userEmail);
      if (found) sale = formatSale(found);
    }

    if (!sale) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.json({ success: true, sale });
  } catch (error) {
    next(error);
  }
};

// @desc Get POS Dashboard Analytics Summary from Supabase
// @route GET /api/sales/dashboard-stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const userEmail = req.user?.email || 'cashier@quickbill.com';
    let salesList = mockSales.filter(s => s.user_email === userEmail).map(formatSale);
    let productsList = mockProducts.filter(p => p.user_email === userEmail);

    if (hasSupabase()) {
      const { data: dbSales } = await supabase.from('sales').select(SALE_SELECT).eq('user_email', userEmail);
      if (dbSales) salesList = dbSales.map(formatSale);

      const { data: dbProducts } = await supabase.from('products').select('*').eq('user_email', userEmail);
      if (dbProducts && dbProducts.length > 0) productsList = dbProducts;
    }

    const totalRevenue = salesList.reduce((acc, s) => acc + (s.grandTotal || 0), 0);
    const totalTransactions = salesList.length;
    const lowStockCount = productsList.filter(p => Number(p.stock_quantity || p.stockQuantity || 0) < 10).length;
    const totalProductsCount = productsList.length;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const revenueByDay = days.map(() => Math.floor(1200 + Math.random() * 3500));

    res.json({
      success: true,
      stats: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalTransactions,
        lowStockCount,
        totalProductsCount,
        chartLabels: days,
        chartData: revenueByDay
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Auto-deliver PDF bill to customer WhatsApp (server-side, no cashier popup)
// @route POST /api/sales/send-bill
exports.sendCustomerBill = async (req, res, next) => {
  try {
    const { phone, message, pdfBase64, fileName, invoiceNo } = req.body || {};
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Customer phone is required' });
    }
    if (!pdfBase64 && !message) {
      return res.status(400).json({ success: false, message: 'Bill content is required' });
    }

    const { deliverCustomerBill } = require('../services/whatsappService');
    const result = await deliverCustomerBill({
      phone,
      message: message || 'Your QuickBill receipt',
      pdfBase64,
      fileName,
      invoiceNo
    });

    res.json({
      success: true,
      message: result.delivered
        ? 'Bill PDF delivered to customer WhatsApp'
        : 'Bill PDF saved',
      ...result
    });
  } catch (error) {
    next(error);
  }
};
