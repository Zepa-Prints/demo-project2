import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { PROCESS } from '../../data/site'
import { Img } from '../../components/ui'
import './process.css'

/** Pinned horizontal scroll on desktop, stacked cards on mobile. */
export default function Process() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 900px)', () => {
        const track = root.current.querySelector('.pr__track')
        const dist = () => track.scrollWidth - window.innerWidth
        const tween = gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => '+=' + dist(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
        gsap.to('.pr__progress i', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: () => '+=' + dist(), scrub: true },
        })
        // inner image parallax tied to the horizontal tween
        gsap.utils.toArray('.pr__card-media .img-wrap', root.current).forEach((el) => {
          gsap.fromTo(
            el,
            { xPercent: -12 },
            {
              xPercent: 12,
              ease: 'none',
              scrollTrigger: {
                trigger: el.closest('.pr__card'),
                containerAnimation: tween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          )
        })
      })
      mm.add('(max-width: 899px)', () => {
        gsap.utils.toArray('.pr__card', root.current).forEach((c) =>
          gsap.from(c, { y: 60, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 88%', once: true } })
        )
      })
      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <section className="pr section--dark" ref={root}>
      <div className="pr__track">
        <div className="pr__intro">
          <span className="idx">04 — How we build</span>
          <h2 className="display h-lg">
            From bare land
            <br />
            to <em>your keys</em>
          </h2>
          <p className="lead">
            Four stages, one accountable team. Every Yashveer project follows the same disciplined path — so the home you are
            promised is the home you receive.
          </p>
          <div className="pr__progress">
            <i />
          </div>
        </div>
        {PROCESS.map((s, i) => (
          <article className="pr__card" key={s.title}>
            <div className="pr__card-media">
              <div className="img-wrap">
                <Img img={s.img} w={1200} alt={s.title} />
              </div>
            </div>
            <div className="pr__card-body">
              <span className="pr__num display">0{i + 1}</span>
              <div>
                <h3 className="serif pr__title">{s.title}</h3>
                <p className="pr__text">{s.text}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
