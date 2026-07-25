// DIRBALK — /api/create-order
// Same-origin backend proxy, forwarding to the same Google Apps Script.
// Handles two request kinds so a second Vercel function isn't needed:
//   - default / no "kind": place a real order (action: "order")
//   - kind: "logAbandonedCart": log a checkout-shipping-step candidate for
//     the abandoned-cart reminder system (action: "logAbandonedCart")
// v17 fix: forwards `lines` so the backend can assign specific pieces.
// v25: added the logAbandonedCart branch.

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyfWm7URWsqiFrplKN16VXhOspTs2ZaqZaDf1Ol4ZXJ1R8uwtt27G6BgmMV7TwVXhDr/exec';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ status: 'error', message: 'Method not allowed' });
    return;
  }

  const kind = (req.body?.kind || '').toString();
  let payload;

  if (kind === 'logAbandonedCart') {
    payload = {
      action: 'logAbandonedCart',
      name: (req.body?.name || '').toString(),
      email: (req.body?.email || '').toString(),
      phone: (req.body?.phone || '').toString(),
      items: (req.body?.items || '').toString(),
      total: parseFloat(req.body?.total) || 0,
    };
  } else {
    payload = {
      action: 'order',
      name: (req.body?.name || '').toString(),
      email: (req.body?.email || '').toString(),
      phone: (req.body?.phone || '').toString(),
      city: (req.body?.city || '').toString(),
      address: (req.body?.address || '').toString(),
      locationLink: (req.body?.locationLink || '').toString(),
      items: (req.body?.items || '').toString(),
      lines: Array.isArray(req.body?.lines) ? req.body.lines : [],
      total: parseFloat(req.body?.total) || 0,
    };
  }

  try {
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
