import React, { useState } from 'react';
import { 
  Star, 
  Quote, 
  Filter, 
  ChevronRight, 
  CheckCircle2, 
  Trophy,
  Users,
  Award,
  GraduationCap,
  X,
  Plus,
  Send,
  Image as ImageIcon
} from 'lucide-react';
import { TESTIMONIALS, PROGRAMS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { View, Testimonial } from '../types';

export const TestimonialsPage: React.FC<{ setView: (v: View) => void }> = ({ setView }) => {
  const [filter, setFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const categories = ['All', ...PROGRAMS.map(p => p.id)];

  const filteredTestimonials = TESTIMONIALS.filter(t => {
    if (t.status !== 'Approved') return false;
    if (filter === 'All') return true;
    return t.programId === filter;
  });

  const stats = [
    { label: 'Siswa Lolos', value: '1.200+', icon: GraduationCap },
    { label: 'Rating Puas', value: '4.9/5.0', icon: Star },
    { label: 'Mentor Expert', value: '45+', icon: Users },
    { label: 'Program Unggulan', value: '12', icon: Award },
  ];

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-brand-navy py-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-blue/10 skew-x-12 transform translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tighter">
              Kisah Sukses <span className="text-brand-blue">Sang Juara</span>
            </h1>
            <p className="text-xl text-white/70 mb-10 leading-relaxed">
              Dengarkan langsung cerita mereka yang telah berhasil mewujudkan mimpi masuk kampus impian dan instansi idaman bersama The Prams.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setIsFormOpen(true)} 
                className="btn-primary bg-brand-orange hover:bg-orange-600 px-8 py-4 flex items-center gap-2"
              >
                <Plus size={20} /> Tulis Testimonimu
              </button>
              <button onClick={() => setView('programDetail')} className="btn-secondary border-white/20 text-white hover:bg-white/10 px-8 py-4">
                Lihat Program
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-white border-b border-slate-100 py-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="p-3 bg-blue-50 rounded-2xl text-brand-blue">
                    <stat.icon size={24} />
                  </div>
                </div>
                <p className="text-3xl font-black text-brand-navy">{stat.value}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-brand-navy mb-2">Semua Testimoni</h2>
              <p className="text-slate-500">Menampilkan {filteredTestimonials.length} cerita inspiratif dari alumni kami.</p>
            </div>
            <div className="flex items-center gap-3 p-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto max-w-full">
              <Filter size={18} className="text-slate-400 ml-2" />
              <div className="flex gap-1 whitespace-nowrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    {cat === 'All' ? 'Semua' : PROGRAMS.find(p => p.id === cat)?.title || cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredTestimonials.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={`card-premium group hover:border-brand-blue transition-all duration-500 cursor-pointer ${expandedId === t.id ? 'ring-2 ring-brand-blue border-brand-blue' : ''}`}
                  onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
                >
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="relative">
                        <img 
                          src={t.image} 
                          className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50 group-hover:ring-blue-50 transition-all" 
                          alt={t.studentName} 
                        />
                        <div className="absolute -top-2 -right-2 bg-brand-orange text-white p-1 rounded-lg shadow-lg">
                          <Trophy size={14} />
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex gap-0.5 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={18} 
                              className={i < t.rating ? "text-brand-orange fill-brand-orange" : "text-slate-200 fill-slate-200"} 
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t.rating}.0 Rating</span>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-xl font-bold text-brand-navy mb-1 group-hover:text-brand-blue transition-colors">{t.studentName}</h4>
                      <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest leading-none">{t.studentRole}</p>
                      {t.programId && (
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1 italic">
                          Alumni: {PROGRAMS.find(p => p.id === t.programId)?.title}
                        </p>
                      )}
                    </div>

                    <div className="relative mb-6">
                      <Quote className="absolute -top-4 -left-3 text-slate-50 -z-10 group-hover:text-blue-50 transition-colors" size={56} />
                      <p className={`text-slate-600 leading-relaxed italic pr-4 transition-all ${expandedId === t.id ? '' : 'line-clamp-3'}`}>
                        "{t.content}"
                      </p>
                    </div>

                    <AnimatePresence>
                      {expandedId === t.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="pt-6 border-t border-slate-100 mt-6 space-y-4">
                            <div className="flex items-start gap-4">
                              <div className="p-2 bg-blue-50 rounded-xl text-brand-blue">
                                <Award size={20} />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fokus Program</p>
                                <p className="text-sm font-bold text-brand-navy">
                                  {PROGRAMS.find(p => p.id === t.programId)?.title || 'Program Unggulan'}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                              <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                                <Users size={20} />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Verifikasi</p>
                                <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold uppercase">
                                  <CheckCircle2 size={12} /> Alumni Terakreditasi
                                </div>
                              </div>
                            </div>

                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setView('programDetail');
                              }}
                              className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-brand-blue transition-all"
                            >
                              Lihat Detail Program
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-6">
                      <div className="flex items-center gap-2 text-emerald-500">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
                          <CheckCircle2 size={12} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Verified Success</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-300 group-hover:text-brand-blue transition-all">
                        <span className="text-[10px] font-bold uppercase">
                          {expandedId === t.id ? 'Tutup' : 'Buka Detail'}
                        </span>
                        <ChevronRight size={20} className={`transition-transform duration-300 ${expandedId === t.id ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredTestimonials.length === 0 && (
            <div className="text-center py-40 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
              <div className="flex justify-center mb-6">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                    <Filter size={40} />
                 </div>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">Belum Ada Cerita Menarik</h3>
              <p className="text-slate-400">Jadilah yang pertama untuk membagikan keberhasilanmu di program ini.</p>
              <button 
                onClick={() => setIsFormOpen(true)}
                className="mt-6 text-brand-blue font-bold flex items-center gap-2 mx-auto hover:gap-3 transition-all"
              >
                Tulis Testimoni <Plus size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* REMOVED DETAILED VIEW MODAL */}

      {/* SUBMISSION FORM MODAL */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2rem] w-full max-w-xl relative z-10 overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div>
                    <h3 className="text-xl font-bold text-brand-navy">Bagikan Keberhasilanmu</h3>
                    <p className="text-xs text-slate-400 font-medium">Ceritamu dapat menginspirasi ribuan pejuang lainnya.</p>
                 </div>
                 <button 
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 hover:bg-white rounded-full transition-colors text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              <form className="p-8 space-y-6" onSubmit={(e) => {
                e.preventDefault();
                setIsFormOpen(false);
                alert('Testimoni berhasil dikirim dan menunggu persetujuan admin!');
              }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Contoh: Budi Santoso" 
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-blue/20 text-sm font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pencapaian / Role</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Contoh: Lolos SNBT UI" 
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-blue/20 text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Program Yang Diikuti</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-blue/20 text-sm font-bold">
                    {PROGRAMS.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rating Kepuasan</label>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button 
                        key={val} 
                        type="button"
                        className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 hover:text-brand-orange hover:bg-orange-50 transition-all font-bold"
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Testimoni</label>
                  <textarea 
                    rows={4} 
                    required
                    placeholder="Ceritakan pengalaman belajarmu di The Prams..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-brand-blue/20 text-sm font-medium resize-none"
                  />
                </div>

                <div className="p-4 bg-blue-50/50 rounded-2xl border border-dashed border-brand-blue/20 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-all">
                  <ImageIcon className="text-brand-blue mb-2" size={24} />
                  <p className="text-[10px] font-bold text-brand-blue uppercase">Unggah Foto (Opsional)</p>
                </div>

                <button type="submit" className="w-full btn-primary bg-brand-navy py-4 shadow-xl shadow-brand-navy/20 flex items-center justify-center gap-2">
                  <Send size={18} /> Kirim Testimoni
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CALL TO ACTION */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-br from-brand-blue to-indigo-900 p-12 text-center text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
           <h2 className="text-4xl font-bold mb-6 relative z-10">Siap Lolos Kampus Impian?</h2>
           <p className="text-xl text-white/70 mb-10 relative z-10">Gabung dengan ribuan siswa sukses lainnya. Daftar sekarang dan mulai persiapanmu.</p>
           <div className="flex justify-center gap-4 relative z-10">
              <button 
                onClick={() => setView('register')}
                className="btn-orange px-10 py-4 text-lg"
              >
                Daftar Sekarang
              </button>
           </div>
        </div>
      </section>
    </div>
  );
};
