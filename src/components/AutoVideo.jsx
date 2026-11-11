import { useEffect, useRef, useState } from 'react'

/**
 * Background video that only plays while on screen (saves battery and keeps
 * scrolling smooth on phones) and uses the vertical "-m" version in portrait.
 * src: { video, mobile?, poster? }
 */
export default function AutoVideo({ src, className = '', ...rest }) {
  const ref = useRef(null)
  const [portrait] = useState(() => typeof window !== 'undefined' && window.innerHeight > window.innerWidth && window.innerWidth < 1024)
  const url = portrait && src.mobile ? src.mobile : src.video
  const [load, setLoad] = useState(false)
  const inView = useRef(false)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const io = new IntersectionObserver(
      ([e]) => {
        inView.current = e.isIntersecting
        if (e.isIntersecting) {
          setLoad(true)
          if (v.getAttribute('src')) v.play().catch(() => {})
        } else v.pause()
      },
      { rootMargin: '25% 0px' }
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])

  // the source is attached on the first intersection → start playing once it is in the DOM
  useEffect(() => {
    if (load && inView.current) ref.current?.play().catch(() => {})
  }, [load])

  return (
    <video
      ref={ref}
      className={className}
      src={load ? url : undefined}
      poster={src.poster}
      muted
      loop
      playsInline
      preload="none"
      {...rest}
    />
  )
}
