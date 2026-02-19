"use client"
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CalendarEvent, Category } from '@/types/calendar'
import { createHistory, pushHistory, undo, redo, HistoryState } from '@/utils/history'
import { v4 as uuid } from 'uuid'

import { createJSONStorage } from 'zustand/middleware'

function reviveEvent(e: any): CalendarEvent {
  return { 
    ...e, 
    start: e.start ? new Date(e.start) : new Date(), 
    end: e.end ? new Date(e.end) : new Date() 
  }
}

function reviveEvents(events: any): CalendarEvent[] {
  if (!Array.isArray(events)) return []
  return events.map(reviveEvent)
}

function reviveHistory(history: any): HistoryState<CalendarEvent[]> {
  if (!history) return createHistory([])
  return {
    past: Array.isArray(history.past) ? history.past.map(reviveEvents) : [],
    present: reviveEvents(history.present),
    future: Array.isArray(history.future) ? history.future.map(reviveEvents) : [],
  }
}

export type EventDraft = {
  title: string
  start: string
  end: string
  completed: boolean
  rrule: string
}

type State = {
  history: HistoryState<CalendarEvent[]>
  categories: Category[]
  selectedEventId: string | null // 'new', 'todo', or UUID
  searchQuery: string
  eventDraft: EventDraft | null
}

type Actions = {
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void
  deleteEvent: (id: string) => void
  toggleComplete: (id: string) => void
  setSelected: (id: string | null) => void
  setSearch: (q: string) => void
  undo: () => void
  redo: () => void
  setEventDraft: (draft: EventDraft | null) => void
}

export const useCalendarStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      history: createHistory([]),
      categories: [],
      selectedEventId: null,
      searchQuery: '',
      eventDraft: null,

      addEvent: (event) => {
        const newEvent = { ...event, id: uuid() }
        const current = get().history.present
        const updated = [...current, newEvent]
        set({ history: pushHistory(get().history, updated) })
      },

      updateEvent: (id, updates) => {
        const current = get().history.present
        const updated = current.map((e) => (e.id === id ? { ...e, ...updates } : e))
        set({ history: pushHistory(get().history, updated) })
      },

      deleteEvent: (id) => {
        const current = get().history.present
        const updated = current.filter((e) => e.id !== id)
        set({ history: pushHistory(get().history, updated) })
      },

      toggleComplete: (id) => {
        const current = get().history.present
        const updated = current.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e))
        set({ history: pushHistory(get().history, updated) })
      },

      setSelected: (id) => set({ selectedEventId: id }),
      setSearch: (q) => set({ searchQuery: q }),

      undo: () => set({ history: undo(get().history) }),
      redo: () => set({ history: redo(get().history) }),
      setEventDraft: (draft) => set({ eventDraft: draft }),
    }),
    {
      name: 'calendar-pro-v2', // Changed name to force fresh state and avoid corruption from old format
      storage: createJSONStorage(() => localStorage, {
        reviver: (key, value) => {
          if (key === 'history') {
             return reviveHistory(value)
          }
          return value
        }
      }),
    }
  )
)
