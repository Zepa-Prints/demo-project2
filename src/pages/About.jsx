import { useLayoutEffect, useRef, useState } from 'react'
import { Flip, gsap, useGSAP } from '../lib/gsap'
import { IMG, PHOTOS, PILLARS, COMPANY, FOUNDER_CLIP, sm } from '../data/site'
import { TLink, useTransition } from '../components/Transition'
import { Arrow, ArrowUpRight, Img, RevealImage, SplitReveal, useFadeUp } from '../components/ui'
import AutoVideo from '../components/AutoVideo'
import FounderNote from '../components/FounderNote'
import { Marquee } from '../sections/home/Way'
import ImageStack from '../components/ImageStack'
import { ImageBand, PhotoReel } from '../components/Bands'
import { useDocTitle } from '../hooks/useDocTitle'
import './about.css'

/* ------------------------------------------------------------------
   Lines-to-Layout (codrops/LinesToLayout) rebuilt for React:
   the clicked image is re-rendered inside the content row and GSAP Flip
   morphs it between positions using a shared data-flip-id.
------------------------------------------------------------------- */
const CONTENT = [
  {
    img: PHOTOS.kamalaCourtyard,
    title: [`${COMPANY.experience} years,`, 'brick by brick'],
    meta: [['Vijayawada'], ['Founded', `in ${COMPANY.founded}`], ['On site', `since ${new Date().getFullYear() - COMPANY.experience}`]],
  },
  {
    img: PHOTOS.kamalaFront,
    title: ['Building for the', 'India of tomorrow'],
    meta: [['Our vision'], ['Spaces for', 'generations'], ['Andhra Pradesh', '& Telangana']],
  },
]

// The four intro lines. Each word group slides out in its own direction when an image is opened.
// [text, direction, accent?]
const LL_ROWS = [
  [['We do not', 'top'], ['just build', 'right']],
  [['walls, we', 'left'], ['shape', 'bottom']],
  [['spaces', 'right'], ['where', 'top']],
  [['life truly', 'bottom'], ['belongs', 'left', true]],
]

function LinesToLayout() {
  const root = useRef(null)
  const [open, setOpen] = useState(null) // which image lives in the content view
  const [shown, setShown] = useState(null) // which content panel is visible
  const pending = useRef(null)
  const busy = useRef(false)
  const { ready } = useTransition()

  const q = (sel) => root.current.querySelectorAll(sel)
  const introTexts = () => [...q('.ll__row .oh > span')]
  const otherImages = (i) => [...q(`.ll__image:not([data-flip-id="ll-${i}"]) .ll__image-inner`)]
  const contentTexts = (i) => [...q(`.ll-content[data-i="${i}"] .oh > span`)]
  const backBtn = (i) => q(`.ll-content[data-i="${i}"] .ll-content__back`)[0]

  const dirX = (_, t) => ({ right: 101, left: -101 }[t.dataset.direction] || 0)
  const dirY = (_, t) => ({ top: -101, bottom: 101 }[t.dataset.direction] || 0)

  // intro on page reveal
  useGSAP(
    () => {
      if (!ready) return
      gsap.from('.ll__row .oh > span, .ll__image-inner', {
        xPercent: dirX,
        yPercent: dirY,
        duration: 1.4,
        ease: 'expo.out',
        stagger: 0.04,
      })
      gsap.from('.ll__hint', { autoAlpha: 0, y: 10, delay: 1 })
    },
    { scope: root, dependencies: [ready] }
  )

  const openContent = (i) => {
    if (busy.current || open !== null) return
    busy.current = true
    pending.current = { mode: 'open', i, state: Flip.getState(q(`[data-flip-id="ll-${i}"]`)) }
    setShown(i)
    setOpen(i)
  }

  const closeContent = (i) => {
    if (busy.current) return
    busy.current = true
    gsap.to(contentTexts(i), { duration: 0.8, yPercent: 101, ease: 'power4.inOut' })
    gsap.to(backBtn(i), { duration: 0.8, xPercent: 20, opacity: 0, ease: 'power4.inOut' })
    pending.current = { mode: 'close', i, state: Flip.getState(q(`[data-flip-id="ll-${i}"]`)) }
    setOpen(null)
  }

  useLayoutEffect(() => {
    const p = pending.current
    if (!p) return
    pending.current = null
    const img = q(`[data-flip-id="ll-${p.i}"]`)
    if (p.mode === 'open') {
      gsap.set(backBtn(p.i), { xPercent: 20, opacity: 0 })
      gsap.set(contentTexts(p.i), { yPercent: 101 })
      gsap
        .timeline({ defaults: { duration: 1.1, ease: 'power4.inOut' }, onComplete: () => (busy.current = false) })
        .add(Flip.from(p.state, { targets: img, duration: 1.2, ease: 'power4.inOut', absolute: true }), 0)
        .to([...introTexts(), ...otherImages(p.i)], { xPercent: dirX, yPercent: dirY }, 0)
        .to(contentTexts(p.i), { ease: 'expo', yPercent: 0 }, 0.7)
        .to(backBtn(p.i), { ease: 'expo', xPercent: 0, opacity: 1 }, 0.7)
    } else {
      gsap
        .timeline({
          defaults: { duration: 1.1, ease: 'power4.inOut' },
          onComplete: () => {
            busy.current = false
            setShown(null)
          },
        })
        .add(Flip.from(p.state, { targets: img, duration: 1.2, ease: 'power4.inOut', absolute: true }), 0)
        .to([...introTexts(), ...otherImages(p.i)], { ease: 'expo', xPercent: 0, yPercent: 0 }, 0.6)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const image = (i, cls) => (
    <button
      className={`ll__image ${cls}`}
      data-flip-id={`ll-${i}`}
      onClick={() => (open === i ? null : openContent(i))}
      aria-label={open === i ? undefined : `Read: ${CONTENT[i].title.join(' ')}`}
      data-cursor={open === i ? '' : 'Open'}
      tabIndex={open === i ? -1 : 0}
    >
      <span className="ll__image-inner" data-direction={i === 0 ? 'right' : 'left'}>
        <Img img={CONTENT[i].img} w={1400} alt="" />
      </span>
    </button>
  )

  return (
    <section className="ll" ref={root}>
      <div className={`ll__intro ${open !== null ? 'll__intro--close' : ''}`} style={{ visibility: ready ? 'visible' : 'hidden' }}>
        {LL_ROWS.map((row, r) => (
          <div className={`ll__row ll__row--${r + 1}`} key={r}>
            {row.map(([text, dir, accent], k) => (
              <span key={k}>
                <span className="oh">
                  <span data-direction={dir}>{accent ? <em>{text}</em> : text}</span>
                </span>{' '}
              </span>
            ))}
          </div>
        ))}
        {open !== 0 && image(0, 'll__image--up')}
        {open !== 1 && image(1, 'll__image--down')}
        <p className="ll__hint label">( Click an image )</p>
      </div>

      <div className="ll__content-wrap">
        {CONTENT.map((c, i) => {
          const imageRow = <div className="ll-content__row ll-content__row--image">{open === i && image(i, '')}</div>
          return (
            <div className={`ll-content ${shown === i ? 'll-content--open' : ''}`} data-i={i} key={i} aria-hidden={shown !== i}>
              {i === 0 && imageRow}
              <div className="ll-content__row ll-content__row--text">
                <h2 className="ll-content__title serif">
                  {c.title.map((t, k) => (
                    <span key={k}>
                      <span className="oh">
                        <span>{t}</span>
                      </span>
                      <br />
                    </span>
                  ))}
                </h2>
                <span className="ll-content__number serif">
                  <span className="oh">
                    <span>{i + 1}</span>
                  </span>
                </span>
                <button className="ll-content__back" onClick={() => closeContent(i)} aria-label="Back" tabIndex={shown === i ? 0 : -1}>
                  <svg viewBox="0 0 50 9">
                    <path d="m0 4.5 5-3m-5 3 5 3m45-3h-77" />
                  </svg>
                </button>
                <div className="ll-content__meta">
                  {c.meta.map((m, k) => (
                    <span key={k} className={`ll-content__meta-text ${k === 1 ? 'll-content__meta-text--center' : ''}`}>
                      {m.map((line, l) => (
                        <span key={l}>
                          <span className="oh">
                            <span>{line}</span>
                          </span>
                          {l < m.length - 1 && <br />}
                        </span>
                      ))}
                    </span>
                  ))}
                </div>
              </div>
              {i === 1 && imageRow}
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ---------------- timeline ---------------- */
// The founder's story. Project years can be added to the first column once confirmed.
const START = new Date().getFullYear() - COMPANY.experience
const MILESTONES = [
  [String(START), 'First years on site', 'Our founder learns the trade building large residential towers for another company — every one completed, every home sold.', PHOTOS.previous1],
  [String(COMPANY.founded), 'Yashveer Constructions founded', 'With years of site experience behind it, the company is set up in Vijayawada.', IMG.blueprint],
  ['01', 'Kamala Residency, Vijayawada', 'Fifty 2 & 3 BHK homes on 100 Feet Road, Kanuru — and home to our head office.', sm(PHOTOS.kamalaFront)],
  ['02', 'Isha Hospitals, Guntur', 'A premium hospital building with bright, clean wards, now serving patients.', PHOTOS.ishaWard],
  ['03', 'Svaadishta, Vijayawada', 'A relaxed, lantern-lit restaurant at Kamayyathopu Centre.', sm(PHOTOS.svFrontage)],
  ['Now', 'PG Hostel, Hyderabad', 'Our first project in Telangana — under construction.', sm(PHOTOS.pgExterior)],
]

function Timeline() {
  const root = useRef(null)
  useGSAP(
    () => {
      gsap.utils.toArray('.tl__row', root.current).forEach((r) => {
        gsap.from(r, { y: 50, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: r, start: 'top 90%', once: true } })
      })
      gsap.fromTo(
        '.tl__progress i',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.tl__rows', start: 'top 60%', end: 'bottom 60%', scrub: true } }
      )
    },
    { scope: root }
  )
  return (
    <section className="section tl wrap" ref={root}>
      <div className="section-head">
        <span className="idx">Milestones</span>
        <SplitReveal as="h2" className="display h-lg">
          Fourteen years of <em>keeping promises</em>
        </SplitReveal>
      </div>
      <div className="tl__rows">
        <span className="tl__progress">
          <i />
        </span>
        {MILESTONES.map(([y, t, d, img]) => (
          <div className="tl__row" key={y}>
            <span className="tl__year display">{y}</span>
            <h3 className="serif tl__title">{t}</h3>
            <p className="tl__text">{d}</p>
            <div className="tl__thumb">
              <Img img={img} w={600} alt={t} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const APPROACH = [
  {
    title: 'Design that breathes',
    text: 'Light and cross-ventilation in every room, balconies and courtyards placed to catch the breeze — planned for our climate, not copied from a catalogue.',
    img: sm(PHOTOS.kamalaCourtyard),
  },
  {
    title: 'Built to outlast us',
    text: 'Our own engineers on site, honest materials, and every stage checked before the next one begins. Fourteen years of habits that do not cut corners.',
    img: sm(PHOTOS.kamalaFacade),
  },
  {
    title: 'Care after the keys',
    text: 'We stay reachable long after handover. Our head office is inside Kamala Residency — we see our work every day.',
    img: sm(PHOTOS.kamalaKitchen),
  },
]

export default function About() {
  useDocTitle('About — Yashveer Constructions')
  const root = useRef(null)
  useFadeUp(root)

  return (
    <div className="ab" ref={root}>
      <LinesToLayout />

      {/* ---------- story with image collage ---------- */}
      <section className="section wrap ab-intro">
        <div className="ab-intro__text">
          <span className="idx">Our story</span>
          <SplitReveal as="p" className="ab-story__lead display">
            Drawing from a rich legacy in construction, we blend expertise with an unwavering dedication to quality and
            innovation — <em>redefining the art of modern living</em>.
          </SplitReveal>
          <p className="lead" data-fade>
            Our founder has spent {COMPANY.experience} years on construction sites, building projects under another company
            before starting Yashveer Constructions in {COMPANY.founded}. The belief behind it is simple: a building is a
            promise, so it should be built with the care of something that will outlast us.
          </p>
          <p className="lead" data-fade>
            Since then we have delivered Kamala Residency&rsquo;s fifty homes in Vijayawada, Isha Hospitals in Guntur and the
            Svaadishta restaurant in Kanuru — and we are now building our first project in Hyderabad.
          </p>
          <div className="ab-values" data-fade>
            {PILLARS.map((p, i) => (
              <div className="ab-values__item" key={p.title}>
                <span className="label label--muted">0{i + 1}</span>
                <span className="serif">{p.title}</span>
              </div>
            ))}
          </div>
        </div>
        <ImageStack
          className="ab-intro__stack"
          images={[sm(PHOTOS.kamalaBedroom), sm(PHOTOS.kamalaDining), sm(PHOTOS.kamalaCourtyard)]}
          caption="Inside Kamala Residency"
        />
      </section>

      {/* ---------- founder clip (a few seconds, muted) ---------- */}
      <section className="section wrap ab-founder">
        <div className="ab-founder__text">
          <span className="idx">In conversation</span>
          <SplitReveal as="h2" className="display h-md">
            Hear it from <em>the founder</em>
          </SplitReveal>
          <p className="lead" data-fade>
            A few seconds from a longer conversation about building Svaadishta — what it takes to turn a plot into a place
            people love to come back to.
          </p>
          <a href={FOUNDER_CLIP.full} target="_blank" rel="noopener" className="btn btn--ghost" data-fade>
            Watch the full conversation <ArrowUpRight className="btn__arrow" />
          </a>
        </div>
        <div className="ab-founder__media" data-fade>
          <AutoVideo src={FOUNDER_CLIP} aria-label="Clip from a conversation with our founder" />
          <span className="ab-founder__tag label">
            <i /> Podcast clip
          </span>
        </div>
      </section>

      {/* ---------- full-bleed band ---------- */}
      <ImageBand img={PHOTOS.kamalaTower} kicker="Our promise">
        Every building is a promise. <em>We keep it.</em>
      </ImageBand>

      {/* ---------- approach cards ---------- */}
      <section className="section wrap ab-approach">
        <div className="section-head">
          <span className="idx">How we work</span>
          <SplitReveal as="h2" className="display h-lg">
            Three things we <em>never</em> compromise on
          </SplitReveal>
        </div>
        <div className="ab-approach__grid">
          {APPROACH.map((a, i) => (
            <article className="ab-card" key={a.title} data-fade data-delay={i * 0.1}>
              <div className="ab-card__media">
                <Img img={a.img} w={1000} alt={a.title} />
                <span className="ab-card__num display">0{i + 1}</span>
              </div>
              <h3 className="serif ab-card__title">{a.title}</h3>
              <p className="ab-card__text">{a.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- photo reel ---------- */}
      <section className="ab-reel">
        <div className="wrap ab-reel__head">
          <span className="idx">Inside our work</span>
          <p className="lead">Homes, a hospital and a restaurant — the finished spaces, as they are lived in today.</p>
        </div>
        <PhotoReel
          images={[
            PHOTOS.kamalaFront,
            PHOTOS.kamalaBedroom,
            PHOTOS.svFrontage,
            PHOTOS.kamalaCourtyard,
            PHOTOS.kamalaKitchen,
            PHOTOS.svEntrance,
            PHOTOS.kamalaBalconies,
            PHOTOS.kamalaDining,
            PHOTOS.kamalaTower,
          ].map(sm)}
        />
      </section>

      <Timeline />

      <FounderNote
        tone="dark"
        flip
        kicker="Why Yashveer"
        quote="For years I built under someone else’s name. In 2020 I started Yashveer so that every decision — the steel, the light, the finish — is made on site, by people who care how it turns out."
      />

      <Marquee items={['Integrity', 'Craft', 'Care', 'On-time handover', 'Transparency']} dark />

      {/* ---------- CTA with image ---------- */}
      <section className="section wrap ab-cta">
        <div className="ab-cta__text">
          <SplitReveal as="h2" className="display h-xl">
            See what we&rsquo;ve <em>built</em>
          </SplitReveal>
          <p className="lead" data-fade>
            Homes in Vijayawada, a hospital in Guntur, a restaurant in Kanuru — and Hyderabad next.
          </p>
          <TLink to="/projects" className="btn" data-fade>
            Explore our projects <Arrow />
          </TLink>
        </div>
        <RevealImage img={sm(PHOTOS.kamalaTower)} alt="Yashveer residential building" ratio="4 / 5" className="ab-cta__img" w={1200} />
      </section>
    </div>
  )
}
