"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, FileText, Trash2, ChevronRight } from "lucide-react"
import Link from "next/link"

interface Capsule {
  id: string
  name: string
  description: string
  createdAt: string
  size: number
  encrypted: boolean
  accessCount: number
}

interface CapsuleListProps {
  capsules: Capsule[]
  onDelete: (id: string) => void
}

export function CapsuleList({ capsules, onDelete }: CapsuleListProps) {
  if (capsules.length === 0) {
    return (
      <Card className="glass">
        <CardContent className="pt-12 pb-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No capsules yet. Create your first one to get started.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {capsules.map((capsule) => (
        <Card key={capsule.id} className="glass hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Link href={`/capsules/${capsule.id}`} className="flex-1">
                <div className="flex items-start gap-4 cursor-pointer">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{capsule.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{capsule.description}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Created {capsule.createdAt}</span>
                      <span>{capsule.size.toFixed(1)} GB</span>
                      <span>{capsule.accessCount} access requests</span>
                    </div>
                  </div>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <Link href={`/capsules/${capsule.id}`}>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(capsule.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
