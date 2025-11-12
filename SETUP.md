# Gideon Consumer - Setup Guide

## ✅ What's Now Working

- **Real AI Integration** - Claude, GPT-4o, and Gemini with streaming
- **Auto-routing** - Smart model selection based on query type
- **Streaming responses** - Character-by-character like ChatGPT
- **Error handling** - Graceful failures with user-friendly messages

---

## 🔑 Step 1: Get API Keys

### Anthropic (Claude)
1. Go to https://console.anthropic.com/
2. Sign up / Log in
3. Go to API Keys
4. Create new key
5. Copy the key (starts with `sk-ant-`)

### OpenAI (GPT-4)
1. Go to https://platform.openai.com/api-keys
2. Sign up / Log in
3. Create new secret key
4. Copy the key (starts with `sk-`)

### Google (Gemini)
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with Google
3. Create API key
4. Copy the key

---

## 🛠️ Step 2: Configure Environment

1. **Copy the example file:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Add your API keys to `.env.local`:**
   ```bash
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   OPENAI_API_KEY=sk-your-key-here
   GOOGLE_AI_API_KEY=your-google-key-here
   ```

3. **Save the file**

---

## 🚀 Step 3: Run the App

```bash
npm run dev
```

Open http://localhost:3001

---

## 🧪 Test It Out

### Test Auto-Routing

Try these prompts to see auto-routing in action:

**Code (→ Claude):**
- "Write a Python function to calculate fibonacci"
- "Debug this TypeScript code"

**Creative (→ GPT-4):**
- "Write a marketing email"
- "Create a blog post about AI"

**Quick Facts (→ Gemini):**
- "What is quantum computing?"
- "Define machine learning"

### Manual Model Selection

Click the model picker in the header to manually choose:
- Auto (Best model)
- Claude Opus
- GPT-4o
- Gemini Pro
- o1-preview

---

## 💡 How Auto-Routing Works

The system analyzes your query and routes to the best model:

- **Code/Programming** → Claude (best for code generation & analysis)
- **Creative Writing** → GPT-4o (best for creative tasks)
- **Quick Facts** → Gemini (fastest + cheapest)
- **Default** → GPT-4o (best general purpose)

See `/app/api/chat/route.ts` for routing logic.

---

## 🔧 Troubleshooting

### "Internal server error"
- Check API keys are correct in `.env.local`
- Restart dev server: `npm run dev`
- Check browser console for errors

### "API key invalid"
- Verify keys are correct (no extra spaces)
- Make sure keys start with correct prefix:
  - Claude: `sk-ant-`
  - OpenAI: `sk-`
  - Google: varies

### Streaming not working
- Clear browser cache
- Check Network tab in DevTools
- Verify API route is returning streaming response

---

## 📝 Next Steps

Now that AI is working, next up:

1. ✅ AI Integration (DONE)
2. 🔜 Firebase Auth (users can sign up/login)
3. 🔜 Firestore (save conversations)
4. 🔜 Stripe (billing & subscriptions)
5. 🔜 Usage limits (free/paid tiers)

---

## 🎯 Pricing Tiers (Future)

Once we add Firebase + Stripe:

- **Free:** $0 (10 msgs/day, Gemini only)
- **Starter:** $19/mo (100 msgs/day, GPT-4 + Claude)
- **Pro:** $49/mo (500 msgs/day, all models, API)
- **Business:** $149/mo (Unlimited, teams)
- **Unlimited:** $299/mo (Everything, priority support)

---

## 🐛 Known Issues

- No conversation persistence yet (refresh = lost chats)
- No user authentication (anyone can use)
- No usage limits (unlimited API calls)
- No billing (it's free for now!)

These will be added with Firebase + Stripe integration.

---

**Status:** Core AI Working ✅ | Auth & Billing TODO 🔨
**Last Updated:** 2025-11-12
