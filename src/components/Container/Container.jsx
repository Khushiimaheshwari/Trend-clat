import React from 'react'

function Container({ children, className = "" }) {
  return (
    <div className={`w-full max-w-7xl mx-auto px-4 bg-slate-950 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

export default Container