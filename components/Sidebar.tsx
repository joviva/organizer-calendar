"use client"
import React, { useState, useEffect } from 'react'
import SearchBar from './SearchBar'
import { useCalendarStore } from '@/store/useCalendarStore'

export default function Sidebar({ onAction }: { onAction?: () => void }) {
  const { selectedEventId, setSelected } = useCalendarStore()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const isHistory = selectedEventId === 'history'
  const isTodo = selectedEventId === 'todo'

  const handleAction = (id: string | null) => {
    setSelected(id)
    if (onAction) onAction()
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-zinc-200 tracking-tighter leading-none italic">
          Planner-Organizer
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <div className="h-[1px] w-6 bg-white/10" />
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em]">
            Vilo Softwares
          </p>
        </div>
      </div>

      {/* Nav Buttons */}
      <div className="flex flex-col gap-3">
        {/* Toggle: Events (back to calendar) OR + New Event */}
        {isTodo || isHistory ? (
          <button
            onClick={() => handleAction(null)}
            className="w-full py-4 px-4 bg-[#2A2A2A] text-zinc-200 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#333333] border border-white/[0.05] transition-all active:scale-[0.98] shadow-xl"
          >
            Events
          </button>
        ) : (
          <button
            onClick={() => handleAction('new')}
            className="w-full py-4 px-4 bg-[#2A2A2A] text-zinc-200 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#333333] border border-white/[0.05] transition-all active:scale-[0.98] shadow-xl"
          >
            + New Event
          </button>
        )}

        {/* To Do List */}
        <button
          onClick={() => handleAction('todo')}
          className={`w-full py-4 px-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border transition-all active:scale-[0.98] shadow-xl ${
            isTodo
              ? 'bg-white text-black border-white/20'
              : 'bg-[#2A2A2A] text-zinc-200 border-white/[0.05] hover:bg-[#333333]'
          }`}
        >
          ☑ To Do List
        </button>

        {/* History */}
        <button
          onClick={() => handleAction('history')}
          className={`w-full py-4 px-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border transition-all active:scale-[0.98] shadow-xl ${
            isHistory
              ? 'bg-white text-black border-white/20'
              : 'bg-[#2A2A2A] text-zinc-200 border-white/[0.05] hover:bg-[#333333]'
          }`}
        >
          🕓 History
        </button>
      </div>

      {/* Search */}
      <div className="space-y-4 mt-auto lg:mt-4">
        <label className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.4em] block translate-x-1">
          Search Planner
        </label>
        <SearchBar />
      </div>
    </div>
  )
}
