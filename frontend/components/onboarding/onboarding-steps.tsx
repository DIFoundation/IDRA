"use client"

import { Check } from "lucide-react"

interface Step {
  title: string
  description: string
}

interface OnboardingStepsProps {
  steps: Step[]
  currentStep: number
}

export function OnboardingSteps({ steps, currentStep }: OnboardingStepsProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                index < currentStep
                  ? "bg-primary text-primary-foreground"
                  : index === currentStep
                    ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {index < currentStep ? <Check className="w-6 h-6" /> : index + 1}
            </div>
            <div className="mt-2 text-center">
              <p className="text-sm font-semibold">{step.title}</p>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-1 flex-1 mx-2 rounded-full transition-all ${
                index < currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
