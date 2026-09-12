import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import nodemailer, { type Transporter } from 'nodemailer';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Global safety listeners for uncaught exceptions & unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.warn('[Server Safety] Caught Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[Server Safety] Caught Uncaught Exception:', err);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Lazy Nodemailer Transporter Initializer (Gmail / Standard SMTP)
 */
let mailTransporter: Transporter | null = null;
function getTransporter(): { transporter: Transporter | null; fromEmail: string } {
  const gmailUser = (process.env.GMAIL_USER || process.env.SMTP_USER || '').trim();
  const rawPass = (process.env.GMAIL_APP_PASS || process.env.SMTP_PASS || '').trim();
  const gmailPass = rawPass.replace(/\s+/g, ''); // remove accidental spaces

  if (gmailUser && gmailPass) {
    if (!mailTransporter) {
      mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });
    }
    return { transporter: mailTransporter, fromEmail: gmailUser };
  }

  // Check generic SMTP host
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  if (smtpHost && gmailUser && gmailPass) {
    if (!mailTransporter) {
      mailTransporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });
    }
    return { transporter: mailTransporter, fromEmail: gmailUser };
  }

  return { transporter: null, fromEmail: '' };
}

/**
 * Lazy Resend Fallback Client Initializer
 */
let resendClient: Resend | null = null;
function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey && apiKey.trim().length > 0) {
    if (!resendClient) {
      resendClient = new Resend(apiKey.trim());
    }
    return resendClient;
  }
  return null;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const { transporter } = getTransporter();
  const hasResend = Boolean(getResend());
  res.json({
    status: 'ok',
    hasGmailSmtp: Boolean(transporter),
    hasResendKey: hasResend,
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /api/send-welcome-email
 * Sends a branded welcome email to newly registered students via Gmail SMTP or Resend
 */
app.post('/api/send-welcome-email', async (req, res) => {
  const { email, name, appUrl } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Valid recipient email is required.' });
  }

  const studentName = (name && typeof name === 'string' && name.trim().length > 0)
    ? name.trim()
    : 'Verto Student';

  const baseUrl = appUrl || process.env.APP_URL || 'https://vertoridevertoride.vercel.app';
  const bookRideUrl = `${baseUrl.replace(/\/$/, '')}/?tab=book`;

  console.log(`[Email Service] Processing welcome email request for: ${email} (${studentName})`);

  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Verrto Ride</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f8fafc;
      padding: 40px 0 60px 0;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
    }
    .header {
      background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
      padding: 36px 32px;
      text-align: center;
      color: #ffffff;
    }
    .brand-logo {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0;
      color: #ffffff;
    }
    .brand-tag {
      display: inline-block;
      margin-top: 8px;
      background-color: rgba(255, 255, 255, 0.2);
      color: #e0e7ff;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 20px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .content {
      padding: 36px 32px 28px 32px;
    }
    .headline {
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.35;
      margin-top: 0;
      margin-bottom: 18px;
    }
    .body-text {
      font-size: 15px;
      line-height: 1.65;
      color: #475569;
      margin-bottom: 24px;
    }
    .feature-card {
      background-color: #f1f5f9;
      border-radius: 14px;
      padding: 18px 20px;
      margin-bottom: 28px;
      border-left: 4px solid #4f46e5;
    }
    .feature-item {
      font-size: 13.5px;
      color: #334155;
      margin: 6px 0;
      display: flex;
      align-items: center;
    }
    .cta-container {
      text-align: center;
      margin: 32px 0 24px 0;
    }
    .cta-button {
      display: inline-block;
      background: #4f46e5;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      padding: 14px 34px;
      border-radius: 12px;
      box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
      transition: background-color 0.2s;
    }
    .cta-button:hover {
      background: #4338ca;
    }
    .divider {
      border: 0;
      height: 1px;
      background-color: #e2e8f0;
      margin: 32px 0 24px 0;
    }
    .footer {
      text-align: center;
      padding: 0 32px 32px 32px;
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.5;
    }
    .footer a {
      color: #6366f1;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header Banner -->
      <div class="header">
        <h1 class="brand-logo">VERRTO RIDE 🚗</h1>
        <div class="brand-tag">LPU Official Campus Carpool & Auto Network</div>
      </div>

      <!-- Main Body -->
      <div class="content">
        <h2 class="headline">Welcome to the Verrto Ride family, ${studentName}! 🚗</h2>
        
        <p class="body-text">
          Thanks for joining Verrto Ride. Verrto Ride helps LPU students book convenient rides within the campus, from their current location to their destination.
        </p>

        <div class="feature-card">
          <div class="feature-item">🛺 <strong>Campus Autos & E-Rickshaws</strong>: Fixed standard ₹10–₹20 student fare</div>
          <div class="feature-item">📍 <strong>All Major Gates & Hostels</strong>: Law Gate, Main Gate, BH-1 to BH-7, UniMall</div>
          <div class="feature-item">🛡️ <strong>Safety First</strong>: Verified LPU registration and secure 4-digit Boarding OTP</div>
          <div class="feature-item">💳 <strong>VertoPay Wallet</strong>: Split instant auto fare without cash or change hassles</div>
        </div>

        <!-- Call to action button -->
        <div class="cta-container">
          <a href="${bookRideUrl}" class="cta-button" target="_blank" rel="noopener noreferrer">
            Book Your First Ride
          </a>
        </div>

        <p class="body-text" style="font-size: 13.5px; color: #64748b; margin-top: 24px; text-align: center;">
          Have questions or need assistance? Open Verrto Ride anytime to track real-time routes, share cabs, or view live campus autos.
        </p>

        <hr class="divider" />
      </div>

      <!-- Footer -->
      <div class="footer">
        <p style="margin: 0 0 6px 0;"><strong>Verrto Ride</strong> • Lovely Professional University, Phagwara, Punjab 144411</p>
        <p style="margin: 0;">Built exclusively for LPU Vertos. Safe travels across campus!</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

  try {
    const { transporter, fromEmail } = getTransporter();

    // 1. Primary: Send via Nodemailer (Gmail SMTP)
    if (transporter && fromEmail) {
      console.log(`[Email Service - Gmail SMTP] Sending email from ${fromEmail} to ${email}...`);
      const info = await transporter.sendMail({
        from: `"Verrto Ride" <${fromEmail}>`,
        to: email,
        subject: 'Welcome to the Verrto Ride family! 🚗',
        html: emailHtml,
      });

      console.log(`[Email Service - Gmail SMTP] Successfully delivered email! Message ID: ${info.messageId}`);
      return res.status(200).json({
        success: true,
        provider: 'smtp',
        messageId: info.messageId,
        recipient: email
      });
    }

    // 2. Fallback: Send via Resend if RESEND_API_KEY is available
    const resend = getResend();
    if (resend) {
      console.log(`[Email Service - Resend] Sending email to ${email} via Resend...`);
      const { data, error } = await resend.emails.send({
        from: 'Verrto Ride <onboarding@resend.dev>',
        to: [email],
        subject: 'Welcome to the Verrto Ride family! 🚗',
        html: emailHtml
      });

      if (error) {
        console.error('[Resend Error] Failed to send welcome email:', error);
        return res.status(500).json({
          success: false,
          provider: 'resend',
          message: 'Resend API returned an error',
          error: error.message || error
        });
      }

      console.log(`[Email Service - Resend] Welcome email successfully sent! ID: ${data?.id}`);
      return res.status(200).json({
        success: true,
        provider: 'resend',
        messageId: data?.id,
        recipient: email
      });
    }

    // If neither is configured, log warning and return informative response
    console.warn('[Email Service] Neither GMAIL_USER/GMAIL_APP_PASS nor RESEND_API_KEY is configured.');
    return res.status(200).json({
      success: false,
      skipped: true,
      message: 'Email service credentials not yet configured. Email dispatch skipped safely.'
    });

  } catch (err: any) {
    console.error('[Email Service] Exception during email dispatch:', err?.message || err);
    return res.status(500).json({
      success: false,
      message: err?.message || 'Internal server error while sending email'
    });
  }
});

/**
 * Vite middleware & Static SPA serving
 */
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false // Disable HMR websocket in cloud container to prevent websocket connection errors
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Verrto Ride server running on http://0.0.0.0:${PORT}`);
    const { transporter, fromEmail } = getTransporter();
    if (transporter) {
      console.log(`📧 Gmail SMTP integration active with account: ${fromEmail}`);
    } else if (process.env.RESEND_API_KEY) {
      console.log('📧 Resend integration active with RESEND_API_KEY');
    } else {
      console.warn('⚠️ GMAIL_USER & GMAIL_APP_PASS are not set. Set them in Secrets panel to enable emails.');
    }
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
