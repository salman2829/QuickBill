const supabase = require('../config/supabase');

const PREDEFINED_PRODUCTS = [
  { id: '1', sku: 'SKU-1001', barcode: '8901030384102', name: 'Organic Fresh Milk 1L', category: 'Dairy', price: 65, cost_price: 50, stock_quantity: 24, min_stock_threshold: 5, unit: 'pcs', image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80' },
  { id: '2', sku: 'SKU-1002', barcode: '8901030384119', name: 'Whole Wheat Bread 400g', category: 'Bakery', price: 45, cost_price: 32, stock_quantity: 15, min_stock_threshold: 5, unit: 'pcs', image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80' },
  { id: '3', sku: 'SKU-1003', barcode: '8901030384126', name: 'Basmati Rice 5kg', category: 'Grains', price: 450, cost_price: 380, stock_quantity: 8, min_stock_threshold: 3, unit: 'bag', image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80' },
  { id: '4', sku: 'SKU-1004', barcode: '8901030384133', name: 'Dark Roast Coffee 250g', category: 'Beverages', price: 320, cost_price: 240, stock_quantity: 3, min_stock_threshold: 5, unit: 'pcs', image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80' },
  { id: '5', sku: 'SKU-1005', barcode: '8901030384140', name: 'Extra Virgin Olive Oil 500ml', category: 'Oils', price: 580, cost_price: 460, stock_quantity: 12, min_stock_threshold: 4, unit: 'pcs', image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80' },
  { id: '6', sku: 'SKU-1006', barcode: '8901030384157', name: 'Amul Butter 500g', category: 'Dairy', price: 275, cost_price: 220, stock_quantity: 20, min_stock_threshold: 5, unit: 'pcs', image_url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80' },
  { id: '7', sku: 'SKU-1007', barcode: '8901030384164', name: 'Cheddar Cheese Slices 200g', category: 'Dairy', price: 180, cost_price: 135, stock_quantity: 18, min_stock_threshold: 4, unit: 'pcs', image_url: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&q=80' },
  { id: '8', sku: 'SKU-1008', barcode: '8901030384171', name: 'Greek Yogurt Blueberry 150g', category: 'Dairy', price: 75, cost_price: 52, stock_quantity: 30, min_stock_threshold: 6, unit: 'pcs', image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80' },
  { id: '9', sku: 'SKU-1009', barcode: '8901030384188', name: 'Multigrain Digestives 250g', category: 'Bakery', price: 60, cost_price: 42, stock_quantity: 25, min_stock_threshold: 5, unit: 'pack', image_url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80' },
  { id: '10', sku: 'SKU-1010', barcode: '8901030384195', name: 'Butter Croissants 2pcs', category: 'Bakery', price: 110, cost_price: 75, stock_quantity: 14, min_stock_threshold: 3, unit: 'pack', image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80' },
  { id: '11', sku: 'SKU-1011', barcode: '8901030384201', name: 'Organic Quinoa 500g', category: 'Grains', price: 299, cost_price: 210, stock_quantity: 16, min_stock_threshold: 4, unit: 'pcs', image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80' },
  { id: '12', sku: 'SKU-1012', barcode: '8901030384218', name: 'Rolled Oats 1kg', category: 'Grains', price: 195, cost_price: 140, stock_quantity: 22, min_stock_threshold: 5, unit: 'pcs', image_url: 'https://images.unsplash.com/photo-1517093728432-a0440f8d4538?w=400&q=80' },
  { id: '13', sku: 'SKU-1013', barcode: '8901030384225', name: 'Organic Green Tea 25 Bags', category: 'Beverages', price: 165, cost_price: 115, stock_quantity: 25, min_stock_threshold: 5, unit: 'box', image_url: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400&q=80' },
  { id: '14', sku: 'SKU-1014', barcode: '8901030384232', name: 'Fresh Orange Juice 1L', category: 'Beverages', price: 135, cost_price: 95, stock_quantity: 19, min_stock_threshold: 4, unit: 'bottle', image_url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&q=80' },
  { id: '15', sku: 'SKU-1015', barcode: '8901030384249', name: 'Cold Brew Black Coffee 300ml', category: 'Beverages', price: 90, cost_price: 60, stock_quantity: 15, min_stock_threshold: 5, unit: 'can', image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80' },
  { id: '16', sku: 'SKU-1016', barcode: '8901030384256', name: 'Sunflower Cooking Oil 1L', category: 'Oils', price: 170, cost_price: 130, stock_quantity: 35, min_stock_threshold: 8, unit: 'pouch', image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80' },
  { id: '17', sku: 'SKU-1017', barcode: '8901030384263', name: 'Cold Pressed Mustard Oil 1L', category: 'Oils', price: 210, cost_price: 160, stock_quantity: 18, min_stock_threshold: 5, unit: 'bottle', image_url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80' },
  { id: '18', sku: 'SKU-1018', barcode: '8901030384270', name: 'California Almonds 500g', category: 'Snacks', price: 490, cost_price: 390, stock_quantity: 12, min_stock_threshold: 3, unit: 'pack', image_url: 'https://images.unsplash.com/photo-1508061252229-8736340248c8?w=400&q=80' },
  { id: '19', sku: 'SKU-1019', barcode: '8901030384287', name: 'Salted Roasted Cashews 250g', category: 'Snacks', price: 340, cost_price: 260, stock_quantity: 14, min_stock_threshold: 4, unit: 'pack', image_url: 'https://images.unsplash.com/photo-1509358271058-acd01cc9386a?w=400&q=80' },
  { id: '20', sku: 'SKU-1020', barcode: '8901030384294', name: 'Dark Chocolate 70% 100g', category: 'Snacks', price: 150, cost_price: 100, stock_quantity: 40, min_stock_threshold: 10, unit: 'bar', image_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&q=80' },
  { id: '21', sku: 'SKU-1021', barcode: '8901030384300', name: 'Cream & Onion Potato Chips', category: 'Snacks', price: 35, cost_price: 22, stock_quantity: 50, min_stock_threshold: 10, unit: 'pack', image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80' },
  { id: '22', sku: 'SKU-1022', barcode: '8901030384317', name: 'Herbal Shampoo 400ml', category: 'Personal Care', price: 240, cost_price: 175, stock_quantity: 15, min_stock_threshold: 4, unit: 'bottle', image_url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&q=80' },
  { id: '23', sku: 'SKU-1023', barcode: '8901030384324', name: 'Pure Organic Honey 500g', category: 'Grains', price: 299, cost_price: 210, stock_quantity: 20, min_stock_threshold: 5, unit: 'jar', image_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d3b?w=400&q=80' },
  { id: '24', sku: 'SKU-1024', barcode: '8901030384331', name: ' Alphonso Mango Pulp 1L', category: 'Beverages', price: 120, cost_price: 85, stock_quantity: 30, min_stock_threshold: 6, unit: 'can', image_url: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80' },
  { id: '25', sku: 'SKU-1025', barcode: '8901030384348', name: 'Sparkling Water Lime 500ml', category: 'Beverages', price: 55, cost_price: 35, stock_quantity: 28, min_stock_threshold: 8, unit: 'bottle', image_url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&q=80' }
];

let mockProducts = [];

// Helper to seed predefined products for a user in-memory
const seedMockProductsForUser = (email) => {
  const userSeeds = PREDEFINED_PRODUCTS.map(p => ({
    ...p,
    id: `mock_${Math.random().toString(36).substr(2, 9)}`,
    user_email: email
  }));
  mockProducts.push(...userSeeds);
  return userSeeds;
};

// Helper to normalize Supabase fields into standard app properties
const formatProduct = (p) => ({
  _id: p.id,
  id: p.id,
  sku: p.sku,
  barcode: p.barcode,
  name: p.name,
  category: p.category,
  price: Number(p.price),
  costPrice: Number(p.cost_price || 0),
  stockQuantity: Number(p.stock_quantity || 0),
  minStockThreshold: Number(p.min_stock_threshold || 5),
  unit: p.unit,
  imageUrl: p.image_url
});

// @desc Get all products from Supabase (with auto-seeding if empty)
// @route GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const userEmail = req.user?.email || 'cashier@quickbill.com';
    let products = [];

    if (supabase && process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-project')) {
      try {
        let query = supabase.from('products').select('*').eq('user_email', userEmail);

        if (category && category !== 'All') {
          query = query.eq('category', category);
        }

        if (search) {
          query = query.or(`name.ilike.%${search}%,barcode.ilike.%${search}%,sku.ilike.%${search}%`);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          products = data.map(formatProduct);
        } else if (!error && data && data.length === 0) {
          // Auto-seed predefined products into Supabase DB if empty for this user
          console.log(`[Supabase Auto-Seed]: Populating database with 25 predefined products for ${userEmail}...`);
          const seedPayload = PREDEFINED_PRODUCTS.map(p => ({
            sku: `${p.sku}-${userEmail.replace(/[@.]/g, '_')}`,
            barcode: p.barcode,
            name: p.name,
            category: p.category,
            price: p.price,
            cost_price: p.cost_price,
            stock_quantity: p.stock_quantity,
            min_stock_threshold: p.min_stock_threshold,
            unit: p.unit,
            image_url: p.image_url,
            user_email: userEmail
          }));
          const { data: seeded } = await supabase.from('products').insert(seedPayload).select();
          if (seeded) products = seeded.map(formatProduct);
        }
      } catch (err) {
        console.warn('[Supabase Products Get Notice]:', err.message);
      }
    }

    if (products.length === 0) {
      // In-memory mock fallback partitioned by user
      let userMock = mockProducts.filter(p => p.user_email === userEmail);
      if (userMock.length === 0) {
        userMock = seedMockProductsForUser(userEmail);
      }

      products = userMock.filter(p => {
        const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search);
        const matchCat = !category || category === 'All' || p.category === category;
        return matchSearch && matchCat;
      }).map(formatProduct);
    }

    res.json({ success: true, count: products.length, products });
  } catch (error) {
    next(error);
  }
};

// @desc Lookup product by barcode from Supabase
// @route GET /api/products/barcode/:barcode
exports.getProductByBarcode = async (req, res, next) => {
  try {
    const barcode = req.params.barcode;
    const userEmail = req.user?.email || 'cashier@quickbill.com';
    let product = null;

    if (supabase && process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-project')) {
      const { data } = await supabase.from('products').select('*').eq('barcode', barcode).eq('user_email', userEmail).maybeSingle();
      if (data) product = formatProduct(data);
    }

    if (!product) {
      let userMock = mockProducts.filter(p => p.user_email === userEmail);
      if (userMock.length === 0) {
        userMock = seedMockProductsForUser(userEmail);
      }
      const found = userMock.find(p => p.barcode === barcode);
      if (found) product = formatProduct(found);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc Lookup public barcode database (doesn't need user isolation as it is globally public)
// @route GET /api/products/public-barcode/:barcode
exports.lookupPublicBarcode = async (req, res, next) => {
  try {
    const barcode = req.params.barcode;
    const { lookupBarcodeOnline } = require('../services/barcodeService');
    const product = await lookupBarcodeOnline(barcode);
    if (product) {
      res.json({ success: true, product });
    } else {
      res.status(404).json({ success: false, message: 'Product not found in public database' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Create product in Supabase
// @route POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    const { name, sku, barcode, category, price, costPrice, stockQuantity, minStockThreshold, unit, imageUrl } = req.body;
    const userEmail = req.user?.email || 'cashier@quickbill.com';

    const newProductPayload = {
      sku: sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: barcode || `${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
      name,
      category: category || 'General',
      price: Number(price),
      cost_price: Number(costPrice || 0),
      stock_quantity: Number(stockQuantity || 0),
      min_stock_threshold: Number(minStockThreshold || 5),
      unit: unit || 'pcs',
      image_url: imageUrl || 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=400&q=80',
      user_email: userEmail
    };

    let product;
    if (supabase && process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-project')) {
      try {
        const { data, error } = await supabase.from('products').insert([newProductPayload]).select().single();
        if (error) {
          console.warn('[Supabase Create Product Notice]:', error.message);
          const id = `mock_${Math.random().toString(36).substr(2, 9)}`;
          product = formatProduct({ id, ...newProductPayload });
          mockProducts.unshift({ id, ...newProductPayload });
        } else {
          product = formatProduct(data);
        }
      } catch (dbErr) {
        console.warn('[Supabase Create Product Fallback]:', dbErr.message);
        const id = `mock_${Math.random().toString(36).substr(2, 9)}`;
        product = formatProduct({ id, ...newProductPayload });
        mockProducts.unshift({ id, ...newProductPayload });
      }
    } else {
      const id = `mock_${Math.random().toString(36).substr(2, 9)}`;
      product = formatProduct({ id, ...newProductPayload });
      mockProducts.unshift({ id, ...newProductPayload });
    }

    res.status(201).json({ success: true, message: 'Product created successfully', product });
  } catch (error) {
    next(error);
  }
};

// @desc Update product in Supabase
// @route PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userEmail = req.user?.email || 'cashier@quickbill.com';
    const { name, barcode, category, price, costPrice, stockQuantity, imageUrl } = req.body;

    const updatePayload = {};
    if (name) updatePayload.name = name;
    if (barcode) updatePayload.barcode = barcode;
    if (category) updatePayload.category = category;
    if (price !== undefined) updatePayload.price = Number(price);
    if (costPrice !== undefined) updatePayload.cost_price = Number(costPrice);
    if (stockQuantity !== undefined) updatePayload.stock_quantity = Number(stockQuantity);
    if (imageUrl) updatePayload.image_url = imageUrl;

    let product;
    if (supabase && process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-project')) {
      try {
        const { data, error } = await supabase.from('products').update(updatePayload).eq('id', id).eq('user_email', userEmail).select().single();
        if (error) {
          console.warn('[Supabase Update Product Notice]:', error.message);
          const idx = mockProducts.findIndex(p => p.id === id && p.user_email === userEmail);
          if (idx !== -1) {
            mockProducts[idx] = { ...mockProducts[idx], ...updatePayload };
            product = formatProduct(mockProducts[idx]);
          }
        } else {
          product = formatProduct(data);
        }
      } catch (dbErr) {
        const idx = mockProducts.findIndex(p => p.id === id && p.user_email === userEmail);
        if (idx !== -1) {
          mockProducts[idx] = { ...mockProducts[idx], ...updatePayload };
          product = formatProduct(mockProducts[idx]);
        }
      }
    } else {
      const idx = mockProducts.findIndex(p => p.id === id && p.user_email === userEmail);
      if (idx !== -1) {
        mockProducts[idx] = { ...mockProducts[idx], ...updatePayload };
        product = formatProduct(mockProducts[idx]);
      }
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found or unauthorized' });
    }

    res.json({ success: true, message: 'Product updated successfully', product });
  } catch (error) {
    next(error);
  }
};

// @desc Delete product in Supabase
// @route DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userEmail = req.user?.email || 'cashier@quickbill.com';
    if (supabase && process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-project')) {
      try {
        await supabase.from('products').delete().eq('id', id).eq('user_email', userEmail);
      } catch (e) {}
    }
    mockProducts = mockProducts.filter(p => !(p.id === id && p.user_email === userEmail));
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const LOW_STOCK_ALERT_THRESHOLD = 10;

// @desc Get low stock items (stock below 10)
// @route GET /api/products/low-stock
exports.getLowStock = async (req, res, next) => {
  try {
    const threshold = Number(req.query.threshold) || LOW_STOCK_ALERT_THRESHOLD;
    const userEmail = req.user?.email || 'cashier@quickbill.com';
    let lowStockItems = [];
    if (supabase && process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-project')) {
      const { data } = await supabase.from('products').select('*').eq('user_email', userEmail);
      if (data && data.length) {
        lowStockItems = data
          .filter(p => Number(p.stock_quantity) < threshold)
          .map(formatProduct);
      }
    }

    if (lowStockItems.length === 0) {
      let userMock = mockProducts.filter(p => p.user_email === userEmail);
      if (userMock.length === 0) {
        userMock = seedMockProductsForUser(userEmail);
      }
      lowStockItems = userMock
        .filter(p => Number(p.stock_quantity) < threshold)
        .map(formatProduct);
    }

    res.json({ success: true, threshold, count: lowStockItems.length, products: lowStockItems });
  } catch (error) {
    next(error);
  }
};

// @desc Compare wholesale supplier prices for low-stock / selected products
// @route POST /api/products/wholesale-compare
exports.compareWholesale = async (req, res, next) => {
  try {
    const { compareWholesalePrices } = require('../services/wholesaleService');
    const threshold = Number(req.body?.threshold) || LOW_STOCK_ALERT_THRESHOLD;
    const userEmail = req.user?.email || 'cashier@quickbill.com';
    let products = Array.isArray(req.body?.products) ? req.body.products : [];

    if (!products.length) {
      let source = [];
      if (supabase && process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-project')) {
        const { data } = await supabase.from('products').select('*').eq('user_email', userEmail);
        if (data && data.length) source = data.map(formatProduct);
      }
      if (source.length === 0) {
        let userMock = mockProducts.filter(p => p.user_email === userEmail);
        if (userMock.length === 0) {
          userMock = seedMockProductsForUser(userEmail);
        }
        source = userMock.map(formatProduct);
      }
      products = source.filter(p => Number(p.stockQuantity) < threshold);
    }

    const result = compareWholesalePrices(products);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

// @desc Place wholesale restock order with best (or chosen) supplier
// @route POST /api/products/wholesale-order
exports.placeWholesaleOrder = async (req, res, next) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const { productId, supplierId, quantity, unitCost, totalCost, supplierName } = req.body || {};
    const userEmail = req.user?.email || 'cashier@quickbill.com';

    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required' });
    }

    const qty = Math.max(1, parseInt(quantity || 10, 10));
    let product = null;
    let updated = null;

    const mockIdx = mockProducts.findIndex(p => String(p.id) === String(productId) && p.user_email === userEmail);
    if (mockIdx >= 0) {
      mockProducts[mockIdx].stock_quantity = Number(mockProducts[mockIdx].stock_quantity || 0) + qty;
      product = formatProduct(mockProducts[mockIdx]);
      updated = product;
    }

    if (supabase && process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-project')) {
      const { data: prod } = await supabase.from('products').select('*').eq('id', productId).eq('user_email', userEmail).maybeSingle();
      if (prod) {
        const newStock = Number(prod.stock_quantity || 0) + qty;
        const { data: saved, error } = await supabase
          .from('products')
          .update({ stock_quantity: newStock })
          .eq('id', productId)
          .eq('user_email', userEmail)
          .select()
          .single();
        if (!error && saved) {
          updated = formatProduct(saved);
        }
      }
    }

    if (!updated && !product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const order = {
      id: `WO-${Date.now()}`,
      productId,
      productName: (updated || product).name,
      supplierId: supplierId || 'best',
      supplierName: supplierName || 'Wholesale Partner',
      quantity: qty,
      unitCost: Number(unitCost || 0),
      totalCost: Number(totalCost || 0),
      newStock: (updated || product).stockQuantity,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };

    const ordersDir = path.join(__dirname, '..', '..', 'public', 'bills');
    if (!fs.existsSync(ordersDir)) fs.mkdirSync(ordersDir, { recursive: true });
    const ordersFile = path.join(ordersDir, '_wholesale_orders.json');
    let orders = [];
    try {
      if (fs.existsSync(ordersFile)) orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
    } catch (e) { orders = []; }
    orders.unshift(order);
    fs.writeFileSync(ordersFile, JSON.stringify(orders.slice(0, 200), null, 2));

    res.status(201).json({
      success: true,
      message: `Ordered ${qty} units from ${order.supplierName}. Stock updated.`,
      order,
      product: updated || product
    });
  } catch (error) {
    next(error);
  }
};

exports.mockProducts = mockProducts;
exports.LOW_STOCK_ALERT_THRESHOLD = LOW_STOCK_ALERT_THRESHOLD;
