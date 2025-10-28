"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProfileSetupProps {
  onComplete: (data: { name: string; email: string; bio: string }) => void
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    onComplete(formData)
    setIsLoading(false)
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Create Your Profile</CardTitle>
        <CardDescription>Tell us about yourself to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <Input
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Bio (Optional)</label>
            <Textarea
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="mt-1"
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !formData.name || !formData.email}>
            {isLoading ? "Saving..." : "Continue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
