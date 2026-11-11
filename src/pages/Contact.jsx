import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { COMPANY, PHOTOS, sm } from '../data/site'
import ImageStack from '../components/ImageStack'
import { Img } from '../components/ui'
import ContactForm from '../components/ContactForm'
import FounderNote from '../components/FounderNote'
import { useTransition } from '../components/Transition'
import { useDocTitle } from '../hooks/useDocTitle'
import './contact.css'

export default function Contact() {
  useDocTitle('Contact — Yashveer Constructions')
  const root = useRef(null)
  const { ready } = useTransition()

  useGSAP(
    () => {
      if (!ready) return
      gsap
        .timeline({ defaults: { ease: 'expo.out', duration: 1.4 } })
        .from('.ct__title-line > span', { yPercent: 115, stagger: 0.08 })
        .from('[data-ct-fade]', { y: 30, autoAlpha: 0, stagger: 0.07, duration: 1.1 }, 0.3)
    },
    { scope: root, dependencies: [ready] }
  )

  return (
    <div className="ct wrap" ref={root} style={{ visibility: ready ? 'visible' : 'hidden' }}>
      <div className="ct__hero">
        <div>
          <span className="idx" data-ct-fade>
            Contact — we reply within a day
          </span>
          <h1 className="ct__title display">
            <span className="ct__title-line">
              <span>Say</span>
            </span>{' '}
            <span className="ct__title-line">
              <span>
                <em>hello</em>
              </span>
            </span>
          </h1>
          <p className="lead ct__intro" data-ct-fade>
            Looking for a home, planning a building of your own, or just curious about our work — talk to us directly. No
            pressure, just honest answers.
          </p>
        </div>
        <ImageStack className="ct__stack" images={[sm(PHOTOS.kamalaFront), sm(PHOTOS.svFrontage), sm(PHOTOS.kamalaBedroom)]} />
      </div>
      <div className="ct__grid">
        <div className="ct__info">
          <p className="lead" data-ct-fade>
            Ask about a project, request a visit, or tell us what you would like to build. We usually reply within a working
            day.
          </p>
          <div className="ct__block" data-ct-fade>
            <span className="label label--muted">Call / WhatsApp</span>
            <a href={COMPANY.phoneHref} className="serif ct__big line-link">
              {COMPANY.phone}
            </a>
            <a href={COMPANY.whatsapp} className="line-link ct__small" target="_blank" rel="noreferrer">
              Chat on WhatsApp ↗
            </a>
          </div>
          <div className="ct__block" data-ct-fade>
            <span className="label label--muted">Email</span>
            <a href={`mailto:${COMPANY.email}`} className="ct__email line-link">
              {COMPANY.email}
            </a>
          </div>
          {COMPANY.offices.map((o, i) => (
            <div className="ct__block" data-ct-fade key={o.label}>
              <span className="label label--muted">{i === 0 ? 'Head office' : 'Hyderabad office'} · {o.label.split(' · ')[1]}</span>
              <p>
                {o.lines.map((l) => (
                  <span key={l}>
                    {l}
                    <br />
                  </span>
                ))}
                <a href={o.map} target="_blank" rel="noopener" className="line-link ct__small">
                  Directions ↗
                </a>
              </p>
            </div>
          ))}
          <p className="ct__small ct__hours" data-ct-fade>
            {COMPANY.hours}
          </p>
        </div>
        <div className="ct__form" data-ct-fade>
          <h2 className="serif ct__form-title">Send an enquiry</h2>
          <ContactForm />
        </div>
      </div>

      <div className="ct__founder">
        <FounderNote
          kicker="You talk to the builder"
          quote="No call centre, no sales script. Ask us anything — and if you want to see how we build, come to the site and we’ll walk you through it ourselves."
        >
          <a className="btn" href={COMPANY.phoneHref}>
            Call {COMPANY.phone}
          </a>
        </FounderNote>
      </div>

      <div className="ct__visit" data-ct-fade>
        <div className="ct__visit-media">
          <Img img={sm(PHOTOS.kamalaCourtyard)} w={1600} alt="Kamala Residency courtyard" />
        </div>
        <div className="ct__visit-body">
          <span className="label">Visit us</span>
          <h2 className="display h-md">
            Our office is inside <em>a building we made.</em>
          </h2>
          <p>
            Come to Flat 501, Kamala Residency in Kanuru — see our finished work for yourself, then talk plans over tea.
          </p>
          <a className="btn btn--light" href={COMPANY.whatsapp} target="_blank" rel="noreferrer">
            Schedule on WhatsApp ↗
          </a>
        </div>
      </div>
      <div className="ct__map" data-ct-fade>
        <iframe
          title="Yashveer Constructions head office, Kamala Residency"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(COMPANY.offices[0].coords)}&z=16&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )
}
