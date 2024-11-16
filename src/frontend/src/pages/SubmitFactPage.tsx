import React, { useState } from 'react'
import { submitFactFiction } from '../api'
import axios from 'axios'

export const SubmitFactFictionPage: React.FC = () => {
    const [content, setContent] = useState('')
    const [sources, setSources] = useState('')
    const [type, setType] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async () => {
        setError('')
        const sourcesArray = sources.split(',').map((src) => src.trim())
        try {
            await submitFactFiction(type, content, sourcesArray)

            setType('')
            setContent('')
            setSources('')
        } catch (error) {
            if (axios.isAxiosError<{ detail: string }>(error)) {
                if (error.response?.data?.detail) {
                    setError(error.response.data.detail)
                    console.error(error.response.data.detail)
                }
            }
        }
    }

    return (
        <div>
            <h2>Submit a Fact or Fiction</h2>
            {error && <p>{error}</p>}
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">Select</option>
                <option value="fact">Fact</option>
                <option value="fiction">Fiction</option>
            </select>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} />
            <input placeholder="Sources (comma-separated)" value={sources} onChange={(e) => setSources(e.target.value)} />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default SubmitFactFictionPage