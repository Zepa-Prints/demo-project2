import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { BUILD_PACKAGES, DESIGN_PACKAGES } from '../../data/turnkey'
import { SplitReveal } from '../../components/ui'
import { useLead } from '../../components/LeadModal'
import './packages.css'

const TABS = [
  { key: 'design', label: 'Design packages', list: DESIGN_PACKAGES, intro: 'Architects, structural engineers and 3D visualisers — designed for creativity and for practical construction.' },
  { key: 'build', label: 'Build packages', list: BUILD_PACKAGES, intro: 'Choose how much of the construction we take on — from skilled manpower to a complete build with materials.' },
]

export default function Packages({ index = '02' }) {
  const root = useRef(null)
  const [tab, setTab] = useState(0)
  const { openLead } = useLead()
  const t = TABS[tab]

  useGSAP(
    () => {
      gsap.from('.pk__card', { y: 40, autoAlpha: 0, stagger: 0.08, duration: 1, ease: 'expo.out', clearProps: 'transform' })
    },
    { scope: root, dependencies: [tab] }
  )

  return (
    <section className="section pk wrap" ref={root} id="packages">
      <div className="section-head">
        <span className="idx">{index} — Packages</span>
        <div className="pk__head">
          <SplitReveal as="h2" className="display h-lg">
            Design it. Build it. <em>Your way.</em>
          </SplitReveal>
          <div className="pk__tabs" role="tablist" aria-label="Package type">
            {TABS.map((x, i) => (
              <button key={x.key} role="tab" aria-selected={i === tab} className={i === tab ? 'is-active' : ''} onClick={() => setTab(i)}>
                {x.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="lead pk__intro">{t.intro}</p>

      <div className="pk__grid" key={t.key}>
        {t.list.map((p, i) => (
          <article className={`pk__card ${p.featured ? 'pk__card--featured' : ''}`} key={p.name}>
            <div className="pk__top">
              <span className="label">Package {String(i + 1).padStart(2, '0')}</span>
              {p.featured && <span className="pk__badge label">Most complete</span>}
            </div>
            <h3 className="serif pk__name">{p.name}</h3>
            <p className="pk__tag">{p.tag}</p>
            <ul className="pk__items">
              {p.items.map((it) => (
                <li key={it}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                  {it}
                </li>
              ))}
            </ul>
            <button className={`btn ${p.featured ? 'btn--light' : 'btn--ghost'} pk__cta`} onClick={() => openLead(`${t.key === 'design' ? 'Design' : 'Build'} package — ${p.name}`)}>
              Enquire
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
