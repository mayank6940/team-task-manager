import React from 'react'
import { useParams } from 'react-router-dom'

export default function Task() {
  const { id } = useParams()
  return (
    <div className="container">
      <h2>Task {id}</h2>
      <p>Task detail will be implemented here.</p>
    </div>
  )
}
