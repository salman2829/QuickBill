const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo';

let supabase = null;

try {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('[Supabase] Client initialized successfully.');
  
  if (supabaseUrl && !supabaseUrl.includes('your-project')) {
    supabase.from('users').select('id').limit(1).then(({ error }) => {
      if (error) {
        console.warn('[Supabase DB Warning]: Database connection check returned error. Verify schema setup:', error.message);
      } else {
        console.log('[Supabase DB]: Database connection established and verified successfully.');
      }
    }).catch(err => {
      console.warn('[Supabase DB Warning]: Connection check threw exception:', err.message);
    });
  }
} catch (error) {
  console.warn('[Supabase Warning] Failed to initialize client:', error.message);
}

module.exports = supabase;
