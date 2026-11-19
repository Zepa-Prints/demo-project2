/* ------------------------------------------------------------------
   YASHVEER CONSTRUCTIONS — SITE CONTENT
   ------------------------------------------------------------------
   Everything editable lives in this file: company details, projects,
   photos, videos and copy.

   PHOTOS   public/images/projects/<project>/<name>.webp
            (each large photo also has a "-sm" version for cards)
   VIDEOS   public/videos/…  (hero clips have a "-m" vertical version for phones)
   ORIGINAL full-size photos/videos are kept in media-originals/ (not published)
------------------------------------------------------------------- */

// Unsplash helper: only used by a few generic "process" illustrations
export const unsplash = (id, w = 1600, h) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=80`

export const IMG = {
  blueprint: '1503387762-592deb58ef4e',
  crane: '1541888946425-d81bb19240f5',
  site: '1504307651254-35680f356dfd',
}

// Real project photos (public/images/projects)
const K = (n) => `/images/projects/kamala/${n}.webp`
const I = (n) => `/images/projects/isha/${n}.webp`
const S = (n) => `/images/projects/svaadishta/${n}.webp`
const R = (n) => `/images/projects/residence/${n}.webp`

export const PHOTOS = {
  kamalaFront: K('exterior-3'),
  kamalaCourtyard: K('courtyard'),
  kamalaBalconies: K('exterior-1'),
  kamalaFacade: K('exterior-2'),
  kamalaTower: K('exterior-4'),
  kamalaBedroom: K('bedroom-2'),
  kamalaBedroom2: K('bedroom-1'),
  kamalaKitchen: K('kitchen'),
  kamalaDining: K('dining'),
  kamalaBalcony: K('balcony'),
  ishaFront: I('exterior-2'),
  ishaTower: I('exterior'),
  ishaWard: I('ward'),
  svEntrance: S('entrance'),
  svFrontage: S('frontage'),
  svHall: S('dining-hall'),
  pgExterior: '/images/projects/pg-hostel/exterior.webp',
  // turnkey interiors — private residence (photos from media-originals/new-photos)
  resLiving: R('living-swing'),
  resLivingTv: R('living-tv'),
  resLivingSofa: R('living-sofa'),
  resLivingDining: R('living-dining'),
  resLivingWall: R('living-wall'),
  resDining: R('dining'),
  resDining2: R('dining-2'),
  resCrockery: R('crockery'),
  resPooja: R('pooja'),
  resKitchenIsland: R('kitchen-island'),
  resKitchen: R('kitchen'),
  resKitchen2: R('kitchen-2'),
  resBedroom: R('bedroom-1'),
  resBedroomTv: R('bedroom-tv'),
  resBedroom2: R('bedroom-2'),
  resBedroom3: R('bedroom-3'),
  resEntrance: R('entrance'),
  resVeena: R('veena-niche'),
  pgRoom: '/images/projects/pg-hostel/room.webp',
  previous1: '/images/previous/township-1.webp',
  previous2: '/images/previous/township-2.webp',
}

/** smaller version of a project photo for cards / thumbnails (falls back to the original) */
// (safe to call twice: an already-small path is returned unchanged)
export const sm = (path) =>
  path && !/-sm\.webp$/.test(path) && /\/(kamala|svaadishta)\/(?!dining-hall)[^/]+\.webp$|pg-hostel\/exterior\.webp$/.test(path)
    ? path.replace('.webp', '-sm.webp')
    : path

// Fallback used by <Img> if any image fails to load
export const FALLBACK_IMG = PHOTOS.kamalaFront

export const SHOWREEL = { video: '/videos/interiors-reel.mp4', mobile: '/videos/interiors-reel-m.mp4', poster: '/videos/interiors-reel.jpg' }
export const FOUNDER = {
  name: 'Veerendra Karla',
  photo: '/images/founder/founder.webp',
  role: 'Director, Yashveer Constructions',
}

// Work from the founder's years with another company — shown without names or locations
export const PREVIOUS_WORK = {
  images: [PHOTOS.previous1, PHOTOS.previous2],
  title: 'Before Yashveer',
}

export const FOUNDER_CLIP = {
  video: '/videos/founder.mp4',
  poster: '/videos/founder.jpg',
  full: 'https://drive.google.com/file/d/1910iKcUlhnq3CsZxncK7xkWgtvxu0h3q/view',
}

// Home page hero — 4 videos inside the WebGL polygon transition (public/videos/home/)
// `mobile` = vertical crop used on phones (same sharpness, a third of the pixels → smooth)
// `headline`: 3 lines shown over the video; wrap one word in *stars* for the yellow accent
const V = (n) => ({
  video: `/videos/home/${n}.mp4`,
  mobile: `/videos/home/${n}-m.mp4`,
  poster: `/videos/home/${n}.jpg`,
  posterMobile: `/videos/home/${n}-m.jpg`,
})
export const HOME_HERO_VIDEOS = [
  { ...V('01-garden'), headline: ['Your land.', 'Our build.', 'Your *keys*.'] },
  { ...V('02-living'), headline: ['Ideate, design,', '*build* — one', 'team, one contract'] },
  { ...V('03-amenities'), headline: ['Homes, hospitals', '& factories —', 'built *turnkey*'] },
  { ...V('04-bedroom'), headline: ['Finished to', 'the last *detail*,', 'ready to use'] },
]

export const COMPANY = {
  name: 'Yashveer Constructions',
  short: 'Yashveer',
  legal: 'Yashveer Constructions Pvt. Ltd.',
  telugu: 'యష్ వీర్ కన్‌స్ట్రక్షన్స్ ప్రైవేట్ లిమిటెడ్',
  tagline: 'Ideate · Design · Build',
  kind: 'Turnkey construction contractor',
  founded: 2020,
  experience: 15, // years of construction experience (shown as "15+")
  cin: '', // fill in to show in the footer
  gst: '', // fill in to show in the footer
  phone: '+91 906 361 8888',
  phoneHref: 'tel:+919063618888',
  whatsapp: 'https://wa.me/919063618888',
  email: 'yashveerconstructionspvtltd@gmail.com',
  offices: [
    {
      label: 'Vijayawada · Andhra Pradesh',
      lines: ['Flat No. 501, Kamala Residency', '100 Feet Road, Kanuru, Tadigadapa', 'Vijayawada, Andhra Pradesh 520007'],
      map: 'https://maps.app.goo.gl/WBnV8mJPAD2WEPPv9',
      coords: '16.4959964,80.7009245',
    },
    {
      label: 'Hyderabad · Telangana',
      lines: ['Flat No. 405, Infocity Eyrie Apartments', 'Kailashnagar, Chandanagar, Tirumalagiri', 'Hyderabad, Telangana 500050'],
      map: 'https://www.google.com/maps/search/?api=1&query=Infocity+Eyrie+Apartments+Chandanagar+Hyderabad',
      coords: 'Infocity Eyrie Apartments, Chandanagar, Hyderabad',
    },
  ],
  hours: 'Mon – Sat · 9:30 am – 7:00 pm',
  socials: [
    { label: 'Instagram', href: '#' },
    { label: 'Facebook', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'YouTube', href: '#' },
  ],
}
// first office = head office (used where a single address is shown)
COMPANY.address = ['Flat 501, Kamala Residency, 100 Feet Road, Kanuru', 'Vijayawada, Andhra Pradesh 520007']

export const STATUS = {
  completed: 'Completed',
  construction: 'Under construction',
}

/* ---------------- PROJECTS ----------------
   Only facts we know are listed. Add more keys to `facts` any time
   (e.g. 'Floors', 'Built-up area'), they show up automatically.
   `plans`: floor-plan images; the plan section only appears when there are some.
   `video`: optional clip for the project page.
------------------------------------------------------------------- */
export const PROJECTS = [
  {
    slug: 'residential-apartments-vijayawada',
    name: 'Residential Apartments',
    type: '90 flats · 2 & 3 BHK',
    category: 'Residential',
    location: 'Kanuru, Vijayawada',
    city: 'Vijayawada',
    status: 'completed',
    cover: PHOTOS.kamalaFront,
    gallery: [
      PHOTOS.kamalaFront,
      PHOTOS.kamalaCourtyard,
      PHOTOS.kamalaBedroom,
      PHOTOS.kamalaBalconies,
      PHOTOS.kamalaKitchen,
      PHOTOS.kamalaTower,
      PHOTOS.kamalaDining,
      PHOTOS.kamalaFacade,
      PHOTOS.kamalaBedroom2,
      PHOTOS.kamalaBalcony,
    ],
    heroImages: [PHOTOS.kamalaFront, PHOTOS.kamalaCourtyard, PHOTOS.kamalaBedroom, PHOTOS.kamalaKitchen],
    blurb: 'Ninety 2 and 3 BHK flats on Vijayawada’s 100 Feet Road, gathered around a landscaped courtyard.',
    stat: '90',
    statLabel: 'Families at home',
    facts: {
      Configuration: '2 & 3 BHK',
      Homes: '90 flats',
      Status: 'Completed',
      Address: '100 Feet Road, Kanuru, Tadigadapa',
    },
    highlights: ['90 flats · 2 & 3 BHK', 'Landscaped central courtyard', 'Bright, cross-lit interiors', 'Home of our head office'],
    overview: [
      'Our residential apartments in Vijayawada are the project that defines us: ninety homes planned so that light reaches every room, with balconies that look into a landscaped courtyard rather than at a neighbour’s wall.',
      'We liked it enough to stay. Our head office is in Flat 501, so the people who built it see it every day.',
    ],
    address: ['100 Feet Road, Kanuru, Tadigadapa', 'Vijayawada, Andhra Pradesh 520007'],
    coords: '16.4959964,80.7009245',
    map: 'https://maps.app.goo.gl/WBnV8mJPAD2WEPPv9',
    plans: [],
  },
  {
    slug: 'private-residence-interiors',
    name: 'Private Residence',
    type: 'Turnkey interiors',
    category: 'Residential',
    location: 'Private home',
    city: 'Private client',
    status: 'completed',
    cover: PHOTOS.resLiving,
    gallery: [
      PHOTOS.resLiving,
      PHOTOS.resLivingSofa,
      PHOTOS.resDining,
      PHOTOS.resPooja,
      PHOTOS.resKitchenIsland,
      PHOTOS.resCrockery,
      PHOTOS.resBedroom,
      PHOTOS.resLivingTv,
      PHOTOS.resKitchen,
      PHOTOS.resBedroom2,
      PHOTOS.resEntrance,
      PHOTOS.resBedroomTv,
      PHOTOS.resVeena,
      PHOTOS.resBedroom3,
    ],
    heroImages: [PHOTOS.resLiving, PHOTOS.resDining, PHOTOS.resKitchenIsland, PHOTOS.resBedroom],
    blurb: 'A complete home interior delivered turnkey — living, dining, pooja, kitchens and bedrooms, designed and finished by our team.',
    stat: '01',
    statLabel: 'Team, design to handover',
    facts: {
      Type: 'Turnkey home interiors',
      Scope: 'Living, dining, pooja, kitchens & bedrooms',
      Delivery: 'Design + build + fit-out',
      Status: 'Completed',
    },
    highlights: ['Swing-seat living room', 'Backlit stone & brass details', 'Island kitchen with full-height storage', 'Custom wardrobes & headboards'],
    overview: [
      'The owners handed us an empty apartment and a wish list. We designed every room, built every unit on site and handed it back ready to live in — furniture, lighting, kitchen and wardrobes included.',
      'Wood, stone and warm lighting run through the whole home: a swing seat in the living room, a carved pooja unit, a brass-lit crockery wall and an island kitchen built for a family that cooks.',
    ],
    address: null,
    coords: null,
    map: null,
    plans: [],
  },
  {
    slug: 'isha-hospitals',
    name: 'Isha Hospitals',
    type: 'Healthcare building',
    category: 'Healthcare',
    lowRes: true, // photos are small: shown at their size over a blurred backdrop
    location: 'Nandigama',
    city: 'Nandigama',
    status: 'completed',
    cover: PHOTOS.ishaFront,
    gallery: [PHOTOS.ishaFront, PHOTOS.ishaWard, PHOTOS.ishaTower],
    heroImages: [PHOTOS.ishaFront, PHOTOS.ishaWard, PHOTOS.ishaTower],
    blurb: 'A premium hospital building in Nandigama — clean, bright wards and a façade built to be recognised.',
    stat: '01',
    statLabel: 'Hospital building in Nandigama',
    facts: {
      Type: 'Hospital',
      City: 'Nandigama, Andhra Pradesh',
      Status: 'Completed · in operation',
    },
    highlights: ['Premium hospital building', 'Bright, easy-to-clean wards', 'In operation in Nandigama'],
    overview: [
      'Hospitals are unforgiving buildings. Wards need light and air, corridors need to move patients quickly, and every surface has to stay clean for years.',
      'Isha Hospitals in Nandigama was built with that in mind, and today it is open and serving patients.',
    ],
    address: ['Nandigama', 'Andhra Pradesh'],
    coords: 'Nandigama, Andhra Pradesh',
    map: 'https://www.google.com/maps/search/?api=1&query=Isha+Hospitals+Nandigama',
    plans: [],
  },
  {
    slug: 'svaadishta',
    name: 'Svaadishta',
    type: 'Restaurant',
    category: 'Hospitality',
    location: 'Kanuru, Vijayawada',
    city: 'Vijayawada',
    status: 'completed',
    cover: PHOTOS.svFrontage,
    gallery: [PHOTOS.svFrontage, PHOTOS.svHall, PHOTOS.svEntrance],
    heroImages: [PHOTOS.svFrontage, PHOTOS.svHall, PHOTOS.svEntrance],
    blurb: 'A neighbourhood restaurant at Kamayyathopu Centre — lantern-lit dining hall, garden frontage.',
    stat: '01',
    statLabel: 'Restaurant in Kanuru',
    facts: {
      Type: 'Restaurant',
      Address: 'Kamayyathopu Centre, NTR Marg',
      Status: 'Completed · open',
    },
    highlights: ['Garden frontage', 'Warm, lantern-lit dining hall', 'Open to everyone in Kanuru'],
    overview: [
      'Svaadishta is one of our favourite builds: a relaxed restaurant with a planted frontage and a wide dining hall under warm lanterns.',
      'Drop in for a meal — it is the easiest way to see how we finish a space.',
    ],
    address: ['Kamayyathopu Centre, NTR Marg, Kanuru', 'Vijayawada, Andhra Pradesh'],
    coords: '16.485441,80.6874128',
    map: 'https://maps.app.goo.gl/hTcbsjzcfHyVL57c9',
    plans: [],
  },
  {
    slug: 'pg-hostel-hyderabad',
    name: 'PG Hostel, Hyderabad',
    type: 'PG hostel · co-living',
    category: 'Co-living',
    location: 'Hyderabad',
    city: 'Hyderabad',
    status: 'construction',
    cover: PHOTOS.pgExterior,
    gallery: [PHOTOS.pgExterior, PHOTOS.pgRoom],
    heroImages: [PHOTOS.pgExterior, PHOTOS.pgRoom],
    blurb: 'Our first project in Telangana: a purpose-built PG hostel for students and young professionals.',
    stat: '01',
    statLabel: 'First project in Telangana',
    facts: {
      Type: 'PG hostel / co-living',
      City: 'Hyderabad, Telangana',
      Status: 'Under construction',
      'Floor plans': 'Coming soon',
    },
    highlights: ['Purpose-built for shared living', 'Bright, furnished shared rooms', 'First Yashveer project in Telangana', 'Floor plans coming soon'],
    overview: [
      'Construction is under way on our first Hyderabad project, a PG hostel designed from the ground up for comfortable shared living.',
      'The structure is up and the rooms are taking shape: bright, furnished shared rooms with their own study desks. Floor plans will be published here soon — register your interest below to hear first.',
    ],
    address: ['Hyderabad', 'Telangana'],
    coords: 'Chandanagar, Hyderabad',
    map: null,
    plans: [],
  },
]

export const getProject = (slug) => PROJECTS.find((p) => p.slug === slug)

/* ---------------- HOME CONTENT ---------------- */

export const STATS = [
  { value: COMPANY.experience, suffix: '+', label: 'Years in construction' },
  { value: 25, suffix: '', label: 'Point quality checks' },
  { value: 3, suffix: '', label: 'Sectors · residential, commercial, industrial' },
  { value: 500, suffix: '', label: 'Bed hospitals — the scale our team has built' },
]


export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'What we do', to: '/services' },
  { label: 'Projects', to: '/projects' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]
