import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { getLenis } from '../lib/lenis'
import { COMPANY, NAV, PROJECTS } from '../data/site'
import { TLink } from './Transition'
import { Arrow, Magnetic } from './ui'
import Logo from './logo/Logo'
import './footer.css'

const ZEPA = {
  href: 'https://zepa.design',
  logo: 'https://res.cloudinary.com/dakrfj1oh/image/upload/v1781973374/zzepa_fur8kl.png',
  thumb: 'https://res.cloudinary.com/dakrfj1oh/image/upload/v1791489328/zepa_smgmir.png',
}

/** "Made by [zepa]": hovering the logo shows a small preview card, clicking opens zepa.design */
// "Made by Zepa" credit — switched off for now; set to true to show it again
const SHOW_ZEPA = false

function ZepaCredit() {
  return (
    <span className="zc">
      <span className="zc__text">Made by</span>
      <a className="zc__link" data-cursor-hide href={ZEPA.href} target="_blank" rel="noopener" aria-label="Zepa (opens zepa.design)">
        <img className="zc__logo" src={ZEPA.logo} alt="zepa" loading="lazy" />
        <span className="zc__card" aria-hidden="true">
          <img src={ZEPA.thumb} alt="" loading="lazy" />
          <span className="zc__card-meta">
            zepa.design <span className="zc__arrow">↗</span>
          </span>
        </span>
      </a>
    </span>
  )
}

export default function Footer() {
  const root = useRef(null)

  useGSAP(
    () => {
      gsap.from('.ft__word span', {
        yPercent: 100,
        ease: 'none',
        stagger: 0.05,
        scrollTrigger: { trigger: '.ft__word', start: 'top bottom', end: 'bottom bottom', scrub: true },
      })
      gsap.from('.ft__cta-title', {
        yPercent: 30,
        opacity: 0,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
      })
    },
    { scope: root }
  )

  const smoothTop = () => {
    const l = getLenis()
    l ? l.scrollTo(0, { duration: 2 }) : window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="ft section--dark" ref={root}>
      <div className="wrap ft__cta">
        <p className="label label--muted">Begin a conversation</p>
        <TLink to="/contact" className="ft__cta-title display h-lg" data-cursor="Let's talk">
          Let&rsquo;s build your <em>next chapter</em>
          <Arrow className="ft__cta-arrow" />
        </TLink>
      </div>

      <div className="wrap ft__grid">
        <div className="ft__col ft__col--brand">
          <Logo variant="stack" className="ft__logo" title={COMPANY.legal} />
          <p className="ft__muted">{COMPANY.tagline}.</p>
          <p className="ft__telugu" lang="te">{COMPANY.telugu}</p>
        </div>
        <div className="ft__col">
          <h4 className="label label--muted">Quick links</h4>
          {NAV.map((n) => (
            <TLink key={n.to} to={n.to} className="line-link">
              {n.label}
            </TLink>
          ))}
        </div>
        <div className="ft__col">
          <h4 className="label label--muted">Projects</h4>
          {PROJECTS.map((p) => (
            <TLink key={p.slug} to={`/projects/${p.slug}`} className="line-link">
              {p.name}
            </TLink>
          ))}
        </div>
        <div className="ft__col">
          <h4 className="label label--muted">Contact us</h4>
          <a href={COMPANY.phoneHref} className="line-link">
            {COMPANY.phone}
          </a>
          <a href={`mailto:${COMPANY.email}`} className="line-link">
            {COMPANY.email}
          </a>
          {COMPANY.offices.map((o) => (
            <a key={o.label} href={o.map} target="_blank" rel="noopener" className="ft__office">
              <span className="ft__office-label">{o.label}</span>
              {o.lines.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </a>
          ))}
        </div>
      </div>

      <div className={`wrap ft__bar ${SHOW_ZEPA ? '' : 'ft__bar--plain'}`}>
        <span className="ft__muted ft__copy">© {new Date().getFullYear()} {COMPANY.legal}</span>
        {SHOW_ZEPA && <ZepaCredit />}
        <div className="ft__end">
          <div className="ft__social">
            {COMPANY.socials.map((s) => (
              <a key={s.label} href={s.href} className="line-link">
                {s.label}
              </a>
            ))}
          </div>
          <Magnetic>
            <button className="ft__top" onClick={smoothTop} aria-label="Back to top">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 19V5M6 11l6-6 6 6" />
              </svg>
            </button>
          </Magnetic>
        </div>
      </div>

      <div className="ft__word serif" aria-hidden="true">
        {'Yashveer'.split('').map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>
    </footer>
  )
}
