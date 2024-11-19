import React, { useState, useEffect } from 'react'
import { getRandomItem, submitGuess } from '../api'
import axios from 'axios'

export const GamePage: React.FC = () => {
    const [item, setItem] = useState<{ id: string, content: string } | null>(null)
    const [guess, setGuess] = useState<'fact' | 'fiction' | null>(null)
    const [aiGuess, setAiGuess] = useState<boolean | null>(null)
    const [error, setError] = useState('')

    const fetchItem = async () => {
        const response = await getRandomItem()
        setItem(response.data)
    }

    const handleSubmit = async () => {
        if (!item || guess === null) return
        try {
            await submitGuess(item.id, guess, aiGuess)
            setGuess(null)
            setAiGuess(null)
        } catch (error) {
            if (axios.isAxiosError<{ detail: string }>(error)) {
                if (error.response?.data?.detail) {
                    setError(error.response.data.detail)
                }
            }
        }
        fetchItem()
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Guess if the following is Fact or Fiction</h2>
            {error && <p className="text-red-500">{error}</p>}
            <p className="border p-4 mb-4 rounded bg-gray-50">{item?.content}</p>
            <div className="mb-4">
                <select
                    className="border border-gray-300 p-2 rounded w-full"
                    value={guess ?? ''}
                    onChange={(e) => setGuess(e.target.value as 'fact' | 'fiction')}
                >
                    <option value="">Select</option>
                    <option value="fact">Fact</option>
                    <option value="fiction">Fiction</option>
                </select>
            </div>
            {guess === 'fiction' && (
                <div className="mb-4 flex items-center gap-2">
                    <label className="text-gray-700">AI-generated?</label>
                    <input
                        type="checkbox"
                        checked={!!aiGuess}
                        onChange={(e) => setAiGuess(e.target.checked)}
                        className="h-5 w-5"
                    />
                </div>
            )}
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleSubmit}
            >
                Submit
            </button>
        </div>
    )
}

export default GamePage
