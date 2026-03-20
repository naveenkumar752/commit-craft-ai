"use client"

import { CommitGenerator } from "@/components/commit-generator"
import { UsageGuide } from "@/components/usage-guide"
import { Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function GeneratePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="container px-4 py-8 mx-auto flex-1">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black">Generate Metadata</h1>
            <div className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
              AI Powered
            </div>
          </div>
          <p className="text-muted-foreground mt-1">Paste your git diff below to craft perfect commit logs.</p>
        </motion.div>

        <div className="flex flex-col gap-12 max-w-4xl mx-auto">
          <CommitGenerator />
          <UsageGuide />
        </div>
      </div>
    </div>
  )
}
