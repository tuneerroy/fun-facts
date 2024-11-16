import React, { useEffect, useState } from 'react'
import { getUnapprovedItems, judgeItem } from '../api'
import axios from 'axios'

interface Item {
    id: string
    content: string
    is_fact: boolean
}

export const AdminJudgingPage: React.FC = () => {
    const [items, setItems] = useState([])
    const [error, setError] = useState('')

    const fetchItems = async () => {
        setError('')
        try {
            const response = await getUnapprovedItems()
            setItems(response.data)
        } catch (error) {
            if (axios.isAxiosError<{ detail: string }>(error)) {
                if (error.response?.data?.detail) {
                    setError(error.response.data.detail)
                    console.log(error.response.data.detail)
                }
            }
        }
    }

    const judge = async (id: string, approve: boolean) => {
        setError('')
        try {
            await judgeItem(id, approve)
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

    return (
        <div>
            <h2>Admin Judging</h2>
            {error && <p>{error}</p>}
            <ul>
                {items.map((item: Item) => (
                    <li key={item.id}>
                        <p>{item.content}</p>
                        <p>{item.is_fact ? 'Fact' : 'Fiction'}</p>
                        <button onClick={() => judge(item.id, true)}>Approve</button>
                        <button onClick={() => judge(item.id, false)}>Reject</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default AdminJudgingPage