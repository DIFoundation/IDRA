"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, AlertCircle } from "lucide-react"
import { RecoverySteps } from "@/components/recovery/recovery-steps"
import { GuardianApprovalList } from "@/components/recovery/guardian-approval-list"

interface GuardianApproval {
  id: string
  guardianName: string
  guardianAddress: string
  status: "pending" | "approved" | "rejected"
  approvedAt?: string
}

export default function RecoveryPage() {
  const [recoveryStep, setRecoveryStep] = useState<"verify" | "request" | "waiting" | "complete">("verify")
  const [verificationCode, setVerificationCode] = useState("")
  const [guardianApprovals, setGuardianApprovals] = useState<GuardianApproval[]>([
    {
      id: "1",
      guardianName: "Mom",
      guardianAddress: "0x1111...2222",
      status: "approved",
      approvedAt: "2024-01-20",
    },
    {
      id: "2",
      guardianName: "Best Friend",
      guardianAddress: "0x3333...4444",
      status: "pending",
    },
    {
      id: "3",
      guardianName: "Brother",
      guardianAddress: "0x5555...6666",
      status: "pending",
    },
  ])

  const approvedCount = guardianApprovals.filter((g) => g.status === "approved").length
  const requiredApprovals = 2

  const handleInitiateRecovery = () => {
    if (verificationCode.length >= 6) {
      setRecoveryStep("request")
    }
  }

  const handleRequestRecovery = () => {
    setRecoveryStep("waiting")
  }

  const handleApproveGuardian = (id: string) => {
    setGuardianApprovals(
      guardianApprovals.map((g) =>
        g.id === id ? { ...g, status: "approved", approvedAt: new Date().toISOString().split("T")[0] } : g,
      ),
    )

    if (approvedCount + 1 >= requiredApprovals) {
      setTimeout(() => setRecoveryStep("complete"), 1000)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Account Recovery</h1>
          </div>
          <p className="text-muted-foreground">Recover your account with guardian approval</p>
        </div>

        {/* Recovery Steps */}
        <RecoverySteps currentStep={recoveryStep} />

        {/* Content */}
        <div className="mt-12">
          {recoveryStep === "verify" && (
            <Card className="glass">
              <CardHeader>
                <CardTitle>Verify Your Identity</CardTitle>
                <CardDescription>Enter the verification code sent to your email</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Verification Code</label>
                  <Input
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.slice(0, 6))}
                    maxLength={6}
                    className="mt-1 text-center text-2xl tracking-widest"
                  />
                </div>
                <Button onClick={handleInitiateRecovery} disabled={verificationCode.length < 6} className="w-full">
                  Verify & Continue
                </Button>
              </CardContent>
            </Card>
          )}

          {recoveryStep === "request" && (
            <Card className="glass">
              <CardHeader>
                <CardTitle>Request Guardian Approval</CardTitle>
                <CardDescription>Your guardians will receive a recovery request</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-yellow-900 dark:text-yellow-100">
                      You need {requiredApprovals} guardian approvals to recover your account
                    </p>
                    <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-1">
                      Guardians will have 48 hours to approve your recovery request
                    </p>
                  </div>
                </div>
                <Button onClick={handleRequestRecovery} className="w-full">
                  Send Recovery Request
                </Button>
              </CardContent>
            </Card>
          )}

          {recoveryStep === "waiting" && (
            <Card className="glass">
              <CardHeader>
                <CardTitle>Waiting for Guardian Approvals</CardTitle>
                <CardDescription>
                  {approvedCount} of {requiredApprovals} guardians approved
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GuardianApprovalList
                  guardians={guardianApprovals}
                  onApprove={handleApproveGuardian}
                  requiredApprovals={requiredApprovals}
                />
              </CardContent>
            </Card>
          )}

          {recoveryStep === "complete" && (
            <Card className="glass">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Shield className="w-12 h-12 text-green-500" />
                </div>
                <CardTitle>Account Recovered!</CardTitle>
                <CardDescription>Your account has been successfully recovered</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                  <p className="text-sm text-green-900 dark:text-green-100">
                    You can now access your account and capsules. Please update your security settings.
                  </p>
                </div>
                <Button className="w-full">Go to Dashboard</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
