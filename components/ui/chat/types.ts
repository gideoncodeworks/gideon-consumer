/**
 * Gideon Chat UI Types
 * Reusable across all Gideon products
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
  imageUrl?: string;
  type?: 'text' | 'image';
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: Date;
}

export interface ChatBubbleProps {
  message: ChatMessage;
  showAvatar?: boolean;
}

export interface ChatViewportProps {
  messages: ChatMessage[];
  isStreaming?: boolean;
  showAvatar?: boolean;
}

export interface ChatComposerProps {
  onSend: (message: string, imageMode?: boolean) => void;
  isStreaming?: boolean;
  isGenerating?: boolean;
  placeholder?: string;
  showImageButton?: boolean;
}

export interface ChatContainerProps {
  initialMessages?: ChatMessage[];
  onSendMessage?: (message: string, imageMode?: boolean) => Promise<void>;
  showImageGeneration?: boolean;
  showModelSelector?: boolean;
}
