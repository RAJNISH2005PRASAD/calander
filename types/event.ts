export type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "custom"

export interface Event {
  id: string
  title: string
  description: string
  date: string // ISO string
  recurrence: RecurrenceType
  color: string
  customRecurrence?: {
    interval: number
    unit: "days" | "weeks" | "months"
  }
}
