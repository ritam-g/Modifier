import { useContext } from "react";
import { Context } from "../context/AuthContext";
import { getMe, register, login, logout } from "../services/auth.api";



export function useAuth() {
    const { user, setuser, loading, setloading } = useContext(Context)
    async function loginUser({ email, password }) {
        try {
            setloading(true)
            const data = await login({ email, password })
            setuser(data.user)
            return data.user
        } catch (err) {
            throw err
        } finally {
            setloading(false)
        }
    }
    async function registerUser({ username, password, email }) {
        try {
            setloading(true)
            const data = await register({ username, password, email })
            setuser(data.user)

            return data.user
        } catch (err) {
            throw err
        } finally {
            setloading(false)
        }
    }
    async function getMeUser() {
        try {
            setloading(true)
            const data = await getMe()
            setuser(data.user)
            return data.user
        } catch (error) {
            setuser(null) // user not logged in
            return null
        } finally {
            setloading(false)
        }
    }
    async function logoutUser() {
        try {
            setloading(true)
            const data = await logout()
            setuser(null)
            return data.user
        } catch (err) {
            throw err
        } finally {
            setloading(false)
        }
    }
    return { loginUser, logoutUser, getMeUser, registerUser, loading, user }
}
