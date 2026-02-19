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
    <main className="flex flex-1 w-full h-full overflow-hidden bg-[#1E1E1E]">
      <aside className="w-72 border-r border-white/[0.04] bg-[#252525] p-6 z-10 flex-shrink-0">
        <Sidebar />
      </aside>
      <section className={`flex-1 p-8 bg-[#1E1E1E] ${isFullPanel ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        <div className="max-w-6xl mx-auto h-full">
          {renderMain()}
        </div>
      </section>
      {/* Only show modal when editing/creating a real event — not on panel views */}
      {selectedEventId !== 'todo' && selectedEventId !== 'history' && <EventEditModal />}
    </main>
  )
}
