"use client"
import { Button } from "@/components/ui/button"
import { Check, Clock, X } from "lucide-react"

interface Guardian {
  id: string
  guardianName: string
  guardianAddress: string
  status: "pending" | "approved" | "rejected"
  approvedAt?: string
}

interface GuardianApprovalListProps {
  guardians: Guardian[]
  onApprove: (id: string) => void
  requiredApprovals: number
}

export function GuardianApprovalList({ guardians, onApprove, requiredApprovals }: GuardianApprovalListProps) {
  const approvedCount = guardians.filter((g) => g.status === "approved").length

  return (
    <div className="space-y-3">
      {guardians.map((guardian) => (
        <div key={guardian.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-3 flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                guardian.status === "approved"
                  ? "bg-green-100 dark:bg-green-900"
                  : guardian.status === "rejected"
                    ? "bg-red-100 dark:bg-red-900"
                    : "bg-yellow-100 dark:bg-yellow-900"
              }`}
            >
              {guardian.status === "approved" ? (
                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : guardian.status === "rejected" ? (
                <X className="w-5 h-5 text-red-600 dark:text-red-400" />
              ) : (
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              )}
            </div>
            <div>
              <p className="font-medium text-sm">{guardian.guardianName}</p>
              <p className="text-xs text-muted-foreground">{guardian.guardianAddress}</p>
            </div>
          </div>
          <div className="text-right">
            {guardian.status === "approved" && (
              <p className="text-xs text-green-600 dark:text-green-400 font-medium">Approved {guardian.approvedAt}</p>
            )}
            {guardian.status === "pending" && (
              <Button size="sm" variant="outline" onClick={() => onApprove(guardian.id)} className="bg-transparent">
                Approve
              </Button>
            )}
            {guardian.status === "rejected" && (
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">Rejected</p>
            )}
          </div>
        </div>
      ))}
      <div className="mt-4 p-3 bg-primary/10 rounded-lg">
        <p className="text-sm font-medium">
          {approvedCount} of {requiredApprovals} approvals received
        </p>
        <div className="w-full bg-muted rounded-full h-2 mt-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${(approvedCount / requiredApprovals) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
