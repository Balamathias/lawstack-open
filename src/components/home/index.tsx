'use client'

import { motion } from 'framer-motion'

import React, { useRef } from 'react'
import Navbar from '../navbar'
import Sidebar from '../sidebar'
import SearchInterface from './search-interface'
import { useStore } from '@/lib/store'
import ChatComponent from './chat-component'
import SearchResults from './search-results'
import Starter from './starter'

const HomeComponent = () => {
  const { action, isLoading, setIsLoading, setSearchQuery } = useStore((state) => state)
  const chatComponentRef = useRef<{ sendMessage: (query: string) => void }>(null)
  const searchResultsRef = useRef<{ performSearch: (query: string) => void }>(null)

  const handleSearch = (query: string, type: 'search' | 'chat' | 'none') => {
    if (type === 'chat' && chatComponentRef.current) {
      setIsLoading(true)
      chatComponentRef.current.sendMessage(query)
      // Loading will be set to false when the chat component finishes
    } else if (type === 'search') {
      setSearchQuery(query)
      if (searchResultsRef.current) {
        searchResultsRef.current.performSearch(query)
      }
    }
  }

  return (
    <motion.div
        className="relative min-h-screen"
        animate={{ 
            background: [
                'radial-gradient(circle at 20% 50%, rgba(8, 15, 30, 0.8) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(60, 20, 90, 0.7) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(20, 40, 90, 0.6) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(50, 18, 100, 0.8) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(20, 40, 90, 0.7) 0%, transparent 50%), radial-gradient(circle at 60% 20%, rgba(35, 45, 60, 0.6) 0%, transparent 50%)',
                'radial-gradient(circle at 40% 20%, rgba(5, 60, 90, 0.8) 0%, transparent 50%), radial-gradient(circle at 60% 80%, rgba(35, 45, 60, 0.7) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(60, 20, 90, 0.6) 0%, transparent 50%)',
            ]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
    >
        <Navbar />
        <Sidebar />

        <main className='flex flex-col items-center justify-center flex-1 w-full max-w-5xl mx-auto'>
            {action === 'chat' ? (
                <ChatComponent ref={chatComponentRef} />
            ) : action === 'search' ? (
                <SearchResults ref={searchResultsRef} />
            ) : <Starter />}
        </main>

        <div className="fixed bottom-0 left-0 right-0 p-4 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto">
                <SearchInterface
                    onSearch={handleSearch}
                />
            </div>
        </div>
    </motion.div>
  )
}

export default HomeComponent