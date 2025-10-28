"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, Trash2, AlertCircle } from "lucide-react"

interface AccessRequest {
  id: string
  requesterAddress: string
  requesterName: string
  capsuleName: string
  reason: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  expiresAt: string
}

interface RequestListProps {
  requests: AccessRequest[]
  onApprove?: (id: string) => Promise<void> | void
  onReject?: (id: string) => Promise<void> | void
  onRevoke?: (id: string) => Promise<void> | void
  showActions?: boolean
}

export function RequestList({ requests, onApprove, onReject, onRevoke, showActions = false }: RequestListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [actionType, setActionType] = useState<string | null>(null)

  const handleAction = async (id: string, action: "approve" | "reject" | "revoke") => {
    setLoadingId(id)
    setActionType(action)
    try {
      if (action === "approve" && onApprove) {
        await onApprove(id)
      } else if (action === "reject" && onReject) {
        await onReject(id)
      } else if (action === "revoke" && onRevoke) {
        await onRevoke(id)
      }
    } catch (err) {
      console.error(`[v0] Error during ${action}:`, err)
    } finally {
      setLoadingId(null)
      setActionType(null)
    }
  }

  if (requests.length === 0) {
    return (
      <Card className="glass">
        <CardContent className="pt-12 pb-12 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No requests in this category</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <Card key={request.id} className="glass">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{request.requesterName}</h3>
                  <span className="text-xs text-muted-foreground">{request.requesterAddress}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Requesting access to <span className="font-medium">{request.capsuleName}</span>
                </p>
                <div className="bg-muted p-3 rounded-lg mb-3">
                  <p className="text-sm">
                    <span className="font-medium">Reason:</span> {request.reason}
                  </p>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>Requested {request.createdAt}</span>
                  <span>Expires {request.expiresAt}</span>
                  <span
                    className={`font-medium ${
                      request.status === "pending"
                        ? "text-yellow-600"
                        : request.status === "approved"
                          ? "text-green-600"
                          : "text-red-600"
                    }`}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
              </div>

              {showActions && (
                <div className="flex gap-2">
                  {request.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleAction(request.id, "approve")}
                        disabled={loadingId === request.id}
                        className="gap-1 bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4" />
                        {loadingId === request.id && actionType === "approve" ? "..." : "Approve"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction(request.id, "reject")}
                        disabled={loadingId === request.id}
                        className="gap-1 bg-transparent border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                        {loadingId === request.id && actionType === "reject" ? "..." : "Reject"}
                      </Button>
                    </>
                  )}
                  {request.status === "approved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(request.id, "revoke")}
                      disabled={loadingId === request.id}
                      className="gap-1 bg-transparent"
                    >
                      <Trash2 className="w-4 h-4" />
                      {loadingId === request.id && actionType === "revoke" ? "..." : "Revoke"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
