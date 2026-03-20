#!/usr/bin/env node

const { Command } = require('commander');
const { execSync } = require('child_process');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load .env from the project root
const projectRoot = path.join(__dirname, '..');
dotenv.config({ path: path.join(projectRoot, '.env') });

const program = new Command();

program
  .name('commit-craft')
  .description('AI-powered commit message generator for CommitCraft AI')
  .version('1.0.0')
  .option('-s, --style <style>', 'commit style (conventional, professional, casual)', 'conventional')
  .option('-c, --copy', 'copy the commit message to clipboard', false)
  .action(async (options) => {
    try {
      // 1. Get staged diff
      let diff = '';
      try {
        diff = execSync('git diff --cached', { encoding: 'utf-8' });
      } catch (e) {
        console.error('Error: Failed to run git diff. Are you in a git repository?');
        process.exit(1);
      }

      if (!diff.trim()) {
        console.log('No staged changes detected. Use "git add" to stage files first.');
        process.exit(0);
      }

      // 2. Initialize AI
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error('Error: GEMINI_API_KEY not found in .env');
        process.exit(1);
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest",
        generationConfig: { responseMimeType: "application/json" }
      });

      const styleGuides = {
        conventional: "Follow Conventional Commits (type(scope): description).",
        professional: "Use a neutral, professional, and clear tone.",
        casual: "Be friendly, energetic, and use relevant emojis.",
      };

      const prompt = `
        System Instruction:
        You are an elite Senior Software Engineer. Analyze the git diff and generate a commit message.

        Style: ${styleGuides[options.style] || styleGuides.conventional}

        Output Format (STRICT JSON ONLY):
        {
          "commit": "A single line commit message"
        }

        Git Diff:
        ---
        ${diff}
        ---
        Return ONLY the JSON object.
      `;

      console.log('✨ Analyzing staged changes...');
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const data = JSON.parse(response.text().trim());

      const commitMsg = data.commit;
      
      console.log('\n🚀 Recommended Commit Message:');
      console.log(`\x1b[32m%s\x1b[0m`, commitMsg); // Green text

      if (options.copy) {
        try {
          // Cross-platform copy (Windows: clip, MacOS: pbcopy, Linux: xclip)
          const proc = process.platform === 'win32' ? 'clip' : (process.platform === 'darwin' ? 'pbcopy' : 'xclip -selection clipboard');
          const child = require('child_process').spawn(proc);
          child.stdin.write(commitMsg);
          child.stdin.end();
          console.log('\n📋 Copied to clipboard!');
        } catch (e) {
          console.error('\n⚠️ Failed to copy to clipboard.');
        }
      }

    } catch (error) {
      console.error('\n❌ Error:', error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
