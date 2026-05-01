import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Project from './pages/Project'
import Task from './pages/Task'
import { AuthProvider, useAuth } from './context/AuthContext'

function Protected({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="text-xl text-gray-600">Loading...</div></div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <Protected>
              <Project />
            </Protected>
          }
        />
        <Route
          path="/tasks/:id"
          element={
            <Protected>
              <Task />
            </Protected>
          }
        />
      </Routes>
    </AuthProvider>
  )
}
