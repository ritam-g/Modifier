import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import FormGroup from '../components/FromGroup'
import '../style/register.scss'
import { useAuth } from '../hooks/useAuth'
const Register = () => {

    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
   
    const navigate = useNavigate()
    const { registerUser,loading}=useAuth()

    async function handleSubmit(e) {
        e.preventDefault()

        if (!username || !email || !password) {
            toast.error('Name, email, and password are required.')
            return
        }

        try {
            await registerUser({ username, password, email })
            toast.success('Account created successfully.')
            navigate('/')
        } catch (err) {
            const message = err?.response?.data?.message || err?.response?.data?.error || 'Registration failed.'
            toast.error(message)
        }

    }
    

    return (
        <main className="register-page">
            <div className="form-container">
                <h1>Register</h1>
                <p className="auth-subtitle">Create your account to unlock mood playlists.</p>
                <form onSubmit={handleSubmit} >
                    <FormGroup
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        label="Name"
                        name="name"
                        autoComplete="name"
                        placeholder="Enter your name"
                    />
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
                        autoComplete="new-password"
                        placeholder="Enter your password"
                    />
                    <button className='button' type="submit" disabled={loading}>
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>
                <p className="auth-switch">Already have an account? <Link to="/login">Login here</Link></p>
            </div>
        </main>
    )
}

export default Register
