// DIRBALK — /api/admin-data
// Same-origin backend proxy for the admin dashboard, forwarding to the
// same Google Apps Script. Handles several request kinds so extra Vercel
// functions aren't needed (Hobby plan is capped at 12):
//   - default / no "kind": fetch dashboard data (action: "admin")
//   - kind: "updateOrderStatus": update an order's status, which may
//     trigger a shipping/delivered email on the backend (action: "updateOrderStatus")
//   - kind: "adminComments": fetch the pending (unapproved) comment queue
//     (action: "adminComments")
//   - kind: "moderateComment": approve/reject a pending comment
//     (action: "moderateComment")
//   - kind: "launchAnnouncement": send a batch of the launch-announcement
//     email (action: "launchAnnouncement")
// The Apps Script itself checks the secret key before doing anything either way.

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyfWm7URWsqiFrplKN16VXhOspTs2ZaqZaDf1Ol4ZXJ1R8uwtt27G6BgmMV7TwVXhDr/exec';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ status: 'error', message: 'Method not allowed' });
    return;
  }

  const kind = (req.body?.kind || '').toString();
  let payload;

  if (kind === 'updateOrderStatus') {
    payload = {
      action: 'updateOrderStatus',
      key: (req.body?.key || '').toString(),
      orderId: (req.body?.orderId || '').toString(),
      newStatus: (req.body?.newStatus || '').toString(),
    };
  } else if (kind === 'adminComments') {
    payload = {
      action: 'adminComments',
      key: (req.body?.key || '').toString(),
      status: (req.body?.status || 'pending').toString(),
    };
  } else if (kind === 'moderateComment') {
    payload = {
      action: 'moderateComment',
      key: (req.body?.key || '').toString(),
      commentId: (req.body?.commentId || '').toString(),
      decision: (req.body?.decision || '').toString(),
    };
  } else if (kind === 'launchAnnouncement') {
    payload = {
      action: 'launchAnnouncement',
      key: (req.body?.key || '').toString(),
      batchSize: parseInt(req.body?.batchSize, 10) || 100,
    };
  } else {
    payload = {
      action: 'admin',
      key: (req.body?.key || '').toString(),
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
