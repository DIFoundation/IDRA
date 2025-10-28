"use client"

import { useState } from "react"
import { useSiweAuth } from "@/hooks/use-siwe-auth"
import { redirect, useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Lock } from "lucide-react"
import Link from "next/link"
import { CapsuleFileUpload } from "@/components/capsules/capsule-file-upload"
import { CapsuleFileList } from "@/components/capsules/capsule-file-list"

interface CapsuleFile {
  id: string
  name: string
  size: number
  uploadedAt: string
  encrypted: boolean
}

export default function CapsuleDetailPage() {
  const { isAuthenticated, isConnected } = useSiweAuth()
  const params = useParams()
  const capsuleId = params.id as string

  const [files, setFiles] = useState<CapsuleFile[]>([
    {
      id: "1",
      name: "passport.pdf",
      size: 2.1,
      uploadedAt: "2024-01-15",
      encrypted: true,
    },
    {
      id: "2",
      name: "birth_certificate.pdf",
      size: 1.5,
      uploadedAt: "2024-01-14",
      encrypted: true,
    },
  ])

  if (!isConnected || !isAuthenticated) {
    redirect("/")
  }

  const handleFileUpload = (file: File) => {
    const newFile: CapsuleFile = {
      id: String(files.length + 1),
      name: file.name,
      size: file.size / (1024 * 1024),
      uploadedAt: new Date().toISOString().split("T")[0],
      encrypted: true,
    }
    setFiles([...files, newFile])
  }

  const handleDeleteFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Capsules
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Personal Documents</h1>
          <p className="text-muted-foreground">Important personal files and documents</p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Encryption</p>
                  <p className="font-semibold">AES-256</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-muted-foreground">Files</p>
                <p className="text-2xl font-bold">{files.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="pt-6">
              <div>
                <p className="text-xs text-muted-foreground">Total Size</p>
                <p className="text-2xl font-bold">{files.reduce((sum, f) => sum + f.size, 0).toFixed(1)} MB</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
            <CardDescription>Add files to your encrypted capsule</CardDescription>
          </CardHeader>
          <CardContent>
            <CapsuleFileUpload onUpload={handleFileUpload} />
          </CardContent>
        </Card>

        {/* Files List */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Files</CardTitle>
            <CardDescription>{files.length} files in this capsule</CardDescription>
          </CardHeader>
          <CardContent>
            <CapsuleFileList files={files} onDelete={handleDeleteFile} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
