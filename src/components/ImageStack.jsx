import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { Img } from './ui'
import './image-stack.css'

/**
 * Layered photo collage: 3 images at different depths that drift at
 * different speeds on scroll, follow the cursor slightly, and reveal with
 * a clip-path wipe. Pass `images` (3 refs) and optional `caption`.
 */
export default function ImageStack({ images, caption, className = '' }) {
  const root = useRef(null)

  useGSAP(
    () => {
      const items = gsap.utils.toArray('.is__item', root.current)
      gsap.fromTo(
        items,
        { clipPath: 'inset(100% 0% 0% 0% round 1rem)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 1rem)',
          duration: 1.6,
          stagger: 0.15,
          ease: 'expo.inOut',
          scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
        }
      )
      items.forEach((el, i) => {
        gsap.fromTo(
          el,
          { yPercent: [10, 30, 50][i] || 20 },
          {
            yPercent: [-10, -30, -50][i] || -20,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        )
      })

      if (!window.matchMedia('(any-pointer: fine)').matches) return
      const inner = gsap.utils.toArray('.is__inner', root.current)
      const setters = inner.map((el) => ({
        x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3' }),
        y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3' }),
      }))
      const move = (e) => {
        const r = root.current.getBoundingClientRect()
        const dx = (e.clientX - r.left) / r.width - 0.5
        const dy = (e.clientY - r.top) / r.height - 0.5
        setters.forEach((s, i) => {
          s.x(dx * (i + 1) * 14)
          s.y(dy * (i + 1) * 14)
        })
      }
      const leave = () => setters.forEach((s) => (s.x(0), s.y(0)))
      root.current.addEventListener('mousemove', move)
      root.current.addEventListener('mouseleave', leave)
      return () => {
        root.current?.removeEventListener('mousemove', move)
        root.current?.removeEventListener('mouseleave', leave)
      }
    },
    { scope: root }
  )

  return (
    <div className={`is ${className}`} ref={root}>
      {images.slice(0, 3).map((img, i) => (
        <figure className={`is__item is__item--${i + 1}`} key={i}>
          <div className="is__inner">
            <Img img={img} w={1200} alt="" />
          </div>
        </figure>
      ))}
      {caption && <span className="is__caption label">{caption}</span>}
    </div>
  )
}
