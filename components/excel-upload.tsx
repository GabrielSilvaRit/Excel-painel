"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileSpreadsheet, CheckCircle } from "lucide-react"

interface ExcelUploadProps {
  onDataUpdate: (data: any) => void
}

export function ExcelUpload({ onDataUpdate }: ExcelUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-excel", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        onDataUpdate(result.data)
        setUploaded(true)
        setTimeout(() => setUploaded(false), 3000)
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Upload da Planilha Excel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} disabled={uploading} />
          <Button disabled={uploading} className="w-full" variant={uploaded ? "default" : "outline"}>
            {uploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : uploaded ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Enviado com sucesso!
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Selecionar Arquivo
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
