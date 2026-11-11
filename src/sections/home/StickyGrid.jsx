import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { PHOTOS, SHOWREEL, sm } from '../../data/site'
import { TLink } from '../../components/Transition'
import { Arrow, Img } from '../../components/ui'
import AutoVideo from '../../components/AutoVideo'
import './sticky-grid.css'

// 12 tiles from our own projects, distributed into 3 columns (like the codrops demo)
const TILES = [
  PHOTOS.kamalaFront, PHOTOS.kamalaCourtyard, PHOTOS.kamalaBedroom,
  PHOTOS.svFrontage, PHOTOS.kamalaKitchen, PHOTOS.kamalaBalconies,
  PHOTOS.ishaFront, PHOTOS.kamalaDining, PHOTOS.svHall,
  PHOTOS.kamalaTower, PHOTOS.kamalaBedroom2, PHOTOS.ishaWard,
].map(sm)

// phones: a light swipe strip instead of the pinned zoom
const STRIP = [
  [PHOTOS.kamalaFront, 'Kamala Residency'],
  [PHOTOS.kamalaCourtyard, 'Kamala Residency · courtyard'],
  [PHOTOS.kamalaBedroom, 'Kamala Residency · bedroom'],
  [PHOTOS.ishaWard, 'Isha Hospitals, Guntur'],
  [PHOTOS.svHall, 'Svaadishta, Vijayawada'],
  [PHOTOS.kamalaKitchen, 'Kamala Residency · kitchen'],
]

/**
 * Sticky Grid Scroll — port of codrops/sticky-grid-scroll.
 * Intro = full-bleed showreel video. Then a sticky block where the
 * grid columns slide in from top/bottom, zoom out, and the CTA appears.
 */
export default function StickyGrid() {
  const root = useRef(null)

  useGSAP(
    () => {
      // intro video scale (cheap) — everywhere
      gsap.fromTo(
        '.sg-intro__media',
        { scale: 1 },
        {
          scale: 1.15,
          ease: 'none',
          scrollTrigger: { trigger: '.sg-intro', start: 'top top', end: 'bottom top', scrub: true },
        }
      )
      gsap.from('.sg-intro__caption > *', {
        y: 40,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.sg-intro', start: 'top 60%', once: true },
      })

      const mm = gsap.matchMedia()
      // phones / small tablets: simple fade-ups, no pinning, no scrubbed zoom
      mm.add('(max-width: 767px)', () => {
        gsap.from('.sg-m__head > *', {
          y: 30,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.sg-m', start: 'top 80%', once: true },
        })
        gsap.from('.sg-m__item', {
          x: 60,
          autoAlpha: 0,
          stagger: 0.07,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.sg-m__strip', start: 'top 85%', once: true },
        })
      })
      mm.add('(min-width: 768px)', () => desktop())
      return () => mm.revert()
    },
    { scope: root }
  )

  function desktop() {
    {
      const block = root.current.querySelector('.sg-main')
      const wrapper = block.querySelector('.sg-main__wrapper')
      const content = block.querySelector('.sg-content')
      const title = block.querySelector('.sg-content__title')
      const desc = block.querySelector('.sg-content__description')
      const button = block.querySelector('.sg-content__button')
      const grid = block.querySelector('.sg-gallery__grid')
      const items = [...block.querySelectorAll('.sg-gallery__item')]

      // initContent
      gsap.set([desc, button], { opacity: 0, pointerEvents: 'none' })
      const dy = (content.offsetHeight - title.offsetHeight) / 2
      const titleOffsetY = (dy / content.offsetHeight) * 100
      gsap.set(title, { yPercent: titleOffsetY })

      // groupItemsByColumn
      const numColumns = 3
      const columns = Array.from({ length: numColumns }, () => [])
      items.forEach((item, i) => columns[i % numColumns].push(item))

      // parallax on the wrapper while entering
      gsap.from(wrapper, {
        yPercent: -100,
        ease: 'none',
        scrollTrigger: { trigger: block, start: 'top bottom', end: 'top top', scrub: true },
      })

      // title fade
      gsap.from(title, {
        opacity: 0,
        duration: 0.7,
        ease: 'power1.out',
        scrollTrigger: { trigger: block, start: 'top 57%', toggleActions: 'play none none reset' },
      })

      const gridReveal = () => {
        const tl = gsap.timeline()
        const wh = window.innerHeight
        const d = wh - (wh - grid.offsetHeight) / 2
        columns.forEach((column, colIndex) => {
          const fromTop = colIndex % 2 === 0
          tl.from(
            column,
            { y: d * (fromTop ? -1 : 1), stagger: { each: 0.06, from: fromTop ? 'end' : 'start' }, ease: 'power1.inOut' },
            'grid-reveal'
          )
        })
        return tl
      }

      const gridZoom = () => {
        const tl = gsap.timeline({ defaults: { duration: 1, ease: 'power3.inOut' } })
        tl.to(grid, { scale: 2.05 })
        tl.to(columns[0], { xPercent: -40 }, '<')
        tl.to(columns[2], { xPercent: 40 }, '<')
        tl.to(
          columns[1],
          {
            yPercent: (i) => (i < Math.floor(columns[1].length / 2) ? -1 : 1) * 40,
            duration: 0.5,
            ease: 'power1.inOut',
          },
          '-=0.5'
        )
        return tl
      }

      const toggleContent = (isVisible) => {
        gsap
          .timeline({ defaults: { overwrite: true } })
          .to(title, { yPercent: isVisible ? 0 : titleOffsetY, duration: 0.7, ease: 'power2.inOut' })
          .to(
            [desc, button],
            {
              opacity: isVisible ? 1 : 0,
              duration: 0.4,
              ease: `power1.${isVisible ? 'inOut' : 'out'}`,
              pointerEvents: isVisible ? 'all' : 'none',
            },
            isVisible ? '-=90%' : '<'
          )
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: block, start: 'top 25%', end: 'bottom bottom', scrub: true },
      })
      tl.add(gridReveal())
        .add(gridZoom(), '-=0.6')
        .add(() => toggleContent(tl.scrollTrigger.direction === 1), '-=0.32')
    }
  }

  return (
    <div className="sg" ref={root}>
      <section className="sg-intro">
        <div className="sg-intro__media">
          <AutoVideo src={SHOWREEL} />
        </div>
        <div className="sg-intro__caption wrap">
          <span className="label">Interiors — finished to the last detail</span>
          <p className="display h-md">
            Concrete, glass, light &amp; <em>patience</em>.
          </p>
        </div>
      </section>

      <section className="sg-main">
        <div className="sg-main__wrapper">
          <div className="sg-content">
            <h2 className="sg-content__title display">
              Spaces that <em>inspire</em>, across two states
            </h2>
            <p className="sg-content__description">
              From Kanuru to Guntur to Hyderabad — homes, a hospital and a restaurant, built to one uncompromising standard.
            </p>
            <TLink to="/projects" className="btn sg-content__button">
              Explore all projects <Arrow />
            </TLink>
          </div>
          <div className="sg-gallery">
            <ul className="sg-gallery__grid">
              {TILES.map((t, i) => (
                <li className="sg-gallery__item" key={i}>
                  <Img img={t} w={700} alt="" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="sg-m wrap" aria-label="Our projects">
        <div className="sg-m__head">
          <h2 className="display h-lg">
            Spaces that <em>inspire</em>, across two states
          </h2>
          <p className="sg-m__desc">
            From Kanuru to Guntur to Hyderabad — homes, a hospital and a restaurant, built to one uncompromising standard.
          </p>
        </div>
        <ul className="sg-m__strip">
          {STRIP.map(([img, cap]) => (
            <li className="sg-m__item" key={img}>
              <Img img={sm(img)} w={800} alt={cap} />
              <span className="sg-m__cap">{cap}</span>
            </li>
          ))}
        </ul>
        <TLink to="/projects" className="btn sg-m__btn">
          Explore all projects <Arrow />
        </TLink>
      </section>
    </div>
  )
}
