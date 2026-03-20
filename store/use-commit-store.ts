import { create } from "zustand"

interface CommitResult {
  commitMessage: string
  prTitle: string
  prDescription: string
}

interface CommitState {
  diff: string
  style: string
  isLoading: boolean
  error: string | null
  result: CommitResult | null
  refinementInstruction: string
  
  setDiff: (diff: string) => void
  setStyle: (style: string) => void
  setRefinementInstruction: (instruction: string) => void
  generateCommit: () => Promise<void>
  refineCommit: () => Promise<void>
  reset: () => void
}

export const useCommitStore = create<CommitState>((set, get) => ({
  diff: "",
  style: "conventional",
  isLoading: false,
  error: null,
  result: null,
  refinementInstruction: "",

  setDiff: (diff) => set({ diff, error: null }),
  setStyle: (style) => set({ style }),
  setRefinementInstruction: (instruction) => set({ refinementInstruction: instruction }),
  
  generateCommit: async () => {
    const { diff, style } = get()
    if (!diff.trim()) {
      set({ error: "Please provide a git diff first." })
      return
    }

    set({ isLoading: true, error: null, result: null, refinementInstruction: "" })

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diff, style }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate commit")
      }

      const data = await response.json()
      
      set({ 
        result: {
          commitMessage: data.commit,
          prTitle: data.pr_title,
          prDescription: data.pr_description,
        }
      })
    } catch (err: any) {
      set({ error: err.message || "Something went wrong. Please try again." })
    } finally {
      set({ isLoading: false })
    }
  },

  refineCommit: async () => {
    const { diff, style, refinementInstruction, result } = get()
    if (!refinementInstruction.trim()) return

    set({ isLoading: true, error: null })

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          diff, 
          style, 
          instruction: refinementInstruction,
          previousResponse: result ? {
            commit: result.commitMessage,
            pr_title: result.prTitle,
            pr_description: result.prDescription,
          } : undefined
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to refine commit")
      }

      const data = await response.json()
      
      set({ 
        result: {
          commitMessage: data.commit,
          prTitle: data.pr_title,
          prDescription: data.pr_description,
        },
        refinementInstruction: "" // Clear after success
      })
    } catch (err: any) {
      set({ error: err.message || "Refinement failed. Please try again." })
    } finally {
      set({ isLoading: false })
    }
  },

  reset: () => set({ result: null, error: null, refinementInstruction: "" }),
}))
