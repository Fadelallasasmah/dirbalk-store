// DIRBALK — /api/login
// Same-origin backend proxy for sign-in, forwarding to the same Google Apps Script.
//   - kind: "link" → email a one-tap login link (action: "loginLink") — the
//     normal way in now that registration has no password
//   - kind: "code" → check the 6-digit code from that email (action: "verifyCode", v39)
//   - default      → legacy email + password login (action: "login")

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyfWm7URWsqiFrplKN16VXhOspTs2ZaqZaDf1Ol4ZXJ1R8uwtt27G6BgmMV7TwVXhDr/exec';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ status: 'error', message: 'Method not allowed' });
    return;
  }

  try {
    const kind = (req.body?.kind || '').toString();
    const payload = kind === 'code'
      ? { action: 'verifyCode', email: (req.body?.email || '').toString(), code: (req.body?.code || '').toString().slice(0, 12) }
      : kind === 'link'
      ? { action: 'loginLink', email: (req.body?.email || '').toString() }
      : {
          action: 'login',
          email: (req.body?.email || '').toString(),
          password: (req.body?.password || '').toString(),
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
