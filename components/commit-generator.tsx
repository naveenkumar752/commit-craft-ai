"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sparkles, Terminal, RotateCcw, AlertCircle, Wand2, MessageSquare, Send, Eye, Edit3 } from "lucide-react"
import { OutputSection } from "@/components/output-section"
import { RichDiffViewer } from "@/components/rich-diff-viewer"
import { useCommitStore } from "@/store/use-commit-store"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CommitGenerator() {
  const { 
    diff, 
    style, 
    isLoading, 
    error, 
    result, 
    refinementInstruction,
    setDiff, 
    setStyle, 
    setRefinementInstruction,
    generateCommit,
    refineCommit
  } = useCommitStore()

  const handleGenerate = async () => {
    if (!diff.trim()) {
      toast.error("Please paste a git diff first!")
      return
    }
    
    try {
      await generateCommit()
      const currentError = useCommitStore.getState().error
      if (!currentError) {
        toast.success("Magic generated!")
      } else {
        toast.error(currentError)
      }
    } catch (err: any) {}
  }

  const handleRefine = async () => {
    if (!refinementInstruction.trim()) return
    
    try {
      await refineCommit()
      const currentError = useCommitStore.getState().error
      if (!currentError) {
        toast.success("Response refined!")
      } else {
        toast.error(currentError)
      }
    } catch (err: any) {}
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault()
      if (result) {
        handleRefine()
      } else {
        handleGenerate()
      }
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-16 pb-24 px-4 sm:px-6">
      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="p-1 sm:p-px rounded-[2.5rem] bg-gradient-to-b from-primary/20 via-border/50 to-transparent shadow-2xl"
      >
        <div className="p-6 sm:p-10 rounded-[2.4rem] bg-background/80 backdrop-blur-3xl relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold flex items-center gap-2.5 text-foreground/80 tracking-tight">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Terminal className="h-4 w-4" />
                  </div>
                  Git Diff Analysis
                </label>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 text-[10px] text-muted-foreground uppercase tracking-[0.1em] font-bold">
                  <span className="opacity-60">Shortcut:</span>
                  <kbd className="text-foreground">Ctrl + Enter</kbd>
                </div>
              </div>
              
              {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-8"
                >
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Tabs defaultValue="edit" className="w-full">
                <div className="flex justify-end mb-4">
                  <TabsList className="bg-muted/50 p-1 rounded-xl border border-border/50">
                    <TabsTrigger value="edit" className="rounded-lg gap-2 text-xs font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                      <Edit3 className="h-3.5 w-3.5" /> Edit
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="rounded-lg gap-2 text-xs font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                      <Eye className="h-3.5 w-3.5" /> Preview
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="edit" className="mt-0 focus-visible:outline-none">
                  <div className="relative group/textarea">
                    <Textarea
                      placeholder="Paste your git diff (e.g., git diff main...feature) or staged changes..."
                      className="min-h-[300px] font-mono text-[13px] leading-relaxed bg-muted/10 border-border/40 focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary/20 rounded-3xl resize-none transition-all duration-500 placeholder:text-muted-foreground/40 p-6 shadow-inner"
                      value={diff}
                      onChange={(e) => setDiff(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    {!diff && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 group-hover/textarea:opacity-30 transition-opacity">
                        <div className="flex flex-col items-center gap-3">
                          <Wand2 className="h-12 w-12 text-primary animate-pulse" />
                          <p className="text-sm font-medium">Ready for your code...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="preview" className="mt-0 focus-visible:outline-none">
                  <div className="min-h-[300px] rounded-3xl overflow-hidden border border-dashed border-border/50 bg-muted/5">
                    <RichDiffViewer diffText={diff} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-end justify-between pt-4 border-t border-border/40">
              <div className="w-full md:w-[280px] space-y-3">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 px-1">
                  Desired Persona
                </label>
                <Select value={style} onValueChange={(val) => setStyle(val || "conventional")}>
                  <SelectTrigger className="rounded-2xl bg-muted/30 border-border/50 px-6 h-14 shadow-sm hover:bg-muted/50 transition-colors focus:ring-1 focus:ring-primary/20">
                    <SelectValue placeholder="Select Style" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border/50 backdrop-blur-2xl shadow-2xl">
                    <SelectItem value="conventional" className="rounded-xl focus:bg-primary/10">Conventional Commits</SelectItem>
                    <SelectItem value="professional" className="rounded-xl focus:bg-primary/10">Professional Tone</SelectItem>
                    <SelectItem value="casual" className="rounded-xl focus:bg-primary/10">Casual & Energetic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                size="lg"
                className="w-full md:w-auto h-14 rounded-2xl px-12 bg-primary text-primary-foreground hover:shadow-[0_20px_40px_rgba(var(--primary-rgb),0.25)] hover:-translate-y-0.5 transition-all duration-500 group relative overflow-hidden"
                onClick={handleGenerate}
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-foreground/10 to-primary opacity-0 group-hover:opacity-20 transition-opacity animate-shimmer" />
                {isLoading && !result ? (
                  <span className="flex items-center gap-3 font-bold tracking-tight">
                    <RotateCcw className="h-5 w-5 animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center gap-3 font-bold tracking-tight">
                    <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform duration-500" />
                    {result ? "Regenerate" : "Generate Metadata"}
                  </span>
                )}
              </Button>
            </div>

            {/* Refinement Section */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-6 border-t border-border/40 space-y-4"
                >
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-primary/60 px-1">
                    <MessageSquare className="h-3 w-3" />
                    Interactive Refinement
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                    <div className="relative flex gap-3">
                      <input
                        type="text"
                        placeholder="e.g., 'Make it more concise' or 'Focus on security changes'..."
                        className="flex-1 bg-muted/30 border border-border/50 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/40"
                        value={refinementInstruction}
                        onChange={(e) => setRefinementInstruction(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleRefine()}
                      />
                      <Button
                        size="icon"
                        className="h-14 w-14 rounded-2xl shrink-0 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500"
                        onClick={handleRefine}
                        disabled={isLoading || !refinementInstruction.trim()}
                      >
                        {isLoading ? (
                          <RotateCcw className="h-5 w-5 animate-spin" />
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Output Section */}
      <AnimatePresence mode="wait">
        {(isLoading || result) && (
          <OutputSection />
        )}
      </AnimatePresence>
    </div>
  )
}
