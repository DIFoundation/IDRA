"use client"

import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FraudAlertCard } from "@/components/fraud-alert-card"
import { Users, Lock, AlertTriangle } from "lucide-react"

export default function SecurityPage() {
  const mockGuardians = [
    { address: "0x123...", name: "Alice", status: "active" },
    { address: "0x456...", name: "Bob", status: "active" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Security & Recovery</h1>
          <p className="text-muted-foreground">Manage guardians and security settings</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Guardians */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Guardians (2/5)
              </h2>
              <div className="space-y-3">
                {mockGuardians.map((guardian) => (
                  <Card key={guardian.address} className="glass p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{guardian.name}</p>
                        <p className="text-sm text-muted-foreground font-mono">{guardian.address}</p>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-full">
                        {guardian.status}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
              <Button className="w-full mt-4">Add Guardian</Button>
            </div>

            {/* Recovery */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Recovery Settings
              </h2>
              <Card className="glass p-6">
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold mb-2">Recovery Threshold</p>
                    <p className="text-sm text-muted-foreground mb-4">Require 3 of 5 guardians to approve recovery</p>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        max="5"
                        defaultValue="3"
                        className="w-20 px-3 py-2 border border-border rounded-lg"
                      />
                      <span className="text-muted-foreground">of 5</span>
                    </div>
                  </div>
                  <Button className="w-full">Update Threshold</Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Alerts */}
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Recent Alerts
            </h2>
            <div className="space-y-4">
              <FraudAlertCard
                alert={{
                  id: "1",
                  score: 0.25,
                  reason: "Unusual access pattern detected",
                  action: "allow",
                }}
              />
              <FraudAlertCard
                alert={{
                  id: "2",
                  score: 0.65,
                  reason: "Multiple failed authentication attempts",
                  action: "step-up",
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
