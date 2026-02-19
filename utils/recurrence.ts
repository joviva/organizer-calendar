import { RRule } from 'rrule'
import { CalendarEvent } from '@/types/calendar'

export function expandRecurringEvents(
  events: CalendarEvent[],
  rangeStart: Date,
  rangeEnd: Date
): CalendarEvent[] {
  const expanded: CalendarEvent[] = []

  for (const event of events) {
    if (!event.rrule) {
      expanded.push(event)
      continue
    }

    try {
      // RRULE properties MUST be in UPPERCASE (e.g., FREQ=WEEKLY)
      let rruleString = event.rrule.toUpperCase()
      
      // Allow shorthand frequencies
      if (!rruleString.includes('=')) {
        if (['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'].includes(rruleString)) {
           rruleString = `FREQ=${rruleString}`
        }
      }

      // Basic validation: must contain FREQ
      if (!rruleString.includes('FREQ=')) {
        expanded.push(event)
        continue
      }

      const parsed = RRule.parseString(rruleString)
      parsed.dtstart = event.start
      const rule = new RRule(parsed)

      const dates = rule.between(rangeStart, rangeEnd)

      for (const date of dates) {
        const duration = event.end.getTime() - event.start.getTime()
        expanded.push({
          ...event,
          id: `${event.id}-${date.toISOString()}`,
          start: date,
          end: new Date(date.getTime() + duration),
        })
      }
    } catch (error) {
      console.error('Invalid RRULE string:', event.rrule, error)
      // Fallback: just show the original event if parsing fails
      expanded.push(event)
    }
  }

  return expanded
}
