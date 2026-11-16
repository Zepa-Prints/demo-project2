import Hero from '../sections/home/Hero'
import Way, { Marquee, Pillars } from '../sections/home/Way'
import Stats from '../sections/home/Stats'
import StickyGrid from '../sections/home/StickyGrid'
import Listings from '../sections/home/Listings'
import Process from '../sections/home/Process'
import ReachUs from '../sections/home/ReachUs'
import WhatWeDo from '../sections/turnkey/WhatWeDo'
import Quality25 from '../sections/turnkey/Quality25'
import FounderNote from '../components/FounderNote'
import { TLink } from '../components/Transition'
import { Arrow } from '../components/ui'
import { useDocTitle } from '../hooks/useDocTitle'

// Flow (client brief): who we are → why turnkey → what we do → how we operate
// (ideate · design · build) → 25-point quality → our work → founder → reach us
export default function Home() {
  useDocTitle('Yashveer Constructions — Turnkey Construction · Ideate, Design, Build')
  return (
    <>
      <Hero />
      <Marquee items={['Ideate', 'Design', 'Build', 'Single-point accountability', 'Fixed pricing', '25-point quality']} />
      <Way />
      <Pillars index="02" />
      <WhatWeDo index="03" />
      <Stats />
      <Process index="04" />
      <Quality25 index="05" />
      <StickyGrid />
      <Listings index="06" />
      <FounderNote
        kicker="A word from the director"
        quote="Fifteen years on site taught me one thing: when one team owns the whole job, nothing falls through the cracks. That is why we build turnkey — one contract, one team, one promise."
      >
        <TLink to="/about" className="btn btn--ghost">
          Meet the team <Arrow />
        </TLink>
      </FounderNote>
      <ReachUs index="07" />
    </>
  )
}
