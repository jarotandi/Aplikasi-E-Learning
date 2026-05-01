import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Calendar, User, ArrowRight, BookOpen, Clock, Tag, ChevronRight } from 'lucide-react';
import { BLOG_POSTS } from '../constants';
import { View, BlogPost } from '../types';

interface BlogListingPageProps {
  setView: (v: View) => void;
  setSelectedBlogId: (id: string) => void;
  posts?: BlogPost[];
}

export const BlogListingPage: React.FC<BlogListingPageProps> = ({ setView, setSelectedBlogId, posts = BLOG_POSTS }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Tips & Trik', 'Info PTN', 'Materi', 'Inspirasi', 'Literasi'];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Semua' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = posts[0];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-brand-blue rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-brand-orange rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-black uppercase tracking-widest mb-6"
            >
               <BookOpen size={14} /> Blog & Artikel Edukasi
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-brand-navy mb-8 tracking-tighter leading-none"
            >
              Wawasan <span className="text-brand-blue">Baru</span> untuk Masa Depanmu
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-500 leading-relaxed max-w-2xl"
            >
              Dapatkan tips bimbingan belajar terbaru, info PTN terkini, dan materi esensial langsung dari para pakar di The Prams.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat 
                    ? 'bg-brand-navy text-white shadow-xl shadow-brand-navy/20 scale-105' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative max-w-md w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari artikel..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-200 focus:border-brand-blue outline-none transition-all shadow-sm font-medium"
            />
          </div>
        </div>

        {/* Featured Post (Visible when no search/filter) */}
        {searchTerm === '' && activeCategory === 'Semua' && featuredPost && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20 grid lg:grid-cols-2 gap-10 items-center bg-slate-50 rounded-[3.5rem] p-8 lg:p-12 border border-slate-100 group cursor-pointer"
            onClick={() => { setSelectedBlogId(featuredPost.id); setView('blogPost'); }}
          >
            <div className="relative overflow-hidden rounded-[2.5rem] aspect-square lg:aspect-video lg:h-full">
               <img src={featuredPost.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={featuredPost.title} />
               <div className="absolute top-6 left-6 px-4 py-2 bg-brand-blue text-white text-xs font-black rounded-xl uppercase tracking-widest">
                  Featured Article
               </div>
            </div>
            
            <div className="space-y-6">
               <div className="flex items-center gap-6 text-slate-400 text-sm font-bold uppercase tracking-widest">
                  <span className="text-brand-blue">{featuredPost.category}</span>
                  <span className="flex items-center gap-2"><Clock size={16} /> {featuredPost.readTime}</span>
               </div>
               
               <h2 className="text-3xl lg:text-5xl font-black text-brand-navy leading-tight group-hover:text-brand-blue transition-colors">
                  {featuredPost.title}
               </h2>
               
               <p className="text-lg text-slate-500 leading-relaxed">
                  {featuredPost.excerpt}
               </p>
               
               <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                  <img src={featuredPost.authorAvatar} className="w-12 h-12 rounded-full border-2 border-white shadow-md" alt="" />
                  <div>
                    <p className="font-bold text-brand-navy">{featuredPost.author}</p>
                    <p className="text-xs text-slate-400 font-medium">{featuredPost.authorRole}</p>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => { setSelectedBlogId(post.id); setView('blogPost'); }}
              className="flex flex-col group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-[2.5rem] aspect-video mb-8">
                <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-xs font-black text-brand-navy uppercase tracking-widest">
                   {post.category}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">
                 <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
                 <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                 <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime}</span>
              </div>
              
              <h3 className="text-2xl font-black text-brand-navy mb-4 leading-tight group-hover:text-brand-blue transition-colors">
                {post.title}
              </h3>
              
              <p className="text-slate-500 mb-8 line-clamp-3">
                {post.excerpt}
              </p>
              
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <img src={post.authorAvatar} className="w-8 h-8 rounded-full" alt="" />
                   <p className="text-xs font-bold text-slate-500">{post.author}</p>
                </div>
                <div className="text-brand-blue font-black text-[10px] uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                   Selengkapnya <ChevronRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
               <Search size={40} />
            </div>
            <h3 className="text-2xl font-bold text-brand-navy mb-2">Ops! Artikel tidak ditemukan</h3>
            <p className="text-slate-500">Coba gunakan kata kunci lain atau ubah filter kategori.</p>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <section className="bg-brand-navy py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-blue/5 -skew-x-12 translate-x-1/4" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
           <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Ketinggalan update?</h2>
           <p className="text-xl text-slate-400 mb-12">Berlangganan newsletter kami dan dapatkan update materi mingguan langsung ke emailmu.</p>
           
           <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Masukkan alamat email..." 
                className="flex-1 px-8 py-5 rounded-2xl bg-white/10 border border-white/10 text-white outline-none focus:border-brand-blue transition-all"
              />
              <button className="bg-brand-blue text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-2xl shadow-brand-blue/20">
                 Daftar Sekarang
              </button>
           </form>
           <p className="text-slate-500 text-xs mt-6">Kami menghargai privasimu. Bisa berhenti berlangganan kapan saja.</p>
        </div>
      </section>
    </div>
  );
};
