"use client"
import React, { useState } from 'react'
import { useTodoStore, Todo } from '@/store/useTodoStore'
import { format } from 'date-fns'

export default function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo, inputDraft, setInputDraft } = useTodoStore()
  const [isMounted, setIsMounted] = useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputDraft.trim()) return
    const trimmedTodo = inputDraft.trim().toLowerCase()
    const isDuplicate = todos.some(todo => todo.text.toLowerCase() === trimmedTodo)
    if (isDuplicate) return
    addTodo(inputDraft)
  }

  if (!isMounted) return null

  return (
    <div className="flex flex-col w-full h-screen bg-[#1E1E1E] rounded-3xl border border-white/[0.04] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-6 p-4 pt-2 pb-4 flex-shrink-0">
        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase whitespace-nowrap">
          To Do List
        </h2>

        <form onSubmit={handleAdd} className="flex-1 relative group">
          <input
            type="text"
            placeholder="New Task..."
            className="w-full px-6 py-3 text-sm font-black uppercase tracking-[0.2em] bg-[#2A2A2A] border border-white/[0.04] rounded-2xl focus:outline-none focus:border-white/[0.1] focus:ring-4 focus:ring-white/[0.01] transition-all text-zinc-200 placeholder:text-zinc-600 shadow-inner"
            value={inputDraft}
            onChange={(e) => setInputDraft(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-white text-black rounded-lg font-black text-[9px] uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all active:scale-[0.98]"
          >
            Add
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 space-y-2 px-6 pb-12 custom-scrollbar">
        {todos.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-20">
            <div className="w-12 h-[1px] bg-zinc-600 mb-4" />
            <p className="text-xs text-center text-zinc-600 font-black uppercase tracking-[0.4em]">
              All Tasks Cleared
            </p>
          </div>
        )}
        
        {todos.map((todo) => (
          <div 
            key={todo.id}
            onClick={() => toggleTodo(todo.id)}
            className={`group p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              todo.completed 
                ? 'bg-[#1A1A1A] border-white/[0.02] opacity-40' 
                : 'bg-[#252525] border-white/[0.04] hover:bg-[#2A2A2A] hover:border-white/[0.08] shadow-lg'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                todo.completed 
                  ? 'bg-zinc-700 border-zinc-700' 
                  : 'border-zinc-500 group-hover:border-white'
              }`}>
                {todo.completed && <div className="w-2 h-2 bg-black rounded-full" />}
              </div>
              <span className={`text-sm font-bold tracking-tight ${
                todo.completed ? 'text-zinc-600 line-through' : 'text-zinc-200'
              }`}>
                {todo.text}
              </span>
            </div>
            
            <button 
              onClick={(e) => { e.stopPropagation(); deleteTodo(todo.id); }}
              className="w-6 h-6 flex items-center justify-center rounded-full text-zinc-700 hover:text-red-500 hover:shadow-[0_0_12px_rgba(239,68,68,0.5)] transition-all opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
