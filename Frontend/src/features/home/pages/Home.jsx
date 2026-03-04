import React, { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import FaceDetection from '../../../components/FaceDetector'
import Player from '../components/Player'
import { useSong } from '../hooks/useSong'
import '../style/home.scss'

function mapEmotionToMood(emotionLabel = '') {
    const normalizedEmotion = emotionLabel.toLowerCase();

    if (normalizedEmotion.includes('happy')) return 'happy';
    if (normalizedEmotion.includes('sad')) return 'sad';
    if (normalizedEmotion.includes('angry')) return 'angry';
    if (normalizedEmotion.includes('surpris')) return 'surprized';

    return 'Neutral';
}

function Home() {
    const { getSongByMood, selectSong, song, songs, loading, error } = useSong()
    const [detectedEmotion, setDetectedEmotion] = useState('Neutral')
    const [activeMood, setActiveMood] = useState('Neutral')
    const [statusText, setStatusText] = useState('Detect once to sync your mood with a matching song.')
    const [requestError, setRequestError] = useState(null)

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
        setStatusText(`Emotion captured: ${nextEmotion}. Loading a ${mood} track...`)

        try {
            const { song: fetchedSong, songs: fetchedSongs } = await getSongByMood({ mood })
            const totalSongs = fetchedSongs.length

            if (fetchedSong) {
                setStatusText(`Ready. ${totalSongs} ${mood} songs found, now playing one.`)
                toast.success(`Loaded ${mood} song from ${totalSongs} options.`)
            } else {
                setStatusText(`No ${mood} track available yet. Try another expression.`)
                toast('No matching song found for this mood.')
            }
        } catch (err) {
            const message = err?.response?.data?.message || err?.response?.data?.error || 'Failed to fetch a song.'
            setRequestError(message)
            setStatusText('Detection succeeded, but song fetch failed. Please retry.')
            toast.error(message)
        }
    }, [getSongByMood])

    return (
        <main className="home-shell">
            <section className="home-hero">
                <p className="home-hero__eyebrow">Mood Studio</p>
                <h1>Face Detection + Player Layer</h1>
                <p className="home-hero__subtitle">{statusText}</p>
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
                />
            </section>
        </main>
    )
}

export default Home
