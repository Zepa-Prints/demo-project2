import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { useTransition } from './Transition'
import { scrollToEl } from '../lib/lenis'
import { Img } from './ui'
import './video-hero.css'

/**
 * Full-screen video hero that plays a sequence of clips.
 *  - each clip wipes in with a clip-path reveal when the previous one ends
 *  - "story" progress bars show the current clip and let you jump between them
 *  - on scroll the video shrinks into a rounded frame while the title drifts up
 *
 * clips: [{ src, poster, label, start?, end? }]  — videos
 *        [{ img, label, duration? }]               — photos (slow zoom, timed)
 */
export default function VideoHero({ clips, kicker, title, intro, scrollTarget, children }) {
  const root = useRef(null)
  const vids = useRef([])
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const prev = useRef(-1)
  const [under, setUnder] = useState(-1) // previous clip stays underneath while the new one wipes in
  const { ready } = useTransition()

  // play the active clip, pause the rest, wipe it in
  useEffect(() => {
    setUnder(prev.current)
    prev.current = active
    vids.current.forEach((v, i) => {
      if (!v) return
      if (i === active) {
        v.currentTime = clips[i].start || 0
        v.play().catch(() => {})
      } else {
        v.pause()
      }
    })
    const el = root.current.querySelectorAll('.vh__clip')[active]
    gsap.fromTo(
      el,
      { clipPath: 'inset(0% 0% 0% 100%)', scale: 1.15 },
      { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.4, ease: 'expo.inOut' }
    )
    gsap.fromTo('.vh__chapter-name', { yPercent: 100 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', delay: 0.4 })
  }, [active])

  // progress bar for the active clip (fallback timer if a clip fails to load)
  useEffect(() => {
    const v = vids.current[active]
    let raf
    // photo slide → timed
    if (clips[active].img) {
      const t0 = performance.now()
      const dur = (clips[active].duration || 6) * 1000
      const step = () => {
        const p = (performance.now() - t0) / dur
        setProgress(Math.min(1, p))
        if (p >= 1) return next()
        raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
      return () => cancelAnimationFrame(raf)
    }
    const tick = () => {
      const s0 = clips[active].start || 0
      if (v && v.duration) {
        const e0 = Math.min(clips[active].end || v.duration, v.duration)
        setProgress(Math.min(1, Math.max(0, (v.currentTime - s0) / (e0 - s0))))
        // clip has an end point → move on when we reach it
        if (clips[active].end && v.currentTime >= clips[active].end) {
          v.pause()
          next()
          return
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    // skip a clip that can't play at all (missing file / unsupported codec)
    const fallback = setTimeout(() => {
      if (!v || v.readyState < 2) next()
    }, 9000)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(fallback)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const next = () => setActive((a) => (a + 1) % clips.length)

  // intro after the page reveal
  useGSAP(
    () => {
      if (!ready) return
      gsap
        .timeline({ defaults: { ease: 'expo.out', duration: 1.6 } })
        .fromTo('.vh__frame', { scale: 1.12 }, { scale: 1, duration: 2.2, ease: 'power3.out' }, 0)
        .from('.vh__line > span', { yPercent: 115, stagger: 0.1 }, 0.15)
        .from('[data-vh-fade]', { y: 24, autoAlpha: 0, stagger: 0.08, duration: 1.2 }, 0.6)
    },
    { scope: root, dependencies: [ready] }
  )

  // scroll: video shrinks into a rounded frame, title rises
  useGSAP(
    () => {
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('.vh__frame', {
        clipPath: 'inset(6% 4% 10% 4% round 2rem)',
        ease: 'none',
        scrollTrigger: st,
      })
      gsap.to('.vh__media', { yPercent: 12, scale: 1.08, ease: 'none', scrollTrigger: st })
      gsap.to('.vh__content', { yPercent: -30, autoAlpha: 0, ease: 'none', scrollTrigger: { ...st, end: '70% top' } })
    },
    { scope: root }
  )

  const hidden = { visibility: ready ? 'visible' : 'hidden' }

  return (
    <section className="vh" ref={root}>
      <div className="vh__frame" style={{ clipPath: 'inset(0% 0% 0% 0% round 0rem)' }}>
        <div className="vh__media">
          {clips.map((c, i) => (
            <div className={`vh__clip ${i === active ? 'is-active' : ''}`} key={i} style={{ zIndex: i === active ? 2 : i === under ? 1 : 0, visibility: i === active || i === under ? 'visible' : 'hidden' }}>
              {c.img ? (
                <Img img={c.img} w={2000} alt={c.label} loading={i === 0 ? 'eager' : 'lazy'} />
              ) : (
              <video
                ref={(el) => (vids.current[i] = el)}
                src={c.src}
                poster={c.poster}
                muted
                playsInline
                preload={i < 2 ? 'auto' : 'metadata'}
                onLoadedMetadata={(e) => {
                  if (clips[i].start && e.currentTarget.currentTime < clips[i].start) e.currentTarget.currentTime = clips[i].start
                }}
                onEnded={() => i === active && next()}
              />
              )}
            </div>
          ))}
        </div>
        <div className="vh__shade" />
      </div>

      <div className="vh__content wrap" style={hidden}>
        <div className="vh__top">
          <span className="label" data-vh-fade>
            {kicker}
          </span>
          <span className="vh__chapter label" data-vh-fade>
            <span className="vh__chapter-num">0{active + 1}</span>
            <span className="vh__chapter-mask">
              <span className="vh__chapter-name" key={active}>
                {clips[active].label}
              </span>
            </span>
          </span>
        </div>

        <div className="vh__bottom">
          <h1 className="vh__title display">
            {title.map((t, i) => (
              <span className="vh__line" key={i}>
                <span>{t}</span>
              </span>
            ))}
          </h1>
          <div className="vh__side">
            {intro && (
              <p className="vh__intro" data-vh-fade>
                {intro}
              </p>
            )}
            <div className="vh__stories" data-vh-fade style={{ '--n': clips.length }}>
              {clips.map((c, i) => (
                <button
                  key={i}
                  className={`vh__story ${i === active ? 'is-active' : ''} ${i < active ? 'is-done' : ''}`}
                  onClick={() => setActive(i)}
                  aria-label={`Play clip: ${c.label}`}
                >
                  <span className="vh__story-bar">
                    <i style={{ transform: `scaleX(${i === active ? progress : i < active ? 1 : 0})` }} />
                  </span>
                  <span className="vh__story-label">{c.label}</span>
                </button>
              ))}
            </div>
            {scrollTarget && (
              <button className="vh__scroll" onClick={() => scrollToEl(scrollTarget, -20)} data-vh-fade>
                <span className="vh__scroll-circle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 5v14M6 13l6 6 6-6" />
                  </svg>
                </span>
                Explore the projects
              </button>
            )}
          </div>
        </div>
        {children}
      </div>
    </section>
  )
}
