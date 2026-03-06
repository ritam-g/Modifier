import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/song`
        : '/api/song',
    withCredentials: true,
})

export async function uploadSingleSong({ file, mood }) {
    const formData = new FormData()
    formData.append('song', file)
    formData.append('mood', mood)

    const response = await api.post('/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })

    return response.data
}

export async function uploadMultipleSongs({ files, mood }) {
    const formData = new FormData()
    files.forEach((file) => formData.append('songs', file))
    formData.append('mood', mood)

    const response = await api.post('/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })

    return response.data
}

