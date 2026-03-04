import React from 'react'

function formatMoodLabel(mood) {
  if (!mood) return 'Neutral'
  if (mood.toLowerCase() === 'surprized') return 'Surprized'
  return mood.charAt(0).toUpperCase() + mood.slice(1)
}

function Player({ song, loading, mood, emotion, error }) {
  const hasSong = Boolean(song && song.url)

  return (
    <section className="player-panel panel-enter panel-enter--delay">
      <div className="player-panel__top-row">
        <h2>Player Layer</h2>
        <span className="mood-chip">{formatMoodLabel(mood)}</span>
      </div>

      <p className="player-panel__subtext">
        Matched with expression: <strong>{emotion || 'Neutral'}</strong>
      </p>

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
            <audio controls src={song.url} preload="metadata" className="player-panel__audio">
              Your browser does not support audio playback.
            </audio>
          </div>
        </article>
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
