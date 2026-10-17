// DIRBALK — public read proxy (shares one Vercel function, Hobby cap = 12)
//   - kind: "stock"       → live stock per product / colour / size (action: "stock")
//   - kind: "status"      → drop switch state { dropOpen } (action: "siteStatus")
//   - kind: "getComments" → approved product comments
//   - kind: "scanInfo"    → order QR: status + items (contact only with a staff PIN)
//   - kind: "scan"        → order QR: move the order one step (staff PIN or customer)
//   - kind: "staffCheck"  → check a staff PIN when setting up a phone
//   - default             → passport public layer (legacy; Collection 01 has no passports)
// All public, unauthenticated, PII-free reads.
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyfWm7URWsqiFrplKN16VXhOspTs2ZaqZaDf1Ol4ZXJ1R8uwtt27G6BgmMV7TwVXhDr/exec';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }
  try {
    const kind = (req.body && req.body.kind) || '';
    const b = req.body || {};
    const str = (v) => (v == null ? '' : String(v)).slice(0, 200);
    const SCAN = kind === 'scanInfo' || kind === 'scan' || kind === 'staffCheck';
    const payload = SCAN
      ? { action: kind, orderId: str(b.orderId), token: str(b.token), role: str(b.role), pin: str(b.pin), target: str(b.target) }
      : kind === 'status'
      ? { action: 'siteStatus' }
      : kind === 'stock'
      ? { action: 'stock' }
      : kind === 'getComments'
        ? { action: 'getComments', product: (req.body && req.body.product) || '' }
        : { action: 'passport', slug: (req.body && req.body.slug) || '' };

    const upstream = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await upstream.json();
    res.setHeader('Cache-Control', SCAN ? 'no-store'
      : kind === 'stock' ? 's-maxage=15, stale-while-revalidate=30'
      : kind === 'status' ? 's-maxage=20, stale-while-revalidate=40'
      : 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(200).json({ status: 'error', message: 'حدث خطأ مؤقت، يرجى المحاولة لاحقًا.' });
  }
}
