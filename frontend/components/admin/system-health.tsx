"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SystemHealth() {
  const metrics = [
    { name: "API Response Time", value: "45ms", status: "healthy", threshold: "< 100ms" },
    { name: "Database Latency", value: "12ms", status: "healthy", threshold: "< 50ms" },
    { name: "Cache Hit Rate", value: "94.2%", status: "healthy", threshold: "> 90%" },
    { name: "Error Rate", value: "0.02%", status: "healthy", threshold: "< 0.1%" },
    { name: "CPU Usage", value: "34%", status: "healthy", threshold: "< 80%" },
    { name: "Memory Usage", value: "62%", status: "healthy", threshold: "< 85%" },
  ]

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>System Health</CardTitle>
        <CardDescription>Real-time system performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <div key={metric.name} className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm">{metric.name}</p>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded text-xs font-medium">
                  {metric.status}
                </span>
              </div>
              <p className="text-2xl font-bold mb-1">{metric.value}</p>
              <p className="text-xs text-muted-foreground">Threshold: {metric.threshold}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
