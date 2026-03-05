import axios from 'axios'
import { API_ROOT } from '../../../config/api'

const api = axios.create({
    baseURL: `${API_ROOT}/auth`,
    withCredentials: true
})

export async function register({ username, password, email }) {
    const res = await api.post('/register', { username, password, email })
    return res.data

}
export async function login({ email, password }) {
    const res = await api.post('/login', { email, password })
    return res.data

}
export async function getMe() {
    const res = await api.get('/get-me')
    return res.data

}
export async function logout() {
    const res = await api.get('/logout')
    return res.data

}
