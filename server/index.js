import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

dotenv.config();

const PORT = Number(process.env.PORT || 4000);
const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : ['*'];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.static('dist'));

const ownerEmail = process.env.OWNER_EMAIL;
const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER || 'info@pawanhansyatra.co.in';
const twilioFrom = process.env.TWILIO_PHONE_NUMBER;
const twilioMessagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

const validateEmailConfig = () => {
  const missing = [];
  if (!process.env.SMTP_HOST) missing.push('SMTP_HOST');
  if (!process.env.SMTP_PORT) missing.push('SMTP_PORT');
  if (!process.env.SMTP_USER) missing.push('SMTP_USER');
  if (!process.env.SMTP_PASS) missing.push('SMTP_PASS');
  if (!ownerEmail) missing.push('OWNER_EMAIL');

  if (missing.length) {
    throw new Error(`Missing required email configuration: ${missing.join(', ')}`);
  }
};

const isSmsConfigured = () => {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    (twilioFrom || twilioMessagingServiceSid)
  );
};

const normalizePhoneNumber = (rawPhone) => {
  if (!rawPhone) return '';
  const cleaned = rawPhone.replace(/[^\d+]/g, '');
  if (!cleaned) return '';
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
};

const sendOwnerEmail = async (inquiry) => {
  validateConfig();

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const bodyLines = [
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Phone: ${inquiry.phone}`,
    `Package: ${inquiry.packageName || inquiry.package}`,
    `Travel Date: ${inquiry.travelDate}`,
    `Travelers: ${inquiry.travelers}`,
    `Message: ${inquiry.message || 'No message provided'}`,
  ];

  await transporter.sendMail({
    from: fromEmail,
    to: ownerEmail,
    subject: `New Booking Inquiry from ${inquiry.name}`,
    text: bodyLines.join('\n'),
    html: `<h2>New Booking Inquiry</h2><p>${bodyLines.join('<br/>')}</p>`,
  });
};

const sendCustomerEmail = async (inquiry) => {
  validateConfig();

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const customerText = `Hello ${inquiry.name},\n\nThank you for filling out our Char Dham Yatra enquiry form. We have received your details successfully.\n\nOur team will review your requirements and get back to you shortly with the best possible options.\n\nIn the meantime, if you have any specific preferences or questions, please feel free to reply to this message.\n\nThank you!`;

  const customerHtml = `
    <p>Hello ${inquiry.name},</p>
    <p>Thank you for filling out our <strong>Char Dham Yatra</strong> enquiry form. We have received your details successfully.</p>
    <p>Our team will review your requirements and get back to you shortly with the best possible options.</p>
    <p>In the meantime, if you have any specific preferences or questions, please feel free to reply to this message.</p>
    <p>Thank you!</p>
  `;

  await transporter.sendMail({
    from: fromEmail,
    to: inquiry.email,
    subject: 'Thank you for your Char Dham Yatra enquiry',
    text: customerText,
    html: customerHtml,
  });
};

const sendWelcomeSms = async (phone, name) => {
  if (!isSmsConfigured()) {
    console.warn('Twilio SMS not configured. Skipping welcome SMS.');
    return;
  }

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  const toNumber = normalizePhoneNumber(phone);

  if (!toNumber) {
    console.warn('Invalid customer phone number for SMS. Skipping welcome SMS.');
    return;
  }

  const smsPayload = {
    body: `Hello ${name}, thank you for your booking inquiry! Our team will contact you soon.`,
    to: toNumber,
  };

  if (twilioMessagingServiceSid) {
    smsPayload.messagingServiceSid = twilioMessagingServiceSid;
  } else {
    smsPayload.from = twilioFrom;
  }

  await client.messages.create(smsPayload);
};

app.post('/api/inquiries', async (req, res) => {
  const { name, email, phone, packageName, travelDate, travelers, message } = req.body;

  if (!name || !email || !phone || !packageName) {
    return res.status(400).json({ error: 'Please provide name, email, phone, and package information.' });
  }

  try {
    const results = await Promise.allSettled([
      sendOwnerEmail(req.body),
      sendCustomerEmail(req.body),
      sendWelcomeSms(phone, name),
    ]);

    const emailErrors = results.slice(0, 2).filter((result) => result.status === 'rejected');
    if (emailErrors.length > 0) {
      throw emailErrors[0].reason;
    }

    const smsResult = results[2];
    if (smsResult.status === 'rejected') {
      console.warn('Welcome SMS failed:', smsResult.reason);
    }

    const smsStatus = isSmsConfigured()
      ? smsResult.status === 'fulfilled'
        ? 'SMS delivered.'
        : 'SMS failed.'
      : 'SMS disabled.';

    return res.status(200).json({
      success: true,
      message: `Inquiry sent. Emails delivered. ${smsStatus}`,
    });
  } catch (error) {
    console.error('Failed to process inquiry:', error);
    return res.status(500).json({ error: 'Unable to send inquiry notifications. Check server configuration.' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((req, res) => {
  res.sendFile('index.html', { root: 'dist' });
});

app.listen(PORT, () => {
  console.log(`Inquiry server listening on http://localhost:${PORT}`);
});
