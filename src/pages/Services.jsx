import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { COMPANY, PHOTOS, sm } from '../data/site'
import { TURNKEY_DEFINITION } from '../data/turnkey'
import { useTransition } from '../components/Transition'
import { useLead } from '../components/LeadModal'
import ImageStack from '../components/ImageStack'
import { Arrow } from '../components/ui'
import WhatWeDo from '../sections/turnkey/WhatWeDo'
import Packages from '../sections/turnkey/Packages'
import Quality25 from '../sections/turnkey/Quality25'
import { Pillars, Marquee } from '../sections/home/Way'
import Process from '../sections/home/Process'
import ReachUs from '../sections/home/ReachUs'
import { useDocTitle } from '../hooks/useDocTitle'
import './services.css'

export default function Services() {
  useDocTitle('What we do — Turnkey construction · Yashveer Constructions')
  const root = useRef(null)
  const { ready } = useTransition()
  const { openLead } = useLead()

  useGSAP(
    () => {
      if (!ready) return
      gsap
        .timeline({ defaults: { ease: 'expo.out', duration: 1.4 } })
        .from('.sv-hero__word > span', { yPercent: 115, stagger: 0.09 })
        .from('[data-sv-fade]', { y: 30, autoAlpha: 0, stagger: 0.07, duration: 1.1 }, 0.3)
    },
    { scope: root, dependencies: [ready] }
  )

  return (
    <div className="sv" ref={root}>
      <header className="sv-hero wrap" style={{ visibility: ready ? 'visible' : 'hidden' }}>
        <div className="sv-hero__text">
          <span className="idx" data-sv-fade>
            What we do — {COMPANY.kind}
          </span>
          <h1 className="sv-hero__title display">
            <span className="sv-hero__word">
              <span>Ideate.</span>
            </span>
            <span className="sv-hero__word">
              <span>Design.</span>
            </span>
            <span className="sv-hero__word">
              <span>
                <em>Build.</em>
              </span>
            </span>
          </h1>
          <p className="lead sv-hero__intro" data-sv-fade>
            {TURNKEY_DEFINITION} We work on our own projects — and on yours: your land, your house, your hospital,
            restaurant, warehouse or plant.
          </p>
          <div className="sv-hero__cta" data-sv-fade>
            <button className="btn" onClick={() => openLead('')}>
              Start your project <Arrow />
            </button>
            <a className="btn btn--ghost" href="#quality">
              25-point quality
            </a>
          </div>
        </div>
        <ImageStack
          className="sv-hero__stack"
          images={[sm(PHOTOS.kamalaFront), sm(PHOTOS.svHall), sm(PHOTOS.kamalaKitchen)]}
          caption="Residential · Commercial · Industrial"
        />
      </header>

      <Marquee items={['Ideate', 'Design', 'Build', 'Single-point accountability', 'Fixed pricing', '25-point quality']} />
      <WhatWeDo index="01" />
      <Pillars index="02" />
      <Process index="03" />
      <Packages index="04" />
      <Quality25 index="05" />
      <ReachUs index="06" />
    </div>
  )
}
