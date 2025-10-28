"use client"

import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { ZKLiteBadge } from "@/components/zk-lite-badge"
import { CheckCircle, Shield } from "lucide-react"

export default function ZKLitePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">ZK-Lite Verification</h1>
          <p className="text-muted-foreground">Prove attributes without revealing your identity</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="glass p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                How It Works
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Pre-commit</p>
                    <p className="text-sm text-muted-foreground">Commit to your attribute without revealing it</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Sign</p>
                    <p className="text-sm text-muted-foreground">Sign the commitment with your wallet</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Verify</p>
                    <p className="text-sm text-muted-foreground">
                      Verifier confirms the proof without seeing your data
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="glass p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Benefits
              </h2>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Privacy-preserving verification</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>No personal data exposure</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Cryptographically secure</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Instant verification</span>
                </li>
              </ul>
            </Card>
          </div>

          <div>
            <ZKLiteBadge />
          </div>
        </div>
      </main>
    </div>
  )
}
