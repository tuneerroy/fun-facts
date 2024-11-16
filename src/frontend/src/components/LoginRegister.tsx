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
        <div>
            <h2>{'Welcome!'}</h2>
            {error && <p>{error}</p>}
            <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleRegister}>Register</button>
        </div>
    )
}

export default LoginRegister