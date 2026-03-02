import React, { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

function Protected({ children }) {
    const { user, loading, getMeUser } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        async function checkUser() {
            await getMeUser()
        }
        checkUser()
    }, [])

    useEffect(() => {
        
        if (!loading && !user) {
            navigate('/login')
        }
    }, [user, loading, navigate])

    if (loading) {
        return <h1>Loading...</h1>
    }

    return user ? children : null
}

export default Protected