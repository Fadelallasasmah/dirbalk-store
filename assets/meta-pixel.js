/* Meta Pixel for DIRBALK — dataset "DIRBALK Pixel" (971135982243168).
 * Loaded right after the GA4 gtag snippet on every public page.
 * It fires PageView, then mirrors the existing GA4 ecommerce events to Meta,
 * so no per-page Meta code is needed: wherever gtag('event', ...) already runs,
 * the matching Meta standard event runs too. */
(function () {
  var PIXEL_ID = '971135982243168';

  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');

  function contents(items) {
    return (items || []).map(function (i) {
      return { id: i.item_id, quantity: i.quantity || 1, item_price: i.price };
    });
  }

  function mirror(name, p) {
    p = p || {};
    var base = { currency: p.currency || 'JOD', value: p.value || 0 };
    if (p.items) {
      base.contents = contents(p.items);
      base.content_ids = base.contents.map(function (c) { return c.id; });
      base.content_type = 'product';
    }
    switch (name) {
      case 'view_item':      fbq('track', 'ViewContent', base); break;
      case 'add_to_cart':    fbq('track', 'AddToCart', base); break;
      case 'begin_checkout': fbq('track', 'InitiateCheckout', base); break;
      case 'add_shipping_info': fbq('track', 'AddPaymentInfo', base); break;
      case 'purchase':
        // eventID = order id, so a later server-side (CAPI) Purchase dedupes against this one
        fbq('track', 'Purchase', base, { eventID: p.transaction_id });
        break;
      case 'sign_up':        fbq('track', 'CompleteRegistration', { method: p.method }); break;
    }
  }

  var original = window.gtag;
  if (typeof original !== 'function') return;
  window.gtag = function () {
    try {
      if (arguments[0] === 'event') mirror(arguments[1], arguments[2]);
    } catch (e) { /* never let tracking break the page */ }
    return original.apply(this, arguments);
  };
})();
