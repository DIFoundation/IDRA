"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, FileText, Lock } from "lucide-react"
import { crypto } from "@/lib/crypto"
import { api } from "@/lib/api"

export function CapsuleUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [type, setType] = useState("identity")
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    try {
      setProgress(30)
      const fileContent = await file.text()
      const payload = { type, content: fileContent }

      setProgress(60)
      const { cid, encKey } = await crypto.encryptPayload(payload)

      setProgress(80)
      await api.uploadCapsule({ cid, encKey, type })

      setProgress(100)
      setSuccess(true)
      setFile(null)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <Card className="glass p-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Capsule Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
          >
            <option value="identity">Identity</option>
            <option value="credential">Credential</option>
            <option value="document">Document</option>
            <option value="attestation">Attestation</option>
          </select>
        </div>

        <div
          className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition cursor-pointer"
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium">Drop file here or click to select</p>
          <p className="text-xs text-muted-foreground mt-1">Max 10MB</p>
          <input id="file-input" type="file" onChange={handleFileChange} className="hidden" />
        </div>

        {file && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <FileText className="w-4 h-4" />
            <span className="text-sm flex-1">{file.name}</span>
            <Lock className="w-4 h-4 text-primary" />
          </div>
        )}

        {uploading && (
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-200 rounded-lg text-sm">
            ✓ Capsule encrypted and uploaded successfully
          </div>
        )}

        <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
          {uploading ? `Uploading... ${progress}%` : "Encrypt & Upload"}
        </Button>
      </div>
    </Card>
  )
}
