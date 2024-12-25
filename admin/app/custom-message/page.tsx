'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function CustomMessagePage() {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle custom message logic here
    console.log('Custom message:', message)
  }

  return (
    <div className="max-w-md mx-auto w-full px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Custom Message</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Enter your custom message here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="w-full"
        />
        <Button type="submit" className="w-full">Send Message</Button>
      </form>
    </div>
  )
}

