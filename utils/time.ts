import { startOfWeek, addDays, format, isSameDay } from 'date-fns'

export const getWeekDays = (baseDate: Date) => {
  const start = startOfWeek(baseDate, { weekStartsOn: 1 }) // Monday
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export const formatTime = (date: Date) => {
  return format(date, 'HH:mm')
}

export const formatDate = (date: Date) => {
  return format(date, 'MMM d, yyyy')
}
