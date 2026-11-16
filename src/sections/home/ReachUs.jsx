import { useRef } from 'react'
import { COMPANY } from '../../data/site'
import ContactForm from '../../components/ContactForm'
import { SplitReveal, useFadeUp } from '../../components/ui'
import './reach-us.css'

export default function ReachUs({ defaultProperty, index = '05' }) {
  const root = useRef(null)
  useFadeUp(root)
  return (
    <section className="section ru section--paper wrap" id="reach-us" ref={root}>
      <div className="ru__grid">
        <div className="ru__left">
          <span className="idx">{index} — Reach us</span>
          <SplitReveal as="h2" className="display h-lg">
            Planning a <em>project?</em>
          </SplitReveal>
          <p className="lead" data-fade>
            Tell us two things — is it residential, commercial or industrial, and which city? We&rsquo;ll help you understand
            the estimated cost and what to look for in a contractor agreement. Our team calls back within one working day.
          </p>
          <dl className="ru__details" data-fade>
            <div>
              <dt className="label label--muted">Call</dt>
              <dd>
                <a href={COMPANY.phoneHref} className="line-link">
                  {COMPANY.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="label label--muted">Write</dt>
              <dd>
                <a href={`mailto:${COMPANY.email}`} className="line-link">
                  {COMPANY.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="label label--muted">Visit</dt>
              <dd>
                {COMPANY.offices.map((o) => (
                  <a key={o.label} href={o.map} target="_blank" rel="noopener" className="ru__office">
                    <span className="ru__office-label">{o.label}</span>
                    {o.lines.join(', ')}
                  </a>
                ))}
              </dd>
            </div>
            <div>
              <dt className="label label--muted">Hours</dt>
              <dd>{COMPANY.hours}</dd>
            </div>
          </dl>
        </div>
        <div className="ru__right" data-fade>
          <ContactForm defaultProperty={defaultProperty} />
        </div>
      </div>
    </section>
  )
}
