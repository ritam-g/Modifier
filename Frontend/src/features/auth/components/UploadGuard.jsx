import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'

function UploadGuard({ children }) {
    const { user, loading, getMeUser } = useAuth()
    const navigate = useNavigate()
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        async function checkSession() {
            await getMeUser()
            setChecked(true)
        }

        checkSession()
    }, [getMeUser])

    useEffect(() => {
        if (checked && !loading && !user) {
            toast.error('Please log in to upload songs.')
            navigate('/login')
        }
    }, [checked, user, loading, navigate])

    if (loading || !checked) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'grid',
                placeItems: 'center',
                fontFamily: '"Sora", sans-serif',
                color: '#153f4c',
                background: 'linear-gradient(145deg, #ecf8f6 0%, #fff8ec 100%)',
            }}>
                Checking session...
            </div>
        )
    }

    return user ? children : null
}

export default UploadGuard
