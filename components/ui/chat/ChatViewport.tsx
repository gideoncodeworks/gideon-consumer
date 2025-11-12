/**
 * ChatViewport - Gideon Chat UI Component
 * Scrollable message viewport with auto-scroll
 */

'use client';

import { useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import { ChatViewportProps } from './types';

export default function ChatViewport({
  messages,
  isStreaming = false,
  showAvatar = true
}: ChatViewportProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
      <div className="w-full px-3 py-4 space-y-3 box-border">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            showAvatar={showAvatar}
          />
        ))}

        {/* Typing Indicator */}
        {isStreaming && (
          <div className="flex w-full justify-start">
            <div className="flex gap-2 max-w-[78%]">
              {/* Gideon Avatar */}
              {showAvatar && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  G
                </div>
              )}

              {/* Typing Indicator Bubble */}
              <div className="px-4 py-3 rounded-[22px] rounded-bl-md bg-gray-100 dark:bg-gray-800 shadow-sm flex items-center">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
