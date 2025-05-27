"use client"

import { useState, useEffect } from "react"
import { generateRecurringEvents } from "@/utils/event-utils"

export function useEvents() {
  const [events, setEvents] = useState([])

  // Load events from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem("calendar-events")
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents)
      setEvents(parsedEvents)
    }
  }, [])

  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem("calendar-events", JSON.stringify(events))
  }, [events])

  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: crypto.randomUUID(),
    }

    // Generate recurring events if needed
    const eventsToAdd = eventData.recurrence !== "none" ? generateRecurringEvents(newEvent) : [newEvent]

    setEvents((prev) => [...prev, ...eventsToAdd])
  }

  const updateEvent = (id, eventData) => {
    setEvents((prev) => prev.map((event) => (event.id === id ? { ...eventData, id } : event)))
  }

  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((event) => event.id !== id))
  }

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
  }
}
