import { useContext } from 'react'
import { uploadSingleSong, uploadMultipleSongs } from '../services/upload.api'
import { UploadContext } from '../context/UploadContext'

const UI_MOODS = ['happy', 'sad', 'angry', 'surprised', 'neutral']
const API_MOOD_MAP = {
    happy: 'Happy',
    sad: 'Sad',
    angry: 'Angry',
    surprised: 'Surprised',
    surprized: 'Surprised',
    neutral: 'Neutral',
}

function normalizeMood(mood = '') {
    return String(mood).trim().toLowerCase()
}

function toApiMood(mood) {
    return API_MOOD_MAP[normalizeMood(mood)]
}

function isValidMp3(file) {
    if (!file) return false
    const mime = file.type === 'audio/mpeg'
    const extension = file.name?.toLowerCase().endsWith('.mp3')
    return mime || extension
}

function validateInput({ files, mood, allowMultiple }) {
    if (!mood || !toApiMood(mood)) return 'Please select a valid mood.'
    if (!Array.isArray(files) || files.length === 0) return 'Please choose at least one MP3 file.'
    if (!allowMultiple && files.length > 1) return 'Single upload supports one file only.'
    if (allowMultiple && files.length > 20) return 'Bulk upload supports maximum 20 files.'

    const hasInvalidFile = files.some((file) => !isValidMp3(file))
    if (hasInvalidFile) return 'Only .mp3 files are supported.'

    return null
}

export function useUpload() {
    const {
        loading,
        setLoading,
        error,
        setError,
        result,
        setResult,
    } = useContext(UploadContext)

    async function uploadOne({ file, mood }) {
        const files = [file].filter(Boolean)
        const validationError = validateInput({ files, mood, allowMultiple: false })
        if (validationError) {
            setError(validationError)
            throw new Error(validationError)
        }

        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const data = await uploadSingleSong({ file, mood: toApiMood(mood) })
            setResult({ type: 'single', data })
            return data
        } catch (err) {
            const message = err?.response?.data?.error || err?.response?.data?.message || 'Upload failed.'
            setError(message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    async function uploadMany({ files, mood }) {
        const validationError = validateInput({ files, mood, allowMultiple: true })
        if (validationError) {
            setError(validationError)
            throw new Error(validationError)
        }

        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const data = await uploadMultipleSongs({ files, mood: toApiMood(mood) })
            setResult({ type: 'multiple', data })
            return data
        } catch (err) {
            const message = err?.response?.data?.error || err?.response?.data?.message || 'Upload failed.'
            setError(message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    function reset() {
        setError(null)
        setResult(null)
    }

    return { uploadOne, uploadMany, loading, error, result, reset, moods: UI_MOODS }
}
