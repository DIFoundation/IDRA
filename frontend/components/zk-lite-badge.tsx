"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader } from "lucide-react"

export function ZKLiteBadge() {
  const [verified, setVerified] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    setLoading(true)
    // Simulate ZK verification
    setTimeout(() => {
      setVerified(Math.random() > 0.3)
      setLoading(false)
    }, 1500)
  }

  return (
    <Card className="glass p-6">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">ZK-Lite Verification</h3>
          <p className="text-sm text-muted-foreground">
            Prove you meet age requirements without revealing your identity
          </p>
        </div>

        {verified === null && (
          <Button onClick={handleVerify} disabled={loading} className="w-full gap-2">
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Start Verification"
            )}
          </Button>
        )}

        {verified === true && (
          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-900 dark:text-green-100">Verified</p>
              <p className="text-xs text-green-700 dark:text-green-200">You have proven age eligibility</p>
            </div>
          </div>
        )}

        {verified === false && (
          <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-semibold text-red-900 dark:text-red-100">Verification Failed</p>
              <p className="text-xs text-red-700 dark:text-red-200">Please try again</p>
            </div>
          </div>
        )}

        {verified !== null && (
          <Button onClick={() => setVerified(null)} variant="outline" className="w-full">
            Reset
          </Button>
        )}
      </div>
    </Card>
  )
}
