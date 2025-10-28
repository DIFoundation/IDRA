"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface CreateCapsuleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (data: { name: string; description: string }) => void
}

export function CreateCapsuleDialog({ open, onOpenChange, onCreate }: CreateCapsuleDialogProps) {
  const [formData, setFormData] = useState({ name: "", description: "" })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!formData.name.trim()) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    onCreate(formData)
    setFormData({ name: "", description: "" })
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass">
        <DialogHeader>
          <DialogTitle>Create New Capsule</DialogTitle>
          <DialogDescription>Create a new encrypted capsule to store your sensitive data</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Capsule Name</label>
            <Input
              placeholder="e.g., Personal Documents"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description (Optional)</label>
            <Textarea
              placeholder="Describe what this capsule will contain..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !formData.name.trim()}>
            {isLoading ? "Creating..." : "Create Capsule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
