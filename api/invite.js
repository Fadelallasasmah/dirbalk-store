// DIRBALK — drop invite generation proxy (admin only; auth is the ADMIN_KEY checked in Apps Script)
// مهم: بدّل SCRIPT_URL بنفس القيمة الموجودة بـ api/waitlist.js عندك بالضبط
const SCRIPT_URL = 'PASTE_SAME_SCRIPT_URL_AS_IN_waitlist.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }
  try {
    const upstream = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'invite',
        key: (req.body && req.body.key) || '',
        emails: (req.body && req.body.emails) || [],
        sendEmails: req.body ? req.body.sendEmails !== false : true
      })
    });
    const data = await upstream.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(200).json({ status: 'error', message: 'حدث خطأ مؤقت، يرجى المحاولة لاحقًا.' });
  }
}
