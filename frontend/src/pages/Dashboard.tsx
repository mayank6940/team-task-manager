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
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDesc, setNewProjectDesc] = useState('')
  const [newProjectPriority, setNewProjectPriority] = useState('MEDIUM')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
        setData(res.data)
        const projRes = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/projects`, { headers: { Authorization: `Bearer ${token}` } })
        setProjects(projRes.data.projects || [])
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [token])

  const handleCreateProject = async (e: any) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!newProjectName.trim()) {
      setError('Project name is required')
      return
    }
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/projects`, { name: newProjectName, description: newProjectDesc, priority: newProjectPriority }, { headers: { Authorization: `Bearer ${token}` } })
      console.log('Project created:', res.data)
      setSuccess('Project created successfully!')
      setNewProjectName('')
      setNewProjectDesc('')
      setNewProjectPriority('MEDIUM')
      setTimeout(() => setSuccess(''), 3000)
      const projRes = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/projects`, { headers: { Authorization: `Bearer ${token}` } })
      setProjects(projRes.data.projects || [])
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to create project'
      setError(msg)
      console.error('Create project error:', err)
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || ''}/api/projects/${projectId}`, { headers: { Authorization: `Bearer ${token}` } })
      setSuccess('Project deleted successfully!')
      setTimeout(() => setSuccess(''), 3000)
      const projRes = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/projects`, { headers: { Authorization: `Bearer ${token}` } })
      setProjects(projRes.data.projects || [])
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete project'
      setError(msg)
    }
  }

  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)

  const onRequestDeleteProject = (projectId: string) => {
    setProjectToDelete(projectId)
  }

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return
    await deleteProject(projectToDelete)
    setProjectToDelete(null)
  }

  const [showCreate, setShowCreate] = useState(false)

  const handleCreate = async (payload: any) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/projects`, payload, { headers: { Authorization: `Bearer ${token}` } })
      const projRes = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/projects`, { headers: { Authorization: `Bearer ${token}` } })
      setProjects(projRes.data.projects || [])
    } catch (err: any) {
      console.error('create project failed', err)
    }
  }

  if (!data) return <div className="min-h-screen flex items-center justify-center"><div className="text-xl text-gray-600">Loading...</div></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="w-full px-4 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="section-label">Overview</div>
            <h2 className="text-4xl font-extrabold text-[#1a140c] tracking-tight">Dashboard</h2>
          </div>
          <div className="flex gap-3 items-center">
            {user?.role === 'ADMIN' && (
              <button onClick={() => setShowCreate(true)} className="primary-btn">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                New Project
              </button>
            )}
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="stat-card">
            <div className="p-3 rounded-2xl bg-blue-50/50">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Tasks</div>
              <div className="text-2xl font-black text-gray-900">{data.total}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="p-3 rounded-2xl bg-amber-50/50">
              <div className="h-6 w-6 flex items-center justify-center text-amber-600 font-black text-xl">!</div>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">To Do</div>
              <div className="text-2xl font-black text-gray-900">{data.byStatus.TODO}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="p-3 rounded-2xl bg-indigo-50/50">
              <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">In Progress</div>
              <div className="text-2xl font-black text-gray-900">{data.byStatus.IN_PROGRESS}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="p-3 rounded-2xl bg-emerald-50/50">
              <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Completed</div>
              <div className="text-2xl font-black text-gray-900">{data.byStatus.DONE}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects Section */}
          <div className="lg:col-span-2 space-y-10">
            {/* Active Projects */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#1a140c]">Active Projects</h3>
                <div className="pill bg-white shadow-sm border border-gray-100">
                  {projects.filter((p: any) => (p.tasks || []).length === 0 || (p.tasks || []).some((t: any) => t.status !== 'DONE')).length}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.filter((p: any) => (p.tasks || []).length === 0 || (p.tasks || []).some((t: any) => t.status !== 'DONE')).map((p: any) => {
                  const accent = p.priority === 'HIGH' ? 'bg-rose-500' : p.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
                  return (
                    <div key={p.id} className="card group relative flex flex-col justify-between overflow-hidden min-h-[180px]">
                      <div className={`absolute top-0 left-0 w-full h-1.5 ${accent}`}></div>
                      <div className="mb-4">
                        <Link to={`/projects/${p.id}`} className="block group-hover:translate-x-1 transition-transform">
                          <div className="font-bold text-lg text-gray-900 mb-1 flex items-center gap-2">
                            {p.name}
                            <svg className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{p.description}</p>
                        </Link>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100/60">
                        <div className="flex -space-x-2">
                          {p.members?.slice(0,3).map((m: any) => (
                            <div key={m.id} title={m.user?.name} className="avatar h-8 w-8 text-[10px] border-2 border-white">{m.user?.name.split(' ').map((s:any)=>s[0]).slice(0,2).join('')}</div>
                          ))}
                          {p.members?.length > 3 && (
                            <div className="avatar h-8 w-8 text-[10px] border-2 border-white bg-gray-200">+{p.members.length - 3}</div>
                          )}
                        </div>
                        {user?.role === 'ADMIN' && (
                          <button onClick={() => onRequestDeleteProject(p.id)} className="text-xs font-bold text-rose-500 hover:text-rose-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
                        )}
                      </div>
                    </div>
                  )
                })}
                {projects.length === 0 && (
                  <div className="col-span-full card py-20 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">No projects yet</h4>
                    <p className="text-gray-500 max-w-xs mt-1">Get started by creating your first project and inviting team members.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Completed Projects */}
            {projects.some((p: any) => (p.tasks || []).length > 0 && (p.tasks || []).every((t: any) => t.status === 'DONE')) && (
              <div className="space-y-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Completed Projects</h3>
                  <span className="text-[10px] font-bold text-emerald-500">All Tasks Done</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60 hover:opacity-100 transition-opacity">
                  {projects.filter((p: any) => (p.tasks || []).length > 0 && (p.tasks || []).every((t: any) => t.status === 'DONE')).map((p: any) => (
                    <div key={p.id} className="card group bg-gray-50/50 border-dashed flex flex-col justify-between min-h-[140px]">
                      <div>
                        <Link to={`/projects/${p.id}`} className="block">
                          <div className="font-bold text-gray-600 mb-1 flex items-center gap-2 italic line-through decoration-gray-300">
                            {p.name}
                            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                          </div>
                        </Link>
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase">Archive Ready</div>
                        {user?.role === 'ADMIN' && (
                          <button onClick={() => onRequestDeleteProject(p.id)} className="text-xs font-bold text-rose-400 hover:text-rose-600">Delete</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side Panels */}
          <div className="space-y-6">
            <div className="card border-l-[6px] border-rose-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Overdue Tasks</h3>
                <span className="pill bg-rose-50 text-rose-600 text-[10px]">{data.overdue.length}</span>
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {data.overdue.length > 0 ? data.overdue.map((t:any)=>(
                  <div key={t.id} className="p-3 bg-white/40 rounded-xl border border-white/60 shadow-sm">
                    <div className="font-bold text-sm text-gray-800 mb-1">{t.title}</div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-rose-500 font-black">EXPIRED</span>
                      <span className="text-gray-400">{new Date(t.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                )) : <p className="text-center py-6 text-sm text-gray-400 italic">Everything's on track!</p>}
              </div>
            </div>

            <div className="card border-l-[6px] border-blue-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Assigned to Me</h3>
                <span className="pill bg-blue-50 text-blue-600 text-[10px]">{data.assignedToMe.length}</span>
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {data.assignedToMe.length > 0 ? data.assignedToMe.map((t:any)=>(
                  <div key={t.id} className="p-3 bg-white/40 rounded-xl border border-white/60 shadow-sm flex flex-col gap-2">
                    <div className="font-bold text-sm text-gray-800">{t.title}</div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${t.status === 'DONE' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                )) : <p className="text-center py-6 text-sm text-gray-400 italic">No pending assignments.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
      {projectToDelete && (
        <ConfirmModal open={!!projectToDelete} title="Delete project" message="Are you sure you want to delete this project and its tasks? This cannot be undone." onConfirm={confirmDeleteProject} onCancel={() => setProjectToDelete(null)} />
      )}
      {showCreate && (
        <CreateProjectModal open={showCreate} onClose={() => setShowCreate(false)} onCreate={handleCreate} />
      )}
    </div>
  )
}
