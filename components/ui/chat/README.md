# Gideon Chat UI Components

**Production-ready, reusable chat interface components** with pixel-perfect ChatGPT-style design and Gideon branding.

## 🎨 Features

- ✅ **Pixel-perfect ChatGPT layout** - 78% max-width bubbles, 22px radius, one-corner-cut design
- ✅ **Gideon branding** - Purple gradient colors, cyan-purple avatar
- ✅ **Image generation support** - Built-in image mode toggle
- ✅ **Responsive design** - Mobile-first with iOS safe areas
- ✅ **Dark mode ready** - Full dark mode support
- ✅ **Typing indicators** - Animated typing dots
- ✅ **Auto-scroll** - Smooth scroll to latest message
- ✅ **Backdrop blur** - Frosted glass composer bar
- ✅ **Accessible** - ARIA labels and keyboard navigation

## 📦 Installation

Already included in this project. Just import and use!

```typescript
import { ChatContainer } from '@/components/ui/chat';
```

## 🚀 Quick Start

### Simple Chat (Standalone)

```typescript
import { ChatContainer } from '@/components/ui/chat';

export default function ChatPage() {
  return <ChatContainer />;
}
```

### With Custom Handler

```typescript
import { ChatContainer } from '@/components/ui/chat';

export default function ChatPage() {
  const handleSend = async (message: string, imageMode?: boolean) => {
    if (imageMode) {
      // Call image generation API
      const response = await fetch('/api/image', {
        method: 'POST',
        body: JSON.stringify({ prompt: message }),
      });
      // Handle response...
    } else {
      // Call chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
      // Handle response...
    }
  };

  return (
    <ChatContainer
      onSendMessage={handleSend}
      showImageGeneration={true}
    />
  );
}
```

### With Initial Messages

```typescript
import { ChatContainer, ChatMessage } from '@/components/ui/chat';

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hello! How can I help you today?',
    timestamp: new Date(),
    model: 'GPT-4',
  },
];

export default function ChatPage() {
  return <ChatContainer initialMessages={initialMessages} />;
}
```

## 🧩 Individual Components

### ChatBubble

Single message bubble component.

```typescript
import { ChatBubble } from '@/components/ui/chat';

<ChatBubble
  message={{
    id: '1',
    role: 'user',
    content: 'Hello!',
    timestamp: new Date(),
  }}
  showAvatar={true}
/>
```

### ChatViewport

Scrollable message area with auto-scroll.

```typescript
import { ChatViewport } from '@/components/ui/chat';

<ChatViewport
  messages={messages}
  isStreaming={false}
  showAvatar={true}
/>
```

### ChatComposer

Bottom input bar with image generation toggle.

```typescript
import { ChatComposer } from '@/components/ui/chat';

<ChatComposer
  onSend={(text, imageMode) => console.log(text, imageMode)}
  isStreaming={false}
  isGenerating={false}
  showImageButton={true}
  placeholder="Message…"
/>
```

## 📋 Props Reference

### ChatContainer

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialMessages` | `ChatMessage[]` | `[]` | Initial messages to display |
| `onSendMessage` | `(message: string, imageMode?: boolean) => Promise<void>` | - | Handler for sending messages |
| `showImageGeneration` | `boolean` | `true` | Show/hide image generation button |
| `showModelSelector` | `boolean` | `false` | Show/hide model selector (future) |

### ChatMessage Type

```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;         // Optional: Display model name
  imageUrl?: string;      // Optional: For image messages
  type?: 'text' | 'image'; // Optional: Message type
}
```

## 🎨 Customization

### Change Gideon Avatar

Edit `ChatBubble.tsx` line 32:

```typescript
<div className="...">
  G  {/* Change this to your brand initial */}
</div>
```

### Change Colors

Purple branding is in these classes:
- User bubble: `bg-purple-600`
- Send button: `bg-purple-600`
- Avatar gradient: `from-cyan-400 to-purple-500`

## 📁 File Structure

```
components/ui/chat/
├── ChatContainer.tsx    # Main container component
├── ChatViewport.tsx     # Scrollable message area
├── ChatBubble.tsx       # Individual message bubble
├── ChatComposer.tsx     # Bottom input bar
├── types.ts             # TypeScript types
├── index.ts             # Exports
└── README.md            # This file
```

## 🔄 Reusability

These components are designed to be reused across:
- **gideoncode.com** - Main website chat
- **usegideon.com** - Consumer app (current)
- **admin.gideoncode.com** - Admin dashboard
- **Future Gideon products**

Just copy the `/components/ui/chat/` folder to any Next.js project!

## 🚀 Deploy to Other Projects

```bash
# Copy to another Next.js project
cp -r components/ui/chat /path/to/other-project/components/ui/
```

Make sure the destination project has:
- ✅ Next.js 14+ (App Router)
- ✅ Tailwind CSS
- ✅ `lucide-react` icons

## 📄 License

Part of the Gideon Code ecosystem.
© 2025 Gideon Code. All rights reserved.
