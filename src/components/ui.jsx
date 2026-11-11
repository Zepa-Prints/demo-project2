import { forwardRef, useEffect, useRef, useState } from 'react'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { FALLBACK_IMG, unsplash } from '../data/site'

/** Resolve an image reference: Unsplash id → URL, anything with "/" is used as-is. */
export const src = (ref, w = 1600, h) => (!ref ? '' : ref.includes('/') ? ref : unsplash(ref, w, h))

/** Image with graceful fallback (placeholder → gradient). */
export const Img = forwardRef(function Img({ img, w = 1600, h, alt = '', className = '', ...rest }, ref) {
  const [stage, setStage] = useState(0)
  useEffect(() => setStage(0), [img])
  if (stage === 2) return <div ref={ref} className={`img-fallback ${className}`} role="img" aria-label={alt} />
  return (
    <img
      ref={ref}
      src={stage === 0 ? src(img, w, h) : FALLBACK_IMG}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onError={() => setStage((s) => s + 1)}
      {...rest}
    />
  )
})

/**
 * Image that fills its frame. For small source photos (lowRes) it shows the photo
 * sharp at its natural size over a blurred, darkened copy instead of stretching it.
 */
export function SmartImg({ img, lowRes, alt = '', className = '', ...rest }) {
  if (!lowRes) return <Img img={img} alt={alt} className={className} {...rest} />
  return (
    <span className={`smart-img ${className}`}>
      <Img img={img} alt="" aria-hidden="true" className="smart-img__bg" {...rest} />
      <Img img={img} alt={alt} className="smart-img__fg" {...rest} />
    </span>
  )
}

export const Arrow = ({ className = 'btn__arrow' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
)

export const ArrowUpRight = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
)

/** Magnetic hover wrapper — element drifts toward the pointer. */
export function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia('(any-pointer: fine)').matches) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', leave)
    }
  }, [strength])
  return (
    <span ref={ref} className={className} style={{ display: 'inline-block' }}>
      {children}
    </span>
  )
}

/**
 * Masked line reveal on scroll (GSAP SplitText).
 * as: tag, delay, start: ScrollTrigger start, immediate: play without scroll trigger
 */
export function SplitReveal({ as: Tag = 'div', children, className = '', delay = 0, start = 'top 85%', play = true, ...rest }) {
  const ref = useRef(null)
  useGSAP(
    () => {
      if (!play) return
      let split
      const run = () => {
        split = SplitText.create(ref.current, { type: 'lines', mask: 'lines', linesClass: 'sr-line' })
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.2,
          stagger: 0.09,
          ease: 'expo.out',
          delay,
          scrollTrigger: start ? { trigger: ref.current, start, once: true } : undefined,
        })
        gsap.set(ref.current, { autoAlpha: 1 })
      }
      if (document.fonts?.status === 'loaded') run()
      else document.fonts.ready.then(run)
      return () => split && split.revert()
    },
    { scope: ref, dependencies: [play] }
  )
  return (
    <Tag ref={ref} className={className} style={{ visibility: play ? undefined : 'hidden' }} {...rest}>
      {children}
    </Tag>
  )
}

/** Simple fade-up for a group of children marked with [data-fade]. */
export function useFadeUp(scope, selector = '[data-fade]', deps = []) {
  useGSAP(
    () => {
      // An element may sit inside two components that both call useFadeUp
      // (e.g. ReachUs inside ProjectDetail). Animating it twice leaves it
      // stuck invisible, so each element is claimed by the first caller only.
      const mine = gsap.utils.toArray(selector, scope.current).filter((el) => !el.dataset.fadeClaimed)
      mine.forEach((el) => (el.dataset.fadeClaimed = '1'))
      mine.forEach((el) => {
        gsap.from(el, {
          y: 40,
          autoAlpha: 0,
          duration: 1.2,
          ease: 'expo.out',
          delay: Number(el.dataset.delay || 0),
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })
      return () => mine.forEach((el) => delete el.dataset.fadeClaimed)
    },
    { scope, dependencies: deps }
  )
}

/** Image that reveals with a clip-path wipe and parallaxes inside its frame. */
export function RevealImage({ img, alt, className = '', ratio, parallax = 12, w = 1600, children, ...rest }) {
  const ref = useRef(null)
  useGSAP(
    () => {
      const inner = ref.current.querySelector('.ri__inner')
      gsap.fromTo(
        ref.current,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.5,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
        }
      )
      gsap.fromTo(
        inner,
        { yPercent: -parallax, scale: 1.15 },
        {
          yPercent: parallax,
          scale: 1.15,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      )
    },
    { scope: ref }
  )
  return (
    <div ref={ref} className={`media ri ${className}`} style={ratio ? { aspectRatio: ratio } : undefined} {...rest}>
      <div className="ri__inner" style={{ position: 'absolute', inset: '-2% 0' }}>
        <Img img={img} alt={alt} w={w} />
      </div>
      {children}
    </div>
  )
}
