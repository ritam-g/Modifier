import React from 'react'
import { useSong } from '../hooks/useSong'

function Checks() {
    const { getSongByMood, song, loading } = useSong()
    async function call() {
        const mood = 'happy'
        const result = await getSongByMood({ mood })
        console.log(result.song);

    }
    return (
        <main onClick={call}>
            onClick
        </main>
    )
}

export default Checks
