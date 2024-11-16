import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { getUser, logoutUser } from './api'
import LoginRegister from './components/LoginRegister'
import GamePage from './pages/GamePage'
import LeaderboardPage from './pages/LeaderboardPage'
import AdminJudgingPage from './pages/AdminJudgingPage'
import SubmitFactPage from './pages/SubmitFactPage'
import NavBar from './components/NavBar'

export const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    getUser().then(({ data }) => {
      setLoggedIn(true)
      setIsAdmin(data.is_admin)
    }).catch(() => {
      // do nothing
    })
  }, [])

  const handleLogout = () => {
    logoutUser().then(() => {
      setLoggedIn(false)
      setIsAdmin(false)
    }).catch(() => {
      // do nothing
    })
  }

  const onLoginSuccess = () => {
    // refresh page
    window.location.reload()
  }

  if (!loggedIn) return <LoginRegister onLoginSuccess={onLoginSuccess} />

  return (
    <Router>
      <NavBar isAdmin={isAdmin} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<GamePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        {isAdmin && <Route path="/admin" element={<AdminJudgingPage />} />}
        <Route path="/submit" element={<SubmitFactPage />} />
      </Routes>
    </Router>
  )
}

export default App