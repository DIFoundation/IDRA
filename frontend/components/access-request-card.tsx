"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"
import type { AccessRequest } from "@/lib/types"
import { api } from "@/lib/api"

interface AccessRequestCardProps {
  request: AccessRequest
  onApprove?: () => void
  onReject?: () => void
}

export function AccessRequestCard({ request, onApprove, onReject }: AccessRequestCardProps) {
  const [approving, setApproving] = useState(false)
  const [rejecting, setRejecting] = useState(false)

  const handleApprove = async () => {
    setApproving(true)
    try {
      await api.approveAccessRequest(request.id)
      onApprove?.()
    } finally {
      setApproving(false)
    }
  }

  const handleReject = async () => {
    setRejecting(true)
    try {
      // Mock reject
      onReject?.()
    } finally {
      setRejecting(false)
    }
  }

  const fraudScore = request.fraudScore || 0
  const fraudLevel = fraudScore < 0.3 ? "low" : fraudScore < 0.7 ? "medium" : "high"
  const fraudColor =
    fraudLevel === "low" ? "text-green-600" : fraudLevel === "medium" ? "text-yellow-600" : "text-red-600"

  return (
    <Card className="glass p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">Requester</p>
            <p className="font-mono text-sm">
              {request.requester.slice(0, 10)}...{request.requester.slice(-8)}
            </p>
          </div>
          <div className={`text-xs font-semibold px-2 py-1 rounded-full ${fraudColor} bg-opacity-10`}>
            Risk: {(fraudScore * 100).toFixed(0)}%
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Scope</p>
            <p className="text-sm font-medium">{request.scope.join(", ")}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="text-sm font-medium">{request.duration / 3600}h</p>
          </div>
        </div>

        {request.status === "pending" && (
          <div className="flex gap-2">
            <Button onClick={handleApprove} disabled={approving} className="flex-1 gap-2">
              <CheckCircle className="w-4 h-4" />
              {approving ? "Approving..." : "Approve"}
            </Button>
            <Button
              onClick={handleReject}
              disabled={rejecting}
              variant="outline"
              className="flex-1 gap-2 bg-transparent"
            >
              <XCircle className="w-4 h-4" />
              {rejecting ? "Rejecting..." : "Reject"}
            </Button>
          </div>
        )}

        {request.status === "granted" && (
          <div className="p-3 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-200 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Access granted
          </div>
        )}
      </div>
    </Card>
  )
}
