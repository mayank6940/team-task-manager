import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ConfirmModal from '../components/ConfirmModal'
import CreateProjectModal from '../components/CreateProjectModal'

export default function Dashboard() {
  const auth = useAuth() as any
  const { token, user } = auth
  const [data, setData] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')
  const [filterPriority, setFilterPriority] = useState('ALL')
  const [activities, setActivities] = useState<any[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, projRes, actRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL || ''}/api/dashboard`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL || ''}/api/projects`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${import.meta.env.VITE_API_URL || ''}/api/projects/feed/recent`, { headers: { Authorization: `Bearer ${token}` } })
        ])
        setData(dashRes.data)
        setProjects(projRes.data.projects || [])
        setActivities(actRes.data || [])
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [token])

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.description || '').toLowerCase().includes(search.toLowerCase())
    const matchesPriority = filterPriority === 'ALL' || p.priority === filterPriority
    return matchesSearch && matchesPriority
  })

  const getProgress = (project: any) => {
    const tasks = project.tasks || []
    if (tasks.length === 0) return 0
    const score = tasks.reduce((acc: number, t: any) => {
      if (t.status === 'DONE') return acc + 1
      if (t.status === 'IN_PROGRESS') return acc + 0.5
      return acc
    }, 0)
    return Math.min(100, Math.round((score / tasks.length) * 100))
  }

  const deleteProject = async (projectId: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || ''}/api/projects/${projectId}`, { headers: { Authorization: `Bearer ${token}` } })
      setProjects(projects.filter(p => p.id !== projectId))
      setSuccess('Project deleted successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete project')
    }
  }

  const handleCreate = async (payload: any) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/projects`, payload, { headers: { Authorization: `Bearer ${token}` } })
      const newProj = res.data
      setProjects([newProj, ...projects])
      setShowCreate(false)
      setSuccess('Project created!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      console.error('create project failed', err)
    }
  }

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return
    await deleteProject(projectToDelete)
    setProjectToDelete(null)
  }

  if (!data) return <div className="min-h-screen flex items-center justify-center bg-gray-50 transition-colors"><div className="text-xl font-bold text-gray-400 animate-pulse">Loading Workspace...</div></div>

  return (
    <div className="min-h-screen bg-gray-50 transition-colors">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-slide-up">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black text-[#1a140c] tracking-tighter leading-none">Command Center</h1>
            <p className="text-gray-400 mt-3 font-semibold text-sm uppercase tracking-widest">Active Workspace: {user?.name}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            <div className="relative group flex-1 sm:flex-none">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-3 w-full sm:w-64 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
              />
            </div>
            
            <select 
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 outline-none hover:bg-gray-50 transition-colors shadow-sm w-full sm:w-auto"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            {user?.role === 'ADMIN' && (
              <button onClick={() => setShowCreate(true)} className="primary-btn justify-center w-full sm:w-auto">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                New Project
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6 border-none shadow-sm group hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all shadow-sm mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Scope</div>
              <div className="text-3xl font-black text-gray-900">{data.total}</div>
            </div>
          </div>
          <div className="card p-6 border-none shadow-sm group hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all shadow-sm mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Queue</div>
              <div className="text-3xl font-black text-gray-900">{data.byStatus?.TODO || 0}</div>
            </div>
          </div>
          <div className="card p-6 border-none shadow-sm group hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all shadow-sm mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Active</div>
              <div className="text-3xl font-black text-gray-900">{data.byStatus?.IN_PROGRESS || 0}</div>
            </div>
          </div>
          <div className="card p-6 border-none shadow-sm group hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all shadow-sm mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
            </div>
            <div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Done</div>
              <div className="text-3xl font-black text-gray-900">{data.byStatus?.DONE || 0}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Projects Section */}
          <div className="lg:col-span-3 space-y-10">
            {/* Active Projects */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#1a140c]">Active Projects</h3>
                <div className="pill bg-white shadow-sm border border-gray-100">
                  {filteredProjects.filter((p: any) => (p.tasks || []).length === 0 || (p.tasks || []).some((t: any) => t.status !== 'DONE')).length}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.filter((p: any) => (p.tasks || []).length === 0 || (p.tasks || []).some((t: any) => t.status !== 'DONE')).map((p: any) => {
                  const progress = getProgress(p)
                  return (
                    <div key={p.id} className="card group relative flex flex-col justify-between overflow-hidden min-h-[220px]">
                      <div className="mb-4">
                        <Link to={`/projects/${p.id}`} className="block group-hover:translate-x-1 transition-transform">
                          <div className="flex items-start justify-between">
                            <div className="font-bold text-lg text-gray-900 mb-1 flex items-center gap-2">
                              {p.name}
                              <svg className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
                            </div>
                            <div className="text-[10px] font-black text-gray-500 bg-gray-50 px-2 py-1 rounded-md">{progress}%</div>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mt-2">{p.description}</p>
                        </Link>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-auto mb-6">
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-black transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100/60 ">
                        <div className="flex -space-x-2">
                          {(p.members || []).slice(0,3).map((m: any) => (
                            <div key={m.id} title={m.user?.name} className="avatar h-8 w-8 text-[10px] border-2 border-white ">{m.user?.name.split(' ').map((s:any)=>s[0]).slice(0,2).join('')}</div>
                          ))}
                          {(p.members || []).length > 3 && (
                            <div className="avatar h-8 w-8 text-[10px] border-2 border-white  bg-gray-200 ">+{(p.members || []).length - 3}</div>
                          )}
                        </div>
                        {user?.role === 'ADMIN' && (
                          <button onClick={() => setProjectToDelete(p.id)} className="text-xs font-bold text-rose-500 hover:text-rose-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
                        )}
                      </div>
                    </div>
                  )
                })}
                {filteredProjects.length === 0 && (
                  <div className="col-span-full card py-20 flex flex-col items-center justify-center text-center bg-white/40  border-dashed">
                    <div className="w-16 h-16 bg-gray-100  rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-300 " fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 ">No matches found</h4>
                    <p className="text-gray-500  max-w-xs mt-1">Try adjusting your filters or search terms.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Completed Projects */}
            {filteredProjects.some((p: any) => (p.tasks || []).length > 0 && (p.tasks || []).every((t: any) => t.status === 'DONE')) && (
              <div className="space-y-6 pt-6 border-t border-gray-100 ">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Completed Projects</h3>
                  <span className="text-[10px] font-bold text-gray-400">History</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60 hover:opacity-100 transition-all duration-300">
                  {filteredProjects.filter((p: any) => (p.tasks || []).length > 0 && (p.tasks || []).every((t: any) => t.status === 'DONE')).map((p: any) => (
                    <div key={p.id} className="card group bg-gray-50/50  border-dashed flex flex-col justify-between min-h-[140px]">
                      <div>
                        <Link to={`/projects/${p.id}`} className="block">
                          <div className="font-bold text-gray-600  mb-1 flex items-center gap-2 italic line-through decoration-gray-300 ">
                            {p.name}
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                          </div>
                        </Link>
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <div className="text-[10px] font-bold text-gray-400 bg-gray-50  px-2 py-1 rounded-md uppercase">Archived</div>
                        {user?.role === 'ADMIN' && (
                          <button onClick={() => setProjectToDelete(p.id)} className="text-xs font-bold text-rose-400 hover:text-rose-600">Delete</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Activity Feed Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-xl font-black text-[#1a140c] tracking-tight flex items-center gap-2">
              Recent Events
              <div className="w-2 h-2 rounded-full bg-black animate-ping"></div>
            </h3>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {activities.length > 0 ? activities.map((act) => (
                <div key={act.id} className="p-4 bg-white rounded-3xl border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="avatar h-10 w-10 text-[10px] bg-gray-50 border border-gray-100">{act.user.name.split(' ').map((s:any)=>s[0]).join('')}</div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-gray-900">{act.user.name}</div>
                      <div className="text-[13px] font-medium text-gray-500 mt-0.5 leading-relaxed">{act.message}</div>
                      <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2">
                        {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-10 text-center card bg-gray-50/50 border-dashed">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Quiet for now...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <ConfirmModal 
        open={!!projectToDelete} 
        onClose={() => setProjectToDelete(null)} 
        onConfirm={confirmDeleteProject}
        title="Delete Project?"
        message="This will permanently delete the project and all its tasks. This action cannot be undone."
      />
      <CreateProjectModal 
        open={showCreate} 
        onClose={() => setShowCreate(false)} 
        onCreate={handleCreate} 
      />
    </div>
  )
}
