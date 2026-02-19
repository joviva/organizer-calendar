export type Category = {
  id: string
  name: string
  color: string
  visible: boolean
}

export type CalendarEvent = {
  id: string
  title: string
  categoryId: string
  start: Date
  end: Date
  notes?: string
  completed: boolean
  rrule?: string
}
