"use client"

import { useState } from "react"
import { useSiweAuth } from "@/hooks/use-siwe-auth"
import { redirect } from "next/navigation"
import { OnboardingSteps } from "@/components/onboarding/onboarding-steps"
import { ProfileSetup } from "@/components/onboarding/profile-setup"
import { FaceEnrollment } from "@/components/onboarding/face-enrollment"
import { GuardianSetup } from "@/components/onboarding/guardian-setup"
import { OnboardingComplete } from "@/components/onboarding/onboarding-complete"

export default function OnboardingPage() {
  const { isAuthenticated, isConnected } = useSiweAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
  })
  const [faceData, setFaceData] = useState<string | null>(null)
  const [guardians, setGuardians] = useState<Array<{ address: string; name: string }>>([])

  if (!isConnected) {
    redirect("/")
  }

  if (!isAuthenticated) {
    redirect("/")
  }

  const steps = [
    { title: "Profile", description: "Set up your profile" },
    { title: "Face ID", description: "Enroll your face" },
    { title: "Guardians", description: "Add recovery guardians" },
    { title: "Complete", description: "You're all set!" },
  ]

  const handleProfileComplete = (data: typeof profileData) => {
    setProfileData(data)
    setCurrentStep(1)
  }

  const handleFaceComplete = (data: string) => {
    setFaceData(data)
    setCurrentStep(2)
  }

  const handleGuardiansComplete = (data: typeof guardians) => {
    setGuardians(data)
    setCurrentStep(3)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <OnboardingSteps steps={steps} currentStep={currentStep} />

        <div className="mt-12">
          {currentStep === 0 && <ProfileSetup onComplete={handleProfileComplete} />}
          {currentStep === 1 && <FaceEnrollment onComplete={handleFaceComplete} />}
          {currentStep === 2 && <GuardianSetup onComplete={handleGuardiansComplete} />}
          {currentStep === 3 && (
            <OnboardingComplete profile={profileData} faceEnrolled={!!faceData} guardiansCount={guardians.length} />
          )}
        </div>
      </div>
    </div>
  )
}
