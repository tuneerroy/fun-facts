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
                    console.error(error.response.data.detail)
                }
            }
        }
        // TODO: update rating etc
        fetchItem()
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <h2>Guess if the following is Fact or Fiction</h2>
            {error && <p>{error}</p>}
            <p>{item?.content}</p>
            <select value={guess ?? ''} onChange={(e) => setGuess(e.target.value as 'fact' | 'fiction')}>
                <option value="">Select</option>
                <option value="fact">Fact</option>
                <option value="fiction">Fiction</option>
            </select>
            {guess === 'fiction' && (
                <div>
                    <label>AI-generated?</label>
                    <input type="checkbox" checked={!!aiGuess} onChange={(e) => setAiGuess(e.target.checked)} />
                </div>
            )}
            <button onClick={handleSubmit}>Submit</button>
            {/* <h3>Your rating: {rating}</h3> */}
        </div>
    )
}

export default GamePage