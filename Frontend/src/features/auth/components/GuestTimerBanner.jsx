import React from 'react'
import { Link } from 'react-router-dom'
import './GuestTimerBanner.scss'

const FREE_LIMIT_SECONDS = 5 * 60

export function GuestTimerBanner({ secondsLeft = FREE_LIMIT_SECONDS }) {
    const clamped = Math.max(0, Math.min(secondsLeft, FREE_LIMIT_SECONDS))
    const minutes = Math.floor(clamped / 60)
    const seconds = clamped % 60
    const progress = (clamped / FREE_LIMIT_SECONDS) * 100
    const isUrgent = clamped <= 60

    return (
        <div className={`guest-timer-banner ${isUrgent ? 'is-urgent' : ''}`}>
            <div className="gtb-left">
                <span className="gtb-label">Guest listening</span>
                <div className="gtb-bar-wrap">
                    <div className="gtb-bar" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className="gtb-time">
                {minutes}:{String(seconds).padStart(2, '0')}
            </div>

            <div className="gtb-right">
                <Link to="/login" className="gtb-cta">Login</Link>
                <Link to="/register" className="gtb-cta gtb-cta-primary">Register</Link>
            </div>
        </div>
    )
}

export function GuestExpiredModal({ onClose }) {
    return (
        <div className="expired-backdrop">
            <div className="expired-modal">
                <div className="expired-icon">Time Up</div>
                <h2>5-minute free listening finished</h2>
                <p>
                    You can still use face detection, but playback is locked for guests.
                    Log in or register to continue listening.
                </p>
                <div className="expired-actions">
                    <Link to="/register" className="expired-btn expired-btn-primary">Create Account</Link>
                    <Link to="/login" className="expired-btn expired-btn-ghost">I already have an account</Link>
                    <button type="button" className="expired-btn expired-btn-ghost" onClick={onClose}>
                        Continue detecting only
                    </button>
                </div>
            </div>
        </div>
    )
}
