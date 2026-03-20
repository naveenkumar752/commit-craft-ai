# 🚀 CommitCraft AI

CommitCraft AI is a premium, AI-powered toolkit designed to bridge the gap between messy code changes and professional project history. Transform your `git diff` into perfectly formatted, conventional commit messages and detailed PR descriptions in seconds.

![CommitCraft AI Preview](public/preview.png) *(Placeholder for preview image)*

## ✨ Key Features

- **🧠 Multi-Style Generation**: Choose between **Conventional**, **Professional**, or **Casual** tones.
- **💬 Interactive Refinement**: "Chat with your Diff" to tweak generated messages until they're perfect.
- **📜 Persistent History**: Automatically saves your generations locally so you never lose a great commit log.
- **🎨 Premium UI**: A glassmorphic, high-performance interface built with Next.js 15, Tailwind CSS, and Framer Motion.
- **🌈 Rich Diff Viewer**: Syntax-highlighted visualization of your code changes before generation.

## 🔌 Workflow Integrations

CommitCraft AI isn't just a web app; it lives where you code.

### ⌨️ Global CLI Tool
Generate commits directly from your terminal.
1. Run `npm link` in the project root.
2. Use `commit-craft --copy` in any git repository to generate and copy a message to your clipboard.

### 🤖 GitHub Action
Automate your PR documentation. Our built-in workflow automatically generates and updates PR descriptions based on the diff between branches.

### 🔌 VS Code Integration
Ready-to-use logic in `lib/vscode-logic.ts` for building your own workspace extension. Integrate AI-powered commits directly into your SCM view.

## 🛡️ Security & Rate Limiting

To ensure fair usage and manage API costs, we've implemented:
- **Upstash Redis Integration**: Professional-grade IP-based rate limiting.
- **Limit**: **3 generations per hour** per IP address.
- **Sliding Window Policy**: Precise tracking to prevent burst abuse.

## 🛠️ Setup & Configuration

### Prerequisites
- Node.js 18+
- [Upstash Redis](https://upstash.com/) account for rate limiting.
- [Google Gemini API Key](https://aistudio.google.com/).

### Environment Variables
Create a `.env` file in the root:
```env
GEMINI_API_KEY="your_api_key_here"
UPSTASH_REDIS_REST_URL="your_upstash_url"
UPSTASH_REDIS_REST_TOKEN="your_upstash_token"
```

### Installation
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Link CLI tool globally
npm link
```

## 📜 License
MIT © [Naveen Kumar](https://github.com/naveenkumar752)
