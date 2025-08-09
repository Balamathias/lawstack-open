'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import { Search, MessageSquare, Globe, LayoutDashboard, ArrowRight } from 'lucide-react'

const Starter = () => {
  const { setAction } = useStore((s) => s)

  const containerVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.06 } },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1 },
  }

  return (
    <div className="w-full px-4 sm:px-6 py-32 pb-40">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 sm:mb-12"
      >
        <p className="text-xs tracking-widest text-white/50 mb-2 uppercase">Welcome</p>
        <h1 className="text-2xl sm:text-4xl font-semibold bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
          Lawstack Assistant
        </h1>
        <p className="mt-3 text-sm sm:text-base text-white/70">
          Pick an action to get started. Everything is glassy, fast, and delightful.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
      >
        <motion.button
          variants={cardVariants}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.995 }}
          onClick={() => setAction('search')}
          className="group relative w-full text-left rounded-2xl p-4 sm:p-6 backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="shrink-0 rounded-xl p-2 sm:p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300">
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-white">Search Past Questions</h3>
              <p className="mt-1 text-xs sm:text-sm text-white/70">
                Search for past questions, filter past questions, navigate your way through.
              </p>
              <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 text-xs sm:text-sm text-blue-300/90">
                Start searching
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-white/20" />
        </motion.button>

        <motion.button
          variants={cardVariants}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.995 }}
          onClick={() => setAction('chat')}
          className="group relative w-full text-left rounded-2xl p-4 sm:p-6 backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="shrink-0 rounded-xl p-2 sm:p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-white">Chat with Smart Assistant</h3>
              <p className="mt-1 text-xs sm:text-sm text-white/70">
                Chat directly with past questions curated directly with tool calling.
              </p>
              <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 text-xs sm:text-sm text-purple-300/90">
                Start chatting
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
          <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-white/20" />
        </motion.button>

        <motion.a
          variants={cardVariants}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.995 }}
          href="https://lawstack.me"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block rounded-2xl p-4 sm:p-6 backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="shrink-0 rounded-xl p-2 sm:p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-300">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-white">Lawstack's Main Site</h3>
              <p className="mt-1 text-xs sm:text-sm text-white/70">
                Explore the platform, learn more, and see what’s new.
              </p>
              <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 text-xs sm:text-sm text-emerald-300/90">
                Open site
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
          <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-white/20" />
        </motion.a>

        <motion.a
          variants={cardVariants}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.995 }}
          href="https://lawstack.me/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block rounded-2xl p-4 sm:p-6 backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="shrink-0 rounded-xl p-2 sm:p-3 bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 text-orange-300">
              <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-white">Lawstack Dashboard</h3>
              <p className="mt-1 text-xs sm:text-sm text-white/70">
                Jump into your dashboard to manage data and insights.
              </p>
              <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 text-xs sm:text-sm text-orange-300/90">
                Open dashboard
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
          <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-white/20" />
        </motion.a>
      </motion.div>
    </div>
  )
}

export default Starter