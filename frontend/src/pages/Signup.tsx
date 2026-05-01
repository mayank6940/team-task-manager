import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/auth/signup`, { name, email, password })
      navigate('/login')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gray-100/50 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gray-200/30 blur-[120px]"></div>
      
      <div className="relative w-full max-w-md z-10">
        <div className="card p-10 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100">
          <div className="text-center mb-10">
            <div className="bg-black text-white w-14 h-14 rounded-2xl flex items-center justify-center font-black mx-auto mb-6 shadow-2xl shadow-black/20">TTM</div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Join the Team</h1>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-3">Create your workspace account</p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="label mb-1.5 block">Full Name</label>
              <input className="input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Mayank Raj" required />
            </div>
            <div>
              <label className="label mb-1.5 block">Email</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <label className="label mb-1.5 block">Password</label>
              <div className="relative group">
                <input 
                  className="input pr-12" 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  required 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 1.225 0 2.395.27 3.44.755M15 15a3 3 0 01-4.899-3.899m-1.936-1.936A3 3 0 0112 9c.408 0 .794.082 1.144.23m5.408 5.408a9.944 9.944 0 012.9 2.9m-2.9-2.9l-2.9-2.9m-2.9-2.9a9.94 9.94 0 00-2.9-2.9m2.9 2.9l2.9 2.9m-2.9 2.9a9.94 9.94 0 002.9 2.9m-2.9-2.9l2.9 2.9"/></svg>
                  )}
                </button>
              </div>
            </div>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-medium">{error}</div>}
            <button type="submit" className="primary-btn w-full justify-center text-base py-4 shadow-2xl shadow-black/10">Get Started</button>
          </form>
          <p className="text-center text-gray-500 mt-10 text-sm font-medium">
            Already have an account? <Link to="/login" className="text-black font-black hover:underline underline-offset-8 transition-all">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
