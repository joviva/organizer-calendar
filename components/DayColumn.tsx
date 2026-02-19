"use client"
import React from 'react'
import { format, isToday } from 'date-fns'
import { CalendarEvent } from '@/types/calendar'
import EventCard from './EventCard'

interface DayColumnProps {
  date: Date
  events: CalendarEvent[]
}

export default function DayColumn({ date, events }: DayColumnProps) {
  const isCurrentDay = isToday(date)
  const [now, setNow] = React.useState(new Date())

  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex-1 min-w-[220px] lg:min-w-[160px] last:border-r-0 flex flex-col h-full overflow-hidden">
      <div className={`p-4 lg:p-6 text-center border-b border-white/[0.02] flex-shrink-0 ${isCurrentDay ? 'bg-white/[0.03]' : 'bg-transparent'}`}>
        <div className={`text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em] ${isCurrentDay ? 'text-white' : 'text-zinc-600'}`}>
          <span className="lg:inline hidden">{format(date, 'EEEE')}</span>
          <span className="lg:hidden inline">{format(date, 'EEE')}</span>
        </div>
        <div className={`text-2xl lg:text-3xl font-black mt-2 leading-none ${isCurrentDay ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'text-zinc-400'}`}>
          {format(date, 'd')}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {events.map((event) => (
          <EventCard key={event.id} event={event} now={now} />
        ))}
        {events.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
            <div className="w-8 h-[1px] bg-zinc-600 mb-3" />
            <div className="text-[10px] text-center text-zinc-600 font-black uppercase tracking-[0.5em]">
              Clear
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
