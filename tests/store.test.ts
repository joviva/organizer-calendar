import { describe, it, expect } from 'vitest'
import { useCalendarStore } from '@/store/useCalendarStore'

// Mock the getWeekDays utility if needed
// This is just a sanity check for the store logic

describe('CalendarStore', () => {
  it('should add an event', () => {
    const store = useCalendarStore.getState()
    const initialCount = store.history.present.length
    
    store.addEvent({
      title: 'Test Event',
      start: new Date(),
      end: new Date(Date.now() + 3600000),
      completed: false,
      categoryId: 'default'
    })
    
    const updatedStore = useCalendarStore.getState()
    expect(updatedStore.history.present.length).toBe(initialCount + 1)
    expect(updatedStore.history.present[initialCount].title).toBe('Test Event')
  })
})
