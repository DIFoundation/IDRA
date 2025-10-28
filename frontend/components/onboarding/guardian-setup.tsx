"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface Guardian {
  address: string
  name: string
}

interface GuardianSetupProps {
  onComplete: (guardians: Guardian[]) => void
}

export function GuardianSetup({ onComplete }: GuardianSetupProps) {
  const [guardians, setGuardians] = useState<Guardian[]>([])
  const [newGuardian, setNewGuardian] = useState({ address: "", name: "" })
  const [isLoading, setIsLoading] = useState(false)

  const addGuardian = () => {
    if (newGuardian.address && newGuardian.name) {
      setGuardians([...guardians, newGuardian])
      setNewGuardian({ address: "", name: "" })
    }
  }

  const removeGuardian = (index: number) => {
    setGuardians(guardians.filter((_, i) => i !== index))
  }

  const handleComplete = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    onComplete(guardians)
    setIsLoading(false)
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Add Recovery Guardians</CardTitle>
        <CardDescription>
          Guardians can help you recover your account if you lose access. You can add up to 5 guardians.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Guardian Address</label>
            <Input
              placeholder="0x..."
              value={newGuardian.address}
              onChange={(e) => setNewGuardian({ ...newGuardian, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Guardian Name</label>
            <Input
              placeholder="e.g., Mom, Best Friend"
              value={newGuardian.name}
              onChange={(e) => setNewGuardian({ ...newGuardian, name: e.target.value })}
            />
          </div>

          <Button
            onClick={addGuardian}
            variant="outline"
            className="w-full gap-2 bg-transparent"
            disabled={!newGuardian.address || !newGuardian.name || guardians.length >= 5}
          >
            <Plus className="w-4 h-4" />
            Add Guardian
          </Button>

          {guardians.length > 0 && (
            <div className="space-y-2 mt-6">
              <h3 className="text-sm font-semibold">Added Guardians ({guardians.length})</h3>
              <div className="space-y-2">
                {guardians.map((guardian, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{guardian.name}</p>
                      <p className="text-xs text-muted-foreground">{guardian.address.slice(0, 10)}...</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeGuardian(index)} className="h-8 w-8">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button onClick={handleComplete} disabled={isLoading} className="w-full mt-6">
            {isLoading ? "Saving..." : "Complete Setup"}
          </Button>

          <Button variant="ghost" className="w-full" onClick={() => onComplete(guardians)}>
            Skip for now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
