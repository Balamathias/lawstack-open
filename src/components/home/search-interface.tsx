'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Zap, Send, Sparkles, Mic, History, Star, Brain, MessageSquare } from 'lucide-react'
import { useStore } from '@/lib/store';

interface SearchInterfaceProps {
    onSearch?: (query: string, type: 'search' | 'chat' | 'none') => void;
    onOpenChat?: () => void;
    placeholder?: string;
    className?: string;
    isLoading?: boolean;
}

const SearchInterface = ({ 
    onSearch, 
    onOpenChat,
    placeholder = "Search anything legal (past questions, courses)...", 
    className = "" ,
    isLoading = false
}: SearchInterfaceProps) => {
    const [query, setQuery] = useState('')
    
    const searchType = useStore((state) => state.action)
    const setSearchType = useStore((state) => state.setAction)

    const [isHovered, setIsHovered] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [suggestions, setSuggestions] = useState<string[]>([])

    const filteredSuggestions = suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(query.toLowerCase()) && suggestion !== query
    ).slice(0, 5)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim() && onSearch) {
            onSearch(query.trim(), searchType)
            setQuery('')
            setShowSuggestions(false)
        }
    }

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion)
        setShowSuggestions(false)
        if (onSearch) {
            onSearch(suggestion, searchType)
            setQuery('')
        }
    }

    const handleVoiceInput = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
            const recognition = new SpeechRecognition()
            
            recognition.continuous = false
            recognition.interimResults = false
            recognition.lang = 'en-US'
            
            recognition.onstart = () => setIsListening(true)
            recognition.onend = () => setIsListening(false)
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript
                setQuery(transcript)
            }
            
            recognition.start()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <motion.div
            className={`relative w-full max-w-4xl mx-auto ${className}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Glassmorphic Container */}
            <div className="relative backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden">
                    <motion.div 
                        className="absolute inset-0 opacity-20"
                        animate={{ 
                            background: [
                                'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(33, 150, 243, 0.1) 100%)',
                                'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(76, 175, 80, 0.1) 100%)',
                                'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%)',
                                'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(156, 39, 176, 0.1) 100%)',
                                'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(33, 150, 243, 0.1) 100%)',
                            ]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* Search Input Area */}
                <form onSubmit={handleSubmit} className="relative">
                    <div className="relative p-4 sm:p-6">
                        <textarea
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value)
                                setShowSuggestions(e.target.value.length > 0)
                            }}
                            onFocus={() => setShowSuggestions(query.length > 0)}
                            onKeyDown={handleKeyDown}
                            placeholder={searchType === 'chat' ? "Experience our agentic smart assistant." : placeholder}
                            className="w-full bg-transparent text-white placeholder-white/40 border-none outline-none resize-none min-h-[40px] sm:min-h-[60px] max-h-[150px] sm:max-h-[200px] text-sm sm:text-lg leading-relaxed pr-20 sm:pr-24 pb-4 sm:pb-6"
                            rows={2}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            disabled={isLoading}
                        />
                        
                        {/* Voice Input Button */}
                        <motion.button
                            type="button"
                            onClick={handleVoiceInput}
                            className={`absolute bottom-2 sm:bottom-6 right-16 sm:right-20 p-2 rounded-lg transition-all ${
                                isListening 
                                    ? 'bg-red-500/30 text-red-400 animate-pulse' 
                                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            disabled={isListening || isLoading}
                            title={isListening ? "Listening..." : "Voice input"}
                        >
                            <Mic className="w-4 h-4" />
                        </motion.button>
                        
                        {/* Minimal Tab Selector - Positioned differently on mobile */}
                        <div className="absolute bottom-2 sm:bottom-6 left-4 sm:left-6 flex gap-1">
                            <motion.button
                                type="button"
                                onClick={() => setSearchType('search')}
                                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs sm:text-sm transition-all ${
                                    searchType === 'search'
                                        ? 'bg-white/10 text-white border border-white/20'
                                        : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                title="Chat/Search through lawstack"
                            >
                                <Search className="w-3 h-3" />
                                <AnimatePresence>
                                    {searchType === 'search' && (
                                        <motion.span
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: 'auto', opacity: 1 }}
                                            exit={{ width: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden whitespace-nowrap sm:inline"
                                        >
                                            Search
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                            <motion.button
                                type="button"
                                onClick={() => setSearchType('chat')}
                                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs sm:text-sm transition-all ${
                                    searchType === 'chat'
                                        ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-500/30'
                                        : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                title="Premium AI-powered analysis with multi-relay search, sentiment analysis, and insights (210 sats)"
                            >
                                <Sparkles className="w-3 h-3" />
                                <AnimatePresence>
                                    {searchType === 'chat' && (
                                        <motion.span
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: 'auto', opacity: 1 }}
                                            exit={{ width: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden whitespace-nowrap sm:inline"
                                        >
                                            Chat
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                {searchType === 'chat' && (
                                    <motion.span
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white px-1 py-0.5 rounded-full ml-1"
                                    >
                                        ⚡
                                    </motion.span>
                                )}
                            </motion.button>
                        </div>
                        
                        {/* Send Button */}
                        <motion.button
                            type="submit"
                            disabled={!query.trim() || isLoading}
                            className={`absolute bottom-2 sm:bottom-6 right-4 sm:right-6 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all ${
                                query.trim()
                                    ? searchType === 'chat'
                                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25'
                                        : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/25'
                                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                            }`}
                            whileHover={query.trim() ? { scale: 1.05 } : {}}
                            whileTap={query.trim() ? { scale: 0.95 } : {}}
                        >
                            <AnimatePresence mode="wait">
                                {query.trim() ? (
                                    <motion.div
                                        key="send"
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        exit={{ scale: 0, rotate: 180 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {isLoading ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            >
                                                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full" />
                                            </motion.div>
                                        ) : (searchType === 'chat' ? (
                                            <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                                        ) : (
                                            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="idle"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                         {isLoading ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            >
                                                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full" />
                                            </motion.div>
                                        ) : (<Send className="w-4 h-4 sm:w-5 sm:h-5" />)}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </form>

                {/* Suggestions Dropdown */}
                <AnimatePresence>
                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full mt-2 w-full bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl z-50 max-h-60 overflow-y-auto"
                        >
                            <div className="p-2">
                                <p className="text-white/40 text-xs px-2 py-1 mb-1">Suggestions</p>
                                {filteredSuggestions.map((suggestion, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="w-full px-3 py-2 text-left text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200 rounded-lg flex items-center gap-2"
                                        whileHover={{ x: 5 }}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <History className="w-3 h-3 text-white/40" />
                                        <span className="truncate">{suggestion}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Subtle Animation Bar */}
                <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ 
                        width: isHovered ? "100%" : "0%" 
                    }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            

            {/* Recent Searches (for connected users) */}
            {suggestions.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-4 bg-gradient-to-br from-white/5 to-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <h3 className="text-sm font-medium text-white/80">Recent Searches</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.slice(0, 6).map((suggestion, index) => (
                            <motion.button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-3 py-1 bg-white/10 text-white/70 rounded-lg text-sm hover:bg-white/20 hover:text-white transition-all duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                {suggestion}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Wallet Connection Status */}
            {
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-2 text-center"
                >
                    <p className="text-white/40 text-[10px] md:text-sm hidden">
                        💡 Sign up for personalized search suggestions and AI chat
                    </p>
                </motion.div>
            }

            {/* Floating Hint - Hidden on mobile */}
            <AnimatePresence>
                {!query && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-3 text-center hidden sm:block"
                    >
                        <p className="text-white/40 text-sm px-4">
                            Press <kbd className="px-2 py-1 bg-white/5 rounded text-xs">Enter</kbd> to search or{' '}
                            <kbd className="px-2 py-1 bg-white/5 rounded text-xs">Shift + Enter</kbd> for new line
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default SearchInterface
