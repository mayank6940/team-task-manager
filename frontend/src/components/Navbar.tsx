import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { user, setToken } = useAuth() as any
  const navigate = useNavigate()

  const logout = () => {
    setToken(null)
    navigate('/login')
  }

  const initials = user?.name ? user.name.split(' ').map((s: string) => s[0]).slice(0,2).join('') : 'U'

  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#e6c7b0] to-[#d5b9a0] text-[#6b3b2a] rounded-lg px-3 py-1 font-bold">TTM</div>
            <div className="text-lg font-semibold text-[#3b2b26]">Team Task Manager</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-700 mr-2 text-right">
            <div className="font-medium">{user?.name}</div>
            <div className="text-xs text-gray-500">{user?.role}</div>
          </div>
          <div className="avatar h-9 w-9">{initials}</div>
          <button onClick={logout} className="ghost-btn">Sign out</button>
        </div>
      </div>
    </header>
  )
}
