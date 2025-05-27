"use client"

import { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EventForm } from "./event-form"
import { EventCard } from "./event-card"
import { useEvents } from "@/hooks/use-events"
import { useDragAndDrop } from "@/hooks/use-drag-drop"

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [showEventForm, setShowEventForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const { events, addEvent, updateEvent, deleteEvent } = useEvents()
  const { draggedEvent, handleDragStart, handleDragEnd, handleDrop } = useDragAndDrop()

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get events for a specific day
  const getEventsForDay = (day) => {
    return events.filter((event) => {
      if (
        searchTerm &&
        !event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !event.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }
      return isSameDay(new Date(event.date), day)
    })
  }

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handleDayClick = (day) => {
    setSelectedDate(day)
    setEditingEvent(null)
    setShowEventForm(true)
  }

  const handleEventClick = (event) => {
    setEditingEvent(event)
    setSelectedDate(new Date(event.date))
    setShowEventForm(true)
  }

  const handleEventSubmit = (eventData) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData)
    } else {
      addEvent(eventData)
    }
    setShowEventForm(false)
    setEditingEvent(null)
    setSelectedDate(null)
  }

  const handleEventDelete = (eventId) => {
    deleteEvent(eventId)
    setShowEventForm(false)
    setEditingEvent(null)
    setSelectedDate(null)
  }

  const handleEventDrop = (event, targetDate) => {
    const updatedEvent = {
      ...event,
      date: targetDate.toISOString(),
    }
    updateEvent(event.id, updatedEvent)
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-semibold min-w-[200px] text-center">{format(currentDate, "MMMM yyyy")}</h2>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button onClick={() => handleDayClick(new Date())}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-4 text-center font-semibold text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 border rounded-lg overflow-hidden">
        {calendarDays.map((day, index) => {
          const dayEvents = getEventsForDay(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isCurrentDay = isToday(day)

          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 border-r border-b cursor-pointer transition-colors hover:bg-muted/50 ${
                !isCurrentMonth ? "bg-muted/20 text-muted-foreground" : ""
              } ${isCurrentDay ? "bg-primary/10" : ""}`}
              onClick={() => handleDayClick(day)}
              onDrop={(e) => handleDrop(e, day, handleEventDrop)}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className={`text-sm font-medium mb-2 ${isCurrentDay ? "text-primary font-bold" : ""}`}>
                {format(day, "d")}
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEventClick(event)
                    }}
                    onDragStart={(e) => handleDragStart(e, event)}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedEvent?.id === event.id}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground">+{dayEvents.length - 3} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <EventForm
          isOpen={showEventForm}
          onClose={() => {
            setShowEventForm(false)
            setEditingEvent(null)
            setSelectedDate(null)
          }}
          onSubmit={handleEventSubmit}
          onDelete={editingEvent ? () => handleEventDelete(editingEvent.id) : undefined}
          initialData={editingEvent}
          selectedDate={selectedDate}
        />
      )}
    </div>
  )
}
