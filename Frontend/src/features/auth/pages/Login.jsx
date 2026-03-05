import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import toast from 'react-hot-toast'
import FormGroup from '../components/FromGroup'
import { useAuth } from '../hooks/useAuth'
import '../style/login.scss'

const MOOD_WORDS = ['Happy', 'Calm', 'Focused', 'Energized', 'Present']

function Login() {
    const navigate = useNavigate()
    const { loginUser, loading } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [moodIndex, setMoodIndex] = useState(0)

    const panelRef = useRef(null)
    const moodTimerRef = useRef(null)
    const rootRef = useRef(null)

    useEffect(() => {
        const context = gsap.context(() => {
            const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

            timeline
                .from('.login-left-panel', { x: -60, opacity: 0, duration: 0.7 })
                .from('.login-right-panel', { x: 60, opacity: 0, duration: 0.65 }, '-=0.5')
                .from('.login-brand', { y: -20, opacity: 0, duration: 0.4 }, '-=0.3')
                .from('.login-left-headline', { y: 25, opacity: 0, duration: 0.45 }, '-=0.2')
                .from('.login-left-sub', { y: 20, opacity: 0, duration: 0.4 }, '-=0.2')
                .from('.login-left-mood-row', { y: 16, opacity: 0, duration: 0.4 }, '-=0.15')
                .from('.login-right-panel .form-group', { y: 12, opacity: 0, stagger: 0.08, duration: 0.35 }, '-=0.1')
                .from('.login-right-panel .button', { y: 10, opacity: 0, duration: 0.35 }, '-=0.05')
        }, rootRef)

        moodTimerRef.current = setInterval(() => {
            setMoodIndex((prev) => (prev + 1) % MOOD_WORDS.length)
        }, 1900)

        return () => {
            clearInterval(moodTimerRef.current)
            context.revert()
        }
    }, [])

    async function handleSubmit(event) {
        event.preventDefault()

        if (!email || !password) {
            toast.error('Email and password are required.')
            gsap.fromTo(panelRef.current, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' })
            return
        }

        try {
            await loginUser({ email, password })
            toast.success('Logged in successfully.')
            navigate('/app')
        } catch (err) {
            const message = err?.response?.data?.message || err?.response?.data?.error || 'Login failed.'
            toast.error(message)
            gsap.fromTo(panelRef.current, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' })
        }
    }

    return (
        <main className="login-page" ref={rootRef}>
            <section className="login-left-panel">
                <div className="login-brand">Moddifier</div>
                <div className="login-left-content">
                    <h1 className="login-left-headline">Your face picks the music.</h1>
                    <p className="login-left-sub">
                        Detect your mood in real time and listen instantly.
                        Log in to continue listening without guest limits.
                    </p>
                    <div className="login-left-mood-row">
                        {MOOD_WORDS.map((item, index) => (
                            <span key={item} className={`login-chip ${index === moodIndex ? 'is-active' : ''}`}>
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            <section className="login-right-panel" ref={panelRef}>
                <div className="form-container">
                    <h2>Login</h2>
                    <p className="auth-subtitle">Continue to your mood-based dashboard.</p>
                    <form onSubmit={handleSubmit}>
                        <FormGroup
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            label="Email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            placeholder="Enter your email"
                        />
                        <FormGroup
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            label="Password"
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            placeholder="Enter your password"
                        />
                        <button className="button" type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Don&apos;t have an account? <Link to="/register">Register here</Link>
                    </p>

                    <div className="auth-alt-link-wrap">
                        <Link to="/app" className="auth-alt-link">Continue as guest (5 minutes)</Link>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Login
