import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { scrollToTop } from '../lib/lenis'
import './transition.css'

const Ctx = createContext(null)
export const useTransition = () => useContext(Ctx)

const labelFor = (path) => {
  if (path === '/') return 'Home'
  if (path.startsWith('/projects/')) return 'Project'
  if (path.startsWith('/projects')) return 'Projects'
  if (path.startsWith('/about')) return 'About'
  if (path.startsWith('/contact')) return 'Contact'
  return 'Yashveer'
}

/**
 * Page transitions: two stacked panels wipe up, the route swaps underneath,
 * then the panels wipe away. `ready` tells pages when they may run intro
 * animations (after preloader / after the wipe-out has started).
 */
export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const overlay = useRef(null)
  const busy = useRef(false)
  const [ready, setReady] = useState(false) // set true by preloader
  const [label, setLabel] = useState('')
  const pending = useRef(null)
  const watchdog = useRef(null)

  const go = useCallback(
    (to) => {
      if (busy.current) return
      const path = to.split('#')[0] || '/'
      if (path === location.pathname) {
        const hash = to.split('#')[1]
        if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
        return
      }
      busy.current = true
      setLabel(labelFor(path))
      const panels = overlay.current.querySelectorAll('.pt__panel')
      const text = overlay.current.querySelector('.pt__label span')
      gsap
        .timeline({
          defaults: { ease: 'power4.inOut' },
          onComplete: () => {
            pending.current = to
            setReady(false)
            navigate(to)
            // if for any reason the route effect doesn't fire, reveal anyway
            watchdog.current = setTimeout(() => reveal(to), 900)
          },
        })
        .set(overlay.current, { pointerEvents: 'auto' })
        .set(panels, { y: 0, visibility: 'visible' })
        .fromTo(panels, { yPercent: 100 }, { yPercent: 0, duration: 0.9, stagger: 0.08 })
        .fromTo(text, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: 'expo.out' }, '-=0.35')
    },
    [location.pathname, navigate]
  )

  // Reveal the new page. Idempotent and error-proof, so the overlay can never stay stuck.
  const revealing = useRef(false)
  const reveal = useCallback((to = '') => {
    if (revealing.current || !busy.current) return
    revealing.current = true
    clearTimeout(watchdog.current)
    const panels = overlay.current.querySelectorAll('.pt__panel')
    const text = overlay.current.querySelector('.pt__label span')
    const finish = () => {
      busy.current = false
      revealing.current = false
      gsap.set(overlay.current, { pointerEvents: 'none' })
      gsap.set(panels, { visibility: 'hidden', yPercent: 100 })
      setReady(true)
      try {
        ScrollTrigger.refresh()
      } catch (e) {
        console.warn('[transition] refresh failed', e)
      }
      const hash = to.split('#')[1]
      if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
    }
    try {
      scrollToTop(true)
      ScrollTrigger.refresh()
    } catch (e) {
      console.warn('[transition] refresh failed', e)
    }
    gsap
      .timeline({ defaults: { ease: 'power4.inOut' }, onComplete: finish })
      .to(text, { yPercent: -110, duration: 0.5, ease: 'power3.in' })
      .to([...panels].reverse(), { yPercent: -100, duration: 0.9, stagger: 0.08 }, '-=0.1')
      .add(() => setReady(true), '-=0.75')
    // hard failsafe: whatever happens, the overlay is gone after 2.5s
    watchdog.current = setTimeout(() => {
      if (busy.current) finish()
    }, 2500)
  }, [])

  // after navigation → reveal on the next frames (page has committed)
  useEffect(() => {
    if (!pending.current) return
    const to = pending.current
    pending.current = null
    requestAnimationFrame(() => requestAnimationFrame(() => reveal(to)))
  }, [location.pathname, reveal])

  // browser back / forward → no wipe, just reset
  useEffect(() => {
    const onPop = () => {
      scrollToTop(true)
      setTimeout(() => ScrollTrigger.refresh(), 60)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return (
    <Ctx.Provider value={{ go, ready, setReady }}>
      {children}
      <div className="pt" ref={overlay} aria-hidden="true">
        <div className="pt__panel pt__panel--a" />
        <div className="pt__panel pt__panel--b">
          <div className="pt__label">
            <span className="display">{label}</span>
          </div>
        </div>
      </div>
    </Ctx.Provider>
  )
}

/** Link that plays the page transition. */
export function TLink({ to, children, onClick, ...rest }) {
  const { go } = useTransition()
  return (
    <a
      href={to}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return
        e.preventDefault()
        onClick && onClick(e)
        go(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
