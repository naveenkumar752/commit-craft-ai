import { CommitGenerator } from "@/components/commit-generator"
import { Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full pt-20 pb-12 md:pt-32 md:pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[120px] mix-blend-screen animate-pulse [animation-delay:2s]" />
        </div>
        
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4 animate-bounce">
              <Sparkles className="h-3 w-3" />
              Smarter Code History
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
                Your Code, <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-indigo-600 animate-gradient">
                  Perfectly Explained.
                </span>
              </h1>
              <p className="mx-auto max-w-[600px] text-muted-foreground/80 md:text-xl font-medium">
                Transform messy git diffs into beautiful, conventional commit messages and PR descriptions in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main App Section */}
      <section className="w-full px-4">
        <CommitGenerator />
      </section>
    </div>
  )
}
