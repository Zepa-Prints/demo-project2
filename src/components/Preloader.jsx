import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { stopScroll, startScroll } from '../lib/lenis'
import { whenHeroReady } from '../lib/heroReady'
import { useTransition } from './Transition'
import { COMPANY } from '../data/site'
import Logo from './logo/Logo'
import './preloader.css'

const MIN_TIME = 1.5 // s — long enough for the logo to land and be read
const MAX_WAIT = 3.5 // s — never hold the visitor longer than this

/**
 * Brand preloader: yellow screen, the Yashveer mark rises in, the bar fills.
 * On the home page it waits (up to MAX_WAIT) for the first hero video frame,
 * so the hero is already playing when the curtain lifts.
 */
export default function Preloader() {
  const root = useRef(null)
  const [done, setDone] = useState(false)
  const { setReady } = useTransition()

  useGSAP(
    () => {
      stopScroll()
      const q = gsap.utils.selector(root)
      const t0 = performance.now()
      const intro = gsap
        .timeline()
        .from(q('.pl__mark'), { yPercent: 105, duration: 0.9, ease: 'expo.out' })
        .from(q('.pl__word'), { y: 18, autoAlpha: 0, duration: 0.7, ease: 'expo.out' }, 0.25)
        .from(q('.pl__meta'), { autoAlpha: 0, duration: 0.5 }, 0.3)
      const bar = gsap.fromTo(q('.pl__bar i'), { scaleX: 0 }, { scaleX: 0.85, duration: MAX_WAIT, ease: 'power2.out' })

      let finished = false
      const finish = () => {
        if (finished) return
        finished = true
        const wait = Math.max(0, MIN_TIME - (performance.now() - t0) / 1000)
        bar.kill()
        gsap
          .timeline({ delay: wait })
          .to(q('.pl__bar i'), { scaleX: 1, duration: 0.3, ease: 'power2.out' })
          .to(q('.pl__mark, .pl__word'), { yPercent: -60, autoAlpha: 0, duration: 0.45, ease: 'power3.in', stagger: 0.04 })
          .to(q('.pl__meta'), { autoAlpha: 0, duration: 0.3 }, '<')
          .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.85, ease: 'power4.inOut' })
          .add(() => {
            startScroll()
            setReady(true)
          }, '-=0.6')
          .add(() => setDone(true))
      }

      const onHome = window.location.pathname === '/'
      if (onHome) whenHeroReady(finish)
      else finish()
      const cap = setTimeout(finish, MAX_WAIT * 1000)
      return () => {
        clearTimeout(cap)
        intro.kill()
      }
    },
    { scope: root }
  )

  if (done) return null
  return (
    <div className="pl" ref={root} style={{ clipPath: 'inset(0% 0% 0% 0%)' }} aria-label={COMPANY.name} role="img">
      <div className="pl__logo">
        <span className="pl__mark-mask">
          <Logo variant="mark" className="pl__mark" />
        </span>
        <Logo variant="word" className="pl__word" />
      </div>
      <div className="pl__meta">
        <span className="label">Est. {COMPANY.founded}</span>
        <span className="pl__bar">
          <i />
        </span>
        <span className="label">{COMPANY.experience} years of building</span>
      </div>
    </div>
  )
}
