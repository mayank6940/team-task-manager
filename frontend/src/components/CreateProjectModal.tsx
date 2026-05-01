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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="bg-[#fbf6f1] rounded-lg shadow-lg z-50 w-full max-w-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-[#3b2b26] mb-2">Create Project</h3>
        <form onSubmit={submit} className="space-y-4">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Project name" className="input" required />
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" className="input" rows={3}></textarea>
          <select value={priority} onChange={e=>setPriority(e.target.value)} className="input">
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
          </select>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="ghost-btn">Cancel</button>
            <button type="submit" className="primary-btn">Create</button>
          </div>
        </form>
      </div>
    </div>
  )
}
