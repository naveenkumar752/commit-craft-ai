import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface AIResult {
  commitMessage: string
  prTitle: string
  prDescription: string
}

interface CommitHistoryItem extends AIResult {
  timestamp: number
  style: string
}

interface CommitState {
  diff: string
  style: string
  isLoading: boolean
  error: string | null
  result: AIResult | null
  refinementInstruction: string
  history: CommitHistoryItem[]
  
  setDiff: (diff: string) => void
  setStyle: (style: string) => void
  setRefinementInstruction: (instruction: string) => void
  generateCommit: () => Promise<void>
  refineCommit: () => Promise<void>
  addToHistory: (result: AIResult, style: string) => void
  reset: () => void
  clearHistory: () => void
}

export const useCommitStore = create<CommitState>()(
  persist(
    (set, get) => ({
      diff: "",
      style: "conventional",
      isLoading: false,
      error: null,
      result: null,
      refinementInstruction: "",
      history: [],

      setDiff: (diff) => set({ diff, error: null }),
      setStyle: (style) => set({ style }),
      setRefinementInstruction: (instruction) => set({ refinementInstruction: instruction }),
      
      addToHistory: (result, style) => {
        const newEntry: CommitHistoryItem = {
          ...result,
          timestamp: Date.now(),
          style,
        }
        set((state) => ({
          history: [newEntry, ...state.history].slice(0, 50),
        }))
      },

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
          
          const newResult = {
            commitMessage: data.commit,
            prTitle: data.pr_title,
            prDescription: data.pr_description,
          }

          set({ result: newResult })
          get().addToHistory(newResult, style)
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
          
          const newResult = {
            commitMessage: data.commit,
            prTitle: data.pr_title,
            prDescription: data.pr_description,
          }

          set({ result: newResult, refinementInstruction: "" })
          get().addToHistory(newResult, style)
        } catch (err: any) {
          set({ error: err.message || "Refinement failed. Please try again." })
        } finally {
          set({ isLoading: false })
        }
      },

      reset: () => set({ result: null, error: null, refinementInstruction: "" }),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "commit-craft-history",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ history: state.history }),
    }
  )
)
