'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { Menu, X, Zap, Search as SearchIcon, Scale, Sparkles, MessageSquare, Compass, ChevronRight } from 'lucide-react'
import { useStore } from '../lib/store'

interface NavbarProps { user?: null }

const NAV_BASE_HEIGHT = 72 // px

const Navbar = ({ user }: NavbarProps) => {
  const router = useRouter()
  const params = useSearchParams()
  const currentAction = params.get('action') || 'search'
  const { action } = useStore((s) => s) // still available if needed later

  const navRef = useRef<HTMLDivElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [elevated, setElevated] = useState(false)
  const [compressed, setCompressed] = useState(false)
  const lastScroll = useRef(0)
  const scrollVelocity = useRef(0)

  // Auth modal placeholder (kept minimal for now)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => setMounted(true), [])

  // Measure & expose nav height as CSS var (so pages can reduce hardcoded paddings over time)
  useEffect(() => {
    const setVar = () => {
      const h = navRef.current?.offsetHeight || NAV_BASE_HEIGHT
      document.documentElement.style.setProperty('--app-nav-height', h + 'px')
    }
    setVar()
    const ro = new ResizeObserver(setVar)
    if (navRef.current) ro.observe(navRef.current)
    window.addEventListener('resize', setVar)
    return () => {
      window.removeEventListener('resize', setVar)
      ro.disconnect()
    }
  }, [])

  // Scroll reactions: hide on fast downward scroll, elevate + compress after threshold
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const delta = y - lastScroll.current
      scrollVelocity.current = 0.8 * scrollVelocity.current + 0.2 * delta

      setElevated(y > 8)
      setCompressed(y > 40)

      if (y > 120 && scrollVelocity.current > 4) {
        setHidden(true)
      } else if (scrollVelocity.current < -2) {
        setHidden(false)
      } else if (y < 40) {
        setHidden(false)
      }

      lastScroll.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const items: { key: string; label: string; icon: React.ReactNode; onClick: () => void }[] = [
    { key: 'search', label: 'Search', icon: <SearchIcon className='w-4 h-4' />, onClick: () => history.pushState(null, '', '?action=search') },
    { key: 'chat', label: 'Chat', icon: <MessageSquare className='w-4 h-4' />, onClick: () => history.pushState(null, '', '?action=chat') },
    { key: 'explore', label: 'Explore', icon: <Compass className='w-4 h-4' />, onClick: () => history.pushState(null, '', '?action=search&mode=explore') },
  ]

  const activeIndex = items.findIndex(i => i.key === currentAction)

  return (
    <>
      <motion.div
        ref={navRef}
        initial={{ y: -40, opacity: 0 }}
        animate={{ 
          y: hidden ? -100 : 0, 
          opacity: 1,
        }}
        transition={{ type: 'spring', stiffness: 140, damping: 18 }}
        className={[
          'fixed top-1 left-0 right-0 z-40 flex justify-center px-2 sm:px-4',
          'print:hidden'
        ].join(' ')}
      >
        <motion.nav
          layout
            className={[
            'relative w-full max-w-5xl flex items-center gap-4',
            'rounded-2xl sm:rounded-3xl px-4 sm:px-6',
            'backdrop-blur-xl border transition-all',
            'bg-white/[0.05] border-white/10',
            'shadow-[0_4px_30px_-10px_rgba(0,0,0,0.6)]',
            compressed ? 'py-2 h-[56px]' : 'py-3 h-[72px]'
          ].join(' ')}
          animate={{
            backgroundColor: elevated ? 'rgba(18,18,25,0.55)' : 'rgba(30,30,40,0.35)',
            borderColor: elevated ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)',
            scale: hidden ? 0.98 : 1
          }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {/* Brand */}
          <button
            onClick={() => router.push('?action=search')}
            className='group flex items-center gap-2 focus:outline-none'
          >
            <motion.div
              whileHover={{ rotate: 8, scale: 1.08 }}
              className='relative p-2 rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5'
            >
              <Scale className='w-5 h-5 text-white/90 drop-shadow' />
              <motion.span
                layoutId='brand-glow'
                className='absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 opacity-0 group-hover:opacity-100 blur-xl transition-opacity'
              />
            </motion.div>
            <div className='hidden md:flex flex-col -space-y-0.5 text-left'>
              <span className='text-sm font-semibold tracking-wide bg-gradient-to-r from-white via-white/80 to-white/60 bg-clip-text text-transparent'>Lawstack</span>
              <span className='text-[10px] uppercase tracking-[0.2em] text-white/40'>AI Suite</span>
            </div>
          </button>

          {/* Primary nav items */}
          <div className='hidden md:flex relative ml-4'>
            <div className='flex items-center gap-1 relative px-1'>
              <AnimatePresence initial={false}>
                {activeIndex >= 0 && (
                  <motion.div
                    key={activeIndex}
                    layoutId='active-pill'
                    className='absolute rounded-xl bg-white/[0.10] border border-white/10 backdrop-blur-md'
                    style={{ top: 4, bottom: 4, left: 0 }}
                    initial={false}
                    animate={{ left: `calc(${activeIndex} * (100% / ${items.length}))`, width: `calc(100% / ${items.length})` }}
                    transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                  />
                )}
              </AnimatePresence>
              {items.map(i => (
                <button
                  key={i.key}
                  onClick={i.onClick}
                  className={[
                    'relative z-10 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
                    'text-white/70 hover:text-white transition-colors'
                  ].join(' ')}
                >
                  {i.icon}
                  {i.label}
                </button>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className='flex-1' />

            {/* Actions (Right side) */}
          <div className='hidden md:flex items-center gap-2'>
            <button
              onClick={() => router.push('?action=chat')}
              className='group relative overflow-hidden px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-white/80 hover:text-white flex items-center gap-2'
            >
              <Zap className='w-4 h-4 text-purple-300 group-hover:rotate-12 transition-transform' />
              Quick Ask
              <span className='absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/20 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity' />
            </button>
            <button
              onClick={() => setShowAuth(true)}
              className='relative px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/70 to-blue-500/70 text-white text-xs font-semibold shadow-inner border border-white/10 hover:from-purple-500/90 hover:to-blue-500/90 transition-all'
            >
              Sign In
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className='md:hidden relative p-2 rounded-xl border border-white/10 bg-white/10 text-white'
          >
            <AnimatePresence mode='wait' initial={false}>
              {mobileOpen ? (
                <motion.span key='close' initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
                  <X className='w-5 h-5' />
                </motion.span>
              ) : (
                <motion.span key='menu' initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }}>
                  <Menu className='w-5 h-5' />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </motion.nav>
      </motion.div>

      {/* Mobile Sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-30 md:hidden'
          >
            <div className='absolute inset-0 backdrop-blur-md bg-black/70' onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 160, damping: 22 }}
              className='absolute top-0 right-0 h-full w-[78%] max-w-xs p-4 flex flex-col gap-6 bg-white/[0.06] backdrop-blur-2xl border-l border-white/10 shadow-2xl'
            >
              <div className='flex items-center gap-2'>
                <div className='p-2 rounded-xl bg-gradient-to-br from-purple-500/40 to-blue-500/40 border border-white/15'>
                  <Sparkles className='w-5 h-5 text-white' />
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm font-semibold text-white/90'>Lawstack</span>
                  <span className='text-[10px] tracking-wider text-white/40'>AI Suite</span>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                {items.map(i => {
                  const active = i.key === currentAction
                  return (
                    <motion.button
                      key={i.key}
                      onClick={() => { i.onClick(); setMobileOpen(false) }}
                      whileTap={{ scale: 0.97 }}
                      className={[
                        'flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium',
                        active ? 'bg-white/15 border-white/20 text-white' : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                      ].join(' ')}
                    >
                      <span className='flex items-center gap-2'>{i.icon}{i.label}</span>
                      <ChevronRight className='w-4 h-4 opacity-60' />
                    </motion.button>
                  )
                })}
              </div>
              <div className='mt-auto flex flex-col gap-3'>
                <button
                  onClick={() => { setShowAuth(true); setMobileOpen(false) }}
                  className='px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500/80 to-blue-500/80 text-white text-sm font-semibold shadow-inner border border-white/10'
                >
                  Sign In
                </button>
                <p className='text-[10px] text-white/30 text-center'>v0 preview • feedback welcome</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal (lightweight placeholder) */}
      {mounted && createPortal(
        <AnimatePresence>
          {showAuth && (
            <motion.div
              className='fixed inset-0 z-[70] flex items-center justify-center p-4'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className='absolute inset-0 bg-black/70 backdrop-blur-md' onClick={() => setShowAuth(false)} />
              <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 30, opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 160, damping: 20 }}
                className='relative w-full max-w-md rounded-2xl border border-white/15 bg-white/[0.08] backdrop-blur-2xl p-6 shadow-[0_0_40px_-10px_rgba(0,0,0,0.7)]'
              >
                <h3 className='text-lg font-semibold text-white mb-2'>Coming Soon</h3>
                <p className='text-sm text-white/60 mb-6'>Authentication & personalization are on the roadmap. Let us know what matters most. Email <a href='mailto:matiecodes@gmail.com' className='text-purple-400'>matiecodes@gmail.com</a> with your suggestions or recommendations</p>
                <div className='flex justify-end'>
                  <button
                    onClick={() => setShowAuth(false)}
                    className='px-4 py-2 rounded-lg bg-white/10 text-white/70 hover:text-white hover:bg-white/20 text-sm font-medium'
                  >
                    Close
                  </button>
                </div>
                <motion.button
                  onClick={() => setShowAuth(false)}
                  className='absolute top-3 right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white'
                  whileHover={{ rotate: 90 }}
                >
                  <X className='w-4 h-4' />
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}

export default Navbar