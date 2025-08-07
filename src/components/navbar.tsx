'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, CloudLightning, Zap, Search, Scale } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  user?: null;
}

const Navbar = ({ user }: NavbarProps) => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  
  return (
    <motion.nav 
      className="fixed top-3 left-3 right-3 z-50 backdrop-blur-2xl bg-white/[0.02] border border-white/[0.08] rounded-3xl shadow-2xl max-w-4xl mx-auto overflow-hidden"
      initial={{ y: -100, opacity: 0, scale: 0.8 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ 
        duration: 1.2, 
        ease: [0.16, 1, 0.3, 1],
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      {/* Enhanced Dynamic Gradient Background */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-20"
          animate={{ 
            background: [
              'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 20%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 20%, rgba(120, 219, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255, 119, 198, 0.2) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Mouse-following spotlight effect */}
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        />
        
        {/* Floating particles effect */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{ 
              x: Math.random() * 400,
              y: Math.random() * 80,
              opacity: 0 
            }}
            animate={{ 
              x: Math.random() * 400,
              y: Math.random() * 80,
              opacity: [0, 1, 0] 
            }}
            transition={{ 
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      {/* Glass reflection effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />
      
      <div className="relative px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={() => router.push('/')}
          >
            <motion.div
              className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.1] backdrop-blur-xl"
              whileHover={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                scale: 1.1,
                rotate: 5
              }}
              transition={{ duration: 0.3 }}
            >
              <Scale className="w-6 h-6 text-white/90" />
            </motion.div>
            <div className="hidden md:block">
              <motion.h1 
                className="font-bold text-lg bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent"
                whileHover={{ scale: 1.02 }}
              >
                Lawstack
              </motion.h1>
              <motion.p 
                className="text-white/50 text-xs"
                initial={{ opacity: 0.5 }}
                whileHover={{ opacity: 0.8 }}
              >
                Lawstack Smart AI
              </motion.p>
            </div>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3">
              <motion.button
                className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/80 text-sm hover:bg-white/[0.08] transition-all backdrop-blur-xl flex items-center gap-2 cursor-pointer group overflow-hidden relative"
                whileHover={{ 
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  whileHover={{ rotate: 15 }}
                  transition={{ duration: 0.2 }}
                >
                  <Zap className="w-4 h-4 relative z-10" />
                </motion.div>
                <span className="relative z-10">Create</span>
              </motion.button>
              
              <motion.button
                className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/80 text-sm hover:bg-white/[0.08] transition-all backdrop-blur-xl flex items-center gap-2 cursor-pointer group overflow-hidden relative"
                whileHover={{ 
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Search className="w-4 h-4 relative z-10" />
                </motion.div>
                <span className="relative z-10">Explore</span>
              </motion.button>
            </div>
            
            {user ? (
              <div className="flex items-center gap-3">
                <motion.div 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] backdrop-blur-xl"
                  whileHover={{ 
                    scale: 1.02, 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    y: -2,
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                </motion.div>
              </div>
            ) : (
              <motion.button
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500/80 to-blue-500/80 text-white text-sm font-medium cursor-pointer relative overflow-hidden group backdrop-blur-xl border border-white/10"
                whileHover={{ 
                  scale: 1.05,
                  y: -3,
                  boxShadow: "0 15px 35px rgba(0, 0, 0, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">Sign In</span>
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-xl"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 0.1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            )}
          </div>
          
          <motion.button
            onClick={toggleMenu}
            className="md:hidden p-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white cursor-pointer backdrop-blur-xl"
            whileTap={{ scale: 0.9 }}
            whileHover={{ 
              scale: 1.1,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              rotate: 180
            }}
            transition={{ duration: 0.3 }}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
        
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden mt-4 pt-4 border-t border-white/[0.1]"
              initial={{ height: 0, opacity: 0, y: -20 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              {user ? (
                <div className="flex flex-col gap-3">
                  <motion.div 
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] backdrop-blur-xl"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ 
                      scale: 1.02, 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      y: -2
                    }}
                  >
                  </motion.div>
                  
                  <div className="flex gap-3">
                    <motion.button 
                      className="flex-1 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white/80 text-sm hover:bg-white/[0.1] transition-all flex items-center justify-center gap-2 backdrop-blur-xl"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Zap className="w-4 h-4" />
                      Create
                    </motion.button>
                    <motion.button 
                      className="flex-1 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white/80 text-sm hover:bg-white/[0.1] transition-all flex items-center justify-center gap-2 backdrop-blur-xl"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Search className="w-4 h-4" />
                      Explore
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <motion.button 
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500/80 to-blue-500/80 text-white text-sm font-medium transition-all backdrop-blur-xl border border-white/10 relative overflow-hidden group"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10">Sign In</span>
                  </motion.button>
                  <div className="flex gap-3">
                    <motion.button 
                      className="flex-1 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white/80 text-sm hover:bg-white/[0.1] transition-all flex items-center justify-center gap-2 backdrop-blur-xl"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Zap className="w-4 h-4" />
                      Create
                    </motion.button>
                    <motion.button 
                      className="flex-1 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white/80 text-sm hover:bg-white/[0.1] transition-all flex items-center justify-center gap-2 backdrop-blur-xl"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Search className="w-4 h-4" />
                      Explore
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar