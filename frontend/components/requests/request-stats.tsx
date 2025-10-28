"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock, CheckCircle, XCircle } from "lucide-react"

interface RequestStatsProps {
  pending: number
  approved: number
  rejected: number
}

export function RequestStats({ pending, approved, rejected }: RequestStatsProps) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{pending}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold">{approved}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <XCircle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-xs text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold">{rejected}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
