/**
 * ChatBubble - Gideon Chat UI Component
 * Pixel-perfect ChatGPT-style message bubble with Gideon branding
 */

import React from 'react';
import { Wand2, Zap } from 'lucide-react';
import { ChatBubbleProps } from './types';

export default function ChatBubble({ message, showAvatar = true }: ChatBubbleProps) {
  const { role, content, imageUrl, model } = message;
  const isUser = role === 'user';

  return (
    <div className={`flex w-full animate-[fadeIn_0.3s_ease-in] ${isUser ? 'justify-end' : 'justify-start'}`}>
      {isUser ? (
        // User Message (Gideon purple bubble)
        <div className="max-w-[78%] min-w-0">
          <div className="px-4 py-3 rounded-[22px] rounded-br-md bg-purple-600 text-white shadow-sm text-[15px] leading-[22px] break-words">
            {imageUrl ? (
              <div className="space-y-2">
                <img
                  src={imageUrl}
                  alt={content}
                  className="w-full rounded-lg shadow-lg max-w-full"
                />
                <div className="text-sm text-white/90 leading-relaxed break-words">
                  {content}
                </div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap break-words">
                {content}
              </div>
            )}
          </div>
        </div>
      ) : (
        // AI Message (with Gideon avatar)
        <div className="flex gap-2 max-w-[78%] min-w-0">
          {/* Gideon Avatar */}
          {showAvatar && (
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              G
            </div>
          )}

          {/* Message Content */}
          <div className="flex-1 min-w-0">
            <div className="px-4 py-3 rounded-[22px] rounded-bl-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm text-[15px] leading-[22px] break-words">
              {imageUrl ? (
                <div className="space-y-2">
                  <img
                    src={imageUrl}
                    alt={content}
                    className="w-full rounded-lg shadow-lg max-w-full"
                  />
                  <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed break-words">
                    {content}
                  </div>
                </div>
              ) : (
                <div className="whitespace-pre-wrap break-words">
                  {content}
                </div>
              )}
            </div>

            {/* Model Badge */}
            {model && (
              <div className="mt-1 ml-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                {imageUrl ? <Wand2 className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                {model}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
