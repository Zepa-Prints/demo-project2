import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { STATS } from '../../data/site'
import './stats.css'

export default function Stats() {
  const root = useRef(null)
  useGSAP(
    () => {
      gsap.utils.toArray('.st__num', root.current).forEach((el) => {
        const end = Number(el.dataset.value)
        const dec = Number(el.dataset.decimals || 0)
        const o = { v: 0 }
        gsap.to(o, {
          v: end,
          duration: 2.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate: () => (el.textContent = o.v.toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec })),
        })
      })
      gsap.from('.st__item', {
        y: 50,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
      })
    },
    { scope: root }
  )
  return (
    <section className="st section--dark" ref={root}>
      <div className="wrap st__grid">
        {STATS.map((s) => (
          <div className="st__item" key={s.label}>
            <div className="st__value display">
              <span className="st__num" data-value={s.value} data-decimals={s.decimals || 0}>
                0
              </span>
              <span className="st__suffix">{s.suffix}</span>
            </div>
            <p className="label label--muted">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
