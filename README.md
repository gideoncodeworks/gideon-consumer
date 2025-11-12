# Gideon Consumer

Multi-model AI chat for everyone - ChatGPT/Claude hybrid interface

## 🚀 Running Locally

```bash
npm run dev
```

Opens on http://localhost:3001

## 📁 Project Structure

```
gideon-consumer/
├── app/
│   ├── page.tsx          # Main chat interface (ChatGPT/Claude hybrid)
│   ├── layout.tsx        # Root layout (fullscreen, no navigation)
│   └── globals.css       # Tailwind + custom styles
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## ✅ What's Built

- **Clean Chat UI** - ChatGPT/Claude-style interface
- **Conversation Sidebar** - List of past chats
- **Model Picker** - Auto-routing or manual selection
- **Message Bubbles** - User (purple) + Assistant (gray)
- **Fullscreen Layout** - No platform navigation bleeding through
- **Dark Mode Ready** - Styles for light/dark themes

## 🔨 What Needs to Be Built

### Critical (Must Have)
1. **Real AI Integration** - Connect to Claude, GPT, Gemini APIs
2. **Conversation Persistence** - Save chats to Firebase/Postgres
3. **User Authentication** - Sign up/login (Firebase Auth or Clerk)
4. **Stripe Billing** - Subscription tiers
5. **Usage Tracking** - Message limits per tier

### Important (Launch Features)
6. **Multi-Model Routing** - Smart model selection
7. **File Uploads** - PDF, docs, images
8. **Web Search** - Real-time search integration
9. **Error Handling** - Graceful failures
10. **Rate Limiting** - Prevent abuse

### Nice to Have (Post-Launch)
11. **Voice Input** - Whisper API
12. **Image Generation** - DALL-E
13. **API Access** - For Pro tier
14. **Team Features** - For Business tier

## 🎯 Pricing Tiers

- **Free:** $0 (10 msgs/day, Gemini Flash)
- **Starter:** $19/mo (100 msgs/day, GPT-4 + Claude)
- **Pro:** $49/mo (500 msgs/day, all models, API)
- **Business:** $149/mo (Unlimited, teams, white-label)
- **Unlimited:** $299/mo (Everything, priority)

## 🏗️ Architecture

**This Project (gideon-consumer)**
- Deploy to: `usegideon.com`
- Target: Everyone (consumers)
- Clean, minimal ChatGPT clone

**Sister Project (gideon-framework)**
- Deploy to: `platform.usegideon.com`
- Target: SEO agencies (B2B)
- Full dashboard with SEO tools

**Shared Infrastructure:**
- Same Firebase/Postgres database
- Same Stripe billing
- Same user authentication
- Different UX and features

## 🔧 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Deployment:** Vercel (planned)
- **Database:** Firebase/Postgres (todo)
- **Auth:** Firebase Auth or Clerk (todo)
- **Payments:** Stripe (todo)

## 📝 Next Steps

1. Set up Firebase/Postgres database
2. Add user authentication
3. Connect to AI APIs (Claude, GPT, Gemini)
4. Implement streaming responses
5. Add conversation persistence
6. Stripe integration for billing
7. Deploy to Vercel
8. Point usegideon.com to deployment

## 🎨 Design Philosophy

- **Simple** - No clutter, just chat
- **Fast** - Instant load, streaming responses
- **Beautiful** - ChatGPT-level polish
- **Familiar** - Users know how to use it
- **Powerful** - Multi-model intelligence under the hood

---

**Status:** UI Complete ✅ | Backend TODO 🔨
**Last Updated:** 2025-11-11
