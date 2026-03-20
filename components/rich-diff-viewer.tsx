"use client"

import React, { useMemo } from "react"
import { parseDiff, Diff, Hunk, Decoration } from "react-diff-view"
import "react-diff-view/style/index.css"

interface RichDiffViewerProps {
  diffText: string
}

export function RichDiffViewer({ diffText }: RichDiffViewerProps) {
  const files = useMemo(() => {
    try {
      return parseDiff(diffText)
    } catch (e) {
      console.error("Failed to parse diff:", e)
      return []
    }
  }, [diffText])

  if (!files || files.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-lg bg-muted/30 text-muted-foreground italic text-sm">
        No changes detected or invalid diff format.
      </div>
    )
  }

  return (
    <div className="space-y-6 overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm">
      {files.map(({ oldPath, newPath, hunks, type }, i) => (
        <div key={i} className="border-b last:border-0 overflow-hidden">
          <div className="bg-muted/50 px-4 py-2 border-b flex items-center gap-2">
            <span className="text-xs font-mono font-medium truncate">
              {type === "delete" ? oldPath : newPath}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
              type === "add" ? "bg-green-500/20 text-green-500" : 
              type === "delete" ? "bg-red-500/20 text-red-500" : 
              "bg-blue-500/20 text-blue-500"
            }`}>
              {type}
            </span>
          </div>
          <Diff viewType="split" diffType={type} hunks={hunks}>
            {(hunks) => hunks.map((hunk) => (
              <Hunk key={hunk.content} hunk={hunk} />
            ))}
          </Diff>
        </div>
      ))}
    </div>
  )
}
