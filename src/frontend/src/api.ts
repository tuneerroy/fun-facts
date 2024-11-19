import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
})

export const getUser = () => api.get('/accounts')
export const logoutUser = () => api.post('/accounts/logout')

export const login = (username: string, password: string) =>
  api.post('/accounts/login', { username, password })
export const signup = (username: string, password: string) =>
  api.post('/accounts/signup', { username, password })

export const submitFactFiction = (type: string, content: string, sources: string[]) => api.post('/items', { type, content, sources })
export const getUnapprovedItems = () => api.get('/protected/items')
export const judgeItem = (id: string, approve: boolean) => api.post(`/protected/items/${id}`, { approve })

export const getLeaderboard = () => api.get('/leaderboard')

export const getRandomItem = () => api.get('/items/random')
export const submitGuess = (id: string, guess: string, ai_generated: boolean | null) =>
  api.post(`/items/${id}`, { guess, ai_generated })

