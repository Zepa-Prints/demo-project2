/* ------------------------------------------------------------------
   TURNKEY CONTENT — what we do, how we work, packages, quality, team.
   All copy for the turnkey sections lives here (from the client's
   website script). Edit freely; the sections update automatically.
------------------------------------------------------------------- */
import { IMG, PHOTOS, FOUNDER, sm, unsplash } from './site'

export const TAGLINE = 'Ideate · Design · Build'

export const TURNKEY_DEFINITION =
  'A turnkey project is one where a single contractor handles every stage — from the first design to the final handover — so the client simply “turns the key” and starts using the property.'

/* ---------- What we do: the three kinds of projects ---------- */
export const SECTORS = [
  {
    key: 'residential',
    title: 'Residential',
    img: sm(PHOTOS.kamalaFront),
    text: 'Real-estate developments with all amenities, independent houses, villas and flats — delivered fully ready for living.',
    points: ['Civil structure', 'Flooring & finishes', 'Plumbing & electrical wiring', 'Interior fittings'],
  },
  {
    key: 'commercial',
    title: 'Commercial',
    img: sm(PHOTOS.svFrontage),
    text: 'Office spaces, hospitals, restaurants (F&B), retail shops and corporate fit-outs — handed over ready to open.',
    points: ['HVAC & lighting', 'Workstations & fit-outs', 'Hospitals & clinics', 'Restaurants & mega kitchens'],
  },
  {
    key: 'industrial',
    title: 'Industrial & Pharma',
    img: unsplash('1586528116311-ad8dd3c8310d', 1100),
    text: 'Warehouses, factories, cleanrooms and manufacturing plants — built with machinery installation in mind.',
    points: ['Utility piping', 'Machinery installation', 'Cleanrooms', 'Regulatory compliance (GMP)'],
  },
]

/* ---------- Why turnkey (shown as the hover rows) ---------- */
export const BENEFITS = [
  {
    title: 'Single-point accountability',
    text: 'One contractor manages planning, engineering, procurement, civil, mechanical, electrical, plumbing and finishes.',
    img: sm(PHOTOS.kamalaFacade),
  },
  {
    title: 'Fixed, upfront pricing',
    text: 'Costs are agreed at the start, so the budget does not quietly grow as the building does.',
    img: IMG.blueprint,
  },
  {
    title: 'Time savings',
    text: 'Design and construction overlap because one team directs the whole workflow.',
    img: IMG.crane,
  },
  {
    title: 'Fewer disputes',
    text: 'No finger-pointing between separate architects, suppliers and builders — it is all one team.',
    img: sm(PHOTOS.kamalaCourtyard),
  },
  {
    title: 'Less stress for owners',
    text: 'Ideal for busy professionals and NRI clients who cannot supervise the site every day.',
    img: sm(PHOTOS.kamalaBedroom),
  },
  {
    title: 'Streamlined approvals',
    text: 'We coordinate municipal plans and standard clearances on your behalf.',
    img: sm(PHOTOS.kamalaTower),
  },
]

/* ---------- How we operate: Ideate → Design → Build ---------- */
export const STAGES = [
  {
    title: 'Ideate',
    text: 'Tell us what you are planning — residential, commercial or industrial — and where. We help you understand estimated costs and what a fair contractor agreement should cover.',
    img: IMG.blueprint,
    points: ['Your project type', 'Your location / city', 'Estimated costs', 'Agreement guidance'],
  },
  {
    title: 'Design',
    text: 'Architects, structural engineers and 3D visualisers design it with you, in one of three packages.',
    img: sm(PHOTOS.kamalaFacade),
    points: ['Concept design', 'Construction design', 'Complete project design'],
  },
  {
    title: 'Build',
    text: 'Choose how much we take on — from skilled manpower to a complete, end-to-end build with materials.',
    img: IMG.crane,
    points: ['Manpower contract', 'Civil, MEP & fit-outs', 'End-to-end with materials'],
  },
  {
    title: 'Assure & hand over',
    text: 'A predefined BOQ, 25-point quality checks and a monthly project health card — then you turn the key.',
    img: sm(PHOTOS.kamalaKitchen),
    points: ['Predefined BOQ', '25-point quality checks', 'Monthly health card'],
  },
]

/* ---------- Packages ---------- */
export const DESIGN_PACKAGES = [
  {
    name: 'Concept design',
    tag: 'Visualise your project',
    items: ['Scheme drawings — all floors (2D)', 'Elevation design (3D)', 'Initial site assessment', 'Construction estimate'],
  },
  {
    name: 'Construction design',
    tag: 'Ready for the site',
    featured: true,
    items: [
      'Everything in Concept design',
      'Structural drawings',
      'Elevation detail drawings (2D)',
      'Working drawings — all floors',
      'Electrical & plumbing drawings',
    ],
  },
  {
    name: 'Complete project design',
    tag: 'Architecture + interiors',
    items: ['Everything in Construction design', 'Interior views — all rooms (3D)', 'Interior detailing — all rooms (2D)'],
  },
]

export const BUILD_PACKAGES = [
  {
    name: 'Manpower contract',
    tag: 'Our people, your materials',
    items: ['Skilled site workforce', 'Site supervision', 'Work to approved drawings'],
  },
  {
    name: 'Manpower — Civil, MEP & fit-outs',
    tag: 'Every trade, one team',
    items: ['Civil works', 'Mechanical, electrical & plumbing', 'Fit-outs & finishes', 'All trades coordinated by us'],
  },
  {
    name: 'End-to-end with materials',
    tag: 'The complete turnkey',
    featured: true,
    items: ['Packages 1 & 2 included', 'All materials procured by us', 'Predefined BOQ & fixed pricing', 'Handover ready to use'],
  },
]

/* ---------- Working methodology & assurance ---------- */
export const ASSURANCE = [
  {
    title: 'Predefined BOQ',
    text: 'Before work starts you get the bill of quantities: estimated quantities, material rates and the exact specifications we will use.',
  },
  {
    title: '25-point quality checks',
    text: 'Twenty-five documented checks, during construction and after it, before anything is covered up or handed over.',
  },
  {
    title: 'Project monitoring',
    text: 'Progress is tracked against a predefined schedule, and you receive a project health card every month.',
  },
]

/* ---------- The 25-point quality checks (3 stages) ---------- */
export const QUALITY_STAGES = [
  {
    title: 'Before work begins',
    checks: [
      ['Approved drawings on site', 'Latest architectural, structural, electrical and plumbing drawings.'],
      ['Site measurements', 'Plot dimensions, levels, boundaries and setting-out points.'],
      ['Specifications reviewed', 'Materials, workmanship, methods and standards agreed.'],
      ['Materials inspected', 'Cement, steel, aggregates, blocks, tiles and pipes match the spec.'],
      ['Material storage', 'Protected from moisture, contamination and damage.'],
      ['Workforce briefed', 'Every crew knows the method and the quality expected.'],
      ['Inspection checkpoints set', 'Stages that need sign-off before the next one begins.'],
      ['Excavation & foundations', 'Dimensions, soil, levels and preparation before concrete.'],
    ],
  },
  {
    title: 'During construction',
    checks: [
      ['Reinforcement steel', 'Bar size, spacing, laps and concrete cover per drawings.'],
      ['Formwork & shuttering', 'Alignment, level, bracing and sealed joints.'],
      ['Embedded services', 'Conduits, sleeves and openings placed before the pour.'],
      ['Concrete mix', 'Approved grade and mix, every pour.'],
      ['Workability tests', 'Slump tests where the specification calls for them.'],
      ['Placement & compaction', 'No voids, no honeycombing.'],
      ['Curing', 'Specified method and duration for full strength.'],
      ['Masonry', 'Bonding, line, level, plumb and joint thickness.'],
      ['Plastering', 'Thickness, line and level; no hollowness or cracks.'],
      ['Waterproofing tested', 'Bathrooms, terraces and balconies tested before tiling.'],
      ['Plumbing pressure-tested', 'Routing, joints and slopes checked before concealment.'],
      ['Electrical inspected', 'Conduits, wiring, boards and earthing against drawings.'],
      ['Non-conformities closed', 'Defects recorded, fixed and re-inspected — never covered up.'],
    ],
  },
  {
    title: 'Before handover',
    checks: [
      ['Finished surfaces', 'Flooring, tiles, paint, ceilings, doors and windows.'],
      ['Function & dimensions', 'Doors, drainage, fixtures and finished levels all work.'],
      ['Snagging & rectification', 'Room-by-room snag list, every item closed.'],
      ['Final inspection & documents', 'Test records, warranties, approvals and as-built drawings.'],
    ],
  },
]
export const QUALITY_COUNT = QUALITY_STAGES.reduce((n, s) => n + s.checks.length, 0)

/* ---------- People ---------- */
export const TEAM = [
  {
    name: FOUNDER.name,
    role: 'Director',
    photo: FOUNDER.photo,
    credentials: [
      'B.Tech Civil',
      'PG in Construction Management — NICMAR (National Institute of Construction Management & Research)',
      'Enlisted Structural Engineer, Govt. of Andhra Pradesh · CRDA Reg. No. 22/2021/5072975/2021',
    ],
    bio: 'Years with a corporate construction company, delivering every kind of project — from high-end homes and 500-bed hospitals to battery plants and pharma units — from design right through to execution.',
  },
  {
    name: 'Yasaswini Chowdary Manne',
    role: 'Director · Design',
    initials: 'YM',
    credentials: ['B.Tech Civil', '15 years of experience'],
    bio: 'Leads interiors, exterior fit-outs, layout design and planning — the designer behind how our spaces look and work.',
  },
  {
    name: 'Uday Krishna Mutyala',
    role: 'Design team',
    initials: 'UM',
    credentials: ['B.Tech Civil', 'M.Tech Structures', '12 years of experience'],
    bio: 'Structural design and engineering, making sure every design is safe, efficient and buildable.',
  },
]

/* ---------- What our team has built (no names, no places) ---------- */
export const EXPERIENCE = {
  projects: [
    'High-end residences',
    'Corporate guest houses',
    'Villas',
    'Independent houses',
    'Residential flats',
    'Clinics',
    'Hospitals · 50 to 500 beds',
    'Restaurants (F&B)',
    'Mega kitchens',
    'Warehouses',
    'Battery manufacturing plants',
    'Pharma industries',
    'Paint industries',
    'Beverage industries',
  ],
  skills: [
    'Structural RCC works',
    'Composite construction',
    'Pre-engineered buildings (PEB)',
    'Civil finishes',
    'Flooring',
    'Plumbing',
    'Electrical',
    'Mechanical',
    'Fit-outs',
  ],
}
