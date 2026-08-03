/* DIRBALK — assets/products.en.js
   English translation of products.js (single source of truth for Collection 01
   product data). Loaded by the /en/ versions of shop.html, product.html, and
   checkout.html instead of the Arabic file. Keep this in sync with
   products.js whenever product data changes — same ids, same image paths,
   same structure, translated copy only. */
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
    img: '/img/den-back.jpg',
    images: ['/img/den-back.jpg'],
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
    media: [
      { src: '/img/den-back.jpg', ratio: '45', caption: 'BACK' },
      { ratio: '45', caption: 'FRONT' },
      { ratio: '11', caption: 'DENIM MACRO' },
      { ratio: '11', caption: 'AMBER STITCH' },
      { ratio: '45', caption: 'HEM STACK' }
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
