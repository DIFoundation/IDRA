"use client"

import { Button } from "@/components/ui/button"
import { Download, Trash2, Lock } from "lucide-react"

interface CapsuleFile {
  id: string
  name: string
  size: number
  uploadedAt: string
  encrypted: boolean
}

interface CapsuleFileListProps {
  files: CapsuleFile[]
  onDelete: (id: string) => void
}

export function CapsuleFileList({ files, onDelete }: CapsuleFileListProps) {
  if (files.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No files uploaded yet</p>
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1">
            <Lock className="w-4 h-4 text-primary" />
            <div className="flex-1">
              <p className="font-medium text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {file.size.toFixed(2)} MB • Uploaded {file.uploadedAt}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(file.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
