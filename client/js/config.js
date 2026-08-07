// Auto: localhost → local API | production → Render backend
window.QB_CONFIG = {
  API_BASE_URL: (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? '/api'
    : 'https://quickbill-pos-backend.onrender.com/api'
};
