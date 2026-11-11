// Tiny signal between the home hero and the preloader: the preloader stays up
// until the first hero frame can be shown, so the page never reveals a frozen/black video.
let done = false
const subs = []
export function markHeroReady() {
  if (done) return
  done = true
  subs.splice(0).forEach((f) => f())
}
export function whenHeroReady(fn) {
  if (done) fn()
  else subs.push(fn)
}
