import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Navbar() {
  const { user, setToken } = useAuth() as any
  const navigate = useNavigate()

  const logout = () => {
    setToken(null)
    navigate('/login')
  }

  const initials = user?.name ? user.name.split(' ').map((s: any) => s[0]).slice(0, 2).join('') : 'U'
  const [showProfile, setShowProfile] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-[#1a140c] text-white px-3 py-1.5 rounded-xl font-black text-sm group-hover:scale-105 transition-transform shadow-lg shadow-black/5">TTM</div>
          <span className="font-bold text-lg tracking-tight text-[#1a140c]">Team Task Manager</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <div className="relative">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 group text-left p-1 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              <div className="hidden sm:block">
                <div className="text-sm font-black text-[#1a140c] leading-none">{user?.name}</div>
                <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">{user?.role}</div>
              </div>
              <div className="avatar h-10 w-10 shadow-sm ring-4 ring-gray-50 group-hover:ring-blue-50 transition-all">{initials}</div>
            </button>

            {showProfile && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)}></div>
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-6 bg-gray-50/50 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="avatar h-14 w-14 text-xl shadow-md ring-4 ring-white">{initials}</div>
                      <div className="min-w-0">
                        <div className="text-lg font-black text-gray-900 truncate">{user?.name}</div>
                        <div className="text-xs font-bold text-blue-600 uppercase tracking-widest">{user?.role}</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-1">
                    <div className="px-3 py-2">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</div>
                      <div className="text-sm font-bold text-gray-700 truncate">{user?.email}</div>
                    </div>
                    <div className="pt-2">
                      <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                      >
                        <div className="w-8 h-8 bg-rose-100 rounded-xl flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                        </div>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
