import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { EXPERIENCE, TEAM } from '../../data/turnkey'
import { Img, SplitReveal, useFadeUp } from '../../components/ui'
import './team.css'

/** Directors & design team. Members without a photo get a yellow monogram. */
export function Team() {
  const root = useRef(null)
  useFadeUp(root)
  return (
    <section className="section tm wrap" ref={root} id="team">
      <div className="section-head">
        <span className="idx">Leadership</span>
        <SplitReveal as="h2" className="display h-lg">
          The people who <em>build it</em>
        </SplitReveal>
      </div>
      <div className="tm__grid">
        {TEAM.map((m, i) => (
          <article className={`tm__card ${i === 0 ? 'tm__card--lead' : ''}`} key={m.name} data-fade data-delay={i * 0.08}>
            <div className="tm__photo">
              {m.photo ? (
                <Img img={m.photo} alt={m.name} />
              ) : (
                <span className="tm__mono display" aria-hidden="true">
                  {m.initials}
                </span>
              )}
            </div>
            <div className="tm__body">
              <span className="label label--muted">{m.role}</span>
              <h3 className="serif tm__name">{m.name}</h3>
              <p className="tm__bio">{m.bio}</p>
              <ul className="tm__creds">
                {m.credentials.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

/** "We have done more" — every kind of project the team has delivered (no names, no places). */
export function Experience({ dark = true }) {
  const root = useRef(null)
  useGSAP(
    () => {
      gsap.from('.xp__chip', {
        y: 18,
        autoAlpha: 0,
        stagger: 0.025,
        duration: 0.7,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
      })
    },
    { scope: root }
  )
  return (
    <section className={`section xp ${dark ? 'section--dark' : ''}`} ref={root}>
      <div className="wrap xp__grid">
        <div className="xp__head">
          <span className="idx">Experience</span>
          <SplitReveal as="h2" className="display h-md">
            We&rsquo;ve built a lot. <em>We can build more.</em>
          </SplitReveal>
          <p className="lead">
            Before Yashveer, our team delivered every kind of construction for a large corporate builder — homes, hospitals,
            kitchens and factories, from design to execution.
          </p>
        </div>
        <div className="xp__lists">
          <div>
            <span className="label label--muted">Projects delivered</span>
            <ul className="xp__chips">
              {EXPERIENCE.projects.map((p) => (
                <li className="xp__chip" key={p}>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="label label--muted">Hands-on expertise</span>
            <ul className="xp__chips xp__chips--skills">
              {EXPERIENCE.skills.map((p) => (
                <li className="xp__chip" key={p}>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
