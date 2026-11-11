import { TLink } from '../components/Transition'
import { Arrow } from '../components/ui'
import { useDocTitle } from '../hooks/useDocTitle'

export default function NotFound() {
  useDocTitle('Not found — Yashveer Constructions')
  return (
    <section
      className="wrap"
      style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2rem', paddingTop: '6rem' }}
    >
      <span className="idx">Error 404</span>
      <h1 className="display h-xl">
        This plot is <em>still empty</em>
      </h1>
      <div>
        <TLink to="/" className="btn">
          Back to home <Arrow />
        </TLink>
      </div>
    </section>
  )
}
