"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { validateEventConflict } from "@/utils/event-utils"
import { useEvents } from "@/hooks/use-events"

const eventColors = [
  { name: "Blue", value: "bg-blue-500" },
  { name: "Green", value: "bg-green-500" },
  { name: "Red", value: "bg-red-500" },
  { name: "Purple", value: "bg-purple-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Pink", value: "bg-pink-500" },
]

export function EventForm({ isOpen, onClose, onSubmit, onDelete, initialData, selectedDate }) {
  const { events } = useEvents()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    recurrence: "none",
    color: "bg-blue-500",
    customRecurrence: {
      interval: 1,
      unit: "weeks",
    },
  })
  const [conflictWarning, setConflictWarning] = useState("")

  useEffect(() => {
    if (initialData) {
      const eventDate = new Date(initialData.date)
      setFormData({
        title: initialData.title,
        description: initialData.description,
        date: format(eventDate, "yyyy-MM-dd"),
        time: format(eventDate, "HH:mm"),
        recurrence: initialData.recurrence,
        color: initialData.color,
        customRecurrence: initialData.customRecurrence || {
          interval: 1,
          unit: "weeks",
        },
      })
    } else if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: "09:00",
      }))
    }
  }, [initialData, selectedDate])

  useEffect(() => {
    if (formData.date && formData.time && formData.title) {
      const eventDateTime = new Date(`${formData.date}T${formData.time}`)
      const conflict = validateEventConflict(
        eventDateTime,
        events.filter((e) => (initialData ? e.id !== initialData.id : true)),
      )
      setConflictWarning(conflict)
    } else {
      setConflictWarning("")
    }
  }, [formData.date, formData.time, formData.title, events, initialData])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title || !formData.date || !formData.time) {
      return
    }

    const eventDateTime = new Date(`${formData.date}T${formData.time}`)

    const eventData = {
      title: formData.title,
      description: formData.description,
      date: eventDateTime.toISOString(),
      recurrence: formData.recurrence,
      color: formData.color,
      customRecurrence: formData.recurrence === "custom" ? formData.customRecurrence : undefined,
    }

    onSubmit(eventData)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCustomRecurrenceChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      customRecurrence: {
        ...prev.customRecurrence,
        [field]: value,
      },
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Event" : "Add New Event"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter event description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="time">Time *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="recurrence">Recurrence</Label>
            <Select value={formData.recurrence} onValueChange={(value) => handleInputChange("recurrence", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select recurrence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Recurrence</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.recurrence === "custom" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="interval">Every</Label>
                <Input
                  id="interval"
                  type="number"
                  min="1"
                  value={formData.customRecurrence.interval}
                  onChange={(e) => handleCustomRecurrenceChange("interval", Number.parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={formData.customRecurrence.unit}
                  onValueChange={(value) => handleCustomRecurrenceChange("unit", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div>
            <Label>Event Color</Label>
            <div className="flex gap-2 mt-2">
              {eventColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`w-8 h-8 rounded-full ${color.value} ${
                    formData.color === color.value ? "ring-2 ring-offset-2 ring-primary" : ""
                  }`}
                  onClick={() => handleInputChange("color", color.value)}
                />
              ))}
            </div>
          </div>

          {conflictWarning && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">{conflictWarning}</p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <div>
              {onDelete && (
                <Button type="button" variant="destructive" onClick={onDelete}>
                  Delete Event
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{initialData ? "Update Event" : "Create Event"}</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
