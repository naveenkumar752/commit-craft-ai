import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"
import { z } from "zod"

// Input validation schema
const generateSchema = z.object({
  diff: z.string().min(1, "Diff is required").max(50000, "Diff is too large"),
  style: z.enum(["conventional", "professional", "casual"]).default("conventional"),
  instruction: z.string().optional(),
  previousResponse: z.object({
    commit: z.string(),
    pr_title: z.string(),
    pr_description: z.string(),
  }).optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { diff, style, instruction, previousResponse } = generateSchema.parse(body)

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      generationConfig: { responseMimeType: "application/json" }
    })

    const styleGuides = {
      conventional: "Follow Conventional Commits (type(scope): description). Use standard types like feat, fix, docs, style, refactor, test, chore.",
      professional: "Use a neutral, professional, and clear tone. Focus on the 'what' and 'why' of the changes using active voice.",
      casual: "Be friendly, energetic, and use relevant emojis. You can be a bit witty or funny, but keep the information accurate.",
    }

    let prompt = `
      System Instruction:
      You are an elite Senior Software Engineer and Technical Writer. 
      Your task is to analyze a git diff and generate high-quality commit metadata.

      Style Requirement: ${styleGuides[style]}

      Output Format (STRICT JSON ONLY):
      {
        "commit": "A single line commit message",
        "pr_title": "A concise title for a Pull Request",
        "pr_description": "A detailed, bulleted description of the changes"
      }

      Git Diff to Analyze:
      ---
      ${diff}
      ---
    `

    if (instruction && previousResponse) {
      prompt += `
      REFINEMENT REQUEST:
      The user wants to refine the previous generation.
      Previous Generation: ${JSON.stringify(previousResponse)}
      User Instruction: "${instruction}"

      Please adjust the previous generation based strictly on this instruction while maintaining the context of the diff.
      `
    }

    prompt += `\nReturn ONLY the JSON object. Do not include markdown code blocks or any other text.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text().trim()
    
    let data
    try {
      data = JSON.parse(text)
    } catch (e) {
      console.error("AI returned invalid JSON:", text)
      return NextResponse.json(
        { 
          error: "Failed to parse AI response. Please try again.",
          details: e instanceof Error ? e.message : String(e)
        },
        { status: 500 }
      )
    }

    if (!data.commit || !data.pr_title || !data.pr_description) {
      return NextResponse.json(
        { error: "AI response was incomplete. Missing required fields." },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    console.error("Gemini API Error:", error)
    return NextResponse.json(
      { 
        error: "Failed to generate content. Please check your API quota or try again later.",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
