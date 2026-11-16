import { useRef } from 'react'
import { SECTORS } from '../../data/turnkey'
import { RevealImage, SplitReveal, useFadeUp } from '../../components/ui'
import { useLead } from '../../components/LeadModal'
import './what-we-do.css'

/** What we do — the three kinds of turnkey projects. */
export default function WhatWeDo({ index = '03', title }) {
  const root = useRef(null)
  const { openLead } = useLead()
  useFadeUp(root)
  return (
    <section className="section wwd wrap" ref={root} id="what-we-do">
      <div className="section-head">
        <span className="idx">{index} — What we do</span>
        <div className="wwd__head">
          <SplitReveal as="h2" className="display h-lg">
            {title || (
              <>
                Turnkey projects for <em>every</em> kind of building
              </>
            )}
          </SplitReveal>
          <p className="lead" data-fade>
            We don&rsquo;t only develop our own land. Bring us your plot, your house or your site — we design it, build it
            and hand it over ready to use.
          </p>
        </div>
      </div>

      <div className="wwd__grid">
        {SECTORS.map((s, i) => (
          <article className="wwd__card" key={s.key} data-fade data-delay={i * 0.08}>
            <RevealImage img={s.img} alt={s.title} className="wwd__media" parallax={8} w={1100} />
            <div className="wwd__body">
              <div className="wwd__title-row">
                <span className="label label--muted">0{i + 1}</span>
                <h3 className="serif wwd__title">{s.title}</h3>
              </div>
              <p className="wwd__text">{s.text}</p>
              <ul className="wwd__points">
                {s.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
              <button className="discover wwd__cta" onClick={() => openLead(`Turnkey — ${s.title}`)}>
                <span className="discover__dot">+</span>
                Start a {s.title.toLowerCase().split(' ')[0]} project
                <span className="discover__arrow">→</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

