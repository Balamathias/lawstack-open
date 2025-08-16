'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'

import {
    Home, 
    Zap, 
    Star, 
    Settings, 
    User as UserIcon, 
    BookOpen, 
    TrendingUp, 
    Heart,
    MessageSquare,
    Scale,
    Search
} from 'lucide-react'
import { useStore } from '@/lib/store'

interface SidebarProps {
    className?: string;
    user?: null;
}

const Sidebar = ({ className = '', user }: SidebarProps) => {
    
    const searchParams = useSearchParams()
    const router = useRouter()
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    const { setAction } = useStore((state) => state)


    useEffect(() => {
        const action = searchParams.get('action')
        if (action) {
            setAction(action as any)
        }
    }, [searchParams, setAction])
    
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
    
    const navigationItems = [
        { icon: Home, label: 'Home', path: '?action=none', active: !searchParams.get('action') || searchParams.get('action') === 'none' },
        { icon: Zap, label: 'Ask', path: '?action=chat', active: searchParams.get('action') === 'chat' },
        { icon: Search, label: 'Search', path: '?action=search', active: searchParams.get('action') === 'search' },
        { icon: TrendingUp, label: 'Trending', path: '?action=trending', active: searchParams.get('action') === 'trending' },
        { icon: BookOpen, label: 'Library', path: '?action=library', active: searchParams.get('action') === 'library' },
        { icon: Heart, label: 'Favorites', path: '?action=favorites', active: searchParams.get('action') === 'favorites' },
        { icon: MessageSquare, label: 'Chat', path: '?action=message', active: searchParams.get('action') === 'message' },
    ]
    
    const bottomItems = [
        { icon: Settings, label: 'Settings', path: '?tab=settings', active: searchParams.get('tab') === 'settings' },
        { icon: UserIcon, label: 'Profile', path: '?tab=profile', active: searchParams.get('tab') === 'profile' },
    ]
    
    return (
        <motion.aside 
            className={`hidden lg:flex fixed left-3 top-20 bottom-3 w-64 z-40 backdrop-blur-2xl bg-white/[0.02] border border-white/[0.08] rounded-3xl shadow-2xl flex-col overflow-hidden ${className}`}
            initial={{ x: -100, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ 
                duration: 1.2, 
                ease: [0.16, 1, 0.3, 1],
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0.2 
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
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full"
                        initial={{ 
                            x: Math.random() * 256,
                            y: Math.random() * 600,
                            opacity: 0 
                        }}
                        animate={{ 
                            x: Math.random() * 256,
                            y: Math.random() * 600,
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
            
            <div className="relative flex flex-col h-full p-6">
                {/* Logo section */}
                <motion.div 
                    className="flex items-center gap-3 mb-8 cursor-pointer group"
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
                    <div>
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

                {/* User profile section */}
                {user && (
                    <motion.div 
                        className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl relative overflow-hidden group"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        whileHover={{ 
                            scale: 1.02, 
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            y: -2,
                            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)"
                        }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100"
                            transition={{ duration: 0.3 }}
                        />
                        <div className="flex items-center gap-3 relative z-10">
                            
                        </div>
                    </motion.div>
                )}
                
                {/* Main navigation */}
                <nav className="flex-1 space-y-2">
                    {navigationItems.map((item, index) => (
                        <motion.button
                            key={item.path}
                            onClick={() => history.pushState(null, '', item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative overflow-hidden group cursor-pointer ${
                                item.active 
                                    ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 text-white shadow-lg' 
                                    : 'text-white/70 hover:text-white '
                            }`}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                            whileHover={{ 
                                scale: 1.02, 
                                x: 4,
                                y: -2,
                                // boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)"
                            }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <motion.div
                                className={`absolute inset-0 ${
                                    item.active 
                                        ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30' 
                                        : ''
                                } opacity-0 group-hover:opacity-100`}
                                transition={{ duration: 0.3 }}
                            />
                            <motion.div
                                whileHover={{ scale: 1.2, rotate: item.active ? 5 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="relative z-10"
                            >
                                <item.icon className="w-4 h-4" />
                            </motion.div>
                            <span className="relative z-10">{item.label}</span>
                        </motion.button>
                    ))}
                </nav>
                
                {/* Stats section - only show if user is logged in */}
                {user && (
                    <motion.div 
                        className="my-6 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl relative overflow-hidden group"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        whileHover={{ 
                            scale: 1.02,
                            y: -2,
                            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)"
                        }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100"
                            transition={{ duration: 0.3 }}
                        />
                        <h3 className="text-white/80 font-medium text-sm mb-3 relative z-10">Your Stats</h3>
                        <div className="space-y-2 relative z-10">
                            <motion.div 
                                className="flex justify-between items-center"
                                whileHover={{ x: 2 }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className="text-white/60 text-xs">Apps Created</span>
                                <span className="text-white text-xs font-medium">12</span>
                            </motion.div>
                            <motion.div 
                                className="flex justify-between items-center"
                                whileHover={{ x: 2 }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className="text-white/60 text-xs">Total Views</span>
                                <span className="text-white text-xs font-medium">2.4k</span>
                            </motion.div>
                            <motion.div 
                                className="flex justify-between items-center"
                                whileHover={{ x: 2 }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className="text-white/60 text-xs">Favorites</span>
                                <span className="text-white text-xs font-medium">89</span>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
                
                {/* Bottom navigation */}
                <div className="space-y-2 pt-4 border-t border-white/[0.08]">
                    {bottomItems.map((item, index) => (
                        <motion.button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.1] transition-all backdrop-blur-xl relative overflow-hidden group"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: (navigationItems.length + index) * 0.1 + 0.4 }}
                            whileHover={{ 
                                scale: 1.02, 
                                x: 4,
                                y: -2,
                                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)"
                            }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100"
                                transition={{ duration: 0.3 }}
                            />
                            <motion.div
                                whileHover={{ scale: 1.2 }}
                                transition={{ duration: 0.2 }}
                                className="relative z-10"
                            >
                                <item.icon className="w-4 h-4" />
                            </motion.div>
                            <span className="relative z-10">{item.label}</span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </motion.aside>
    )
}

export default Sidebar