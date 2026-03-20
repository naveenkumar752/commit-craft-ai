"use client"

import { Sparkles, Terminal, Rocket, Github, Zap, Shield } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full pt-20 pb-20 md:pt-32 md:pb-32 relative overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-30 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/40 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/40 rounded-full blur-[120px] mix-blend-screen animate-pulse [animation-delay:2s]" />
        </div>
        
        <div className="container px-4 md:px-6 mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black tracking-widest uppercase mb-4 animate-bounce">
              <Sparkles className="h-4 w-4" />
              Revolutionizing Code Context
            </div>
            
            <h1 className="text-5xl font-black tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl leading-[1]">
              Code History, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-indigo-600 animate-gradient">
                Unlocked.
              </span>
            </h1>
            
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl lg:text-2xl font-medium leading-relaxed">
              Tired of writing "fix" or "update"? <br className="hidden sm:block" />
              Let AI bridge the gap between your changes and your history.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link 
                href="/generate"
                className="group relative px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/30 flex items-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Rocket className="h-5 w-5" />
                Start Generating
              </Link>
              <Link 
                href="https://github.com/naveenkumar752/commit-craft-ai"
                target="_blank"
                className="px-8 py-4 rounded-2xl bg-muted border border-border font-bold text-lg transition-all hover:bg-muted/80 flex items-center gap-3"
              >
                <Github className="h-5 w-5" />
                Star on GitHub
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="w-full pb-20 container px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Zap className="h-6 w-6 text-yellow-500" />}
            title="Instant Analysis"
            description="Our AI parses complex git diffs in milliseconds to understand the intent behind your code."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-green-500" />}
            title="Security First"
            description="Enterprise-grade IP-based rate limiting protected by Upstash Redis to prevent abuse."
          />
          <FeatureCard 
            icon={<Terminal className="h-6 w-6 text-primary" />}
            title="CLI Integrated"
            description="Generate messages directly from your terminal with our global commit-craft CLI tool."
          />
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-3xl border bg-card/50 backdrop-blur-xl hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all flex flex-col gap-4"
    >
      <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-black">{title}</h3>
      <p className="text-muted-foreground leading-relaxed font-medium">{description}</p>
    </motion.div>
  )
}
