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
    <header className="navbar sticky top-0 z-50 backdrop-blur-md bg-white/80">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-gradient-to-br from-[#1a140c] to-[#3b2b26] text-white rounded-2xl h-10 w-10 flex items-center justify-center font-black shadow-lg shadow-black/10 group-hover:scale-105 transition">TTM</div>
            <div className="text-xl font-black text-[#1a140c] tracking-tight hidden sm:block">Team Task Manager</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-[#1a140c] leading-none">{user?.name}</div>
              <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">{user?.role}</div>
            </div>
            <div className="avatar h-10 w-10 shadow-sm ring-4 ring-[#fbf6f1]">{initials}</div>
            <button onClick={logout} className="p-2 text-gray-400 hover:text-rose-500 transition-colors" title="Sign Out">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
