import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const PORT = Number(process.env.PORT || 4000);
const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : ['*'];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.static('dist'));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');
const dataFilePath = path.join(dataDir, 'inquiries.json');

const ownerEmail = process.env.OWNER_EMAIL;
const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER || 'info@pawanhansyatra.co.in';
const twilioFrom = process.env.TWILIO_PHONE_NUMBER;
const twilioMessagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

const ensureInquiriesFile = async () => {
  try {
    await fs.access(dataFilePath);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(dataFilePath, '[]', 'utf8');
  }
};

const readInquiries = async () => {
  await ensureInquiriesFile();
  const raw = await fs.readFile(dataFilePath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to parse inquiries file, resetting it:', error);
    await fs.writeFile(dataFilePath, '[]', 'utf8');
    return [];
  }
};

const writeInquiries = async (inquiries) => {
  await ensureInquiriesFile();
  await fs.writeFile(dataFilePath, JSON.stringify(inquiries, null, 2), 'utf8');
};

const makeId = () => `inquiry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createEmailTransport = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  console.warn('SMTP not configured. Falling back to sendmail transport.');
  return nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: process.env.SENDMAIL_PATH || '/usr/sbin/sendmail',
  });
};

const validateEmailConfig = () => {
  if (!ownerEmail) {
    throw new Error('OWNER_EMAIL is required for owner notification emails.');
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
  validateEmailConfig();

  const transporter = createEmailTransport();
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
  const transporter = createEmailTransport();

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
  const { name, email, phone, packageName, travelDate, travelers, message, package: packageId } = req.body;

  if (!name || !email || !phone || !packageName) {
    return res.status(400).json({ error: 'Please provide name, email, phone, and package information.' });
  }

  try {
    const createdAt = new Date().toISOString();
    const inquiry = {
      _id: makeId(),
      id: makeId(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      package: packageId || '',
      packageName: packageName.trim(),
      travelers: Number(travelers) || 1,
      travelDate: travelDate || '',
      message: message || '',
      status: 'new',
      priority: 'medium',
      notes: [],
      source: 'web',
      createdAt,
      updatedAt: createdAt,
    };

    const inquiries = await readInquiries();
    inquiries.unshift(inquiry);
    await writeInquiries(inquiries);

    const results = await Promise.allSettled([
      sendOwnerEmail(inquiry),
      sendCustomerEmail(inquiry),
      sendWelcomeSms(phone, name),
    ]);

    const notifications = [];
    const emailErrors = results.slice(0, 2).filter((result) => result.status === 'rejected');
    if (emailErrors.length > 0) {
      notifications.push(`Email failed: ${emailErrors[0].reason?.message || 'unknown error'}`);
    }

    const smsResult = results[2];
    if (smsResult.status === 'rejected') {
      notifications.push(`SMS failed: ${smsResult.reason?.message || 'unknown error'}`);
    }

    const smsStatus = isSmsConfigured()
      ? smsResult.status === 'fulfilled'
        ? 'SMS delivered.'
        : 'SMS failed.'
      : 'SMS disabled.';

    return res.status(200).json({
      success: true,
      data: inquiry,
      message: `Inquiry saved. ${smsStatus}`,
      notification: notifications.length ? notifications.join(' | ') : 'Notifications sent successfully.',
    });
  } catch (error) {
    console.error('Failed to process inquiry:', error);
    return res.status(500).json({
      error: 'Unable to save inquiry. Check server configuration.',
      details: error?.message || String(error),
    });
  }
});

app.get('/api/inquiries', async (req, res) => {
  try {
    const { status } = req.query;
    const inquiries = await readInquiries();
    const result = status && typeof status === 'string'
      ? inquiries.filter((item) => item.status === status)
      : inquiries;
    res.json({ data: result });
  } catch (error) {
    console.error('Failed to read inquiries:', error);
    res.status(500).json({ error: 'Unable to load inquiries.' });
  }
});

app.get('/api/inquiries/:id', async (req, res) => {
  try {
    const inquiries = await readInquiries();
    const inquiry = inquiries.find((item) => item._id === req.params.id || item.id === req.params.id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }
    res.json({ data: inquiry });
  } catch (error) {
    console.error('Failed to read inquiry:', error);
    res.status(500).json({ error: 'Unable to load inquiry.' });
  }
});

app.put('/api/inquiries/:id', async (req, res) => {
  try {
    const inquiries = await readInquiries();
    const index = inquiries.findIndex((item) => item._id === req.params.id || item.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }
    inquiries[index] = {
      ...inquiries[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    await writeInquiries(inquiries);
    res.json({ data: inquiries[index] });
  } catch (error) {
    console.error('Failed to update inquiry:', error);
    res.status(500).json({ error: 'Unable to update inquiry.' });
  }
});

app.post('/api/inquiries/:id/notes', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Note content is required.' });
    }
    const inquiries = await readInquiries();
    const index = inquiries.findIndex((item) => item._id === req.params.id || item.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }
    const note = {
      content: content.trim(),
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
    };
    inquiries[index].notes = [...(inquiries[index].notes || []), note];
    inquiries[index].updatedAt = new Date().toISOString();
    await writeInquiries(inquiries);
    res.json({ data: inquiries[index] });
  } catch (error) {
    console.error('Failed to add inquiry note:', error);
    res.status(500).json({ error: 'Unable to add note.' });
  }
});

app.delete('/api/inquiries/:id', async (req, res) => {
  try {
    const inquiries = await readInquiries();
    const filtered = inquiries.filter((item) => item._id !== req.params.id && item.id !== req.params.id);
    await writeInquiries(filtered);
    res.json({ data: { success: true } });
  } catch (error) {
    console.error('Failed to delete inquiry:', error);
    res.status(500).json({ error: 'Unable to delete inquiry.' });
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
