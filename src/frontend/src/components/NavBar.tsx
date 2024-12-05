import React from 'react'
import { Link } from 'react-router-dom'

interface NavBarProps {
    isAdmin: boolean
    onLogout: () => void
}

const NavBar: React.FC<NavBarProps> = ({ isAdmin, onLogout }) => {
    return (
        <nav className="bg-gray-800 p-4 text-white">
            <ul className="flex gap-4">
                <li className="mt-2"><Link to="/" className="hover:underline">Game</Link></li>
                <li className="mt-2"><Link to="/leaderboard" className="hover:underline">Leaderboard</Link></li>
                {isAdmin && <li className="mt-2"><Link to="/admin" className="hover:underline">Admin</Link></li>}
                <li className="mt-2"><Link to="/submit" className="hover:underline">Submit Fact</Link></li>
                <li>
                    <button
                        onClick={onLogout}
                        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default NavBar
