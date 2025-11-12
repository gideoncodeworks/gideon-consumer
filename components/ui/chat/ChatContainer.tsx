/**
 * ChatContainer - Gideon Chat UI Component
 * Complete chat interface with viewport and composer
 *
 * Usage:
 * import { ChatContainer } from '@/components/ui/chat';
 * <ChatContainer onSendMessage={handleSend} />
 */

'use client';

import { useState } from 'react';
import ChatViewport from './ChatViewport';
import ChatComposer from './ChatComposer';
import { ChatContainerProps, ChatMessage } from './types';

export default function ChatContainer({
  initialMessages = [],
  onSendMessage,
  showImageGeneration = true,
  showModelSelector = false,
}: ChatContainerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSend = async (text: string, imageMode = false) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
      type: imageMode ? 'image' : 'text',
    };

    setMessages((prev) => [...prev, userMessage]);

    // Call parent handler if provided
    if (onSendMessage) {
      if (imageMode) {
        setIsGenerating(true);
      } else {
        setIsStreaming(true);
      }

      try {
        await onSendMessage(text, imageMode);
      } catch (error) {
        console.error('Send message error:', error);
      } finally {
        setIsStreaming(false);
        setIsGenerating(false);
      }
    } else {
      // Default demo behavior
      setTimeout(() => {
        const reply: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: imageMode
            ? 'Image generation would happen here...'
            : 'This is a demo reply. Connect this to your AI backend.',
          timestamp: new Date(),
          model: 'Demo Mode',
        };

        setMessages((prev) => [...prev, reply]);
      }, 400);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-full bg-white dark:bg-gray-900 overflow-hidden">
      <ChatViewport
        messages={messages}
        isStreaming={isStreaming}
        showAvatar={true}
      />
      <ChatComposer
        onSend={handleSend}
        isStreaming={isStreaming}
        isGenerating={isGenerating}
        showImageButton={showImageGeneration}
      />
    </div>
  );
}
