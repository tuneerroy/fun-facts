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
                }
            }
        }
    }

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Submit a Fact or Fiction</h2>
            {error && <p className="text-red-500">{error}</p>}
            <div className="mb-4">
                <select
                    className="border border-gray-300 p-2 rounded w-full"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="">Select</option>
                    <option value="fact">Fact</option>
                    <option value="fiction">Fiction</option>
                </select>
            </div>
            <textarea
                className="border border-gray-300 p-2 rounded w-full mb-4"
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <input
                className="border border-gray-300 p-2 rounded w-full mb-4"
                placeholder="Sources (comma-separated)"
                value={sources}
                onChange={(e) => setSources(e.target.value)}
            />
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleSubmit}
            >
                Submit
            </button>
        </div>
    )
}

export default SubmitFactFictionPage
