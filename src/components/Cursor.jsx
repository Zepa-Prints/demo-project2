import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import './cursor.css'

/**
 * Follower cursor (inspired by the LinesToLayout cursor).
 *  - grows on links/buttons
 *  - shows a label on elements with data-cursor="View" (any text)
 * Only enabled for fine pointers.
 */
export default function Cursor() {
  const ring = useRef(null)
  const label = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(any-pointer: fine)').matches) return
    const el = ring.current
    const pos = { x: innerWidth / 2, y: innerHeight / 2 }
    const target = { ...pos }
    let visible = false

    const xTo = gsap.quickSetter(el, 'x', 'px')
    const yTo = gsap.quickSetter(el, 'y', 'px')

    const onMove = (e) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!visible) {
        visible = true
        pos.x = target.x
        pos.y = target.y
        gsap.to(el, { opacity: 1, duration: 0.3 })
      }
    }

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.18
      pos.y += (target.y - pos.y) * 0.18
      xTo(pos.x)
      yTo(pos.y)
    }
    gsap.ticker.add(tick)

    const onOver = (e) => {
      // elements marked data-cursor-hide get the normal system pointer instead
      const hide = !!e.target.closest('[data-cursor-hide]')
      el.classList.toggle('cursor--hide', hide)
      if (hide) return
      const withLabel = e.target.closest('[data-cursor]')
      if (withLabel && withLabel.dataset.cursor) {
        label.current.textContent = withLabel.dataset.cursor
        el.classList.add('cursor--label')
        el.classList.remove('cursor--link')
        return
      }
      el.classList.remove('cursor--label')
      const link = e.target.closest('a, button, [role="button"], input, select, textarea, label')
      el.classList.toggle('cursor--link', !!link)
    }
    const onLeave = () => {
      visible = false
      gsap.to(el, { opacity: 0, duration: 0.3 })
    }
    const onDown = () => el.classList.add('cursor--down')
    const onUp = () => el.classList.remove('cursor--down')

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.documentElement.addEventListener('mouseleave', onLeave)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  return (
    <div className="cursor" ref={ring} aria-hidden="true">
      <div className="cursor__ring" />
      <span className="cursor__label" ref={label} />
    </div>
  )
}
