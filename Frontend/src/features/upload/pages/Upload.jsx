import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import toast from 'react-hot-toast'
import { useUpload } from '../hooks/useUpload'
import '../style/upload.scss'

const MOOD_META = {
    happy: { label: 'Happy', color: '#f59e0b' },
    sad: { label: 'Sad', color: '#6366f1' },
    angry: { label: 'Angry', color: '#ef4444' },
    surprised: { label: 'Surprised', color: '#10b981' },
    neutral: { label: 'Neutral', color: '#64748b' },
}

function Upload() {
    const navigate = useNavigate()
    const { uploadOne, uploadMany, loading, error, result, reset, moods } = useUpload()

    const [mode, setMode] = useState('single')
    const [mood, setMood] = useState('happy')
    const [files, setFiles] = useState([])
    const fileInputRef = useRef(null)

    const description = useMemo(() => {
        if (mode === 'single') return 'Upload one MP3 and attach a mood tag.'
        return 'Upload up to 20 MP3 files in one request with one mood tag.'
    }, [mode])

    useEffect(() => {
        const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

        timeline
            .from('.upload-header', { y: -30, opacity: 0, duration: 0.5 })
            .from('.upload-card', { y: 40, opacity: 0, duration: 0.6 }, '-=0.25')
            .from('.upload-form > *', { y: 14, opacity: 0, stagger: 0.07, duration: 0.35 }, '-=0.2')

        return () => timeline.kill()
    }, [])

    useEffect(() => {
        if (error) toast.error(error)
    }, [error])

    function onPickFiles(event) {
        const selected = Array.from(event.target.files || [])
        const nextFiles = mode === 'single' ? selected.slice(0, 1) : selected.slice(0, 20)
        setFiles(nextFiles)
    }

    function onDrop(event) {
        event.preventDefault()
        const dropped = Array.from(event.dataTransfer.files || [])
        const nextFiles = mode === 'single' ? dropped.slice(0, 1) : dropped.slice(0, 20)
        setFiles(nextFiles)
    }

    async function handleSubmit(event) {
        event.preventDefault()

        try {
            if (mode === 'single') {
                await uploadOne({ file: files[0], mood })
                toast.success('Song uploaded successfully.')
            } else {
                const data = await uploadMany({ files, mood })
                toast.success(`${data.total} songs uploaded successfully.`)
            }

            setFiles([])
            if (fileInputRef.current) fileInputRef.current.value = ''
        } catch {
            // Error handled by hook.
        }
    }

    return (
        <main className="upload-page">
            <header className="upload-header">
                <Link to="/app" className="upload-back-link">Back to app</Link>
                <h1>Upload Songs by Mood</h1>
                <p>{description}</p>
            </header>

            <section className="upload-card">
                <div className="upload-mode-toggle">
                    <button
                        type="button"
                        className={`mode-btn ${mode === 'single' ? 'is-active' : ''}`}
                        onClick={() => {
                            setMode('single')
                            setFiles([])
                            reset()
                        }}
                    >
                        Single Upload
                    </button>
                    <button
                        type="button"
                        className={`mode-btn ${mode === 'multiple' ? 'is-active' : ''}`}
                        onClick={() => {
                            setMode('multiple')
                            setFiles([])
                            reset()
                        }}
                    >
                        Bulk Upload
                    </button>
                </div>

                <form className="upload-form" onSubmit={handleSubmit}>
                    <div className="upload-field">
                        <label>Mood</label>
                        <div className="upload-mood-grid">
                            {moods.map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    className={`mood-btn ${mood === value ? 'is-selected' : ''}`}
                                    style={{ '--mood-color': MOOD_META[value]?.color }}
                                    onClick={() => setMood(value)}
                                >
                                    {MOOD_META[value]?.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="upload-field">
                        <label>{mode === 'single' ? 'Song file (.mp3)' : 'Song files (.mp3, max 20)'}</label>
                        <div
                            className={`dropzone ${files.length ? 'has-files' : ''}`}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={onDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="audio/mpeg,.mp3"
                                multiple={mode === 'multiple'}
                                onChange={onPickFiles}
                                hidden
                            />

                            {files.length === 0 ? (
                                <p>Click or drop MP3 file{mode === 'multiple' ? 's' : ''} here</p>
                            ) : (
                                <ul>
                                    {files.map((file) => (
                                        <li key={`${file.name}-${file.size}`}>{file.name}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <button className="upload-submit" type="submit" disabled={loading || files.length === 0}>
                        {loading ? 'Uploading...' : mode === 'single' ? 'Upload Song' : `Upload ${files.length} Song${files.length === 1 ? '' : 's'}`}
                    </button>
                </form>

                {result ? (
                    <div className="upload-result">
                        {result.type === 'single'
                            ? `Uploaded: ${result.data?.song?.title || 'song'}`
                            : `Uploaded ${result.data?.total || 0} songs successfully.`}
                    </div>
                ) : null}

                <div className="upload-actions">
                    <button type="button" className="secondary-btn" onClick={() => navigate('/app')}>
                        Go to Mood Player
                    </button>
                </div>
            </section>
        </main>
    )
}

export default Upload
