/**
 * CommitCraft AI: VS Code Extension Core Logic
 * 
 * This file contains the cross-platform logic that can be integrated
 * into a standard VS Code extension project.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

interface ExtensionContext {
  apiKey: string;
  diff: string;
  style: "conventional" | "professional" | "casual";
}

export async function generateVSCodeCommit(ctx: ExtensionContext) {
  const { apiKey, diff, style } = ctx;

  if (!apiKey) {
    throw new Error("CommitCraft AI: Please set your Gemini API Key in the settings.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-flash-latest",
    generationConfig: { responseMimeType: "application/json" }
  });

  const styleGuides = {
    conventional: "Follow Conventional Commits (type(scope): description).",
    professional: "Use a neutral, professional tone.",
    casual: "Be friendly and use emojis.",
  };

  const prompt = `
    System Instruction:
    You are an AI assistant integrated into VS Code. 
    Analyze the provided git diff and generate a commit message.

    Style: ${styleGuides[style]}

    Output Format (JSON):
    {
      "commit": "The generated commit message"
    }

    Diff:
    ${diff}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const data = JSON.parse(response.text());
    return data.commit;
  } catch (error) {
    console.error("VSCode Generation Error:", error);
    throw error;
  }
}

/**
 * INSTALLATION STEPS FOR USER:
 * 1. Open VS Code and press Ctrl+Shift+X (Extensions).
 * 2. Search for "Git Commit" extensions or use this logic to build your own.
 * 3. We can provide a pre-packaged .vsix file in the future!
 */
