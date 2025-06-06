"use client"

import { Calendar } from "@/components/calendar"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Event Calendar</h1>
        <Calendar />
      </div>
    </div>
  )
}
