// DIRBALK — account actions proxy (change password / delete account / submit comment)
// Merged into one function to stay within Vercel Hobby's serverless function limit.
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyfWm7URWsqiFrplKN16VXhOspTs2ZaqZaDf1Ol4ZXJ1R8uwtt27G6BgmMV7TwVXhDr/exec';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  const kind = (req.body && req.body.kind) || '';
  let payload;

  if (kind === 'delete') {
    payload = {
      action: 'deleteAccount',
      email: (req.body && req.body.email) || '',
      password: (req.body && req.body.password) || ''
    };
  } else if (kind === 'submitComment') {
    payload = {
      action: 'submitComment',
      email: (req.body && req.body.email) || '',
      product: (req.body && req.body.product) || '',
      text: (req.body && req.body.text) || ''
    };
  } else {
    payload = {
      action: 'changePassword',
      email: (req.body && req.body.email) || '',
      currentPassword: (req.body && req.body.currentPassword) || '',
      newPassword: (req.body && req.body.newPassword) || ''
    };
  }

  try {
    const upstream = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await upstream.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(200).json({ status: 'error', message: 'حدث خطأ مؤقت، يرجى المحاولة لاحقًا.' });
  }
}
