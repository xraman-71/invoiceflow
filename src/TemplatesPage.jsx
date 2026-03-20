import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
import { ALL_TEMPLATES, CATEGORIES } from './templates/allTemplates';

export default function TemplatesPage({ onSelectTemplate }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredId, setHoveredId] = useState(null);

  const filtered = useMemo(() => {
    return ALL_TEMPLATES.filter(t => {
      const matchCat = activeCategory === 'All' || t.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-5 mb-14"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 border border-primary/10 rounded-2xl text-[11px] font-display font-bold text-primary tracking-widest uppercase"
        >
          <Sparkles className="w-3 h-3" />
          50+ Professional Templates
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-display font-black tracking-tighter text-text-primary leading-none">
          Every Invoice,<br />
          <span className="bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">Perfectly Designed.</span>
        </h1>
        <p className="text-text-muted text-lg font-medium max-w-2xl mx-auto">
          Choose from 50+ industry-specific, pre-filled invoice templates. One click to customize and export.
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative max-w-lg mx-auto mb-8"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-black/[0.08] bg-white shadow-sm text-sm font-medium text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>

      {/* Category filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-nowrap md:flex-wrap md:justify-center gap-2 mb-12 overflow-x-auto pb-4 scrollbar-hide no-scrollbar -mx-6 px-6 md:mx-0 md:px-0"
      >
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-white border border-black/[0.08] text-text-muted hover:border-primary/30 hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Count */}
      <div className="flex items-center justify-between mb-6 px-1">
        <p className="text-sm text-text-muted font-medium">
          Showing <span className="text-text-primary font-bold">{filtered.length}</span> templates
        </p>
        {(searchQuery || activeCategory !== 'All') && (
          <button
            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear filters
          </button>
        )}
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((template, idx) => (
            <motion.div
              key={template.id}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.02, duration: 0.3 }}
              onMouseEnter={() => setHoveredId(template.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative bg-white border border-black/[0.07] rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-400"
              onClick={() => onSelectTemplate(template)}
            >
              {/* Color preview band */}
              <div
                className="h-32 w-full relative overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: template.accent }}
              >
                {/* Abstract preview */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <div className="w-40 h-40 rounded-full" style={{ backgroundColor: template.color }} />
                </div>
                <div className="relative z-10 space-y-2 w-[80%]">
                  {/* Mini invoice lines preview */}
                  <div className="flex items-center justify-between">
                    <div className="h-1.5 w-12 rounded-full bg-black/10" />
                  </div>
                  <div className="h-1 w-full rounded-full bg-black/[0.06]" />
                  <div className="h-1 w-4/5 rounded-full bg-black/[0.06]" />
                  <div className="mt-2 space-y-1">
                    {[1, 0.7, 0.5].map((op, i) => (
                      <div key={i} className="flex gap-2">
                        <div className="h-1 flex-1 rounded-full bg-black/[0.06]" style={{ opacity: op }} />
                        <div className="h-1 w-8 rounded-full" style={{ backgroundColor: template.color, opacity: op * 0.4 }} />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-1">
                    <div className="h-2 w-14 rounded" style={{ backgroundColor: template.color, opacity: 0.3 }} />
                  </div>
                </div>

                {/* Colored category name per user request */}
                <div 
                  className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-[0.2em] pointer-events-none"
                  style={{ color: template.color }}
                >
                  {template.category}
                </div>

                {/* Use button on hover */}
                <AnimatePresence>
                  {hoveredId === template.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]"
                    >
                      <div
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xl"
                        style={{ backgroundColor: template.color }}
                      >
                        Use Template <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Card body */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display font-bold text-text-primary text-sm leading-tight tracking-tight">
                      {template.name}
                    </h3>
                    <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">{template.desc}</p>
                  </div>
                  <div className="font-display font-black text-[10px] uppercase tracking-wider text-text-primary/30 flex-shrink-0 pt-1">
                    {template.type.code}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-black/[0.04]">
                  <span className="text-[10px] font-bold text-text-muted/60 uppercase tracking-widest">
                    {template.type.name.replace(' Invoice','').replace(' Note','')}
                  </span>
                  <button
                    className="flex items-center gap-1 text-[11px] font-bold transition-colors"
                    style={{ color: template.color }}
                    onClick={() => onSelectTemplate(template)}
                  >
                    Use <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 text-text-muted space-y-3"
        >
          <div className="text-4xl">🔍</div>
          <p className="font-bold text-text-primary">No templates found</p>
          <p className="text-sm">Try a different search term or category</p>
        </motion.div>
      )}
    </div>
  );
}
