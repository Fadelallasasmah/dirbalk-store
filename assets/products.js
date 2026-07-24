/* DIRBALK — assets/products.js
   Single source of truth for Collection 01 product data.
   Loaded by shop.html, product.html, and checkout.html — each page reads
   only the fields it needs from window.DIRBALK_PRODUCTS instead of keeping
   its own independent copy. Change a price/name/stock here once, not three
   times. (This file replaced three drifting local PRODUCTS arrays that had
   already gone out of sync with each other — see ARCHITECTURE.md ADR log.) */
window.DIRBALK_PRODUCTS = [
  {
    id: 'DB-TEE-01',
    img: '/img/tee-front.jpg',
    images: ['/img/tee-front.jpg', '/img/tee-back.jpg'],
    name: 'تيشيرت أوفرسايز',
    colorway: 'أبيض نقي',
    price: 22,
    desc: 'قماش قطن ثقيل 260 جرام، قصة أوفرسايز، بدون أي طباعة خارجية. تفاصيله كلها بالداخل.',
    story: 'قماش قطن ثقيل 260 جرام، قصة أوفرسايز، بدون أي طباعة خارجية. من برا، ولا شي. كل التفاصيل بالداخل — وهاد المقصود.',
    fit: ['قصة أوفرسايز واسعة', 'الطول لنص الفخذ تقريباً', 'الأكمام طويلة وعريضة'],
    care: ['100% قطن، 260 جرام/م²', 'غسيل بارد', 'لا تستخدم مبيض', 'تجفيف بحرارة منخفضة'],
    details: 'سطح نظيف بالكامل. في إشي مخبى بالقطعة — <span class="hint">رح تكتشفه لحالك</span>.',
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
    name: 'بنطلون دنيم واسع',
    colorway: 'إندجو خام 13oz',
    price: 50,
    desc: 'دنيم خام 13oz، أزرار وأسنان معدن فضي مطفي، خيط تطريز أمبر مخفي.',
    story: 'دنيم خام 13oz بقصة واسعة. أزرار وأسنان معدن فضي مطفي، وخيط تطريز أمبر مخفي بأماكن ما بتشوفها إلا إذا دورت.',
    fit: ['قصة واسعة (Wide-leg)', 'خصر عادي', 'طول كامل للكاحل'],
    care: ['دنيم خام 13oz، 100% قطن', 'أزرار وأسنان معدن فضي مطفي', 'خيط تطريز أمبر مخفي', 'اغسله لحاله أول مرة، ماء بارد'],
    details: 'الدنيم الخام بيتغير معك — كل لبسة بتترك أثرها. وفي تفاصيل مخفية بالقطعة <span class="hint">رح تكتشفها لحالك</span>.',
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
    name: 'جاكيت دنيم أوفرسايز',
    colorway: 'إندجو خام 13oz',
    price: 65,
    desc: 'دنيم خام 13oz، ستة أزرار أمامية، أزرار وأسنان فضية مطفية، قصة أوفرسايز.',
    story: 'دنيم خام 13oz بقصة أوفرسايز. ستة أزرار أمامية فضية مطفية. من برا هادي تماماً — القصة كلها بالتفاصيل الصغيرة.',
    fit: ['قصة أوفرسايز', 'ستة أزرار أمامية', 'الطول لمنتصف الحوض تقريباً'],
    care: ['دنيم خام 13oz، 100% قطن', 'أزرار معدن فضي مطفي', 'اغسله لحاله أول مرة، ماء بارد'],
    details: 'ستة أزرار، سطح نظيف، وشغلات مش مكتوبة بأي مكان. <span class="hint">افتح الجاكيت ودور</span>.',
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
