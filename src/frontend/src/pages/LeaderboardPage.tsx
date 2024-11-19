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
                    }
                }
            }
        }
        fetchLeaderboard()
    }, [])

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
            {error && <p className="text-red-500">{error}</p>}
            <ul className="space-y-4">
                {leaderboard.map((user: User, index: number) => (
                    <li
                        key={user.username}
                        className="border border-gray-300 p-4 rounded shadow-md bg-gray-50"
                    >
                        <p>
                            {index + 1}. <span className="font-semibold">{user.username}</span> - {user.rating}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default LeaderboardPage
