"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Shield, Camera, Users } from "lucide-react"

interface OnboardingCompleteProps {
  profile: { name: string; email: string; bio: string }
  faceEnrolled: boolean
  guardiansCount: number
}

export function OnboardingComplete({ profile, faceEnrolled, guardiansCount }: OnboardingCompleteProps) {
  return (
    <Card className="glass">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-primary" />
        </div>
        <CardTitle>Welcome to IDRA, {profile.name}!</CardTitle>
        <CardDescription>Your identity is now secured and ready to use</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs font-semibold">Profile</p>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Camera className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs font-semibold">Face ID</p>
              <p className="text-xs text-muted-foreground">{faceEnrolled ? "Enrolled" : "Skipped"}</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Users className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs font-semibold">Guardians</p>
              <p className="text-xs text-muted-foreground">{guardiansCount} added</p>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm font-semibold">What's next?</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Create your first encrypted capsule</li>
              <li>• Invite guardians to approve recovery</li>
              <li>• Set up access permissions</li>
            </ul>
          </div>

          <Link href="/dashboard" className="block">
            <Button className="w-full">Go to Dashboard</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
