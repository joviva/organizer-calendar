"use client"
import React, { useState, useEffect } from 'react'
import { useCalendarStore } from '@/store/useCalendarStore'
import { expandRecurringEvents } from '@/utils/recurrence'
import { getWeekDays } from '@/utils/time'
import { startOfDay, endOfDay, isSameDay } from 'date-fns'
import DayColumn from './DayColumn'

export default function Calendar() {
  const { history, searchQuery } = useCalendarStore()
  const [baseDate, setBaseDate] = useState(new Date())
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return <div className="flex flex-col h-full bg-[#2A2A2A] rounded-3xl border border-white/[0.04] animate-pulse" />

  const weekDays = getWeekDays(baseDate)
  
  // Expand events for the current week range
  const expandedEvents = expandRecurringEvents(
    history.present,
    startOfDay(weekDays[0]),
    endOfDay(weekDays[6])
  )

  // Filter by search query
  const filteredEvents = expandedEvents.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full bg-[#2A2A2A] rounded-3xl border border-white/[0.04] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)]">
      <div className="flex flex-1 divide-x divide-white/[0.02]">
        {weekDays.map((day) => (
          <DayColumn 
            key={day.toISOString()} 
            date={day} 
            events={filteredEvents.filter(e => isSameDay(new Date(e.start), day))}
          />
        ))}
      </div>
    </div>
  )
}
