"use client"
import React from 'react'
import { CalendarEvent } from '@/types/calendar'
import { useCalendarStore } from '@/store/useCalendarStore'
import { format } from 'date-fns'

interface Props {
  event: CalendarEvent
  now: Date  // passed from DayColumn's single shared timer
}

export default function EventCard({ event, now }: Props) {
  const { setSelected, setEventDraft } = useCalendarStore()

  const nowMs   = now.getTime()
  const startMs = new Date(event.start).getTime()
  const endMs   = new Date(event.end).getTime()

  // Actively happening right now
  const isActive = !event.completed && nowMs >= startMs && nowMs < endMs

  // About to start within the next 5 minutes
  const isStartingSoon = !event.completed && !isActive
    && (startMs - nowMs) > 0
    && (startMs - nowMs) <= 5 * 60 * 1000

  const handleClick = () => {
    const baseId = event.id.length > 36 ? event.id.slice(0, 36) : event.id
    setEventDraft(null)
    setSelected(baseId)
  }

  const cardClass = (() => {
    if (event.completed)
      return 'bg-[#1A1A1A] border-white/[0.02] opacity-20 shadow-none'
    if (isActive)
      return 'bg-[#1e3a2f] border-emerald-500/40 shadow-[0_0_20px_rgba(52,211,153,0.15)] ring-1 ring-emerald-500/30'
    if (isStartingSoon)
      return 'bg-[#333333] border-yellow-500/40 animate-blink ring-1 ring-yellow-500/30'
    return 'bg-[#333333] border-white/[0.06] hover:border-white/[0.1] hover:bg-[#3D3D3D] shadow-md'
  })()

  return (
    <div
      onClick={handleClick}
      className={`p-2.5 rounded-xl cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden border ${cardClass}`}
    >
      {/* Left accent bar */}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
      )}
      {isStartingSoon && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
      )}
      {!isActive && !isStartingSoon && !event.completed && (
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}

      <div className="flex items-center justify-between gap-2">
        {/* Title */}
        <div className={`text-xs font-black truncate tracking-tight leading-tight ${
          event.completed  ? 'line-through text-zinc-700'
          : isActive       ? 'text-emerald-100'
          : isStartingSoon ? 'text-yellow-100'
          : 'text-zinc-100'
        }`}>
          {event.title}
        </div>

        {/* Time range */}
        <div className="flex-shrink-0">
          <div className={`text-[10px] font-bold tracking-wide whitespace-nowrap ${
            isActive         ? 'text-emerald-400'
            : isStartingSoon ? 'text-yellow-400'
            : 'text-zinc-500'
          }`}>
            {format(new Date(event.start), 'h:mm a')} – {format(new Date(event.end), 'h:mm a')}
          </div>
        </div>
      </div>
    </div>
  )
}
