import React, { useEffect, useState } from 'react'
import { getLeaderboard } from '../api'
import axios from 'axios'


interface User {
    username: string
    rating: number
}

export const LeaderboardPage: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await getLeaderboard()
                setLeaderboard(response.data)
            } catch (error) {
                if (axios.isAxiosError<{ detail: string }>(error)) {
                    if (error.response?.data?.detail) {
                        setError(error.response.data.detail)
                        console.error(error.response.data.detail)
                    }
                }
            }
        }
        fetchLeaderboard()
    }, [])

    return (
        <div>
            <h2>Leaderboard</h2>
            {error && <p>{error}</p>}
            <ul>
                {leaderboard.map((user: User, index: number) => (
                    <li key={user.username}>
                        <p>{index + 1}. {user.username} - {user.rating}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default LeaderboardPage