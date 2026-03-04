import { useContext, useRef, useState } from "react";
import { getSong } from "../services/song.api";
import { context } from "../context/SongContex";

function getSongErrorMessage(err) {
    if (err?.response?.data?.message) return err.response.data.message;
    if (err?.response?.data?.error) return err.response.data.error;
    if (err?.message) return err.message;
    return "Unable to fetch songs for this mood.";
}

function normalizeMood(mood = "") {
    return String(mood).trim().toLowerCase();
}

function pickPlayableSong(songList, lastSongId) {
    if (!Array.isArray(songList) || songList.length === 0) return null;
    if (songList.length === 1) return songList[0];

    const pool = songList.filter((item) => item?._id !== lastSongId);
    const candidates = pool.length > 0 ? pool : songList;
    const index = Math.floor(Math.random() * candidates.length);
    return candidates[index];
}

export function useSong() {
    const { song, setsong, songs, setsongs, loading, setloading } = useContext(context)
    const cacheRef = useRef({});
    const lastSongIdByMoodRef = useRef({});
    const [error, setError] = useState(null);

    async function getSongByMood({ mood, forceRefresh = false }) {
        const moodKey = normalizeMood(mood);
        if (!moodKey) return { song: null, songs: [] };

        if (!forceRefresh && cacheRef.current[moodKey]) {
            const cachedSongs = cacheRef.current[moodKey];
            const selectedSong = pickPlayableSong(
                cachedSongs,
                lastSongIdByMoodRef.current[moodKey]
            );

            lastSongIdByMoodRef.current[moodKey] = selectedSong?._id || null;
            setsongs(cachedSongs);
            setsong(selectedSong);
            setError(null);
            return { song: selectedSong, songs: cachedSongs };
        }

        try {
            setloading(true)
            setError(null);

            const data = await getSong({ mood: moodKey })
            const fetchedSongs = Array.isArray(data?.songs)
                ? data.songs
                : data?.song
                    ? [data.song]
                    : [];

            cacheRef.current[moodKey] = fetchedSongs;

            const selectedSong = pickPlayableSong(
                fetchedSongs,
                lastSongIdByMoodRef.current[moodKey]
            );

            lastSongIdByMoodRef.current[moodKey] = selectedSong?._id || null;
            setsongs(fetchedSongs);
            setsong(selectedSong);

            return { song: selectedSong, songs: fetchedSongs }
        } catch (err) {
            setError(getSongErrorMessage(err));
            throw err
        } finally {
            setloading(false)
        }
    }

    function selectSong(songItem) {
        setsong(songItem || null);
    }

    return { getSongByMood, selectSong, song, songs, loading, error }
}
