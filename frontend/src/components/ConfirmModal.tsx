import React from 'react'

export default function ConfirmModal({ open, title, message, onConfirm, onClose }: any) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-slide-up border border-white/10">
        <h2 className="text-xl font-black text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed font-medium">{message}</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="primary-btn flex-1 justify-center bg-black hover:bg-gray-800">Confirm</button>
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
        </div>
      </div>
    </div>
  )
}
