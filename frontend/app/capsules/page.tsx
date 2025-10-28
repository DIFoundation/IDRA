"use client"

import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, Download } from "lucide-react"
import Link from "next/link"

export default function CapsulesPage() {
  const mockCapsules = [
    {
      id: "1",
      type: "Identity",
      cid: "QmMock123...",
      createdAt: "2025-10-20",
      size: "2.4 KB",
    },
    {
      id: "2",
      type: "Credential",
      cid: "QmMock456...",
      createdAt: "2025-10-18",
      size: "1.8 KB",
    },
    {
      id: "3",
      type: "Document",
      cid: "QmMock789...",
      createdAt: "2025-10-15",
      size: "5.2 KB",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Capsules</h1>
          <p className="text-muted-foreground">Manage your encrypted data capsules</p>
        </div>

        <div className="grid gap-4">
          {mockCapsules.map((capsule) => (
            <Card key={capsule.id} className="glass p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{capsule.type}</h3>
                    <p className="text-sm text-muted-foreground font-mono">{capsule.cid}</p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {capsule.createdAt}
                      </span>
                      <span>{capsule.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Link href={`/capsules/${capsule.id}`}>
                    <Button size="sm">View</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
