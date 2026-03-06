import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/song`
        : 'https://modifier-1.onrender.com/api/song',
    withCredentials: true
})

export async function getSong({ mood }) {
    const res = await api.get(`/getsong?mood=${mood}`)
    return res.data
}
