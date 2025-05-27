"use client"

import { format } from "date-fns"

export function EventCard({ event, onClick, onDragStart, onDragEnd, isDragging }) {
  const eventTime = format(new Date(event.date), "HH:mm")

  return (
    <div
      className={`text-xs p-1 rounded cursor-pointer transition-all hover:scale-105 ${
        event.color
      } text-white ${isDragging ? "opacity-50 scale-95" : ""}`}
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      title={`${event.title} - ${eventTime}`}
    >
      <div className="font-medium truncate">{event.title}</div>
      <div className="opacity-90">{eventTime}</div>
    </div>
  )
}
