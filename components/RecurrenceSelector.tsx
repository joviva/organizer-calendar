"use client"
import React, { useState, useRef, useEffect } from 'react'

export const RECURRENCE_OPTIONS = [
  { label: 'Does not repeat',      value: '',                                  icon: '—'  },
  { label: 'Every day',            value: 'FREQ=DAILY',                        icon: '☀'  },
  { label: 'Monday to Friday',     value: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR', icon: '⚡' },
  { label: 'One day every week',   value: 'FREQ=WEEKLY',                       icon: '🗓'  },
  { label: 'One day every month',  value: 'FREQ=MONTHLY',                      icon: '📆' },
  { label: 'Every year',           value: 'FREQ=YEARLY',                       icon: '🔁' },
]

interface Props {
  value: string
  onChange: (rrule: string) => void
}

export default function RecurrenceSelector({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = RECURRENCE_OPTIONS.find(o => o.value === value) ?? RECURRENCE_OPTIONS[0]

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between gap-3 bg-black/40 border border-white/[0.03] rounded-2xl px-6 py-3 focus:outline-none focus:border-white/[0.1] transition-all text-left hover:border-white/[0.08]"
      >
        <span className="flex items-center gap-3">
          <span className="text-base leading-none">{current.icon}</span>
          <span className="text-sm font-black tracking-tight text-zinc-200">{current.label}</span>
        </span>
        <span className={`text-zinc-600 text-xs transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Popup */}
      {open && (
        <div className="absolute z-50 top-full mt-2 left-0 right-0 bg-[#1A1A1A] border border-white/[0.08] rounded-2xl overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.8)]">
          {RECURRENCE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition-all hover:bg-white/[0.04] ${
                opt.value === value ? 'bg-white/[0.06]' : ''
              }`}
            >
              <span className="text-base leading-none w-5 text-center">{opt.icon}</span>
              <span className={`text-sm font-bold tracking-tight ${
                opt.value === value ? 'text-white' : 'text-zinc-400'
              }`}>
                {opt.label}
              </span>
              {opt.value === value && (
                <span className="ml-auto text-emerald-400 text-xs font-black">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
