import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap'
import { ASSURANCE, QUALITY_COUNT, QUALITY_STAGES } from '../../data/turnkey'
import { SplitReveal } from '../../components/ui'
import './quality25.css'

const pad = (n) => String(n).padStart(2, '0')

/**
 * 25-point assured quality.
 * Each checkpoint "ticks" (yellow box + drawn check mark) as it scrolls into
 * view; the big counter and the progress bar follow the number of ticked
 * checks, and untick again when scrolling back up.
 */
export default function Quality25({ index = '05', showMethod = true }) {
  const root = useRef(null)

  useGSAP(
    () => {
      const items = gsap.utils.toArray('.q25__item', root.current)
      const counters = root.current.querySelectorAll('[data-q25-count]')
      const bars = root.current.querySelectorAll('[data-q25-bar]')
      let shown = 0
      const counter = { v: 0 }
      const render = () => {
        const v = Math.round(counter.v)
        counters.forEach((c) => (c.textContent = pad(v)))
        bars.forEach((b) => (b.style.transform = `scaleX(${counter.v / QUALITY_COUNT})`))
      }
      const update = () => {
        const n = items.filter((i) => i.classList.contains('is-on')).length
        if (n === shown) return
        shown = n
        gsap.to(counter, { v: n, duration: 0.5, ease: 'power2.out', overwrite: true, onUpdate: render })
      }
      items.forEach((el) =>
        ScrollTrigger.create({
          trigger: el,
          start: 'top 78%',
          onEnter: () => (el.classList.add('is-on'), update()),
          onLeaveBack: () => (el.classList.remove('is-on'), update()),
        })
      )
      gsap.from('.q25__stage-title', {
        y: 30,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.q25__stages', start: 'top 85%', once: true },
      })
      gsap.from('.q25__side > *', {
        y: 30,
        autoAlpha: 0,
        stagger: 0.07,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
      })
    },
    { scope: root }
  )

  let n = 0
  return (
    <section className="section q25" ref={root} id="quality">
      <div className="q25__grid wrap">
        <aside className="q25__side">
          <span className="idx">{index} — Assured quality</span>
          <div className="q25__big display" aria-hidden="true">
            <span data-q25-count>00</span>
            <span className="q25__of">/{QUALITY_COUNT}</span>
          </div>
          <SplitReveal as="h2" className="display h-md q25__title">
            Point <em>assured quality</em>
          </SplitReveal>
          <p className="lead">
            Every Yashveer project passes {QUALITY_COUNT} documented checks — before work begins, while it is being built and
            before we hand it over. Nothing gets covered up until it has been checked.
          </p>
          <span className="q25__bar" aria-hidden="true">
            <i data-q25-bar />
          </span>
          {showMethod && (
            <ul className="q25__method">
              {ASSURANCE.map((a) => (
                <li key={a.title}>
                  <strong>{a.title}</strong>
                  <span>{a.text}</span>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <div className="q25__stages">
          {/* phones: the counter travels with the list */}
          <div className="q25__pill" aria-hidden="true">
            <span data-q25-count>00</span> / {QUALITY_COUNT} checks
            <span className="q25__pill-bar">
              <i data-q25-bar />
            </span>
          </div>
          {QUALITY_STAGES.map((stage, si) => (
            <div className="q25__stage" key={stage.title}>
              <h3 className="q25__stage-title">
                <span className="label">Stage {pad(si + 1)}</span>
                <span className="serif">{stage.title}</span>
                <span className="label label--muted">{stage.checks.length} checks</span>
              </h3>
              <ol className="q25__list">
                {stage.checks.map(([title, text]) => {
                  n += 1
                  return (
                    <li className="q25__item" key={title}>
                      <span className="q25__tick" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                          <path d="M5 12.5l4.5 4.5L19 7.5" />
                        </svg>
                      </span>
                      <span className="q25__no label">{pad(n)}</span>
                      <div className="q25__copy">
                        <strong>{title}</strong>
                        <span>{text}</span>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
