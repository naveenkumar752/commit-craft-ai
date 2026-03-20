const { GoogleGenerativeAI } = require('@google/generative-ai');
const { execSync } = require('child_process');

async function run() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is required.");

    // 1. Get the diff of the PR
    // In GitHub Actions, we can compare the base and head
    const base = process.env.GITHUB_BASE_REF;
    const head = process.env.GITHUB_HEAD_REF;
    
    console.log(`Analyzing diff between ${base} and ${head}...`);
    
    // Fetch specifically to ensure we have the branches
    execSync(`git fetch origin ${base} ${head}`);
    const diff = execSync(`git diff origin/${base}...origin/${head}`, { encoding: 'utf-8' });

    if (!diff.trim()) {
      console.log("No changes detected.");
      return;
    }

    // 2. AI Analysis
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      System Instruction:
      You are an elite Senior Software Engineer. Analyze the git diff and generate PR metadata.

      Output Format (STRICT JSON ONLY):
      {
        "title": "Concise PR title",
        "description": "Detailed markdown description with bullet points"
      }

      Git Diff:
      ---
      ${diff}
      ---
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const data = JSON.parse(response.text().trim());

    // 3. Output for the GitHub Action to use
    // We'll use the GitHub CLI (gh) to update the PR if available, 
    // or just output it to a file that the next step can read.
    console.log(`::set-output name=pr_title::${data.title}`);
    
    // Multiline output for description
    const fs = require('fs');
    fs.writeFileSync('pr_description.md', data.description);
    
    console.log("Successfully generated PR metadata.");

  } catch (error) {
    console.error("Action Error:", error.message);
    process.exit(1);
  }
}

run();
