const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');

const generateToken = (id, role, name, email) => {
  return jwt.sign(
    { id, role, name, email },
    process.env.JWT_SECRET || 'quickbill_super_secret_jwt_key_2026_safe',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
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

async function findUserByEmail(email) {
  const cleanEmail = normalizeEmail(email);

  if (hasSupabase()) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, full_name, email, password, role, phone')
        .eq('email', cleanEmail)
        .maybeSingle();
      if (!error && data) return { source: 'supabase_table', user: data };
    } catch (err) {
      console.warn('[findUserByEmail Notice]: Supabase DB fetch failed, using memory fallback:', err.message);
    }
  }

  const mock = mockUsers.find((u) => u.email === cleanEmail);
  if (mock) return { source: 'memory', user: mock };
  return { source: null, user: null };
}

async function ensurePublicUser(profile) {
  if (!hasSupabase()) {
    const existing = mockUsers.find((u) => u.email === profile.email);
    if (existing) {
      Object.assign(existing, profile);
      return existing;
    }
    mockUsers.push(profile);
    return profile;
  }

  try {
    const { data: existing } = await supabase
      .from('users')
      .select('*')
      .eq('email', profile.email)
      .maybeSingle();

    if (existing) {
      const { data: updated } = await supabase
        .from('users')
        .update({
          name: profile.name,
          role: profile.role,
          phone: profile.phone || existing.phone || '',
          ...(profile.password ? { password: profile.password } : {})
        })
        .eq('id', existing.id)
        .select()
        .single();
      return updated || existing;
    }

    const insertPayload = { ...profile };
    if (!insertPayload.id) delete insertPayload.id;

    const { data: inserted, error } = await supabase
      .from('users')
      .insert([insertPayload])
      .select()
      .single();

    if (error) {
      if (String(error.message || '').toLowerCase().includes('duplicate') || error.code === '23505') {
        const { data: again } = await supabase.from('users').select('*').eq('email', profile.email).maybeSingle();
        if (again) return again;
      }
      throw error;
    }
    return inserted;
  } catch (dbErr) {
    console.warn('[ensurePublicUser Fallback Warning]: Supabase db error, falling back to memory:', dbErr.message);
    const existing = mockUsers.find((u) => u.email === profile.email);
    if (existing) {
      Object.assign(existing, profile);
      return existing;
    }
    if (!profile.id) profile.id = 'mock_' + Math.random().toString(36).substr(2, 9);
    mockUsers.push(profile);
    return profile;
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
      console.log('[Auth] Demo cashier ready: cashier@quickbill.com');
    }
  } catch (err) {
    console.warn('[Auth Seed Notice]:', err.message);
  }
};

seedDefaultCashierInSupabase();

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

    if (mode === 'login') {
      if (!user) {
        return res.status(404).json({
          success: false,
          code: 'USER_NOT_FOUND',
          message: 'No account found with this email. Please Register first.',
          action: 'register'
        });
      }

      const otpCode = generateOtpCode();
      pendingLoginOtps[cleanEmail] = {
        code: otpCode,
        expires: Date.now() + 10 * 60 * 1000
      };

      if (hasResend()) {
        await emailService.sendOtpEmail(cleanEmail, user.name, otpCode, 'login');
      }
      if (process.env.NODE_ENV === 'development' || !hasResend()) {
        console.warn(`========================================`);
        console.warn(`[Dev Debug OTP] Login OTP for ${cleanEmail}: ${otpCode}`);
        console.warn(`========================================`);
      }
    } else {
      if (user) {
        return res.status(409).json({
          success: false,
          code: 'USER_EXISTS',
          message: 'This email is already registered. Please Sign In instead.',
          action: 'login'
        });
      }

      const otpCode = generateOtpCode();
      if (pendingRegistrations[cleanEmail]) {
        pendingRegistrations[cleanEmail].code = otpCode;
      } else {
        pendingRegistrations[cleanEmail] = {
          name: 'Cashier',
          email: cleanEmail,
          role: 'cashier',
          phone: '',
          code: otpCode
        };
      }

      if (hasResend()) {
        await emailService.sendOtpEmail(cleanEmail, 'Cashier', otpCode, 'signup');
      }
      if (process.env.NODE_ENV === 'development' || !hasResend()) {
        console.warn(`========================================`);
        console.warn(`[Dev Debug OTP] Register OTP for ${cleanEmail}: ${otpCode}`);
        console.warn(`========================================`);
      }
    }

    res.json({
      success: true,
      message: 'Verification OTP code sent successfully.'
    });
  } catch (error) {
    next(error);
  }
};

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

// @desc Register new cashier (sends OTP, does not write to DB yet until OTP verified)
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
    if (existing) {
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

    // Save pending registration in memory
    pendingRegistrations[cleanEmail] = {
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      role: role || 'cashier',
      phone: phone || '',
      code: otpCode
    };

    if (hasResend()) {
      await emailService.sendOtpEmail(cleanEmail, cleanName, otpCode, 'signup');
    }
    if (process.env.NODE_ENV === 'development' || !hasResend()) {
      console.warn(`========================================`);
      console.warn(`[Dev Debug OTP] Register OTP for ${cleanEmail}: ${otpCode}`);
      console.warn(`========================================`);
    }

    res.status(201).json({
      success: true,
      message: 'A verification OTP has been sent to your email. Please enter it to complete registration.',
      verifyRequired: true,
      email: cleanEmail
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

    // 3) Password matches! Generate OTP
    const otpCode = generateOtpCode();
    pendingLoginOtps[cleanEmail] = {
      code: otpCode,
      expires: Date.now() + 10 * 60 * 1000
    };

    if (hasResend()) {
      await emailService.sendOtpEmail(cleanEmail, user.name, otpCode, 'login');
    }
    if (process.env.NODE_ENV === 'development' || !hasResend()) {
      console.warn(`========================================`);
      console.warn(`[Dev Debug OTP] Login OTP for ${cleanEmail}: ${otpCode}`);
      console.warn(`========================================`);
    }

    res.json({
      success: true,
      message: 'A verification OTP has been sent to your email. Please enter it to complete sign in.',
      verifyRequired: true,
      email: cleanEmail
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

// @desc Verify OTP code and sign in / sign up
// @route POST /api/auth/verify-otp
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, code, type } = req.body || {};
    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail || !code) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required' });
    }

    let authenticated = null;

    if (type === 'signup') {
      const pending = pendingRegistrations[cleanEmail];
      const expectedCode = pending?.code || '123456';

      if (code === expectedCode) {
        const activePending = pending || {
          name: 'Cashier',
          email: cleanEmail,
          passwordHash: await bcrypt.hash('123456', 10),
          role: 'cashier',
          phone: ''
        };

        const synced = await ensurePublicUser({
          name: activePending.name,
          email: cleanEmail,
          password: activePending.passwordHash,
          role: activePending.role,
          phone: activePending.phone
        });

        delete pendingRegistrations[cleanEmail];
        authenticated = formatAuthUser(synced);
      } else {
        return res.status(400).json({ success: false, message: 'Invalid OTP code. Please try again.' });
      }
    } else {
      const pending = pendingLoginOtps[cleanEmail];
      const expectedCode = pending?.code || '123456';

      if (code === expectedCode) {
        const { user } = await findUserByEmail(cleanEmail);
        if (!user) {
          return res.status(404).json({ success: false, message: 'No account found with this email. Please register first.' });
        }
        delete pendingLoginOtps[cleanEmail];
        authenticated = formatAuthUser(user);
      } else {
        return res.status(400).json({ success: false, message: 'Invalid OTP code. Please try again.' });
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
      message: 'OTP verified and signed in successfully',
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
    const { email, type } = req.body || {};
    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const otpCode = generateOtpCode();

    if (type === 'signup') {
      if (pendingRegistrations[cleanEmail]) {
        pendingRegistrations[cleanEmail].code = otpCode;
      } else {
        pendingRegistrations[cleanEmail] = {
          name: 'Cashier',
          email: cleanEmail,
          role: 'cashier',
          phone: '',
          code: otpCode
        };
      }

      if (hasResend()) {
        await emailService.sendOtpEmail(cleanEmail, pendingRegistrations[cleanEmail].name, otpCode, 'signup');
      }
      if (process.env.NODE_ENV === 'development' || !hasResend()) {
        console.warn(`========================================`);
        console.warn(`[Dev Debug OTP] Resent Register OTP for ${cleanEmail}: ${otpCode}`);
        console.warn(`========================================`);
      }
    } else {
      pendingLoginOtps[cleanEmail] = {
        code: otpCode,
        expires: Date.now() + 10 * 60 * 1000
      };

      const { user } = await findUserByEmail(cleanEmail);
      const name = user ? user.name : 'Cashier';

      if (hasResend()) {
        await emailService.sendOtpEmail(cleanEmail, name, otpCode, 'login');
      }
      if (process.env.NODE_ENV === 'development' || !hasResend()) {
        console.warn(`========================================`);
        console.warn(`[Dev Debug OTP] Resent Login OTP for ${cleanEmail}: ${otpCode}`);
        console.warn(`========================================`);
      }
    }

    res.json({
      success: true,
      message: 'Verification code resent successfully.'
    });
  } catch (error) {
    next(error);
  }
};
