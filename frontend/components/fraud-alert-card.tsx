"use client"

import { Card } from "@/components/ui/card"
import { AlertTriangle, AlertCircle, Shield } from "lucide-react"
import type { FraudAlert } from "@/lib/types"

interface FraudAlertCardProps {
  alert: FraudAlert
}

export function FraudAlertCard({ alert }: FraudAlertCardProps) {
  const getIcon = () => {
    if (alert.score > 0.7) return <AlertTriangle className="w-5 h-5 text-red-600" />
    if (alert.score > 0.4) return <AlertCircle className="w-5 h-5 text-yellow-600" />
    return <Shield className="w-5 h-5 text-green-600" />
  }

  const getActionColor = () => {
    if (alert.action === "block") return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
    if (alert.action === "step-up") return "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
    return "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
  }

  return (
    <Card className={`glass p-6 border ${getActionColor()}`}>
      <div className="flex gap-4">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Fraud Detection Alert</h3>
          <p className="text-sm text-muted-foreground mb-3">{alert.reason}</p>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium">Risk Score: </span>
              <span className="font-bold">{(alert.score * 100).toFixed(0)}%</span>
            </div>
            <div className="text-xs font-semibold uppercase tracking-wide">
              {alert.action === "block" ? "🚫 Block" : alert.action === "step-up" ? "⚠️ Step-Up" : "✓ Allow"}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
