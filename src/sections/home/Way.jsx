import { useRef } from 'react'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '../../lib/gsap'
import { COMPANY, PHOTOS, PILLARS, sm } from '../../data/site'
import { TLink } from '../../components/Transition'
import { Arrow, RevealImage, src, useFadeUp } from '../../components/ui'
import './way.css'

/* ---------- marquee ----------
   The loop itself is a CSS animation (runs on the compositor, free on phones).
   On desktop it also reacts to scroll speed/direction by changing the
   animation's playbackRate — no new tweens are created while scrolling. */
export function Marquee({ items, dark = false }) {
  const root = useRef(null)
  useGSAP(
    () => {
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
      const track = root.current.querySelector('.mq__track')
      const anim = track.getAnimations ? track.getAnimations()[0] : null
      if (!anim) return
      const speed = { v: 1 }
      const apply = () => (anim.playbackRate = speed.v)
      let target = 1
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const boost = 1 + Math.min(4, Math.abs(self.getVelocity()) / 500)
          target = self.direction
          gsap.to(speed, { v: target * boost, duration: 0.25, overwrite: true, onUpdate: apply })
        },
        onToggle: (self) => (self.isActive ? anim.play() : anim.pause()),
      })
      // ease back to normal speed when scrolling stops
      const settle = () => gsap.to(speed, { v: target, duration: 1.2, overwrite: true, onUpdate: apply })
      ScrollTrigger.addEventListener('scrollEnd', settle)
      return () => {
        st.kill()
        ScrollTrigger.removeEventListener('scrollEnd', settle)
      }
    },
    { scope: root }
  )
  const row = items.map((t, i) => (
    <span className="mq__item" key={i}>
      <span className="serif">{t}</span>
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path d="M10 0l2.4 7.6L20 10l-7.6 2.4L10 20l-2.4-7.6L0 10l7.6-2.4z" />
      </svg>
    </span>
  ))
  return (
    <div className={`mq ${dark ? 'mq--dark' : ''}`} ref={root} aria-hidden="true">
      <div className="mq__track">
        {row}
        {row}
        {row}
        {row}
      </div>
    </div>
  )
}

/* ---------- The Yashveer Way ---------- */
export default function Way() {
  const root = useRef(null)
  useFadeUp(root)

  useGSAP(
    () => {
      const run = () => {
        const split = SplitText.create('.way__statement', { type: 'words' })
        gsap.fromTo(
          split.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: { trigger: '.way__statement', start: 'top 80%', end: 'bottom 45%', scrub: true },
          }
        )
      }
      document.fonts.ready.then(run)
    },
    { scope: root }
  )

  return (
    <section className="section way wrap" id="way" ref={root}>
      <div className="way__top">
        <div className="way__text">
          <div className="way__head">
            <span className="idx" data-fade>
              01 — The Yashveer Way
            </span>
          </div>
          <p className="way__statement display">
            Embodying the spirit of modern India, we understand that a living space transcends mere walls — it&rsquo;s where{' '}
            <em>dreams unfold</em> and lives are truly lived.
          </p>
        </div>
        <figure className="way__figure">
          <RevealImage img={sm(PHOTOS.kamalaCourtyard)} alt="Landscaped courtyard at Kamala Residency" className="way__figure-img" ratio="4 / 5" w={1000} parallax={14} />
          <figcaption className="way__figure-cap" data-fade>
            <span className="label">The courtyard</span>
            <span>Kamala Residency, Vijayawada</span>
          </figcaption>
        </figure>
      </div>

      <div className="way__grid">
        <RevealImage img={PHOTOS.kamalaTower} alt="A Yashveer residential building" className="way__img" ratio="4 / 5" w={1200} />
        <div className="way__copy">
          <p className="lead" data-fade>
            Yashveer Constructions was founded in {COMPANY.founded}, but the hands behind it have been building for{' '}
            {COMPANY.experience} years. That experience now goes into homes, hospitals and hospitality spaces across Andhra
            Pradesh and Telangana.
          </p>
          <p className="lead" data-fade data-delay="0.1">
            We are committed to creating more than just buildings: spaces that age well, communities that feel like
            neighbourhoods, and assets that grow in value. Drawing from a long legacy on site, we blend expertise with an
            unwavering dedication to quality — so your aspirations find a canvas to extend and flourish.
          </p>
          <div data-fade data-delay="0.2">
            <TLink to="/about" className="btn">
              Know more <Arrow />
            </TLink>
          </div>
        </div>
        <RevealImage img={sm(PHOTOS.kamalaBedroom)} alt="Bedroom at Kamala Residency" className="way__img way__img--sm" ratio="3 / 4" w={900} />
      </div>
    </section>
  )
}

/* ---------- Pillars: hover rows with floating image ---------- */
export function Pillars() {
  const root = useRef(null)
  const float = useRef(null)

  useGSAP(
    () => {
      gsap.from('.pl-row', {
        y: 60,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.pl-rows', start: 'top 80%', once: true },
      })
      gsap.from('.pl-row__rule', {
        scaleX: 0,
        transformOrigin: '0 50%',
        stagger: 0.08,
        duration: 1.6,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: '.pl-rows', start: 'top 80%', once: true },
      })

      if (!window.matchMedia('(any-pointer: fine)').matches) return
      const el = float.current
      const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' })
      const rTo = gsap.quickTo(el, 'rotation', { duration: 0.9, ease: 'power3' })
      let lastX = 0
      const move = (e) => {
        const r = root.current.getBoundingClientRect()
        xTo(e.clientX - r.left)
        yTo(e.clientY - r.top)
        rTo(gsap.utils.clamp(-14, 14, (e.clientX - lastX) * 0.6))
        lastX = e.clientX
      }
      root.current.addEventListener('mousemove', move)
      return () => root.current && root.current.removeEventListener('mousemove', move)
    },
    { scope: root }
  )

  const show = (i) => {
    const imgs = float.current.querySelectorAll('img')
    imgs.forEach((im, j) => im.classList.toggle('is-active', i === j))
    gsap.to(float.current, { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'expo.out' })
  }
  const hide = () => gsap.to(float.current, { scale: 0.6, autoAlpha: 0, duration: 0.5, ease: 'power3.out' })

  return (
    <section className="section pillars wrap" ref={root}>
      <div className="section-head">
        <span className="idx">02 — What we stand for</span>
        <h2 className="display h-lg">
          Four promises, <em>built in</em>
        </h2>
      </div>

      <div className="pl-rows" onMouseLeave={hide}>
        {PILLARS.map((p, i) => (
          <div className="pl-row" key={p.title} onMouseEnter={() => show(i)}>
            <span className="pl-row__rule" />
            <span className="pl-row__num label">0{i + 1}</span>
            <h3 className="pl-row__title serif">{p.title}</h3>
            <p className="pl-row__text">{p.text}</p>
          </div>
        ))}
        <span className="pl-row__rule pl-row__rule--last" />
      </div>

      <div className="pl-float" ref={float} aria-hidden="true">
        {PILLARS.map((p) => (
          <img key={p.title} src={src(sm(p.img), 700)} alt="" loading="lazy" />
        ))}
      </div>
    </section>
  )
}
