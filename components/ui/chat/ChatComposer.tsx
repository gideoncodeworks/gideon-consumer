/**
 * ChatComposer - Gideon Chat UI Component
 * Bottom input bar with image generation support
 */

'use client';

import { useState } from 'react';
import { Image as ImageIcon, Wand2 } from 'lucide-react';
import { ChatComposerProps } from './types';

export default function ChatComposer({
  onSend,
  isStreaming = false,
  isGenerating = false,
  placeholder = 'Message…',
  showImageButton = true,
}: ChatComposerProps) {
  const [input, setInput] = useState('');
  const [imageMode, setImageMode] = useState(false);

  const handleSend = () => {
    if (!input.trim() || isStreaming || isGenerating) return;
    onSend(input.trim(), imageMode);
    setInput('');
    setImageMode(false);
  };

  return (
    <div className="sticky bottom-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 pb-[env(safe-area-inset-bottom)]">
      <div className="px-3 py-3">
        <div className="flex items-end gap-2">
          {/* Image Generation Button */}
          {showImageButton && (
            <button
              onClick={() => setImageMode(!imageMode)}
              className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                imageMode
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title="Generate image with AI"
              aria-label="Toggle image generation mode"
            >
              {imageMode ? <Wand2 className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
            </button>
          )}

          {/* Text Input Pill */}
          <div className="flex-1 relative bg-gray-100 dark:bg-gray-800 rounded-[20px] px-4 py-3 shadow-sm">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={imageMode ? 'Describe the image...' : placeholder}
              rows={1}
              className="w-full bg-transparent border-0 resize-none focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
              style={{
                minHeight: '20px',
                maxHeight: '100px',
              }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming || isGenerating}
            className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              input.trim() && !isStreaming && !isGenerating
                ? 'bg-purple-600 hover:bg-purple-700 text-white active:scale-95'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            {isGenerating ? (
              <Wand2 className="h-4 w-4 animate-spin" />
            ) : imageMode ? (
              <Wand2 className="h-4 w-4" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="w-4 h-4"
              >
                <path d="M15.854.146a.5.5 0 0 0-.548-.105l-15 7a.5.5 0 0 0 .047.93l6.278 1.788 1.788 6.278a.5.5 0 0 0 .93.047l7-15a.5.5 0 0 0-.105-.548z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
