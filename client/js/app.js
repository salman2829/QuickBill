// QuickBill POS - Main Application Controller with Full Multi-Language i18n Engine

const TRANSLATIONS = {
  en: {
    sign_in: "Sign In",
    register_cashier: "Register Cashier",
    email_label: "Email Address",
    password_label: "Password",
    secure_login: "Secure Login",
    demo_login: "Quick Demo Cashier Login",
    face_id_login: "Face ID Login",
    otp_login: "OTP Login",
    full_name: "Full Name",
    role_label: "Role",
    register_user_btn: "Register New User",
    tab_pos: "POS Terminal",
    tab_inventory: "Inventory",
    tab_sales: "Sales History",
    tab_analytics: "Analytics & AI",
    logout: "Logout",
    search_placeholder: "Search by product name, SKU or scan barcode...",
    scan_barcode: "Scan Barcode",
    all_products: "All Products",
    current_order: "Current Order",
    clear_cart: "Clear Cart",
    cart_empty_text: "Cart is empty. Click products or scan barcode to add items.",
    subtotal: "Subtotal:",
    tax: "Tax (5% GST):",
    discount: "Discount (₹):",
    grand_total: "Grand Total:",
    pay_print: "Pay & Print Receipt",
    inventory_title: "Product Inventory Manager",
    add_product: "Add New Product",
    th_image: "Image",
    th_sku: "SKU / Barcode",
    th_name: "Product Name",
    th_category: "Category",
    th_price: "Price",
    th_cost: "Cost Price",
    th_stock: "Stock",
    th_actions: "Actions",
    sales_title: "Sales Transactions & Invoices",
    th_inv_no: "Invoice No",
    th_date: "Date & Time",
    th_items_count: "Items Count",
    th_grand_total: "Grand Total",
    th_payment_method: "Payment Method",
    th_cashier: "Cashier",
    stat_revenue: "Total Sales Revenue",
    stat_sales: "Invoices Generated",
    stat_lowstock: "Low Stock Alerts",
    stat_products: "Active Products",
    revenue_chart_title: "Revenue Trends (Weekly)",
    gemini_ai_title: "Google Gemini AI Insights",
    refresh_ai: "Refresh AI",
    scan_modal_title: "Scan Product Barcode",
    scan_modal_desc: "Point scanner at any UPC/EAN product barcode",
    save_product_db: "Save Product to Database",
    print_receipt: "Print Receipt",
    whatsapp_bill: "WhatsApp Bill"
  },
  es: {
    sign_in: "Iniciar Sesión",
    register_cashier: "Registrar Cajero",
    email_label: "Correo Electrónico",
    password_label: "Contraseña",
    secure_login: "🔒 Iniciar Sesión Seguro",
    demo_login: "⚡ Acceso Demostración Rápida",
    face_id_login: "👤 Login por Face ID",
    otp_login: "📱 Login por OTP",
    full_name: "Nombre Completo",
    role_label: "Rol",
    register_user_btn: "➕ Registrar Nuevo Usuario",
    tab_pos: "🛒 Terminal TPV",
    tab_inventory: "📦 Gestión Inventario",
    tab_sales: "📜 Historial Ventas",
    tab_analytics: "📊 Analítica e IA",
    logout: "Cerrar Sesión",
    search_placeholder: "Buscar por nombre, SKU o código de barras...",
    scan_barcode: "Escanear Código",
    all_products: "Todos los Productos",
    current_order: "🛍️ Pedido Actual",
    clear_cart: "Vaciar Carrito",
    cart_empty_text: "El carrito está vacío. Haz clic en productos para agregarlos.",
    subtotal: "Subtotal:",
    tax: "Impuesto (5% GST):",
    discount: "Descuento (₹):",
    grand_total: "Total General:",
    pay_print: "⚡ Pagar e Imprimir",
    inventory_title: "📦 Gestor de Inventario de Productos",
    add_product: "➕ Agregar Producto",
    th_image: "Imagen",
    th_sku: "SKU / Barras",
    th_name: "Nombre Producto",
    th_category: "Categoría",
    th_price: "Precio",
    th_cost: "Precio Costo",
    th_stock: "Stock",
    th_actions: "Acciones",
    sales_title: "📜 Transacciones y Facturas de Venta",
    th_inv_no: "Nº Factura",
    th_date: "Fecha y Hora",
    th_items_count: "Cant. Artículos",
    th_grand_total: "Total General",
    th_payment_method: "Método Pago",
    th_cashier: "Cajero",
    stat_revenue: "Ingresos Totales de Ventas",
    stat_sales: "Facturas Generadas",
    stat_lowstock: "Alertas de Stock Bajo",
    stat_products: "Productos Activos",
    revenue_chart_title: "📈 Tendencias de Ingresos (Semanal)",
    gemini_ai_title: "🤖 Google Gemini IA Perspectivas",
    refresh_ai: "Actualizar IA",
    scan_modal_title: "📷 Escanear Código de Barras",
    scan_modal_desc: "Apunta el escáner a cualquier código UPC/EAN",
    save_product_db: "Guardar Producto en Base de Datos",
    print_receipt: "🖨️ Imprimir Recibo",
    whatsapp_bill: "💬 Factura por WhatsApp"
  },
  hi: {
    sign_in: "साइन इन करें",
    register_cashier: "कैशियर रजिस्टर करें",
    email_label: "ईमेल पता",
    password_label: "पासवर्ड",
    secure_login: "🔒 सुरक्षित लॉगिन",
    demo_login: "⚡ त्वरित डेमो कैशियर लॉगिन",
    face_id_login: "👤 फेस आईडी लॉगिन",
    otp_login: "📱 ओटीपी लॉगिन",
    full_name: "पूरा नाम",
    role_label: "भूमिका",
    register_user_btn: "➕ नया उपयोगकर्ता रजिस्टर करें",
    tab_pos: "🛒 पीओएस टर्मिनल",
    tab_inventory: "📦 इन्वेंटरी प्रबंधन",
    tab_sales: "📜 बिक्री इतिहास",
    tab_analytics: "📊 एनालिटिक्स एवं AI",
    logout: "लॉगआउट",
    search_placeholder: "उत्पाद का नाम, SKU या बारकोड से खोजें...",
    scan_barcode: "बारकोड स्कैन करें",
    all_products: "सभी उत्पाद",
    current_order: "🛍️ वर्तमान ऑर्डर",
    clear_cart: "कार्ट खाली करें",
    cart_empty_text: "कार्ट खाली है। उत्पाद जोड़ने के लिए क्लिक या स्कैन करें।",
    subtotal: "उप-कुल:",
    tax: "कर (5% जीएसटी):",
    discount: "छूट (₹):",
    grand_total: "कुल योग:",
    pay_print: "⚡ भुगतान और प्रिंट रसीद",
    inventory_title: "📦 उत्पाद इन्वेंटरी प्रबंधक",
    add_product: "➕ नया उत्पाद जोड़ें",
    th_image: "चित्र",
    th_sku: "SKU / बारकोड",
    th_name: "उत्पाद का नाम",
    th_category: "श्रेणी",
    th_price: "मूल्य",
    th_cost: "लागत मूल्य",
    th_stock: "स्टॉक",
    th_actions: "कार्रवाई",
    sales_title: "📜 बिक्री लेनदेन और चालान",
    th_inv_no: "चालान संख्या",
    th_date: "दिनांक एवं समय",
    th_items_count: "वस्तु संख्या",
    th_grand_total: "कुल योग",
    th_payment_method: "भुगतान विधि",
    th_cashier: "कैशियर",
    stat_revenue: "कुल बिक्री राजस्व",
    stat_sales: "उत्पन्न चालान",
    stat_lowstock: "कम स्टॉक अलर्ट",
    stat_products: "सक्रिय उत्पाद",
    revenue_chart_title: "📈 राजस्व रुझान (साप्ताहिक)",
    gemini_ai_title: "🤖 गूगल जेमिनी AI इनसाइट्स",
    refresh_ai: "AI रिफ्रेश करें",
    scan_modal_title: "📷 बारकोड स्कैन करें",
    scan_modal_desc: "किसी भी बारकोड पर स्कैनर पॉइंट करें",
    save_product_db: "उत्पाद डेटाबेस में सहेजें",
    print_receipt: "🖨️ रसीद प्रिंट करें",
    whatsapp_bill: "💬 व्हाट्सएप बिल"
  },
  ta: {
    sign_in: "உள்நுழையவும்",
    register_cashier: "பணியாளரை பதிவு செய்",
    email_label: "மின்னஞ்சல் முகவரி",
    password_label: "கடவுச்சொல்",
    secure_login: "🔒 பாதுகாப்பான உள்நுழைவு",
    demo_login: "⚡ விரைவு டெமோ உள்நுழைவு",
    face_id_login: "👤 முக அங்கீகார உள்நுழைவு",
    otp_login: "📱 OTP உள்நுழைவு",
    full_name: "முழு பெயர்",
    role_label: "பங்கு",
    register_user_btn: "➕ புதிய பயனரைப் பதிவு செய்",
    tab_pos: "🛒 POS முனையம்",
    tab_inventory: "📦 சரக்கு மேலாண்மை",
    tab_sales: "📜 விற்பனை வரலாறு",
    tab_analytics: "📊 பகுப்பாய்வு & AI",
    logout: "வெளியேறு",
    search_placeholder: "தயாரிப்பு பெயர், SKU அல்லது பார்கோடு தேடவும்...",
    scan_barcode: "பார்கோடு ஸ்கேன்",
    all_products: "அனைத்து தயாரிப்புகள்",
    current_order: "🛍️ தற்போதைய ஆர்டர்",
    clear_cart: "கார்ட்டை காலியாக்கு",
    cart_empty_text: "கார்ட் காலியாக உள்ளது. பொருட்களைச் சேர்க்க கிளிக் செய்யவும்.",
    subtotal: "உப கூட்டுத்தொகை:",
    tax: "வரி (5% GST):",
    discount: "தள்ளுபடி (₹):",
    grand_total: "மொத்த தொகை:",
    pay_print: "⚡ பணம் செலுத்தி அச்சிடுக",
    inventory_title: "📦 தயாரிப்பு சரக்கு மேலாளர்",
    add_product: "➕ புதிய தயாரிப்பைச் சேர்",
    th_image: "படம்",
    th_sku: "SKU / பார்கோடு",
    th_name: "தயாரிப்பு பெயர்",
    th_category: "பிரிவு",
    th_price: "விலை",
    th_cost: "அடக்க விலை",
    th_stock: "இருப்பு",
    th_actions: "நடவடிக்கைகள்",
    sales_title: "📜 விற்பனை பரிவர்த்தனைகள்",
    th_inv_no: "இன்வாய்ஸ் எண்",
    th_date: "தேதி & நேரம்",
    th_items_count: "பொருட்கள் எண்ணிக்கை",
    th_grand_total: "மொத்த தொகை",
    th_payment_method: "பணம் செலுத்தும் முறை",
    th_cashier: "பணப்பொறுப்பாளர்",
    stat_revenue: "மொத்த விற்பனை வருவாய்",
    stat_sales: "உருவாக்கப்பட்ட இன்வாய்ஸ்கள்",
    stat_lowstock: "குறைந்த இருப்பு எச்சரிக்கை",
    stat_products: "செயலில் உள்ள தயாரிப்புகள்",
    revenue_chart_title: "📈 வாராந்திர வருவாய் போக்குகள்",
    gemini_ai_title: "🤖 கூகிள் ஜெமினி AI நுண்ணறிவுகள்",
    refresh_ai: "AI புதுப்பி",
    scan_modal_title: "📷 பார்கோடு ஸ்கேன் செய்",
    scan_modal_desc: "பார்கோடு நோக்கி கேமராவை திருப்பவும்",
    save_product_db: "தரவுத்தளத்தில் சேமிக்கவும்",
    print_receipt: "🖨️ ரசீது அச்சிடுக",
    whatsapp_bill: "💬 வாட்ஸ்அப் ரசீது"
  },
  te: {
    sign_in: "సైన్ ఇన్",
    register_cashier: "క్యాషియర్ నమోదు",
    email_label: "ఈమెయిల్ చిరునామా",
    password_label: "పాస్‌వర్డ్",
    secure_login: "🔒 సురక్షిత లాగిన్",
    demo_login: "⚡ త్వరిత డెమో క్యాషియర్ లాగిన్",
    face_id_login: "👤 ఫేస్ ఐడీ లాగిన్",
    otp_login: "📱 OTP లాగిన్",
    full_name: "పూర్తి పేరు",
    role_label: "పాత్ర",
    register_user_btn: "➕ కొత్త వినియోగదారుని నమోదు చేయండి",
    tab_pos: "🛒 POS టెర్మినల్",
    tab_inventory: "📦 ఇన్వెంటరీ",
    tab_sales: "📜 అమ్మకాల చరిత్ర",
    tab_analytics: "📊 అనలిటిక్స్ & AI",
    logout: "లాగౌట్",
    search_placeholder: "ఉత్పత్తి పేరు, SKU లేదా బార్‌కోడ్ ద్వారా శోధించండి...",
    scan_barcode: "బార్‌కోడ్ స్కాన్",
    all_products: "అన్ని ఉత్పత్తులు",
    current_order: "🛍️ ప్రస్తుత ఆర్డర్",
    clear_cart: "కార్ట్ ఖాళీ చేయండి",
    cart_empty_text: "కార్ట్ ఖాళీగా ఉంది. ఐటమ్‌లను జోడించడానికి ఉత్పత్తులను క్లిక్ చేయండి.",
    subtotal: "సబ్ టోటల్:",
    tax: "పన్ను (5% GST):",
    discount: "డిస్కౌంట్ (₹):",
    grand_total: "గ్రాండ్ టోటల్:",
    pay_print: "⚡ చెల్లించండి & ప్రింట్ రసీదు",
    inventory_title: "📦 ఉత్పత్తి ఇన్వెంటరీ మేనేజర్",
    add_product: "➕ కొత్త ఉత్పత్తిని జోడించండి",
    th_image: "చిత్రం",
    th_sku: "SKU / బార్‌కోడ్",
    th_name: "ఉత్పత్తి పేరు",
    th_category: "వర్గం",
    th_price: "ధర",
    th_cost: "కాస్ట్ ధర",
    th_stock: "స్టాక్",
    th_actions: "చర్యలు",
    sales_title: "📜 అమ్మకాల లావాదేవీలు & ఇన్‌వాయిస్‌లు",
    th_inv_no: "ఇన్‌వాయిస్ నంబర్",
    th_date: "తేదీ & సమయం",
    th_items_count: "ఐటమ్‌ల సంఖ్య",
    th_grand_total: "గ్రాండ్ టోటల్",
    th_payment_method: "చెల్లింపు విధానం",
    th_cashier: "క్యాషియర్",
    stat_revenue: "మొత్తం అమ్మకాల రాబడి",
    stat_sales: "రూపొందించబడిన ఇన్‌వాయిస్‌లు",
    stat_lowstock: "తక్కువ స్టాక్ హెచ్చరికలు",
    stat_products: "క్రియాశీల ఉత్పత్తులు",
    revenue_chart_title: "📈 రాబడి పోకడలు (వారానికొకసారి)",
    gemini_ai_title: "🤖 గూగుల్ జెమిని AI ఇన్సైట్‌లు",
    refresh_ai: "AI రిఫ్రెష్ చేయండి",
    scan_modal_title: "📷 బార్‌కోడ్ స్కాన్ చేయండి",
    scan_modal_desc: "బార్‌కోడ్ వైపు కెమెరాను తిప్పండి",
    save_product_db: "డేటాబేస్‌లో సేవ్ చేయండి",
    print_receipt: "🖨️ ప్రింట్ రసీదు",
    whatsapp_bill: "💬 వాట్సాప్ బిల్లు"
  }
};

class POSApp {
  constructor() {
    this.products = [];
    this.cart = [];
    this.salesHistory = [];
    this.customerHistory = [];
    this.currentCategory = 'All';
    this.html5QrCode = null;
    this.revenueChart = null;
    this.activeSale = null;
    this.currentUser = null;
    this.currentLang = localStorage.getItem('qb_lang') || 'en';
    this.customerPhone = '';
    this.customerName = 'Walk-in Customer';
    this._phoneModalResolver = null;
    this.lowStockThreshold = 10;
    this._lowStockPrompted = false;
    this._wholesaleData = null;
    this.salesView = 'bills';
    this.tabHistory = ['pos'];
    this._sessionKey = 'qb_pos_session_v1';
    this._persistTimer = null;

    this.init();
  }

  async init() {
    this.setupTabNavigation();
    this.setupAuthLanding();
    this.setupSessionPersistenceHooks();
    this.checkAuthentication();
    this.registerServiceWorker();

    // Set dropdown selector to saved language
    const langSelect = document.getElementById('lang-selector');
    if (langSelect) langSelect.value = this.currentLang;

    // Apply translations across UI
    this.applyTranslations(this.currentLang);
  }

  setupSessionPersistenceHooks() {
    window.addEventListener('beforeunload', () => this.persistSession(true));
    const discountInput = document.getElementById('summary-discount-input');
    if (discountInput && !discountInput.dataset.persistBound) {
      discountInput.dataset.persistBound = '1';
      discountInput.addEventListener('input', () => {
        this.calculateTotals();
        this.persistSession();
      });
    }
    const paySelect = document.getElementById('payment-method-select');
    if (paySelect && !paySelect.dataset.persistBound) {
      paySelect.dataset.persistBound = '1';
      paySelect.addEventListener('change', () => this.persistSession());
    }
  }

  persistSession(immediate = false) {
    const write = () => {
      try {
        const payload = {
          cart: this.cart.map((i) => ({
            _id: i._id,
            id: i.id,
            barcode: i.barcode,
            name: i.name,
            price: i.price,
            stockQuantity: i.stockQuantity,
            quantity: i.quantity,
            imageUrl: i.imageUrl,
            category: i.category
          })),
          customerName: this.customerName,
          customerPhone: this.customerPhone,
          discount: document.getElementById('summary-discount-input')?.value || '0',
          paymentMethod: document.getElementById('payment-method-select')?.value || 'cash',
          activeTab: document.querySelector('.nav-btn.active')?.getAttribute('data-tab') || 'pos',
          salesView: this.salesView,
          savedAt: Date.now()
        };
        localStorage.setItem(this._sessionKey, JSON.stringify(payload));
      } catch (e) {
        console.warn('[Session Persist Notice]:', e.message);
      }
    };
    if (immediate) {
      clearTimeout(this._persistTimer);
      write();
      return;
    }
    clearTimeout(this._persistTimer);
    this._persistTimer = setTimeout(write, 120);
  }

  restoreSession() {
    try {
      const raw = localStorage.getItem(this._sessionKey);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return;

      this.cart = Array.isArray(data.cart) ? data.cart : [];
      this.customerName = data.customerName || 'Walk-in Customer';
      this.customerPhone = data.customerPhone || '';
      this.salesView = data.salesView === 'customers' ? 'customers' : 'bills';

      const discountInput = document.getElementById('summary-discount-input');
      if (discountInput && data.discount != null) discountInput.value = data.discount;
      const paySelect = document.getElementById('payment-method-select');
      if (paySelect && data.paymentMethod) paySelect.value = data.paymentMethod;

      this.syncCustomerPhoneUI();
      this.renderCart();

      if (data.activeTab && data.activeTab !== 'pos') {
        this.switchTab(data.activeTab, { skipHistory: true });
        document.querySelectorAll('.nav-btn').forEach((b) => {
          b.classList.toggle('active', b.getAttribute('data-tab') === data.activeTab);
        });
      }
      this.setSalesView(this.salesView);
      this.updateBackButton();
    } catch (e) {
      console.warn('[Session Restore Notice]:', e.message);
    }
  }

  clearPersistedSession() {
    localStorage.removeItem(this._sessionKey);
  }

  setupAuthLanding() {
    const known = localStorage.getItem('qb_has_account') === 'true';
    const lastEmail = localStorage.getItem('qb_last_email') || '';

    if (known) {
      this.switchAuthTab('login');
      const loginEmail = document.getElementById('login-email');
      if (loginEmail && lastEmail) loginEmail.value = lastEmail;
    } else {
      this.switchAuthTab('register');
    }

    const loginEmailInput = document.getElementById('login-email');
    if (loginEmailInput && !loginEmailInput.dataset.authBound) {
      loginEmailInput.dataset.authBound = '1';
      loginEmailInput.addEventListener('blur', () => this.onLoginEmailBlur());
    }
  }

  setAuthError(message) {
    const el = document.getElementById('auth-error');
    if (!el) {
      if (message) alert(message);
      return;
    }
    if (!message) {
      el.style.display = 'none';
      el.textContent = '';
      return;
    }
    el.style.display = 'block';
    el.textContent = message;
  }

  setAuthBusy(busy) {
    document.querySelectorAll('#auth-login-form button, #auth-register-form button').forEach((btn) => {
      btn.disabled = !!busy;
    });
  }

  rememberAccount(email) {
    localStorage.setItem('qb_has_account', 'true');
    if (email) localStorage.setItem('qb_last_email', String(email).toLowerCase().trim());
  }

  async enterAuthenticatedApp(user) {
    this.currentUser = user;
    const cashierLabel = document.getElementById('cashier-name-label');
    if (cashierLabel) cashierLabel.innerText = user?.name || 'Cashier';
    document.getElementById('auth-view').style.display = 'none';
    document.getElementById('app-view').style.display = 'block';
    this.setAuthError('');

    this.restoreSession();
    await this.loadProducts();
    await this.loadDashboardStats();
    await this.loadSalesHistory();
    this.fetchAiInsights();
    this.activatePosSession();
    this.updateBackButton();
  }

  t(key) {
    const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS['en'];
    return dict[key] || TRANSLATIONS['en'][key] || key;
  }

  showToast(message, duration = 3000) {
    const toast = document.getElementById('ai-toast');
    if (!toast) return;
    toast.innerText = message;
    toast.classList.add('show');
    toast.style.display = 'block';
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.remove('show');
      toast.style.display = 'none';
    }, duration);
  }

  pulseCart() {
    const cart = document.getElementById('cart-section');
    if (!cart) return;
    cart.classList.remove('cart-pulse');
    void cart.offsetWidth;
    cart.classList.add('cart-pulse');
  }

  // --- MULTI-LANGUAGE TRANSLATION ENGINE ---
  changeLanguage(langCode) {
    this.currentLang = langCode;
    localStorage.setItem('qb_lang', langCode);
    this.applyTranslations(langCode);
    this.showToast(`Language updated to ${langCode.toUpperCase()}`);
  }

  applyTranslations(lang) {
    this.currentLang = lang || this.currentLang;
    const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS['en'];

    // Translate text nodes with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(elem => {
      const key = elem.getAttribute('data-i18n');
      if (dict[key]) {
        elem.innerText = dict[key];
      }
    });

    // Translate input placeholders with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(elem => {
      const key = elem.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        elem.setAttribute('placeholder', dict[key]);
      }
    });

    // Re-render dynamic components in selected language
    this.renderProductsGrid();
    this.renderCart();
    this.renderInventoryTable();
    this.renderSalesTable();
  }

  // --- AUTHENTICATION & LOGIN PAGE LANDING ---
  async checkAuthentication() {
    const token = API.getToken();
    const authView = document.getElementById('auth-view');
    const appView = document.getElementById('app-view');

    if (!token) {
      if (authView) authView.style.display = 'flex';
      if (appView) appView.style.display = 'none';
      this.setupAuthLanding();
      this.applyTranslations(this.currentLang);
      return;
    }

    try {
      const res = await API.getMe();
      if (res && res.user) {
        this.rememberAccount(res.user.email);
        await this.enterAuthenticatedApp(res.user);
        this.applyTranslations(this.currentLang);
      } else {
        this.showLoginView();
      }
    } catch (err) {
      console.warn('[Auth Verify Notice]:', err.message);
      API.removeToken();
      this.showLoginView();
      this.applyTranslations(this.currentLang);
    }
  }

  activatePosSession() {
    // Start immediately (keep user-gesture from login click) + retry once
    const start = () => window.VoiceAssistantInstance?.enableHandsFree?.({ silent: false });
    start();
    setTimeout(start, 1500);
  }

  showLoginView() {
    API.removeToken();
    const authView = document.getElementById('auth-view');
    const appView = document.getElementById('app-view');
    if (authView) authView.style.display = 'flex';
    if (appView) appView.style.display = 'none';
    if (window.VoiceAssistantInstance?.disableHandsFree) {
      window.VoiceAssistantInstance.disableHandsFree();
    }
    this.setupAuthLanding();
  }

  switchAuthTab(tab) {
    const loginForm = document.getElementById('auth-login-form');
    const regForm = document.getElementById('auth-register-form');
    const btnLogin = document.getElementById('tab-btn-login');
    const btnReg = document.getElementById('tab-btn-register');
    const subtitle = document.getElementById('auth-panel-subtitle');
    const hint = document.getElementById('auth-hint');
    this.setAuthError('');

    if (tab === 'login') {
      loginForm.style.display = 'flex';
      regForm.style.display = 'none';
      btnLogin.classList.add('active');
      btnReg.classList.remove('active');
      if (subtitle) subtitle.textContent = 'Welcome back — sign in to your terminal';
      if (hint) hint.textContent = 'Already registered? Enter your email and password to continue.';
    } else {
      loginForm.style.display = 'none';
      regForm.style.display = 'flex';
      btnReg.classList.add('active');
      btnLogin.classList.remove('active');
      if (subtitle) subtitle.textContent = 'New here? Create your cashier account';
      if (hint) hint.textContent = 'New users should Register. If this email already exists, we’ll switch you to Sign In.';
    }
  }

  async onRegisterEmailBlur() {
    const email = document.getElementById('reg-email')?.value?.trim();
    if (!email || !email.includes('@')) return;
    try {
      const res = await API.checkEmail(email);
      if (res.exists) {
        this.setAuthError('This email is already registered. Switching to Sign In…');
        document.getElementById('login-email').value = email;
        document.getElementById('login-password').value = '';
        this.rememberAccount(email);
        setTimeout(() => this.switchAuthTab('login'), 450);
      }
    } catch (e) {
      // ignore network blips on blur
    }
  }

  async onLoginEmailBlur() {
    const email = document.getElementById('login-email')?.value?.trim();
    if (!email || !email.includes('@')) return;
    try {
      const res = await API.checkEmail(email);
      if (!res.exists) {
        this.setAuthError('No account found for this email. Please Register first.');
        document.getElementById('reg-email').value = email;
      } else {
        this.setAuthError('');
      }
    } catch (e) {}
  }

  async handleAuthSubmit(e, mode) {
    e.preventDefault();
    this.setAuthError('');
    this.setAuthBusy(true);

    try {
      if (mode === 'login') {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        const res = await API.login(email, password);
        if (res.token) {
          API.setToken(res.token);
          this.rememberAccount(res.user?.email || email);
          this.showToast(res.message || 'Signed in successfully');
          await this.enterAuthenticatedApp(res.user);
        }
      } else if (mode === 'register') {
        const userData = {
          name: document.getElementById('reg-name').value.trim(),
          email: document.getElementById('reg-email').value.trim(),
          password: document.getElementById('reg-password').value,
          role: document.getElementById('reg-role').value
        };

        const res = await API.register(userData);
        if (res.token) {
          API.setToken(res.token);
          this.rememberAccount(res.user?.email || userData.email);
          this.showToast(res.message || 'Account created successfully');
          await this.enterAuthenticatedApp(res.user);
        }
      }
    } catch (err) {
      const msg = err.message || 'Authentication failed';
      const lower = msg.toLowerCase();

      if (mode === 'register' && (lower.includes('already') || lower.includes('sign in'))) {
        const email = document.getElementById('reg-email')?.value || '';
        this.setAuthError(msg);
        document.getElementById('login-email').value = email;
        this.rememberAccount(email);
        setTimeout(() => this.switchAuthTab('login'), 400);
      } else if (mode === 'login' && (lower.includes('no account') || lower.includes('register'))) {
        const email = document.getElementById('login-email')?.value || '';
        this.setAuthError(msg);
        document.getElementById('reg-email').value = email;
        setTimeout(() => this.switchAuthTab('register'), 400);
      } else {
        this.setAuthError(msg);
      }
    } finally {
      this.setAuthBusy(false);
    }
  }

  async loginAsDemoCashier() {
    this.setAuthBusy(true);
    this.setAuthError('');
    try {
      const res = await API.login('cashier@quickbill.com', '123456');
      if (res.token) {
        API.setToken(res.token);
        this.rememberAccount('cashier@quickbill.com');
        await this.enterAuthenticatedApp(res.user || { name: 'Senior Cashier', email: 'cashier@quickbill.com' });
        return;
      }
    } catch (e) {
      this.setAuthError(e.message || 'Demo login failed');
    } finally {
      this.setAuthBusy(false);
    }
  }

  logout() {
    API.removeToken();
    this.currentUser = null;
    this.persistSession(true);
    // Keep qb_has_account so returning users land on Sign In
    document.getElementById('auth-view').style.display = 'flex';
    document.getElementById('app-view').style.display = 'none';
    if (window.VoiceAssistantInstance?.disableHandsFree) {
      window.VoiceAssistantInstance.disableHandsFree();
    }
    this.switchAuthTab('login');
    const lastEmail = localStorage.getItem('qb_last_email') || '';
    const loginEmail = document.getElementById('login-email');
    if (loginEmail) loginEmail.value = lastEmail;
    const loginPassword = document.getElementById('login-password');
    if (loginPassword) loginPassword.value = '';
  }

  setupTabNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tabTarget = btn.getAttribute('data-tab');
        this.switchTab(tabTarget);
      });
    });
  }

  switchTab(tabName, opts = {}) {
    const current = document.querySelector('.tab-pane.active')?.id?.replace(/^tab-/, '') || 'pos';
    if (!opts.skipHistory && tabName && tabName !== current) {
      this.tabHistory.push(current);
      if (this.tabHistory.length > 20) this.tabHistory.shift();
    }

    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    const activePane = document.getElementById(`tab-${tabName}`);
    if (activePane) activePane.classList.add('active');

    if (tabName === 'analytics') {
      this.loadDashboardStats();
    } else if (tabName === 'inventory') {
      this.renderInventoryTable();
    } else if (tabName === 'sales') {
      this.loadSalesHistory();
    }

    this.persistSession();
    this.updateBackButton();
  }

  updateBackButton() {
    const btn = document.getElementById('btn-nav-back');
    if (!btn) return;
    const activeTab = document.querySelector('.tab-pane.active')?.id?.replace(/^tab-/, '') || 'pos';
    const detailOpen = document.getElementById('sale-detail-panel')?.style.display === 'block';
    const receiptOpen = document.getElementById('receipt-modal')?.classList.contains('active');
    btn.style.display = (activeTab !== 'pos' || detailOpen || receiptOpen || this.tabHistory.length > 1) ? 'inline-flex' : 'none';
  }

  goBack() {
    const receipt = document.getElementById('receipt-modal');
    if (receipt?.classList.contains('active')) {
      this.closeReceiptModal();
      return;
    }
    const detail = document.getElementById('sale-detail-panel');
    if (detail && detail.style.display === 'block') {
      this.closeSaleDetail();
      return;
    }
    const prev = this.tabHistory.pop() || 'pos';
    document.querySelectorAll('.nav-btn').forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-tab') === prev);
    });
    this.switchTab(prev, { skipHistory: true });
  }

  // --- PRODUCT MANAGEMENT & REST API ---
  async loadProducts() {
    try {
      const data = await API.getProducts('', this.currentCategory);
      this.products = data.products || [];
      this.renderProductsGrid();
      this.renderInventoryTable();
      this.checkLowStockAlerts();
    } catch (err) {
      console.warn('[Products Load Warning]:', err.message);
    }
  }

  isLowStock(p) {
    return Number(p.stockQuantity) < this.lowStockThreshold;
  }

  getLowStockProducts() {
    return (this.products || []).filter((p) => this.isLowStock(p));
  }

  checkLowStockAlerts(force = false) {
    const low = this.getLowStockProducts();
    const badge = document.getElementById('low-stock-badge');
    if (badge) {
      badge.textContent = low.length ? String(low.length) : '';
      badge.style.display = low.length ? 'inline-flex' : 'none';
    }

    // Update analytics tile if present
    const stat = document.getElementById('stat-low-stock');
    if (stat) stat.innerText = String(low.length);

    if (!low.length) return;
    if (!force && this._lowStockPrompted) return;
    this._lowStockPrompted = true;
    setTimeout(() => this.openLowStockAlertModal(low), 700);
  }

  openLowStockAlertModal(products) {
    const list = products || this.getLowStockProducts();
    const modal = document.getElementById('low-stock-modal');
    const body = document.getElementById('low-stock-list');
    const title = document.getElementById('low-stock-title');
    if (!modal || !body) return;

    if (title) {
      title.textContent = `Low Stock Alert — ${list.length} item${list.length === 1 ? '' : 's'} below ${this.lowStockThreshold}`;
    }

    body.innerHTML = list.map((p) => `
      <div class="low-stock-row" data-id="${p._id}">
        <img src="${p.imageUrl || ''}" alt="" class="table-thumb" onerror="this.style.visibility='hidden'">
        <div class="low-stock-meta">
          <strong>${p.name}</strong>
          <span>Stock: <em class="stock-tag low">${p.stockQuantity}</em> · Cost ₹${Number(p.costPrice || 0).toFixed(2)}</span>
        </div>
        <button type="button" class="btn btn-primary btn-sm" onclick="window.POS_APP.compareWholesaleForProduct('${p._id}')">Compare &amp; Order</button>
      </div>
    `).join('');

    modal.classList.add('active');
    this.showToast(`Low stock: ${list.length} product(s) below ${this.lowStockThreshold}`, 4000);
  }

  closeLowStockModal() {
    document.getElementById('low-stock-modal')?.classList.remove('active');
  }

  async compareWholesaleForProduct(productId) {
    const product = this.products.find((p) => p._id === productId);
    if (!product) return;
    await this.showWholesaleCompare([product]);
  }

  async compareWholesaleAllLowStock() {
    const low = this.getLowStockProducts();
    if (!low.length) {
      this.showToast('No low-stock items right now');
      return;
    }
    await this.showWholesaleCompare(low);
  }

  async showWholesaleCompare(products) {
    const modal = document.getElementById('wholesale-modal');
    const body = document.getElementById('wholesale-compare-body');
    const summaryEl = document.getElementById('wholesale-summary');
    if (!modal || !body) return;

    body.innerHTML = `<div class="empty-state">Comparing Flipkart Wholesale, Udaan, Metro &amp; JioMart Partner…</div>`;
    if (summaryEl) summaryEl.textContent = 'Fetching live wholesale quotes…';
    modal.classList.add('active');
    this.closeLowStockModal();

    try {
      const data = await API.compareWholesale({
        threshold: this.lowStockThreshold,
        products: products.map((p) => ({
          _id: p._id,
          id: p._id,
          name: p.name,
          barcode: p.barcode,
          category: p.category,
          price: p.price,
          costPrice: p.costPrice,
          stockQuantity: p.stockQuantity,
          unit: p.unit,
          imageUrl: p.imageUrl
        }))
      });

      this._wholesaleData = data;
      if (summaryEl) summaryEl.textContent = data.overview?.message || '';

      body.innerHTML = (data.comparisons || []).map((c) => {
        const bestId = c.bestSupplier?.supplierId;
        const rows = (c.quotes || []).map((q) => `
          <tr class="${q.supplierId === bestId ? 'best-quote' : ''}">
            <td><strong>${q.shortName}</strong><br><small>${q.supplierName}</small></td>
            <td>₹${q.unitCost.toFixed(2)}</td>
            <td>${q.recommendedQty}</td>
            <td>₹${q.deliveryFee.toFixed(2)}</td>
            <td><strong>₹${q.totalCost.toFixed(2)}</strong></td>
            <td>~${q.etaDays}d</td>
            <td>
              <button type="button" class="btn ${q.supplierId === bestId ? 'btn-success' : 'btn-primary'} btn-sm"
                onclick="window.POS_APP.placeWholesaleOrder('${c.product.id}', '${q.supplierId}')">
                ${q.supplierId === bestId ? 'Order Best' : 'Order'}
              </button>
            </td>
          </tr>
        `).join('');

        return `
          <div class="wholesale-card">
            <div class="wholesale-card-head">
              <div>
                <h4>${c.product.name}</h4>
                <p>In stock: <span class="stock-tag low">${c.product.stockQuantity}</span> · Store cost ₹${Number(c.product.storeCostPrice).toFixed(2)}</p>
              </div>
              <div class="wholesale-reco">
                <span class="badge-cat">Best: ${c.bestSupplier.shortName}</span>
                <strong>₹${c.bestSupplier.totalCost.toFixed(2)}</strong>
              </div>
            </div>
            <p class="wholesale-tip">${c.summary.recommendation}</p>
            <div class="table-wrap">
              <table class="data-table wholesale-table">
                <thead>
                  <tr>
                    <th>Supplier</th>
                    <th>Unit Cost</th>
                    <th>Qty</th>
                    <th>Delivery</th>
                    <th>Total</th>
                    <th>ETA</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>
            </div>
          </div>
        `;
      }).join('') || `<div class="empty-state">No quotes available.</div>`;
    } catch (err) {
      body.innerHTML = `<div class="empty-state">Failed to compare wholesale prices: ${err.message}</div>`;
      if (summaryEl) summaryEl.textContent = '';
    }
  }

  closeWholesaleModal() {
    document.getElementById('wholesale-modal')?.classList.remove('active');
  }

  async placeWholesaleOrder(productId, supplierId) {
    const comparison = (this._wholesaleData?.comparisons || [])
      .find((c) => String(c.product.id) === String(productId));
    if (!comparison) {
      this.showToast('Quote expired — compare again');
      return;
    }
    const quote = (comparison.quotes || []).find((q) => q.supplierId === supplierId) || comparison.bestSupplier;
    if (!quote) return;

    try {
      const res = await API.placeWholesaleOrder({
        productId,
        supplierId: quote.supplierId,
        supplierName: quote.supplierName,
        quantity: quote.recommendedQty,
        unitCost: quote.unitCost,
        totalCost: quote.totalCost
      });

      this.showToast(res.message || `Ordered from ${quote.supplierName}`);
      await this.loadProducts();
      await this.loadDashboardStats();

      // Refresh compare panel for remaining low stock
      const stillLow = this.getLowStockProducts();
      if (stillLow.length) {
        await this.showWholesaleCompare(stillLow);
      } else {
        this.closeWholesaleModal();
        this.showToast('All low-stock items restocked', 3500);
      }

      // Optional: open supplier portal
      if (quote.orderUrl) {
        window.open(quote.orderUrl, '_blank', 'noopener');
      }
    } catch (err) {
      alert('Wholesale order failed: ' + err.message);
    }
  }

  renderProductsGrid() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    if (this.products.length === 0) {
      grid.innerHTML = `<div class="empty-state">No products found in database.</div>`;
      return;
    }

    grid.innerHTML = this.products.map(p => `
      <div class="product-card" onclick="window.POS_APP.addToCartById('${p._id}')">
        <img src="${p.imageUrl}" class="product-img" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=400&q=80'">
        <div class="product-title">${p.name}</div>
        <div class="product-sku">${this.t('th_sku')}: ${p.barcode}</div>
        <div class="product-footer">
          <span class="product-price">₹${p.price.toFixed(2)}</span>
          <span class="stock-tag ${this.isLowStock(p) ? 'low' : ''}">
            ${this.t('th_stock')}: ${p.stockQuantity}
          </span>
        </div>
      </div>
    `).join('');
  }

  filterCategory(cat) {
    this.currentCategory = cat;
    document.querySelectorAll('.cat-pill').forEach(pill => {
      pill.classList.toggle('active', pill.innerText.includes(cat));
    });
    this.loadProducts();
  }

  handleSearch(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      this.renderProductsGrid();
      return;
    }

    const filtered = this.products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.barcode.includes(term) ||
      p.sku.toLowerCase().includes(term)
    );

    const grid = document.getElementById('products-grid');
    if (grid) {
      if (filtered.length === 0) {
        grid.innerHTML = `<div class="empty-state">No matching products.</div>`;
        return;
      }
      grid.innerHTML = filtered.map(p => `
        <div class="product-card" onclick="window.POS_APP.addToCartById('${p._id}')">
          <img src="${p.imageUrl}" class="product-img" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=400&q=80'">
          <div class="product-title">${p.name}</div>
          <div class="product-sku">Barcode: ${p.barcode}</div>
          <div class="product-footer">
            <span class="product-price">₹${p.price.toFixed(2)}</span>
            <span class="stock-tag ${this.isLowStock(p) ? 'low' : ''}">Stock: ${p.stockQuantity}</span>
          </div>
        </div>
      `).join('');
    }
  }

  // --- CART & BILLING ---
  addToCartById(id) {
    const prod = this.products.find(p => p._id === id);
    if (prod) this.addToCart(prod);
  }

  normalizePhone(phone) {
    const digits = String(phone || '').replace(/\D/g, '');
    if (!digits) return '';
    if (digits.length === 10) return digits;
    if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
    if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
    return digits.length >= 10 ? digits.slice(-10) : digits;
  }

  isValidMobile(phone) {
    return /^[6-9]\d{9}$/.test(this.normalizePhone(phone));
  }

  toWhatsAppNumber(phone) {
    const local = this.normalizePhone(phone);
    return local ? `91${local}` : '';
  }

  ensureCustomerPhone() {
    if (this.isValidMobile(this.customerPhone)) {
      return Promise.resolve(this.customerPhone);
    }

    return new Promise((resolve) => {
      this._phoneModalResolver = resolve;
      const input = document.getElementById('customer-phone-input');
      const nameInput = document.getElementById('customer-name-input');
      if (input) input.value = this.customerPhone || '';
      if (nameInput) nameInput.value = this.customerName && this.customerName !== 'Walk-in Customer' ? this.customerName : '';
      const modal = document.getElementById('customer-phone-modal');
      if (modal) modal.classList.add('active');
      setTimeout(() => input && input.focus(), 150);
    });
  }

  saveCustomerPhone(event) {
    if (event) event.preventDefault();
    const phoneInput = document.getElementById('customer-phone-input');
    const nameInput = document.getElementById('customer-name-input');
    const phone = this.normalizePhone(phoneInput?.value);
    const name = (nameInput?.value || '').trim() || 'Walk-in Customer';

    if (!this.isValidMobile(phone)) {
      alert('Please enter a valid 10-digit mobile number (starting with 6–9).');
      phoneInput?.focus();
      return;
    }

    this.customerPhone = phone;
    this.customerName = name;
    this.syncCustomerPhoneUI();
    this.persistSession();
    this.closeCustomerPhoneModal(true);
  }

  closeCustomerPhoneModal(saved = false) {
    const modal = document.getElementById('customer-phone-modal');
    if (modal) modal.classList.remove('active');
    if (this._phoneModalResolver) {
      const resolve = this._phoneModalResolver;
      this._phoneModalResolver = null;
      resolve(saved ? this.customerPhone : null);
    }
  }

  syncCustomerPhoneUI() {
    const display = document.getElementById('customer-phone-display');
    const field = document.getElementById('cart-customer-phone');
    if (field) field.value = this.customerPhone || '';
    if (display) {
      display.textContent = this.customerPhone
        ? `${this.customerName} · +91 ${this.customerPhone}`
        : 'Customer mobile not set';
    }
  }

  onCartPhoneChange(value) {
    const phone = this.normalizePhone(value);
    this.customerPhone = phone;
    if (!value) this.customerName = 'Walk-in Customer';
    this.syncCustomerPhoneUI();
    this.persistSession();
  }

  async addToCart(prod) {
    if (prod.stockQuantity <= 0) {
      alert(`Out of stock! "${prod.name}" has 0 remaining units.`);
      return;
    }

    const wasEmpty = this.cart.length === 0;

    const existing = this.cart.find(item => item._id === prod._id);
    if (existing) {
      if (existing.quantity >= prod.stockQuantity) {
        alert(`Cannot add more. Reached max available stock (${prod.stockQuantity}) for "${prod.name}".`);
        return;
      }
      existing.quantity += 1;
    } else {
      this.cart.push({ ...prod, quantity: 1 });
    }

    this.renderCart();
    this.pulseCart();
    this.persistSession();

    if (wasEmpty && !this.isValidMobile(this.customerPhone)) {
      await this.ensureCustomerPhone();
      this.syncCustomerPhoneUI();
      this.persistSession();
    }
  }

  updateQuantity(id, delta) {
    const item = this.cart.find(i => i._id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.cart = this.cart.filter(i => i._id !== id);
    }
    this.renderCart();
    this.persistSession();
  }

  clearCart() {
    this.cart = [];
    this.renderCart();
    this.persistSession();
  }

  resetCustomerAfterSale() {
    this.customerPhone = '';
    this.customerName = 'Walk-in Customer';
    this.syncCustomerPhoneUI();
    this.persistSession();
  }

  renderCart() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS['en'];

    if (this.cart.length === 0) {
      container.innerHTML = `<div class="empty-state">${dict.cart_empty_text}</div>`;
      this.calculateTotals();
      return;
    }

    container.innerHTML = this.cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${item.price.toFixed(2)} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}</div>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="window.POS_APP.updateQuantity('${item._id}', -1)">-</button>
          <span class="qty-num">${item.quantity}</span>
          <button class="qty-btn" onclick="window.POS_APP.updateQuantity('${item._id}', 1)">+</button>
        </div>
      </div>
    `).join('');

    this.calculateTotals();
  }

  calculateTotals() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = 0;
    const discount = parseFloat(document.getElementById('summary-discount-input')?.value || 0);
    const grandTotal = Math.max(0, subtotal - discount);

    const subtotalElem = document.getElementById('summary-subtotal');
    if (subtotalElem) subtotalElem.innerText = `₹${subtotal.toFixed(2)}`;

    const grandTotalElem = document.getElementById('summary-grand-total');
    if (grandTotalElem) grandTotalElem.innerText = `₹${grandTotal.toFixed(2)}`;
  }

  async processCheckout() {
    if (this.cart.length === 0) {
      alert('Cart is empty. Please add items before checking out.');
      return;
    }

    const livePhone = document.getElementById('cart-customer-phone')?.value;
    if (livePhone) this.customerPhone = this.normalizePhone(livePhone);

    if (!this.isValidMobile(this.customerPhone)) {
      const phone = await this.ensureCustomerPhone();
      if (!this.isValidMobile(phone || this.customerPhone)) {
        alert('Customer mobile number is required to complete payment and send the WhatsApp bill.');
        return;
      }
    }

    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = 0;
    const discount = parseFloat(document.getElementById('summary-discount-input')?.value || 0);
    const grandTotal = Math.max(0, subtotal - discount);
    const paymentMethod = document.getElementById('payment-method-select')?.value || 'cash';

    const salePayload = {
      items: this.cart.map(i => ({
        barcode: i.barcode,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        total: i.price * i.quantity
      })),
      subtotal,
      tax,
      discount,
      grandTotal,
      paymentMethod,
      customer: {
        name: this.customerName || 'Walk-in Customer',
        phone: this.normalizePhone(this.customerPhone)
      },
      cashierName: document.getElementById('cashier-name-label')?.innerText || 'Cashier'
    };

    try {
      const res = await API.createSale(salePayload);
      if (res.success) {
        this.activeSale = {
          ...res.sale,
          customer: salePayload.customer,
          paymentMethod,
          subtotal,
          discount,
          tax,
          cashierName: salePayload.cashierName
        };
        this.showReceiptModal(this.activeSale);
        this.clearCart();
        this.resetCustomerAfterSale();
        await this.loadProducts();
        await this.loadSalesHistory();
        await this.loadDashboardStats();

        // Generate PDF + silently deliver to customer (no WhatsApp popup / no cashier permission)
        await this.generateAndDeliverBillPdf(this.activeSale);
      }
    } catch (err) {
      alert('Failed to process checkout: ' + err.message);
    }
  }

  generateBillPdfBase64(sale) {
    if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
      throw new Error('PDF library not loaded');
    }
    const JsPDF = window.jspdf?.jsPDF || window.jsPDF;
    const doc = new JsPDF({ unit: 'mm', format: 'a4' });
    const phone = this.normalizePhone(sale.customer?.phone || '');
    const name = sale.customer?.name || 'Customer';
    let y = 18;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('QUICKBILL POS', 105, y, { align: 'center' });
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Supermarket & Retail Store', 105, y, { align: 'center' });
    y += 5;
    doc.setFontSize(9);
    doc.text('GSTIN: 29AAAAA0000A1Z5  |  Ph: +91 98765 00000', 105, y, { align: 'center' });
    y += 8;
    doc.setDrawColor(15, 118, 110);
    doc.line(20, y, 190, y);
    y += 8;

    doc.setFontSize(10);
    doc.text(`Invoice: ${sale.invoiceNo}`, 20, y);
    doc.text(`Date: ${new Date(sale.createdAt || Date.now()).toLocaleString()}`, 120, y);
    y += 6;
    doc.text(`Customer: ${name}${phone ? ` (+91 ${phone})` : ''}`, 20, y);
    y += 6;
    doc.text(`Payment: ${String(sale.paymentMethod || 'cash').replace(/_/g, ' ').toUpperCase()}`, 20, y);
    doc.text(`Cashier: ${sale.cashierName || 'Cashier'}`, 120, y);
    y += 8;
    doc.line(20, y, 190, y);
    y += 7;

    doc.setFont('helvetica', 'bold');
    doc.text('Item', 20, y);
    doc.text('Qty', 120, y);
    doc.text('Amount', 170, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.line(20, y, 190, y);
    y += 6;

    (sale.items || []).forEach((item) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(String(item.name).substring(0, 48), 20, y);
      doc.text(String(item.quantity), 120, y);
      doc.text(`Rs ${Number(item.total).toFixed(2)}`, 170, y);
      y += 6;
    });

    y += 2;
    doc.line(20, y, 190, y);
    y += 7;
    doc.text(`Subtotal: Rs ${Number(sale.subtotal || 0).toFixed(2)}`, 140, y);
    y += 6;
    doc.text(`Discount: Rs ${Number(sale.discount || 0).toFixed(2)}`, 140, y);
    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`TOTAL PAID: Rs ${Number(sale.grandTotal).toFixed(2)}`, 140, y);
    y += 12;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Thank you for shopping with QuickBill!', 105, y, { align: 'center' });
    y += 5;
    doc.text('We appreciate your visit. Have a wonderful day!', 105, y, { align: 'center' });

    return doc.output('datauristring');
  }

  downloadPdfDataUri(dataUri, fileName) {
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async generateAndDeliverBillPdf(sale) {
    const status = document.getElementById('receipt-whatsapp-status');
    const btn = document.getElementById('btn-send-whatsapp-bill');
    const fileName = `${sale.invoiceNo || 'QuickBill'}.pdf`;
    const phone = this.normalizePhone(sale.customer?.phone || this.customerPhone);

    if (!this.isValidMobile(phone)) {
      this.showToast('Customer mobile number required to send WhatsApp bill');
      if (status) status.textContent = 'Add customer mobile to send WhatsApp bill';
      return null;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending PDF…';
    }

    try {
      if (status) status.textContent = 'Generating PDF bill…';
      const pdfDataUri = this.generateBillPdfBase64(sale);
      this.lastBillPdf = pdfDataUri;

      if (status) status.textContent = `Auto-sending PDF bill to +91 ${phone}…`;
      const message = this.buildWhatsAppBillMessage({ ...sale, customer: { ...(sale.customer || {}), phone } });
      const delivery = await API.sendCustomerBill({
        phone,
        message,
        pdfBase64: pdfDataUri,
        fileName,
        invoiceNo: sale.invoiceNo
      });

      // Keep a local copy for the cashier (no WhatsApp popup / no manual Send)
      this.downloadPdfDataUri(pdfDataUri, fileName);

      if (status) {
        status.textContent = delivery?.delivered
          ? `PDF bill automatically sent to +91 ${phone} ✓`
          : `PDF saved${delivery?.pdfUrl ? ` · ${delivery.pdfUrl}` : ''}`;
      }
      this.showToast(`PDF bill sent to customer +91 ${phone}`, 4500);
      return delivery;
    } catch (err) {
      console.warn('[Bill PDF Delivery]', err.message);
      if (status) status.textContent = 'Auto-send failed — tap WhatsApp to retry';
      this.showToast('Could not auto-send PDF bill. Try again.', 4000);
      return null;
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Send Bill on WhatsApp';
      }
    }
  }

  showReceiptModal(sale) {
    const invEl = document.getElementById('receipt-inv-no');
    const dateEl = document.getElementById('receipt-date');
    const totalEl = document.getElementById('receipt-total-val');
    const customerEl = document.getElementById('receipt-customer');
    const paymentEl = document.getElementById('receipt-payment');
    const cashierEl = document.getElementById('receipt-cashier');
    const subtotalEl = document.getElementById('receipt-subtotal');
    const discountEl = document.getElementById('receipt-discount');
    const whatsappStatus = document.getElementById('receipt-whatsapp-status');

    if (invEl) invEl.innerText = sale.invoiceNo;
    if (dateEl) dateEl.innerText = new Date(sale.createdAt || Date.now()).toLocaleString();
    if (totalEl) totalEl.innerText = `₹${Number(sale.grandTotal).toFixed(2)}`;
    if (subtotalEl) subtotalEl.innerText = `₹${Number(sale.subtotal || sale.grandTotal).toFixed(2)}`;
    if (discountEl) discountEl.innerText = `₹${Number(sale.discount || 0).toFixed(2)}`;

    const phone = sale.customer?.phone || this.customerPhone || '';
    const name = sale.customer?.name || this.customerName || 'Walk-in Customer';
    if (customerEl) customerEl.innerText = phone ? `${name} · +91 ${this.normalizePhone(phone)}` : name;
    if (paymentEl) paymentEl.innerText = String(sale.paymentMethod || 'cash').replace(/_/g, ' ').toUpperCase();
    if (cashierEl) cashierEl.innerText = sale.cashierName || 'Cashier';
    if (whatsappStatus) {
      whatsappStatus.textContent = phone
        ? `Preparing PDF bill for +91 ${this.normalizePhone(phone)}…`
        : 'Customer mobile required for WhatsApp delivery';
    }

    const itemsContainer = document.getElementById('receipt-items-list');
    if (itemsContainer) {
      itemsContainer.innerHTML = (sale.items || []).map(item => `
        <div class="receipt-line">
          <div class="receipt-item-meta">
            <span class="receipt-item-name">${item.name}</span>
            <span class="receipt-item-qty">₹${Number(item.price).toFixed(2)} × ${item.quantity}</span>
          </div>
          <span class="receipt-item-total">₹${Number(item.total).toFixed(2)}</span>
        </div>
      `).join('');
    }

    document.getElementById('receipt-modal').classList.add('active');
    this.updateBackButton();
  }

  closeReceiptModal() {
    document.getElementById('receipt-modal').classList.remove('active');
    this.updateBackButton();
    // After payment/receipt, check low stock for replenishment
    setTimeout(() => this.checkLowStockAlerts(true), 500);
  }

  buildWhatsAppBillMessage(sale) {
    const phone = this.normalizePhone(sale.customer?.phone || '');
    const name = sale.customer?.name || 'Customer';
    const lines = (sale.items || []).map(
      (item, i) => `${i + 1}. ${item.name}  ×${item.quantity}  = ₹${Number(item.total).toFixed(2)}`
    ).join('\n');

    return [
      `*QUICKBILL POS*`,
      `Supermarket & Retail Store`,
      `────────────────────`,
      `Invoice: *${sale.invoiceNo}*`,
      `Date: ${new Date(sale.createdAt || Date.now()).toLocaleString()}`,
      `Customer: ${name}${phone ? ` (+91 ${phone})` : ''}`,
      `Cashier: ${sale.cashierName || 'Cashier'}`,
      `Payment: ${String(sale.paymentMethod || 'cash').replace(/_/g, ' ').toUpperCase()}`,
      `────────────────────`,
      `*Items*`,
      lines || '—',
      `────────────────────`,
      `Subtotal: ₹${Number(sale.subtotal || 0).toFixed(2)}`,
      `Discount: ₹${Number(sale.discount || 0).toFixed(2)}`,
      `*TOTAL PAID: ₹${Number(sale.grandTotal).toFixed(2)}*`,
      `────────────────────`,
      `Thank you for shopping with QuickBill!`,
      `We appreciate your visit. Have a wonderful day!`
    ].join('\n');
  }

  async shareWhatsAppBill() {
    if (!this.activeSale) {
      this.showToast('No bill available to send');
      return;
    }
    // One click → generate PDF and auto-send to customer WhatsApp (no manual Send step)
    await this.generateAndDeliverBillPdf(this.activeSale);
  }

  // --- BARCODE SCANNER MODAL ---
  playScanBeep() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // 880Hz scan beep
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) { }
  }

  openScannerModal() {
    document.getElementById('scanner-modal').classList.add('active');
    const input = document.getElementById('manual-scan-input');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 150);
    }

    if (window.Html5Qrcode) {
      // Clean up any lingering scanner instance first
      if (this.html5QrCode) {
        try { this.html5QrCode.stop().catch(() => {}); } catch(e) {}
      }

      this.html5QrCode = new Html5Qrcode("barcode-reader");
      this.html5QrCode.start(
        { facingMode: "environment" },
        { fps: 20, qrbox: { width: 320, height: 280 } },
        (decodedText) => {
          console.log('[Barcode Camera Scanned]:', decodedText);
          // 1. Immediately process scanned barcode result & add to cart
          this.handleBarcodeScanResult(decodedText);
          // 2. Safely close scanner modal
          this.closeScannerModal();
        },
        (error) => { /* scanning frame */ }
      ).catch(err => {
        console.warn('[Camera Scanner Warning]', err);
        const readerElem = document.getElementById('barcode-reader');
        if (readerElem) {
          readerElem.innerHTML = `<p style="padding:1rem; text-align:center; color:var(--text-muted); font-size:0.85rem;">Camera scanner ready or restricted. Type barcode below or click any preset chip.</p>`;
        }
      });
    }
  }

  closeScannerModal() {
    if (this.html5QrCode) {
      const scanner = this.html5QrCode;
      this.html5QrCode = null;
      try {
        scanner.stop().then(() => scanner.clear()).catch(() => {});
      } catch (e) {}
    }
    document.getElementById('scanner-modal').classList.remove('active');
  }

  submitManualScan() {
    const input = document.getElementById('manual-scan-input');
    const code = input ? input.value.trim() : '';
    if (!code) return;
    this.handleBarcodeScanResult(code);
    if (input) input.value = '';
  }

  async handleBarcodeScanResult(barcode) {
    const cleanCode = String(barcode || '').trim();
    if (!cleanCode) return;

    // 1. Step 1: Local DB Search & Direct Cart Add if product exists
    const localMatch = this.products.find(p => p.barcode === cleanCode || String(p.barcode).trim() === cleanCode);
    if (localMatch) {
      this.playScanBeep();
      this.addToCart(localMatch);
      this.showToast(`Scanned: "${localMatch.name}" (₹${localMatch.price.toFixed(2)}) added to cart!`);
      return;
    }

    let apiMatch = null;
    try {
      const res = await API.getProductByBarcode(cleanCode);
      if (res && res.product) {
        apiMatch = res.product;
      }
    } catch (err) {
      apiMatch = null;
    }

    if (apiMatch) {
      this.playScanBeep();
      this.addToCart(apiMatch);
      this.showToast(`Scanned: "${apiMatch.name}" (₹${apiMatch.price.toFixed(2)}) added to cart!`);
      return;
    }

    // 2. Step 2: Product not in local DB -> Search Free Public Barcode REST APIs (OpenFoodFacts / UPCItemDB - No AI/LLM)
    this.closeScannerModal();
    this.autoAddToCartBarcode = cleanCode;
    this.showToast(`Searching public barcode databases for "${cleanCode}"...`, 5000);

    try {
      const publicRes = await API.lookupPublicBarcode(cleanCode);
      if (publicRes && publicRes.found && publicRes.product) {
        const pub = publicRes.product;
        this.showToast(`Details found for "${pub.name}"! Pre-filling form...`);
        this.playScanBeep();
        this.openProductModal(null, pub);
        return;
      }
    } catch (pubErr) {
      console.warn('[Public Barcode Lookup Warning]:', pubErr.message);
    }

    // 3. Step 3: Not found in public databases -> Open Add Product form with only barcode prefilled
    this.showToast(`Barcode "${cleanCode}" pre-filled. Please enter product name & price.`);
    this.openProductModal(null, cleanCode);
  }

  // --- INVENTORY MANAGER CRUD ---
  renderInventoryTable() {
    const tbody = document.getElementById('inventory-table-body');
    if (!tbody) return;

    tbody.innerHTML = this.products.map(p => `
      <tr>
        <td><img src="${p.imageUrl}" class="table-thumb" alt="" onerror="this.src='https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=400&q=80'"></td>
        <td class="sku-cell"><strong>${p.sku}</strong><br><small>${p.barcode}</small></td>
        <td style="font-weight:600;">${p.name}</td>
        <td><span class="badge-cat">${p.category}</span></td>
        <td class="price-positive">₹${p.price.toFixed(2)}</td>
        <td>₹${(p.costPrice || 0).toFixed(2)}</td>
        <td><span class="stock-tag ${this.isLowStock(p) ? 'low' : ''}">${p.stockQuantity} ${p.unit || 'pcs'}</span></td>
        <td class="actions-cell">
          <button type="button" class="btn btn-primary btn-sm" onclick="window.POS_APP.editProduct('${p._id}')">Edit</button>
          <button type="button" class="btn btn-danger btn-sm" onclick="window.POS_APP.promptDeleteProduct('${p._id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  previewImage(url) {
    const preview = document.getElementById('prod-img-preview');
    if (preview) {
      preview.src = url || 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=400&q=80';
    }
  }

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Url = e.target.result;
        document.getElementById('prod-image').value = base64Url;
        this.previewImage(base64Url);
      };
      reader.readAsDataURL(file);
    }
  }

  openProductModal(product = null, publicDataOrBarcode = null) {
    document.getElementById('prod-id').value = product ? product._id : '';

    let isPublicMatch = typeof publicDataOrBarcode === 'object' && publicDataOrBarcode !== null;
    let barcodeVal = '';
    let nameVal = '';
    let categoryVal = 'General';
    let imageVal = 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=400&q=80';

    if (product) {
      nameVal = product.name;
      barcodeVal = product.barcode;
      categoryVal = product.category;
      imageVal = product.imageUrl || product.image_url || imageVal;
    } else if (isPublicMatch) {
      nameVal = publicDataOrBarcode.name || '';
      barcodeVal = publicDataOrBarcode.barcode || '';
      categoryVal = publicDataOrBarcode.category || 'General';
      imageVal = publicDataOrBarcode.imageUrl || imageVal;
    } else if (typeof publicDataOrBarcode === 'string') {
      barcodeVal = publicDataOrBarcode;
    } else {
      barcodeVal = `${Math.floor(1000000000000 + Math.random() * 9000000000000)}`;
    }

    document.getElementById('prod-name').value = nameVal;
    document.getElementById('prod-barcode').value = barcodeVal;
    document.getElementById('prod-category').value = categoryVal;
    document.getElementById('prod-price').value = product ? product.price : '';
    document.getElementById('prod-cost').value = product ? (product.costPrice || '') : '';
    document.getElementById('prod-stock').value = product ? product.stockQuantity : 25;
    document.getElementById('prod-image').value = imageVal;
    this.previewImage(imageVal);

    if (product) {
      document.getElementById('product-modal-title').innerText = 'Edit Product';
    } else if (isPublicMatch) {
      document.getElementById('product-modal-title').innerText = `Add Scanned Product (${publicDataOrBarcode.name})`;
    } else if (typeof publicDataOrBarcode === 'string') {
      document.getElementById('product-modal-title').innerText = `Add Scanned Product (${publicDataOrBarcode})`;
    } else {
      document.getElementById('product-modal-title').innerText = 'Add Product';
    }

    document.getElementById('product-modal').classList.add('active');

    setTimeout(() => {
      if (isPublicMatch) {
        const priceInput = document.getElementById('prod-price');
        if (priceInput) priceInput.focus();
      } else {
        const nameInput = document.getElementById('prod-name');
        if (nameInput) nameInput.focus();
      }
    }, 150);
  }

  closeProductModal() {
    document.getElementById('product-modal').classList.remove('active');
  }

  editProduct(id) {
    const prod = this.products.find(p => p._id === id);
    if (prod) this.openProductModal(prod);
  }

  // --- DELETE CONFIRMATION POPUP MODAL HANDLERS ---
  promptDeleteProduct(id) {
    const prod = this.products.find(p => p._id === id);
    if (!prod) return;

    document.getElementById('delete-target-id').value = id;
    const msgElem = document.getElementById('delete-confirm-msg');
    if (msgElem) {
      msgElem.innerText = `Are you sure you want to permanently delete "${prod.name}" (Barcode: ${prod.barcode}) from your store inventory?`;
    }

    const modal = document.getElementById('delete-confirm-modal');
    if (modal) modal.classList.add('active');
  }

  closeDeleteModal() {
    const modal = document.getElementById('delete-confirm-modal');
    if (modal) modal.classList.remove('active');
  }

  async confirmDeleteProduct() {
    const id = document.getElementById('delete-target-id')?.value;
    if (!id) return;

    try {
      await API.deleteProduct(id);
      this.closeDeleteModal();
      await this.loadProducts();
      this.showToast('Product deleted successfully from inventory.');
    } catch (err) {
      alert('Failed to delete product: ' + err.message);
      this.closeDeleteModal();
    }
  }

  async saveProduct(e) {
    e.preventDefault();
    const id = document.getElementById('prod-id').value;
    const imageUrl = document.getElementById('prod-image').value || 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=400&q=80';
    const targetBarcode = document.getElementById('prod-barcode').value.trim();

    const productData = {
      name: document.getElementById('prod-name').value,
      barcode: targetBarcode,
      category: document.getElementById('prod-category').value,
      price: parseFloat(document.getElementById('prod-price').value),
      costPrice: parseFloat(document.getElementById('prod-cost').value || 0),
      stockQuantity: parseInt(document.getElementById('prod-stock').value),
      imageUrl: imageUrl
    };

    try {
      let savedProduct = null;
      if (id) {
        const res = await API.updateProduct(id, productData);
        savedProduct = res.product;
      } else {
        const res = await API.createProduct(productData);
        savedProduct = res.product;
      }

      this.closeProductModal();
      await this.loadProducts();

      // Automatically add to billing cart if this product was created via barcode scan!
      const newlyAdded = this.products.find(p => p.barcode === targetBarcode) || savedProduct || productData;
      if (newlyAdded && (!id || this.autoAddToCartBarcode === targetBarcode)) {
        this.playScanBeep();
        this.addToCart(newlyAdded);
        this.showToast(`Product "${newlyAdded.name}" saved & automatically added to your cart!`, 3500);
      }
      this.autoAddToCartBarcode = null;
    } catch (err) {
      alert('Error saving product: ' + err.message);
    }
  }

  // --- SALES HISTORY & CUSTOMER BILLS ---
  async loadSalesHistory() {
    try {
      const data = await API.getSales(200);
      this.salesHistory = data.sales || [];
      this.customerHistory = data.customers || this.buildCustomerHistoryLocal(this.salesHistory);
      // Local cache so refresh still has history if network blips
      try {
        localStorage.setItem('qb_sales_cache_v1', JSON.stringify({
          sales: this.salesHistory,
          customers: this.customerHistory,
          savedAt: Date.now()
        }));
      } catch (e) {}
      this.renderSalesTable();
      this.renderCustomerHistory();
    } catch (err) {
      console.warn('[Sales History Warning]:', err.message);
      try {
        const cached = JSON.parse(localStorage.getItem('qb_sales_cache_v1') || 'null');
        if (cached?.sales?.length) {
          this.salesHistory = cached.sales;
          this.customerHistory = cached.customers || this.buildCustomerHistoryLocal(cached.sales);
          this.renderSalesTable();
          this.renderCustomerHistory();
        }
      } catch (e) {}
    }
  }

  buildCustomerHistoryLocal(sales) {
    const map = new Map();
    for (const sale of sales || []) {
      const phone = String(sale.customer?.phone || '').replace(/\D/g, '');
      const name = sale.customer?.name || 'Walk-in Customer';
      const key = phone || `name:${name.toLowerCase()}`;
      if (!map.has(key)) {
        map.set(key, { key, name, phone, visitCount: 0, totalSpent: 0, lastVisit: null, bills: [] });
      }
      const row = map.get(key);
      if (name && name !== 'Walk-in Customer') row.name = name;
      if (phone) row.phone = phone;
      row.visitCount += 1;
      row.totalSpent += Number(sale.grandTotal || 0);
      row.lastVisit = sale.createdAt;
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
      .map((c) => ({ ...c, totalSpent: Math.round(c.totalSpent * 100) / 100 }))
      .sort((a, b) => new Date(b.lastVisit || 0) - new Date(a.lastVisit || 0));
  }

  setSalesView(view) {
    this.salesView = view === 'customers' ? 'customers' : 'bills';
    const bills = document.getElementById('sales-bills-panel');
    const customers = document.getElementById('sales-customers-panel');
    const btnBills = document.getElementById('sales-view-bills');
    const btnCustomers = document.getElementById('sales-view-customers');
    if (bills) bills.style.display = this.salesView === 'bills' ? 'block' : 'none';
    if (customers) customers.style.display = this.salesView === 'customers' ? 'block' : 'none';
    btnBills?.classList.toggle('active', this.salesView === 'bills');
    btnCustomers?.classList.toggle('active', this.salesView === 'customers');
    this.persistSession();
  }

  renderSalesTable() {
    const tbody = document.getElementById('sales-table-body');
    if (!tbody) return;

    if (!this.salesHistory.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No sales yet. Complete a checkout to store customer bills.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.salesHistory.map((s) => {
      const name = s.customer?.name || 'Walk-in Customer';
      const phone = s.customer?.phone ? `+91 ${this.normalizePhone(s.customer.phone)}` : '—';
      const amount = Number(s.grandTotal || 0).toFixed(2);
      const itemsPreview = (s.items || []).slice(0, 2).map((i) => i.name).join(', ');
      const more = (s.items || []).length > 2 ? ` +${(s.items || []).length - 2} more` : '';
      return `
      <tr>
        <td>
          <strong>${name}</strong>
          <div style="font-size:0.78rem;color:var(--text-muted);">${phone}</div>
        </td>
        <td><strong>${s.invoiceNo}</strong></td>
        <td>${new Date(s.createdAt || Date.now()).toLocaleString()}</td>
        <td class="price-positive"><strong>₹${amount}</strong></td>
        <td><span class="pay-badge">${s.paymentMethod || 'cash'}</span></td>
        <td>
          <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:0.35rem;">${itemsPreview}${more}</div>
          <button type="button" class="btn btn-primary btn-sm" onclick="window.POS_APP.openSaleDetail('${s._id}')">View Details</button>
        </td>
      </tr>`;
    }).join('');
  }

  renderCustomerHistory() {
    const box = document.getElementById('customer-history-list');
    if (!box) return;
    const list = this.customerHistory || [];
    if (!list.length) {
      box.innerHTML = `<div class="empty-state">No customer history yet.</div>`;
      return;
    }

    box.innerHTML = list.map((c) => `
      <div class="customer-history-card">
        <h4>${c.name || 'Customer'}</h4>
        <div class="customer-history-meta">
          <span>${c.phone ? `+91 ${c.phone}` : 'No phone'}</span>
          <span>${c.visitCount} bill${c.visitCount === 1 ? '' : 's'}</span>
          <span>Total spent <strong>₹${Number(c.totalSpent || 0).toFixed(2)}</strong></span>
          <span>Last visit ${c.lastVisit ? new Date(c.lastVisit).toLocaleString() : '—'}</span>
        </div>
        ${(c.bills || []).slice(0, 5).map((b) => `
          <div class="customer-bill-row">
            <span><strong>${b.invoiceNo}</strong> · ${new Date(b.createdAt || Date.now()).toLocaleDateString()} · ${(b.items || []).length} items</span>
            <span>
              <strong>₹${Number(b.grandTotal || 0).toFixed(2)}</strong>
              <button type="button" class="btn btn-ghost btn-sm" onclick="window.POS_APP.openSaleDetail('${b.id}')">Details</button>
            </span>
          </div>
        `).join('')}
      </div>
    `).join('');
  }

  openSaleDetail(id) {
    const sale = this.salesHistory.find((s) => s._id === id || s.id === id)
      || this.customerHistory.flatMap((c) => c.bills || []).find((b) => b.id === id);
    if (!sale) return;

    // Normalize bill-shaped objects from customer history
    const full = this.salesHistory.find((s) => s._id === id || s.id === id) || {
      ...sale,
      _id: sale.id || sale._id,
      customer: sale.customer || { name: 'Customer', phone: '' },
      grandTotal: sale.grandTotal,
      items: sale.items || []
    };

    this.activeSale = full;
    const panel = document.getElementById('sale-detail-panel');
    const body = document.getElementById('sale-detail-body');
    const layout = document.querySelector('.sales-layout');
    if (!panel || !body) {
      this.showReceiptModal(full);
      return;
    }

    const name = full.customer?.name || 'Walk-in Customer';
    const phone = full.customer?.phone ? `+91 ${this.normalizePhone(full.customer.phone)}` : '—';
    body.innerHTML = `
      <div class="detail-line"><span>Customer</span><strong>${name}</strong></div>
      <div class="detail-line"><span>Mobile</span><strong>${phone}</strong></div>
      <div class="detail-line"><span>Invoice</span><strong>${full.invoiceNo || '—'}</strong></div>
      <div class="detail-line"><span>Date</span><span>${new Date(full.createdAt || Date.now()).toLocaleString()}</span></div>
      <div class="detail-line"><span>Payment</span><span>${String(full.paymentMethod || 'cash').toUpperCase()}</span></div>
      <div class="detail-items">
        ${(full.items || []).map((item) => `
          <div class="detail-line">
            <span>${item.name} × ${item.quantity}</span>
            <span>₹${Number(item.total != null ? item.total : ((Number(item.price) || 0) * (Number(item.quantity) || 0))).toFixed(2)}</span>
          </div>
        `).join('') || '<div class="empty-state">No item details</div>'}
      </div>
      <div class="detail-line"><span>Subtotal</span><span>₹${Number(full.subtotal || full.grandTotal || 0).toFixed(2)}</span></div>
      <div class="detail-line"><span>Discount</span><span>₹${Number(full.discount || 0).toFixed(2)}</span></div>
      <div class="detail-total detail-line"><span>Bill Amount</span><span>₹${Number(full.grandTotal || 0).toFixed(2)}</span></div>
      <div class="modal-actions" style="margin-top:1rem;">
        <button type="button" class="btn btn-primary btn-sm" onclick="window.POS_APP.viewSaleReceipt('${full._id || full.id}')">Full Receipt</button>
      </div>
    `;
    panel.style.display = 'block';
    layout?.classList.add('has-detail');
    this.switchTab('sales', { skipHistory: true });
    document.querySelectorAll('.nav-btn').forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-tab') === 'sales');
    });
    this.updateBackButton();
  }

  closeSaleDetail() {
    const panel = document.getElementById('sale-detail-panel');
    const layout = document.querySelector('.sales-layout');
    if (panel) panel.style.display = 'none';
    layout?.classList.remove('has-detail');
    this.updateBackButton();
  }

  async viewSaleReceipt(id) {
    let sale = this.salesHistory.find((s) => s._id === id || s.id === id);
    if (!sale) {
      try {
        const res = await API.getSaleById(id);
        sale = res.sale;
      } catch (e) {}
    }
    if (sale) {
      this.activeSale = sale;
      this.showReceiptModal(sale);
    }
  }

  // --- ANALYTICS DASHBOARD & GEMINI AI ---
  async loadDashboardStats() {
    try {
      const data = await API.getDashboardStats();
      if (data.stats) {
        const { totalRevenue, totalTransactions, lowStockCount, totalProductsCount, chartLabels, chartData } = data.stats;
        document.getElementById('stat-total-revenue').innerText = `₹${totalRevenue.toFixed(2)}`;
        document.getElementById('stat-total-sales').innerText = totalTransactions;
        document.getElementById('stat-low-stock').innerText = lowStockCount;
        document.getElementById('stat-total-products').innerText = totalProductsCount;

        this.renderRevenueChart(chartLabels, chartData);
      }
    } catch (err) {
      console.warn('[Stats Warning]:', err.message);
    }
  }

  renderRevenueChart(labels, dataValues) {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    if (this.revenueChart) this.revenueChart.destroy();

    this.revenueChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Daily Revenue (₹)',
          data: dataValues || [1400, 2200, 1800, 3100, 2900, 4200, 3800],
          borderColor: '#0F766E',
          backgroundColor: 'rgba(15, 118, 110, 0.15)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(15, 31, 28, 0.06)' }, ticks: { color: '#5B716C' } },
          y: { grid: { color: 'rgba(15, 31, 28, 0.06)' }, ticks: { color: '#5B716C' } }
        }
      }
    });
  }

  async fetchAiInsights() {
    const box = document.getElementById('ai-insights-box');
    if (box) box.innerText = '🤖 Requesting Google Gemini AI store analysis...';
    try {
      const res = await API.getAiInsights();
      if (box && res.insights) {
        box.innerHTML = res.insights.replace(/\n/g, '<br>');
      }
    } catch (err) {
      if (box) box.innerText = 'Unable to fetch AI insights at this time.';
    }
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        // Clear legacy caches to ensure latest code & translations are active
        if ('caches' in window) {
          caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
        }
        navigator.serviceWorker.register('/sw.js?v=2').catch(() => { });
      });
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.POS_APP = new POSApp();
});
