import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import toast from 'react-hot-toast'
import FormGroup from '../components/FromGroup'
import { useAuth } from '../hooks/useAuth'
import '../style/register.scss'

const BENEFITS = ['Unlimited listening', 'Upload songs', 'Saved mood tracks', 'Faster access']

function Register() {
    const navigate = useNavigate()
    const { registerUser, loading } = useAuth()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [activeBenefit, setActiveBenefit] = useState(0)

    const panelRef = useRef(null)
    const benefitTimerRef = useRef(null)
    const rootRef = useRef(null)

    useEffect(() => {
        const context = gsap.context(() => {
            const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

            timeline
                .from('.register-left-panel', { x: -60, opacity: 0, duration: 0.7 })
                .from('.register-right-panel', { x: 60, opacity: 0, duration: 0.65 }, '-=0.5')
                .from('.register-brand', { y: -20, opacity: 0, duration: 0.4 }, '-=0.3')
                .from('.register-left-headline', { y: 25, opacity: 0, duration: 0.45 }, '-=0.2')
                .from('.register-left-sub', { y: 20, opacity: 0, duration: 0.4 }, '-=0.2')
                .from('.register-left-benefits', { y: 16, opacity: 0, duration: 0.4 }, '-=0.15')
                .from('.register-right-panel .form-group', { y: 12, opacity: 0, stagger: 0.08, duration: 0.35 }, '-=0.1')
                .from('.register-right-panel .button', { y: 10, opacity: 0, duration: 0.35 }, '-=0.05')
        }, rootRef)

        benefitTimerRef.current = setInterval(() => {
            setActiveBenefit((prev) => (prev + 1) % BENEFITS.length)
        }, 2100)

        return () => {
            clearInterval(benefitTimerRef.current)
            context.revert()
        }
    }, [])

    async function handleSubmit(event) {
        event.preventDefault()

        if (!username || !email || !password) {
            toast.error('Name, email, and password are required.')
            gsap.fromTo(panelRef.current, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' })
            return
        }

        try {
            await registerUser({ username, password, email })
            toast.success('Account created successfully.')
            navigate('/app')
        } catch (err) {
            const message = err?.response?.data?.message || err?.response?.data?.error || 'Registration failed.'
            toast.error(message)
            gsap.fromTo(panelRef.current, { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' })
        }
    }

    return (
        <main className="register-page" ref={rootRef}>
            <section className="register-left-panel">
                <div className="register-brand">Moddifier</div>
                <div className="register-left-content">
                    <h1 className="register-left-headline">Turn mood into playlists.</h1>
                    <p className="register-left-sub">
                        Create your account to remove guest playback limits and upload songs to
                        the mood library.
                    </p>
                    <div className="register-left-benefits">
                        {BENEFITS.map((benefit, index) => (
                            <span key={benefit} className={`register-chip ${index === activeBenefit ? 'is-active' : ''}`}>
                                {benefit}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            <section className="register-right-panel" ref={panelRef}>
                <div className="form-container">
                    <h2>Register</h2>
                    <p className="auth-subtitle">Create your account to unlock mood playlists.</p>
                    <form onSubmit={handleSubmit}>
                        <FormGroup
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            label="Name"
                            name="name"
                            autoComplete="name"
                            placeholder="Enter your name"
                        />
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
                            autoComplete="new-password"
                            placeholder="Enter your password"
                        />
                        <button className="button" type="submit" disabled={loading}>
                            {loading ? 'Creating account...' : 'Register'}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>

                    <div className="auth-alt-link-wrap">
                        <Link to="/app" className="auth-alt-link">Try guest mode first</Link>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Register
