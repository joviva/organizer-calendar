import { describe, it, expect } from 'vitest'
import { expandRecurringEvents } from '../utils/recurrence'

describe('recurrence expansion', () => {
  it('expands weekly RRULE and preserves duration', () => {
    const event = {
      id: 'e1',
      title: 'Gym',
      categoryId: 'c1',
      start: new Date('2024-12-02T08:00:00Z'),
      end: new Date('2024-12-02T09:00:00Z'),
      completed: false,
      rrule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR',
    }

    const rangeStart = new Date('2024-12-01T00:00:00Z')
    const rangeEnd = new Date('2024-12-31T23:59:59Z')

    const expanded = expandRecurringEvents([event], rangeStart, rangeEnd)

    expect(expanded.length).toBeGreaterThan(2)
    expect(expanded.every((e) => e.start instanceof Date && e.end instanceof Date)).toBe(true)

    const duration = event.end.getTime() - event.start.getTime()
    expect(expanded.every((e) => e.end.getTime() - e.start.getTime() === duration)).toBe(true)

    // Expect at least the original weekday occurrence (2024-12-02)
    expect(expanded.some((e) => e.start.toISOString().startsWith('2024-12-02T08:00:00'))).toBe(true)
  })
})
