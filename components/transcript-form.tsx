"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { extractTranscript } from "@/actions/extract-transcript"
import { Loader2 } from "lucide-react"

export function TranscriptForm() {
  const [url, setUrl] = useState("")
  const [transcript, setTranscript] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!url) return

    setIsLoading(true)
    setError(null)
    setTranscript(null)

    try {
      const result = await extractTranscript(url)

      if (result.error) {
        setError(result.error)
      } else if (result.transcript) {
        setTranscript(result.transcript)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://example.com/page-with-video"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !url}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              "Extract Transcript"
            )}
          </Button>
        </div>
      </form>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-red-600">{error}</CardContent>
        </Card>
      )}

      {transcript && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Transcript</h2>
          <Card>
            <CardContent className="pt-6 whitespace-pre-wrap">{transcript}</CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

