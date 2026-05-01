import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import TaskCard from '../components/TaskCard'
import ConfirmModal from '../components/ConfirmModal'

export default function Project() {
  const { id } = useParams()
  const { token, user } = useAuth() as any
  const [project, setProject] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'MEDIUM', assignedTo: '' })
  const [allUsers, setAllUsers] = useState<any[]>([])
  
  const loadProject = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/projects/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      setProject(res.data.project)
      setMembers(res.data.members)
      setTasks(res.data.tasks)
    } catch (err) {
      console.error(err)
    }
  }

  const loadAllUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/auth/users`, { headers: { Authorization: `Bearer ${token}` } })
      setAllUsers(res.data.filter((u: any) => u.role !== 'ADMIN'))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { 
    loadProject()
    loadAllUsers()
  }, [id])

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title || !newTask.dueDate || !newTask.assignedTo) {
      return alert('Please select a member and a due date for this task.')
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/projects/${id}/tasks`, newTask, { headers: { Authorization: `Bearer ${token}` } })
      setNewTask({ title: '', description: '', dueDate: '', priority: 'MEDIUM', assignedTo: '' })
      setShowCreate(false)
      loadProject()
    } catch (err) {
      console.error(err)
    }
  }

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL || ''}/api/tasks/${taskId}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } })
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
    } catch (err) {
      console.error(err)
    }
  }


  // Drag and Drop Handlers
  const onDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId)
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const onDrop = (e: React.DragEvent, newStatus: string) => {
    const taskId = e.dataTransfer.getData('taskId')
    updateTaskStatus(taskId, newStatus)
  }

  const getColumnTasks = (status: string) => tasks.filter(t => t.status === status)

  const isUrgent = (date: string) => {
    if (!date) return false
    const due = new Date(date).getTime()
    const now = new Date().getTime()
    const diff = due - now
    return diff > 0 && diff < 24 * 60 * 60 * 1000 // due in next 24 hours
  }

  if (!project) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse font-bold text-gray-400">Loading Project...</div></div>

  return (
    <div className="min-h-screen bg-gray-50 transition-colors pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
              Back to Dashboard
            </Link>
            <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-none">{project.name}</h1>
            <p className="text-base sm:text-xl text-gray-500 mt-4 max-w-2xl leading-relaxed font-medium">{project.description}</p>
          </div>

          <div className="flex flex-row items-center gap-3">
            <div className="pill bg-white border border-gray-100 px-4 py-2 whitespace-nowrap">
              <span className="text-gray-400 mr-2 uppercase tracking-widest font-black text-[10px]">Team Size</span>
              <span className="font-black text-gray-900">{members.length}</span>
            </div>
            {user?.role === 'ADMIN' && (
              <button onClick={() => setShowCreate(true)} className="primary-btn whitespace-nowrap">
                Add Task
              </button>
            )}
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {['TODO', 'IN_PROGRESS', 'DONE'].map((status) => (
            <div 
              key={status} 
              className="space-y-6"
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, status)}
            >
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">
                  {status.replace('_', ' ')}
                </h3>
                <span className="text-[10px] font-black bg-white border border-gray-100 text-gray-400 px-2.5 py-1 rounded-full shadow-sm">
                  {getColumnTasks(status).length}
                </span>
              </div>

              <div className="kanban-column min-h-[500px]">
                <div className="space-y-4">
                  {getColumnTasks(status).map((task) => (
                    <div 
                      key={task.id} 
                      draggable 
                      onDragStart={(e) => onDragStart(e, task.id)}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <TaskCard 
                        task={task} 
                        members={members} 
                        onUpdate={loadProject} 
                        urgent={isUrgent(task.dueDate)}
                      />
                    </div>
                  ))}
                  {getColumnTasks(status).length === 0 && (
                    <div className="py-10 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                      <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Empty</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Roster Section */}
        <div className="pt-16 border-t border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Project Collaborators</h3>
              <p className="text-sm text-gray-400 mt-1">Users currently participating in this project</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {members.map(m => (
              <div key={m.id} className="card group bg-white border border-gray-100 p-4 flex items-center justify-between transition-all">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="avatar h-10 w-10 text-xs shadow-sm ring-2 ring-gray-50">{m.user?.name.split(' ').map((s:any)=>s[0]).join('')}</div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-gray-900 truncate">{m.user?.name}</div>
                    <div className="text-[10px] font-bold text-black uppercase tracking-widest">{m.user?.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Task Creation Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreate(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl animate-slide-up border border-white/10">
            <h2 className="text-2xl font-black text-gray-900 mb-6">New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="label mb-1 block">Title</label>
                <input required className="input" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="What needs to be done?" />
              </div>
              <div>
                <label className="label mb-1 block">Description</label>
                <textarea className="input min-h-[100px]" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} placeholder="Details..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label mb-1 block">Due Date</label>
                  <input required type="date" className="input" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
                </div>
                <div>
                  <label className="label mb-1 block">Priority</label>
                  <select className="input" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label mb-1 block">Assign To</label>
                <select required className="input" value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}>
                  <option value="">Select Member...</option>
                  {allUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="submit" className="primary-btn flex-1 justify-center">Create Task</button>
                <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
