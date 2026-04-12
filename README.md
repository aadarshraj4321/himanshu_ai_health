# 🏥 AI Healthcare Text Analyzer

> ⚠️ **EDUCATIONAL PURPOSES ONLY** — This app is a demo project. It is **NOT** a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.

A beginner-friendly full-stack AI web app that analyzes health-related text using the [Hugging Face Inference API](https://huggingface.co/inference-api). Paste symptoms, medical notes, or health articles — and get an instant AI-generated summary plus extracted health keywords.

---

## ✨ Features

- 🤖 **AI Summarization** — Uses `facebook/bart-large-cnn` via Hugging Face Inference API
- 🏷️ **Health Keyword Extraction** — Detects medical terms from your text (no extra model needed)
- 📋 **Analysis History** — Last 10 analyses saved in browser `localStorage`
- ⚡ **Loading States** — Spinner with helpful cold-start message
- 🔐 **Secure API Key** — HF key stays on the server, never exposed to the browser
- 📱 **Responsive Design** — Works on mobile, tablet, and desktop
- 🎨 **Modern Dark UI** — Built with Tailwind CSS

---

## 🛠 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Framework  | Next.js 14 (App Router)             |
| Language   | TypeScript                          |
| Styling    | Tailwind CSS                        |
| AI Model   | Hugging Face `facebook/bart-large-cnn` |
| Deployment | Vercel                              |
| Storage    | Browser `localStorage` (no database) |

---

## 📁 Folder Structure

```
ai-healthcare-analyzer/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts        ← POST /api/analyze (server-side HF call)
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── AnalyzerForm.tsx    ← Text input + submit
│   │   ├── ResultCard.tsx      ← Displays summary + keywords + disclaimer
│   │   ├── HistorySection.tsx  ← Past analyses list
│   │   └── Footer.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                ← Main page (localStorage logic lives here)
├── lib/
│   ├── keywords.ts             ← Health keyword extractor utility
│   └── types.ts                ← Shared TypeScript interfaces
├── public/
├── .env.local.example          ← Copy this to .env.local
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔑 Environment Variables

| Variable    | Description                          | Required |
|-------------|--------------------------------------|----------|
| `HF_API_KEY` | Your Hugging Face API token         | ✅ Yes   |

### How to get your free Hugging Face API key:
1. Go to [https://huggingface.co/join](https://huggingface.co/join) and create a free account
2. Visit [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
3. Click **"New token"** → give it a name → select **"Read"** role → click **Create**
4. Copy the token (starts with `hf_...`)

---

## 💻 Local Setup

### Prerequisites
- Node.js 18+ installed ([download here](https://nodejs.org))
- A Hugging Face account (free)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/ai-healthcare-analyzer.git
cd ai-healthcare-analyzer

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Now open .env.local and paste your Hugging Face API key

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deploy on Vercel

### Option A — Deploy via Vercel CLI

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy (from inside the project folder)
vercel

# Follow the prompts:
# - Set up and deploy? → Yes
# - Which scope? → Your account
# - Link to existing project? → No
# - Project name? → ai-healthcare-analyzer (or any name)
# - Directory? → ./  (press Enter)
# - Override settings? → No

# 4. Add your environment variable
vercel env add HF_API_KEY
# Paste your HF API key when prompted
# Select: Production, Preview, Development

# 5. Redeploy with the env variable applied
vercel --prod
```

### Option B — Deploy via Vercel Dashboard (Easiest)

1. Push your code to GitHub (see section below)
2. Go to [https://vercel.com/new](https://vercel.com/new)
3. Click **"Import Git Repository"** and select your repo
4. In the **"Environment Variables"** section, add:
   - Key: `HF_API_KEY`
   - Value: your token (e.g. `hf_xxxxxxxxxxxxxx`)
5. Click **"Deploy"**
6. ✅ Your app will be live in ~60 seconds!

---

## 📤 Push to GitHub

```bash
# Inside your project folder:

# 1. Initialize git
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Initial commit: AI Healthcare Text Analyzer"

# 4. Create a new repo on GitHub at https://github.com/new
#    (do NOT initialize with README — your project already has one)

# 5. Link remote and push
git remote add origin https://github.com/YOUR_USERNAME/ai-healthcare-analyzer.git
git branch -M main
git push -u origin main
```

---

## 🧪 How It Works

1. **User** pastes health-related text into the textarea
2. **Frontend** sends a `POST` request to `/api/analyze`
3. **Server** (`app/api/analyze/route.ts`) calls Hugging Face Inference API securely (API key never touches the browser)
4. **Model** `facebook/bart-large-cnn` returns a summarized version of the text
5. **Server** also runs a local keyword extractor (`lib/keywords.ts`) to find health terms
6. **Frontend** displays the summary + keywords + a disclaimer card
7. **History** is saved automatically to `localStorage` (max 10 entries)

---

## ⚠️ Notes

- **Cold start**: The Hugging Face free tier may take 20–30 seconds to load the model on the first request. This is normal.
- **Rate limits**: The free HF Inference API has rate limits. If you hit them, wait a minute and retry.
- **No database**: All history is stored in the user's browser only. Clearing browser data will remove it.

---

## 📄 License

MIT — free to use, modify, and deploy.
