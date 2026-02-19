"use client"
import React from 'react'
import { useCalendarStore } from '@/store/useCalendarStore'
import { format } from 'date-fns'
import RecurrenceSelector from './RecurrenceSelector'

export default function EventEditModal() {
  const { selectedEventId, setSelected, history, addEvent, updateEvent, deleteEvent, eventDraft, setEventDraft } = useCalendarStore()
  
  const selectedEvent = history.present.find(e => e.id === selectedEventId)
  
  // Calculate current form data derived from draft or source
  const getFormData = () => {
    if (eventDraft) return eventDraft
    
    if (selectedEvent) {
      return {
        title: selectedEvent.title,
        start: format(new Date(selectedEvent.start), "yyyy-MM-dd'T'HH:mm"),
        end: format(new Date(selectedEvent.end), "yyyy-MM-dd'T'HH:mm"),
        completed: selectedEvent.completed,
        rrule: selectedEvent.rrule || ''
      }
    }
    
    return {
      title: '',
      start: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      end: format(new Date(Date.now() + 3600000), "yyyy-MM-dd'T'HH:mm"),
      completed: false,
      rrule: ''
    }
  }

  const formData = getFormData()

  const updateFormData = (updates: Partial<typeof formData>) => {
    setEventDraft({ ...formData, ...updates })
  }

  const SPECIAL_IDS = ['new', 'todo', 'history']
  const isOpen = selectedEventId === 'new' || (!!selectedEventId && !SPECIAL_IDS.includes(selectedEventId))
  if (!isOpen) return null

  const handleSave = () => {
    try {
      const startDate = new Date(formData.start)
      const endDate = new Date(formData.end)

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error('Invalid dates provided')
        return
      }

      const data = {
        ...formData,
        start: startDate,
        end: endDate,
        categoryId: 'default'
      }

      if (selectedEventId === 'new') {
        addEvent(data)
      } else if (selectedEventId) {
        updateEvent(selectedEventId, data)
      }
      setEventDraft(null)
      setSelected(null)
    } catch (error) {
      console.error('Failed to save event:', error)
    }
  }

  const handleClose = () => {
    setEventDraft(null)
    setSelected(null)
  }

  const handleDelete = () => {
    if (selectedEventId && selectedEventId !== 'new') {
      deleteEvent(selectedEventId)
    }
    setEventDraft(null)
    setSelected(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="w-full max-w-lg p-8 bg-[#222222] border border-white/[0.05] rounded-[2rem] shadow-[0_64px_128px_rgba(0,0,0,0.9)] relative">
        
        <div className="flex justify-between items-center mb-6 relative">
          <div>
            <h2 className="text-xl font-black text-zinc-200 italic tracking-tighter uppercase">
              {selectedEventId === 'new' ? 'New Entry' : 'Edit Entry'}
            </h2>
            <p className="text-[10px] text-zinc-700 font-black uppercase tracking-[0.4em] mt-1">
              Ref ID: {selectedEventId?.toString().slice(0, 8) || 'Void'}
            </p>
          </div>
          <button 
            onClick={handleClose} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.02] border border-white/[0.04] text-zinc-700 hover:text-zinc-200 transition-all hover:bg-white/[0.05]"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-5 relative text-zinc-200">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.6em] ml-2">Title</label>
            <input 
              type="text" 
              placeholder="Event Title..."
              className="w-full bg-black/40 border border-white/[0.03] rounded-2xl px-6 py-3 focus:outline-none focus:border-white/[0.1] transition-all placeholder:text-zinc-400 font-black text-2xl tracking-tight"
              value={formData.title}
              onChange={e => updateFormData({ title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.5em] ml-2">Starts</label>
              <input 
                type="datetime-local" 
                className="w-full bg-black/40 border border-white/[0.03] rounded-2xl px-4 py-3 focus:outline-none focus:border-white/[0.1] transition-all font-black text-sm color-scheme-dark"
                style={{ colorScheme: 'dark' }}
                value={formData.start}
                onChange={e => {
                  const newStart = e.target.value
                  if (newStart > formData.end) {
                    updateFormData({ start: newStart, end: newStart })
                  } else {
                    updateFormData({ start: newStart })
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.5em] ml-2">Ends</label>
              <input 
                type="datetime-local" 
                className="w-full bg-black/40 border border-white/[0.03] rounded-2xl px-4 py-3 focus:outline-none focus:border-white/[0.1] transition-all font-black text-sm"
                style={{ colorScheme: 'dark' }}
                value={formData.end}
                min={formData.start}
                onChange={e => {
                  const newEnd = e.target.value
                  if (newEnd < formData.start) {
                    return // Prevent earlier date
                  }
                  updateFormData({ end: newEnd })
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.5em] ml-2">Repeat</label>
            <RecurrenceSelector
              value={formData.rrule}
              onChange={val => updateFormData({ rrule: val })}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8 relative">
          <button 
            onClick={handleSave}
            className="flex-1 bg-[#2A2A2A] text-zinc-200 py-4 rounded-2xl font-black text-[9px] uppercase tracking-[0.4em] hover:bg-[#333333] border border-white/[0.05] transition-all active:scale-[0.98] shadow-xl"
          >
            Enter Event
          </button>
          {selectedEventId !== 'new' && (
            <button 
              onClick={handleDelete}
              className="px-6 bg-[#1A1A1A] border border-white/[0.04] text-red-900 py-4 rounded-2xl font-black text-[9px] uppercase tracking-[0.4em] hover:bg-red-950/20 hover:text-red-700 transition-all hover:border-red-900/10"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
