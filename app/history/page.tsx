"use client"

import { useCommitStore } from "@/store/use-commit-store"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Copy, Rocket, Clock, ArrowLeft, History } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface CommitHistoryItem {
  commitMessage: string
  prTitle: string
  prDescription: string
  timestamp: number
  style: string
}

export default function HistoryPage() {
  // @ts-ignore - History is typed in the store, but we cast for safety here
  const { history, clearHistory } = useCommitStore() as { history: CommitHistoryItem[], clearHistory: () => void }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container px-4 py-8 mx-auto flex-1">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <Link 
              href="/generate" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4 group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Generator
            </Link>
            <div className="flex items-center gap-3">
              <History className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-black">Generation History</h1>
            </div>
            <p className="text-muted-foreground mt-1">Review and reuse your previous AI-generated commit metadata.</p>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Are you sure you want to clear all history?")) {
                  clearHistory()
                  toast.success("History cleared")
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm font-bold"
            >
              <Trash2 className="h-4 w-4" />
              Clear History
            </button>
          )}
        </motion.div>

        {history.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-3xl bg-muted/30"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Clock className="h-8 w-8 text-primary/40" />
            </div>
            <h2 className="text-xl font-bold mb-2">No history yet</h2>
            <p className="text-muted-foreground max-w-[300px] mb-8">
              Your generated commit messages will appear here for easy access later.
            </p>
            <Link 
              href="/generate"
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              <Rocket className="h-4 w-4" />
              Start Generating
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence mode="popLayout">
              {history.map((item, index) => (
                <motion.div
                  key={item.timestamp + index}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative p-6 rounded-3xl border bg-card/50 backdrop-blur-xl hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-primary/10 text-primary">
                          {item.style}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg leading-tight line-clamp-1">{item.commitMessage}</h3>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => copyToClipboard(item.commitMessage)}
                        className="p-2 rounded-lg bg-muted hover:bg-primary/20 hover:text-primary transition-all shadow-sm"
                        title="Copy Commit Message"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-dashed">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">PR Title</span>
                      <p className="text-sm font-medium">{item.prTitle}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">PR Description</span>
                      <p className="text-sm text-muted-foreground line-clamp-2 italic">{item.prDescription}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
