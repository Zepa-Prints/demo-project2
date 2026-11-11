import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { PROJECTS, STATUS } from '../../data/site'
import { TLink } from '../../components/Transition'
import { Img, SplitReveal, SmartImg } from '../../components/ui'
import './listings.css'

/**
 * Exclusive Listings — inspired by zepa.design featured11-grid:
 * a large rounded stage with cross-fading media, a vertical project list,
 * and an info panel that re-animates on every switch.
 */
export default function Listings() {
  const root = useRef(null)
  const [active, setActive] = useState(0)
  const p = PROJECTS[active]

  useGSAP(
    () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.ls__stage', start: 'top 75%', once: true } })
      tl.fromTo(
        '.ls__stage',
        { clipPath: 'inset(18% 8% 0% 8% round 2rem)' },
        { clipPath: 'inset(0% 0% 0% 0% round 1.75rem)', duration: 1.6, ease: 'expo.inOut' }
      )
        .from('.ls__tab', { x: -40, autoAlpha: 0, stagger: 0.06, duration: 1, ease: 'expo.out' }, '-=0.7')
        .from('.ls__all', { autoAlpha: 0, y: -10, duration: 0.8 }, '<')
      gsap.fromTo(
        '.ls__layers',
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: '.ls__stage', start: 'top bottom', end: 'bottom top', scrub: true },
        }
      )
    },
    { scope: root }
  )

  // info panel re-entrance (keyed by active)
  useGSAP(
    () => {
      gsap.from('.ls__info > *', { y: 24, autoAlpha: 0, stagger: 0.06, duration: 0.9, ease: 'expo.out' })
    },
    { scope: root, dependencies: [active] }
  )

  return (
    <section className="section ls wrap" ref={root}>
      <div className="section-head">
        <span className="idx">03 — Our projects</span>
        <div className="ls__head">
          <SplitReveal as="h2" className="display h-lg">
            Explore the <em>spaces</em> we&rsquo;ve built
          </SplitReveal>
          <p className="lead">
            Homes in Vijayawada, a hospital in Guntur, a restaurant in Kanuru and our first project in Hyderabad — each one
            built by the same team, to the same standard.
          </p>
        </div>
      </div>

      <div className="ls__stage" data-cursor="Discover">
        <div className="ls__layers">
          {PROJECTS.map((x, i) => (
            <div className={`ls__layer ${i === active ? 'is-active' : ''}`} key={x.slug}>
              <SmartImg img={x.cover} lowRes={x.lowRes} w={2000} alt={x.name} />
            </div>
          ))}
        </div>
        <TLink to={`/projects/${p.slug}`} className="ls__hit" aria-label={`Open ${p.name}`} />
        <div className="ls__scrim" />

        <TLink to="/projects" className="ls__all" data-cursor="">
          View all projects
        </TLink>

        <div className="ls__tabs" role="tablist" aria-label="Projects">
          {PROJECTS.map((x, i) => (
            <button
              key={x.slug}
              role="tab"
              aria-selected={i === active}
              className={`ls__tab serif ${i === active ? 'is-active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              data-cursor=""
            >
              <span className="ls__tab-num label">0{i + 1}</span>
              {x.name}
            </button>
          ))}
        </div>

        <div className="ls__info" key={p.slug} data-cursor="">
          <p className="ls__blurb">{p.blurb}</p>
          <div className="ls__row">
            <div className="ls__stat">
              <span className="display">{p.stat}</span>
              <span className="label">{p.statLabel}</span>
            </div>
            <div className="ls__meta">
              <span className="chip" data-status={p.status}>
                {STATUS[p.status]}
              </span>
              <span className="ls__loc">{p.location}</span>
              <TLink to={`/projects/${p.slug}`} className="discover">
                <span className="discover__dot">+</span>
                Discover more
                <span className="discover__arrow">→</span>
              </TLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
