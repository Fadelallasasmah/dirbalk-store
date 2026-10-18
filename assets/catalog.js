/* DIRBALK — assets/catalog.js
   Colour variants for Collection 01, layered on top of products.js /
   products.en.js (load this file right AFTER the products file).

   - Jacket + pants: black / blue / indigo.  Tee: black / white / grey.
   - Each colour has its own images + its own S/M/L stock.
   - A colour with no photos yet falls back to the silhouette tinted in
     that colour, so a new colour can go live before its shoot.
   - Live stock comes from the backend (Stock sheet) via /api/passport
     {kind:'stock'}; the static numbers below are only a fallback.
   - Cart lines are { id, color, size, qty }. Old lines without a colour
     are treated as the product's default colour. */
(function () {
  var EN = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var DEFAULT_SIZES = function () { return { S: 16, M: 48, L: 16 }; };

  var NAMES = {
    black:  EN ? 'Black'  : 'أسود',
    blue:   EN ? 'Blue'   : 'أزرق',
    indigo: EN ? 'Indigo' : 'إنديغو',
    white:  EN ? 'White'  : 'أبيض',
    grey:   EN ? 'Grey'   : 'رمادي'
  };
  var SWATCH = {
    black: '#151515', blue: '#3d5a80', indigo: '#1f2a44', white: '#f2f0ea', grey: '#8a8d91'
  };

  /* order = order of the circles under each product (left→right in reading order) */
  var VARIANTS = {
    'DB-JAC-01': { order: ['black', 'blue', 'indigo'], def: 'indigo', photos: { black: true, blue: true, indigo: true } }, // reference photos on every colour for now
    'DB-DEN-01': { order: ['black', 'blue', 'indigo'], def: 'indigo', photos: { black: true, blue: true, indigo: true } }, // reference photos on every colour for now
    'DB-TEE-01': { order: ['black', 'white', 'grey'],  def: 'white',  photos: { white: true } }
  };

  var PRODUCTS = window.DIRBALK_PRODUCTS || [];

  PRODUCTS.forEach(function (p) {
    var v = VARIANTS[p.id];
    if (!v) return;
    p.defaultColor = v.def;
    p.colors = v.order.map(function (key) {
      var hasPhotos = !!v.photos[key];
      return {
        key: key,
        name: NAMES[key],
        swatch: SWATCH[key],
        images: hasPhotos ? (p.images || (p.img ? [p.img] : [])).slice() : [],
        /* PDP media: real photos for the photographed colour; for the
           others, the same frames/captions drawn as tinted silhouettes */
        media: (p.media || []).map(function (m) {
          return hasPhotos ? m : { ratio: m.ratio, caption: m.caption };
        }),
        sizes: DEFAULT_SIZES()
      };
    });
  });

  function find(id) {
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i];
    return null;
  }

  var C = {
    names: NAMES,

    colors: function (p) { return (p && p.colors) || []; },

    defaultKey: function (p) { return (p && p.defaultColor) || ((p && p.colors && p.colors[0]) ? p.colors[0].key : ''); },

    color: function (p, key) {
      var list = C.colors(p);
      for (var i = 0; i < list.length; i++) if (list[i].key === key) return list[i];
      var d = C.defaultKey(p);
      for (var j = 0; j < list.length; j++) if (list[j].key === d) return list[j];
      return list[0] || null;
    },

    images: function (p, key) { var c = C.color(p, key); return c ? c.images : (p.images || []); },
    media: function (p, key) { var c = C.color(p, key); return c ? c.media : (p.media || []); },
    swatch: function (p, key) { var c = C.color(p, key); return c ? c.swatch : p.swatch; },
    colorName: function (p, key) { var c = C.color(p, key); return c ? c.name : (p.colorway || ''); },
    sizes: function (p, key) { var c = C.color(p, key); return c ? c.sizes : (p.sizes || {}); },

    stock: function (p, key, size) { return C.sizes(p, key)[size] || 0; },

    totalStock: function (p, key) {
      var s = C.sizes(p, key), t = 0;
      for (var k in s) t += s[k];
      return t;
    },

    /* every colour of a product sold out? */
    productSoldOut: function (p) {
      var list = C.colors(p);
      if (!list.length) return false;
      for (var i = 0; i < list.length; i++) if (C.totalStock(p, list[i].key) > 0) return false;
      return true;
    },

    /* first image for a cart line, or '' → caller draws silhouette */
    lineImage: function (p, key) { var imgs = C.images(p, key); return imgs.length ? imgs[0] : ''; },

    /* normalise a cart line in place (old lines had no colour) */
    normLine: function (line) {
      if (!line.color) { var p = find(line.id); line.color = p ? C.defaultKey(p) : ''; }
      return line;
    },

    swatchesHtml: function (p, selectedKey, extraClass) {
      return '<div class="swatches' + (extraClass ? ' ' + extraClass : '') + '" role="radiogroup" aria-label="' + (EN ? 'Colour' : 'اللون') + '">' +
        C.colors(p).map(function (c) {
          var out = C.totalStock(p, c.key) === 0;
          return '<button type="button" class="swatch' + (c.key === selectedKey ? ' selected' : '') + (out ? ' out' : '') +
            '" data-color="' + c.key + '" role="radio" aria-checked="' + (c.key === selectedKey) + '" aria-label="' + c.name + '" title="' + c.name +
            '" style="--sw:' + c.swatch + '"></button>';
        }).join('') +
        '</div>';
    },

    /* live stock from the backend. Resolves either way — on failure the
       static fallback numbers stay in place. */
    loadStock: function () {
      return fetch('/api/passport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'stock' })
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res || res.status !== 'success' || !res.stock) return false;
          PRODUCTS.forEach(function (p) {
            var byColor = res.stock[p.id];
            if (!byColor) return;
            C.colors(p).forEach(function (c) {
              var s = byColor[c.key];
              c.sizes = { S: 0, M: 0, L: 0 };
              if (s) for (var sz in s) c.sizes[sz] = parseInt(s[sz], 10) || 0;
            });
          });
          return true;
        })
        .catch(function () { return false; });
    }
  };

  /* shared swatch styles (injected once) */
  var css =
    '.swatches{display:flex;gap:10px;align-items:center;margin:10px 0 2px;}' +
    '.swatch{width:18px;height:18px;border-radius:50%;padding:0;cursor:pointer;background:var(--sw);' +
    'border:1px solid rgba(255,255,255,0.28);box-shadow:0 0 0 2px transparent;transition:box-shadow .2s,transform .2s;position:relative;}' +
    '.swatch:hover{transform:scale(1.08);}' +
    '.swatch.selected{box-shadow:0 0 0 2px #0a0a0a,0 0 0 3px #C9A84C;}' +
    '[data-theme="day"] .swatch.selected{box-shadow:0 0 0 2px #171310,0 0 0 3px #C9A84C;}' +
    '.swatch.out::after{content:"";position:absolute;left:50%;top:-2px;bottom:-2px;width:1px;background:rgba(201,168,76,0.9);transform:rotate(45deg);}' +
    '.swatches.lg .swatch{width:26px;height:26px;}' +
    '.swatch-name{font-size:11px;opacity:.6;margin-inline-start:4px;}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  window.DirbalkCatalog = C;
})();
