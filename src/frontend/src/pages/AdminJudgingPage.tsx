import React, { useEffect, useState } from 'react'
import { getUnapprovedItems, judgeItem } from '../api'
import axios from 'axios'

interface Item {
    id: string
    content: string
    is_fact: boolean
}

export const AdminJudgingPage: React.FC = () => {
    const [items, setItems] = useState<Item[]>([])
    const [error, setError] = useState('')
    const [ratings, setRatings] = useState<{ [key: string]: number }>({})

    const fetchItems = async () => {
        setError('')
        try {
            const response = await getUnapprovedItems()
            setItems(response.data)
        } catch (error) {
            if (axios.isAxiosError<{ detail: string }>(error)) {
                if (error.response?.data?.detail) {
                    setError(error.response.data.detail)
                }
            }
        }
    }

    const judge = async (id: string, approve: boolean) => {
        setError('')
        const rating = ratings[id]

        if (approve && (rating === undefined || rating < 0 || rating > 100)) {
            setError('Please provide a rating from 0-100 for approval.')
            return
        }

        try {
            await judgeItem(id, approve, approve ? rating : undefined)
            fetchItems()
        } catch (error) {
            if (axios.isAxiosError<{ detail: string }>(error)) {
                if (error.response?.data?.detail) {
                    setError(error.response.data.detail)
                }
            }
        }
    }

    useEffect(() => {
        fetchItems()
    }, [])

    const handleRatingChange = (id: string, value: number) => {
        setRatings((prev) => ({ ...prev, [id]: value }))
    }

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Admin Judging</h2>
            {error && <p className="text-red-500">{error}</p>}
            {items.length === 0 && <p>No items to judge!</p>}
            <ul className="space-y-4">
                {items.map((item) => (
                    <li
                        key={item.id}
                        className="border border-gray-300 rounded p-4 shadow-md"
                    >
                        <p className="mb-2 font-medium">{item.content}</p>
                        <p className="mb-4">{item.is_fact ? 'Fact' : 'Fiction'}</p>
                        <div className="mb-4">
                            <label htmlFor={`rating-${item.id}`} className="block font-medium mb-2">
                                Rating (0-100):
                            </label>
                            <input
                                id={`rating-${item.id}`}
                                type="number"
                                min="0"
                                max="100"
                                value={ratings[item.id] === undefined ? '' : ratings[item.id]}
                                onChange={(e) => handleRatingChange(item.id, Number(e.target.value))}
                                className="border border-gray-300 rounded px-2 py-1 w-20"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => judge(item.id, true)}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => judge(item.id, false)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Reject
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default AdminJudgingPage
