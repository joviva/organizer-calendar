"use client"
import React from 'react'
import { useCalendarStore } from '@/store/useCalendarStore'

export default function SearchBar() {
  const { searchQuery, setSearch } = useCalendarStore()

  return (
    <div className="relative group">
      <input
        type="text"
        placeholder="SEARCH PLANNER"
        className="w-full py-5 px-4 bg-[#2A2A2A] text-zinc-200 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border border-white/[0.05] focus:outline-none focus:border-white/[0.1] focus:ring-4 focus:ring-white/[0.01] transition-all placeholder:text-zinc-500 shadow-xl text-center"
        value={searchQuery}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  )
}
