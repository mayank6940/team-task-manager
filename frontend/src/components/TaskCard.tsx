import React from 'react'

export default function TaskCard({ task, onStatusChange, members, onAssign, canAssign, onDeleteRequest }: any) {
  return (
    <div className="bg-[#fbf6f1] rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex items-start gap-3">
        <div className="avatar h-9 w-9 text-sm">{task.assignedToId ? (members.find((m:any)=>m.id===task.assignedToId)?.name||'U').split(' ').map((s:any)=>s[0]).slice(0,2).join('') : 'U'}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="font-semibold text-gray-800 truncate">{task.title}</div>
            <div className="ml-auto flex items-center gap-2">
              {task.dueDate && <div className="pill">Due {new Date(task.dueDate).toLocaleDateString()}</div>}
              <div className={`pill ${task.priority==='HIGH'?'text-red-600':' '+ (task.priority==='MEDIUM'?'text-yellow-600':'text-green-600')}`}>{task.priority}</div>
            </div>
          </div>
          {task.description && <div className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</div>}
          <div className="mt-3 flex gap-2 items-center">
            <select value={task.status} onChange={e => onStatusChange(task.id, e.target.value)} className="ghost-btn text-sm">
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
            {canAssign ? (
              <select value={task.assignedToId || ''} onChange={e => onAssign(task.id, e.target.value || null)} className="ghost-btn text-sm">
                <option value="">Unassigned</option>
                {members.map((m: any) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-sm text-gray-600 truncate">Assigned: {task.assignedToId ? members.find((m: any) => m.id === task.assignedToId)?.name : 'Unassigned'}</div>
            )}
            {canAssign && <button onClick={() => onDeleteRequest && onDeleteRequest(task.id)} aria-label="Delete task" title="Delete task" className="text-red-600 hover:text-red-800 ml-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H3.5A1.5 1.5 0 002 5.5V6h16v-.5A1.5 1.5 0 0018.5 4H15V3a1 1 0 00-1-1H6zm2 6a1 1 0 10-2 0v6a1 1 0 102 0V8zm6 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd" />
              </svg>
            </button>}
          </div>
        </div>
      </div>
    </div>
  )
}
