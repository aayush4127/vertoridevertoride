import nodemailer from 'nodemailer';
import { Resend } from 'resend';

export default async function handler(req, res) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check endpoint for testing in browser directly
  if (req.method === 'GET') {
    const gmailUser = (process.env.GMAIL_USER || process.env.SMTP_USER || '').trim();
    const rawPass = (process.env.GMAIL_APP_PASS || process.env.SMTP_PASS || '').trim();
    const hasSmtp = Boolean(gmailUser && rawPass);
    const hasResend = Boolean(process.env.RESEND_API_KEY);

    return res.status(200).json({
      status: 'VERTORIDE Email API is operational',
      smtpConfigured: hasSmtp,
      resendConfigured: hasResend,
      senderEmail: gmailUser || (hasResend ? 'onboarding@resend.dev' : 'Not configured')
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const { email, name, appUrl } = body || {};

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Valid recipient email is required.' });
  }

  const studentName = (name && typeof name === 'string' && name.trim().length > 0)
    ? name.trim()
    : 'Verto Student';

  const baseUrl = appUrl || process.env.APP_URL || 'https://vertoridevertoride.vercel.app';
  const bookRideUrl = `${baseUrl.replace(/\/$/, '')}/?tab=book`;

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
    }
    .footer {
      text-align: center;
      padding: 0 32px 32px 32px;
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="brand-logo">VERRTO RIDE 🚗</h1>
        <div class="brand-tag">LPU Official Campus Carpool & Auto Network</div>
      </div>
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
        <div class="cta-container">
          <a href="${bookRideUrl}" class="cta-button" target="_blank" rel="noopener noreferrer">
            Book Your First Ride
          </a>
        </div>
      </div>
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
    const gmailUser = (process.env.GMAIL_USER || process.env.SMTP_USER || '').trim();
    const rawPass = (process.env.GMAIL_APP_PASS || process.env.SMTP_PASS || '').trim();
    const gmailPass = rawPass.replace(/\s+/g, '');

    // Method 1: Gmail SMTP
    if (gmailUser && gmailPass) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
        tls: { rejectUnauthorized: false }
      });

      const info = await transporter.sendMail({
        from: `"Verrto Ride" <${gmailUser}>`,
        to: email,
        subject: 'Welcome to the Verrto Ride family! 🚗',
        html: emailHtml,
      });

      return res.status(200).json({
        success: true,
        provider: 'smtp',
        messageId: info.messageId,
        recipient: email
      });
    }

    // Method 2: Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && resendKey.trim().length > 0) {
      const resend = new Resend(resendKey.trim());
      const { data, error } = await resend.emails.send({
        from: 'Verrto Ride <onboarding@resend.dev>',
        to: [email],
        subject: 'Welcome to the Verrto Ride family! 🚗',
        html: emailHtml
      });

      if (error) {
        return res.status(500).json({
          success: false,
          provider: 'resend',
          error: error.message || error
        });
      }

      return res.status(200).json({
        success: true,
        provider: 'resend',
        messageId: data?.id,
        recipient: email
      });
    }

    return res.status(200).json({
      success: false,
      skipped: true,
      message: 'Email service credentials not configured on server.'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err?.message || 'Internal server error while sending email'
    });
  }
}
