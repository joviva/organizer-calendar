"use client"
import React, { useState } from 'react'
import { useCalendarStore } from '@/store/useCalendarStore'
import { format } from 'date-fns'

export default function HistoryPanel() {
  const { history, toggleComplete, deleteEvent, setSelected } = useCalendarStore()
  const [isMounted, setIsMounted] = useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  // Sort events by start date (newest first)
  const events = [...history.present].sort(
    (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
  )

  return (
    <div className="flex flex-col w-full h-screen bg-[#1E1E1E] rounded-3xl border border-white/[0.04] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)]">
      {/* Header */}
      <div className="flex items-center gap-6 p-4 pt-3 pb-4 flex-shrink-0 border-b border-white/[0.04]">
        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase whitespace-nowrap">
          Event History
        </h2>
        <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">
          {events.length} event{events.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-[120px_1fr_80px_80px_50px_40px_40px] gap-2 px-5 py-3 text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] border-b border-white/[0.04] flex-shrink-0">
        <span>Date</span>
        <span>Event Name</span>
        <span>Start</span>
        <span>End</span>
        <span className="text-center">Done</span>
        <span className="text-center">Edit</span>
        <span className="text-center">Del</span>
      </div>

      {/* Event List */}
      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-20">
            <div className="w-12 h-[1px] bg-zinc-600 mb-4" />
            <p className="text-xs text-center text-zinc-600 font-black uppercase tracking-[0.4em]">
              No Events
            </p>
          </div>
        )}

        {events.map((event) => (
          <div
            key={event.id}
            className={`grid grid-cols-[120px_1fr_80px_80px_50px_40px_40px] gap-2 items-center px-5 py-3 border-b border-white/[0.02] transition-all hover:bg-white/[0.02] ${
              event.completed ? 'opacity-40' : ''
            }`}
          >
            {/* Date */}
            <span className="text-xs font-bold text-zinc-400 tracking-tight">
              {format(new Date(event.start), 'MMM dd, yyyy')}
            </span>

            {/* Event Name */}
            <span
              className={`text-sm font-bold tracking-tight truncate ${
                event.completed ? 'text-zinc-600 line-through' : 'text-zinc-200'
              }`}
            >
              {event.title}
            </span>

            {/* Start Time */}
            <span className="text-xs font-bold text-zinc-500 tracking-wide">
              {format(new Date(event.start), 'h:mm a')}
            </span>

            {/* End Time */}
            <span className="text-xs font-bold text-zinc-500 tracking-wide">
              {format(new Date(event.end), 'h:mm a')}
            </span>

            {/* Completed Checkbox */}
            <div className="flex justify-center">
              <button
                onClick={() => toggleComplete(event.id)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  event.completed
                    ? 'bg-emerald-600 border-emerald-600'
                    : 'border-zinc-600 hover:border-zinc-400'
                }`}
              >
                {event.completed && (
                  <span className="text-white text-[10px] font-black">✓</span>
                )}
              </button>
            </div>

            {/* Edit Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setSelected(event.id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-200 hover:bg-white/[0.05] transition-all"
                title="Edit Event"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </div>

            {/* Delete Button */}
            <div className="flex justify-center">
              <button
                onClick={() => deleteEvent(event.id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-600 hover:text-red-500 hover:bg-red-500/[0.08] transition-all"
                title="Delete Event"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
