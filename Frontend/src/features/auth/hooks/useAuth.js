import { useContext } from "react";
import { Context } from "../context/AuthContext";
import { getMe, register, login, logout } from "../services/auth.api";



export  function useAuth() {
    const { user, setuser, loading, setloading } = useContext(Context)
    async function loginUser({ email, password }) {
        setloading(true)
        const data = await login({ email, password })
        setuser(data.user)
        return data.user
    }
    async function registerUser({ username, password, email }) {
        setloading(true)
        const data = await register({ username, password, email })
        setuser(data.user)
        setloading(false)
        return data.user
    }
    async function getMeUser() {
        setloading(true)
        const data = await getMe()
        setuser(data.user)
        setloading(false)
        return data.user
    }
    async function logoutUser() {
        setloading(true)
        const data = await logout()
        setuser(null)
        setloading(false)
        return data.user
    }
    return { loginUser, logoutUser, getMeUser, registerUser,loading ,user}
}
