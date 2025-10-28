"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"

export function SecurityAudit() {
  const auditLogs = [
    {
      id: "1",
      event: "Unauthorized access attempt",
      severity: "high",
      timestamp: "2024-01-20 14:32",
      details: "Multiple failed login attempts from IP 192.168.1.1",
    },
    {
      id: "2",
      event: "Capsule accessed",
      severity: "low",
      timestamp: "2024-01-20 13:15",
      details: "User 0x1234...5678 accessed capsule #42",
    },
    {
      id: "3",
      event: "Recovery initiated",
      severity: "medium",
      timestamp: "2024-01-20 12:00",
      details: "Account recovery process started for user 0x8765...4321",
    },
  ]

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Security Audit Log</CardTitle>
        <CardDescription>Recent security events and activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {auditLogs.map((log) => (
            <div key={log.id} className="flex gap-4 p-4 bg-muted rounded-lg">
              <div className="flex-shrink-0">
                {log.severity === "high" ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : log.severity === "medium" ? (
                  <Clock className="w-5 h-5 text-yellow-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{log.event}</p>
                <p className="text-xs text-muted-foreground mt-1">{log.details}</p>
                <p className="text-xs text-muted-foreground mt-2">{log.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
