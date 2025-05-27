import { addDays, addWeeks, addMonths, isSameDay, format } from "date-fns"

export function generateRecurringEvents(baseEvent, maxOccurrences = 52) {
  const events = [baseEvent]
  const startDate = new Date(baseEvent.date)

  for (let i = 1; i < maxOccurrences; i++) {
    let nextDate

    switch (baseEvent.recurrence) {
      case "daily":
        nextDate = addDays(startDate, i)
        break
      case "weekly":
        nextDate = addWeeks(startDate, i)
        break
      case "monthly":
        nextDate = addMonths(startDate, i)
        break
      case "custom":
        if (baseEvent.customRecurrence) {
          const { interval, unit } = baseEvent.customRecurrence
          switch (unit) {
            case "days":
              nextDate = addDays(startDate, i * interval)
              break
            case "weeks":
              nextDate = addWeeks(startDate, i * interval)
              break
            case "months":
              nextDate = addMonths(startDate, i * interval)
              break
            default:
              continue
          }
        } else {
          continue
        }
        break
      default:
        continue
    }

    // Stop generating events after 1 year
    if (nextDate.getFullYear() > startDate.getFullYear() + 1) {
      break
    }

    events.push({
      ...baseEvent,
      id: crypto.randomUUID(),
      date: nextDate.toISOString(),
    })
  }

  return events
}

export function validateEventConflict(eventDate, existingEvents) {
  const conflictingEvents = existingEvents.filter((event) => {
    const existingDate = new Date(event.date)
    return isSameDay(eventDate, existingDate) && Math.abs(eventDate.getTime() - existingDate.getTime()) < 60 * 60 * 1000 // Within 1 hour
  })

  if (conflictingEvents.length > 0) {
    const conflictTime = format(new Date(conflictingEvents[0].date), "HH:mm")
    return `Warning: This event conflicts with "${conflictingEvents[0].title}" at ${conflictTime}`
  }

  return ""
}
