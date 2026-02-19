"use client"
import React from 'react'
import { useCalendarStore } from '@/store/useCalendarStore'

export default function UndoRedoControls() {
  const { undo, redo } = useCalendarStore()

  return (
    <div className="grid grid-cols-2 gap-3">
      <button 
        className="px-4 py-4 text-[11px] font-black uppercase tracking-[0.3em] border border-white/[0.04] rounded-2xl bg-[#2A2A2A] hover:bg-[#333333] hover:border-white/[0.08] transition-all active:scale-95 text-zinc-300" 
        onClick={undo}
      >
        Undo
      </button>
      <button 
        className="px-4 py-4 text-[11px] font-black uppercase tracking-[0.3em] border border-white/[0.04] rounded-2xl bg-[#2A2A2A] hover:bg-[#333333] hover:border-white/[0.08] transition-all active:scale-95 text-zinc-300" 
        onClick={redo}
      >
        Redo
      </button>
    </div>
  )
}
