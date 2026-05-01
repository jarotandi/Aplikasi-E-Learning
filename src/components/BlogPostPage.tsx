import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Calendar, User, Facebook, MessageCircle, Bookmark, Twitter, BookOpen, ChevronRight, GraduationCap, Tags } from 'lucide-react';
import { BLOG_POSTS } from '../constants';
import { BlogPost, View } from '../types';
import Markdown from 'react-markdown';

interface BlogPostPageProps {
  blogId: string | null;
  setView: (v: View) => void;
  setSelectedBlogId?: (id: string) => void;
  posts?: BlogPost[];
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ blogId, setView, setSelectedBlogId, posts = BLOG_POSTS }) => {
  const post = posts.find(p => p.id === blogId);
  const headings = React.useMemo(() => {
    if (!post) return [];
    return [...post.content.matchAll(/^##\s+(.+)$/gm)].map((match) => {
      const title = match[1].trim();
      return {
        title,
        id: title.toLowerCase().replace(/[^a-z0-9\s-]/gi, '').trim().replace(/\s+/g, '-')
      };
    });
  }, [post]);
  const categories = React.useMemo(() => Array.from(new Set(posts.map((item) => item.category))), [posts]);
  const guidePosts = React.useMemo(() => posts.filter((item) => item.id !== post?.id).slice(0, 5), [posts, post?.id]);
  const markdownWithAnchors = React.useMemo(() => {
    if (!post) return '';
    return post.content.replace(/^##\s+(.+)$/gm, (_, title) => {
      const id = String(title).toLowerCase().replace(/[^a-z0-9\s-]/gi, '').trim().replace(/\s+/g, '-');
      return `## <span id="${id}"></span>${title}`;
    });
  }, [post]);

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
      <div className="max-w-7xl mx-auto px-6 -mt-32 pb-40 relative z-10 grid lg:grid-cols-[48px_minmax(0,1fr)_320px] gap-8 lg:gap-10">
        {/* Social Sticky Sidebar */}
        <div className="hidden md:block w-12 sticky top-32 h-fit space-y-4">
           <button className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-brand-blue transition-all border border-slate-100"><Facebook size={20} /></button>
           <button className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-brand-blue transition-all border border-slate-100"><Twitter size={20} /></button>
           <button className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-brand-blue transition-all border border-slate-100"><MessageCircle size={20} /></button>
           <div className="w-full h-px bg-slate-100 my-4" />
           <button className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-brand-orange transition-all border border-slate-100"><Bookmark size={20} /></button>
        </div>

        <motion.article 
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
           className="flex-1 bg-white rounded-[3.5rem] p-8 md:p-16 shadow-2xl shadow-slate-200/50 border border-slate-100"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] aspect-video mb-10 bg-slate-100">
            <img src={post.image} className="w-full h-full object-cover" alt={post.title} />
          </div>

          {headings.length > 0 && (
            <div className="mb-10 p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={18} className="text-brand-blue" />
                <h2 className="text-sm font-black text-brand-navy uppercase tracking-widest">Daftar Isi</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                {headings.map((heading, index) => (
                  <a key={heading.id} href={`#${heading.id}`} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 text-xs font-bold text-slate-600 hover:text-brand-blue hover:border-brand-blue/30 transition-all">
                    <span className="w-6 h-6 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center text-[10px] font-black">{index + 1}</span>
                    {heading.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="markdown-body prose prose-slate prose-lg max-w-none">
             <Markdown>{markdownWithAnchors}</Markdown>
          </div>

          <div className="my-14 p-8 rounded-[2rem] bg-brand-navy text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-blue/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-2">Bimbel The Prams</p>
                <h3 className="text-2xl font-black mb-2">Butuh roadmap belajar yang lebih terarah?</h3>
                <p className="text-sm text-white/70 leading-relaxed max-w-xl">Ikuti tryout gratis, lihat analisis kelemahanmu, lalu pilih program belajar yang sesuai target.</p>
              </div>
              <button onClick={() => setView('guestRegistration')} className="px-6 py-3 rounded-xl bg-brand-orange text-white text-xs font-black uppercase tracking-widest whitespace-nowrap">
                Mulai Tryout Gratis
              </button>
            </div>
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
        </motion.article>

        <aside className="lg:sticky lg:top-28 h-fit space-y-6">
          <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center gap-2 mb-5">
              <GraduationCap size={18} className="text-brand-blue" />
              <h3 className="text-sm font-black text-brand-navy uppercase tracking-widest">Panduan Lengkap</h3>
            </div>
            <div className="space-y-3">
              {guidePosts.map((guide) => (
                <button
                  key={guide.id}
                  onClick={() => { setSelectedBlogId?.(guide.id); setView('blogPost'); }}
                  className="w-full text-left p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-brand-blue/30 group transition-all"
                >
                  <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-1">{guide.category}</p>
                  <p className="text-xs font-bold text-brand-navy leading-snug group-hover:text-brand-blue">{guide.title}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center gap-2 mb-5">
              <Tags size={18} className="text-brand-orange" />
              <h3 className="text-sm font-black text-brand-navy uppercase tracking-widest">Kategori Tulisan</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setView('blogListing')}
                  className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${category === post.category ? 'bg-brand-blue text-white border-brand-blue' : 'bg-slate-50 text-slate-500 border-slate-100 hover:text-brand-blue'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </aside>
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
               {posts.filter(p => p.id !== post.id).slice(0, 3).map(related => (
                 <div 
                   key={related.id} 
                   className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/40 border border-slate-100 group cursor-pointer"
                   onClick={() => { setSelectedBlogId?.(related.id); setView('blogPost'); }}
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
