import { useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { gsap, useGSAP } from '../lib/gsap'
import { scrollToEl } from '../lib/lenis'
import { PROJECTS, STATUS, getProject, sm } from '../data/site'
import PolygonGallery from '../components/PolygonGallery'
import { TLink, useTransition } from '../components/Transition'
import { Arrow, ArrowUpRight, Img, Magnetic, RevealImage, SmartImg, SplitReveal, src, useFadeUp } from '../components/ui'
import ReachUs from '../sections/home/ReachUs'
import { ImageBand } from '../components/Bands'
import { useLead } from '../components/LeadModal'
import { useDocTitle } from '../hooks/useDocTitle'
import NotFound from './NotFound'
import './project-detail.css'

const HighlightIcon = ({ i }) => {
  const paths = [
    'M3 21V10l9-6 9 6v11M9 21v-6h6v6', // building
    'M12 21v-8M12 13c-4 0-6-3-6-7 4 0 6 3 6 7zm0 0c4 0 6-3 6-7-4 0-6 3-6 7z', // garden
    'M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4M12 8a4 4 0 110 8 4 4 0 010-8z', // light
    'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4', // quality
  ]
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[i % paths.length]} />
    </svg>
  )
}

function Plan({ name, plans }) {
  const [tab, setTab] = useState(0)
  const [zoom, setZoom] = useState(false)
  const box = useRef(null)
  const img = useRef(null)
  const plan = plans[tab]

  const move = (e) => {
    if (!zoom) return
    const r = box.current.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 100
    const y = ((e.clientY - r.top) / r.height) * 100
    gsap.to(img.current, { transformOrigin: `${x}% ${y}%`, duration: 0.4, ease: 'power3.out' })
  }

  const toggle = (e) => {
    const next = !zoom
    setZoom(next)
    if (next) move(e)
    gsap.to(img.current, { scale: next ? 2.2 : 1, duration: 0.8, ease: 'expo.out' })
  }

  return (
    <section className="section pd-plan wrap" id="plan">
      <div className="section-head">
        <span className="idx">Floor plans</span>
        <div className="pd-plan__head">
          <SplitReveal as="h2" className="display h-lg">
            Planned to the <em>last inch</em>
          </SplitReveal>
          {plans.length > 1 && (
            <div className="pd-plan__tabs" role="tablist">
              {plans.map((pl, i) => (
                <button
                  key={pl.label}
                  role="tab"
                  aria-selected={i === tab}
                  className={i === tab ? 'is-active' : ''}
                  onClick={() => {
                    setTab(i)
                    setZoom(false)
                  }}
                >
                  {pl.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div
        className={`pd-plan__frame ${zoom ? 'is-zoomed' : ''}`}
        ref={box}
        onMouseMove={move}
        onClick={toggle}
        onMouseLeave={() => {
          if (zoom) {
            setZoom(false)
            gsap.to(img.current, { scale: 1, duration: 0.8, ease: 'expo.out' })
          }
        }}
        data-cursor={zoom ? 'Zoom out' : 'Zoom in'}
      >
        <img ref={img} key={tab} src={plan.img} alt={`${name} — ${plan.label}`} draggable="false" />
        <span className="pd-plan__badge label">{plan.label}</span>
      </div>
      <p className="pd-plan__note">Plans are indicative. Click the plan to zoom and move your cursor to explore.</p>
    </section>
  )
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const p = getProject(slug)
  if (!p) return <NotFound />
  return <Detail p={p} key={p.slug} />
}

function Detail({ p }) {
  useDocTitle(`${p.name} — Yashveer Constructions`)
  const root = useRef(null)
  const gallery = useRef(null)
  const [slide, setSlide] = useState(0)
  const { ready } = useTransition()
  const { openLead } = useLead()
  useFadeUp(root)

  const idx = PROJECTS.findIndex((x) => x.slug === p.slug)
  const next = PROJECTS[(idx + 1) % PROJECTS.length]
  const images = useMemo(() => p.heroImages.map((g) => src(g, 1920, 1080)), [p])
  // polygon transition only when there are several sharp photos; otherwise a still hero
  const animatedHero = images.length > 1 && !p.lowRes
  const conf = p.facts.Configuration || p.category

  useGSAP(
    () => {
      if (!ready) return
      gsap
        .timeline({ defaults: { ease: 'expo.out', duration: 1.5 } })
        .fromTo('.pd-hero__media', { scale: 1.2 }, { scale: 1, duration: 2.2, ease: 'power3.out' }, 0)
        .from('.pd-hero__name-line > span', { yPercent: 115, stagger: 0.08 }, 0.1)
        .from('[data-pd-fade]', { y: 24, autoAlpha: 0, stagger: 0.06, duration: 1.1 }, 0.5)
    },
    { scope: root, dependencies: [ready] }
  )

  useGSAP(
    () => {
      gsap.to('.pd-hero__inner', {
        yPercent: 25,
        ease: 'none',
        scrollTrigger: { trigger: '.pd-hero', start: 'top top', end: 'bottom top', scrub: true },
      })
      // horizontal drag gallery entrance
      gsap.from('.pd-gal__item', {
        x: 120,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.pd-gal', start: 'top 80%', once: true },
      })
      // next project image scale on scroll
      gsap.fromTo(
        '.pd-next__media',
        { clipPath: 'inset(20% 20% 20% 20% round 2rem)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0rem)',
          ease: 'none',
          scrollTrigger: { trigger: '.pd-next', start: 'top bottom', end: 'top 20%', scrub: true },
        }
      )
    },
    { scope: root }
  )

  // drag-to-scroll gallery
  const drag = useRef({ down: false, x: 0, left: 0 })
  const gal = useRef(null)
  const onDown = (e) => {
    drag.current = { down: true, x: e.clientX, left: gal.current.scrollLeft, moved: false }
    gal.current.classList.add('is-dragging')
  }
  const onMove = (e) => {
    if (!drag.current.down) return
    const dx = e.clientX - drag.current.x
    if (Math.abs(dx) > 3) drag.current.moved = true
    gal.current.scrollLeft = drag.current.left - dx
  }
  const onUp = () => {
    drag.current.down = false
    gal.current && gal.current.classList.remove('is-dragging')
  }

  const hidden = { visibility: ready ? 'visible' : 'hidden' }
  const isLive = p.status === 'construction'

  return (
    <div className="pd" ref={root}>
      {/* ---------- HERO ---------- */}
      <section className="pd-hero">
        <div className="pd-hero__media">
          {animatedHero ? (
            <PolygonGallery ref={gallery} images={images} variant="flip" autoplay={5500} onChange={setSlide} />
          ) : (
            <SmartImg img={p.cover} lowRes={p.lowRes} w={2000} alt="" className="pd-hero__still" />
          )}
        </div>
        <div className="pd-hero__shade" />
        <div className="pd-hero__inner wrap" style={hidden}>
          <div className="pd-hero__crumbs label" data-pd-fade>
            <TLink to="/projects" className="line-link">
              Projects
            </TLink>
            <span>/</span>
            <span>{p.name}</span>
          </div>
          <div className="pd-hero__main">
            <span className="chip" data-status={p.status} data-pd-fade>
              {STATUS[p.status]}
            </span>
            <h1 className="pd-hero__name display">
              {p.name.split(' ').map((w, i) => (
                <span className="pd-hero__name-line" key={i}>
                  <span>{i === 1 ? <em>{w}</em> : w}</span>
                </span>
              ))}
            </h1>
            <div className="pd-hero__bar" data-pd-fade>
              <span>{p.location}</span>
              <span>{p.type}</span>
              <span>{conf}</span>
              {animatedHero && (
                <div className="pd-hero__dots">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      className={i === slide ? 'is-active' : ''}
                      onClick={() => gallery.current?.goTo(i)}
                      aria-label={`Show image ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- OVERVIEW ---------- */}
      <section className="section pd-ov wrap">
        <aside className="pd-ov__facts">
          <span className="idx">Key facts</span>
          <dl>
            {Object.entries(p.facts).map(([k, v]) => (
              <div className="pd-ov__fact" key={k} data-fade>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
        <div className="pd-ov__body">
          <span className="idx">Overview</span>
          <SplitReveal as="p" className="pd-ov__lead display">
            {p.blurb}
          </SplitReveal>
          {p.overview.map((t, i) => (
            <p className="lead" key={i} data-fade>
              {t}
            </p>
          ))}
          <div className="pd-ov__cta" data-fade>
            <Magnetic>
              <button className="btn" onClick={() => openLead(p.name)}>
                {isLive ? 'Register your interest' : 'Enquire about this project'} <Arrow />
              </button>
            </Magnetic>
            {p.plans.length > 0 ? (
              <a href="#plan" className="btn btn--ghost" onClick={(e) => (e.preventDefault(), scrollToEl('#plan'))}>
                View floor plans
              </a>
            ) : (
              <a href="#location" className="btn btn--ghost" onClick={(e) => (e.preventDefault(), scrollToEl('#location'))}>
                See location
              </a>
            )}
          </div>
          <div className="pd-ov__stat" data-fade>
            <span className="display">{p.stat}</span>
            <span className="label label--muted">{p.statLabel}</span>
          </div>
        </div>
      </section>

      {p.gallery.length > 1 && !p.lowRes && (
        <div className="wrap">
          <RevealImage img={p.gallery[1]} alt={`${p.name}`} className="pd-wide" w={2000} parallax={10}>
            {p.video && <video className="pd-wide__video" src={p.video} autoPlay muted loop playsInline preload="metadata" />}
          </RevealImage>
        </div>
      )}

      {/* ---------- PLANS (only when the project has them) ---------- */}
      {p.plans.length > 0 && <Plan name={p.name} plans={p.plans} />}

      {/* ---------- HIGHLIGHTS ---------- */}
      <section className="section pd-am section--dark">
        <div className="wrap">
          <div className="section-head">
            <span className="idx">Highlights</span>
            <SplitReveal as="h2" className="display h-lg">
              {isLive ? (
                <>
                  Rising now in <em>{p.city}</em>
                </>
              ) : (
                <>
                  Built to be <em>lived in</em>
                </>
              )}
            </SplitReveal>
          </div>
          <ul className="pd-am__grid">
            {p.highlights.map((a, i) => (
              <li key={a} className="pd-am__item" data-fade data-delay={(i % 4) * 0.06}>
                <HighlightIcon i={i} />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {p.gallery.length > 2 && !p.lowRes && (
        <ImageBand img={p.gallery[2]} kicker={p.type}>
          Designed around <em>the way you live.</em>
        </ImageBand>
      )}

      {/* ---------- GALLERY ---------- */}
      {p.gallery.length > 1 && (
        <section className="section pd-gal">
          <div className="wrap section-head">
            <span className="idx">Gallery</span>
            <h2 className="display h-md">
              A closer <em>look</em>
            </h2>
          </div>
          <div
            className={`pd-gal__track ${p.lowRes ? 'pd-gal__track--small' : ''}`}
            ref={gal}
            data-lenis-prevent-wheel=""
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerLeave={onUp}
            data-cursor="Drag"
          >
            {p.gallery.map((g, i) => (
              <figure className="pd-gal__item" key={i}>
                <SmartImg img={sm(g)} lowRes={p.lowRes} w={1400} alt={`${p.name} — photo ${i + 1}`} draggable="false" />
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ---------- LOCATION ---------- */}
      <section className="section pd-loc wrap section--paper" id="location">
        <div className="pd-loc__grid">
          <div>
            <span className="idx">Location</span>
            <h2 className="display h-md pd-loc__title">{p.location}</h2>
            <address className="pd-loc__addr">
              {p.address.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
            {p.map && (
              <a href={p.map} target="_blank" rel="noopener" className="btn pd-loc__btn">
                Open in Google Maps <ArrowUpRight className="btn__arrow" />
              </a>
            )}
          </div>
          <div className="pd-loc__map" data-fade>
            <iframe
              title={`Map — ${p.name}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(p.coords)}&z=${p.map ? 16 : 12}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <ReachUs defaultProperty={p.name} index="—" />

      {/* ---------- NEXT ---------- */}
      <TLink to={`/projects/${next.slug}`} className="pd-next" data-cursor="Next">
        <div className="pd-next__media">
          <SmartImg img={next.cover} lowRes={next.lowRes} w={2000} alt="" />
        </div>
        <div className="pd-next__inner wrap">
          <span className="label">Next project</span>
          <span className="display pd-next__name">{next.name}</span>
          <span className="pd-next__meta">
            {next.location} · {STATUS[next.status]}
          </span>
        </div>
      </TLink>
    </div>
  )
}
