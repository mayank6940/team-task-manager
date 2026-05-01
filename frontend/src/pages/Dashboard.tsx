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
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="section-label">Overview</div>
            <h2 className="text-3xl font-bold text-[#3b2b26]">Dashboard</h2>
          </div>
          <div className="flex gap-3 items-center">
            {user?.role === 'ADMIN' && <button onClick={() => setShowCreate(true)} className="primary-btn">New Project</button>}
            <button className="ghost-btn">Help</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="stat-card">
            <div className="p-3 rounded-lg bg-blue-50">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12h6"></path></svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-2xl font-bold text-gray-800">{data.total}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="p-3 rounded-lg bg-yellow-50">
              <div className="h-6 w-6 text-yellow-600">●</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Todo</div>
              <div className="text-2xl font-bold text-gray-800">{data.byStatus.TODO}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="p-3 rounded-lg bg-blue-50">
              <div className="h-6 w-6 text-blue-600">●</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">In Progress</div>
              <div className="text-2xl font-bold text-gray-800">{data.byStatus.IN_PROGRESS}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="p-3 rounded-lg bg-green-50">
              <div className="h-6 w-6 text-green-600">●</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Done</div>
              <div className="text-2xl font-bold text-gray-800">{data.byStatus.DONE}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-800">My Projects</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {projects.map((p: any) => {
                const accent = p.priority === 'HIGH' ? 'bg-red-500' : p.priority === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                return (
                  <div key={p.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
                    <div className={`project-accent ${accent}`}></div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/projects/${p.id}`} className="block">
                        <div className="font-semibold text-gray-800 truncate">{p.name}</div>
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">{p.description}</div>
                      </Link>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {p.members?.slice(0,3).map((m: any) => (
                            <div key={m.id} className="avatar h-7 w-7 text-xs">{m.name.split(' ').map((s:any)=>s[0]).slice(0,2).join('')}</div>
                          ))}
                        </div>
                        <div className="ml-auto">
                          <button onClick={() => onRequestDeleteProject(p.id)} className="ghost-btn">Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <div className="card mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Overdue Tasks</h3>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {data.overdue.length > 0 ? data.overdue.map((t:any)=>(
                  <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm">
                    <div>
                      <div className="font-medium text-gray-800 truncate">{t.title}</div>
                      <div className="muted-2">Due: {new Date(t.dueDate).toLocaleDateString()}</div>
                    </div>
                    <div className="text-sm text-red-600 font-semibold">Overdue</div>
                  </div>
                )) : <p className="muted-2">No overdue tasks</p>}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Assigned to Me</h3>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {data.assignedToMe.length>0 ? data.assignedToMe.map((t:any)=>(
                  <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm">
                    <div>
                      <div className="font-medium text-gray-800 truncate">{t.title}</div>
                      <div className="muted-2">Status: {t.status}</div>
                    </div>
                    <div className="pill">{t.status}</div>
                  </div>
                )) : <p className="muted-2">No tasks assigned to you</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="text-gray-600 text-sm font-medium">Total Tasks</div>
            <div className="text-4xl font-bold text-blue-600 mt-2">{data.total}</div>
          </div>
          <div className="card">
            <div className="text-gray-600 text-sm font-medium">TODO</div>
            <div className="text-4xl font-bold text-yellow-600 mt-2">{data.byStatus.TODO}</div>
          </div>
          <div className="card">
            <div className="text-gray-600 text-sm font-medium">In Progress</div>
            <div className="text-4xl font-bold text-blue-600 mt-2">{data.byStatus.IN_PROGRESS}</div>
          </div>
          <div className="card">
            <div className="text-gray-600 text-sm font-medium">Done</div>
            <div className="text-4xl font-bold text-green-600 mt-2">{data.byStatus.DONE}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Overdue Tasks</h3>
            {data.overdue.length > 0 ? (
              <ul className="space-y-2 max-h-96 overflow-y-auto">
                {data.overdue.map((t: any) => (
                  <li key={t.id} className="card border-l-4 border-red-500">
                    <div className="font-medium text-gray-800 truncate">{t.title}</div>
                    <div className="text-sm text-gray-600">Due: {new Date(t.dueDate).toLocaleDateString()}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No overdue tasks</p>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Assigned to Me</h3>
            {data.assignedToMe.length > 0 ? (
              <ul className="space-y-2 max-h-96 overflow-y-auto">
                {data.assignedToMe.map((t: any) => (
                  <li key={t.id} className="card border-l-4 border-blue-500">
                    <div className="font-medium text-gray-800 truncate">{t.title}</div>
                    <div className="text-sm text-gray-600">Status: {t.status}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No tasks assigned to you</p>
            )}
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
