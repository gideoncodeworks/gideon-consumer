import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'edge';

// Initialize AI clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Gideon's personality system prompt
const GIDEON_SYSTEM_PROMPT = `# You are Gideon

You are Gideon, a strategic AI assistant with a direct, helpful personality. You're not generic - you're like a smart colleague who knows their stuff and shoots straight.

## Your Core Traits:
- **Direct and honest** - No corporate speak. Say "stuck" not "experiencing forward momentum challenges"
- **Data-driven but empathetic** - Love numbers but remember conversations are about people
- **Proactive but respectful** - Offer suggestions when helpful, but don't overstep
- **Strategic thinker** - See patterns, think 2-3 moves ahead
- **Occasionally playful** - Use emoji strategically (🎯🔥⚡️🎉) but not excessively

## Your Voice:
- Short, punchy sentences for key insights
- Bullet points for lists (people scan, don't read)
- Bold for emphasis, not CAPS
- Like talking to a sharp colleague, not a robot

## Example of Your Style:
❌ BAD: "Based on analysis of your query, I have identified several potential solutions..."
✅ GOOD: "Here are 3 ways to solve this: [specific solutions]"

## Your Mission:
Help users accomplish their goals efficiently. Be helpful, be clear, be real.

## Important:
- Your name is "Gideon" - not ChatGPT, Claude, or Gemini
- You're powered by multiple AI models (Claude, GPT-4, Gemini) that automatically route based on the question
- You can do both text chat and image generation
- Be concise but thorough - respect people's time`;


// Auto-routing logic - determines best model based on query
function selectBestModel(query: string): string {
  const lowerQuery = query.toLowerCase();

  // Code-related queries -> Claude
  if (lowerQuery.match(/code|program|function|debug|script|api|typescript|python|javascript/)) {
    return 'claude';
  }

  // Creative writing -> GPT-4
  if (lowerQuery.match(/write|story|poem|creative|marketing|blog/)) {
    return 'gpt4';
  }

  // Quick factual queries -> Gemini (fast + cheap)
  if (lowerQuery.match(/what is|who is|define|explain/)) {
    return 'gemini';
  }

  // Default to GPT-4o (best general purpose)
  return 'gpt4';
}

export async function POST(req: Request) {
  try {
    const { messages, model: requestedModel } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const model = requestedModel === 'auto'
      ? selectBestModel(lastMessage.content)
      : requestedModel.toLowerCase();

    console.log('Using model:', model);
    console.log('API Keys present:', {
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      openai: !!process.env.OPENAI_API_KEY,
      google: !!process.env.GOOGLE_AI_API_KEY,
    });

    // Route to appropriate AI model
    if (model === 'claude' || model.includes('claude')) {
      return await handleClaude(messages);
    } else if (model === 'gpt4' || model.includes('gpt')) {
      return await handleOpenAI(messages);
    } else if (model === 'gemini' || model.includes('gemini')) {
      return await handleGemini(messages);
    } else {
      // Default to GPT-4o
      return await handleOpenAI(messages);
    }
  } catch (error: any) {
    console.error('Chat API error:', error);
    console.error('Error details:', error.message, error.stack);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Claude handler with streaming
async function handleClaude(messages: Message[]) {
  const stream = await anthropic.messages.stream({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    system: GIDEON_SYSTEM_PROMPT,
    messages: messages
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
  });

  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Model-Used': 'Claude Sonnet 4',
    },
  });
}

// OpenAI handler with streaming
async function handleOpenAI(messages: Message[]) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: GIDEON_SYSTEM_PROMPT },
      ...messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
    ],
    stream: true,
  });

  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Model-Used': 'GPT-4o',
    },
  });
}

// Gemini handler with streaming
async function handleGemini(messages: Message[]) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-pro',
    systemInstruction: GIDEON_SYSTEM_PROMPT,
  });

  // Convert messages to Gemini format
  const history = messages
    .slice(0, -1)
    .filter(msg => msg.role !== 'system')
    .map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

  const lastMessage = messages[messages.length - 1].content;

  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(lastMessage);

  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Model-Used': 'Gemini Pro',
    },
  });
}
