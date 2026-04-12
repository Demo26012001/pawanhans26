import http from 'node:http';

const data = JSON.stringify({
  name: 'Test User',
  email: 'test@example.com',
  phone: '+919876543210',
  packageName: 'Test Package',
  travelDate: '2026-05-01',
  travelers: 1,
  message: 'This is a test inquiry.',
});

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/inquiries',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    console.log('BODY', body);
  });
});

req.on('error', (err) => console.error('ERROR', err));
req.write(data);
req.end();
