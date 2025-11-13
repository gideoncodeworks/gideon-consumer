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
  role: 'user' | 'assistant';
  content: string;
}

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
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

// Claude handler with streaming
async function handleClaude(messages: Message[]) {
  const stream = await anthropic.messages.stream({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    messages: messages.map(msg => ({
      role: msg.role,
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
    messages: messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    })),
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
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  // Convert messages to Gemini format
  const history = messages.slice(0, -1).map(msg => ({
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
