import * as THREE from 'three'
import { gsap } from '../gsap'
import getGeometry from './geometry'
import { fragment, vertexFlip, vertexScatter } from './shaders'

/**
 * WebGL polygon transition (port of akella/PolygonTransitions "Sketch"),
 * extended to work with VIDEOS as well as images.
 *
 * new PolygonSlider({
 *   container,
 *   media: ['img.jpg', { video: 'clip.mp4' }, ...],   // strings = images, {video} = videos
 *   variant: 'scatter' | 'flip', detail, duration,
 *   advanceOnEnd,           // videos: go to the next slide when the current clip finishes
 *   onChange, onReady, onFail
 * })
 *
 * Video safety: only the visible clip (and the incoming one during a transition)
 * decode at a time; if a clip stops advancing for 3s it is skipped, so the
 * hero can never sit on a frozen frame.
 */
export default class PolygonSlider {
  constructor(opts) {
    this.opts = { detail: 40, duration: 1.8, ease: 'power2.in', variant: 'scatter', advanceOnEnd: true, ...opts }
    this.container = opts.container
    this.index = 0
    this.isRunning = false
    this.progress = { v: 0 }
    this.destroyed = false
    this.visible = true
    this.hasVideo = (opts.media || []).some((m) => typeof m === 'object' && m.video)

    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' })
    } catch (e) {
      opts.onFail && opts.onFail(e)
      return
    }
    // phones: the video is ~1080px tall anyway, so >1.5x pixel ratio only costs GPU time
    const small = Math.min(window.innerWidth, window.innerHeight) < 768
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2))
    this.renderer.setClearColor(0x141413, 1)
    this.container.appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(70, 1, 0.001, 1000)
    this.camera.position.set(0, 0, 2)

    this.render = this.render.bind(this)
    this.resize = this.resize.bind(this)
    this.tick = this.tick.bind(this)

    this.load(opts.media).then((textures) => {
      if (this.destroyed) return
      // images must all load (slide index ↔ caption would drift otherwise); videos only need the
      // first clip — the rest stream in one after another and are skipped until they have data
      const bad = textures.some((t, i) => !t && !this.isVideoSlide(i))
      if (bad || !textures[0] || textures.length < 2) {
        textures.forEach((t) => t && t.dispose())
        opts.onFail && opts.onFail(new Error('media failed to load'))
        return
      }
      this.textures = textures
      this.addObjects()
      this.resize()
      this.ro = new ResizeObserver(this.resize)
      this.ro.observe(this.container)
      if (this.hasVideo) {
        this.playOnly([0])
        gsap.ticker.add(this.tick) // video textures need a render every frame
        this.onVis = () => (this.stall = null) // tab switch shouldn't count as a stall
        document.addEventListener('visibilitychange', this.onVis)
      }
      this.render()
      opts.onReady && opts.onReady()
    })
  }

  /* ---------------- loading ---------------- */
  isVideoSlide(i) {
    const m = this.opts.media[i]
    return typeof m === 'object' && !!m.video
  }

  /**
   * Images: wait for all. Videos: create every <video> now, but only download
   * the first; each following clip starts downloading when the previous one is
   * playable, so the first frame appears as fast as possible on slow networks.
   */
  load(media) {
    const loader = new THREE.TextureLoader()
    loader.setCrossOrigin('anonymous')
    this.vReady = media.map(() => false)
    this.vFailed = media.map(() => false)
    const videoIdx = media.map((m, i) => (typeof m === 'object' && m.video ? i : -1)).filter((i) => i >= 0)
    const vids = {}
    videoIdx.forEach((i) => (vids[i] = this.createVideo(media[i].video, i)))
    // download chain
    videoIdx.reduce(
      (prev, i) =>
        prev.then(() => {
          if (this.destroyed) return
          vids[i].start()
          return vids[i].ready
        }),
      Promise.resolve()
    )
    return Promise.all(
      media.map((m, i) =>
        vids[i]
          ? i === videoIdx[0]
            ? vids[i].ready.then((ok) => (ok ? vids[i].texture : null))
            : Promise.resolve(vids[i].texture)
          : new Promise((resolve) => {
              loader.load(
                m,
                (t) => {
                  t.minFilter = THREE.LinearFilter
                  t.generateMipmaps = false
                  resolve(t)
                },
                undefined,
                () => resolve(null)
              )
            })
      )
    )
  }

  createVideo(url, i) {
    const v = document.createElement('video')
    v.muted = true
    v.defaultMuted = true
    v.playsInline = true
    v.setAttribute('playsinline', '')
    v.setAttribute('muted', '')
    v.crossOrigin = 'anonymous'
    v.preload = 'auto'
    v.loop = false
    // slightly slower than real time so each clip lingers (clips are ~30fps, so 0.75 stays smooth)
    const rate = this.opts.playbackRate || 1
    v.defaultPlaybackRate = rate
    v.playbackRate = rate
    v.addEventListener('play', () => {
      if (v.playbackRate !== rate) v.playbackRate = rate
    })
    const texture = new THREE.VideoTexture(v)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = false

    let settle
    const ready = new Promise((r) => (settle = r))
    let done = false
    const ok = () => {
      if (done) return
      done = true
      this.vReady[i] = true
      settle(true)
    }
    const fail = () => {
      if (done) return
      done = true
      this.vFailed[i] = true
      settle(false)
    }
    v.addEventListener('loadeddata', ok, { once: true })
    v.addEventListener('error', fail, { once: true })
    v.addEventListener('ended', () => {
      if (this.destroyed) return
      // the slide on screen finished → move on (or replay it while the next clip is still loading)
      if (this.textures && this.textures[this.index] && this.textures[this.index].image === v) {
        if (!(this.opts.advanceOnEnd && this.next())) {
          v.currentTime = 0
          v.play().catch(() => {})
        }
      }
    })
    const start = () => {
      v.src = url
      v.load()
      setTimeout(fail, 25000)
    }
    return { texture, ready, start }
  }

  /** a slide can be shown when it is an image, or a video that has data */
  canShow(i) {
    if (!this.textures || !this.textures[i]) return false
    if (!this.isVideo(this.textures[i])) return true
    return this.vReady[i] && !this.vFailed[i]
  }

  isVideo(t) {
    return t && t.image && t.image.tagName === 'VIDEO'
  }

  /** play the given slide indexes, pause all others */
  playOnly(indexes) {
    if (!this.textures) return
    this.textures.forEach((t, i) => {
      if (!this.isVideo(t)) return
      const v = t.image
      if (indexes.includes(i) && this.visible) {
        if (v.paused) v.play().catch(() => {})
      } else if (!v.paused) {
        v.pause()
      }
    })
  }

  setVisible(visible) {
    this.visible = visible
    this.stall = null
    if (!this.textures) return
    this.playOnly(this.isRunning ? [this.index, this.nextIndex] : [this.index])
  }

  /* ---------------- scene ---------------- */
  addObjects() {
    const vertexShader = this.opts.variant === 'flip' ? vertexFlip : vertexScatter
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        progress: { value: 0 },
        resolution: { value: new THREE.Vector4() },
        texture1: { value: this.textures[0] },
      },
      transparent: true,
      vertexShader,
      fragmentShader: fragment,
      depthTest: false,
      depthWrite: false,
    })
    this.material1 = this.material.clone()
    this.material1.uniforms.texture1.value = this.textures[1]

    const geo = getGeometry(this.opts.detail, this.opts.variant === 'flip' ? 0 : 0.9)
    this.currentMesh = new THREE.Mesh(geo, this.material)
    this.nextMesh = new THREE.Mesh(geo, this.material1)
    this.nextMesh.renderOrder = 0
    this.currentMesh.renderOrder = 1
    this.scene.add(this.nextMesh)
    this.scene.add(this.currentMesh)
  }

  resize() {
    if (!this.material) return
    const w = this.container.offsetWidth
    const h = this.container.offsetHeight
    if (!w || !h) return
    this.renderer.setSize(w, h)
    this.camera.aspect = w / h
    this.w = w
    this.h = h
    this.applyCover(this.material)
    this.applyCover(this.material1)
    this.nextMesh.scale.set(this.camera.aspect, 1, 1)
    this.currentMesh.scale.set(this.camera.aspect, 1, 1)
    const dist = this.camera.position.z
    this.camera.fov = 2 * (180 / Math.PI) * Math.atan(2 / (2 * dist))
    this.camera.updateProjectionMatrix()
    this.render()
  }

  // per-texture "cover" so mixed sizes never stretch (works for images and videos)
  applyCover(m) {
    if (!this.w) return
    const el = m.uniforms.texture1.value.image
    const nw = (el && (el.videoWidth || el.naturalWidth)) || 16
    const nh = (el && (el.videoHeight || el.naturalHeight)) || 9
    const aspect = nh / nw
    const { w, h } = this
    let a1, a2
    if (h / w < aspect) {
      a1 = 1
      a2 = h / w / aspect
    } else {
      a1 = (w / h) * aspect
      a2 = 1
    }
    m.uniforms.resolution.value.set(w, h, a1, a2)
  }

  /* ---------------- navigation ---------------- */
  goTo(target) {
    if (!this.material || this.isRunning || this.destroyed) return false
    const n = this.textures.length
    const nextIndex = ((target % n) + n) % n
    if (nextIndex === this.index || !this.canShow(nextIndex)) return false
    this.isRunning = true
    this.nextIndex = nextIndex
    const incoming = this.textures[nextIndex]
    if (this.isVideo(incoming)) incoming.image.currentTime = 0
    this.material1.uniforms.texture1.value = incoming
    this.applyCover(this.material1)
    this.playOnly([this.index, nextIndex])
    this.opts.onChange && this.opts.onChange(nextIndex)
    this.tween = gsap.to(this.progress, {
      v: 1,
      duration: this.opts.duration,
      ease: this.opts.ease,
      onUpdate: this.render,
      onComplete: () => {
        this.index = nextIndex
        this.material.uniforms.texture1.value = this.textures[nextIndex]
        this.material1.uniforms.texture1.value = this.textures[(nextIndex + 1) % n]
        this.applyCover(this.material)
        this.applyCover(this.material1)
        this.progress.v = 0
        this.isRunning = false
        this.playOnly([nextIndex])
        this.stall = { t: performance.now(), time: -1 }
        this.lastDrawn = -1
        this.render()
      },
    })
    return true
  }

  // step to the next/previous slide that is ready (skips clips still loading or broken)
  step(dir) {
    if (!this.textures) return false
    const n = this.textures.length
    for (let k = 1; k < n; k++) {
      const i = (((this.index + dir * k) % n) + n) % n
      if (this.canShow(i)) return this.goTo(i)
    }
    return false
  }
  next() {
    return this.step(1)
  }
  prev() {
    return this.step(-1)
  }

  get count() {
    return this.textures ? this.textures.length : 0
  }

  /** 0..1 playback progress of the slide on screen (videos only) */
  getProgress() {
    const t = this.textures && this.textures[this.index]
    if (!this.isVideo(t)) return null
    const v = t.image
    return v.duration ? v.currentTime / v.duration : 0
  }

  /* ---------------- frame loop (video only) ---------------- */
  tick() {
    if (!this.visible || this.destroyed || !this.textures || this.isRunning) return // transitions draw via their tween
    // stall guard: if the visible clip hasn't advanced for 3s, skip it
    const t = this.textures[this.index]
    if (this.isVideo(t) && !this.isRunning) {
      const v = t.image
      const now = performance.now()
      if (!this.stall || v.currentTime !== this.stall.time) {
        this.stall = { t: now, time: v.currentTime }
      } else if (now - this.stall.t > 3000) {
        this.stall = { t: now, time: -1 }
        if (!this.next()) v.play().catch(() => {})
      }
      // nothing new to draw between video frames (30fps clip on a 60–120Hz screen)
      if (v.currentTime === this.lastDrawn) return
      this.lastDrawn = v.currentTime
    }
    this.render()
  }

  render() {
    if (!this.material || this.destroyed) return
    this.material.uniforms.progress.value = this.progress.v
    this.renderer.render(this.scene, this.camera)
  }

  destroy() {
    this.destroyed = true
    gsap.ticker.remove(this.tick)
    this.onVis && document.removeEventListener('visibilitychange', this.onVis)
    this.tween && this.tween.kill()
    this.ro && this.ro.disconnect()
    if (this.currentMesh) this.currentMesh.geometry.dispose()
    this.material && this.material.dispose()
    this.material1 && this.material1.dispose()
    this.textures &&
      this.textures.forEach((t) => {
        if (this.isVideo(t)) {
          t.image.pause()
          t.image.removeAttribute('src')
          t.image.load()
        }
        t.dispose()
      })
    if (this.renderer) {
      this.renderer.dispose()
      this.renderer.forceContextLoss()
      this.renderer.domElement.remove()
    }
  }
}
