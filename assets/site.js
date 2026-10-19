/* DIRBALK — assets/site.js
   One header + footer for every page (except home.html).
   Put <div id="siteHeader"></div> at the top of <body> and
   <div id="siteFooter"></div> at the bottom; this file fills them.
   Change a link here once and it changes everywhere.

   Also: cart count, search bar (→ /shop.html?q=…), mobile menu,
   and DirbalkSite.cart helpers shared by shop / product / cart. */
(function () {
  var ICON = {
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 7h18M3 12h18M3 17h18"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M3 3h3l1 3"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>',
    tt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 3c.4 2.2 1.8 3.7 4 3.9v3.2c-1.5.1-2.8-.3-4-1.1v6.1c0 3.4-2.6 5.9-5.9 5.9S4.8 18.5 4.8 15.2c0-3.6 3.1-6.2 6.6-5.8v3.3c-1.6-.4-3.3.8-3.3 2.5 0 1.5 1.1 2.6 2.6 2.6 1.6 0 2.7-1.2 2.7-2.9V3h3.2z"/></svg>'
  };

  function loggedIn() { try { return localStorage.getItem('dirbalk_logged_in') === '1' && !!localStorage.getItem('dirbalk_session'); } catch (e) { return false; } } // v38: a login needs a server session

  /* ---------- cart helpers (one place for every page) ---------- */
  var CART_KEY = 'dirbalk_cart';
  var cart = {
    get: function () { try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch (e) { return []; } },
    set: function (c) { try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch (e) {} updateCount(); },
    count: function () { return cart.get().reduce(function (s, l) { return s + (l.qty || 0); }, 0); }
  };
  /* wishlist (saved on this device) */
  var WISH_KEY = 'dirbalk_wishlist';
  var wish = {
    get: function () { try { return JSON.parse(localStorage.getItem(WISH_KEY) || '[]'); } catch (e) { return []; } },
    has: function (id) { return wish.get().indexOf(id) !== -1; },
    toggle: function (id) {
      var w = wish.get(), i = w.indexOf(id);
      if (i === -1) w.push(id); else w.splice(i, 1);
      try { localStorage.setItem(WISH_KEY, JSON.stringify(w)); } catch (e) {}
      return i === -1;
    }
  };

  function updateCount() {
    var n = cart.count();
    Array.prototype.forEach.call(document.querySelectorAll('.sh-count'), function (b) {
      b.textContent = n; b.style.display = n > 0 ? 'flex' : 'none';
    });
  }

  function here(path) {
    var p = location.pathname;
    return p === path || p === path.replace('.html', '');
  }

  function header() {
    var el = document.getElementById('siteHeader');
    if (!el) return;
    var navLinks = [['/shop.html', 'Shop'], ['/about.html', 'About'], ['/story.html', 'Journal']];
    el.outerHTML =
      '<header class="sh">' +
        '<div class="sh-in">' +
          '<button type="button" class="sh-ic sh-menu" id="shMenu" aria-label="Menu" aria-expanded="false" aria-controls="sm">' + ICON.menu + '</button>' +
          '<a href="/home.html" class="sh-logo" aria-label="DIRBALK home"><img src="/logo.png" alt="DIRBALK"></a>' +
          '<nav class="sh-nav">' + navLinks.map(function (l) { return '<a href="' + l[0] + '"' + (here(l[0]) ? ' class="on"' : '') + '>' + l[1] + '</a>'; }).join('') + '</nav>' +
          '<div class="sh-right">' +
            '<button type="button" class="sh-ic" id="shSearch" aria-label="Search" aria-expanded="false" aria-controls="shSearchBar">' + ICON.search + '</button>' +
            '<a href="' + (loggedIn() ? '/me.html' : '/signin.html') + '" class="sh-ic acc" aria-label="Account">' + ICON.user + '</a>' +
            '<a href="/cart.html" class="sh-ic" aria-label="Cart">' + ICON.cart + '<span class="sh-count"></span></a>' +
          '</div>' +
        '</div>' +
        '<div class="search-bar" id="shSearchBar"><form action="/shop.html"><input name="q" placeholder="Search Collection 01…" aria-label="Search" autocomplete="off" value="' + esc(new URLSearchParams(location.search).get('q') || '') + '"><button class="btn ghost" type="submit">Search</button></form></div>' +
      '</header>' +
      '<div class="sm-ov" id="smOv"></div>' +
      '<aside class="sm" id="sm" aria-label="Menu">' +
        '<button type="button" class="x" id="smX" aria-label="Close">✕</button>' +
        '<nav>' +
          '<a href="/home.html">Home</a><a href="/shop.html">Shop</a><a href="/story.html">Journal</a><a href="/about.html">About</a>' +
          '<a href="/help.html">Help</a><a href="' + (loggedIn() ? '/me.html">My Account' : '/signin.html">Sign in') + '</a><a href="/cart.html">Cart</a>' +
        '</nav>' +
        '<p class="ar">دير بالك على حالك.</p>' +
      '</aside>';

    var sm = document.getElementById('sm'), ov = document.getElementById('smOv');
    var mb = document.getElementById('shMenu');
    function openM() {
      sm.classList.add('open'); ov.classList.add('open'); mb.setAttribute('aria-expanded', 'true');
      document.documentElement.style.overflow = 'hidden';
      setTimeout(function () { document.getElementById('smX').focus(); }, 30);
    }
    function closeM() {
      if (!sm.classList.contains('open')) return;
      sm.classList.remove('open'); ov.classList.remove('open'); mb.setAttribute('aria-expanded', 'false');
      document.documentElement.style.overflow = '';
      mb.focus();
    }
    document.getElementById('shMenu').addEventListener('click', openM);
    document.getElementById('smX').addEventListener('click', closeM);
    ov.addEventListener('click', closeM);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeM(); });
    document.getElementById('shSearch').addEventListener('click', function () {
      var bar = document.getElementById('shSearchBar');
      bar.classList.toggle('open');
      this.setAttribute('aria-expanded', bar.classList.contains('open') ? 'true' : 'false');
      if (bar.classList.contains('open')) bar.querySelector('input').focus();
    });
  }

  function footer() {
    var el = document.getElementById('siteFooter');
    if (!el) return;
    el.outerHTML =
      '<footer class="sf">' +
        '<div class="sf-brand"><img src="/logo.png" alt="DIRBALK"><span class="ar">دير بالك على حالك.</span></div>' +
        '<nav><a href="/shop.html">Shop</a><a href="/story.html">Journal</a><a href="/about.html">About</a><a href="/help.html#shipping">Shipping</a><a href="/help.html#returns">Returns</a><a href="/help.html#faq">FAQ</a><a href="/help.html#contact">Contact</a><a href="/legal.html">Terms &amp; Privacy</a></nav>' +
        '<div class="sf-social"><a href="https://instagram.com/dirbalk__" target="_blank" rel="noreferrer" aria-label="Instagram">' + ICON.ig + '</a><a href="https://www.tiktok.com/@dirbalk__" target="_blank" rel="noreferrer" aria-label="TikTok">' + ICON.tt + '</a></div>' +
        '<span class="sf-city">Amman, Jordan · © 2026</span>' +
      '</footer>';
  }

  /* ---------- product drawing helpers ---------- */
  function silhouette(type, tint) {
    var stroke = 'rgba(128,128,128,0.35)';
    var d = type === 'jacket'
      ? 'M60 30 L80 20 L100 32 L120 20 L140 30 L155 60 L138 78 L128 62 L128 190 L72 190 L72 62 L62 78 L45 60 Z'
      : type === 'pants'
        ? 'M75 20 L125 20 L130 60 L150 195 L120 195 L102 90 L98 90 L80 195 L50 195 L70 60 Z'
        : 'M70 30 L100 22 L130 30 L155 55 L138 72 L128 60 L128 190 L72 190 L72 60 L62 72 L45 55 Z';
    return '<svg class="sil" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg"><path d="' + d + '" fill="' + tint + '" stroke="' + stroke + '" stroke-width="1.5"/></svg>';
  }
  /* image for a product in a colour, or its silhouette in that colour */
  function thumb(p, key, eager) {
    var CAT = window.DirbalkCatalog;
    var src = CAT ? CAT.lineImage(p, key) : (p.img || '');
    if (src) return '<img src="' + src + '" alt="' + p.name + '" loading="' + (eager ? 'eager' : 'lazy') + '">';
    return silhouette(p.silhouette, CAT ? CAT.swatch(p, key) : (p.swatch || '#333'));
  }
  function find(id) {
    var list = window.DIRBALK_PRODUCTS || [];
    id = String(id || '').toUpperCase();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  var TYPE = { 'DB-TEE-01': 'tees', 'DB-DEN-01': 'pants', 'DB-JAC-01': 'jackets' };

  var HEART = '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';

  /* product card used by the shop grid and "you may also like" */
  function card(p, key) {
    var CAT = window.DirbalkCatalog;
    key = CAT.color(p, key || CAT.defaultKey(p)).key;
    var imgs = CAT.images(p, key);
    var href = '/product.html?id=' + p.id + '&c=' + key;
    var media = imgs.length
      ? '<img src="' + imgs[0] + '" alt="' + esc(p.name + ' — ' + CAT.colorName(p, key)) + '" loading="lazy">' +
        (imgs[1] ? '<img class="alt" src="' + imgs[1] + '" alt="" loading="lazy">' : '')
      : silhouette(p.silhouette, CAT.swatch(p, key));
    var sizes = CAT.sizes(p, key);
    var sold = CAT.totalStock(p, key) === 0;
    return '<article class="pcard" data-id="' + p.id + '" data-color="' + key + '">' +
      '<a class="ph" href="' + href + '">' + media + (sold ? '<span class="badge">Sold out</span>' : '') + '</a>' +
      '<button type="button" class="wish' + (wish.has(p.id) ? ' on' : '') + '" aria-label="Save to wishlist">' + HEART + '</button>' +
      '<div class="meta">' +
        '<a class="name" href="' + href + '">' + esc(p.name) + '</a>' +
        '<span class="price">' + p.price + ' JD</span>' +
        '<span class="cname">' + esc(CAT.colorName(p, key)) + '</span>' +
        CAT.swatchesHtml(p, key) +
        '<div class="sizes">' + Object.keys(sizes).map(function (s) { return '<span' + (sizes[s] ? '' : ' class="out"') + '>' + s + '</span>'; }).join('') + '</div>' +
      '</div>' +
    '</article>';
  }
  /* colour circles + heart inside any container of cards */
  function bindCards(root) {
    root.addEventListener('click', function (e) {
      var sw = e.target.closest('.pcard .swatch');
      if (sw) {
        var c = sw.closest('.pcard'), p = find(c.getAttribute('data-id'));
        if (p) c.outerHTML = card(p, sw.getAttribute('data-color'));
        return;
      }
      var h = e.target.closest('.pcard .wish');
      if (h) {
        var id = h.closest('.pcard').getAttribute('data-id');
        var on = wish.toggle(id);
        h.classList.toggle('on', on);
        if (window.DirbalkToast) DirbalkToast.info(on ? 'Saved to your wishlist' : 'Removed from your wishlist');
      }
    });
  }

  window.DirbalkSite = { cart: cart, wish: wish, updateCount: updateCount, loggedIn: loggedIn,
    silhouette: silhouette, thumb: thumb, find: find, esc: esc, card: card, bindCards: bindCards, heart: HEART,
    type: function (p) { return TYPE[p.id] || ''; } };

  function init() {
    header(); footer(); updateCount();
    /* ?search=1 (from the homepage) opens the search bar */
    if (/[?&]search=1/.test(location.search)) {
      var bar = document.getElementById('shSearchBar');
      if (bar) { bar.classList.add('open'); bar.querySelector('input').focus(); }
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.addEventListener('storage', updateCount);
})();
