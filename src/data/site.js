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
  pgRoom: '/images/projects/pg-hostel/room.webp',
  previous1: '/images/previous/township-1.webp',
  previous2: '/images/previous/township-2.webp',
}

/** smaller version of a project photo for cards / thumbnails (falls back to the original) */
export const sm = (path) =>
  path && /\/(kamala|svaadishta)\/(?!dining-hall)[^/]+\.webp$|pg-hostel\/exterior\.webp$/.test(path) ? path.replace('.webp', '-sm.webp') : path

// Fallback used by <Img> if any image fails to load
export const FALLBACK_IMG = PHOTOS.kamalaFront

export const SHOWREEL = { video: '/videos/interiors-reel.mp4', mobile: '/videos/interiors-reel-m.mp4', poster: '/videos/interiors-reel.jpg' }
export const FOUNDER = {
  photo: '/images/founder/founder.webp',
  role: 'Founder, Yashveer Constructions',
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
  { ...V('01-garden'), headline: ['Where neighbours', 'turn into', '*family*'] },
  { ...V('02-living'), headline: ['Rooms made', 'for *light*,', 'life & laughter'] },
  { ...V('03-amenities'), headline: ['Your weekends', 'start right', 'at the *doorstep*'] },
  { ...V('04-bedroom'), headline: ['Quiet rooms,', '*restful* nights,', 'built to last'] },
]

export const COMPANY = {
  name: 'Yashveer Constructions',
  short: 'Yashveer',
  legal: 'Yashveer Constructions Pvt. Ltd.',
  telugu: 'యష్ వీర్ కన్‌స్ట్రక్షన్స్ ప్రైవేట్ లిమిటెడ్',
  tagline: 'Creating spaces that endure',
  founded: 2020,
  experience: 14, // years the founder has been building
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
    slug: 'kamala-residency',
    name: 'Kamala Residency',
    type: 'Residential apartments',
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
    blurb: 'Fifty 2 and 3 BHK homes on Vijayawada’s 100 Feet Road, gathered around a landscaped courtyard.',
    stat: '50',
    statLabel: 'Families at home',
    facts: {
      Configuration: '2 & 3 BHK',
      Homes: '50 flats',
      Status: 'Completed',
      Address: '100 Feet Road, Kanuru, Tadigadapa',
    },
    highlights: ['50 homes · 2 & 3 BHK', 'Landscaped central courtyard', 'Bright, cross-lit interiors', 'Home of our head office'],
    overview: [
      'Kamala Residency is the project that defines us: fifty homes planned so that light reaches every room, with balconies that look into a landscaped courtyard rather than at a neighbour’s wall.',
      'We liked it enough to stay. Our head office is in Flat 501, so the people who built it see it every day.',
    ],
    address: ['100 Feet Road, Kanuru, Tadigadapa', 'Vijayawada, Andhra Pradesh 520007'],
    coords: '16.4959964,80.7009245',
    map: 'https://maps.app.goo.gl/WBnV8mJPAD2WEPPv9',
    plans: [],
  },
  {
    slug: 'isha-hospitals',
    name: 'Isha Hospitals',
    type: 'Healthcare building',
    category: 'Healthcare',
    lowRes: true, // photos are small: shown at their size over a blurred backdrop
    location: 'Guntur',
    city: 'Guntur',
    status: 'completed',
    cover: PHOTOS.ishaFront,
    gallery: [PHOTOS.ishaFront, PHOTOS.ishaWard, PHOTOS.ishaTower],
    heroImages: [PHOTOS.ishaFront, PHOTOS.ishaWard, PHOTOS.ishaTower],
    blurb: 'A premium hospital building in Guntur — clean, bright wards and a façade built to be recognised.',
    stat: '01',
    statLabel: 'Hospital building in Guntur',
    facts: {
      Type: 'Hospital',
      City: 'Guntur, Andhra Pradesh',
      Status: 'Completed · in operation',
    },
    highlights: ['Premium hospital building', 'Bright, easy-to-clean wards', 'In operation in Guntur'],
    overview: [
      'Hospitals are unforgiving buildings. Wards need light and air, corridors need to move patients quickly, and every surface has to stay clean for years.',
      'Isha Hospitals in Guntur was built with that in mind, and today it is open and serving patients.',
    ],
    address: ['Guntur', 'Andhra Pradesh'],
    coords: '16.2981387,80.4498858',
    map: 'https://maps.app.goo.gl/5Tu8CMvWbdkoQ7yeA',
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
export const PILLARS = [
  {
    title: 'Futuristic Designs',
    text: 'Plans that let light and air into every room, and façades that still look right in twenty years.',
    img: PHOTOS.kamalaFront,
  },
  {
    title: 'Thriving Communities',
    text: 'Courtyards and shared spaces placed so that neighbours actually meet.',
    img: PHOTOS.kamalaCourtyard,
  },
  {
    title: 'Appreciating Assets',
    text: 'Well-chosen locations and honest construction, so a Yashveer building only becomes more valuable.',
    img: PHOTOS.kamalaTower,
  },
  {
    title: 'Masterfully Crafted Spaces',
    text: 'Homes, hospitals and restaurants, finished with the same care, checked by the same people.',
    img: PHOTOS.kamalaBedroom,
  },
]

export const STATS = [
  { value: COMPANY.experience, suffix: '+', label: 'Years in construction' },
  { value: 50, suffix: '', label: 'Homes at Kamala Residency' },
  { value: 3, suffix: '', label: 'Landmark projects delivered' },
  { value: 2, suffix: '', label: 'States · AP & Telangana' },
]

export const PROCESS = [
  {
    title: 'Land & Approvals',
    text: 'Titles checked and approvals in place before a single brick is laid.',
    img: IMG.blueprint,
  },
  {
    title: 'Design & Engineering',
    text: 'Architects and structural engineers plan the building as one — light, air, structure and services together.',
    img: sm(PHOTOS.kamalaFacade),
  },
  {
    title: 'Construction',
    text: 'Our own site team, good materials and the founder on site — 14 years of habits that do not cut corners.',
    img: IMG.crane,
  },
  {
    title: 'Handover & Care',
    text: 'We hand over finished, clean spaces, and we stay reachable long after the keys change hands.',
    img: sm(PHOTOS.kamalaKitchen),
  },
]

export const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]
