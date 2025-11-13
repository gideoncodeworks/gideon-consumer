/**
 * SettingsModal - Gideon Settings Interface
 * User preferences and app settings
 */

'use client';

import { X, Moon, Sun, Trash2, Info } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearConversations?: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onClearConversations,
}: SettingsModalProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check system preference or saved preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const currentTheme = (savedTheme as 'light' | 'dark') || systemTheme;
    setTheme(currentTheme);

    // Apply theme to document on load
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleClearConversations = () => {
    if (window.confirm('Are you sure you want to clear all conversations? This cannot be undone.')) {
      onClearConversations?.();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close settings"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Appearance Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Appearance</h3>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5 text-purple-500" />
                ) : (
                  <Sun className="h-5 w-5 text-amber-500" />
                )}
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Theme</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Toggle</div>
            </button>
          </div>

          {/* Data Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Data</h3>
            <button
              onClick={handleClearConversations}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="h-5 w-5 text-gray-500 group-hover:text-red-500" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">
                    Clear all conversations
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Delete all chat history
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">About</h3>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-start gap-3 mb-3">
                <Info className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Gideon AI
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <div>Version 1.0.0</div>
                    <div>Multi-model AI chat platform</div>
                    <div className="pt-2">
                      <a
                        href="https://gideoncode.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        gideoncode.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Models Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Available Models</h3>
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Chat Models</span>
                <span>GPT-4, Claude, Gemini</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">Image Models</span>
                <span>DALL-E 3, Imagen 3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
