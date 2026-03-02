import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
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
        await loginUser({ email, password })
        navigate("/")
    }

    return (
        <main className="login-page">
            <div className="form-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit} >
                    <FormGroup
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="Email"
                        placeholder="Enter your email"
                    />
                    <FormGroup
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label="Password"
                        placeholder="Enter your password"
                    />
                    <button className='button' type="submit">Login</button>
                </form>
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
            </div>
        </main>
    )
}

export default Login