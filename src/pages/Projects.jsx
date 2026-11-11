import { useLayoutEffect, useRef, useState } from 'react'
import { Flip, gsap, useGSAP } from '../lib/gsap'
import { PROJECTS, STATUS } from '../data/site'
import VideoHero from '../components/VideoHero'
import { TLink, useTransition } from '../components/Transition'
import { ArrowUpRight, RevealImage, SmartImg } from '../components/ui'
import { useDocTitle } from '../hooks/useDocTitle'
import { ImageBand } from '../components/Bands'
import { PHOTOS, PREVIOUS_WORK, sm } from '../data/site'
import './projects.css'

const FILTERS = [['all', 'All'], ...Object.entries(STATUS)]

// hero: our best large photos (Ken Burns slides)
const HERO_PHOTOS = [
  { img: PHOTOS.kamalaFront, label: 'Kamala Residency', duration: 6 },
  { img: PHOTOS.svFrontage, label: 'Svaadishta', duration: 6 },
  { img: PHOTOS.kamalaCourtyard, label: 'Kamala Residency · courtyard', duration: 6 },
  { img: PHOTOS.kamalaBedroom, label: 'Kamala Residency · interiors', duration: 6 },
]

export default function Projects() {
  useDocTitle('Our Projects — Yashveer Constructions')
  const root = useRef(null)
  const flipState = useRef(null)
  const [filter, setFilter] = useState('all')
  const { ready } = useTransition()

  const count = (k) => (k === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.status === k).length)

  // intro
  useGSAP(
    () => {
      if (!ready) return
      gsap
        .timeline({
          defaults: { ease: 'expo.out', duration: 1.4 },
          scrollTrigger: { trigger: '.pj__head', start: 'top 80%', once: true },
        })
        .from('.pj__title-line > span', { yPercent: 110, stagger: 0.08 })
        .from('[data-pj-fade]', { y: 20, autoAlpha: 0, stagger: 0.06, duration: 1 }, 0.2)
      gsap.utils.toArray('.pj-card', root.current).forEach((c, i) =>
        gsap.from(c, {
          y: 90,
          autoAlpha: 0,
          duration: 1.4,
          ease: 'expo.out',
          delay: (i % 3) * 0.08,
          scrollTrigger: { trigger: c, start: 'top 92%', once: true },
        })
      )
    },
    { scope: root, dependencies: [ready] }
  )

  const changeFilter = (k) => {
    if (k === filter) return
    flipState.current = Flip.getState(root.current.querySelectorAll('.pj-card'))
    setFilter(k)
  }

  // Flip from previous layout
  useLayoutEffect(() => {
    if (!flipState.current) return
    Flip.from(flipState.current, {
      duration: 0.9,
      ease: 'power3.inOut',
      absolute: true,
      scale: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.7, delay: 0.2 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.5 }),
      onComplete: () => window.dispatchEvent(new Event('resize')),
    })
    flipState.current = null
  }, [filter])

  return (
    <div className="pj" ref={root}>
      <VideoHero
        clips={HERO_PHOTOS}
        kicker={`Portfolio — ${PROJECTS.length} projects`}
        title={['Our', <em key="p">Projects</em>]}
        intro="Homes, a hospital, a restaurant — and our first building in Hyderabad, rising now."
        scrollTarget="#all-projects"
      />

      <header className="pj__head wrap" id="all-projects">
        <div className="pj__head-text">
          <span className="idx" data-pj-fade>
            All projects
          </span>
          <h2 className="pj__title display">
            <span className="pj__title-line">
              <span>Every address,</span>
            </span>{' '}
            <span className="pj__title-line">
              <span>
                <em>one standard</em>
              </span>
            </span>
          </h2>
        </div>
        <div className="pj__head-side">
          <p className="lead" data-pj-fade>
            Three completed landmarks in Andhra Pradesh and one under construction in Telangana. Every address below is
            real — visit any of them.
          </p>
          <div className="pj__filters" role="tablist" aria-label="Filter projects" data-pj-fade>
            {FILTERS.map(([k, label]) => (
              <button
                key={k}
                role="tab"
                aria-selected={filter === k}
                className={`pj__filter ${filter === k ? 'is-active' : ''}`}
                onClick={() => changeFilter(k)}
                disabled={!count(k)}
              >
                {label}
                <sup>{count(k)}</sup>
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="pj__grid wrap">
        {PROJECTS.map((p, i) => {
          const show = filter === 'all' || p.status === filter
          const vi = PROJECTS.filter((x) => filter === 'all' || x.status === filter).indexOf(p)
          return (
            <article
              key={p.slug}
              className="pj-card"
              data-flip-id={p.slug}
              data-c2={vi % 2}
              style={{ display: show ? undefined : 'none' }}
            >
              <TLink to={`/projects/${p.slug}`} className="pj-card__link" data-cursor="View">
                <div className="pj-card__media media">
                  <SmartImg img={sm(p.cover)} lowRes={p.lowRes} w={1100} alt={p.name} />
                  <span className="chip pj-card__chip" data-status={p.status}>
                    {STATUS[p.status]}
                  </span>
                  <span className="pj-card__go">
                    <ArrowUpRight />
                  </span>
                </div>
                <div className="pj-card__body">
                  <span className="label label--muted">0{i + 1}</span>
                  <div className="pj-card__text">
                    <h2 className="serif pj-card__name">{p.name}</h2>
                    <p className="pj-card__meta">
                      {p.type} · {p.category}
                    </p>
                  </div>
                </div>
              </TLink>
              <div className="pj-card__addr">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M12 21s-7-6.2-7-11.5A7 7 0 0119 9.5C19 14.8 12 21 12 21z" />
                  <circle cx="12" cy="9.5" r="2.5" />
                </svg>
                <span>{p.address.join(', ')}</span>
                {p.map && (
                  <a href={p.map} target="_blank" rel="noopener" className="pj-card__map">
                    Open in Maps <ArrowUpRight />
                  </a>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {/* ---------- earlier work (no names, no maps) ---------- */}
      <section className="section pj-prev wrap">
        <div className="pj-prev__text">
          <span className="idx">{PREVIOUS_WORK.title}</span>
          <h2 className="display h-md">
            Where we <em>learned the trade</em>
          </h2>
          <p className="lead">
            Long before Yashveer Constructions had a name, our founder was on sites like these — large residential
            communities built for another company. Every tower was completed and every home sold. We keep that chapter
            nameless, but it&rsquo;s where our standards come from.
          </p>
        </div>
        <div className="pj-prev__imgs">
          {PREVIOUS_WORK.images.map((img, i) => (
            <figure className="pj-prev__fig" key={img}>
              <RevealImage img={img} alt="Residential towers from our founder's earlier work" ratio="16 / 9" parallax={6} />
              <figcaption className="label label--muted">{i === 0 ? 'Built · sold out' : 'Completed · handed over'}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <ImageBand img={PHOTOS.kamalaCourtyard} kicker="Planning something?">
        Let&rsquo;s build <em>your next project.</em>
      </ImageBand>
      <div className="wrap pj__cta">
        <p className="lead">
          Homes, hospitals, restaurants, hostels — tell us what you have in mind and we&rsquo;ll walk you through how we would
          build it.
        </p>
        <TLink to="/contact" className="btn">
          Talk to us <ArrowUpRight className="btn__arrow" />
        </TLink>
      </div>
    </div>
  )
}
