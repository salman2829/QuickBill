const lookupBarcodeOnline = async (barcode) => {
  try {
    const cleanBarcode = barcode.trim();
    // Query Open Food Facts API
    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${cleanBarcode}.json`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    if (data.status !== 1 || !data.product) {
      return null;
    }

    const prod = data.product;
    return {
      barcode: cleanBarcode,
      name: prod.product_name || prod.product_name_en || prod.product_name_en_imported || '',
      category: prod.categories ? prod.categories.split(',')[0].trim() : 'General',
      imageUrl: prod.image_url || prod.image_front_url || ''
    };
  } catch (error) {
    console.error('[Barcode Service Error]:', error.message);
    return null;
  }
};

module.exports = { lookupBarcodeOnline };
