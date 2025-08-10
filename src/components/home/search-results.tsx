'use client'

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchResults, usePastQuestionDetails, useSearchFilters } from '@/services/client/api'
import { SearchResultItem } from '@/types/db'
import { SearchParams } from '@/types/params'
import { useStore } from '@/lib/store'
import { 
  Search, 
  Filter, 
  Eye, 
  Calendar, 
  BookOpen, 
  Building, 
  Tag, 
  Clock, 
  FileText,
  X,
  ChevronDown,
  Loader2,
  Users,
  GraduationCap,
  Zap,
  ArrowRight
} from 'lucide-react'
import MarkdownPreview from '../markdown-previewer'
import { markdownToPlainText } from '@/lib/utils'

export interface SearchResultsRef {
  performSearch: (query: string) => void
}

const SearchResults = forwardRef<SearchResultsRef>((props, ref) => {
  const { searchQuery: globalSearchQuery } = useStore((state) => state)
  const [searchQuery, setSearchQuery] = useState(globalSearchQuery || '')
  const [filters, setFilters] = useState<SearchParams>({})
  const [showFilters, setShowFilters] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [showQuestionModal, setShowQuestionModal] = useState(false)

  // New: server-driven filter map
  const searchFilters = useSearchFilters()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    years: true,
    semesters: true,
    exam_types: true,
    types: true,
    sessions: false,
    courses: false,
    institutions: false,
    tags: false,
  })
  const [courseQuery, setCourseQuery] = useState('')
  const [institutionQuery, setInstitutionQuery] = useState('')
  const [tagQuery, setTagQuery] = useState('')
  const [tagIds, setTagIds] = useState<string[]>([])
  
  const searchResults = useSearchResults()
  const questionDetails = usePastQuestionDetails()

  useImperativeHandle(ref, () => ({
    performSearch: (query: string) => {
      setSearchQuery(query)
      handleSearch(query)
    }
  }))

  useEffect(() => {
    // Initial search and filters fetch
    handleSearch()
    searchFilters.mutate()
  }, [])

  const handleSearch = (query?: string) => {
    const searchParams: SearchParams = {
      q: query || searchQuery || undefined,
      ...filters
    }
    searchResults.mutate(searchParams)
  }

  const handleFilterChange = (key: keyof SearchParams, value: string) => {
    const newFilters = { ...filters }
    if (newFilters[key] === value) {
      delete newFilters[key]
    } else {
      ;(newFilters as any)[key] = value
    }
    setFilters(newFilters)

    const searchParams: SearchParams = {
      q: searchQuery || undefined,
      ...newFilters
    }
    searchResults.mutate(searchParams)
  }

  const toggleTag = (id: string) => {
    const next = tagIds.includes(id) ? tagIds.filter(t => t !== id) : [...tagIds, id]
    setTagIds(next)
    const newFilters = { ...filters }
    if (next.length) {
      ;(newFilters as any).tags = next.join(',')
    } else {
      delete (newFilters as any).tags
    }
    setFilters(newFilters)
    const searchParams: SearchParams = {
      q: searchQuery || undefined,
      ...newFilters
    }
    searchResults.mutate(searchParams)
  }

  // Add missing modal handlers
  const openQuestionModal = (questionId: string) => {
    setSelectedQuestion(questionId)
    setShowQuestionModal(true)
    questionDetails.mutate(questionId)
  }

  const closeQuestionModal = () => {
    setShowQuestionModal(false)
    setSelectedQuestion(null)
    questionDetails.reset()
  }

  const clearAllFilters = () => {
    setFilters({})
    setTagIds([])
    const searchParams: SearchParams = {
      q: searchQuery || undefined
    }
    searchResults.mutate(searchParams)
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'mcq': return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400'
      case 'essay': return 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400'
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/30 text-gray-400'
    }
  }

  const getExamTypeColor = (examType: string) => {
    switch (examType.toLowerCase()) {
      case 'final':
      case 'exam':
        return 'from-red-500/20 to-orange-500/20 border-red-500/30 text-red-400'
      case 'mid-term':
      case 'ca':
        return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30 text-yellow-400'
      case 'quiz': return 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400'
      default: return 'from-indigo-500/20 to-blue-500/20 border-indigo-500/30 text-indigo-400'
    }
  }

  const FiltersSectionHeader = ({
    icon: Icon,
    title,
    sectionKey
  }: { icon: any; title: string; sectionKey: keyof typeof expanded }) => (
    <button
      onClick={() => setExpanded(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }))}
      className="w-full flex items-center justify-between py-2 text-left"
    >
      <div className="flex items-center gap-2 text-white font-medium">
        <Icon className="w-4 h-4" /> {title}
      </div>
      <ChevronDown className={`w-4 h-4 transition-transform text-white/90 ${expanded[sectionKey] ? 'rotate-180' : ''}`} />
    </button>
  )

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-4 sm:px-6 pb-44 pt-32">
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Past Questions
            </h1>
            <p className="text-white/60 text-sm sm:text-base">
              Discover and explore thousands of past examination questions
            </p>
          </div>
          
          {/* Quick Stats */}
          <motion.div 
            className="flex gap-4 text-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-lg rounded-lg px-3 py-2 border border-white/10">
              <FileText className="w-4 h-4 text-blue-400" />
              <span className="text-white/80">
                {searchResults.data?.results?.length || 0} Results
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 space-y-4"
      >

        {/* Filter Toggle and Active Chips */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <motion.div
                animate={{ rotate: showFilters ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>

            {(Object.keys(filters).length > 0) && (
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full text-purple-400 text-sm"
                >
                  <Zap className="w-3 h-3" />
                  <span>{Object.keys(filters).length} active</span>
                </motion.div>
                <button onClick={clearAllFilters} className="text-xs text-white/60 hover:text-white underline-offset-4 hover:underline">Clear all</button>
              </div>
            )}
          </div>

          {/* Active filter chips */}
          {(filters.year || filters.semester || filters.session || filters.exam_type || filters.type || filters.course_id || filters.institution_id || tagIds.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {filters.year && (
                <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/80">Year: {filters.year}</span>
              )}
              {filters.semester && (
                <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/80">Semester: {filters.semester}</span>
              )}
              {filters.session && (
                <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/80">Session: {filters.session}</span>
              )}
              {filters.exam_type && (
                <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/80">Exam: {filters.exam_type}</span>
              )}
              {filters.type && (
                <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/80">Type: {filters.type}</span>
              )}
              {filters.course_id && (
                <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/80">Course selected</span>
              )}
              {filters.institution_id && (
                <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/80">Institution selected</span>
              )}
              {tagIds.length > 0 && (
                <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/80">Tags: {tagIds.length} selected</span>
              )}
            </div>
          )}
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Server-driven filters loading */}
                {searchFilters.isPending && (
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading filters…
                  </div>
                )}

                {/* Courses */}
                {searchFilters.data?.filters?.courses && (
                  <div>
                    <FiltersSectionHeader icon={BookOpen} title="Courses" sectionKey="courses" />
                    <AnimatePresence>
                      {expanded.courses && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                          <input
                            value={courseQuery}
                            onChange={(e) => setCourseQuery(e.target.value)}
                            placeholder="Search course…"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                          />
                          <div className="flex flex-wrap gap-2">
                            {searchFilters.data.filters.courses
                              .filter(c => !courseQuery || (c.name + ' ' + c.code).toLowerCase().includes(courseQuery.toLowerCase()))
                              .slice(0, 20)
                              .map((c) => (
                                <button
                                  key={c.id}
                                  onClick={() => handleFilterChange('course_id', c.id)}
                                  className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${filters.course_id === c.id ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'}`}
                                  title={`${c.name} (${c.code})`}
                                >
                                  <span className="font-medium">{c.code}</span> <span className="text-white/60">{c.count}</span>
                                </button>
                              ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Institutions */}
                {searchFilters.data?.filters?.institutions && (
                  <div>
                    <FiltersSectionHeader icon={Building} title="Institutions" sectionKey="institutions" />
                    <AnimatePresence>
                      {expanded.institutions && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                          <input
                            value={institutionQuery}
                            onChange={(e) => setInstitutionQuery(e.target.value)}
                            placeholder="Search institution…"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                          />
                          <div className="flex flex-wrap gap-2">
                            {searchFilters.data.filters.institutions
                              .filter(i => !institutionQuery || i.name.toLowerCase().includes(institutionQuery.toLowerCase()))
                              .slice(0, 20)
                              .map((i) => (
                                <button
                                  key={i.id}
                                  onClick={() => handleFilterChange('institution_id', i.id)}
                                  className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${filters.institution_id === i.id ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'}`}
                                  title={i.name}
                                >
                                  <span className="font-medium truncate max-w-[160px] inline-block align-middle">{i.name}</span> <span className="text-white/60">{i.count}</span>
                                </button>
                              ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Years */}
                {searchFilters.data?.filters?.years && (
                  <div>
                    <FiltersSectionHeader icon={Calendar} title="Year" sectionKey="years" />
                    <AnimatePresence>
                      {expanded.years && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                          <div className="flex flex-wrap gap-2">
                            {searchFilters.data.filters.years.map((y) => (
                              <button
                                key={y.value}
                                onClick={() => handleFilterChange('year', y.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${filters.year === y.value ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'}`}
                              >
                                {y.value} <span className="text-white/60">{y.count}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Semesters */}
                {searchFilters.data?.filters?.semesters && (
                  <div>
                    <FiltersSectionHeader icon={GraduationCap} title="Semester" sectionKey="semesters" />
                    <AnimatePresence>
                      {expanded.semesters && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                          <div className="flex flex-wrap gap-2">
                            {searchFilters.data.filters.semesters.map((s) => (
                              <button
                                key={s.value}
                                onClick={() => handleFilterChange('semester', s.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${filters.semester === s.value ? 'bg-pink-500/20 border-pink-500/50 text-pink-300' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'}`}
                              >
                                {s.label} <span className="text-white/60">{s.count}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Sessions */}
                {searchFilters.data?.filters?.sessions && (
                  <div>
                    <FiltersSectionHeader icon={Calendar} title="Session" sectionKey="sessions" />
                    <AnimatePresence>
                      {expanded.sessions && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                          <div className="flex flex-wrap gap-2">
                            {searchFilters.data.filters.sessions.map((s) => (
                              <button
                                key={s.value}
                                onClick={() => handleFilterChange('session', s.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${filters.session === s.value ? 'bg-teal-500/20 border-teal-500/50 text-teal-300' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'}`}
                              >
                                {s.value} <span className="text-white/60">{s.count}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Exam Types */}
                {searchFilters.data?.filters?.exam_types && (
                  <div>
                    <FiltersSectionHeader icon={FileText} title="Exam Type" sectionKey="exam_types" />
                    <AnimatePresence>
                      {expanded.exam_types && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                          <div className="flex flex-wrap gap-2">
                            {searchFilters.data.filters.exam_types.map((e) => (
                              <button
                                key={e.value}
                                onClick={() => handleFilterChange('exam_type', e.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${filters.exam_type === e.value ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'}`}
                              >
                                {e.label} <span className="text-white/60">{e.count}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Types */}
                {searchFilters.data?.filters?.types && (
                  <div>
                    <FiltersSectionHeader icon={Tag} title="Question Type" sectionKey="types" />
                    <AnimatePresence>
                      {expanded.types && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                          <div className="flex flex-wrap gap-2">
                            {searchFilters.data.filters.types.map((t) => (
                              <button
                                key={t.value}
                                onClick={() => handleFilterChange('type', t.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${filters.type === (t.value as any) ? 'bg-orange-500/20 border-orange-500/50 text-orange-300' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'}`}
                              >
                                {t.label} <span className="text-white/60">{t.count}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Tags */}
                {searchFilters.data?.filters?.tags && (
                  <div>
                    <FiltersSectionHeader icon={Tag} title="Tags" sectionKey="tags" />
                    <AnimatePresence>
                      {expanded.tags && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                          <input
                            value={tagQuery}
                            onChange={(e) => setTagQuery(e.target.value)}
                            placeholder="Search tags…"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                          />
                          <div className="flex flex-wrap gap-2">
                            {searchFilters.data.filters.tags
                              .filter(t => !tagQuery || t.name.toLowerCase().includes(tagQuery.toLowerCase()))
                              .slice(0, 30)
                              .map((t) => (
                                <button
                                  key={t.id}
                                  onClick={() => toggleTag(t.id)}
                                  className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${tagIds.includes(t.id) ? 'bg-sky-500/20 border-sky-500/50 text-sky-300' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'}`}
                                >
                                  {t.name} <span className="text-white/60">{t.count}</span>
                                </button>
                              ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results */}
      <div className="flex-1">
        {searchResults.isPending ? (
          <div className="flex items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full"
            />
          </div>
        ) : searchResults.error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Search Error</h3>
            <p className="text-white/60 mb-4">Failed to fetch search results. Please try again.</p>
            <motion.button
              onClick={() => handleSearch()}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Retry Search
            </motion.button>
          </motion.div>
        ) : !searchResults.data?.results?.length ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-gray-500/10 border border-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
            <p className="text-white/60 mb-4">Try adjusting your search query or filters</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4 sm:gap-6"
          >
            {searchResults.data.results.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden break-words"
                whileHover={{ scale: 1.01 }}
              >
                {/* Question Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {/* Question Type Badge */}
                      <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r border ${getTypeColor(question.type)}`}>
                        {question.type.toUpperCase()}
                      </div>
                      
                      {/* Exam Type Badge */}
                      <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r border ${getExamTypeColor(question.exam_type)}`}>
                        {question.exam_type}
                      </div>
                      
                      {/* Year Badge */}
                      <div className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400">
                        {question.year}
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="flex items-start gap-3 mb-3">
                      <BookOpen className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0">
                        <span className="text-white font-medium truncate">{question.course.name}</span>
                        <span className="text-white/60 text-sm">({question.course.code})</span>
                      </div>
                    </div>

                    {/* Institution */}
                    <div className="flex items-start gap-3 mb-4">
                      <Building className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80 truncate">{question.institution.name}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex sm:flex-col gap-3 sm:gap-2 text-right">
                    <div className="flex items-center gap-2 text-white/60 text-xs sm:text-sm">
                      <Users className="w-4 h-4" />
                      <span>{question.views_count} views</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60 text-xs sm:text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{question.semester} Semester</span>
                    </div>
                  </div>
                </div>

                {/* Question Preview */}
                <div className="mb-4">
                    <p className="text-white/90 line-clamp-3 text-sm sm:text-base leading-relaxed break-all break-words whitespace-pre-wrap">
                    {markdownToPlainText(question.text)}
                    </p>
                </div>

                {/* Tags */}
                {question.tags && question.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {question.tags.slice(0, 3).map((tag, tagIndex) => (
                      <div
                        key={tagIndex}
                        className="flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[11px] sm:text-xs text-white/70"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </div>
                    ))}
                    {question.tags.length > 3 && (
                      <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[11px] sm:text-xs text-white/70">
                        +{question.tags.length - 3} more
                      </div>
                    )}
                  </div>
                )}

                {/* View Button */}
                <motion.button
                  onClick={() => openQuestionModal(question.id)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Eye className="w-4 h-4" />
                  <span className="font-medium ">View Question</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform hidden sm:block" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Question Detail Modal */}
      <AnimatePresence>
        {showQuestionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4"
            onClick={closeQuestionModal}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-2.5 sm:p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">Question Details</h2>
                <motion.button
                  onClick={closeQuestionModal}
                  className="p-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Modal Content */}
              <div className="p-2.5 sm:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {questionDetails.isPending ? (
                  <div className="flex items-center justify-center py-16">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full"
                    />
                  </div>
                ) : questionDetails.error ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <X className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Error Loading Question</h3>
                    <p className="text-white/60">Failed to load question details.</p>
                  </div>
                ) : questionDetails.data ? (
                  <div className="space-y-6">
                    {/* Question Meta */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="w-4 h-4 text-blue-400" />
                          <span className="text-white/60 text-sm">Course</span>
                        </div>
                        <p className="text-white font-medium">{questionDetails.data.course.name}</p>
                        <p className="text-white/60 text-sm">({questionDetails.data.course.code})</p>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <span className="text-white/60 text-sm">Year & Semester</span>
                        </div>
                        <p className="text-white font-medium">{questionDetails.data.year}</p>
                        <p className="text-white/60 text-sm">{questionDetails.data.semester} Semester</p>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-green-400" />
                          <span className="text-white/60 text-sm">Type</span>
                        </div>
                        <p className="text-white font-medium">{questionDetails.data.type.toUpperCase()}</p>
                        <p className="text-white/60 text-sm">{questionDetails.data.exam_type}</p>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-orange-400" />
                          <span className="text-white/60 text-sm">Views</span>
                        </div>
                        <p className="text-white font-medium">{questionDetails.data.views_count}</p>
                        <p className="text-white/60 text-sm">total views</p>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="bg-white/5 rounded-lg p-2.5 sm:p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Question</h3>
                      <div className="prose prose-invert max-w-none">
                        <MarkdownPreview content={questionDetails.data.text} />
                      </div>
                    </div>

                    {/* AI Overview */}
                    {questionDetails.data.ai_overview && (
                      <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-2.5 sm:p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-purple-400" />
                          AI Overview
                        </h3>
                        <div className="prose prose-invert max-w-none">
                          <MarkdownPreview content={questionDetails.data.ai_overview} />
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {questionDetails.data.tags && questionDetails.data.tags.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {questionDetails.data.tags.map((tag, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/80"
                            >
                              <Tag className="w-3 h-3" />
                              {tag}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

SearchResults.displayName = 'SearchResults'

export default SearchResults