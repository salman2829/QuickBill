const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo';

let supabase = null;

try {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('[Supabase] Client initialized successfully.');
} catch (error) {
  console.warn('[Supabase Warning] Failed to initialize client:', error.message);
}

module.exports = supabase;
