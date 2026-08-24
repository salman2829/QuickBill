// Centralized Fetch API Client for QuickBill POS Backend
// Uses Render URL in production (set in config.js); falls back to same-origin /api for local
const API_BASE_URL = (window.QB_CONFIG && window.QB_CONFIG.API_BASE_URL) || '/api';

const API = {
  getToken: () => localStorage.getItem('qb_jwt_token'),

  setToken: (token) => localStorage.setItem('qb_jwt_token', token),

  removeToken: () => localStorage.removeItem('qb_jwt_token'),

  headers: () => {
    const headers = { 'Content-Type': 'application/json' };
    const token = API.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  },

  async request(endpoint, method = 'GET', data = null) {
    const config = {
      method,
      headers: API.headers()
    };
    if (data) config.body = JSON.stringify(data);

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const contentType = res.headers.get('content-type') || '';
      
      let json;
      if (contentType.includes('application/json')) {
        json = await res.json();
      } else {
        const text = await res.text();
        console.error(`[API Non-JSON Response ${res.status}]:`, text);
        throw new Error(res.ok ? 'Unexpected response format' : `Server returned status ${res.status}. Check Vercel function logs.`);
      }

      if (!res.ok) {
        throw new Error(json.message || `API Error (${res.status})`);
      }
      return json;
    } catch (err) {
      console.warn(`[API Call ${method} ${endpoint} Warning]:`, err.message);
      throw err;
    }
  },

  // Auth endpoints
  login: (email, password) => API.request('/auth/login', 'POST', { email, password }),
  register: (userData) => API.request('/auth/register', 'POST', userData),
  checkEmail: (email) => API.request('/auth/check-email', 'POST', { email }),
  getMe: () => API.request('/auth/me'),
  sendOtp: (email, mode) => API.request('/auth/send-otp', 'POST', { email, mode }),
  verifyOtp: (payload) => API.request('/auth/verify-otp', 'POST', payload),
  resendOtp: (email, type) => API.request('/auth/resend-otp', 'POST', { email, type }),

  // Product endpoints
  getProducts: (search = '', category = 'All') => 
    API.request(`/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`),
  getProductByBarcode: (barcode) => API.request(`/products/barcode/${barcode}`),
  lookupPublicBarcode: (barcode) => API.request(`/products/public-barcode/${barcode}`),
  createProduct: (productData) => API.request('/products', 'POST', productData),
  updateProduct: (id, productData) => API.request(`/products/${id}`, 'PUT', productData),
  deleteProduct: (id) => API.request(`/products/${id}`, 'DELETE'),
  getLowStock: (threshold = 10) => API.request(`/products/low-stock?threshold=${threshold}`),
  compareWholesale: (payload) => API.request('/products/wholesale-compare', 'POST', payload || {}),
  placeWholesaleOrder: (payload) => API.request('/products/wholesale-order', 'POST', payload),

  // Sales endpoints
  createSale: (saleData) => API.request('/sales', 'POST', saleData),
  getSales: (limit = 200) => API.request(`/sales?limit=${encodeURIComponent(limit)}`),
  getCustomerHistory: () => API.request('/sales/customers'),
  getSaleById: (id) => API.request(`/sales/${encodeURIComponent(id)}`),
  getDashboardStats: () => API.request('/sales/dashboard-stats'),
  sendCustomerBill: (payload) => API.request('/sales/send-bill', 'POST', payload),

  // AI & Voice endpoints
  sendVoiceCommand: (transcript) => API.request('/ai/voice', 'POST', { transcript }),
  getAiInsights: () => API.request('/ai/insights', 'POST')
};

window.API = API;
