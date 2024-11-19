import React, { useState } from 'react'
import { login, signup } from '../api'
import axios from 'axios'

interface Props {
    onLoginSuccess: () => void
}

export const LoginRegister: React.FC<Props> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleLogin = async () => {
        setError('')
        try {
            await login(username, password)
            onLoginSuccess()
        } catch (error) {
            if (axios.isAxiosError<{ detail: string }>(error)) {
                if (error.response?.data?.detail) {
                    setError(error.response.data.detail)
                }
            }
        }
    }

    const handleRegister = async () => {
        setError('')
        try {
            await signup(username, password)
            onLoginSuccess()
        } catch (error) {
            // TODO:
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <input
                className="border border-gray-300 rounded p-2 mb-2 w-80"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                className="border border-gray-300 rounded p-2 mb-4 w-80"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex gap-4">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={handleLogin}
                >
                    Login
                </button>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={handleRegister}
                >
                    Register
                </button>
            </div>
        </div>
    )
}

export default LoginRegister
