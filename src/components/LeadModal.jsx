import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { startScroll, stopScroll } from '../lib/lenis'
import { COMPANY, PHOTOS } from '../data/site'
import ContactForm from './ContactForm'
import { Img } from './ui'
import './lead-modal.css'

const Ctx = createContext({ openLead: () => {} })
export const useLead = () => useContext(Ctx)

export const waLink = (text = 'Hi Yashveer Constructions, I would like to know more about your projects.') =>
  `${COMPANY.whatsapp}?text=${encodeURIComponent(text)}`

export const WhatsAppIcon = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 01-4.8-1.31l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 01-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 012.76 6.67c0 5.2-4.23 9.43-9.44 9.43m8.03-17.46A11.27 11.27 0 0012.05.72C5.8.72.7 5.8.7 12.05c0 2 .52 3.95 1.52 5.67L.6 23.6l6.02-1.58a11.3 11.3 0 005.42 1.38h.01c6.25 0 11.34-5.09 11.34-11.34 0-3.03-1.18-5.88-3.32-8.02" />
  </svg>
)

/** Provides openLead(property?) to the whole app and renders the popover card. */
export function LeadProvider({ children }) {
  const [state, setState] = useState({ open: false, property: '' })
  const root = useRef(null)
  const lastFocus = useRef(null)

  const openLead = useCallback((property = '') => {
    lastFocus.current = document.activeElement
    setState({ open: true, property })
  }, [])

  const close = useCallback(() => {
    if (!root.current) return setState((s) => ({ ...s, open: false }))
    gsap
      .timeline({
        onComplete: () => {
          setState((s) => ({ ...s, open: false }))
          startScroll()
          lastFocus.current?.focus?.()
        },
      })
      .to(root.current.querySelector('.lm__card'), { y: 40, autoAlpha: 0, duration: 0.45, ease: 'power3.in' })
      .to(root.current.querySelector('.lm__backdrop'), { autoAlpha: 0, duration: 0.35 }, '-=0.2')
  }, [])

  // enter animation + scroll lock + keyboard
  useEffect(() => {
    if (!state.open) return
    stopScroll()
    const r = root.current
    const isMobile = window.matchMedia('(max-width: 799px)').matches
    gsap
      .timeline({ defaults: { ease: 'expo.out' } })
      .fromTo(r.querySelector('.lm__backdrop'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 })
      .fromTo(
        r.querySelector('.lm__card'),
        isMobile ? { yPercent: 100, autoAlpha: 1 } : { y: 60, scale: 0.96, autoAlpha: 0 },
        isMobile ? { yPercent: 0, duration: 0.9 } : { y: 0, scale: 1, autoAlpha: 1, duration: 1 },
        0.05
      )
      .fromTo(
        r.querySelector('.lm__media'),
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut' },
        0.1
      )
      .from(r.querySelectorAll('.lm__head > *, .cf > *, .lm__details > *'), { y: 20, autoAlpha: 0, stagger: 0.035, duration: 0.8 }, 0.3)
    setTimeout(() => r.querySelector('input')?.focus({ preventScroll: true }), 500)

    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'Tab') {
        // simple focus trap
        const f = [...r.querySelectorAll('button, a[href], input, select, textarea')].filter((el) => !el.disabled)
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state.open, close])

  return (
    <Ctx.Provider value={{ openLead }}>
      {children}
      {state.open && (
        <div className="lm" ref={root} role="dialog" aria-modal="true" aria-labelledby="lm-title">
          <div className="lm__backdrop" onClick={close} />
          <div className="lm__card" data-lenis-prevent>
            <aside className="lm__media">
              <Img img={PHOTOS.kamalaCourtyard} w={1200} alt="" />
              <div className="lm__media-text">
                <span className="label">Yashveer Constructions</span>
                <p className="serif">
                  Spaces built to <em>outlast us.</em>
                </p>
              </div>
            </aside>

            <div className="lm__body">
              <button className="lm__close" onClick={close} aria-label="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>

              <div className="lm__head">
                <span className="idx">Book a site visit</span>
                <h2 id="lm-title" className="display lm__title">
                  Let&rsquo;s find your <em>place</em>
                </h2>
                <p className="lm__sub">Leave your details and our team will call you back within one working day.</p>
              </div>

              <ContactForm defaultProperty={state.property} />

              <div className="lm__details">
                <a href={COMPANY.phoneHref} className="lm__detail">
                  <span className="label label--muted">Call</span>
                  <span>{COMPANY.phone}</span>
                </a>
                <a href={waLink()} target="_blank" rel="noreferrer" className="lm__detail lm__detail--wa">
                  <span className="label label--muted">WhatsApp</span>
                  <span>
                    <WhatsAppIcon className="lm__wa-icon" /> Chat now
                  </span>
                </a>
                <a href={`mailto:${COMPANY.email}`} className="lm__detail">
                  <span className="label label--muted">Email</span>
                  <span>{COMPANY.email}</span>
                </a>
                <div className="lm__detail">
                  <span className="label label--muted">Visit</span>
                  <span>
                    {COMPANY.address[0]}, {COMPANY.address[1]}
                    <br />
                    <span className="lm__detail-2">Hyderabad: Chandanagar</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  )
}
