"use client"
import React from 'react'
import Calendar from '../components/Calendar'
import Sidebar from '../components/Sidebar'
import EventEditModal from '../components/EventEditModal'
import { useCalendarStore } from '@/store/useCalendarStore'
import TodoList from '@/components/TodoList'
import HistoryPanel from '@/components/HistoryPanel'

export default function Page() {
  const { selectedEventId } = useCalendarStore()
  const [isMounted, setIsMounted] = React.useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const isFullPanel = selectedEventId === 'todo' || selectedEventId === 'history'

  const renderMain = () => {
    if (selectedEventId === 'todo') return <TodoList />
    if (selectedEventId === 'history') return <HistoryPanel />
    return <Calendar />
  }

  return (
    <main className="flex flex-col lg:flex-row w-full h-screen overflow-hidden bg-[#1E1E1E] relative">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-6 left-6 z-20 w-12 h-12 bg-[#252525] border border-white/[0.04] rounded-2xl flex items-center justify-center text-zinc-400 shadow-2xl active:scale-90 transition-all font-black"
      >
        ☰
      </button>

      {/* Sidebar Overlay (Mobile only) */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-[#252525] border-r border-white/[0.04] p-6 flex-shrink-0 transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:flex lg:z-10
      `}>
        {/* Close button for mobile sidebar */}
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden absolute top-6 right-6 text-zinc-500 font-black text-xl"
        >
          ✕
        </button>
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <section className={`flex-1 p-4 lg:p-8 bg-[#1E1E1E] ${isFullPanel ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden'}`}>
        <div className="max-w-6xl mx-auto h-full lg:pt-0 pt-16">
          {renderMain()}
        </div>
      </section>

      {/* Only show modal when editing/creating a real event — not on panel views */}
      {selectedEventId !== 'todo' && selectedEventId !== 'history' && <EventEditModal />}
    </main>
  )
}
