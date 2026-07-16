// DIRBALK — /api/create-order
// Same-origin backend proxy for placing an order, forwarding to the same
// Google Apps Script (with action: "order").

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyfWm7URWsqiFrplKN16VXhOspTs2ZaqZaDf1Ol4ZXJ1R8uwtt27G6BgmMV7TwVXhDr/exec';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ status: 'error', message: 'Method not allowed' });
    return;
  }

  try {
    const payload = {
      action: 'order',
      name: (req.body?.name || '').toString(),
      email: (req.body?.email || '').toString(),
      phone: (req.body?.phone || '').toString(),
      city: (req.body?.city || '').toString(),
      address: (req.body?.address || '').toString(),
      locationLink: (req.body?.locationLink || '').toString(),
      items: (req.body?.items || '').toString(),
      total: (req.body?.total || 0).toString(),
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
