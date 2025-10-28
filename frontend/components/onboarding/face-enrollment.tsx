"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Check } from "lucide-react"

interface FaceEnrollmentProps {
  onComplete: (data: string) => void
}

export function FaceEnrollment({ onComplete }: FaceEnrollmentProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isCaptured, setIsCaptured] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCapturing(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        setIsCaptured(true)

        // Stop video stream
        const stream = videoRef.current.srcObject as MediaStream
        stream?.getTracks().forEach((track) => track.stop())
        setIsCapturing(false)
      }
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)

    // Simulate face enrollment processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (canvasRef.current) {
      const imageData = canvasRef.current.toDataURL("image/jpeg")
      onComplete(imageData)
    }

    setIsLoading(false)
  }

  const handleSkip = () => {
    onComplete("")
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Enroll Your Face</CardTitle>
        <CardDescription>We'll use your face for secure identity verification</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!isCapturing && !isCaptured && (
            <div className="bg-muted rounded-lg p-8 flex flex-col items-center justify-center min-h-64">
              <Camera className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center mb-4">
                Click below to start your camera and capture a photo of your face
              </p>
              <Button onClick={startCapture}>Start Camera</Button>
            </div>
          )}

          {isCapturing && (
            <div className="space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg bg-black"
                style={{ maxHeight: "400px" }}
              />
              <Button onClick={capturePhoto} className="w-full">
                Capture Photo
              </Button>
            </div>
          )}

          {isCaptured && (
            <div className="space-y-4">
              <canvas ref={canvasRef} width={400} height={300} className="w-full rounded-lg bg-black hidden" />
              <div className="bg-muted rounded-lg p-4 flex items-center justify-center min-h-64">
                <div className="text-center">
                  <Check className="w-12 h-12 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Face captured successfully</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setIsCaptured(false)
                    startCapture()
                  }}
                >
                  Retake
                </Button>
                <Button onClick={handleComplete} disabled={isLoading} className="flex-1">
                  {isLoading ? "Processing..." : "Continue"}
                </Button>
              </div>
            </div>
          )}

          {!isCapturing && !isCaptured && (
            <Button variant="ghost" className="w-full" onClick={handleSkip}>
              Skip for now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
