"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Terminal, Code2, Monitor, Copy, Check, ExternalLink } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function UsageGuide() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    toast.success("Command copied!")
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="w-full p-6 rounded-3xl border bg-card/50 backdrop-blur-xl shadow-2xl shadow-primary/5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Code2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-black">Usage Guide</h2>
          <p className="text-sm text-muted-foreground">Master the CommitCraft AI ecosystem.</p>
        </div>
      </div>

      <Tabs defaultValue="cli" className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-2xl p-1 bg-muted/50 mb-6">
          <TabsTrigger value="web" className="rounded-xl flex items-center gap-2 font-bold">
            <Monitor className="h-4 w-4" />
            Web
          </TabsTrigger>
          <TabsTrigger value="cli" className="rounded-xl flex items-center gap-2 font-bold">
            <Terminal className="h-4 w-4" />
            CLI
          </TabsTrigger>
          <TabsTrigger value="vscode" className="rounded-xl flex items-center gap-2 font-bold">
            <RocketIcon className="h-4 w-4" />
            VS Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="web" className="space-y-4 outline-none">
          <div className="space-y-3">
            <Step number={1} title="Paste Diff" description="Paste your staged git changes into the text area." />
            <Step number={2} title="Pick Style" description="Choose from Conventional, Professional, or Casual tones." />
            <Step number={3} title="Refine" description="Use the 'Chat with Diff' feature to tweak the output." />
          </div>
        </TabsContent>

        <TabsContent value="cli" className="space-y-6 outline-none">
          <div className="p-4 rounded-2xl bg-muted/30 border border-dashed text-sm space-y-4">
            <div className="space-y-2">
              <p className="font-bold">1. Install Globally</p>
              <div className="relative group">
                <code className="block p-3 rounded-xl bg-black text-white font-mono text-xs">
                  npm link
                </code>
                <button 
                  onClick={() => copyToClipboard("npm link", "link")}
                  className="absolute right-2 top-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
                >
                  {copied === "link" ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3 text-white" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-bold">2. Run in any Repo</p>
              <div className="relative group">
                <code className="block p-3 rounded-xl bg-black text-white font-mono text-xs">
                  commit-craft --copy
                </code>
                <button 
                  onClick={() => copyToClipboard("commit-craft --copy", "run")}
                  className="absolute right-2 top-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
                >
                  {copied === "run" ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3 text-white" />}
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground italic mt-1">* Ensure GEMINI_API_KEY is set in your globally linked .env</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="vscode" className="space-y-4 outline-none">
          <div className="space-y-4">
            <p className="text-sm leading-relaxed">
              We provide a core logic library in <code className="text-primary font-bold">lib/vscode-logic.ts</code> that can be integrated into your workspace.
            </p>
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <p className="text-xs font-medium text-primary mb-2 flex items-center gap-2">
                <ExternalLink className="h-3 w-3" />
                Integration Preview
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You can use our API logic with VS Code&apos;s Git Extension to generate messages directly in the SCM view.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Step({ number, title, description }: { number: number, title: string, description: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-black shrink-0">
        {number}
      </div>
      <div>
        <p className="text-sm font-bold leading-none mb-1">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function RocketIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3" />
      <path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5" />
    </svg>
  )
}
