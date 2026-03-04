import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import FormGroup from '../components/FromGroup'
import '../style/login.scss'
import { useAuth } from '../hooks/useAuth'

const Login = () => {



    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { loginUser, loading } = useAuth()

    async function handleSubmit(e) {
        e.preventDefault()

        if (!email || !password) {
            toast.error('Email and password are required.')
            return
        }

        try {
            await loginUser({ email, password })
            toast.success('Logged in successfully.')
            navigate("/")
        } catch (err) {
            const message = err?.response?.data?.message || err?.response?.data?.error || 'Login failed.'
            toast.error(message)
        }
    }

    return (
        <main className="login-page">
            <div className="form-container">
                <h1>Login</h1>
                <p className="auth-subtitle">Continue to your mood-based dashboard.</p>
                <form onSubmit={handleSubmit} >
                    <FormGroup
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="Email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="Enter your email"
                    />
                    <FormGroup
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label="Password"
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        placeholder="Enter your password"
                    />
                    <button className='button' type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="auth-switch">Don't have an account? <Link to="/register">Register here</Link></p>
            </div>
        </main>
    )
}

export default Login
