import React, { useEffect, useMemo, useState } from 'react';
import { 
  ChevronLeft, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Users, 
  Target, 
  ArrowRight,
  BookOpen,
  GraduationCap,
  Star,
  ShieldCheck,
  Zap,
  Info,
  PlayCircle,
  MessageSquare,
  Globe,
  Award,
  ChevronDown,
  Layout,
  Radio
} from 'lucide-react';
import { Program, View, ProgramPackage } from '../types';
import { motion, AnimatePresence } from 'motion/react';

import { PROGRAMS, TUTORS, TESTIMONIALS } from '../constants';

interface ProgramDetailProps {
  programId: string | null;
  setView: (v: View) => void;
  programs?: Program[];
  selectedPackageId?: string | null;
  setSelectedPackageId?: (id: string | null) => void;
  returnToResult?: boolean;
  setSelectedMentorId?: (id: string) => void;
}

export const ProgramDetailPage: React.FC<ProgramDetailProps> = ({ programId, setView, programs = PROGRAMS, selectedPackageId, setSelectedPackageId, returnToResult }) => {
  const program = useMemo(() => programs.find(p => p.id === programId) || programs[0] || PROGRAMS[0], [programs, programId]);
  const programTutors = useMemo(() => TUTORS.filter(t => program.tutors?.includes(t.id)), [program]);
  const programTestimonials = useMemo(() => TESTIMONIALS.filter(t => t.programId === program.id).slice(0, 3), [program]);
  const defaultPackage = useMemo(
    () => program.packages?.find(pkg => pkg.isPopular) || program.packages?.find(pkg => pkg.name.toLowerCase().includes('premium')) || program.packages?.[0] || null,
    [program]
  );
  
  const [expandedWeek, setExpandedWeek] = useState<number | null>(0);
  const [selectedPackage, setSelectedPackage] = useState<ProgramPackage | null>(
    program.packages?.find(pkg => pkg.id === selectedPackageId) || defaultPackage
  );

  useEffect(() => {
    const nextPackage = program.packages?.find(pkg => pkg.id === selectedPackageId) || defaultPackage;
    setSelectedPackage(nextPackage);
    setSelectedPackageId?.(nextPackage?.id || null);
  }, [program, selectedPackageId, setSelectedPackageId, defaultPackage]);

  const selectPackage = (pkg: ProgramPackage) => {
    setSelectedPackage(pkg);
    setSelectedPackageId?.(pkg.id);
  };

  const goToPayment = () => {
    setSelectedPackageId?.(selectedPackage?.id || program.packages?.[0]?.id || null);
    setView('register');
  };

  return (
    <div className="pt-20 bg-white min-h-screen">
      {/* Hero Header */}
      <div className="bg-brand-navy py-20 lg:py-32 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-blue/10 skew-x-12 transform translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button 
            onClick={() => setView('programs')} 
            className="group flex items-center gap-2 text-white/60 hover:text-white mb-12 transition-colors text-sm font-bold uppercase tracking-widest"
          >
            <div className="p-1.5 rounded-full border border-white/10 group-hover:bg-white/10 transition-colors">
              <ChevronLeft size={18} />
            </div>
            Kembali ke Listing
          </button>
          {returnToResult && (
            <button
              onClick={() => setView('result')}
              className="group flex items-center gap-2 text-white/60 hover:text-white -mt-8 mb-12 transition-colors text-sm font-bold uppercase tracking-widest"
            >
              <div className="p-1.5 rounded-full border border-white/10 group-hover:bg-white/10 transition-colors">
                <ChevronLeft size={18} />
              </div>
              Kembali ke Hasil Tryout
            </button>
          )}
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <Zap size={12} fill="currentColor" />
                Featured Program
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter leading-[1.1]">{program.title}</h1>
              <p className="text-xl text-white/70 mb-10 max-w-xl leading-relaxed font-medium">
                {program.longDescription || program.description}
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-12">
                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-white/10 rounded-2xl group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 shadow-lg">
                    <Calendar size={24} className="text-brand-orange group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-1">Mulai Kelas</p>
                    <p className="text-base font-bold">{program.schedule}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-white/10 rounded-2xl group-hover:bg-brand-blue group-hover:text-white transition-all duration-300 shadow-lg">
                    <Radio size={24} className="text-brand-blue group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 uppercase font-black tracking-widest mb-1">Sesi Live</p>
                    <p className="text-base font-bold">Setiap Pekan</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <button 
                  onClick={() => {
                     const el = document.getElementById('pricing');
                     el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-orange px-12 py-5 text-lg shadow-2xl shadow-brand-orange/20"
                >
                  Lihat Paket Belajar
                  <ArrowRight size={20} />
                </button>
                <div className="flex items-center gap-3 px-6 py-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                   <div className="flex -space-x-2">
                       {[1,2,3,4].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=${i + 10}`} className="w-8 h-8 rounded-full border-2 border-brand-navy" alt="" />)}
                   </div>
                   <p className="text-xs font-bold text-white/80">750+ Alumni Lolos</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="hidden lg:block relative"
            >
              <div className="absolute inset-0 bg-brand-blue/20 blur-3xl rounded-[3rem] -z-10 animate-pulse" />
              <div className="relative group">
                <img 
                  src={program.image} 
                  className="rounded-[3rem] shadow-2xl border-8 border-white/5 object-cover aspect-[4/5] transform group-hover:rotate-1 transition-transform duration-500" 
                  alt={program.title} 
                />
                <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-t from-brand-navy/60 to-transparent opacity-60" />
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform">
                   <div className="w-20 h-20 bg-brand-orange rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                      <PlayCircle size={40} className="text-white ml-1" />
                   </div>
                </div>

                <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[2.5rem] shadow-2xl text-brand-navy flex flex-col gap-2 min-w-[240px]">
                  <div className="flex items-center gap-1 mb-2">
                     {[1,2,3,4,5].map(s => <Star key={s} size={16} className="text-brand-orange fill-brand-orange" />)}
                  </div>
                  <p className="text-[10px] font-black uppercase text-slate-400">Peringkat Program</p>
                  <p className="text-4xl font-black text-brand-navy">4.9<span className="text-slate-300 text-lg">/5.0</span></p>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
                     <ShieldCheck size={14} /> Kurikulum Terstandarisasi
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-slate-50 py-16 border-b border-slate-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
               {[
                 { label: 'Live Mentoring', value: '24+ Sesi', icon: Radio, col: 'text-brand-blue' },
                 { label: 'Bank Soal', value: '5000+', icon: Layout, col: 'text-brand-orange' },
                 { label: 'Group Diskusi', value: '24/7 Support', icon: MessageSquare, col: 'text-emerald-500' },
                 { label: 'Sertifikat', value: 'Digital Credent', icon: Award, col: 'text-purple-500' }
               ].map((item, i) => (
                 <div key={i} className="flex flex-col items-center text-center gap-4">
                    <div className={`p-4 bg-white rounded-2xl shadow-sm ${item.col}`}><item.icon size={28} /></div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                       <p className="text-xl font-black text-brand-navy">{item.value}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-12 gap-20">
          <div className="lg:col-span-8 space-y-32">
            
            {/* Live Session Feature Highlight */}
            <section className="relative p-12 rounded-[3.5rem] bg-indigo-900 text-white overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
               <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
                    <Radio size={14} className="text-red-400 animate-pulse" />
                    Interactive Live Sessions
                  </div>
                  <h2 className="text-4xl font-black mb-6">Belajar Langsung Bersama Mentor Terbaik</h2>
                  <p className="text-lg text-white/70 mb-10 leading-relaxed max-w-2xl">
                    Bukan hanya sekadar video rekaman. Di The Prams, kamu mendapatkan sesi live interaktif setiap pekan untuk bedah materi, trik cepat, dan tanya jawab langsung.
                  </p>
                  <div className="grid sm:grid-cols-3 gap-6">
                     {[
                       { title: 'Chat Real-time', desc: 'Tanya apapun saat live' },
                       { title: 'Bedah Soal', desc: 'Trik cepat 30 detik' },
                       { title: 'Sesi Recording', desc: 'Akses siaran ulang' }
                     ].map((f, i) => (
                       <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                          <p className="font-bold mb-1">{f.title}</p>
                          <p className="text-xs text-white/50">{f.desc}</p>
                       </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Interactive Curriculum */}
            <section id="curriculum">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                      <BookOpen size={14} />
                      Learning Journey
                    </div>
                    <h2 className="text-4xl font-bold text-brand-navy">Kurikulum Komprehensif</h2>
                  </div>
                  <p className="text-slate-500 max-w-sm text-sm font-medium italic">Dirancang bertahap mulai dari konsep dasar hingga strategi pengerjaan soal tingkat tinggi.</p>
               </div>

               <div className="space-y-4">
                 {program.curriculum?.map((item, index) => (
                   <div key={index} className={`rounded-3xl border transition-all duration-300 ${expandedWeek === index ? 'bg-white border-brand-blue shadow-2xl shadow-brand-blue/5 ring-1 ring-brand-blue/20' : 'bg-slate-50 border-slate-100'}`}>
                     <button 
                       onClick={() => setExpandedWeek(expandedWeek === index ? null : index)}
                       className="w-full text-left p-8 flex items-center gap-6"
                     >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-colors ${expandedWeek === index ? 'bg-brand-blue text-white' : 'bg-white text-slate-400'}`}>
                           {item.week}
                        </div>
                        <div className="flex-1">
                           <h4 className={`text-lg font-bold transition-colors ${expandedWeek === index ? 'text-brand-blue' : 'text-brand-navy'}`}>{item.topic}</h4>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Minggu Pelatihan ke-{item.week}</p>
                        </div>
                        <div className={`transition-transform duration-300 ${expandedWeek === index ? 'rotate-180 text-brand-blue' : 'text-slate-300'}`}>
                           <ChevronDown size={24} />
                        </div>
                     </button>
                     
                     <AnimatePresence>
                        {expandedWeek === index && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                             <div className="p-8 pt-0 border-t border-slate-100 mt-2">
                                <p className="text-slate-600 mb-8 text-lg font-medium italic leading-relaxed">"{item.description}"</p>
                                <div className="grid sm:grid-cols-2 gap-4">
                                   {[
                                     { label: 'Video Pembahasan', icon: PlayCircle },
                                     { label: 'Modul Digital PDF', icon: BookOpen },
                                     { label: 'Kuis Evaluasi', icon: Target },
                                     { label: 'Sesi Live Coaching', icon: Radio }
                                   ].map((f, i) => (
                                     <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <f.icon size={18} className="text-brand-blue" />
                                        <span className="text-xs font-bold text-slate-700">{f.label}</span>
                                     </div>
                                   ))}
                                </div>
                             </div>
                          </motion.div>
                        )}
                     </AnimatePresence>
                   </div>
                 ))}
               </div>
            </section>

            {/* Mentor Slider (Polished grid for now with carousel vibe) */}
            <section>
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-4xl font-bold text-brand-navy">Mentor Pilihan</h2>
                <div className="flex gap-2">
                   <div className="p-2 rounded-full border border-slate-200 text-slate-300 cursor-not-allowed"><ChevronLeft size={20} /></div>
                   <div className="p-2 rounded-full border border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition-colors cursor-pointer"><ArrowRight size={20} /></div>
                </div>
              </div>
              
              <div className="flex overflow-x-auto gap-8 pb-8 no-scrollbar scroll-smooth">
                 {programTutors.map(tutor => (
                   <motion.div 
                     key={tutor.id} 
                     whileHover={{ y: -10 }}
                     className="min-w-[320px] p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all group"
                   >
                      <div className="relative mb-6">
                         <img src={tutor.image} className="w-full h-64 rounded-[2rem] object-cover ring-8 ring-slate-50" alt="" />
                         <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl text-brand-orange shadow-lg">
                            <Star size={18} fill="currentColor" />
                         </div>
                         <div className="absolute -bottom-4 left-6 bg-brand-blue text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                            {tutor.role}
                         </div>
                      </div>
                      <h4 className="text-xl font-bold text-brand-navy mb-1">{tutor.name}</h4>
                      <p className="text-slate-400 text-sm mb-6 pb-6 border-b border-slate-50">Expert in {tutor.subjects.join(' & ')}</p>
                      
                      <button 
                        onClick={() => setView('mentorProfile')}
                        className="w-full py-4 rounded-2xl bg-slate-50 text-brand-blue text-xs font-black uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                         Lihat Profil <ArrowRight size={14} />
                      </button>
                   </motion.div>
                 ))}
                 {/* Fake duplicate for slider feeling if only one tutor */}
                 {programTutors.length < 3 && (
                   <div className="min-w-[320px] p-8 rounded-[2.5rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                         <Users size={32} />
                      </div>
                      <p className="text-slate-400 font-bold">Dan 5+ Mentor Lainnya...</p>
                   </div>
                 )}
              </div>
            </section>

            {/* Testimonials */}
            {programTestimonials.length > 0 && (
              <section>
                <div className="flex items-end justify-between mb-12">
                   <h2 className="text-4xl font-black text-brand-navy lowercase leading-none tracking-tighter">apa kata <span className="text-brand-blue uppercase">mereka?</span></h2>
                   <button onClick={() => setView('testimonials')} className="text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-brand-blue transition-colors">See all success stories</button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {programTestimonials.map((t, idx) => (
                     <div key={t.id} className={`p-10 rounded-[3rem] ${idx % 2 === 0 ? 'bg-slate-50 border border-slate-100' : 'bg-brand-blue text-white shadow-2xl shadow-brand-blue/20'} flex flex-col gap-8 relative overflow-hidden`}>
                        {idx % 2 !== 0 && <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />}
                        <div className="flex items-center gap-4 relative z-10">
                           <img src={t.image} className="w-12 h-12 rounded-2xl ring-4 ring-white/10" alt="" />
                           <div>
                              <p className="font-bold">{t.studentName}</p>
                              <p className={`text-[10px] font-bold uppercase tracking-widest ${idx % 2 === 0 ? 'text-slate-400' : 'text-white/50'}`}>{t.studentRole}</p>
                           </div>
                        </div>
                        <p className={`text-lg italic leading-relaxed relative z-10 ${idx % 2 === 0 ? 'text-slate-600' : 'text-white/80'}`}>"{t.content}"</p>
                        <div className="flex gap-1 relative z-10">
                           {[1,2,3,4,5].map(s => <Star key={s} size={14} className={`${idx % 2 === 0 ? 'text-brand-orange' : 'text-white'} fill-current`} />)}
                        </div>
                     </div>
                   ))}
                </div>
              </section>
            )}
          </div>

          {/* Pricing & Packages Column */}
          <div className="lg:col-span-4">
             <div className="sticky top-32 space-y-8" id="pricing">
                {/* Dynamic Package Selector */}
                <div className="card-premium p-10 bg-white border-2 border-brand-blue/10 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                   <h3 className="text-2xl font-bold text-brand-navy mb-8 relative z-10">Pilih Paket Belajar</h3>
                   
                   {/* Package Tabs */}
                   <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-8 relative z-10">
                      {program.packages?.map(pkg => (
                        <button 
                          key={pkg.id}
                          onClick={() => selectPackage(pkg)}
                          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedPackage?.id === pkg.id ? 'bg-white text-brand-blue shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                           {pkg.name}
                        </button>
                      ))}
                   </div>

                   <AnimatePresence mode="wait">
                      {selectedPackage && (
                        <motion.div
                          key={selectedPackage.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="relative z-10"
                        >
                           <div className="flex justify-between items-end mb-8 pb-6 border-b border-slate-50">
                              <div>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Investasi</p>
                                 <p className="text-4xl font-black text-brand-navy leading-none">{selectedPackage.price}</p>
                              </div>
                              <p className="text-xs font-bold text-brand-blue bg-brand-blue/5 px-3 py-1 rounded-full uppercase tracking-tighter">{selectedPackage.duration}</p>
                           </div>

                           <div className="space-y-4 mb-10">
                              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Fitur Utama:</p>
                              {selectedPackage.features.map((f, i) => (
                                <div key={i} className="flex items-start gap-3">
                                   <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                                      <CheckCircle2 size={12} />
                                   </div>
                                   <span className="text-sm font-medium text-slate-600 leading-snug">{f}</span>
                                </div>
                              ))}
                           </div>

                           <button 
                              onClick={goToPayment}
                              className="w-full btn-orange py-5 rounded-[1.5rem] shadow-xl shadow-brand-orange/20 mb-6 group"
                           >
                              Daftar Sekarang
                              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                           </button>
                        </motion.div>
                      )}
                   </AnimatePresence>
                   
                   <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-center gap-3">
                      <ShieldCheck size={18} className="text-brand-blue" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aman & Terpercaya</p>
                   </div>
                </div>

                {/* Secondary Feature List */}
                <div className="p-10 rounded-[3rem] bg-brand-navy text-white flex flex-col gap-8 shadow-2xl">
                   <h4 className="text-xl font-bold border-b border-white/10 pb-4">Standard Fasilitas</h4>
                   <div className="space-y-4">
                      {program.facilities.map((f, i) => (
                        <div key={i} className="flex items-center gap-4 text-xs font-bold opacity-80">
                           <Globe size={16} className="text-brand-blue" />
                           {f}
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-slate-100 z-50 flex items-center justify-between gap-4">
         <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Mulai Dari</p>
            <p className="text-xl font-black text-brand-navy">{program.price}</p>
         </div>
         <button 
            onClick={goToPayment}
            className="flex-1 btn-orange py-4 px-6 rounded-[1.5rem] shadow-lg shadow-brand-orange/20"
         >
            Daftar <ArrowRight size={18} />
         </button>
      </div>
    </div>
  );
};
