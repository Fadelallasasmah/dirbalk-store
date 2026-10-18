/* DIRBALK — assets/products.js
   Single source of truth for Collection 01 product data (the site is
   English-only). Loaded by shop.html, product.html, and checkout.html.
   Colours / per-colour stock are layered on top by assets/catalog.js. */
window.DIRBALK_PRODUCTS = [
  {
    id: 'DB-TEE-01',
    img: '/img/tee-front.jpg',
    images: ['/img/tee-front.jpg', '/img/tee-back.jpg'],
    name: 'Oversized T-Shirt',
    colorway: 'Pure White',
    price: 22,
    desc: 'Heavy 260gsm cotton, oversized cut, no external print. All the detail is on the inside.',
    story: 'Heavy 260gsm cotton, oversized cut, no external print. Clean from the outside, nothing. All the detail is on the inside — that\'s the point.',
    fit: ['Wide, oversized cut', 'Falls to roughly mid-thigh', 'Long, wide sleeves'],
    care: ['100% cotton, 260 gsm', 'Cold wash', 'Do not bleach', 'Low heat dry'],
    details: 'Completely clean surface. There\'s something hidden on this piece — <span class="hint">you\'ll find it yourself</span>.',
    swatch: '#f2f0ea',
    silhouette: 'tee',
    sizes: { S: 20, M: 60, L: 20 },
    media: [
      { src: '/img/tee-front.jpg', ratio: '11', caption: 'FRONT' },
      { src: '/img/tee-back.jpg', ratio: '11', caption: 'BACK' },
      { ratio: '11', caption: 'FABRIC 260 GSM' },
      { ratio: '11', caption: 'COLLAR SEAM' },
      { ratio: '45', caption: 'FOLDED' }
    ]
  },
  {
    id: 'DB-DEN-01',
    img: '/img/den/front.jpg',
    images: ['/img/den/front.jpg', '/img/den/back.jpg', '/img/den/side.jpg'],
    name: 'Wide-Leg Denim Pants',
    colorway: 'Raw Indigo 13oz',
    price: 50,
    desc: '13oz raw denim, matte silver hardware and zipper teeth, hidden amber embroidery thread.',
    story: '13oz raw denim in a wide-leg cut. Matte silver hardware and zipper teeth, with hidden amber embroidery thread in places you won\'t see unless you look.',
    fit: ['Wide-leg cut', 'Regular waist', 'Full length to the ankle'],
    care: ['13oz raw denim, 100% cotton', 'Matte silver hardware and zipper teeth', 'Hidden amber embroidery thread', 'Wash alone the first time, cold water'],
    details: 'Raw denim changes with you — every wear leaves its mark. There are hidden details on this piece <span class="hint">you\'ll find them yourself</span>.',
    swatch: '#3a4a63',
    silhouette: 'pants',
    sizes: { S: 20, M: 60, L: 20 },
    // reference shoot — same 17 frames for every colour until each colour is photographed
    media: [
      { src: '/img/den/front.jpg', ratio: '45', caption: 'FRONT' },
      { src: '/img/den/side.jpg', ratio: '45', caption: 'SIDE' },
      { src: '/img/den/back.jpg', ratio: '45', caption: 'BACK' },
      { src: '/img/den/walk.jpg', ratio: '45', caption: 'ON THE MOVE' },
      { src: '/img/den/flat-front.jpg', ratio: '45', caption: 'FLAT — FRONT' },
      { src: '/img/den/flat-back.jpg', ratio: '45', caption: 'FLAT — BACK' },
      { src: '/img/den/pocket.jpg', ratio: '45', caption: 'FRONT POCKET' },
      { src: '/img/den/button.jpg', ratio: '45', caption: 'BUTTON' },
      { src: '/img/den/zip.jpg', ratio: '45', caption: 'ZIPPER' },
      { src: '/img/den/back-pocket.jpg', ratio: '45', caption: 'BACK POCKET' },
      { src: '/img/den/patch.jpg', ratio: '45', caption: 'LEATHER PATCH' },
      { src: '/img/den/inside.jpg', ratio: '45', caption: 'INSIDE' },
      { src: '/img/den/fabric.jpg', ratio: '45', caption: '13OZ DENIM' },
      { src: '/img/den/hem-twill.jpg', ratio: '45', caption: 'TWILL' },
      { src: '/img/den/hem.jpg', ratio: '45', caption: 'HEM' },
      { src: '/img/den/on-foot.jpg', ratio: '45', caption: 'ON FOOT' },
      { src: '/img/den/folded.jpg', ratio: '45', caption: 'FOLDED' }
    ]
  },
  {
    id: 'DB-JAC-01',
    img: '/img/jac-front.jpg',
    images: ['/img/jac-front.jpg', '/img/jac-back.jpg', '/img/jac-side.jpg'],
    name: 'Oversized Denim Jacket',
    colorway: 'Raw Indigo 13oz',
    price: 65,
    desc: '13oz raw denim, six front buttons, matte silver hardware, oversized cut.',
    story: '13oz raw denim in an oversized cut. Six matte silver front buttons. Quiet from the outside — the whole story is in the small details.',
    fit: ['Oversized cut', 'Six front buttons', 'Falls to roughly mid-hip'],
    care: ['13oz raw denim, 100% cotton', 'Matte silver hardware', 'Wash alone the first time, cold water'],
    details: 'Six buttons, a clean surface, and things that aren\'t written down anywhere. <span class="hint">Open the jacket and look around</span>.',
    swatch: '#2d3a52',
    silhouette: 'jacket',
    sizes: { S: 20, M: 60, L: 20 },
    media: [
      { src: '/img/jac-front.jpg', ratio: '45', caption: 'FRONT' },
      { src: '/img/jac-back.jpg', ratio: '45', caption: 'BACK' },
      { src: '/img/jac-side.jpg', ratio: '45', caption: 'SIDE' },
      { ratio: '11', caption: 'BUTTON MACRO' },
      { ratio: '11', caption: 'CUFF DETAIL' },
      { ratio: '45', caption: 'OPEN / INTERIOR' }
    ]
  }
];
