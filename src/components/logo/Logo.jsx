import { MARK, WORD, CONS } from './paths'

/**
 * Yashveer Constructions logo (vector, from the brand PDF). Colour = currentColor.
 *  variant="lockup"  mark + YASHVEER / CONSTRUCTIONS side by side (navbar, footer)
 *  variant="stack"   mark above the name (as on the letterhead)
 *  variant="mark"    building mark only
 *  variant="word"    YASHVEER / CONSTRUCTIONS only
 */
const S = 87 / 106 // scale that makes the mark as tall as the two text lines

export default function Logo({ variant = 'lockup', className = '', title = 'Yashveer Constructions', ...rest }) {
  const common = { xmlns: 'http://www.w3.org/2000/svg', role: 'img', 'aria-label': title, className, fill: 'currentColor', ...rest }
  if (variant === 'mark')
    return (
      <svg viewBox="298 169 246 110" {...common}>
        <path d={MARK} />
      </svg>
    )
  if (variant === 'word')
    return (
      <svg viewBox="259 315 323 90" {...common}>
        <path d={WORD} />
        <path d={CONS} />
      </svg>
    )
  if (variant === 'stack')
    return (
      <svg viewBox="255 165 330 245" {...common}>
        <path d={MARK} />
        <path d={WORD} />
        <path d={CONS} />
      </svg>
    )
  return (
    <svg viewBox="-2 -2 548 91" {...common}>
      <path d={MARK} transform={`scale(${S}) translate(-300 -171)`} />
      <g transform="translate(225 0) translate(-261 -317)">
        <path d={WORD} />
        <path d={CONS} />
      </g>
    </svg>
  )
}
