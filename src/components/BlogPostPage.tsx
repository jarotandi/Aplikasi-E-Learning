import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Calendar, User, Share2, Facebook, MessageCircle, MoreHorizontal, Bookmark, Twitter } from 'lucide-react';
import { BLOG_POSTS } from '../constants';
import { View } from '../types';
import Markdown from 'react-markdown';

interface BlogPostPageProps {
  blogId: string | null;
  setView: (v: View) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ blogId, setView }) => {
  const post = BLOG_POSTS.find(p => p.id === blogId);

  if (!post) {
    return (
      <div className="pt-40 text-center pb-40">
        <h2 className="text-2xl font-bold text-brand-navy">Artikel tidak ditemukan</h2>
        <button onClick={() => setView('blogListing')} className="mt-4 text-brand-blue font-bold">Kembali ke Blog</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Article Header */}
      <div className="relative pt-32 pb-40 lg:pb-64 bg-slate-900 overflow-hidden">
        <img 
          src={post.image} 
          className="absolute inset-0 w-full h-full object-cover opacity-30 scale-110 blur-sm" 
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-white" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setView('blogListing')}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-10 font-bold transition-colors group"
          >
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Blog
          </motion.button>

          <div className="space-y-6">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-block px-4 py-1.5 bg-brand-blue text-white text-[10px] font-black uppercase tracking-widest rounded-lg"
            >
               {post.category}
            </motion.div>
            
            <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter"
            >
               {post.title}
            </motion.h1>
            
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="flex flex-wrap items-center gap-8 text-white/60 text-sm font-bold uppercase tracking-widest"
            >
               <span className="flex items-center gap-2"><Calendar size={18} className="text-brand-blue" /> {post.date}</span>
               <span className="flex items-center gap-2"><Clock size={18} className="text-brand-blue" /> {post.readTime}</span>
               <span className="flex items-center gap-2"><User size={18} className="text-brand-blue" /> {post.author}</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-32 pb-40 relative z-10 flex flex-col md:flex-row gap-12">
        {/* Social Sticky Sidebar */}
        <div className="hidden md:block w-12 sticky top-32 h-fit space-y-4">
           <button className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-brand-blue transition-all border border-slate-100"><Facebook size={20} /></button>
           <button className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-brand-blue transition-all border border-slate-100"><Twitter size={20} /></button>
           <button className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-brand-blue transition-all border border-slate-100"><MessageCircle size={20} /></button>
           <div className="w-full h-px bg-slate-100 my-4" />
           <button className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-brand-orange transition-all border border-slate-100"><Bookmark size={20} /></button>
        </div>

        <motion.div 
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
           className="flex-1 bg-white rounded-[3.5rem] p-8 md:p-16 shadow-2xl shadow-slate-200/50 border border-slate-100"
        >
          <div className="markdown-body prose prose-slate prose-lg max-w-none">
             <Markdown>{post.content}</Markdown>
          </div>

          {/* Tags */}
          <div className="mt-16 pt-10 border-t border-slate-100 flex flex-wrap gap-3">
             {post.tags.map(tag => (
               <span key={tag} className="px-4 py-2 bg-slate-50 text-slate-500 text-xs font-bold rounded-xl border border-slate-100">
                  #{tag}
               </span>
             ))}
          </div>

          {/* Author Card */}
          <div className="mt-16 p-10 bg-slate-50 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 border border-slate-100">
             <img src={post.authorAvatar} className="w-24 h-24 rounded-full border-4 border-white shadow-xl" alt="" />
             <div className="text-center md:text-left flex-1">
                <p className="text-[10px] text-brand-blue font-black uppercase tracking-widest mb-1">Ditulis oleh</p>
                <h4 className="text-2xl font-black text-brand-navy mb-2">{post.author}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">
                   {post.authorRole} at The Prams. Berdedikasi dalam mencetak generasi cerdas dan berintegritas untuk masa depan Indonesia.
                </p>
             </div>
             <button className="px-6 py-3 bg-white text-brand-navy border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-navy hover:text-white transition-all shadow-sm">
                Lihat Profil
             </button>
          </div>
        </motion.div>
      </div>

      {/* Related Articles */}
      <section className="bg-slate-50 py-24">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-12">
               <h2 className="text-3xl font-black text-brand-navy tracking-tight">Artikel Terkait</h2>
               <button onClick={() => setView('blogListing')} className="text-brand-blue font-black text-sm flex items-center gap-2 hover:translate-x-2 transition-transform">
                  Lihat Semua <ArrowLeft className="rotate-180" size={18} />
               </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
               {BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 3).map(related => (
                 <div 
                   key={related.id} 
                   className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/40 border border-slate-100 group cursor-pointer"
                   onClick={() => { setView('blogPost'); }} // Note: in real app would set state
                 >
                    <div className="relative overflow-hidden rounded-[2rem] aspect-video mb-6">
                       <img src={related.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="" />
                    </div>
                    <h4 className="text-xl font-black text-brand-navy group-hover:text-brand-blue transition-colors leading-tight mb-4">{related.title}</h4>
                    <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <span>{related.date}</span>
                       <span className="px-3 py-1 bg-slate-50 rounded-lg text-brand-blue">{related.category}</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};
