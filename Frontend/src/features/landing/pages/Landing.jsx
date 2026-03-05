import React, { useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../style/landing.scss'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = [
  {
    title: 'Face Detection in Real Time',
    desc: 'The camera stream is processed in-browser using MediaPipe facial blendshapes to estimate mood in seconds.',
  },
  {
    title: 'Mood-Matched Song Suggestions',
    desc: 'Once your expression is detected, Moddifier loads songs from the matching mood collection and starts playback instantly.',
  },
  {
    title: 'Upload Songs by Mood',
    desc: 'Authenticated users can upload single or bulk MP3 files and tag them by mood to grow the community library.',
  },
]

const STEPS = [
  {
    id: '01',
    title: 'Allow camera',
    desc: 'Give camera permission so your face can be analyzed in real time.',
  },
  {
    id: '02',
    title: 'Detect emotion',
    desc: 'Tap detect. Moddifier maps expression landmarks to a mood label.',
  },
  {
    id: '03',
    title: 'Play matching songs',
    desc: 'The player loads mood-specific tracks and you can switch songs from the playlist.',
  },
]

function Landing() {
  const navigate = useNavigate()
  const rootRef = useRef(null)

  const stats = useMemo(() => ([
    { value: '5', label: 'Supported moods' },
    { value: '100ms', label: 'Detection response' },
    { value: '0 Upload', label: 'Camera privacy' },
  ]), [])

  useEffect(() => {
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

      timeline
        .from('.landing-nav', { y: -40, opacity: 0, duration: 0.6 })
        .from('.hero-eyebrow', { y: 24, opacity: 0, duration: 0.45 }, '-=0.25')
        .from('.hero-title span', { y: 42, opacity: 0, stagger: 0.08, duration: 0.55 }, '-=0.2')
        .from('.hero-subtext', { y: 18, opacity: 0, duration: 0.45 }, '-=0.2')
        .from('.hero-actions', { y: 18, opacity: 0, duration: 0.45 }, '-=0.2')
        .from('.hero-stats .hero-stat', { y: 18, opacity: 0, stagger: 0.08, duration: 0.45 }, '-=0.1')

      gsap.utils.toArray('.scroll-reveal').forEach((element) => {
        gsap.from(element, {
          y: 48,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 86%',
          },
        })
      })
    }, rootRef)

    return () => {
      context.revert()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <div className="landing-root" ref={rootRef}>
      <nav className="landing-nav">
        <div className="landing-logo">Moddifier</div>
        <div className="landing-links">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
          <a href="#final-cta">Get started</a>
        </div>
        <div className="landing-auth-links">
          <Link to="/login" className="nav-link-ghost">Login</Link>
          <Link to="/register" className="nav-link-solid">Register</Link>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-background-orb hero-background-orb--left" />
        <div className="hero-background-orb hero-background-orb--right" />

        <div className="hero-content">
          <p className="hero-eyebrow">Mood-based listening with computer vision</p>
          <h1 className="hero-title">
            <span>Your face</span>
            <span>detects the mood,</span>
            <span>Moddifier picks the song.</span>
          </h1>
          <p className="hero-subtext">
            Moddifier detects facial expression from your live camera and suggests songs
            that match your current mood. Try it instantly, then create an account for
            unlimited listening and song uploads.
          </p>

          <div className="hero-actions">
            <button className="cta-primary" onClick={() => navigate('/app')}>
              Try Mood Detection
            </button>
            <Link to="/register" className="cta-secondary">Create Free Account</Link>
          </div>

          <div className="hero-stats">
            {stats.map((item) => (
              <div key={item.label} className="hero-stat">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="steps-section" id="how-it-works">
        <div className="section-inner">
          <p className="section-eyebrow scroll-reveal">How It Works</p>
          <h2 className="section-title scroll-reveal">Three simple steps from expression to song</h2>
          <div className="steps-grid">
            {STEPS.map((step) => (
              <article key={step.id} className="step-card scroll-reveal">
                <span className="step-id">{step.id}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="section-inner">
          <p className="section-eyebrow scroll-reveal">Feature Highlights</p>
          <h2 className="section-title scroll-reveal">Built for expressive, instant music discovery</h2>
          <div className="features-grid">
            {FEATURES.map((feature) => (
              <article key={feature.title} className="feature-card scroll-reveal">
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta-section" id="final-cta">
        <div className="section-inner scroll-reveal">
          <p className="section-eyebrow">Start instantly</p>
          <h2 className="section-title">Detect your mood and play matching songs now</h2>
          <p className="final-cta-subtext">
            No setup needed for first use. Open the app, detect your face, and start listening.
          </p>
          <div className="hero-actions final-actions">
            <button className="cta-primary" onClick={() => navigate('/app')}>
              Try Mood Detection
            </button>
            <Link to="/upload" className="cta-secondary">Upload Songs</Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="section-inner landing-footer-inner">
          <p>Moddifier - face detection + mood based music suggestion</p>
          <div className="footer-links">
            <Link to="/app">App</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
