"use client"

import { Check } from "lucide-react"

interface RecoveryStepsProps {
  currentStep: "verify" | "request" | "waiting" | "complete"
}

export function RecoverySteps({ currentStep }: RecoveryStepsProps) {
  const steps = [
    { id: "verify", label: "Verify" },
    { id: "request", label: "Request" },
    { id: "waiting", label: "Waiting" },
    { id: "complete", label: "Complete" },
  ]

  const stepIndex = steps.findIndex((s) => s.id === currentStep)

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                index < stepIndex
                  ? "bg-primary text-primary-foreground"
                  : index === stepIndex
                    ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {index < stepIndex ? <Check className="w-5 h-5" /> : index + 1}
            </div>
            <p className="text-xs font-medium mt-2">{step.label}</p>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-1 flex-1 mx-2 rounded-full transition-all ${index < stepIndex ? "bg-primary" : "bg-muted"}`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
