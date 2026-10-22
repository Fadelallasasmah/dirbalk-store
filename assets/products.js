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
    desc: 'Heavy 260gsm cotton in an oversized cut. No print, nothing loud.',
    story: 'Heavy 260gsm cotton in an oversized cut. No print, nothing loud — a clean piece that holds its shape and gets softer every time you wear it.',
    fit: ['Wide, oversized cut', 'Falls to roughly mid-thigh', 'Long, wide sleeves'],
    fabric: '100% cotton, 260gsm',
    careIntro: 'You chose this one. Here\'s how to keep it with you for years.',
    care: [
      'Turn it inside out and wash it cold. The colour stays true and the cotton keeps its weight.',
      'No bleach, ever. It doesn\'t need it.',
      'Let it dry slowly: low heat, or on a hanger out of direct sun.',
      'If it needs ironing, do it inside out.'
    ],
    details: '',
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
    desc: '13oz raw denim, matte silver hardware and zipper teeth, amber stitching.',
    story: '13oz raw denim in a wide-leg cut, with matte silver hardware and zipper teeth and amber stitching.',
    fit: ['Wide-leg cut', 'Regular waist', 'Full length to the ankle'],
    fabric: '13oz raw denim, 100% cotton · matte silver hardware and zipper teeth · amber thread',
    careIntro: 'Raw denim remembers how you live in it. Give it time, and it becomes yours.',
    care: [
      'Wear it for a few weeks before the first wash. That\'s when it starts to take your shape.',
      'First wash: on its own, inside out, in cold water. Raw indigo lets go of some colour at the start.',
      'After that, wash it rarely and always inside out. Between wears, just let it air.',
      'Hang it to dry. No dryer: heat shrinks it and erases the fades you\'ve earned.',
      'Early on it can mark light fabrics and sofas. That settles with time.'
    ],
    details: 'Raw denim changes with you — every wear leaves its mark.',
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
    img: '/img/jac/front.jpg',
    images: ['/img/jac/front.jpg', '/img/jac/back.jpg', '/img/jac/side.jpg'],
    name: 'Oversized Denim Jacket',
    colorway: 'Raw Indigo 13oz',
    price: 65,
    desc: '13oz raw denim, six front buttons, matte silver hardware, oversized cut.',
    story: '13oz raw denim in an oversized cut. Six matte silver front buttons. Quiet, clean, and made to be worn for years.',
    fit: ['Oversized cut', 'Six front buttons', 'Falls to roughly mid-hip'],
    fabric: '13oz raw denim, 100% cotton · matte silver hardware',
    careIntro: 'This jacket gets better the longer it stays with you. Here\'s how to let it.',
    care: [
      'Wear it a lot before you wash it. The creases you give it are the point.',
      'First wash: on its own, inside out, buttons closed, in cold water.',
      'After that, wash it rarely. Between wears, hang it and let it air.',
      'Hang it to dry on a wide hanger so the shoulders keep their shape. No dryer.',
      'Early on it can mark light fabrics. That settles with time.'
    ],
    details: 'Six buttons, a clean surface, nothing loud.',
    swatch: '#2d3a52',
    silhouette: 'jacket',
    sizes: { S: 20, M: 60, L: 20 },
    // reference shoot — same 17 frames for every colour until each colour is photographed
    media: [
      { src: '/img/jac/front.jpg', ratio: '45', caption: 'FRONT' },
      { src: '/img/jac/side.jpg', ratio: '45', caption: 'SIDE' },
      { src: '/img/jac/back.jpg', ratio: '45', caption: 'BACK' },
      { src: '/img/jac/seated.jpg', ratio: '45', caption: 'SEATED' },
      { src: '/img/jac/flat-front.jpg', ratio: '45', caption: 'FLAT — FRONT' },
      { src: '/img/jac/flat-back.jpg', ratio: '45', caption: 'FLAT — BACK' },
      { src: '/img/jac/collar.jpg', ratio: '45', caption: 'COLLAR' },
      { src: '/img/jac/button.jpg', ratio: '45', caption: 'BUTTON' },
      { src: '/img/jac/pocket.jpg', ratio: '45', caption: 'CHEST POCKET' },
      { src: '/img/jac/cuff.jpg', ratio: '45', caption: 'CUFF' },
      { src: '/img/jac/hem.jpg', ratio: '45', caption: 'HEM' },
      { src: '/img/jac/inside.jpg', ratio: '45', caption: 'INSIDE' },
      { src: '/img/jac/fabric.jpg', ratio: '45', caption: '13OZ DENIM' },
      { src: '/img/jac/seam.jpg', ratio: '45', caption: 'SEAM' },
      { src: '/img/jac/hand-pocket.jpg', ratio: '45', caption: 'HAND POCKET' },
      { src: '/img/jac/patch.jpg', ratio: '45', caption: 'LEATHER PATCH' },
      { src: '/img/jac/folded.jpg', ratio: '45', caption: 'FOLDED' }
    ]
  }
];
