'use client';

/**
 * Consumer Chat Interface Demo
 * ChatGPT/Claude hybrid UI for usegideon.com
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
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
}

export default function ChatDemoPage() {
  // Sample conversations
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Multi-model AI comparison',
      messages: [
        {
          id: '1-1',
          role: 'user',
          content: 'What are the differences between Claude, GPT-4, and Gemini?',
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: '1-2',
          role: 'assistant',
          content: 'Great question! Let me break down the key differences:\n\n**Claude (Anthropic)**\n- Excels at: Code generation, analysis, following complex instructions\n- Strengths: Very helpful, honest, and harmless. Great at explaining reasoning.\n- Best for: Programming, research, nuanced conversations\n\n**GPT-4 (OpenAI)**\n- Excels at: General knowledge, creative writing, diverse tasks\n- Strengths: Broad knowledge base, creative, well-rounded\n- Best for: General chat, creative tasks, broad questions\n\n**Gemini (Google)**\n- Excels at: Speed, integration with Google services, multimodal tasks\n- Strengths: Fast responses, good at images, connected to Google ecosystem\n- Best for: Quick queries, image analysis, research with Google integration\n\nWith Gideon, you get the best of all three - we automatically route your question to the model that will give you the best answer!',
          timestamp: new Date(Date.now() - 3500000),
          model: 'Claude Sonnet',
        },
      ],
      updatedAt: new Date(Date.now() - 3500000),
    },
    {
      id: '2',
      title: 'Python script for data analysis',
      messages: [],
      updatedAt: new Date(Date.now() - 86400000),
    },
    {
      id: '3',
      title: 'Marketing strategy ideas',
      messages: [],
      updatedAt: new Date(Date.now() - 172800000),
    },
  ]);

  const [currentConversationId, setCurrentConversationId] = useState('1');
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [selectedModel, setSelectedModel] = useState('auto');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find(c => c.id === currentConversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const handleSend = () => {
    if (!inputValue.trim() || !currentConversation) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
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

    setInputValue('');
    setIsStreaming(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'd be happy to help with that! This is a demo interface showing how Gideon will work - a clean, fast chat experience that combines the best of ChatGPT and Claude.\n\nIn the real app, I would route your question to the optimal AI model and give you the best possible answer.",
        timestamp: new Date(),
        model: selectedModel === 'auto' ? 'GPT-4o' : selectedModel,
      };

      setConversations(prev =>
        prev.map(conv =>
          conv.id === currentConversationId
            ? {
                ...conv,
                messages: [...conv.messages, assistantMessage],
                updatedAt: new Date(),
              }
            : conv
        )
      );

      setIsStreaming(false);
    }, 1500);
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
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-gray-50 dark:bg-gray-950">
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
                onClick={() => setCurrentConversationId(conv.id)}
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
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-sm text-gray-700 dark:text-gray-300">
            <User className="h-4 w-4" />
            My account
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-sm text-gray-700 dark:text-gray-300">
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <h1 className="font-semibold text-gray-900 dark:text-white">Gideon</h1>
            </div>

            {/* Model Picker */}
            <div className="relative">
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

          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Pro Plan • 156/500 messages today
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
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
            <div className="max-w-3xl mx-auto px-6 py-8">
              {currentConversation.messages.map((message, idx) => (
                <div
                  key={message.id}
                  className={`mb-8 ${
                    message.role === 'user'
                      ? 'flex justify-end'
                      : 'flex justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-purple-500 text-white rounded-2xl rounded-tr-sm px-4 py-3'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl rounded-tl-sm px-4 py-3'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>

                    {message.role === 'assistant' && message.model && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Zap className="h-3 w-3" />
                        Powered by {message.model}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isStreaming && (
                <div className="flex justify-start mb-8">
                  <div className="max-w-[80%] bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="max-w-3xl mx-auto px-6 py-4">
            <div className="flex items-end gap-3">
              <button className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Paperclip className="h-5 w-5 text-gray-500" />
              </button>

              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Message Gideon..."
                  rows={1}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  style={{
                    minHeight: '48px',
                    maxHeight: '200px',
                  }}
                />
              </div>

              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isStreaming}
                className="p-2.5 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
              Gideon can make mistakes. Check important info.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
