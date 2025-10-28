"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Lock, TrendingUp, AlertCircle } from "lucide-react"

export function AdminStats() {
  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Users className="w-8 h-8 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Lock className="w-8 h-8 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Capsules</p>
              <p className="text-2xl font-bold">5,678</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <TrendingUp className="w-8 h-8 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Storage Used</p>
              <p className="text-2xl font-bold">2.4 TB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <AlertCircle className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-xs text-muted-foreground">Alerts</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
