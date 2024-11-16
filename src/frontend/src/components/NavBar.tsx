import React from 'react'
import { Link } from 'react-router-dom'

interface NavBarProps {
    isAdmin: boolean
    onLogout: () => void
}

const NavBar: React.FC<NavBarProps> = ({ isAdmin, onLogout }) => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Game</Link></li>
                <li><Link to="/leaderboard">Leaderboard</Link></li>
                {isAdmin && <li><Link to="/admin">Admin</Link></li>}
                <li><Link to="/submit">Submit Fact</Link></li>
                <li><button onClick={onLogout}>Logout</button></li>
            </ul>
        </nav>
    )
}

export default NavBar
