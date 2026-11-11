import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { Img } from './ui'
import './bands.css'

/** Full-bleed image that opens from a rounded inset as it scrolls in, with a quote over it. */
export function ImageBand({ img, kicker, children }) {
  const root = useRef(null)
  useGSAP(
    () => {
      gsap.fromTo(
        '.ib__frame',
        { clipPath: 'inset(12% 14% 12% 14% round 2rem)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0rem)',
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 15%', scrub: true },
        }
      )
      gsap.fromTo(
        '.ib__img',
        { yPercent: -12, scale: 1.25 },
        {
          yPercent: 12,
          scale: 1.05,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      )
      gsap.from('.ib__text > *', {
        y: 40,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 45%', once: true },
      })
    },
    { scope: root }
  )
  return (
    <section className="ib" ref={root}>
      <div className="ib__frame">
        <div className="ib__img">
          <Img img={img} w={2400} alt="" />
        </div>
        <div className="ib__text wrap">
          {kicker && <span className="label">{kicker}</span>}
          <p className="display ib__quote">{children}</p>
        </div>
      </div>
    </section>
  )
}

/** Endless strip of photos — drifts on its own, speeds up with scroll velocity. */
export function PhotoReel({ images, reverse = false }) {
  const root = useRef(null)
  useGSAP(
    () => {
      const track = root.current.querySelector('.pr2__track')
      const tween = gsap.fromTo(
        track,
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, duration: 50, ease: 'none', repeat: -1 }
      )
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const boost = 1 + Math.min(4, Math.abs(self.getVelocity()) / 500)
          gsap.to(tween, {
            timeScale: boost,
            duration: 0.2,
            overwrite: true,
            onComplete: () => gsap.to(tween, { timeScale: 1, duration: 1.2, overwrite: true }),
          })
        },
      })
      return () => st.kill()
    },
    { scope: root }
  )
  const row = images.map((img, i) => (
    <figure className="pr2__item" key={i}>
      <Img img={img} w={900} alt="" />
    </figure>
  ))
  return (
    <div className="pr2" ref={root} aria-hidden="true">
      <div className="pr2__track">
        {row}
        {row}
      </div>
    </div>
  )
}
