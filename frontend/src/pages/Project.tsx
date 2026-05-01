import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import TaskCard from '../components/TaskCard'
import ConfirmModal from '../components/ConfirmModal'

type Task = any

export default function Project() {
  const { id } = useParams()
  const { user } = useAuth() as any
  const [project, setProject] = useState<any>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [emailToAdd, setEmailToAdd] = useState('')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')

  useEffect(() => {
    if (!id) return
    const load = async () => {
      const res = await api.get(`/api/projects/${id}`)
      setProject(res.data.project)
      setMembers(res.data.members || [])
      setTasks(res.data.tasks || [])
    }
    load().catch(console.error)
  }, [id])

  const addMember = async () => {
    try {
      await api.post(`/api/projects/${id}/members`, { email: emailToAdd })
      setEmailToAdd('')
      const res = await api.get(`/api/projects/${id}`)
      setMembers(res.data.members || [])
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed')
    }
  }

  const createTask = async () => {
    try {
      await api.post(`/api/projects/${id}/tasks`, { title: newTaskTitle, dueDate: newTaskDueDate || null })
      setNewTaskTitle('')
      setNewTaskDueDate('')
      const res = await api.get(`/api/projects/${id}`)
      setTasks(res.data.tasks || [])
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed')
    }
  }

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      await api.patch(`/api/tasks/${taskId}`, { status })
      setTasks((t) => t.map((x: Task) => (x.id === taskId ? { ...x, status } : x)))
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed')
    }
  }

  const assignTask = async (taskId: string, userId: string | null) => {
    try {
      await api.patch(`/api/tasks/${taskId}`, { assignedToId: userId })
      setTasks((t) => t.map((x: Task) => (x.id === taskId ? { ...x, assignedToId: userId } : x)))
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed')
    }
  }

  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)

  const deleteTask = async (taskId: string) => {
    try {
      await api.delete(`/api/tasks/${taskId}`)
      setTasks((t) => t.filter(x => x.id !== taskId))
    } catch (e: any) {
      alert(e.response?.data?.message || 'Failed')
    }
  }

  const onRequestDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId)
  }

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return
    await deleteTask(taskToDelete)
    setTaskToDelete(null)
  }

  const byStatus = (s: string) => tasks.filter(t => t.status === s)

  if (!project) return <div className="min-h-screen flex items-center justify-center"><div className="text-xl text-gray-600">Loading...</div></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
        </div>
      </div>

      <div className="w-full px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{project.name}</h2>
        <p className="text-gray-600 mb-8">{project.description}</p>

        {user?.role === 'ADMIN' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="card">
              <h4 className="font-bold text-gray-800 mb-4">Add Member</h4>
              <div className="flex gap-2">
                <input className="input flex-1" value={emailToAdd} onChange={e => setEmailToAdd(e.target.value)} placeholder="member@example.com" />
                <button onClick={addMember} className="btn">Add</button>
              </div>
            </div>

            <div className="card">
              <h4 className="font-bold text-gray-800 mb-4">Create Task</h4>
              <div className="space-y-2">
                <input className="input" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="Task title" />
                <input className="input" type="date" value={newTaskDueDate} onChange={e => setNewTaskDueDate(e.target.value)} />
                <button onClick={createTask} className="btn w-full">Create</button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {['TODO','IN_PROGRESS','DONE'].map((s) => (
            <div key={s} className="bg-gray-100 rounded-lg p-4 min-w-0 max-h-screen overflow-y-auto">
              <h4 className="font-bold text-gray-800 mb-4">{s === 'IN_PROGRESS' ? 'In Progress' : s}</h4>
              <div className="space-y-3">
                {byStatus(s).map((t: Task) => (
                  <TaskCard key={t.id} task={t} members={members} onStatusChange={updateTaskStatus} onAssign={assignTask} onDeleteRequest={onRequestDeleteTask} canAssign={user?.role === 'ADMIN'} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h4 className="font-bold text-gray-800 mb-4">Team Members</h4>
          <ul className="space-y-2">
            {members.map(m => (
              <li key={m.id} className="flex justify-between text-gray-700">
                <span className="font-medium">{m.name}</span>
                <span className="text-gray-500">{m.email}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Confirm modal for task deletion */}
      {taskToDelete && (
        <ConfirmModal open={!!taskToDelete} title="Delete task" message="Are you sure you want to delete this task? This action cannot be undone." onConfirm={confirmDeleteTask} onCancel={() => setTaskToDelete(null)} />
      )}
    </div>
  )
}
