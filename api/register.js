// DIRBALK — /api/register
// Same-origin backend proxy: browser -> this function -> Google Apps Script.
// This avoids CORS issues entirely (server-to-server calls aren't restricted by CORS),
// gives us the visitor's real IP + country from Vercel's own headers, and lets the
// browser read a real success/error response instead of guessing.

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbywquYqjI6OVJ4Ey1rAOLLo8hqwRmwV05WqS0P4zBHZIi9svFqVEnGMDXh-JmEeJW7AYA/exec';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ status: 'error', message: 'Method not allowed' });
    return;
  }

  try {
    const ip =
      (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      '';
    const country = req.headers['x-vercel-ip-country'] || '';

    const payload = {
      name: (req.body?.name || '').toString(),
      age: (req.body?.age || '').toString(),
      gender: (req.body?.gender || '').toString(),
      phone: (req.body?.phone || '').toString(),
      email: (req.body?.email || '').toString(),
      ip,
      country,
    };

    const scriptRes = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await scriptRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      data = { status: 'error', message: 'حدث خطأ مؤقت، يرجى المحاولة لاحقًا.' };
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(200).json({ status: 'error', message: 'حدث خطأ مؤقت، يرجى المحاولة لاحقًا.' });
  }
}
