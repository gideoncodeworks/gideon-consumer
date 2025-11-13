'use client';

/**
 * Consumer Chat Interface - Real AI Integration
 * ChatGPT/Claude/Gemini hybrid UI for usegideon.com
 */

import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Plus,
  Search,
  Settings,
  User,
  Sparkles,
  MoreVertical,
  Check,
  Zap,
  X,
  ChevronDown,
  LogOut,
  Image as ImageIcon,
  Wand2,
  Menu,
} from 'lucide-react';
import { sendChatMessage } from '@/lib/chat';
import { useAuth } from '@/lib/auth-context';
import AuthModal from '@/components/AuthModal';
import SettingsModal from '@/components/SettingsModal';
import ErrorToast from '@/components/ErrorToast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
  imageUrl?: string;
  type?: 'text' | 'image';
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
}

const FREE_MESSAGE_LIMIT = 20; // Competitive with ChatGPT/Claude free tiers

export default function ChatDemoPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [anonymousMessageCount, setAnonymousMessageCount] = useState(0);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load anonymous message count from localStorage
  useEffect(() => {
    if (!user) {
      const count = parseInt(localStorage.getItem('anonymousMessageCount') || '0');
      setAnonymousMessageCount(count);
    }
  }, [user]);

  // Sample conversations
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'New conversation',
      messages: [],
      updatedAt: new Date(),
    },
  ]);

  const [currentConversationId, setCurrentConversationId] = useState('1');
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [selectedModel, setSelectedModel] = useState('auto');
  const [imageMode, setImageMode] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  // Image generation is now DALL-E 3 only (Imagen requires Vertex AI setup)
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find(c => c.id === currentConversationId);

  const scrollToBottom = () => {
    // Use setTimeout to ensure DOM has updated
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages, isStreaming]);

  const handleImageGeneration = async (prompt: string) => {
    setGeneratingImage(true);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date(),
      type: 'text',
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === currentConversationId
          ? {
              ...conv,
              messages: [...conv.messages, userMessage],
              updatedAt: new Date(),
            }
          : conv
      )
    );

    // Create placeholder for image
    const imageMessageId = (Date.now() + 1).toString();
    const placeholderMessage: Message = {
      id: imageMessageId,
      role: 'assistant',
      content: 'Generating image...',
      timestamp: new Date(),
      model: 'DALL-E 3',
      type: 'image',
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === currentConversationId
          ? {
              ...conv,
              messages: [...conv.messages, placeholderMessage],
              updatedAt: new Date(),
            }
          : conv
      )
    );

    try {
      const response = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: 'dall-e-3' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      // Update message with generated image
      setConversations(prev =>
        prev.map(conv =>
          conv.id === currentConversationId
            ? {
                ...conv,
                messages: conv.messages.map(msg =>
                  msg.id === imageMessageId
                    ? {
                        ...msg,
                        content: data.revisedPrompt || prompt,
                        imageUrl: data.imageUrl,
                      }
                    : msg
                ),
              }
            : conv
        )
      );
    } catch (error: any) {
      console.error('Image generation error:', error);

      // Show user-friendly error message
      let errorMsg = 'Unable to generate image. Please try again.';
      if (error.message.includes('API key')) {
        errorMsg = 'Image generation service is temporarily unavailable.';
      } else if (error.message.includes('rate limit')) {
        errorMsg = 'Too many requests. Please wait a moment and try again.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMsg = 'Network error. Please check your connection and try again.';
      }

      setErrorMessage(errorMsg);

      // Remove the placeholder message
      setConversations(prev =>
        prev.map(conv =>
          conv.id === currentConversationId
            ? {
                ...conv,
                messages: conv.messages.filter(msg => msg.id !== imageMessageId),
              }
            : conv
        )
      );
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !currentConversation || isStreaming || generatingImage) return;

    // Check anonymous usage limit
    if (!user && anonymousMessageCount >= FREE_MESSAGE_LIMIT) {
      setShowUpgradePrompt(true);
      return;
    }

    // Increment anonymous message count
    if (!user) {
      const newCount = anonymousMessageCount + 1;
      setAnonymousMessageCount(newCount);
      localStorage.setItem('anonymousMessageCount', newCount.toString());
    }

    const currentInput = inputValue;
    setInputValue('');

    // If in image mode, generate image
    if (imageMode) {
      setImageMode(false); // Reset image mode
      await handleImageGeneration(currentInput);
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentInput,
      timestamp: new Date(),
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === currentConversationId
          ? {
              ...conv,
              messages: [...conv.messages, userMessage],
              updatedAt: new Date(),
            }
          : conv
      )
    );

    setIsStreaming(true);

    // Create placeholder assistant message
    const assistantMessageId = (Date.now() + 1).toString();
    const placeholderMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      model: selectedModel,
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === currentConversationId
          ? {
              ...conv,
              messages: [...conv.messages, placeholderMessage],
              updatedAt: new Date(),
            }
          : conv
      )
    );

    // Get conversation history for API
    const apiMessages = [...currentConversation.messages, userMessage].map(m => ({
      role: m.role,
      content: m.content,
    }));

    // Stream response from real AI
    await sendChatMessage({
      messages: apiMessages,
      model: selectedModel,
      onChunk: (chunk) => {
        setConversations(prev =>
          prev.map(conv =>
            conv.id === currentConversationId
              ? {
                  ...conv,
                  messages: conv.messages.map(msg =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: msg.content + chunk }
                      : msg
                  ),
                }
              : conv
          )
        );
      },
      onComplete: (fullResponse) => {
        setIsStreaming(false);
      },
      onError: (error) => {
        console.error('Chat error:', error);

        // User-friendly error messages
        let errorMsg = 'Unable to send message. Please try again.';
        if (error.message?.includes('API key') || error.message?.includes('api key')) {
          errorMsg = 'Chat service is temporarily unavailable.';
        } else if (error.message?.includes('rate limit')) {
          errorMsg = 'Too many requests. Please wait a moment and try again.';
        } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
          errorMsg = 'Network error. Please check your connection and try again.';
        } else if (error.message?.includes('timeout')) {
          errorMsg = 'Request timed out. Please try again.';
        }

        setErrorMessage(errorMsg);

        // Remove placeholder message instead of showing error in chat
        setConversations(prev =>
          prev.map(conv =>
            conv.id === currentConversationId
              ? {
                  ...conv,
                  messages: conv.messages.filter(msg => msg.id !== assistantMessageId),
                }
              : conv
          )
        );
        setIsStreaming(false);
      },
    });
  };

  const handleNewChat = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'New conversation',
      messages: [],
      updatedAt: new Date(),
    };
    setConversations([newConv, ...conversations]);
    setCurrentConversationId(newConv.id);
    setShowSidebar(false); // Close sidebar on mobile after creating new chat
  };

  const handleClearConversations = () => {
    // Create a fresh conversation
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'New conversation',
      messages: [],
      updatedAt: new Date(),
    };
    setConversations([newConv]);
    setCurrentConversationId(newConv.id);
  };

  return (
    <div className="flex h-full w-full max-w-full bg-white dark:bg-gray-900 overflow-hidden">
      {/* Mobile Sidebar Backdrop */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`w-64 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-gray-50 dark:bg-gray-950
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 transition-transform duration-300 fixed md:relative h-full max-h-full z-50 overflow-hidden`}>
        {/* Sidebar Header */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            New chat
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1">
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => {
                  setCurrentConversationId(conv.id);
                  setShowSidebar(false); // Close sidebar on mobile after selection
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between group ${
                  conv.id === currentConversationId
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="truncate flex-1">{conv.title}</span>
                <MoreVertical className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
          {user ? (
            <>
              <div className="px-3 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-900 text-sm">
                <div className="flex items-center gap-3 mb-1">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900 dark:text-white font-medium truncate">
                    {user.email}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-sm text-gray-700 dark:text-gray-300"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
              <button
                onClick={signOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm text-red-600 dark:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-purple-500 hover:bg-purple-600 transition-colors text-sm text-white font-medium"
              >
                <User className="h-4 w-4" />
                Sign in
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-sm text-gray-700 dark:text-gray-300"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Chat Header */}
        <div className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-6 bg-white dark:bg-gray-900 pt-[env(safe-area-inset-top)] min-h-[calc(3.5rem+env(safe-area-inset-top))] min-w-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <h1 className="font-semibold text-gray-900 dark:text-white">Gideon</h1>
            </div>

            {/* Model Picker */}
            <div className="relative flex-shrink-0 hidden sm:block">
              <button
                onClick={() => setShowModelPicker(!showModelPicker)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                {selectedModel === 'auto' ? (
                  <>
                    <Zap className="h-3.5 w-3.5 text-purple-500" />
                    Auto (Best model)
                  </>
                ) : (
                  selectedModel
                )}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {showModelPicker && (
                <div className="absolute top-full mt-2 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 min-w-[200px] z-10">
                  <button
                    onClick={() => {
                      setSelectedModel('auto');
                      setShowModelPicker(false);
                    }}
                    className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-purple-500" />
                      <div className="text-left">
                        <div className="font-medium">Auto</div>
                        <div className="text-xs text-gray-500">Best model for your task</div>
                      </div>
                    </div>
                    {selectedModel === 'auto' && <Check className="h-4 w-4 text-purple-500" />}
                  </button>

                  <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

                  {['Claude Opus', 'GPT-4o', 'Gemini Pro', 'o1-preview'].map(model => (
                    <button
                      key={model}
                      onClick={() => {
                        setSelectedModel(model);
                        setShowModelPicker(false);
                      }}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span>{model}</span>
                      {selectedModel === model && <Check className="h-4 w-4 text-purple-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
            {user ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                Pro Plan • 156/500 messages today
              </div>
            ) : (
              <div className="flex items-center gap-2 min-w-0">
                <div className="text-xs text-gray-500 dark:text-gray-400 hidden md:block whitespace-nowrap">
                  {FREE_MESSAGE_LIMIT - anonymousMessageCount} free messages left
                </div>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="text-xs px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors whitespace-nowrap hidden sm:inline-block"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
          {!currentConversation?.messages.length ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md px-6">
                <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  How can I help you today?
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Ask me anything - I'll automatically route your question to the best AI model.
                </p>

                <div className="grid grid-cols-2 gap-3 text-left">
                  {[
                    'Write a Python script',
                    'Explain quantum physics',
                    'Create a marketing plan',
                    'Debug my code',
                  ].map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => setInputValue(prompt)}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full px-3 py-4 space-y-3 box-border">
              {currentConversation.messages.map((message, idx) => (
                <div
                  key={message.id}
                  className={`flex w-full animate-[fadeIn_0.3s_ease-in] ${
                    message.role === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  {message.role === 'user' ? (
                    // User Message (ChatGPT-style bubble)
                    <div className="max-w-[78%] min-w-0">
                      <div className="px-4 py-3 rounded-[22px] rounded-br-md bg-purple-600 text-white shadow-sm text-[15px] leading-[22px] break-words">
                        {message.imageUrl ? (
                          <div className="space-y-2">
                            <img
                              src={message.imageUrl}
                              alt={message.content}
                              className="w-full rounded-lg shadow-lg max-w-full"
                            />
                            <div className="text-sm text-white/90 leading-relaxed break-words">
                              {message.content}
                            </div>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap break-words">
                            {message.content}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // AI Message (ChatGPT-style with avatar)
                    <div className="flex gap-2 max-w-[78%] min-w-0">
                      {/* Avatar */}
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                        G
                      </div>

                      {/* Message Content */}
                      <div className="flex-1 min-w-0">
                        <div className="px-4 py-3 rounded-[22px] rounded-bl-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm text-[15px] leading-[22px] break-words">
                          {message.imageUrl ? (
                            <div className="space-y-2">
                              <img
                                src={message.imageUrl}
                                alt={message.content}
                                className="w-full rounded-lg shadow-lg max-w-full"
                              />
                              <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed break-words">
                                {message.content}
                              </div>
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap break-words">
                              {message.content}
                            </div>
                          )}
                        </div>

                        {message.model && (
                          <div className="mt-1 ml-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            {message.imageUrl ? <Wand2 className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                            {message.model}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isStreaming && (
                <div className="flex w-full justify-start">
                  <div className="flex gap-2 max-w-[78%]">
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      G
                    </div>
                    {/* Typing indicator */}
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

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area - ChatGPT style composer */}
        <div className="sticky bottom-0 z-20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 pb-[env(safe-area-inset-bottom)]">
          <div className="px-3 py-3">
            {imageMode && (
              <div className="mb-3 flex items-center gap-2 text-sm bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 px-3 py-2 rounded-lg overflow-visible">
                <Wand2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 min-w-0 flex-1">
                  <strong>Image mode</strong> <span className="hidden sm:inline">- Describe the image you want to create</span>
                </span>

                {/* Image Model Badge (DALL-E 3 only) */}
                <div className="ml-auto flex-shrink-0">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/50 dark:bg-gray-800/50 text-xs font-medium text-gray-700 dark:text-gray-300">
                    DALL-E 3
                  </div>
                </div>

                <button
                  onClick={() => setImageMode(false)}
                  className="ml-auto p-1 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            )}

            <div className="flex items-end gap-2">
              {/* Image Generation Button */}
              <button
                onClick={() => setImageMode(!imageMode)}
                className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  imageMode
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title="Generate image with DALL-E 3 or Imagen 3"
              >
                {imageMode ? <Wand2 className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
              </button>

              {/* Text Input Pill */}
              <div className="flex-1 relative bg-gray-100 dark:bg-gray-800 rounded-[20px] px-4 py-3 shadow-sm">
                <textarea
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={imageMode ? "Describe the image..." : "Message…"}
                  rows={1}
                  className="w-full bg-transparent border-0 resize-none focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base"
                  style={{
                    minHeight: '20px',
                    maxHeight: '100px',
                  }}
                />
              </div>

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isStreaming || generatingImage}
                className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  inputValue.trim() && !isStreaming && !generatingImage
                    ? 'bg-purple-600 hover:bg-purple-700 text-white active:scale-95'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                {generatingImage ? (
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

            <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
              {!user && anonymousMessageCount > 0 && anonymousMessageCount < FREE_MESSAGE_LIMIT && (
                <div className="mb-2 flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>
                    {FREE_MESSAGE_LIMIT - anonymousMessageCount} free {FREE_MESSAGE_LIMIT - anonymousMessageCount === 1 ? 'message' : 'messages'} remaining •{' '}
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="underline hover:no-underline font-medium"
                    >
                      Sign up for unlimited
                    </button>
                  </span>
                </div>
              )}
              Gideon can make mistakes. Check important info.
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onClearConversations={handleClearConversations}
      />

      {/* Upgrade Prompt Modal */}
      {showUpgradePrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowUpgradePrompt(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                You've used your free messages!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Sign up for free to continue the conversation
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Unlimited messages</strong> with all AI models
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Save conversations</strong> and access them anywhere
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Priority access</strong> to new features and models
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowUpgradePrompt(false);
                setShowAuthModal(true);
              }}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              Sign up for free
            </button>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
              No credit card required • Get started in 30 seconds
            </p>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {errorMessage && (
        <ErrorToast
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
    </div>
  );
}
