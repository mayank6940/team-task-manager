import React from 'react'

export default function ConfirmModal({ open, title, message, onConfirm, onCancel }: any) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel}></div>
      <div className="bg-[#fbf6f1] rounded-lg shadow-lg z-50 w-full max-w-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="small-btn">Cancel</button>
          <button onClick={onConfirm} className="danger-btn">Delete</button>
        </div>
      </div>
    </div>
  )
}
