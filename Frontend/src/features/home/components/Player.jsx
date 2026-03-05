import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

function formatMoodLabel(mood) {
  if (!mood) return 'Neutral'
  if (mood.toLowerCase() === 'surprised') return 'Surprised'
  if (mood.toLowerCase() === 'surprized') return 'Surprised'
  return mood.charAt(0).toUpperCase() + mood.slice(1)
}

function isSongActive(activeSong, item) {
  if (!activeSong || !item) return false
  if (activeSong._id && item._id) return activeSong._id === item._id
  return activeSong.url === item.url
}

function Player({
  song,
  songs = [],
  onSelectSong,
  songCount = 0,
  loading,
  mood,
  emotion,
  error,
  isGuest = false,
  guestExpired = false,
  onGuestPlaybackStart,
  onGuestPlaybackStop,
}) {
  const audioRef = useRef(null)
  const hasSong = Boolean(song && song.url)
  const hasPlaylist = Array.isArray(songs) && songs.length > 0

  function handlePlay(event) {
    if (isGuest && guestExpired) {
      event.currentTarget.pause()
      return
    }

    if (isGuest) {
      onGuestPlaybackStart?.()
    }
  }

  function handlePause() {
    if (isGuest) {
      onGuestPlaybackStop?.()
    }
  }

  useEffect(() => {
    if (!isGuest || !guestExpired) return

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    onGuestPlaybackStop?.()
  }, [guestExpired, isGuest, onGuestPlaybackStop])

  useEffect(() => () => {
    onGuestPlaybackStop?.()
  }, [onGuestPlaybackStop])

  return (
    <section className="player-panel panel-enter panel-enter--delay">
      <div className="player-panel__top-row">
        <h2>Player Layer</h2>
        <span className="mood-chip">{formatMoodLabel(mood)}</span>
      </div>

      <p className="player-panel__subtext">
        Matched with expression: <strong>{emotion || 'Neutral'}</strong>
      </p>
      {songCount > 0 ? (
        <p className="player-panel__subtext">
          Playlist options for this mood: <strong>{songCount}</strong>
        </p>
      ) : null}

      {loading ? (
        <div className="player-panel__state player-panel__state--loading">
          Finding the best track for this mood...
        </div>
      ) : null}

      {!loading && error ? (
        <div className="player-panel__state player-panel__state--error">{error}</div>
      ) : null}

      {!loading && !error && hasSong ? (
        <article className="player-panel__card">
          <div className="player-panel__poster-wrap">
            {song.posterUrl ? (
              <img src={song.posterUrl} alt={song.title || 'Song poster'} className="player-panel__poster" />
            ) : (
              <div className="player-panel__poster-fallback">No Cover</div>
            )}
          </div>

          <div className="player-panel__meta">
            <h3>{song.title || 'Untitled Track'}</h3>
            <p>{formatMoodLabel(song.mood || mood)}</p>

            {isGuest && guestExpired ? (
              <div className="player-panel__state player-panel__state--limit">
                Guest listening limit reached. <Link to="/login">Login</Link> or <Link to="/register">register</Link> to continue playback.
              </div>
            ) : (
              <audio
                ref={audioRef}
                controls
                src={song.url}
                preload="metadata"
                className="player-panel__audio"
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handlePause}
              >
                Your browser does not support audio playback.
              </audio>
            )}
          </div>
        </article>
      ) : null}

      {!loading && !error && hasPlaylist ? (
        <section className="player-panel__playlist">
          <p className="player-panel__playlist-title">Mood Playlist</p>
          <div className="player-panel__playlist-list">
            {songs.map((item, index) => {
              const active = isSongActive(song, item)

              return (
                <button
                  key={item._id || item.url || index}
                  type="button"
                  className={`player-panel__playlist-item ${active ? 'is-active' : ''}`}
                  onClick={() => onSelectSong?.(item)}
                >
                  <span className="player-panel__playlist-index">{index + 1}</span>
                  <span className="player-panel__playlist-name">{item.title || 'Untitled Track'}</span>
                  <span className="player-panel__playlist-mood">{formatMoodLabel(item.mood || mood)}</span>
                </button>
              )
            })}
          </div>
        </section>
      ) : null}

      {!loading && !error && !hasSong ? (
        <div className="player-panel__state">
          Detect your face to load a mood-based song.
        </div>
      ) : null}
    </section>
  )
}

export default Player
