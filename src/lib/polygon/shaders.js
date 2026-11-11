// Shaders adapted from akella/PolygonTransitions (MIT).
// "scatter" = demo 2 (triangles fly apart), "flip" = demo 1 (triangles rotate away).

const common = /* glsl */ `
uniform float progress;
uniform vec4 resolution;
varying vec2 vUv;
varying float vProgress;
attribute float offset;
attribute float random;
attribute vec3 centroid1;

mat4 rotationMatrix(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;
  return mat4(oc * axis.x * axis.x + c,  oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s, 0.0,
              oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s, 0.0,
              oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c, 0.0,
              0.0, 0.0, 0.0, 1.0);
}
vec3 rotate(vec3 v, vec3 axis, float angle) {
  return (rotationMatrix(axis, angle) * vec4(v, 1.0)).xyz;
}
float easeOut(float t) { return t * t * t; }
`

export const vertexScatter = /* glsl */ `
${common}
void main() {
  float PI = 3.141592653589793;
  vUv = uv;
  vec3 newpos = position;
  float o = 1. - offset;
  float prog = clamp((progress - o * 0.6) / 0.4, 0., 1.);
  vProgress = prog;
  newpos.y += easeOut(prog) * 1.5 * sin(PI * random);
  newpos.x += easeOut(prog) * 1.5 * cos(PI * random);
  newpos = rotate(newpos - centroid1, vec3(0., 0., 1.), prog * PI * (random - 0.5)) + centroid1;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);
}
`

export const vertexFlip = /* glsl */ `
${common}
void main() {
  float PI = 3.141592653589793;
  vUv = uv;
  vec3 newpos = position;
  float o = 1. - offset;
  float prog = clamp((progress - o * 0.9) / 0.1, 0., 1.);
  vProgress = prog;
  newpos = rotate(newpos - centroid1, vec3(1., 0., 0.), -prog * PI) + centroid1;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);
}
`

export const fragment = /* glsl */ `
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
varying float vProgress;
void main() {
  vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);
  vec4 t = texture2D(texture1, newUV);
  float opa = 1. - vProgress;
  gl_FragColor = vec4(t.rgb, opa);
}
`
