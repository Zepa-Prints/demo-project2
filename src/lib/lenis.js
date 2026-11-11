import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap'

// Single Lenis instance, synced with GSAP ScrollTrigger (same approach as the
// codrops sticky-grid demo).
let lenis = null

export function initLenis() {
  if (lenis || prefersReducedMotion()) return lenis
  lenis = new Lenis({
    lerp: 0.085,
    wheelMultiplier: 1.1,
    touchMultiplier: 1.4,
  })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export const getLenis = () => lenis

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate, force: true })
  else window.scrollTo(0, 0)
}

export function scrollToEl(target, offset = -40) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.6 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

export const stopScroll = () => lenis && lenis.stop()
export const startScroll = () => lenis && lenis.start()
