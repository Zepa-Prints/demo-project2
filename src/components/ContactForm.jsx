import { useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { PROJECTS } from '../data/site'
import { Arrow } from './ui'
import './contact-form.css'

const initial = { name: '', mobile: '', email: '', property: '', consent: false }

/**
 * "Reach Us" enquiry form.
 * On Netlify, submissions go to Netlify Forms (form name "enquiry" — the
 * matching hidden form lives in index.html so Netlify detects it at deploy).
 * In local dev (npm run dev) nothing is sent; the data is logged instead.
 */
const encode = (obj) =>
  Object.keys(obj)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]))
    .join('&')
export default function ContactForm({ defaultProperty = '', dark = false }) {
  const [data, setData] = useState({ ...initial, property: defaultProperty })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const formRef = useRef(null)

  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const validate = () => {
    const e = {}
    if (!data.name.trim()) e.name = 'Please tell us your name'
    if (!/^(\+?91[\s-]?)?[6-9]\d{9}$/.test(data.mobile.replace(/\s/g, ''))) e.mobile = 'Enter a valid 10-digit mobile number'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Enter a valid email'
    if (!data.property) e.property = 'Select a property'
    if (!data.consent) e.consent = 'Please accept to continue'
    return e
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    if (sending) return
    const e = validate()
    setErrors(e)
    setSendError('')
    if (Object.keys(e).length) {
      gsap.fromTo(formRef.current, { x: -8 }, { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' })
      return
    }
    if (import.meta.env.PROD) {
      setSending(true)
      try {
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: encode({
            'form-name': 'enquiry',
            'bot-field': '',
            name: data.name,
            mobile: data.mobile,
            email: data.email,
            property: data.property,
            consent: data.consent ? 'yes' : 'no',
            page: window.location.pathname,
          }),
        })
        if (!res.ok) throw new Error('HTTP ' + res.status)
      } catch (err) {
        console.error('[Yashveer] enquiry failed', err)
        setSending(false)
        setSendError('Sorry, we couldn’t send that. Please call or WhatsApp us — details below.')
        return
      }
      setSending(false)
    } else {
      console.info('[Yashveer] enquiry (dev mode — not sent)', data)
    }
    gsap.to(formRef.current.querySelectorAll('.cf__field, .cf__consent, .cf__submit'), {
      y: -20,
      autoAlpha: 0,
      stagger: 0.04,
      duration: 0.5,
      ease: 'power3.in',
      onComplete: () => setSent(true),
    })
  }

  if (sent)
    return (
      <div className={`cf cf--sent ${dark ? 'cf--dark' : ''}`}>
        <span className="cf__tick" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </span>
        <h3 className="display h-md">
          Thank you, <em>{data.name.split(' ')[0]}</em>.
        </h3>
        <p className="lead">Our team will call you on {data.mobile} within one working day.</p>
        <button
          className="btn btn--ghost"
          onClick={() => {
            setData({ ...initial, property: defaultProperty })
            setSent(false)
          }}
        >
          Send another enquiry
        </button>
      </div>
    )

  const field = (k, label, type = 'text', extra = {}) => (
    <label className={`cf__field ${errors[k] ? 'has-error' : ''} ${data[k] ? 'is-filled' : ''}`}>
      <input type={type} value={data[k]} onChange={set(k)} placeholder=" " {...extra} />
      <span className="cf__label">
        {label}
        <sup>*</sup>
      </span>
      <span className="cf__line" />
      {errors[k] && <span className="cf__err">{errors[k]}</span>}
    </label>
  )

  return (
    <form
      ref={formRef}
      className={`cf ${dark ? 'cf--dark' : ''}`}
      onSubmit={onSubmit}
      noValidate
      name="enquiry"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
    >
      <input type="hidden" name="form-name" value="enquiry" />
      {field('name', 'Name', 'text', { autoComplete: 'name' })}
      {field('mobile', 'Mobile No.', 'tel', { autoComplete: 'tel', inputMode: 'tel' })}
      {field('email', 'Email', 'email', { autoComplete: 'email' })}
      <label className={`cf__field cf__field--select ${errors.property ? 'has-error' : ''} ${data.property ? 'is-filled' : ''}`}>
        <select value={data.property} onChange={set('property')}>
          <option value="" disabled hidden></option>
          {PROJECTS.map((p) => (
            <option key={p.slug} value={p.name}>
              {p.name} — {p.city}
            </option>
          ))}
          <option value="Build with us (new construction)">Build with us — new construction</option>
          <option value="Not sure yet">Not sure yet</option>
        </select>
        <span className="cf__label">
          Select Property<sup>*</sup>
        </span>
        <span className="cf__line" />
        <svg className="cf__chev" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {errors.property && <span className="cf__err">{errors.property}</span>}
      </label>

      <label className={`cf__consent ${errors.consent ? 'has-error' : ''}`}>
        <input type="checkbox" checked={data.consent} onChange={set('consent')} />
        <span className="cf__box" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
          </svg>
        </span>
        <span className="cf__consent-text">
          I authorize Yashveer Constructions and its representatives to contact me with updates and notifications via Email,
          SMS, WhatsApp, and Call. This consent will override DND/NDNC preferences.<sup>*</sup>
        </span>
      </label>

      <button type="submit" className={`btn cf__submit ${dark ? 'btn--light' : ''}`} disabled={sending}>
        {sending ? 'Sending…' : 'Submit enquiry'} <Arrow />
      </button>
      {sendError && (
        <p className="cf__send-error" role="alert">
          {sendError}
        </p>
      )}
    </form>
  )
}
