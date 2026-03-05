import React, { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

function Protected({ children }) {
    const { getMeUser } = useAuth()

    useEffect(() => {
        getMeUser()
    }, [getMeUser])

    return children
}

export default Protected
