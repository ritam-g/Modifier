import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import FaceDetection from '../../../components/FaceDetector'
import Player from '../components/Player'
import { useSong } from '../hooks/useSong'
import { useAuth } from '../../auth/hooks/useAuth'
import { useGuestSession } from '../../auth/hooks/useGuestSession'
import { GuestTimerBanner, GuestExpiredModal } from '../../auth/components/GuestTimerBanner'
import '../style/home.scss'

function mapEmotionToMood(emotionLabel = '') {
    const normalizedEmotion = emotionLabel.toLowerCase()

    if (normalizedEmotion.includes('happy')) return 'happy'
    if (normalizedEmotion.includes('sad')) return 'sad'
    if (normalizedEmotion.includes('angry')) return 'angry'
    if (normalizedEmotion.includes('surpris')) return 'surprised'

    return 'neutral'
}

function formatMoodLabel(mood = 'neutral') {
    return mood.charAt(0).toUpperCase() + mood.slice(1)
}

function Home() {
    const { getSongByMood, selectSong, song, songs, loading, error } = useSong()
    const { user, logoutUser } = useAuth()

    const [detectedEmotion, setDetectedEmotion] = useState('Neutral')
    const [activeMood, setActiveMood] = useState('neutral')
    const [statusText, setStatusText] = useState('Detect once to sync your mood with a matching song.')
    const [requestError, setRequestError] = useState(null)
    const [showGuestPrompt, setShowGuestPrompt] = useState(false)

    const isGuest = !user
    const {
        secondsLeft,
        isExpired: guestExpired,
        startPlaybackTimer,
        stopPlaybackTimer,
    } = useGuestSession(isGuest)

    useEffect(() => {
        if (isGuest && guestExpired) {
            setShowGuestPrompt(true)
        }
    }, [guestExpired, isGuest])

    const handleFaceDetection = useCallback(async (detectionResult) => {
        const nextEmotion = detectionResult?.emotion || 'Neutral'
        const hasFace = Boolean(detectionResult?.faceDetected)
        const detectionIssue = nextEmotion === 'Camera or model not ready' || nextEmotion === 'Detection failed'

        setDetectedEmotion(nextEmotion)
        setRequestError(null)

        if (detectionIssue) {
            setStatusText('Camera/model not ready yet. Wait a moment and detect again.')
            toast.error('Camera or detection model is not ready.')
            return
        }

        if (!hasFace) {
            setStatusText('No face lock yet. Keep your face centered and detect again.')
            toast.error('Face not detected. Keep your face inside the frame.')
            return
        }

        const mood = mapEmotionToMood(nextEmotion)
        setActiveMood(mood)
        setStatusText(`Emotion captured: ${nextEmotion}. Loading a ${formatMoodLabel(mood)} track...`)

        try {
            const { song: fetchedSong, songs: fetchedSongs } = await getSongByMood({ mood })
            const totalSongs = fetchedSongs.length
            
            if (fetchedSong) {
                setStatusText(`Ready. ${totalSongs} ${formatMoodLabel(mood)} songs found, now playing one.`)
                toast.success(`Loaded ${formatMoodLabel(mood)} song from ${totalSongs} options.`)
            } else {
                setStatusText(`No ${formatMoodLabel(mood)} track available yet. Try another expression.`)
                toast('No matching song found for this mood.')
            }
        } catch (err) {
            const message = err?.response?.data?.message || err?.response?.data?.error || 'Failed to fetch a song.'
            setRequestError(message)
            setStatusText('Detection succeeded, but song fetch failed. Please retry.')
            toast.error(message)
        }
    }, [getSongByMood])

    async function handleLogout() {
        try {
            await logoutUser()
            toast.success('Logged out successfully.')
        } catch {
            toast.error('Logout failed.')
        }
    }

    return (
        <main className={`home-shell ${isGuest ? 'has-guest-banner' : ''}`}>
            {isGuest && <GuestTimerBanner secondsLeft={secondsLeft} />}
            {isGuest && guestExpired && showGuestPrompt ? (
                <GuestExpiredModal onClose={() => setShowGuestPrompt(false)} />
            ) : null}

            <section className="home-hero">
                <div className="home-hero__left">
                    <p className="home-hero__eyebrow">Mood Studio</p>
                    <h1>Face Detection + Player Layer</h1>
                    <p className="home-hero__subtitle">{statusText}</p>
                </div>

                <div className="home-hero__right">
                    {user ? (
                        <div className="home-user-pill">
                            <span className="home-user-avatar">{user.username?.charAt(0)?.toUpperCase() || 'U'}</span>
                            <span className="home-user-name">{user.username}</span>
                            <button className="home-logout-btn" onClick={handleLogout} type="button">Logout</button>
                        </div>
                    ) : (
                        <div className="home-guest-actions">
                            <Link to="/login" className="home-auth-link">Login</Link>
                            <Link to="/register" className="home-auth-link home-auth-link--primary">Register</Link>
                        </div>
                    )}
                    <Link to="/upload" className="home-upload-link">Upload Songs</Link>
                </div>
            </section>

            <section className="home-grid">
                <FaceDetection onDetect={handleFaceDetection} busy={loading} />
                <Player
                    song={song}
                    songs={songs}
                    onSelectSong={selectSong}
                    songCount={songs.length}
                    loading={loading}
                    mood={activeMood}
                    emotion={detectedEmotion}
                    error={requestError || error}
                    isGuest={isGuest}
                    guestExpired={guestExpired}
                    onGuestPlaybackStart={startPlaybackTimer}
                    onGuestPlaybackStop={stopPlaybackTimer}
                />
            </section>
        </main>
    )
}

export default Home
