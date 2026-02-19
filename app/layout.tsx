"use client"
import './globals.css'
import React, { useEffect } from 'react'
import { useCalendarStore } from '@/store/useCalendarStore'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { undo, redo } = useCalendarStore()

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const metaOrCtrl = e.metaKey || e.ctrlKey
      if (metaOrCtrl && key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      if (metaOrCtrl && (e.shiftKey && key === 'z' || key === 'y')) {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [undo, redo])

  return (
    <html lang="en" className="dark">
      <body className="bg-[#020617] text-slate-50 selection:bg-blue-500/30">
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
