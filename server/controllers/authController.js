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

const publicUserPayload = (user, authId) => ({
  ...(authId ? { id: authId } : {}),
  name: user.name || user.full_name || 'Cashier',
  full_name: user.full_name || user.name || 'Cashier',
  email: normalizeEmail(user.email),
  password: user.passwordHash,
  password_hash: user.passwordHash,
  role: user.role || 'cashier',
  phone: user.phone || ''
});

const formatAuthUser = (user) => {
  const name = user.full_name || user.name || user.user_metadata?.full_name || user.user_metadata?.name || 'Cashier';
  return {
    id: user.id,
    name,
    email: user.email,
    role: user.role || user.user_metadata?.role || 'cashier',
    phone: user.phone || user.user_metadata?.phone || ''
  };
};

async function findUserByEmail(email) {
  const cleanEmail = normalizeEmail(email);

  if (hasSupabase()) {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, full_name, email, password, password_hash, role, phone')
      .eq('email', cleanEmail)
      .maybeSingle();
    if (!error && data) return { source: 'supabase_table', user: data };
  }

  const mock = mockUsers.find((u) => u.email === cleanEmail);
  if (mock) return { source: 'memory', user: mock };
  return { source: null, user: null };
}

async function ensurePublicUser(profile) {
  if (!hasSupabase()) {
    const existing = mockUsers.find((u) => u.email === profile.email);
    if (existing) return existing;
    mockUsers.push(profile);
    return profile;
  }

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
        full_name: profile.full_name,
        role: profile.role,
        phone: profile.phone || existing.phone || '',
        ...(profile.password_hash ? { password: profile.password_hash, password_hash: profile.password_hash } : {})
      })
      .eq('id', existing.id)
      .select()
      .single();
    return updated || existing;
  }

  const insertPayload = { ...profile };
  // Avoid sending undefined id
  if (!insertPayload.id) delete insertPayload.id;

  const { data: inserted, error } = await supabase
    .from('users')
    .insert([insertPayload])
    .select()
    .single();

  if (error) {
    // Race: email unique conflict
    if (String(error.message || '').toLowerCase().includes('duplicate') || error.code === '23505') {
      const { data: again } = await supabase.from('users').select('*').eq('email', profile.email).maybeSingle();
      if (again) return again;
    }
    throw error;
  }
  return inserted;
}

const seedDefaultCashierInSupabase = async () => {
  if (!hasSupabase()) return;
  try {
    const demoEmail = 'cashier@quickbill.com';
    const demoPassword = '123456';
    const { user: existing } = await findUserByEmail(demoEmail);

    if (!existing) {
      try {
        await supabase.auth.signUp({
          email: demoEmail,
          password: demoPassword,
          options: {
            data: { full_name: 'Senior Cashier', name: 'Senior Cashier', role: 'cashier', phone: '+18005550199' }
          }
        });
      } catch (e) {}

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(demoPassword, salt);
      await ensurePublicUser({
        name: 'Senior Cashier',
        full_name: 'Senior Cashier',
        email: demoEmail,
        password: hashedPassword,
        password_hash: hashedPassword,
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

// @desc Check if email is already registered
// @route POST /api/auth/check-email
exports.checkEmail = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email);
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const { user } = await findUserByEmail(email);
    let existsInAuth = false;

    if (!user && hasSupabase()) {
      // Lightweight probe via password sign-in is not ideal; rely on table uniqueness primarily.
      // If Auth has the user but table doesn't, register flow will sync later.
      existsInAuth = false;
    }

    res.json({
      success: true,
      email,
      exists: !!(user || existsInAuth),
      action: user ? 'login' : 'register'
    });
  } catch (error) {
    next(error);
  }
};

// @desc Register new cashier in Supabase Auth + public.users
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
    let authUser = null;
    let session = null;

    if (hasSupabase()) {
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: {
          data: {
            full_name: cleanName,
            name: cleanName,
            role: role || 'cashier',
            phone: phone || ''
          }
        }
      });

      if (authErr) {
        const msg = String(authErr.message || '').toLowerCase();
        if (msg.includes('already') || msg.includes('registered') || msg.includes('exists')) {
          return res.status(409).json({
            success: false,
            code: 'USER_EXISTS',
            message: 'This email is already registered. Please Sign In instead.',
            action: 'login'
          });
        }
        console.warn('[Auth Register Auth Notice]:', authErr.message);
      }

      if (authData?.user) {
        authUser = authData.user;
        session = authData.session;
      }
    }

    // If confirmation is required, Supabase session is empty/null
    const verifyRequired = hasSupabase() ? !session : true;

    if (verifyRequired) {
      if (!hasSupabase()) {
        const otpCode = generateOtpCode();
        // Mock: save pending registration in memory
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
        } else {
          console.log(`========================================`);
          console.log(`[Mock Auth] Register OTP for ${cleanEmail}: ${otpCode}`);
          console.log(`========================================`);
        }
      }

      return res.status(201).json({
        success: true,
        message: 'A verification OTP has been sent to your email. Please enter it to complete registration.',
        verifyRequired: true,
        email: cleanEmail
      });
    }

    let savedUser;
    try {
      savedUser = await ensurePublicUser(publicUserPayload({
        name: cleanName,
        full_name: cleanName,
        email: cleanEmail,
        passwordHash,
        role: role || 'cashier',
        phone: phone || ''
      }, authUser?.id));
    } catch (dbErr) {
      console.warn('[Auth Register DB Notice]:', dbErr.message);
      savedUser = {
        id: authUser?.id || `user_${Date.now()}`,
        name: cleanName,
        full_name: cleanName,
        email: cleanEmail,
        password: passwordHash,
        password_hash: passwordHash,
        role: role || 'cashier',
        phone: phone || ''
      };
      mockUsers.push(savedUser);
    }

    const authUserOut = formatAuthUser(savedUser);
    const token = generateToken(authUserOut.id, authUserOut.role, authUserOut.name, authUserOut.email);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      verifyRequired: false,
      token,
      user: authUserOut
    });
  } catch (error) {
    next(error);
  }
};

// @desc Login existing user via Supabase Auth / public.users
// @route POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const cleanEmail = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || '');

    if (!cleanEmail || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    let authenticated = null;

    // 1) Supabase Auth (primary)
    if (hasSupabase()) {
      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (!authErr && authData?.user) {
        const meta = authData.user.user_metadata || {};
        const { user: existingRow } = await findUserByEmail(cleanEmail);
        const profilePayload = {
          id: authData.user.id,
          name: meta.full_name || meta.name || existingRow?.name || 'Cashier',
          full_name: meta.full_name || meta.name || existingRow?.full_name || existingRow?.name || 'Cashier',
          email: cleanEmail,
          role: meta.role || existingRow?.role || 'cashier',
          phone: meta.phone || existingRow?.phone || ''
        };
        // Only hash once when creating the missing profile row
        if (!existingRow) {
          const salt = await bcrypt.genSalt(10);
          const passwordHash = await bcrypt.hash(password, salt);
          profilePayload.password = passwordHash;
          profilePayload.password_hash = passwordHash;
        }
        const synced = await ensurePublicUser(profilePayload);
        authenticated = formatAuthUser(synced || {
          id: authData.user.id,
          email: cleanEmail,
          name: profilePayload.name,
          role: profilePayload.role,
          phone: profilePayload.phone
        });
      }
    }

    // 2) public.users password verify
    if (!authenticated) {
      const { user } = await findUserByEmail(cleanEmail);
      if (user) {
        const rawPwd = user.password_hash || user.password || '';
        const pwdHash = typeof rawPwd === 'string' ? rawPwd : String(rawPwd);
        let isMatch = false;
        if (pwdHash.startsWith('$2a$') || pwdHash.startsWith('$2b$') || pwdHash.startsWith('$2y$')) {
          isMatch = await bcrypt.compare(password, pwdHash);
        } else if (pwdHash) {
          isMatch = password === pwdHash;
        }
        if (isMatch) {
          authenticated = formatAuthUser(user);
        } else {
          return res.status(401).json({
            success: false,
            code: 'INVALID_PASSWORD',
            message: 'Incorrect password. Please try again.',
            action: 'login'
          });
        }
      }
    }

    // 3) Demo cashier convenience
    if (!authenticated && cleanEmail === 'cashier@quickbill.com' && password === '123456') {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('123456', salt);
      const demo = await ensurePublicUser({
        name: 'Senior Cashier',
        full_name: 'Senior Cashier',
        email: 'cashier@quickbill.com',
        password: passwordHash,
        password_hash: passwordHash,
        role: 'cashier',
        phone: '+18005550199'
      });
      authenticated = formatAuthUser(demo);
    }

    if (!authenticated) {
      return res.status(404).json({
        success: false,
        code: 'USER_NOT_FOUND',
        message: 'No account found with this email. Please Register first.',
        action: 'register'
      });
    }

    const token = generateToken(
      authenticated.id,
      authenticated.role,
      authenticated.name,
      authenticated.email
    );

    res.json({
      success: true,
      message: 'Signed in successfully',
      token,
      user: authenticated
    });
  } catch (error) {
    next(error);
  }
};

// @desc Current user profile
// @route GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    let user = null;

    if (hasSupabase() && req.user?.id) {
      const { data } = await supabase
        .from('users')
        .select('id, name, full_name, email, role, phone')
        .eq('id', req.user.id)
        .maybeSingle();
      if (data) user = data;
      if (!user && req.user.email) {
        const { data: byEmail } = await supabase
          .from('users')
          .select('id, name, full_name, email, role, phone')
          .eq('email', normalizeEmail(req.user.email))
          .maybeSingle();
        user = byEmail;
      }
    }

    if (!user) {
      user = {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: ''
      };
    }

    res.json({ success: true, user: formatAuthUser(user) });
  } catch (error) {
    next(error);
  }
};

const pendingRegistrations = {};
const pendingLoginOtps = {};

const generateOtpCode = () => {
  if (process.env.RESEND_API_KEY) {
    return String(Math.floor(100000 + Math.random() * 900000));
  }
  return '123456';
};

const hasResend = () => !!process.env.RESEND_API_KEY;

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

      if (hasSupabase()) {
        const { error } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: { shouldCreateUser: false }
        });
        if (error) throw error;
      } else {
        const otpCode = generateOtpCode();
        pendingLoginOtps[cleanEmail] = {
          code: otpCode,
          expires: Date.now() + 10 * 60 * 1000
        };

        if (hasResend()) {
          await emailService.sendOtpEmail(cleanEmail, user.name, otpCode, 'login');
        } else {
          console.log(`========================================`);
          console.log(`[Mock Auth] Login OTP for ${cleanEmail}: ${otpCode}`);
          console.log(`========================================`);
        }
      }
    } else if (mode === 'register') {
      if (user) {
        return res.status(409).json({
          success: false,
          code: 'USER_EXISTS',
          message: 'This email is already registered. Please Sign In instead.',
          action: 'login'
        });
      }

      if (hasSupabase()) {
        const { error } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: { shouldCreateUser: true }
        });
        if (error) throw error;
      } else {
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
          await emailService.sendOtpEmail(cleanEmail, pendingRegistrations[cleanEmail].name, otpCode, 'signup');
        } else {
          console.log(`========================================`);
          console.log(`[Mock Auth] Register OTP for ${cleanEmail}: ${otpCode}`);
          console.log(`========================================`);
        }
      }
    } else {
      return res.status(400).json({ success: false, message: 'Invalid OTP mode' });
    }

    res.json({
      success: true,
      message: 'One-Time Password (OTP) sent to your email.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc Verify OTP code and sign in / sign up
// @route POST /api/auth/verify-otp
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, code, type, password, name, role, phone } = req.body || {};
    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail || !code) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required' });
    }

    let authenticated = null;

    if (type === 'signup') {
      if (hasSupabase()) {
        const { data: authData, error: authErr } = await supabase.auth.verifyOtp({
          email: cleanEmail,
          token: code,
          type: 'signup'
        });

        if (authErr) {
          return res.status(400).json({ success: false, message: authErr.message });
        }

        if (authData?.user) {
          const salt = await bcrypt.genSalt(10);
          const passwordHash = await bcrypt.hash(password || '123456', salt);
          const synced = await ensurePublicUser({
            id: authData.user.id,
            name: name || authData.user.user_metadata?.full_name || 'Cashier',
            full_name: name || authData.user.user_metadata?.full_name || 'Cashier',
            email: cleanEmail,
            password: passwordHash,
            password_hash: passwordHash,
            role: role || 'cashier',
            phone: phone || ''
          });
          authenticated = formatAuthUser(synced);
        }
      } else {
        const pending = pendingRegistrations[cleanEmail];
        const expectedCode = pending?.code || '123456';

        if (code === expectedCode) {
          const activePending = pending || {
            name: name || 'Cashier',
            email: cleanEmail,
            role: role || 'cashier',
            phone: phone || ''
          };
          const salt = await bcrypt.genSalt(10);
          const passwordHash = await bcrypt.hash(password || '123456', salt);
          
          const synced = await ensurePublicUser({
            name: activePending.name,
            full_name: activePending.name,
            email: cleanEmail,
            password: passwordHash,
            password_hash: passwordHash,
            role: activePending.role,
            phone: activePending.phone
          });
          delete pendingRegistrations[cleanEmail];
          authenticated = formatAuthUser(synced);
        } else {
          return res.status(400).json({ success: false, message: 'Invalid OTP code. Please try again.' });
        }
      }
    } else {
      if (hasSupabase()) {
        const { data: authData, error: authErr } = await supabase.auth.verifyOtp({
          email: cleanEmail,
          token: code,
          type: 'email'
        });

        if (authErr) {
          return res.status(400).json({ success: false, message: authErr.message });
        }

        if (authData?.user) {
          const meta = authData.user.user_metadata || {};
          const { user: existingRow } = await findUserByEmail(cleanEmail);
          const profilePayload = {
            id: authData.user.id,
            name: meta.full_name || meta.name || existingRow?.name || 'Cashier',
            full_name: meta.full_name || meta.name || existingRow?.full_name || existingRow?.name || 'Cashier',
            email: cleanEmail,
            role: meta.role || existingRow?.role || 'cashier',
            phone: meta.phone || existingRow?.phone || ''
          };
          if (!existingRow) {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash('123456', salt);
            profilePayload.password = passwordHash;
            profilePayload.password_hash = passwordHash;
          }
          const synced = await ensurePublicUser(profilePayload);
          authenticated = formatAuthUser(synced);
        }
      } else {
        const expectedCode = pendingLoginOtps[cleanEmail]?.code || '123456';

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

    if (hasSupabase()) {
      if (type === 'signup') {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: cleanEmail
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: { shouldCreateUser: false }
        });
        if (error) throw error;
      }
    } else {
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
        } else {
          console.log(`========================================`);
          console.log(`[Mock Auth] Resent Register OTP for ${cleanEmail}: ${otpCode}`);
          console.log(`========================================`);
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
        } else {
          console.log(`========================================`);
          console.log(`[Mock Auth] Resent Login OTP for ${cleanEmail}: ${otpCode}`);
          console.log(`========================================`);
        }
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

