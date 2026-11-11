import Hero from '../sections/home/Hero'
import Way, { Marquee, Pillars } from '../sections/home/Way'
import Stats from '../sections/home/Stats'
import StickyGrid from '../sections/home/StickyGrid'
import Listings from '../sections/home/Listings'
import Process from '../sections/home/Process'
import ReachUs from '../sections/home/ReachUs'
import FounderNote from '../components/FounderNote'
import { TLink } from '../components/Transition'
import { Arrow } from '../components/ui'
import { PILLARS } from '../data/site'
import { useDocTitle } from '../hooks/useDocTitle'

export default function Home() {
  useDocTitle('Yashveer Constructions — Creating Spaces That Endure')
  return (
    <>
      <Hero />
      <Marquee items={PILLARS.map((p) => p.title)} />
      <Way />
      <Pillars />
      <Stats />
      <StickyGrid />
      <Listings />
      <Process />
      <FounderNote
        kicker="A word from the founder"
        quote="Fourteen years on site taught me one thing: people remember how a building feels long after they forget what it cost. Every Yashveer building is one I would live in myself."
      >
        <TLink to="/about" className="btn btn--ghost">
          Our story <Arrow />
        </TLink>
      </FounderNote>
      <ReachUs />
    </>
  )
}
