import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

export default function MemberProfile() {
  const { id } = useParams()
  const { token } = useAuth() as any
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/auth/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setData(res.data)
      } catch (err) {
        console.error('Failed to fetch member data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchMemberData()
  }, [id, token])

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="animate-pulse font-black text-gray-300 text-2xl uppercase tracking-widest italic">Syncing Intelligence...</div>
      </div>
    </div>
  )

  if (!data) return <div className="p-20 text-center font-bold text-gray-400 uppercase tracking-widest">Profile Not Found</div>

  const { user, stats } = data
  const completionRate = stats.totalTasks > 0 ? Math.round((stats.done / stats.totalTasks) * 100) : 0
  const initials = user.name.split(' ').map((s: any) => s[0]).slice(0, 2).join('')

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-10 animate-slide-up">
        {/* Back Navigation (Only for Admins) */}
        {user?.role === 'ADMIN' && (
          <Link to="/team" className="inline-flex items-center gap-2 text-xs font-black text-gray-400 hover:text-black transition-all uppercase tracking-widest group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
            Back to Collective
          </Link>
        )}

        {/* Profile Header Card */}
        <div className="card p-12 bg-white border-none shadow-sm flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full opacity-50"></div>
          
          <div className="avatar h-32 w-32 text-4xl shadow-2xl ring-[12px] ring-gray-50 bg-black text-white relative z-10">
            {initials}
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4 relative z-10">
            <div className="space-y-1">
              <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">{user.name}</h1>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">{user.email}</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="pill bg-gray-900 text-white border-none px-4 py-2">{user.role} Member</span>
              <span className="pill bg-white border border-gray-100 text-gray-400 px-4 py-2 italic font-medium">Joined {new Date(user.createdAt).toLocaleDateString([], { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          <div className="text-center md:text-right space-y-2 relative z-10">
            <div className="text-6xl font-black text-gray-900 tracking-tighter">{completionRate}%</div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Efficiency Index</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" label="Total Tasks" value={stats.totalTasks} />
          <StatCard icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" label="In Progress" value={stats.inProgress} color="text-gray-900" />
          <StatCard icon="M5 13l4 4L19 7" label="Completed" value={stats.done} color="text-gray-900" />
          <StatCard icon="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" label="Active Projects" value={stats.projectCount} />
        </div>

        {/* Projects Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Assigned Projects</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.projects.length > 0 ? stats.projects.map((p: any) => (
                <Link to={`/projects/${p.id}`} key={p.id} className="card p-6 bg-white border border-gray-100 hover:border-black transition-all group flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 group-hover:translate-x-1 transition-transform truncate">{p.name}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Status: Active</div>
                  </div>
                  <svg className="w-5 h-5 text-gray-200 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
              )) : (
                <div className="col-span-full py-10 text-center border-2 border-dashed border-gray-200 rounded-[32px] text-gray-300 font-bold uppercase tracking-widest text-xs">No project assignments</div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Performance Chart</h3>
            <div className="card p-8 bg-black text-white space-y-6 shadow-2xl shadow-black/20">
              <div className="space-y-4">
                <ProgressItem label="Completed" value={stats.done} total={stats.totalTasks} color="bg-white" />
                <ProgressItem label="In Progress" value={stats.inProgress} total={stats.totalTasks} color="bg-gray-400" />
                <ProgressItem label="To Do" value={stats.todo} total={stats.totalTasks} color="bg-gray-700" />
              </div>
              <div className="pt-6 border-t border-white/10 text-center">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em]">Workload Capacity</div>
                <div className="text-sm mt-2 font-black italic">{stats.totalTasks > 10 ? 'HIGH PRESSURE' : 'OPTIMAL'}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ icon, label, value, color = "text-gray-900" }: any) {
  return (
    <div className="card p-8 border-none shadow-sm group hover:bg-gray-900 transition-all duration-500">
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-black transition-all mb-6">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon}/></svg>
      </div>
      <div>
        <div className="text-[10px] font-black text-gray-400 group-hover:text-gray-500 uppercase tracking-[0.2em] mb-1">{label}</div>
        <div className={`text-4xl font-black transition-colors group-hover:text-white ${color}`}>{value}</div>
      </div>
    </div>
  )
}

function ProgressItem({ label, value, total, color }: any) {
  const width = total > 0 ? (value / total) * 100 : 0
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <span>{label}</span>
        <span className="text-gray-400">{value}</span>
      </div>
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${width}%` }}></div>
      </div>
    </div>
  )
}
