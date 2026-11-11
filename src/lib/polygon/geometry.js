import * as THREE from 'three'

// Port of akella/PolygonTransitions getGeometry.js for modern three.js.
// simplex-noise is replaced by a cheap value-noise; the effect only needs
// smooth-ish randomness per triangle.
const hash = (x, y) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}
const smooth = (t) => t * t * (3 - 2 * t)
const noise2D = (x, y) => {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const a = hash(xi, yi)
  const b = hash(xi + 1, yi)
  const c = hash(xi, yi + 1)
  const d = hash(xi + 1, yi + 1)
  const u = smooth(xf)
  const v = smooth(yf)
  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v - 0.5
}

const clamp = (a) => Math.max(0, Math.min(1, a))

export default function getGeometry(detail, offsettop = 0) {
  const geometry = new THREE.BufferGeometry()
  const number = detail
  const width = 2
  const height = 2
  const gran = width / number
  const granH = (gran * Math.sqrt(3)) / 2
  const rows = height / granH

  const offsets = []
  const positions = []
  const centroids = []
  const randoms = []
  const uvs = []
  const bary = []

  for (let j = 0; j < rows; j++) {
    const currentheight = j * granH
    const currentShift = j % 2 === 1 ? -gran / 2 : 0
    for (let i = 0; i <= number; i++) {
      // first triangle
      positions.push(i * gran + currentShift - width / 2, currentheight - height / 2, 0)
      uvs.push((i * gran + currentShift) / width, currentheight / height)
      positions.push(i * gran + gran / 2 + currentShift - width / 2, granH + currentheight - height / 2, 0)
      uvs.push((i * gran + gran / 2 + currentShift) / width, (granH + currentheight) / height)
      positions.push(i * gran - gran / 2 + currentShift - width / 2, granH + currentheight - height / 2, 0)
      uvs.push((i * gran - gran / 2 + currentShift) / width, (granH + currentheight) / height)

      let simp = noise2D((i / rows) * 4, (j / rows) * 4) + Math.random()
      const o = clamp(currentheight / height + (2 * simp) / detail)
      let r = Math.random()
      offsets.push(o, clamp(o + 0.1 * offsettop), clamp(o + 0.1 * offsettop))
      randoms.push(r, r, r)
      const c = [i * gran + currentShift - width / 2, currentheight - height / 2, 0]
      centroids.push(...c, ...c, ...c)
      bary.push(0, 0, 1, 0, 1, 0, 1, 0, 0)

      // second triangle
      positions.push(i * gran + currentShift - width / 2, currentheight - height / 2, 0)
      uvs.push((i * gran + currentShift) / width, currentheight / height)
      positions.push(i * gran + gran + currentShift - width / 2, currentheight - height / 2, 0)
      uvs.push((i * gran + gran + currentShift) / width, currentheight / height)
      positions.push(i * gran + gran / 2 + currentShift - width / 2, granH + currentheight - height / 2, 0)
      uvs.push((i * gran + gran / 2 + currentShift) / width, (granH + currentheight) / height)

      simp = noise2D(((i + 1) / rows) * 4, (j / rows) * 4) + Math.random()
      const o1 = clamp(currentheight / height + (2 * simp) / detail)
      r = Math.random()
      offsets.push(o1, o1, clamp(o1 + 0.1 * offsettop))
      randoms.push(r, r, r)
      centroids.push(...c, ...c, ...c)
      bary.push(0, 0, 1, 0, 1, 0, 1, 0, 0)
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
  geometry.setAttribute('bary', new THREE.BufferAttribute(new Float32Array(bary), 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2))
  geometry.setAttribute('offset', new THREE.BufferAttribute(new Float32Array(offsets), 1))
  geometry.setAttribute('centroid1', new THREE.BufferAttribute(new Float32Array(centroids), 3))
  geometry.setAttribute('random', new THREE.BufferAttribute(new Float32Array(randoms), 1))
  return geometry
}
