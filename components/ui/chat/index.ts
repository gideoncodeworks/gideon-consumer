/**
 * Gideon Chat UI Components
 * Export all chat components for easy importing
 *
 * Usage:
 * import { ChatContainer, ChatBubble, ChatViewport, ChatComposer } from '@/components/ui/chat';
 */

export { default as ChatContainer } from './ChatContainer';
export { default as ChatBubble } from './ChatBubble';
export { default as ChatViewport } from './ChatViewport';
export { default as ChatComposer } from './ChatComposer';

export type {
  ChatMessage,
  Conversation,
  ChatBubbleProps,
  ChatViewportProps,
  ChatComposerProps,
  ChatContainerProps,
} from './types';
