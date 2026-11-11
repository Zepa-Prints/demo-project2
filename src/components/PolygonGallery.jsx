import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import PolygonSlider from '../lib/polygon/PolygonSlider'
import { Img } from './ui'
import './polygon.css'

/**
 * React wrapper for the WebGL polygon transition.
 *
 * Pass either `images` (array of urls) or `media` (array of urls and/or
 * { video, poster } objects). Videos play inside the WebGL triangles and the
 * slider moves on when each clip ends.
 *
 * While loading — or if WebGL is unavailable — a plain cross-fade layer is
 * shown (posters / videos), so the hero is never empty.
 */
const PolygonGallery = forwardRef(function PolygonGallery(
  { images, media, variant = 'scatter', autoplay = 6000, detail, duration, playbackRate = 1, onChange, onReady, className = '' },
  ref
) {
  // phones / portrait tablets get the vertical "-m" clips: same sharpness, a third of the pixels
  const [portrait] = useState(() => typeof window !== 'undefined' && window.innerHeight > window.innerWidth && window.innerWidth < 1024)
  const items = (media || images).map((m) =>
    typeof m === 'object' && m.video && portrait ? { ...m, video: m.mobile || m.video, poster: m.posterMobile || m.poster } : m
  )
  const hasVideo = items.some((m) => typeof m === 'object' && m.video)
  const box = useRef(null)
  const slider = useRef(null)
  const fbVideos = useRef([])
  const [index, setIndex] = useState(0)
  const [mode, setMode] = useState('loading') // loading | webgl | fallback
  const visible = useRef(true)
  const key = items.map((m) => (typeof m === 'object' ? m.video : m)).join('|')

  const change = (i) => {
    setIndex(i)
    onChange && onChange(i)
  }

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    const s = new PolygonSlider({
      container: box.current,
      media: items.map((m) => (typeof m === 'object' && m.video ? { video: m.video } : m)),
      variant,
      detail: detail || (isMobile ? 18 : 36),
      duration: duration || (variant === 'flip' ? 2 : 1.9),
      playbackRate,
      onChange: change,
      onReady: () => {
        setMode('webgl')
        onReady && onReady()
      },
      onFail: () => {
        setMode('fallback')
        onReady && onReady()
      },
    })
    slider.current = s
    return () => s.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, variant])

  // fallback navigation
  const goFallback = (i) => {
    const n = items.length
    change(((i % n) + n) % n)
  }

  const api = {
    next: () => (mode === 'webgl' ? slider.current.next() : goFallback(index + 1)),
    prev: () => (mode === 'webgl' ? slider.current.prev() : goFallback(index - 1)),
    goTo: (i) => (mode === 'webgl' ? slider.current.goTo(i) : goFallback(i)),
    /** 0..1 progress of the current video (null for images) */
    getProgress: () => {
      if (mode === 'webgl') return slider.current?.getProgress() ?? null
      const v = fbVideos.current[index]
      return v && v.duration ? v.currentTime / v.duration : null
    },
  }
  useImperativeHandle(ref, () => api)

  // pause video decoding when the hero is off-screen
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting
        slider.current?.setVisible?.(e.isIntersecting)
      },
      { threshold: 0.05 }
    )
    io.observe(box.current)
    return () => io.disconnect()
  }, [])

  // timed autoplay — images only (videos advance when each clip ends)
  useEffect(() => {
    if (!autoplay || hasVideo || mode === 'loading') return
    const t = setInterval(() => {
      if (visible.current && !document.hidden) api.next()
    }, autoplay)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, mode, index, hasVideo])

  // fallback mode with videos: play the active one, advance when it ends
  useEffect(() => {
    if (mode !== 'fallback' || !hasVideo) return
    fbVideos.current.forEach((v, i) => {
      if (!v) return
      if (i === index) {
        v.currentTime = 0
        v.play().catch(() => {})
      } else v.pause()
    })
  }, [mode, index, hasVideo])

  return (
    <div className={`pg pg--${mode} ${className}`}>
      <div className="pg__canvas" ref={box} />
      {mode !== 'webgl' && (
        <div className="pg__fallback">
          {items.map((m, i) => {
            const isVid = typeof m === 'object' && m.video
            const cls = i === index ? 'is-active' : ''
            if (isVid && mode === 'fallback')
              return (
                <video
                  key={i}
                  ref={(el) => {
                    fbVideos.current[i] = el
                    if (el) el.defaultPlaybackRate = el.playbackRate = playbackRate
                  }}
                  className={cls}
                  src={m.video}
                  poster={m.poster}
                  muted
                  playsInline
                  preload={i === 0 ? 'auto' : 'metadata'}
                  onEnded={() => i === index && goFallback(index + 1)}
                />
              )
            // while loading only the first poster is needed (the preloader covers the rest)
            if (mode === 'loading' && i !== 0) return null
            return <Img key={i} img={isVid ? m.poster : m} alt="" className={cls} loading={i === 0 ? 'eager' : 'lazy'} />
          })}
        </div>
      )}
    </div>
  )
})

export default PolygonGallery
