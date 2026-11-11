import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { PROJECTS, STATUS, COMPANY, HOME_HERO_VIDEOS } from '../../data/site'
import PolygonGallery from '../../components/PolygonGallery'
import { markHeroReady } from '../../lib/heroReady'
import { TLink, useTransition } from '../../components/Transition'
import { Magnetic } from '../../components/ui'
import { scrollToEl } from '../../lib/lenis'
import './hero.css'

const SLIDES = PROJECTS.slice(0, 4)

// "*word*" → italic accent
const renderLine = (line) =>
  line.split(/(\*[^*]+\*)/).map((part, i) =>
    part.startsWith('*') ? <em key={i}>{part.slice(1, -1)}</em> : <span key={i}>{part}</span>
  )

export default function Hero() {
  const root = useRef(null)
  const gallery = useRef(null)
  const [active, setActive] = useState(0)
  const [shown, setShown] = useState(0) // headline currently on screen
  const activeRef = useRef(0)
  const firstHeadline = useRef(true)
  const { ready } = useTransition()

  // headline swaps with the video: old lines slide up and out, then the new ones rise in
  useEffect(() => {
    activeRef.current = active
    if (active === shown) return
    const lines = root.current.querySelectorAll('.hero__line > span')
    if (!ready) return setShown(active)
    gsap.killTweensOf(lines)
    gsap.to(lines, {
      yPercent: -115,
      duration: 0.55,
      stagger: 0.05,
      ease: 'power3.in',
      onComplete: () => setShown(activeRef.current),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  useGSAP(
    () => {
      if (firstHeadline.current) {
        firstHeadline.current = false
        return
      }
      gsap.fromTo('.hero__line > span', { yPercent: 115 }, { yPercent: 0, duration: 1.2, stagger: 0.08, ease: 'expo.out' })
    },
    { scope: root, dependencies: [shown] }
  )

  // progress ring follows the playing video
  useEffect(() => {
    const circle = root.current.querySelector('.hero__ring circle')
    const tick = () => {
      const p = gallery.current?.getProgress?.()
      if (p != null) circle.style.strokeDashoffset = String(126 * (1 - p))
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  // intro, after preloader / page wipe
  useGSAP(
    () => {
      if (!ready) return
      const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.6 } })
      tl.fromTo('.hero__media', { scale: 1.08 }, { scale: 1, duration: 2.2, ease: 'power3.out' }, 0)
        .from('.hero__line > span', { yPercent: 115, stagger: 0.1 }, 0.1)
        .from('[data-hero-fade]', { y: 24, autoAlpha: 0, stagger: 0.08, duration: 1.2 }, 0.6)
    },
    { scope: root, dependencies: [ready] }
  )

  // scroll-out parallax
  useGSAP(
    () => {
      gsap.to('.hero__inner', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero__media', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    },
    { scope: root }
  )

  // progress ring restarts each slide
  useGSAP(
    () => {
      gsap.fromTo('.hero__caption-inner', { yPercent: 100 }, { yPercent: 0, duration: 1, ease: 'expo.out', delay: 0.4 })
    },
    { scope: root, dependencies: [active] }
  )

  const p = SLIDES[active]
  const hidden = { visibility: ready ? 'visible' : 'hidden' }

  return (
    <section className="hero" ref={root}>
      <div className="hero__media">
        <PolygonGallery ref={gallery} media={HOME_HERO_VIDEOS} variant="scatter" playbackRate={0.75} duration={2.6} onChange={setActive} onReady={markHeroReady} />
      </div>
      <div className="hero__shade" />

      <div className="hero__inner wrap" style={hidden}>
        <div className="hero__top">
          <p className="label" data-hero-fade>
            {COMPANY.name}
          </p>
          <p className="hero__intro" data-hero-fade>
            Homes, hospitals and hospitality spaces across Andhra Pradesh &amp; Telangana — built by a team with{' '}
            {COMPANY.experience} years on site.
          </p>
        </div>

        <h1 className="hero__title display" aria-live="polite">
          {HOME_HERO_VIDEOS[shown].headline.map((line, i) => (
            <span className="hero__line" key={`${shown}-${i}`}>
              <span>{renderLine(line)}</span>
            </span>
          ))}
        </h1>

        <div className="hero__bottom">
          <button className="hero__scroll label" onClick={() => scrollToEl('#way', 0)} data-hero-fade>
            <span className="hero__scroll-line" />
            Scroll to explore
          </button>

          <div className="hero__slide" data-hero-fade>
            <div className="hero__count label">
              <span>0{active + 1}</span>
              <span className="hero__count-sep" />
              <span>0{SLIDES.length}</span>
            </div>
            <div className="hero__caption">
              <TLink to={`/projects/${p.slug}`} className="hero__caption-inner" key={p.slug}>
                <span className="hero__caption-kicker">Our work</span>
                <span className="serif">{p.name}</span>
                <span className="hero__caption-meta">
                  {p.location} · {STATUS[p.status]}
                </span>
              </TLink>
            </div>
            <Magnetic>
              <button className="hero__next" onClick={() => gallery.current?.next()} aria-label="Next video">
                <svg className="hero__ring" viewBox="0 0 44 44" aria-hidden="true">
                  <circle cx="22" cy="22" r="20" />
                </svg>
                <svg className="hero__next-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 12h16M14 6l6 6-6 6" />
                </svg>
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  )
}
