import React, { useState } from 'react'
import ConfirmModal from './ConfirmModal'

export default function CreateProjectModal({ open, onClose, onCreate, initial }: any) {
  const [name, setName] = useState(initial?.name || '')
  const [desc, setDesc] = useState(initial?.desc || '')
  const [priority, setPriority] = useState(initial?.priority || 'MEDIUM')

  const submit = async (e?: any) => {
    if (e) e.preventDefault()
    await onCreate({ name, description: desc, priority })
    setName('')
    setDesc('')
    setPriority('MEDIUM')
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl animate-slide-up border border-white/10">
        <h2 className="text-2xl font-black text-gray-900 mb-6">New Project</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label mb-1 block">Project Name</label>
            <input required className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Enter project name..." />
          </div>
          <div>
            <label className="label mb-1 block">Description</label>
            <textarea className="input min-h-[100px]" value={desc} onChange={e => setDesc(e.target.value)} placeholder="What's this project about?" />
          </div>
          <div>
            <label className="label mb-1 block">Priority</label>
            <select className="input" value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="submit" className="primary-btn flex-1 justify-center">Create Project</button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
