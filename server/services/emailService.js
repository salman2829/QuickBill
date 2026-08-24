const { Resend } = require('resend');

// Initialize Resend Client
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Default sender for Resend (onboarding@resend.dev is standard for testing, can be customized)
const EMAIL_FROM = process.env.RESEND_FROM_EMAIL || 'QuickBill POS <onboarding@resend.dev>';

/**
 * Send an OTP verification email to the user.
 * @param {string} toEmail - The recipient's email address
 * @param {string} toName - The recipient's full name
 * @param {string} otpCode - The 6-digit OTP code
 * @param {string} mode - 'login' or 'signup'
 * @returns {Promise<object|null>} The Resend API response, or null if disabled
 */
async function sendOtpEmail(toEmail, toName, otpCode, mode = 'login') {
  if (!resend) {
    console.warn('[Resend Email Service]: Skipped sending email. RESEND_API_KEY is not configured.');
    return null;
  }

  const subject = mode === 'signup' 
    ? 'Verify your Cashier Account — QuickBill POS' 
    : 'Your Sign In Verification Code — QuickBill POS';

  const titleText = mode === 'signup' ? 'Create Cashier Account' : 'Terminal Sign In';
  const instructionText = mode === 'signup'
    ? 'Thank you for registering with QuickBill POS. Use the code below to complete your account registration:'
    : 'A login request was made for your cashier terminal. Enter the following One-Time Password (OTP) to complete sign in:';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: #f3f4f6;
          color: #1f2937;
        }
        .container {
          max-width: 580px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
          border: 1px solid #e5e7eb;
        }
        .header {
          background: linear-gradient(135deg, #0f766e 0%, #115e59 100%);
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 18px;
          font-weight: 600;
          margin-top: 0;
          margin-bottom: 12px;
          color: #111827;
        }
        .description {
          font-size: 15px;
          line-height: 1.6;
          color: #4b5563;
          margin-bottom: 30px;
        }
        .otp-card {
          background-color: #f0fdfa;
          border: 1px solid #ccfbf1;
          border-radius: 8px;
          padding: 24px;
          text-align: center;
          margin-bottom: 30px;
        }
        .otp-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #0d9488;
          margin-bottom: 10px;
        }
        .otp-code {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: 8px;
          color: #0f766e;
          font-family: "Courier New", Courier, monospace;
          margin: 0;
        }
        .warning {
          font-size: 13px;
          color: #9ca3af;
          line-height: 1.5;
          text-align: center;
          margin-top: 20px;
          border-top: 1px solid #f3f4f6;
          padding-top: 20px;
        }
        .footer {
          background-color: #f9fafb;
          padding: 20px;
          text-align: center;
          border-top: 1px solid #f3f4f6;
        }
        .footer p {
          font-size: 12px;
          color: #9ca3af;
          margin: 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>QuickBill POS</h1>
        </div>
        <div class="content">
          <p class="greeting">Hello ${toName || 'Cashier'},</p>
          <p class="description">${instructionText}</p>
          
          <div class="otp-card">
            <div class="otp-label">Verification OTP</div>
            <div class="otp-code">${otpCode}</div>
          </div>
          
          <p class="description" style="font-size:13px; color:#6b7280; text-align:center;">
            This verification code is valid for <strong>10 minutes</strong>. 
            Do not share this code with anyone.
          </p>
          
          <div class="warning">
            If you did not request this verification code, please ignore this email or contact support if you suspect unauthorized access.
          </div>
        </div>
        <div class="footer">
          <p>© 2026 QuickBill POS. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await resend.emails.send({
      from: EMAIL_FROM,
      to: toEmail,
      subject: subject,
      html: htmlContent
    });

    if (response.error) {
      throw new Error(response.error.message || 'Resend API returned an error');
    }

    const messageId = response.data?.id;
    console.log(`[Resend Email Service] Email sent successfully to ${toEmail}. Message ID:`, messageId);
    return response.data;
  } catch (error) {
    console.error(`[Resend Email Service] Failed to send email to ${toEmail}:`, error.message);
    throw error;
  }
}

module.exports = {
  sendOtpEmail
};
