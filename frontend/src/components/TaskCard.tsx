import React from 'react'

export default function TaskCard({ task, onStatusChange, members, onAssign, canAssign, onDeleteRequest }: any) {
  const assignedUser = task.assignedToId ? members.find((m: any) => m.id === task.assignedToId) : null
  const initials = assignedUser?.name ? assignedUser.name.split(' ').map((s: any) => s[0]).slice(0, 2).join('') : '?'

  return (
    <div className="card group bg-white/60 border border-white/80 p-5 hover:bg-white transition-all shadow-sm hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="avatar h-10 w-10 text-[10px] ring-2 ring-gray-50">{initials}</div>
          {assignedUser && <div className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Owner</div>}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h5 className="font-bold text-gray-900 truncate leading-tight">{task.title}</h5>
            <div className="flex items-center gap-1 shrink-0">
              <div className={`pill text-[8px] font-black uppercase rounded-full px-2 py-1 ${task.priority === 'HIGH' ? 'bg-rose-50 text-rose-600' : task.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {task.priority}
              </div>
            </div>
          </div>

          {task.description && <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">{task.description}</p>}

          <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <select 
                value={task.status} 
                onChange={e => onStatusChange(task.id, e.target.value)} 
                className="text-[10px] font-bold bg-transparent border-none focus:ring-0 text-gray-500 hover:text-gray-900 transition-colors p-0 cursor-pointer uppercase tracking-widest"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Completed</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              {canAssign ? (
                <select 
                  value={task.assignedToId || ''} 
                  onChange={e => onAssign(task.id, e.target.value || null)} 
                  className="text-[10px] font-bold bg-gray-50 border-none rounded-lg focus:ring-0 text-blue-600 hover:text-blue-700 transition-colors py-1 px-2 cursor-pointer"
                >
                  <option value="">Unassigned</option>
                  {members.filter((m: any) => m.role !== 'ADMIN').map((m: any) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              ) : (
                <div className="text-[10px] font-bold text-gray-400">{assignedUser ? assignedUser.name : 'Unassigned'}</div>
              )}

              {canAssign && (
                <button 
                  onClick={() => onDeleteRequest && onDeleteRequest(task.id)} 
                  className="text-gray-300 hover:text-rose-500 transition-colors"
                  title="Delete Task"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              )}
            </div>
          </div>
          
          {task.dueDate && (
            <div className="mt-2 text-[9px] font-bold text-gray-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              Due {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
