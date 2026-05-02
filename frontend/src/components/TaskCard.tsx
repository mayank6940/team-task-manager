import React from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

interface TaskCardProps {
  task: any
  members: any[]
  onUpdate: () => void
  urgent?: boolean
}

export default function TaskCard({ task, members, onUpdate, urgent }: TaskCardProps) {
  const { token, user } = useAuth() as any

  const updateTask = async (updates: any) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL || ''}/api/tasks/${task.id}`, updates, { headers: { Authorization: `Bearer ${token}` } })
      onUpdate()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteTask = async () => {
    if (!window.confirm('Delete this task?')) return
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || ''}/api/tasks/${task.id}`, { headers: { Authorization: `Bearer ${token}` } })
      onUpdate()
    } catch (err) {
      console.error(err)
    }
  }

  const priorityColor = task.priority === 'HIGH' ? 'text-white bg-black' : 'text-gray-500 bg-gray-50'

  return (
    <div className="card group p-5 bg-white  border border-gray-100  hover:shadow-xl transition-all relative overflow-hidden">
      {urgent && (
        <div className="absolute top-0 left-0 w-full">
          <div className="h-1 bg-black animate-pulse"></div>
          <div className="bg-black text-white text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 text-center">Urgent Deadline</div>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${priorityColor}`}>
          {task.priority}
        </div>
        {user?.role === 'ADMIN' && (
          <button onClick={deleteTask} className="text-gray-300 hover:text-black transition-colors opacity-0 group-hover:opacity-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        )}
      </div>

      <h4 className="font-bold text-gray-900 leading-tight mb-2 group-hover:translate-x-1 transition-transform">{task.title}</h4>
      <p className="text-xs text-gray-500  line-clamp-3 mb-4 leading-relaxed">{task.description}</p>

      <div className="pt-4 border-t border-gray-50  flex items-center justify-between">
        <div className="flex items-center gap-2">
          {user?.role === 'ADMIN' ? (
            <select 
              value={task.assignedToId || ''} 
              onChange={(e) => updateTask({ assignedToId: e.target.value })}
              className="text-[10px] font-black bg-gray-50  border-none rounded-lg focus:ring-0 text-gray-600  py-1 px-2 cursor-pointer hover:bg-gray-100  transition-colors"
            >
              <option value="">Unassigned</option>
              {members.filter((m: any) => m.user?.role !== 'ADMIN').map((m: any) => (
                <option key={m.id} value={m.userId}>{m.user?.name}</option>
              ))}
            </select>
          ) : !task.assignedToId ? (
            <button 
              onClick={() => updateTask({ assignedToId: user.id })}
              className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-all border border-blue-100 shadow-sm"
            >
              Pickup Task
            </button>
          ) : (
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {members.find(m => m.userId === task.assignedToId)?.user?.name || 'Unassigned'}
            </div>
          )}
        </div>

        {task.dueDate && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            {new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </div>
        )}
      </div>

      {/* Mobile-Friendly Status Switcher (only for authorized users) */}
      {(user?.role === 'ADMIN' || task.assignedToId === user?.id) && (
        <div className="mt-4 flex gap-2">
          <select 
            value={task.status} 
            onChange={(e) => updateTask({ status: e.target.value })}
            className="w-full text-[10px] font-black bg-gray-900 text-white border-none rounded-xl py-2 px-3 cursor-pointer hover:bg-black transition-all appearance-none text-center"
          >
            <option value="TODO">Move to TODO</option>
            <option value="IN_PROGRESS">Move to IN PROGRESS</option>
            <option value="DONE">Move to DONE</option>
          </select>
        </div>
      )}

    </div>
  )
}
