/**
 * Wholesale price comparison for low-stock replenishment.
 * Quotes Flipkart Wholesale, Udaan, Metro Wholesale, JioMart Partner.
 * Uses product cost as baseline with supplier-specific multipliers + delivery fees.
 */

const SUPPLIERS = [
  {
    id: 'flipkart_wholesale',
    name: 'Flipkart Wholesale',
    shortName: 'Flipkart',
    url: 'https://www.flipkartwholesale.com/',
    costMultiplier: 1.08,
    deliveryFeePerUnit: 2.5,
    etaDays: 2,
    moq: 10,
    reliability: 0.94
  },
  {
    id: 'udaan',
    name: 'Udaan',
    shortName: 'Udaan',
    url: 'https://udaan.com/',
    costMultiplier: 1.02,
    deliveryFeePerUnit: 3.0,
    etaDays: 3,
    moq: 12,
    reliability: 0.91
  },
  {
    id: 'metro_wholesale',
    name: 'Metro Wholesale',
    shortName: 'Metro',
    url: 'https://www.metro.co.in/',
    costMultiplier: 1.05,
    deliveryFeePerUnit: 1.5,
    etaDays: 1,
    moq: 8,
    reliability: 0.96
  },
  {
    id: 'jiomart_partner',
    name: 'JioMart Partner',
    shortName: 'JioMart',
    url: 'https://www.jiomart.com/',
    costMultiplier: 1.06,
    deliveryFeePerUnit: 2.0,
    etaDays: 2,
    moq: 10,
    reliability: 0.93
  }
];

function stableNoise(seed) {
  // Deterministic 0..1 from string seed so quotes stay stable per product
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000;
}

function suggestOrderQty(stockQty, unit) {
  const stock = Number(stockQty) || 0;
  // Restock toward ~40 units for pcs, or at least cover threshold gap
  const target = unit === 'bag' ? 20 : 40;
  return Math.max(10, target - stock);
}

function buildQuotesForProduct(product) {
  const baseCost = Number(product.costPrice || product.cost_price || product.price * 0.7 || 50);
  const stock = Number(product.stockQuantity || product.stock_quantity || 0);
  const orderQty = suggestOrderQty(stock, product.unit);
  const seedBase = String(product.barcode || product._id || product.name || 'x');

  const quotes = SUPPLIERS.map((s) => {
    const noise = 0.96 + stableNoise(`${seedBase}-${s.id}`) * 0.08; // 0.96–1.04
    const unitCost = Math.round(baseCost * s.costMultiplier * noise * 100) / 100;
    const delivery = Math.round(s.deliveryFeePerUnit * orderQty * 100) / 100;
    const subtotal = Math.round(unitCost * orderQty * 100) / 100;
    const total = Math.round((subtotal + delivery) * 100) / 100;
    const vsCurrent = Math.round((unitCost - baseCost) * 100) / 100;

    return {
      supplierId: s.id,
      supplierName: s.name,
      shortName: s.shortName,
      orderUrl: s.url,
      unitCost,
      orderQty,
      moq: s.moq,
      deliveryFee: delivery,
      subtotal,
      totalCost: total,
      etaDays: s.etaDays,
      reliability: s.reliability,
      vsStoreCost: vsCurrent,
      recommendedQty: Math.max(orderQty, s.moq)
    };
  }).sort((a, b) => a.totalCost - b.totalCost);

  const best = quotes[0];
  const worst = quotes[quotes.length - 1];
  const savingsVsWorst = Math.round((worst.totalCost - best.totalCost) * 100) / 100;
  const savingsPct = worst.totalCost ? Math.round((savingsVsWorst / worst.totalCost) * 1000) / 10 : 0;

  return {
    product: {
      id: product._id || product.id,
      name: product.name,
      barcode: product.barcode,
      category: product.category,
      stockQuantity: stock,
      storeCostPrice: baseCost,
      sellingPrice: Number(product.price || 0),
      unit: product.unit || 'pcs',
      imageUrl: product.imageUrl || product.image_url
    },
    suggestedOrderQty: orderQty,
    quotes,
    bestSupplier: best,
    summary: {
      lowestTotal: best.totalCost,
      highestTotal: worst.totalCost,
      savingsVsHighest: savingsVsWorst,
      savingsPercent: savingsPct,
      recommendation: `Order ${best.recommendedQty} ${product.unit || 'pcs'} from ${best.supplierName} at ₹${best.unitCost}/unit (total ₹${best.totalCost}, delivery in ~${best.etaDays} day${best.etaDays > 1 ? 's' : ''}). Saves ₹${savingsVsWorst} (${savingsPct}%) vs the costliest quote.`
    }
  };
}

function compareWholesalePrices(products = []) {
  const comparisons = products.map(buildQuotesForProduct);
  const overallBest = comparisons
    .map((c) => ({
      productName: c.product.name,
      supplier: c.bestSupplier.supplierName,
      total: c.bestSupplier.totalCost,
      unitCost: c.bestSupplier.unitCost
    }))
    .sort((a, b) => a.total - b.total);

  const totalRestockCost = comparisons.reduce((sum, c) => sum + c.bestSupplier.totalCost, 0);

  return {
    threshold: 10,
    count: comparisons.length,
    comparisons,
    overview: {
      itemsNeedingRestock: comparisons.length,
      estimatedBestTotal: Math.round(totalRestockCost * 100) / 100,
      topPicks: overallBest.slice(0, 5),
      message: comparisons.length
        ? `${comparisons.length} product(s) below stock 10. Best combined restock estimate: ₹${Math.round(totalRestockCost).toLocaleString('en-IN')} using lowest quotes per item.`
        : 'No low-stock items.'
    }
  };
}

module.exports = {
  SUPPLIERS,
  compareWholesalePrices,
  buildQuotesForProduct,
  suggestOrderQty
};
