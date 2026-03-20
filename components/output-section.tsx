"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Copy, Check, RotateCcw, ExternalLink, Lightbulb, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCommitStore } from "@/store/use-commit-store"
import { toast } from "sonner"

export function OutputSection() {
  const { isLoading, result, generateCommit } = useCommitStore()
  const [copiedField, setCopiedField] = React.useState<string | null>(null)

  const copyToClipboard = (text: string, field: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    toast.success(`${label} copied!`, {
      description: "Ready to be pasted into your terminal or GitHub.",
    })
    setTimeout(() => setCopiedField(null), 2000)
  }

  if (isLoading) {
    return (
      <div className="space-y-10">
        <div className="p-8 rounded-[2.5rem] border bg-background/40 backdrop-blur-xl border-primary/10 space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-5 w-40 rounded-full" />
          </div>
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[1, 2].map((i) => (
            <div key={i} className="p-8 rounded-[2.5rem] border bg-background/20 backdrop-blur-md space-y-4">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!result) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="space-y-10"
    >
      <div className="flex items-center gap-3 px-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Generated Result</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <OutputCard
        label="Commit Message"
        value={result.commitMessage}
        onCopy={() => copyToClipboard(result.commitMessage, "commit", "Commit message")}
        isCopied={copiedField === "commit"}
        icon={<Terminal className="h-4 w-4" />}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <OutputCard
          label="PR Title"
          value={result.prTitle}
          onCopy={() => copyToClipboard(result.prTitle, "title", "PR title")}
          isCopied={copiedField === "title"}
          icon={<ExternalLink className="h-4 w-4" />}
        />
        <OutputCard
          label="PR Description"
          value={result.prDescription}
          onCopy={() => copyToClipboard(result.prDescription, "description", "PR description")}
          isCopied={copiedField === "description"}
          isMultiline
          icon={<Lightbulb className="h-4 w-4" />}
        />
      </div>

      <div className="flex flex-col items-center gap-6 pt-10">
        <Button
          variant="outline"
          size="lg"
          onClick={generateCommit}
          className="group rounded-2xl gap-3 px-12 py-7 border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-primary transition-all duration-500 shadow-xl bg-background/50 backdrop-blur-sm"
        >
          <RotateCcw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-700" />
          Refine with Magic
        </Button>
        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
          Not satisfied? Try another variation.
        </p>
      </div>
    </motion.div>
  )
}

function OutputCard({ 
  label, 
  value, 
  onCopy, 
  isCopied, 
  isMultiline = false,
  icon
}: { 
  label: string
  value: string
  onCopy: () => void
  isCopied: boolean
  isMultiline?: boolean
  icon: React.ReactNode
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="p-8 rounded-[2.5rem] border bg-background/40 backdrop-blur-2xl relative group overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border-border/60 hover:border-primary/20"
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "h-12 w-12 rounded-2xl transition-all duration-500 bg-background/50 hover:bg-primary hover:text-primary-foreground",
            isCopied && "bg-green-500 text-white hover:bg-green-600"
          )}
          onClick={onCopy}
        >
          {isCopied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
        </Button>
      </div>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-500 border border-border/50">
            {icon}
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{label}</span>
        </div>
        
        <p className={cn(
          "font-mono text-sm leading-relaxed text-foreground/90 selection:bg-primary/20",
          isMultiline ? "line-clamp-6" : "truncate pr-16"
        )}>
          {value}
        </p>
      </div>
    </motion.div>
  )
}
