import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

export default function Team() {
  const { token, user } = useAuth() as any
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/auth/users`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUsers(res.data)
      } catch (err) {
        console.error('Failed to fetch users', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="animate-pulse font-black text-gray-300 text-2xl uppercase tracking-widest">Gathering Team...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">The Collective</h1>
            <p className="text-gray-400 font-bold text-sm uppercase tracking-[0.2em]">Total Organization Members: {users.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((u) => {
            const initials = u.name.split(' ').map((s: any) => s[0]).slice(0, 2).join('')
            const isAdmin = u.role === 'ADMIN'
            
            return (
              <Link to={`/team/${u.id}`} key={u.id} className="card group hover:scale-[1.02] transition-all bg-white border border-gray-100 p-8 flex flex-col items-center text-center relative overflow-hidden">
                {isAdmin && (
                  <div className="absolute top-0 right-0 p-3">
                    <div className="bg-black text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-bl-xl rounded-tr-xl">Admin Access</div>
                  </div>
                )}
                
                <div className={`avatar h-20 w-20 text-2xl mb-6 shadow-xl ring-8 ring-gray-50 group-hover:ring-black/5 transition-all ${isAdmin ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'}`}>
                  {initials}
                </div>
                
                <div className="space-y-1 mb-6">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">{u.name}</h3>
                  <p className="text-xs font-bold text-gray-400 truncate max-w-[200px]">{u.email}</p>
                </div>

                <div className={`text-[10px] font-black uppercase tracking-[0.15em] px-4 py-2 rounded-full border ${isAdmin ? 'border-black text-black' : 'border-gray-100 text-gray-400'}`}>
                  {u.role}
                </div>

                {/* Decorative element */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-50 group-hover:bg-black transition-colors duration-500"></div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
