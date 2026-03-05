import { useCallback, useEffect, useRef, useState } from 'react'

const FREE_LISTEN_SECONDS = 5 * 60
const STORAGE_KEY = 'moddifier_guest_seconds_left'

function readStoredSeconds() {
    if (typeof window === 'undefined') return FREE_LISTEN_SECONDS

    const raw = sessionStorage.getItem(STORAGE_KEY)
    const parsed = Number.parseInt(raw || '', 10)

    if (Number.isNaN(parsed)) return FREE_LISTEN_SECONDS
    if (parsed < 0) return 0
    if (parsed > FREE_LISTEN_SECONDS) return FREE_LISTEN_SECONDS

    return parsed
}

export function useGuestSession(enabled) {
    const [secondsLeft, setSecondsLeft] = useState(FREE_LISTEN_SECONDS)
    const timerRef = useRef(null)

    const stopPlaybackTimer = useCallback(() => {
        if (timerRef.current) {
            window.clearInterval(timerRef.current)
            timerRef.current = null
        }
    }, [])

    const persist = useCallback((value) => {
        if (typeof window === 'undefined') return
        sessionStorage.setItem(STORAGE_KEY, String(value))
    }, [])

    const reset = useCallback(() => {
        stopPlaybackTimer()
        setSecondsLeft(FREE_LISTEN_SECONDS)
        persist(FREE_LISTEN_SECONDS)
    }, [persist, stopPlaybackTimer])

    useEffect(() => {
        if (!enabled) {
            reset()
            return
        }

        const initialValue = readStoredSeconds()
        setSecondsLeft(initialValue)
        persist(initialValue)
    }, [enabled, persist, reset])

    useEffect(() => () => stopPlaybackTimer(), [stopPlaybackTimer])

    const consumeTick = useCallback(() => {
        setSecondsLeft((previous) => {
            const next = Math.max(previous - 1, 0)
            persist(next)
            if (next <= 0) stopPlaybackTimer()
            return next
        })
    }, [persist, stopPlaybackTimer])

    const isExpired = enabled && secondsLeft <= 0

    const startPlaybackTimer = useCallback(() => {
        if (!enabled || isExpired || timerRef.current) return
        timerRef.current = window.setInterval(consumeTick, 1000)
    }, [consumeTick, enabled, isExpired])

    return {
        secondsLeft,
        isExpired,
        startPlaybackTimer,
        stopPlaybackTimer,
        freeListenSeconds: FREE_LISTEN_SECONDS,
    }
}
