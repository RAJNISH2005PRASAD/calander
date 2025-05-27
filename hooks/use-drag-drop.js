"use client"

import { useState } from "react"

export function useDragAndDrop() {
  const [draggedEvent, setDraggedEvent] = useState(null)

  const handleDragStart = (e, event) => {
    setDraggedEvent(event)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    setDraggedEvent(null)
  }

  const handleDrop = (e, targetDate, onEventDrop) => {
    e.preventDefault()
    if (draggedEvent) {
      onEventDrop(draggedEvent, targetDate)
      setDraggedEvent(null)
    }
  }

  return {
    draggedEvent,
    handleDragStart,
    handleDragEnd,
    handleDrop,
  }
}
