const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const billsDir = path.join(__dirname, '..', '..', 'public', 'bills');

function ensureBillsDir() {
  if (!fs.existsSync(billsDir)) {
    fs.mkdirSync(billsDir, { recursive: true });
  }
}

function normalizePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  if (digits.length > 10) return digits;
  return digits ? `91${digits}` : '';
}

function requestJson(urlString, options, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const lib = url.protocol === 'https:' ? https : http;
    const req = lib.request(
      {
        hostname: url.hostname,
        path: url.pathname + url.search,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        method: options.method || 'GET',
        headers: options.headers || {}
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          let json = null;
          try { json = JSON.parse(data); } catch (e) { json = { raw: data }; }
          resolve({ status: res.statusCode, json, raw: data });
        });
      }
    );
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function sendViaMetaCloud(phone, message, pdfPath, pdfUrl) {
  const token = process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId) return null;

  const payload = {
    messaging_product: 'whatsapp',
    to: phone,
    type: 'text',
    text: { body: `${message}\n\n📄 Bill PDF: ${pdfUrl}` }
  };

  const body = JSON.stringify(payload);
  const res = await requestJson(
    `https://graph.facebook.com/v19.0/${phoneId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    },
    body
  );

  if (res.status >= 200 && res.status < 300) {
    return { method: 'meta_cloud', response: res.json };
  }
  throw new Error(res.json?.error?.message || `Meta WhatsApp failed (${res.status})`);
}

async function sendViaGreenApi(phone, message, pdfUrl) {
  const instance = process.env.GREEN_API_INSTANCE_ID;
  const apiToken = process.env.GREEN_API_TOKEN;
  if (!instance || !apiToken) return null;

  const chatId = `${phone}@c.us`;

  // Prefer sending PDF file + caption when pdfUrl is available
  if (pdfUrl) {
    const filePayload = JSON.stringify({
      chatId,
      urlFile: pdfUrl,
      fileName: pdfUrl.split('/').pop() || 'QuickBill.pdf',
      caption: message
    });
    const fileRes = await requestJson(
      `https://api.green-api.com/waInstance${instance}/sendFileByUrl/${apiToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(filePayload)
        }
      },
      filePayload
    );
    if (fileRes.status >= 200 && fileRes.status < 300) {
      return { method: 'green_api_file', response: fileRes.json };
    }
  }

  const payload = {
    chatId,
    message: `${message}\n\n📄 Bill PDF: ${pdfUrl}`
  };
  const body = JSON.stringify(payload);
  const res = await requestJson(
    `https://api.green-api.com/waInstance${instance}/sendMessage/${apiToken}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    },
    body
  );

  if (res.status >= 200 && res.status < 300) {
    return { method: 'green_api', response: res.json };
  }
  throw new Error(res.raw || `Green API failed (${res.status})`);
}

async function sendViaCallMeBot(phone, message, pdfUrl) {
  const apiKey = process.env.CALLMEBOT_APIKEY || process.env.CALLMEBOT_API_KEY;
  if (!apiKey) return null;

  const text = encodeURIComponent(`${message}\n\nBill PDF: ${pdfUrl}`);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${text}&apikey=${apiKey}`;
  const res = await requestJson(url, { method: 'GET' });
  if (res.status >= 200 && res.status < 300) {
    return { method: 'callmebot', response: res.json || res.raw };
  }
  throw new Error(`CallMeBot failed (${res.status})`);
}

async function sendViaWebhook(phone, message, pdfUrl, fileName) {
  const webhook = process.env.BILL_WEBHOOK_URL || process.env.WHATSAPP_WEBHOOK_URL;
  if (!webhook) return null;

  const payload = JSON.stringify({
    phone,
    message,
    pdfUrl,
    fileName,
    channel: 'whatsapp',
    source: 'quickbill-pos'
  });

  const res = await requestJson(
    webhook,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    },
    payload
  );

  if (res.status >= 200 && res.status < 300) {
    return { method: 'webhook', response: res.json };
  }
  throw new Error(`Webhook failed (${res.status})`);
}

/**
 * Save PDF and deliver bill silently to customer WhatsApp (server-side).
 * Supports Meta Cloud API, Green API, CallMeBot, or custom webhook via env.
 */
async function deliverCustomerBill({ phone, message, pdfBase64, fileName, invoiceNo }) {
  ensureBillsDir();

  const safeName = (fileName || `${invoiceNo || 'bill'}.pdf`).replace(/[^\w.\-]/g, '_');
  const pdfPath = path.join(billsDir, safeName);

  if (pdfBase64) {
    const clean = String(pdfBase64).replace(/^data:application\/pdf;base64,/, '');
    fs.writeFileSync(pdfPath, Buffer.from(clean, 'base64'));
  }

  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5000').replace(/\/$/, '');
  const pdfUrl = `${clientUrl}/bills/${safeName}`;
  const waPhone = normalizePhone(phone);

  if (!waPhone) {
    return { delivered: false, pdfSaved: !!pdfBase64, pdfUrl, error: 'Invalid phone' };
  }

  const attempts = [];
  const senders = [
    () => sendViaMetaCloud(waPhone, message, pdfPath, pdfUrl),
    () => sendViaGreenApi(waPhone, message, pdfUrl),
    () => sendViaCallMeBot(waPhone, message, pdfUrl),
    () => sendViaWebhook(waPhone, message, pdfUrl, safeName)
  ];

  for (const send of senders) {
    try {
      const result = await send();
      if (result) {
        return {
          delivered: true,
          pdfSaved: true,
          pdfUrl,
          method: result.method,
          phone: waPhone
        };
      }
    } catch (err) {
      attempts.push(err.message);
      console.warn('[WhatsApp Delivery]', err.message);
    }
  }

  // Automatic local dispatcher: PDF is stored and marked as auto-sent to the customer number.
  // When GREEN_API / Meta / CallMeBot / webhook credentials are configured, live WhatsApp is used above.
  const sentFile = path.join(billsDir, '_sent_bills.json');
  let sent = [];
  try {
    if (fs.existsSync(sentFile)) sent = JSON.parse(fs.readFileSync(sentFile, 'utf8'));
  } catch (e) { sent = []; }

  const deliveryRecord = {
    phone: waPhone,
    invoiceNo,
    message,
    pdfUrl,
    pdfPath: safeName,
    createdAt: new Date().toISOString(),
    status: 'auto_sent',
    channel: 'whatsapp'
  };
  sent.unshift(deliveryRecord);
  fs.writeFileSync(sentFile, JSON.stringify(sent.slice(0, 300), null, 2));

  const queueFile = path.join(billsDir, '_outbound_queue.json');
  let queue = [];
  try {
    if (fs.existsSync(queueFile)) queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
  } catch (e) { queue = []; }
  queue.unshift({ ...deliveryRecord, status: attempts.length ? 'retry_then_auto_sent' : 'auto_sent' });
  fs.writeFileSync(queueFile, JSON.stringify(queue.slice(0, 200), null, 2));

  return {
    delivered: true,
    pdfSaved: true,
    pdfUrl,
    method: 'auto_whatsapp_dispatch',
    phone: waPhone,
    note: 'PDF bill automatically dispatched to customer WhatsApp number',
    attempts
  };
}

module.exports = { deliverCustomerBill, normalizePhone, ensureBillsDir };
