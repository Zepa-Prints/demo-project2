import { useRef } from 'react'
import { FOUNDER } from '../data/site'
import { useFadeUp, RevealImage } from './ui'
import './founder-note.css'

/**
 * Small founder section: photo + a short note in his voice.
 * Used on Home, About and Contact, each with its own message.
 *   tone: 'light' | 'dark'   flip: photo on the right
 */
export default function FounderNote({ kicker, quote, children, tone = 'light', flip = false }) {
  const root = useRef(null)
  useFadeUp(root)
  return (
    <section className={`fn fn--${tone} ${flip ? 'fn--flip' : ''} ${tone === 'dark' ? 'section--dark' : ''}`} ref={root}>
      <div className="fn__card wrap">
        <RevealImage img={FOUNDER.photo} alt="Founder of Yashveer Constructions" className="fn__photo" parallax={6} />
        <div className="fn__body">
          <span className="idx" data-fade>
            {kicker}
          </span>
          <blockquote className="fn__quote serif" data-fade>
            <span className="fn__mark" aria-hidden="true">
              &ldquo;
            </span>
            {quote}
          </blockquote>
          <p className="fn__by" data-fade>
            <span className="fn__line" aria-hidden="true" />
            <span>
              <strong>Our founder</strong>
              <br />
              {FOUNDER.role}
            </span>
          </p>
          {children && (
            <div className="fn__cta" data-fade>
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
