'use client'

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatAgent } from '@/services/client/api'
import { AIResponse, FollowUpQuestion, SmartAction } from '@/types/db'
import { 
  User, 
  Bot, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles, 
  MessageSquare, 
  Clock, 
  Search,
  BookOpen,
  Target,
  FileText,
  TrendingUp,
  Bookmark,
  Download,
  Zap,
  Brain,
  Settings,
  Trash2,
  MoreHorizontal,
  Plus
} from 'lucide-react'
import MarkdownPreview from '../markdown-previewer'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  response?: AIResponse
  isLoading?: boolean
}

export interface ChatComponentRef {
  sendMessage: (query: string) => void
}

const ChatComponent = forwardRef<ChatComponentRef>((props, ref) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatAgent = useChatAgent()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (query: string) => {
    if (!query.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date()
    }

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true
    }

    setMessages(prev => [...prev, userMessage, loadingMessage])

    try {
      const requestData = {
        message: query,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        context: conversationId ? { chat_type: 'general' as const } : undefined,
        config: {
          enable_tools: true,
          enable_follow_up: true,
          enable_smart_actions: true,
          enable_file_processing: true,
          temperature: 0.7
        }
      }

      const response = await chatAgent.mutateAsync(requestData)

      if (response) {
        setConversationId(response.conversation_id)
        
        const assistantMessage: Message = {
          id: loadingMessage.id,
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
          response,
          isLoading: false
        }

        setMessages(prev => prev.map(m => 
          m.id === loadingMessage.id ? assistantMessage : m
        ))
      }
    } catch (error) {
        console.error(error)
      setMessages(prev => prev.map(m => 
        m.id === loadingMessage.id 
          ? { ...m, content: 'Sorry, I encountered an error. Please try again.', isLoading: false }
          : m
      ))
    }
  }

  // Expose the sendMessage method via ref
  useImperativeHandle(ref, () => ({
    sendMessage: handleSendMessage
  }))

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const handleFollowUpClick = (question: FollowUpQuestion) => {
    handleSendMessage(question.text)
  }

  const handleSmartActionClick = (action: SmartAction) => {
    // For now, we'll just send the action as a message
    handleSendMessage(`Execute ${action.type}: ${action.action}`)
  }

  const getFollowUpIcon = (type: string) => {
    switch (type) {
      case 'research': return <Search className="w-3 h-3" />
      case 'examples': return <BookOpen className="w-3 h-3" />
      case 'clarification': return <MessageSquare className="w-3 h-3" />
      case 'analysis': return <TrendingUp className="w-3 h-3" />
      default: return <MessageSquare className="w-3 h-3" />
    }
  }

  const getSmartActionIcon = (type: string) => {
    switch (type) {
      case 'search': return <Search className="w-4 h-4" />
      case 'study': return <BookOpen className="w-4 h-4" />
      case 'practice': return <Target className="w-4 h-4" />
      case 'bookmark': return <Bookmark className="w-4 h-4" />
      case 'export': return <Download className="w-4 h-4" />
      case 'analyze': return <TrendingUp className="w-4 h-4" />
      default: return <Zap className="w-4 h-4" />
    }
  }

  const clearChat = () => {
    setMessages([])
    setConversationId(null)
  }

  const startNewChat = () => {
    setMessages([])
    setConversationId(null)
  }

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-4 sm:px-4 md:px-6 pt-8 pb-40">
      {/* Chat Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex_ hidden items-center justify-between mb-6 sticky top-2 z-10 bg-gradient-to-b from-transparent to-white/10 backdrop-blur-lg p-4 rounded-2xl shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className="">
              <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-sm sm:text-xl font-semibold text-white">Smart Assistant</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={startNewChat}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-purple-400 hover:from-purple-500/20 hover:to-blue-500/20 hover:border-purple-500/30 hover:text-purple-300 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Start new chat"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">New Chat</span>
          </motion.button>
          
          {messages.length > 0 && (
            <motion.button
              onClick={clearChat}
              className="p-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          )}
          <motion.button
            className="p-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Chat settings"
          >
            <Settings className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 mt-20">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-64 text-center"
            >
              <motion.div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                animate={{ 
                  rotateY: [0, 360],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-purple-400" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">Welcome to Lawstack AI Chat</h3>
              <p className="text-white/60 text-sm md:text-base max-w-md">
                Ask me anything about law, get intelligent analysis, research assistance, chat directly with past questions, just say the word, I am here.
              </p>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >

                <div className={`max-w-[98%] ${message.role === 'user' ? 'order-1 md:max-w-[90%]' : ''}`}>
                  {/* Message Bubble */}
                  <motion.div
                    className={`relative backdrop-blur-xl border shadow-lg rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-amber-400/10 to-orange-500/10 border-amber-400/20 text-white'
                        : 'bg-white/5 border-white/10 text-white'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    layout
                  >
                    {message.isLoading ? (
                      <div className="flex items-center gap-2">
                        <span className="text-white/60">Thinking</span>
                        <motion.div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ 
                                duration: 1, 
                                repeat: Infinity, 
                                delay: i * 0.2 
                              }}
                            />
                          ))}
                        </motion.div>
                      </div>
                    ) : (
                      <>
                        <div className="prose prose-invert max-w-none">
                          {
                            message?.role === 'assistant' ? (
                                <MarkdownPreview content={message?.content}/>
                            ): (
                                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                                    {message.content}
                                </p>
                            )
                          }
                        </div>

                        {/* Message Actions */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                          <div className="flex items-center gap-2 text-xs text-white/40">
                            <Clock className="w-3 h-3" />
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>

                          <motion.button
                            onClick={() => copyToClipboard(message.content, message.id)}
                            className="p-1.5 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {copiedId === message.id ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </motion.button>
                        </div>
                      </>
                    )}
                  </motion.div>

                  {/* Follow-up Questions */}
                  {message.response?.follow_up_questions && message.response.follow_up_questions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-3 space-y-2"
                    >
                      <p className="text-xs text-white/60 font-medium">Follow-up questions:</p>
                      <div className="grid gap-2">
                        {message.response.follow_up_questions.slice(0, 3).map((question, idx) => (
                          <motion.button
                            key={idx}
                            onClick={() => handleFollowUpClick(question)}
                            className="flex items-start gap-2 p-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white/80 hover:bg-white/10 hover:text-white transition-all text-left"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="mt-1">{getFollowUpIcon(question.type)}</span>
                            <span className='line-clamp-2 text-xs md:text-sm'>{question.text}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Smart Actions */}
                  {message.response?.smart_actions && message.response.smart_actions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-3 space-y-2 hidden"
                    >
                      <p className="text-xs text-white/60 font-medium">Smart actions:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {message.response.smart_actions.map((action, idx) => (
                          <motion.button
                            key={idx}
                            onClick={() => handleSmartActionClick(action)}
                            className="flex items-start gap-3 p-3 bg-gradient-to-br from-white/5 to-white/5 border border-white/10 rounded-lg text-left hover:from-white/10 hover:to-white/10 hover:border-white/20 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center">
                              {getSmartActionIcon(action.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-white">{action.title}</h4>
                              <p className="text-xs text-white/60 mt-1">{action.description}</p>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
})

ChatComponent.displayName = 'ChatComponent'

export default ChatComponent