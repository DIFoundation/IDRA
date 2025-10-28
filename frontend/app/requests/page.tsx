"use client"

import { useState, useEffect } from "react"
import { useSiweAuth } from "@/hooks/use-siwe-auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RequestList } from "@/components/requests/request-list"
import { RequestStats } from "@/components/requests/request-stats"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, TrendingUp } from "lucide-react"

interface AccessRequest {
  id: string
  requesterAddress: string
  requesterName: string
  requesterAvatar?: string
  capsuleName: string
  reason: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  expiresAt: string
  fraudScore?: number
}

export default function RequestsPage() {
  const { isAuthenticated, isConnected } = useSiweAuth()
  const [requests, setRequests] = useState<AccessRequest[]>([
    {
      id: "1",
      requesterAddress: "0x1234...5678",
      requesterName: "Alice Johnson",
      capsuleName: "Personal Documents",
      reason: "Need to verify identity for loan application",
      status: "pending",
      createdAt: "2024-01-20",
      expiresAt: "2024-02-20",
      fraudScore: 0.15,
    },
    {
      id: "2",
      requesterAddress: "0x8765...4321",
      requesterName: "Bob Smith",
      capsuleName: "Financial Records",
      reason: "Audit purposes - quarterly review",
      status: "approved",
      createdAt: "2024-01-18",
      expiresAt: "2024-02-18",
      fraudScore: 0.05,
    },
    {
      id: "3",
      requesterAddress: "0x5555...6666",
      requesterName: "Charlie Brown",
      capsuleName: "Personal Documents",
      reason: "Suspicious activity detected",
      status: "rejected",
      createdAt: "2024-01-15",
      expiresAt: "2024-02-15",
      fraudScore: 0.85,
    },
    {
      id: "4",
      requesterAddress: "0x9999...0000",
      requesterName: "Diana Prince",
      capsuleName: "Medical History",
      reason: "Insurance claim verification",
      status: "pending",
      createdAt: "2024-01-19",
      expiresAt: "2024-02-19",
      fraudScore: 0.08,
    },
    {
      id: "5",
      requesterAddress: "0x1111...2222",
      requesterName: "Eve Wilson",
      capsuleName: "Financial Records",
      reason: "Tax preparation assistance",
      status: "approved",
      createdAt: "2024-01-17",
      expiresAt: "2024-04-17",
      fraudScore: 0.02,
    },
  ])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !isConnected) return

    const loadRequests = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // In production, fetch from API
        // const response = await fetch('/api/requests')
        // if (!response.ok) throw new Error('Failed to load requests')
        // const data = await response.json()
        // setRequests(data.requests)
      } catch (err) {
        console.error("[v0] Error loading requests:", err)
        setError("Failed to load requests. Using mock data.")
      } finally {
        setIsLoading(false)
      }
    }

    loadRequests()
  }, [isAuthenticated, isConnected])

  if (!isConnected || !isAuthenticated) {
    redirect("/")
  }

  const pendingRequests = requests.filter((r) => r.status === "pending")
  const approvedRequests = requests.filter((r) => r.status === "approved")
  const rejectedRequests = requests.filter((r) => r.status === "rejected")

  const handleApprove = async (id: string) => {
    try {
      setRequests(requests.map((r) => (r.id === id ? { ...r, status: "approved" as const } : r)))
      // In production, call API
      // await fetch(`/api/requests/${id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: 'approved' })
      // })
    } catch (err) {
      console.error("[v0] Error approving request:", err)
      setError("Failed to approve request")
    }
  }

  const handleReject = async (id: string) => {
    try {
      setRequests(requests.map((r) => (r.id === id ? { ...r, status: "rejected" as const } : r)))
      // In production, call API
      // await fetch(`/api/requests/${id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: 'rejected' })
      // })
    } catch (err) {
      console.error("[v0] Error rejecting request:", err)
      setError("Failed to reject request")
    }
  }

  const handleRevoke = async (id: string) => {
    try {
      setRequests(requests.map((r) => (r.id === id ? { ...r, status: "pending" as const } : r)))
      // In production, call API
      // await fetch(`/api/requests/${id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: 'pending' })
      // })
    } catch (err) {
      console.error("[v0] Error revoking request:", err)
      setError("Failed to revoke request")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Access Requests</h1>
          <p className="text-muted-foreground">Manage who can access your capsules and sensitive data</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Card className="glass mb-6 border-red-200 dark:border-red-800">
            <CardContent className="pt-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <RequestStats
          pending={pendingRequests.length}
          approved={approvedRequests.length}
          rejected={rejectedRequests.length}
        />

        {/* Insights Card */}
        <div className="mb-8">
          <Card className="glass border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30">
            <CardContent className="pt-6 flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-green-900 dark:text-green-100">Access Insights</p>
                <p className="text-sm text-green-800 dark:text-green-200">
                  You have {pendingRequests.length} pending request{pendingRequests.length !== 1 ? "s" : ""} and{" "}
                  {approvedRequests.length} active access grant{approvedRequests.length !== 1 ? "s" : ""}. Average fraud
                  score for pending requests:{" "}
                  {(
                    (pendingRequests.reduce((sum, r) => sum + (r.fraudScore || 0), 0) /
                      Math.max(pendingRequests.length, 1)) *
                    100
                  ).toFixed(0)}
                  %
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pending{" "}
              <span className="ml-2 text-xs bg-yellow-600 text-white px-2 py-0.5 rounded-full">
                {pendingRequests.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved{" "}
              <span className="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                {approvedRequests.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected{" "}
              <span className="ml-2 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">
                {rejectedRequests.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <RequestList
              requests={pendingRequests}
              onApprove={handleApprove}
              onReject={handleReject}
              showActions={true}
            />
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            <RequestList requests={approvedRequests} onRevoke={handleRevoke} showActions={true} />
          </TabsContent>

          <TabsContent value="rejected" className="mt-6">
            <RequestList requests={rejectedRequests} showActions={false} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
