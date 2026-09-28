const { Resend } = require('resend');

/**
 * Send an OTP verification email to the user using Resend.
 * Supports auto-fallback between verified domain sender and onboarding@resend.dev.
 * 
 * @param {string} toEmail - The recipient's email address
 * @param {string} toName - The recipient's full name
 * @param {string} otpCode - The 6-digit OTP code
 * @param {string} mode - 'login' or 'signup'
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
async function sendOtpEmail(toEmail, toName, otpCode, mode = 'login') {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    const warnMsg = 'RESEND_API_KEY is not configured in environment variables.';
    console.warn('[Resend Email Service]:', warnMsg);
    return { success: false, error: warnMsg };
  }

  const resend = new Resend(apiKey);
  const primaryFrom = process.env.RESEND_FROM_EMAIL || 'QuickBill POS <noreply@zynovextechnologies.in>';
  const fallbackFrom = 'QuickBill POS <onboarding@resend.dev>';

  const subject = mode === 'signup' 
    ? 'Verify your Cashier Account — QuickBill POS' 
    : 'Your Sign In Verification Code — QuickBill POS';

  const titleText = mode === 'signup' ? 'Create Cashier Account' : 'Terminal Sign In';
  const instructionText = mode === 'signup'
    ? 'Thank you for registering with QuickBill POS. Use the 6-digit verification code below to complete your cashier account setup:'
    : 'A login request was made for your cashier terminal. Enter the following One-Time Password (OTP) to complete sign in:';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          background-color: #f0fdf4;
          color: #1f2937;
        }
        .container {
          max-width: 580px;
          margin: 32px auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(15, 118, 110, 0.1), 0 8px 10px -6px rgba(15, 118, 110, 0.05);
          border: 1px solid #ccfbf1;
        }
        .header {
          background: linear-gradient(135deg, #0f766e 0%, #115e59 100%);
          padding: 32px 24px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 26px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
        .header p {
          color: #99f6e4;
          margin: 6px 0 0 0;
          font-size: 13px;
          font-weight: 500;
        }
        .content {
          padding: 36px 28px;
        }
        .greeting {
          font-size: 18px;
          font-weight: 700;
          margin-top: 0;
          margin-bottom: 12px;
          color: #0f172a;
        }
        .description {
          font-size: 15px;
          line-height: 1.6;
          color: #475569;
          margin-bottom: 24px;
        }
        .otp-card {
          background: linear-gradient(180deg, #f0fdfa 0%, #e6fffa 100%);
          border: 2px solid #0d9488;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          margin-bottom: 24px;
        }
        .otp-label {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #0d9488;
          margin-bottom: 8px;
        }
        .otp-code {
          font-size: 40px;
          font-weight: 900;
          letter-spacing: 10px;
          color: #0f766e;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          margin: 0;
          user-select: all;
        }
        .expiry-note {
          font-size: 13px;
          color: #64748b;
          text-align: center;
          margin-bottom: 24px;
        }
        .security-badge {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 12px;
          color: #64748b;
          line-height: 1.5;
          text-align: center;
          border: 1px solid #e2e8f0;
        }
        .footer {
          background-color: #f8fafc;
          padding: 20px;
          text-align: center;
          border-top: 1px solid #f1f5f9;
        }
        .footer p {
          font-size: 12px;
          color: #94a3b8;
          margin: 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>QuickBill POS</h1>
          <p>Enterprise Retail POS & Barcode Billing</p>
        </div>
        <div class="content">
          <p class="greeting">Hello ${toName || 'Cashier'},</p>
          <p class="description">${instructionText}</p>
          
          <div class="otp-card">
            <div class="otp-label">${titleText} OTP</div>
            <div class="otp-code">${otpCode}</div>
          </div>
          
          <p class="expiry-note">
            ⏳ This code is valid for <strong>10 minutes</strong>. Never share this code with anyone.
          </p>
          
          <div class="security-badge">
            🔒 If you did not request this OTP code, you can safely ignore this email.
          </div>
        </div>
        <div class="footer">
          <p>© 2026 QuickBill POS. Built for fast retail operations.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // First attempt: try with primary configured sender
  try {
    const response = await resend.emails.send({
      from: primaryFrom,
      to: toEmail,
      subject: subject,
      html: htmlContent
    });

    if (response.error) {
      throw new Error(response.error.message || 'Resend error with primary sender');
    }

    const messageId = response.data?.id;
    console.log(`[Resend Email Service] OTP sent successfully to ${toEmail} using ${primaryFrom}. ID:`, messageId);
    return { success: true, messageId };
  } catch (primaryErr) {
    console.warn(`[Resend Email Service] Primary sender (${primaryFrom}) failed: ${primaryErr.message}. Attempting fallback sender (${fallbackFrom})...`);

    // Fallback attempt: if custom domain is not yet verified in Resend, use onboarding@resend.dev
    if (primaryFrom !== fallbackFrom) {
      try {
        const fbResponse = await resend.emails.send({
          from: fallbackFrom,
          to: toEmail,
          subject: subject,
          html: htmlContent
        });

        if (fbResponse.error) {
          throw new Error(fbResponse.error.message || 'Resend error with fallback sender');
        }

        const messageId = fbResponse.data?.id;
        console.log(`[Resend Email Service] OTP sent successfully to ${toEmail} using fallback ${fallbackFrom}. ID:`, messageId);
        return { success: true, messageId };
      } catch (fbErr) {
        console.error(`[Resend Email Service] Both primary and fallback sender failed for ${toEmail}:`, fbErr.message);
        return { success: false, error: fbErr.message };
      }
    }

    return { success: false, error: primaryErr.message };
  }
}

module.exports = {
  sendOtpEmail
};
