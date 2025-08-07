'use client'

import { motion } from 'framer-motion'

import React from 'react'
import Navbar from '../navbar'
import Sidebar from '../sidebar'
import SearchInterface from './search-interface'

const HomeComponent = () => {
  return (
    <motion.div
        className="relative min-h-screen"
        animate={{ 
            background: [
                'radial-gradient(circle at 20% 50%, rgba(46, 44, 141, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(195, 45, 132, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 20%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)',
                'radial-gradient(circle at 40% 20%, rgba(7, 114, 153, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255, 119, 198, 0.2) 0%, transparent 50%)',
            ]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
    >
        <Navbar />
        <Sidebar />

        <main className='flex flex-col items-center justify-center flex-1 max-w-4xl mx-auto'>

        </main>

        <div className="fixed bottom-0 left-0 right-0 p-4 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto">
                <SearchInterface
                />
            </div>
        </div>
    </motion.div>
  )
}

export default HomeComponent