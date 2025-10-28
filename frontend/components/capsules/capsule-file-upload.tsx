"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, File } from "lucide-react"

interface CapsuleFileUploadProps {
  onUpload: (file: File) => void
}

export function CapsuleFileUpload({ onUpload }: CapsuleFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      setSelectedFile(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-border"
        }`}
      >
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm font-medium mb-1">Drag and drop your file here</p>
        <p className="text-xs text-muted-foreground mb-4">or click to browse</p>
        <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" id="file-input" />
        <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="bg-transparent">
          Browse Files
        </Button>
      </div>

      {selectedFile && (
        <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <File className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-sm">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <Button onClick={handleUpload} className="gap-2">
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        </div>
      )}
    </div>
  )
}
