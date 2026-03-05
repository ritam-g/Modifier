import { useCallback, useContext } from 'react'
import { Context } from '../context/AuthContext'
import { getMe, register, login, logout } from '../services/auth.api'

export function useAuth() {
    const { user, setuser, loading, setloading } = useContext(Context)

    const loginUser = useCallback(async ({ email, password }) => {
        setloading(true)
        try {
            const data = await login({ email, password })
            setuser(data.user)
            return data.user
        } finally {
            setloading(false)
        }
    }, [setloading, setuser])

    const registerUser = useCallback(async ({ username, password, email }) => {
        setloading(true)
        try {
            const data = await register({ username, password, email })
            setuser(data.user)
            return data.user
        } finally {
            setloading(false)
        }
    }, [setloading, setuser])

    const getMeUser = useCallback(async () => {
        setloading(true)
        try {
            const data = await getMe()
            setuser(data.user)
            return data.user
        } catch {
            setuser(null)
            return null
        } finally {
            setloading(false)
        }
    }, [setloading, setuser])

    const logoutUser = useCallback(async () => {
        setloading(true)
        try {
            await logout()
            setuser(null)
        } finally {
            setloading(false)
        }
    }, [setloading, setuser])

    return { loginUser, logoutUser, getMeUser, registerUser, loading, user }
}
