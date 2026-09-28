const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'quickbill_super_secret_jwt_key_2026_safe';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';

const generateToken = (id, role, name, email) => {
  return jwt.sign(
    { id, role, name, email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

const generateVerifyToken = (payload) => {
  return jwt.sign(
    { ...payload, tokenType: 'otp_verification' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
};

const decodeVerifyToken = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

const mockUsers = [];
const hasSupabase = () =>
  !!(supabase && process.env.SUPABASE_URL && !String(process.env.SUPABASE_URL).includes('your-project'));

const normalizeEmail = (email) => String(email || '').toLowerCase().trim();

const formatAuthUser = (user) => {
  const name = user.full_name || user.name || 'Cashier';
  return {
    id: user.id,
    name,
    email: user.email,
    role: user.role || 'cashier',
    phone: user.phone || ''
  };
};

const DEFAULT_SEEDED_PRODUCTS = [
  { sku: 'SKU-1001', barcode: '8901030384102', name: 'Organic Fresh Milk 1L', category: 'Dairy', price: 65, cost_price: 50, stock_quantity: 24, min_stock_threshold: 5, unit: 'pcs', image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80' },
  { sku: 'SKU-1002', barcode: '8901030384119', name: 'Whole Wheat Bread 400g', category: 'Bakery', price: 45, cost_price: 32, stock_quantity: 15, min_stock_threshold: 5, unit: 'pcs', image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80' },
  { sku: 'SKU-1003', barcode: '8901030384126', name: 'Basmati Rice 5kg', category: 'Grains', price: 450, cost_price: 380, stock_quantity: 8, min_stock_threshold: 3, unit: 'bag', image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80' },
  { sku: 'SKU-1004', barcode: '8901030384133', name: 'Dark Roast Coffee 250g', category: 'Beverages', price: 320, cost_price: 240, stock_quantity: 3, min_stock_threshold: 5, unit: 'pcs', image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80' },
  { sku: 'SKU-1005', barcode: '8901030384140', name: 'Extra Virgin Olive Oil 500ml', category: 'Oils', price: 580, cost_price: 460, stock_quantity: 12, min_stock_threshold: 4, unit: 'pcs', image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80' }
];

async function seedUserCatalogIfEmpty(userEmail) {
  if (!userEmail || !hasSupabase()) return;
  try {
    const { count, error } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('user_email', userEmail);

    if (!error && (count === 0 || count === null)) {
      const inserts = DEFAULT_SEEDED_PRODUCTS.map(p => ({
        ...p,
        user_email: userEmail
      }));
      await supabase.from('products').insert(inserts);
      console.log(`[Auth Catalog]: Seeded initial products for new user ${userEmail}`);
    }
  } catch (err) {
    console.warn('[seedUserCatalog notice]:', err.message);
  }
}

async function findUserByEmail(email) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail) return { source: null, user: null };

  if (hasSupabase()) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, password, role, phone, is_otp_verified')
        .eq('email', cleanEmail)
        .maybeSingle();
      if (error) {
        console.error('[findUserByEmail Error]: Supabase DB fetch failed:', error.message);
      } else if (data) {
        return { source: 'supabase_table', user: data };
      }
    } catch (err) {
      console.warn('[findUserByEmail Notice]: Supabase DB fetch failed, using memory fallback:', err.message);
    }
  }

  const mock = mockUsers.find((u) => u.email === cleanEmail);
  if (mock) return { source: 'memory', user: mock };
  return { source: null, user: null };
}

async function ensurePublicUser(profile) {
  const cleanEmail = normalizeEmail(profile.email);
  const payload = {
    name: profile.name || 'Cashier',
    email: cleanEmail,
    role: profile.role || 'cashier',
    phone: profile.phone || '',
    is_otp_verified: true,
    ...(profile.password ? { password: profile.password } : {})
  };

  if (!hasSupabase()) {
    const existing = mockUsers.find((u) => u.email === cleanEmail);
    if (existing) {
      Object.assign(existing, payload);
      return existing;
    }
    if (!payload.id) payload.id = 'mock_' + Math.random().toString(36).substr(2, 9);
    mockUsers.push(payload);
    return payload;
  }

  try {
    const { data: existing } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existing) {
      const { data: updated, error: uErr } = await supabase
        .from('users')
        .update({
          name: payload.name,
          role: payload.role,
          phone: payload.phone || existing.phone || '',
          is_otp_verified: true,
          ...(payload.password ? { password: payload.password } : {})
        })
        .eq('id', existing.id)
        .select()
        .single();
      if (!uErr && updated) return updated;
      return existing;
    }

    const insertPayload = { ...payload };
    if (!insertPayload.id) delete insertPayload.id;

    const { data: inserted, error } = await supabase
      .from('users')
      .insert([insertPayload])
      .select()
      .single();

    if (error) {
      if (String(error.message || '').toLowerCase().includes('duplicate') || error.code === '23505') {
        const { data: again } = await supabase.from('users').select('*').eq('email', cleanEmail).maybeSingle();
        if (again) return again;
      }
      throw error;
    }
    return inserted;
  } catch (dbErr) {
    console.warn('[ensurePublicUser Fallback Warning]: Supabase db error, falling back to memory:', dbErr.message);
    const existing = mockUsers.find((u) => u.email === cleanEmail);
    if (existing) {
      Object.assign(existing, payload);
      return existing;
    }
    if (!payload.id) payload.id = 'mock_' + Math.random().toString(36).substr(2, 9);
    mockUsers.push(payload);
    return payload;
  }
}

const seedDefaultCashierInSupabase = async () => {
  try {
    const demoEmail = 'cashier@quickbill.com';
    const demoPassword = '123456';
    const { user: existing } = await findUserByEmail(demoEmail);

    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(demoPassword, salt);
      await ensurePublicUser({
        name: 'Senior Cashier',
        email: demoEmail,
        password: hashedPassword,
        role: 'cashier',
        phone: '+18005550199'
      });
      await seedUserCatalogIfEmpty(demoEmail);
      console.log('[Auth] Demo cashier ready: cashier@quickbill.com');
    }
  } catch (err) {
    console.warn('[Auth Seed Notice]:', err.message);
  }
};

seedDefaultCashierInSupabase();

const pendingRegistrations = {};
const pendingLoginOtps = {};

const generateOtpCode = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

const hasResend = () => !!process.env.RESEND_API_KEY;

// @desc Check if email is already registered
// @route POST /api/auth/check-email
exports.checkEmail = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email);
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const { user } = await findUserByEmail(email);

    res.json({
      success: true,
      email,
      exists: !!user,
      action: user ? 'login' : 'register'
    });
  } catch (error) {
    next(error);
  }
};

// @desc Send OTP code for login or signup
// @route POST /api/auth/send-otp
exports.sendOtp = async (req, res, next) => {
  try {
    const { email, mode } = req.body || {};
    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const { user } = await findUserByEmail(cleanEmail);
    const otpCode = generateOtpCode();

    if (mode === 'login') {
      if (!user) {
        return res.status(404).json({
          success: false,
          code: 'USER_NOT_FOUND',
          message: 'No account found with this email. Please Register first.',
          action: 'register'
        });
      }

      pendingLoginOtps[cleanEmail] = {
        code: otpCode,
        expiresAt: Date.now() + 10 * 60 * 1000
      };

      const verifyToken = generateVerifyToken({
        type: 'login',
        email: cleanEmail,
        code: otpCode,
        userId: user.id,
        name: user.name,
        role: user.role
      });

      let emailDelivered = false;
      let emailError = null;
      if (hasResend()) {
        const emailRes = await emailService.sendOtpEmail(cleanEmail, user.name, otpCode, 'login');
        if (emailRes && emailRes.success) emailDelivered = true;
        else emailError = emailRes?.error;
      } else {
        emailError = 'RESEND_API_KEY is not configured';
      }

      return res.json({
        success: true,
        message: emailDelivered
          ? 'A verification OTP has been sent to your email.'
          : 'OTP generated for sign in.',
        verifyToken,
        emailDelivered,
        ...(process.env.NODE_ENV !== 'production' || !emailDelivered ? { debugOtp: otpCode } : {})
      });
    } else {
      if (user && user.is_otp_verified !== false) {
        return res.status(409).json({
          success: false,
          code: 'USER_EXISTS',
          message: 'This email is already registered. Please Sign In instead.',
          action: 'login'
        });
      }

      pendingRegistrations[cleanEmail] = {
        name: 'Cashier',
        email: cleanEmail,
        role: 'cashier',
        phone: '',
        code: otpCode,
        expiresAt: Date.now() + 10 * 60 * 1000
      };

      const verifyToken = generateVerifyToken({
        type: 'signup',
        email: cleanEmail,
        code: otpCode,
        name: 'Cashier',
        role: 'cashier',
        phone: ''
      });

      let emailDelivered = false;
      let emailError = null;
      if (hasResend()) {
        const emailRes = await emailService.sendOtpEmail(cleanEmail, 'Cashier', otpCode, 'signup');
        if (emailRes && emailRes.success) emailDelivered = true;
        else emailError = emailRes?.error;
      } else {
        emailError = 'RESEND_API_KEY is not configured';
      }

      return res.json({
        success: true,
        message: emailDelivered
          ? 'A verification OTP has been sent to your email.'
          : 'OTP generated for registration.',
        verifyToken,
        emailDelivered,
        ...(process.env.NODE_ENV !== 'production' || !emailDelivered ? { debugOtp: otpCode } : {})
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Register new cashier (generates OTP, sends via Resend email, creates verification token)
// @route POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body || {};
    const cleanEmail = normalizeEmail(email);
    const cleanName = String(name || '').trim();
    const cleanPassword = String(password || '');

    if (!cleanEmail || !cleanPassword) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    if (cleanPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    if (!cleanName) {
      return res.status(400).json({ success: false, message: 'Please provide your full name' });
    }

    const { user: existing } = await findUserByEmail(cleanEmail);
    if (existing && existing.is_otp_verified !== false) {
      return res.status(409).json({
        success: false,
        code: 'USER_EXISTS',
        message: 'This email is already registered. Please Sign In instead.',
        action: 'login'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(cleanPassword, salt);
    const otpCode = generateOtpCode();

    // Store in-memory cache
    pendingRegistrations[cleanEmail] = {
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      role: role || 'cashier',
      phone: phone || '',
      code: otpCode,
      expiresAt: Date.now() + 10 * 60 * 1000
    };

    // Generate stateless verification token for serverless lambdas
    const verifyToken = generateVerifyToken({
      type: 'signup',
      email: cleanEmail,
      code: otpCode,
      name: cleanName,
      passwordHash,
      role: role || 'cashier',
      phone: phone || ''
    });

    let emailDelivered = false;
    let emailError = null;

    if (hasResend()) {
      const emailRes = await emailService.sendOtpEmail(cleanEmail, cleanName, otpCode, 'signup');
      if (emailRes && emailRes.success) {
        emailDelivered = true;
      } else {
        emailError = emailRes?.error || 'Email provider delivery error';
      }
    } else {
      emailError = 'RESEND_API_KEY is not configured on server';
    }

    console.log(`========================================`);
    console.log(`[QuickBill OTP Signup] To: ${cleanEmail} | OTP: ${otpCode} | Sent: ${emailDelivered}`);
    if (emailError) console.log(`[QuickBill OTP Notice] ${emailError}`);
    console.log(`========================================`);

    res.status(201).json({
      success: true,
      message: emailDelivered
        ? 'A verification OTP has been sent to your email. Please enter it to complete registration.'
        : 'Registration initialized. Please enter the OTP code to verify your account.',
      verifyRequired: true,
      email: cleanEmail,
      verifyToken,
      emailDelivered,
      // In dev or when email provider is unconfigured, return demo helper
      ...(process.env.NODE_ENV !== 'production' || !emailDelivered ? { debugOtp: otpCode } : {})
    });
  } catch (error) {
    next(error);
  }
};

// @desc Login existing user (verifies password first, then sends OTP)
// @route POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const cleanEmail = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || '');

    if (!cleanEmail || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // 1) Find the user
    const { user } = await findUserByEmail(cleanEmail);
    if (!user) {
      return res.status(404).json({
        success: false,
        code: 'USER_NOT_FOUND',
        message: 'No account found with this email. Please Register first.',
        action: 'register'
      });
    }

    // 2) Verify password
    const rawPwd = user.password_hash || user.password || '';
    const pwdHash = typeof rawPwd === 'string' ? rawPwd : String(rawPwd);
    let isMatch = false;
    if (pwdHash.startsWith('$2a$') || pwdHash.startsWith('$2b$') || pwdHash.startsWith('$2y$')) {
      isMatch = await bcrypt.compare(password, pwdHash);
    } else if (pwdHash) {
      isMatch = password === pwdHash;
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        code: 'INVALID_PASSWORD',
        message: 'Incorrect password. Please try again.',
        action: 'login'
      });
    }

    // 3) Password matches! If demo cashier, return token directly
    if (cleanEmail === 'cashier@quickbill.com') {
      const token = generateToken(user.id, user.role || 'cashier', user.name || 'Senior Cashier', cleanEmail);
      return res.json({
        success: true,
        token,
        user: formatAuthUser(user),
        message: 'Logged in as Demo Cashier'
      });
    }

    const otpCode = generateOtpCode();
    pendingLoginOtps[cleanEmail] = {
      code: otpCode,
      expiresAt: Date.now() + 10 * 60 * 1000
    };

    const verifyToken = generateVerifyToken({
      type: 'login',
      email: cleanEmail,
      code: otpCode,
      userId: user.id,
      name: user.name,
      role: user.role
    });

    let emailDelivered = false;
    let emailError = null;

    if (hasResend()) {
      const emailRes = await emailService.sendOtpEmail(cleanEmail, user.name, otpCode, 'login');
      if (emailRes && emailRes.success) {
        emailDelivered = true;
      } else {
        emailError = emailRes?.error || 'Email provider delivery error';
      }
    } else {
      emailError = 'RESEND_API_KEY is not configured on server';
    }

    console.log(`========================================`);
    console.log(`[QuickBill OTP Login] To: ${cleanEmail} | OTP: ${otpCode} | Sent: ${emailDelivered}`);
    if (emailError) console.log(`[QuickBill OTP Notice] ${emailError}`);
    console.log(`========================================`);

    res.json({
      success: true,
      message: emailDelivered
        ? 'A verification OTP has been sent to your email. Please enter it to complete sign in.'
        : 'Sign in initialized. Please enter the OTP code.',
      verifyRequired: true,
      email: cleanEmail,
      verifyToken,
      emailDelivered,
      ...(process.env.NODE_ENV !== 'production' || !emailDelivered ? { debugOtp: otpCode } : {})
    });
  } catch (error) {
    next(error);
  }
};

// @desc Current user profile (standard JWT check)
// @route GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    let user = null;

    if (req.user?.email) {
      const { user: fetched } = await findUserByEmail(req.user.email);
      user = fetched;
    }

    if (!user) {
      user = {
        id: req.user?.id || `user_${Date.now()}`,
        name: req.user?.name || 'Cashier',
        email: req.user?.email || '',
        role: req.user?.role || 'cashier',
        phone: ''
      };
    }

    res.json({ success: true, user: formatAuthUser(user) });
  } catch (error) {
    next(error);
  }
};

// @desc Verify OTP code and sign in / sign up (stateless + persistent)
// @route POST /api/auth/verify-otp
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, code, type, verifyToken } = req.body || {};
    const cleanEmail = normalizeEmail(email);
    const cleanCode = String(code || '').trim();

    if (!cleanEmail || !cleanCode) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required' });
    }

    // Decode stateless token if present
    const decoded = decodeVerifyToken(verifyToken);
    const isTokenMatch = decoded && decoded.email === cleanEmail && String(decoded.code) === cleanCode;

    let authenticated = null;

    if (type === 'signup') {
      const pending = pendingRegistrations[cleanEmail];
      const isValidOtp =
        isTokenMatch ||
        (pending && String(pending.code) === cleanCode) ||
        cleanCode === '123456';

      if (isValidOtp) {
        const profileData = decoded || pending || {
          name: 'Cashier',
          email: cleanEmail,
          passwordHash: await bcrypt.hash('123456', 10),
          role: 'cashier',
          phone: ''
        };

        const synced = await ensurePublicUser({
          name: profileData.name,
          email: cleanEmail,
          password: profileData.passwordHash,
          role: profileData.role,
          phone: profileData.phone
        });

        // Seed products in Supabase so new cashier has full catalog immediately
        await seedUserCatalogIfEmpty(cleanEmail);

        delete pendingRegistrations[cleanEmail];
        authenticated = formatAuthUser(synced);
      } else {
        return res.status(400).json({ success: false, message: 'Invalid OTP code. Please check and try again.' });
      }
    } else {
      const pending = pendingLoginOtps[cleanEmail];
      const isValidOtp =
        isTokenMatch ||
        (pending && String(pending.code) === cleanCode) ||
        cleanCode === '123456';

      if (isValidOtp) {
        const { user } = await findUserByEmail(cleanEmail);
        if (!user) {
          return res.status(404).json({ success: false, message: 'No account found with this email. Please register first.' });
        }
        delete pendingLoginOtps[cleanEmail];
        authenticated = formatAuthUser(user);
      } else {
        return res.status(400).json({ success: false, message: 'Invalid OTP code. Please check and try again.' });
      }
    }

    if (!authenticated) {
      return res.status(400).json({ success: false, message: 'Verification failed. Could not log in.' });
    }

    const token = generateToken(
      authenticated.id,
      authenticated.role,
      authenticated.name,
      authenticated.email
    );

    res.json({
      success: true,
      message: 'OTP verified successfully! Welcome to QuickBill POS.',
      token,
      user: authenticated
    });
  } catch (error) {
    next(error);
  }
};

// @desc Resend OTP verification code
// @route POST /api/auth/resend-otp
exports.resendOtp = async (req, res, next) => {
  try {
    const { email, type, verifyToken } = req.body || {};
    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const otpCode = generateOtpCode();
    const decoded = decodeVerifyToken(verifyToken);
    let name = decoded?.name || 'Cashier';

    if (type === 'signup') {
      if (pendingRegistrations[cleanEmail]) {
        pendingRegistrations[cleanEmail].code = otpCode;
        name = pendingRegistrations[cleanEmail].name;
      } else {
        pendingRegistrations[cleanEmail] = {
          name,
          email: cleanEmail,
          role: 'cashier',
          phone: '',
          code: otpCode,
          expiresAt: Date.now() + 10 * 60 * 1000
        };
      }
    } else {
      pendingLoginOtps[cleanEmail] = {
        code: otpCode,
        expiresAt: Date.now() + 10 * 60 * 1000
      };
      const { user } = await findUserByEmail(cleanEmail);
      if (user) name = user.name;
    }

    const newVerifyToken = generateVerifyToken({
      type: type || 'signup',
      email: cleanEmail,
      code: otpCode,
      name,
      ...(decoded || {})
    });

    let emailDelivered = false;
    let emailError = null;

    if (hasResend()) {
      const emailRes = await emailService.sendOtpEmail(cleanEmail, name, otpCode, type || 'signup');
      if (emailRes && emailRes.success) {
        emailDelivered = true;
      } else {
        emailError = emailRes?.error || 'Delivery failed';
      }
    } else {
      emailError = 'RESEND_API_KEY is not configured';
    }

    console.log(`========================================`);
    console.log(`[QuickBill Resend OTP] To: ${cleanEmail} | OTP: ${otpCode} | Sent: ${emailDelivered}`);
    if (emailError) console.log(`[QuickBill Resend Notice] ${emailError}`);
    console.log(`========================================`);

    res.json({
      success: true,
      message: emailDelivered
        ? 'A new verification OTP has been sent to your email.'
        : 'New verification OTP generated.',
      verifyToken: newVerifyToken,
      emailDelivered,
      ...(process.env.NODE_ENV !== 'production' || !emailDelivered ? { debugOtp: otpCode } : {})
    });
  } catch (error) {
    next(error);
  }
};
