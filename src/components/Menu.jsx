import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { startScroll, stopScroll } from '../lib/lenis'
import { COMPANY, NAV, PHOTOS, PROJECTS, sm } from '../data/site'
import { TLink, useTransition } from './Transition'
import { Img, src } from './ui'
import Logo from './logo/Logo'
import { useLead, waLink, WhatsAppIcon } from './LeadModal'
import './menu.css'

const NAV_IMAGES = { '/': PHOTOS.kamalaFront, '/projects': PHOTOS.kamalaCourtyard, '/about': PHOTOS.kamalaBedroom, '/contact': PHOTOS.svHall }

/**
 * Expanding rounded menu — adapted from codrops/ExpandingRoundedMenu.
 * The rounded top bar expands into a full panel while a cover image
 * un-reveals behind it.
 */
export default function Menu() {
  const root = useRef(null)
  const tl = useRef(null)
  const state = useRef({ isOpen: false, isAnimating: false })
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState(PHOTOS.kamalaFront)
  const { go } = useTransition()
  const { openLead } = useLead()
  const { pathname } = useLocation()

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      gsap.set(q('.menu__content'), { yPercent: -100 })
      gsap.set(q('.cover'), { yPercent: -100 })
      gsap.set(q('.cover__inner'), { yPercent: 100 })

      tl.current = gsap
        .timeline({
          paused: true,
          defaults: { duration: 1.2, ease: 'power4.inOut' },
          onComplete: () => (state.current.isAnimating = false),
          onReverseComplete: () => {
            state.current.isAnimating = false
            root.current.classList.remove('menu--open')
          },
        })
        .addLabel('start', 0)
        .add(() => root.current.classList.add('menu--open'), 'start')
        .fromTo(q('.cover-wrap'), { scale: 1.1 }, { scale: 1, duration: 1.6, ease: 'power3.inOut' }, 'start')
        .to(q('.cover'), { yPercent: 0 }, 'start')
        .to(q('.cover__inner'), { yPercent: 0 }, 'start')
        .addLabel('menu', 0.45)
        .to(q('.menu__content'), { yPercent: 0, duration: 1 }, 'menu')
        .from(
          q('.mnav__item .mnav__text'),
          { yPercent: 110, duration: 0.9, stagger: 0.06, ease: 'expo.out' },
          'menu+=0.45'
        )
        .from(q('[data-menu-fade]'), { y: 30, opacity: 0, duration: 0.8, stagger: 0.04, ease: 'expo.out' }, 'menu+=0.55')
        .from(q('.menu__tagline span'), { yPercent: 105, duration: 1, stagger: 0.04, ease: 'expo.out' }, 'menu+=0.5')
    },
    { scope: root }
  )

  const expand = () => {
    const s = state.current
    if (s.isAnimating || s.isOpen) return
    s.isAnimating = true
    s.isOpen = true
    setOpen(true)
    stopScroll()
    tl.current.timeScale(1).play()
  }
  const collapse = (fast = false) => {
    const s = state.current
    if (!s.isOpen) return
    s.isAnimating = true
    s.isOpen = false
    setOpen(false)
    startScroll()
    tl.current.timeScale(fast ? 1.6 : 1).reverse()
  }
  const toggle = () => (state.current.isOpen ? collapse() : expand())

  // Navigate from inside the panel: start the page wipe, then close quietly behind it.
  const navTo = (to) => (e) => {
    e.preventDefault()
    go(to)
    setTimeout(() => collapse(true), 600)
  }

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && collapse()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // hide bar on scroll down, show on scroll up
  useGSAP(
    () => {
      const bar = root.current.querySelector('.menu__top')
      const st = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          if (state.current.isOpen) return
          const hide = self.direction === 1 && self.scroll() > 240
          gsap.to(bar, { yPercent: hide ? -160 : 0, duration: 0.6, ease: 'power3.out', overwrite: true })
          root.current.classList.toggle('menu--scrolled', self.scroll() > 40)
        },
      })
      return () => st.kill()
    },
    { scope: root }
  )

  return (
    <div className="menu-root" ref={root}>
      <div className="cover-wrap" aria-hidden="true">
        <div className="cover">
          <div className="cover__inner">
            <Img img={PHOTOS.kamalaCourtyard} w={2000} alt="" />
          </div>
        </div>
      </div>

      <header className="menu">
        <div className="menu__top">
          <TLink to="/" className="menu__logo" aria-label="Yashveer Constructions — home">
            <span className="menu__logo-mark" aria-hidden="true">
              <Logo variant="mark" />
            </span>
            <Logo variant="word" className="menu__logo-word" aria-hidden="true" />
          </TLink>

          <nav className="menu__nav-top" aria-label="Primary">
            {NAV.slice(1).map((n) => (
              <TLink key={n.to} to={n.to} className={`line-link ${pathname.startsWith(n.to) ? 'is-active' : ''}`}>
                {n.label}
              </TLink>
            ))}
          </nav>

          <div className="menu__side">
            <a
              href={waLink()}
              target="_blank"
              rel="noreferrer"
              className="menu__wa"
              aria-label="Chat with us on WhatsApp"
              data-cursor=""
            >
              <WhatsAppIcon />
            </a>
            <button
              className="menu__book"
              onClick={() => {
                if (state.current.isOpen) collapse(true)
                openLead()
              }}
            >
              <span className="menu__book-dot" aria-hidden="true" />
              Book now
            </button>
            <button
              className={`menu__toggle ${open ? 'is-open' : ''}`}
              onClick={toggle}
              aria-expanded={open}
              aria-controls="menu-panel"
            >
              <span className="menu__toggle-text">
                <span>Menu</span>
                <span>Close</span>
              </span>
              <span className="menu__toggle-icon" aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>

        <div className="menu__content-wrap">
          <div className="menu__content" id="menu-panel" aria-hidden={!open}>
            <nav className="mnav" aria-label="Menu">
              {NAV.map((n, i) => (
                <a
                  key={n.to}
                  href={n.to}
                  className={`mnav__item ${pathname === n.to ? 'is-current' : ''}`}
                  onClick={navTo(n.to)}
                  onMouseEnter={() => setPreview(NAV_IMAGES[n.to])}
                  tabIndex={open ? 0 : -1}
                >
                  <span className="mnav__num label">0{i + 1}</span>
                  <span className="mnav__mask">
                    <span className="mnav__text serif">{n.label}</span>
                  </span>
                </a>
              ))}
            </nav>

            <div className="menu__preview" data-menu-fade>
              {Object.values(NAV_IMAGES)
                .concat(PROJECTS.map((p) => p.cover))
                .filter((v, i, a) => a.indexOf(v) === i)
                .map((img) => (
                  <img
                    key={img}
                    src={src(sm(img), 900)}
                    alt=""
                    className={img === preview ? 'is-active' : ''}
                    loading="lazy"
                    onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
                  />
                ))}
            </div>

            <div className="menu__col menu__col--projects" data-menu-fade>
              <h4 className="label label--muted">Projects</h4>
              {PROJECTS.map((p) => (
                <a
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  className="line-link"
                  onClick={navTo(`/projects/${p.slug}`)}
                  onMouseEnter={() => setPreview(p.cover)}
                  tabIndex={open ? 0 : -1}
                >
                  {p.name}
                </a>
              ))}
            </div>

            <div className="menu__col menu__col--info" data-menu-fade>
              <h4 className="label label--muted">Get in touch</h4>
              <a className="line-link" href={COMPANY.phoneHref} tabIndex={open ? 0 : -1}>
                {COMPANY.phone}
              </a>
              <a className="line-link" href={`mailto:${COMPANY.email}`} tabIndex={open ? 0 : -1}>
                {COMPANY.email}
              </a>
              <p className="menu__addr">
                {COMPANY.offices[0].lines[0]}
                <br />
                {COMPANY.offices[0].lines[2]}
                <br />
                <span className="menu__addr-2">Also in Chandanagar, Hyderabad</span>
              </p>
              <div className="menu__social">
                {COMPANY.socials.map((s) => (
                  <a key={s.label} href={s.href} className="line-link" tabIndex={open ? 0 : -1}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            <button className="menu__back" onClick={() => collapse()} aria-label="Close menu" tabIndex={open ? 0 : -1}>
              <svg width="10" height="182" viewBox="0 0 10 121" preserveAspectRatio="xMidYMin meet">
                <path d="M5 0 .5 9h9L5 0Zm.5 120.5V8h-1v113h1v-.5Z" />
              </svg>
            </button>

            <div className="menu__bottom">
              <h3 className="menu__tagline serif" aria-hidden="true">
                {'Yashveer'.split('').map((c, i) => (
                  <span key={i}>{c}</span>
                ))}
              </h3>
              <p className="label menu__est" data-menu-fade>
                Constructions · Est. {COMPANY.founded} · {COMPANY.experience} years on site
              </p>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
