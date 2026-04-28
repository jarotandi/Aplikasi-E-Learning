import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PROGRAMS } from '../constants';
import { View } from '../types';
import { ArrowRight, CheckCircle2, Search, Filter, Sparkles, BookOpen, Clock, Users } from 'lucide-react';

interface ProgramListingPageProps {
  setView: (v: View) => void;
  setSelectedProgramId: (id: string) => void;
}

export const ProgramListingPage: React.FC<ProgramListingPageProps> = ({ setView, setSelectedProgramId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'Semua' | 'Akademik' | 'Kedinasan' | 'CPNS'>('Semua');

  const categories = ['Semua', 'Akademik', 'Kedinasan', 'CPNS'];

  const filteredPrograms = useMemo(() => {
    return PROGRAMS.filter(program => {
      const matchesSearch = program.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             program.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'Semua' || program.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-blue/10 rounded-full text-brand-blue text-[10px] font-black uppercase tracking-[0.2em] mb-6"
          >
            <Sparkles size={14} className="animate-pulse" />
            Curated Programs
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-brand-navy mb-6 tracking-tighter"
          >
            Pilih Masa Depanmu <span className="text-brand-blue italic relative">
              Mulai Sekarang
              <svg className="absolute -bottom-2 left-0 w-full h-2 text-brand-orange/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
              </svg>
            </span>
          </motion.h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Berbagai pilihan program bimbingan belajar terbaik yang dirancang secara khusus untuk membantu kamu mencapai skor impian dan kampus idaman.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 mb-12 flex flex-col md:flex-row items-center gap-6">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-blue transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Cari program impianmu..." 
              className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl outline-none font-medium text-slate-700 transition-all focus:bg-white focus:ring-2 focus:ring-brand-blue/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex bg-slate-50 p-1.5 rounded-2xl overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeCategory === cat 
                    ? 'bg-white text-brand-blue shadow-md' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPrograms.map((program, i) => (
              <motion.div
                layout
                key={program.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="card-premium overflow-hidden flex flex-col h-full bg-white group cursor-pointer border border-slate-100 hover:border-brand-blue/30"
                onClick={() => {
                  setSelectedProgramId(program.id);
                  setView('programDetail');
                }}
              >
                <div className="h-56 relative overflow-hidden">
                  <img src={program.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={program.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black text-brand-blue uppercase tracking-widest shadow-sm">
                      {program.category}
                    </span>
                    <span className="px-3 py-1 bg-brand-orange/90 backdrop-blur-sm rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-sm">
                      POPULAR
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex -space-x-2">
                       {[1,2,3].map(j => <img key={j} src={`https://i.pravatar.cc/100?u=${program.id}${j}`} className="w-6 h-6 rounded-full border-2 border-white" alt="" />)}
                    </div>
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">120+ Enrolled</span>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-brand-navy mb-3 group-hover:text-brand-blue transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-8 flex-1">
                    {program.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-2 text-slate-400">
                      <BookOpen size={14} className="text-brand-blue" />
                      <span className="text-[10px] font-bold uppercase tracking-tight">40+ Lessons</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock size={14} className="text-brand-blue" />
                      <span className="text-[10px] font-bold uppercase tracking-tight">3 Months</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Mulai Dari</p>
                      <p className="text-xl font-black text-brand-navy">{program.price}</p>
                    </div>
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white group-hover:rotate-45 transition-all duration-500 shadow-sm">
                      <ArrowRight size={24} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPrograms.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <Search size={40} />
            </div>
            <h3 className="text-xl font-bold text-brand-navy mb-2">Program Tidak Ditemukan</h3>
            <p className="text-slate-500">Coba gunakan kata kunci pencarian yang lain.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
