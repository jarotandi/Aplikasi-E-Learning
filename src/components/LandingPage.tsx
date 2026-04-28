import React from 'react';
import { 
  Users, 
  BookOpen, 
  Trophy, 
  GraduationCap, 
  ArrowRight, 
  PlayCircle,
  BarChart3,
  CheckCircle2,
  HelpCircle,
  MessageCircle,
  Award,
  Target,
  Instagram,
  Facebook,
  Youtube,
  Rocket,
  Plus,
  Minus,
  ShieldCheck,
  Layout,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Star,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PROGRAMS, TESTIMONIALS, US_POINTS, FAQS, TUTORS, CAROUSEL_SLIDES } from '../constants';
import { View } from '../types';

const CustomFAQItem: React.FC<{ 
  faq: any; 
  isOpen: boolean; 
  onToggle: () => void 
}> = ({ faq, isOpen, onToggle }) => {
  return (
    <div className={`mb-4 rounded-2xl border transition-all duration-500 ${
      isOpen ? 'border-brand-blue bg-blue-50/30' : 'border-slate-100 bg-white hover:border-slate-200'
    }`}>
      <button 
        onClick={onToggle}
        className="w-full px-6 py-6 flex items-center justify-between text-left group cursor-pointer"
      >
        <span className={`text-lg font-bold transition-colors duration-300 ${
          isOpen ? 'text-brand-blue' : 'text-brand-navy group-hover:text-brand-blue'
        }`}>
          {faq.question}
        </span>
        <motion.div 
          animate={{ rotate: isOpen ? 45 : 0 }}
          className={`p-2 rounded-xl transition-colors duration-300 ${
            isOpen ? 'bg-brand-blue text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-brand-blue/10 group-hover:text-brand-blue'
          }`}
        >
          <Plus size={20} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-8 text-slate-600 leading-relaxed max-w-3xl">
              <div className="pt-4 border-t border-brand-blue/10">
                {faq.answer}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HeroCarousel: React.FC<{ setView: (v: View) => void }> = ({ setView }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);

  const slideNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  const slidePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  };

  React.useEffect(() => {
    const timer = setInterval(slideNext, 6000);
    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const activeSlide = CAROUSEL_SLIDES[currentIndex];

  return (
    <section className="relative h-[650px] lg:h-[750px] w-full overflow-hidden bg-slate-100 flex items-center">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 }
          }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image with Gradient */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${activeSlide.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-navy/50 to-transparent lg:via-brand-navy/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/30 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-2xl text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-brand-orange text-xs font-black uppercase tracking-[0.2em] mb-6"
              >
                <Rocket size={14} />
                Persiapan Akademik & Karir 2025
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-7xl font-black mb-6 leading-[1.05] tracking-tight"
              >
                {activeSlide.title}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-slate-200 mb-10 leading-relaxed font-medium max-w-lg"
              >
                {activeSlide.subtitle}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 mb-16"
              >
                <button 
                  onClick={() => setView(activeSlide.link as View)} 
                  className="btn-orange text-lg px-10 h-16 group shadow-xl shadow-brand-orange/30 hover:scale-105"
                >
                  {activeSlide.ctaText}
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => setView('programs')} 
                  className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md text-lg px-10 h-16"
                >
                  Jelajahi Program
                </button>
              </motion.div>

              {/* Stats / Partners */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-8 items-center"
              >
                {activeSlide.stats.map((stat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                      {stat.icon === 'LinkedIn' && <Instagram size={20} className="text-white" />}
                      {stat.icon === 'AWS' && <Rocket size={20} className="text-white" />}
                      {stat.icon === 'Star' && <Star size={20} className="text-brand-orange fill-brand-orange" />}
                      {stat.icon === 'Users' && <Users size={20} className="text-white" />}
                      {stat.icon === 'Rocket' && <Rocket size={20} className="text-white" />}
                      {stat.icon === 'Check' && <CheckCircle2 size={20} className="text-emerald-300" />}
                      {stat.icon === 'Book' && <BookOpen size={20} className="text-white" />}
                      {stat.icon === 'Award' && <Award size={20} className="text-brand-orange" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                      <p className="text-sm font-bold text-white uppercase">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-10 right-10 flex items-center gap-4 z-20">
        <button 
          onClick={slidePrev}
          className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 transition-all active:scale-95 shadow-xl"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={slideNext}
          className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 transition-all active:scale-95 shadow-xl"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {CAROUSEL_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > currentIndex ? 1 : -1);
              setCurrentIndex(i);
            }}
            className={`transition-all duration-300 rounded-full h-2 ${
              i === currentIndex ? 'w-10 bg-brand-orange' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export const LandingPage: React.FC<{ setView: (v: View) => void }> = ({ setView }) => {
  const [openFaqId, setOpenFaqId] = React.useState<string | null>(null);

  return (
    <div className="pt-20">
      <HeroCarousel setView={setView} />

      {/* Program Unggulan */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brand-navy mb-4 italic">Pilih Jalur Kesuksesanmu</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Program pendidikan yang dirancang khusus untuk membantu Anda menembus 
              seleksi paling kompetitif di Indonesia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROGRAMS.map((program) => (
              <motion.div
                key={program.id}
                whileHover={{ y: -10 }}
                className="card-premium overflow-hidden flex flex-col h-full bg-white group"
              >
                <div className="h-48 relative overflow-hidden">
                  <img src={program.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={program.title} />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-brand-blue uppercase tracking-wider shadow-sm">
                      {program.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-brand-navy mb-2">{program.title}</h3>
                  <p className="text-sm text-slate-600 mb-6 flex-1">{program.description}</p>
                  <div className="space-y-3 mb-6">
                    {program.facilities.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        {f}
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setView('programs')}
                    className="w-full py-3 bg-slate-50 text-brand-blue font-bold rounded-xl group-hover:bg-brand-blue group-hover:text-white transition-colors"
                  >
                    Detail Program
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose The Prams */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-50 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-blue/10 text-brand-blue rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <Award size={14} />
              The Prams Excellence
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6 tracking-tight">Why Choose <span className="text-brand-blue">The Prams?</span></h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
              We don't just teach; we empower students with the tools and mindset needed to conquer their biggest academic challenges.
            </p>
          </div>

          <div className="grid md:grid-cols-3 md:grid-rows-2 gap-6 lg:gap-8">
            {/* Experienced Mentors - Wide Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 p-10 lg:p-14 rounded-[3.5rem] bg-brand-blue text-white relative overflow-hidden group shadow-2xl shadow-brand-blue/20"
            >
               <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
               <div className="relative z-10">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center mb-10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                     <GraduationCap size={48} />
                  </div>
                  <h4 className="text-3xl lg:text-4xl font-black mb-6 tracking-tight">{US_POINTS[0].title}</h4>
                  <p className="text-white/80 text-xl max-w-md leading-relaxed font-medium">{US_POINTS[0].description}</p>
               </div>
               <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" 
                className="absolute right-[-5%] bottom-[-10%] w-1/2 h-full object-cover rounded-[4rem] opacity-20 pointer-events-none mix-blend-overlay group-hover:scale-105 transition-transform duration-700" 
                alt="" 
               />
            </motion.div>

            {/* Structured Curriculum - Tall Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:row-span-2 p-10 rounded-[3.5rem] bg-slate-50 border border-slate-100 flex flex-col justify-between group hover:bg-white hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-700 relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
               <div className="relative z-10">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-blue shadow-xl shadow-blue-500/10 mb-10 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                     <BookOpen size={32} />
                  </div>
                  <h4 className="text-2xl font-bold text-brand-navy mb-4 group-hover:text-brand-blue transition-colors">{US_POINTS[1].title}</h4>
                  <p className="text-slate-500 leading-relaxed font-medium">{US_POINTS[1].description}</p>
               </div>
               
               <div className="mt-12 space-y-5 relative z-10">
                  {[1, 2, 3, 4].map((_, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span>Module {i + 1}</span>
                          <span>{85 - i * 15}%</span>
                       </div>
                       <div className="h-2 bg-slate-200 rounded-full w-full overflow-hidden">
                          <motion.div 
                           initial={{ width: 0 }}
                           whileInView={{ width: `${85 - i * 15}%` }}
                           transition={{ duration: 1.5, delay: 0.5 + (i * 0.1) }}
                           className="h-full bg-brand-blue rounded-full"
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>

            {/* Realistic Tryouts - Small Box */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-10 rounded-[3.5rem] bg-brand-orange text-white relative overflow-hidden group shadow-2xl shadow-brand-orange/20"
            >
               <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/30">
                     <Target size={32} />
                  </div>
                  <h4 className="text-2xl font-bold mb-4 tracking-tight">{US_POINTS[2].title}</h4>
                  <p className="text-white/80 leading-relaxed font-medium">{US_POINTS[2].description}</p>
               </div>
               <div className="absolute bottom-[-10%] right-[-10%] text-white/5 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
                  <Target size={200} />
               </div>
            </motion.div>

            {/* Measurable Progress - Small Box */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-10 rounded-[3.5rem] bg-brand-navy text-white relative overflow-hidden group"
            >
               <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 text-brand-blue border border-white/10 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
                     <BarChart3 size={32} />
                  </div>
                  <h4 className="text-2xl font-bold mb-4 tracking-tight">{US_POINTS[3].title}</h4>
                  <p className="text-slate-400 leading-relaxed font-medium">{US_POINTS[3].description}</p>
               </div>
               <div className="absolute bottom-0 right-0 flex items-end gap-2 px-10 opacity-20 pointer-events-none">
                  {[60, 40, 80, 55, 95, 70].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: h }}
                      transition={{ duration: 1.5, delay: 0.8 + (i * 0.1), ease: "easeOut" }}
                      className="w-4 bg-brand-blue rounded-t-lg"
                    />
                  ))}
               </div>
            </motion.div>
          </div>

          <div className="mt-20 p-12 bg-brand-navy rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-blue/10 skew-x-12 transform translate-x-1/4" />
             <div className="relative z-10 max-w-xl">
                <h3 className="text-3xl font-bold mb-4">Siap untuk Memulai Perjalananmu?</h3>
                <p className="text-white/70">Dapatkan akses ke materi berkualitas dan bimbingan eksklusif sekarang juga.</p>
             </div>
             <div className="relative z-10 flex gap-4">
                <button onClick={() => setView('programs')} className="btn-orange px-8 py-4">Lihat Program <ArrowRight size={20} /></button>
                <button onClick={() => setView('contact')} className="px-8 py-4 bg-white text-brand-navy rounded-2xl font-black text-sm shadow-xl shadow-black/10 border-2 border-white hover:bg-blue-50 hover:border-blue-100 transition-all">Hubungi Admin</button>
             </div>
          </div>
        </div>
      </section>

      {/* Mentors Preview */}
      <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                <div>
                   <h2 className="text-3xl font-bold text-brand-navy mb-4 italic">Belajar dari yang Terbaik</h2>
                   <p className="text-slate-600 max-w-xl">
                      Mentor kami adalah alumni PTN ternama dan praktisi yang sudah berpengalaman meloloskan ribuan siswa.
                   </p>
                </div>
                <button onClick={() => setView('login')} className="btn-secondary px-8">Lihat Semua Mentor</button>
             </div>

             <div className="grid md:grid-cols-2 gap-8">
                {TUTORS.map((tutor) => (
                   <motion.div 
                    key={tutor.id}
                    whileHover={{ scale: 1.02 }}
                    className="card-premium p-8 bg-white flex flex-col md:flex-row gap-8 items-center md:items-start"
                   >
                      <img src={tutor.image} className="w-32 h-32 rounded-3xl object-cover shadow-lg" alt={tutor.name} />
                      <div className="flex-1 text-center md:text-left">
                         <h3 className="text-xl font-bold text-brand-navy mb-1">{tutor.name}</h3>
                         <p className="text-brand-blue font-bold text-sm mb-4 uppercase tracking-widest">{tutor.role}</p>
                         <p className="text-slate-600 text-sm mb-6 line-clamp-3 italic">"{tutor.bio}"</p>
                         <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            {tutor.subjects.map((s, i) => (
                               <span key={i} className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase">{s}</span>
                            ))}
                         </div>
                         <button 
                          onClick={() => setView('mentorProfile')} 
                          className="mt-6 text-brand-blue font-bold text-xs flex items-center gap-2 hover:underline mx-auto md:mx-0"
                         >
                            Lihat Profil Lengkap <ArrowRight size={14} />
                         </button>
                      </div>
                   </motion.div>
                ))}
             </div>
          </div>
      </section>

      {/* Free Video Gallery */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-orange/10 text-brand-orange rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                 <PlayCircle size={14} />
                 Edukasi Gratis
               </div>
               <h2 className="text-3xl font-bold text-brand-navy mb-4">Mulai Belajar Hari Ini, Gratis!</h2>
               <p className="text-slate-600">
                  Cicipi pengalaman belajar ala The Prams dengan video-video edukasi pilihan kami secara cuma-cuma.
               </p>
            </div>
            <button onClick={() => setView('login')} className="text-brand-blue font-bold flex items-center gap-2 hover:gap-3 transition-all shrink-0">
               Lihat Semua Library Gratis <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { title: 'Rahasia Master Biologi SNBT', duration: '15:20', mentor: 'dr. Pram', thumbnail: 'https://images.unsplash.com/photo-1532187875605-1ef6c237a0e7?auto=format&fit=crop&q=80&w=400' },
               { title: 'Trik Cepat Penalaran Kuantitatif', duration: '12:45', mentor: 'Coach Irul', thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400' },
               { title: 'Persiapan Psikotes Kedinasan', duration: '18:10', mentor: 'Coach Maya', thumbnail: 'https://images.unsplash.com/photo-1560731245-3226f37a783a?auto=format&fit=crop&q=80&w=400' },
               { title: 'Bedah Kampus: FK UI & UGM', duration: '22:00', mentor: 'The Prams Team', thumbnail: 'https://images.unsplash.com/photo-1541339907198-e08756dea63f?auto=format&fit=crop&q=80&w=400' }
             ].map((v, i) => (
                <div key={i} className="group cursor-pointer" onClick={() => setView('login')}>
                   <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 shadow-lg">
                      <img src={v.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                           <PlayCircle size={32} fill="white" />
                         </div>
                      </div>
                      <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-[10px] font-bold text-white">
                         {v.duration}
                      </div>
                   </div>
                   <h4 className="text-sm font-bold text-brand-navy mb-1 group-hover:text-brand-blue transition-colors line-clamp-1">{v.title}</h4>
                   <p className="text-[10px] text-slate-500 font-medium">Mentor: {v.mentor}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faq-section" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 text-blue-50/50 -translate-y-1/2 translate-x-1/2 z-0">
          <HelpCircle size={400} />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              <HelpCircle size={14} />
              FAQ Center
            </div>
            <h2 className="text-4xl font-bold text-brand-navy mb-4">Pertanyaan Populer</h2>
            <p className="text-slate-600 italic">Temukan jawaban cepat untuk pertanyaan yang sering diajukan.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-1 space-y-2">
              {['All', 'Program', 'Enrollment', 'Technical', 'General'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    const el = document.getElementById(`faq-group-${cat.toLowerCase()}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-colors text-slate-400 hover:text-brand-blue flex items-center justify-between group"
                >
                  {cat}
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>

            <div className="md:col-span-3 space-y-12">
              {['Program', 'Enrollment', 'Technical', 'General'].map((category) => {
                const categoryFaqs = FAQS.filter(f => f.category === category);
                if (categoryFaqs.length === 0) return null;

                return (
                  <div key={category} id={`faq-group-${category.toLowerCase()}`} className="space-y-6">
                    <h3 className="text-sm font-black text-brand-blue uppercase tracking-[0.3em] border-l-4 border-brand-blue pl-4">
                      {category}
                    </h3>
                    <div className="space-y-4">
                      {categoryFaqs.map((faq) => (
                        <CustomFAQItem 
                          key={faq.id} 
                          faq={faq} 
                          isOpen={openFaqId === faq.id}
                          onToggle={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-20 p-10 rounded-[3rem] bg-brand-navy text-white text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-brand-blue/10 transform skew-y-6" />
             <div className="relative z-10">
                <h4 className="text-2xl font-bold mb-3">Tidak menemukan jawabanmu?</h4>
                <p className="text-blue-100/70 mb-8 max-w-lg mx-auto">Jika Anda memiliki pertanyaan spesifik yang tidak tercakup di sini, tim support kami siap membantu Anda secara personal.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => setView('contact')} className="btn-orange px-10">Tanya via WhatsApp</button>
                  <button onClick={() => setView('contact')} className="px-10 py-4 bg-white text-brand-navy rounded-2xl font-black text-sm shadow-xl shadow-black/10 border-2 border-white hover:bg-blue-50 hover:border-blue-100 transition-all">Kirim Email ke Support</button>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Testimoni */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brand-navy mb-4">Kisah Sukses Alumni</h2>
            <p className="text-slate-600">Mereka yang sudah membuktikan metode belajar The Prams.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="card-premium p-8 bg-white flex flex-col md:flex-row gap-6">
                <img src={t.image} className="w-16 h-16 rounded-full object-cover" alt={t.studentName} />
                <div>
                  <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold inline-block mb-3">
                    Passed Program
                  </div>
                  <p className="text-lg italic text-slate-700 mb-4 leading-relaxed pr-8">"{t.content}"</p>
                  <p className="font-bold text-brand-navy">{t.studentName}</p>
                  <p className="text-sm text-slate-500">{t.studentRole}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <button 
              onClick={() => setView('testimonials')}
              className="text-brand-blue font-bold flex items-center gap-2 mx-auto hover:gap-3 transition-all"
            >
              Lihat Semua Testimoni <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Blog & Updates Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brand-navy mb-4 italic">Berita & Artikel Terbaru</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Dapatkan tips belajar, info seleksi terkini, dan panduan akademik langsung dari tim ahli The Prams.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Tips Lolos SNBT Kedokteran 2025: Strategi Belajar Efektif',
                date: '10 April 2024',
                category: 'Tips & Trik',
                image: 'https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=600'
              },
              {
                title: 'Perubahan Aturan SKD CPNS Tahun Ini yang Harus Kamu Tahu',
                date: '08 April 2024',
                category: 'Info Seleksi',
                image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=600'
              },
              {
                title: '5 Keuntungan Mengikuti Tryout Nasional The Prams',
                date: '05 April 2024',
                category: 'Fitur Edukasi',
                image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600'
              }
            ].map((post, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
                onClick={() => setView('landing')}
              >
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 shadow-md">
                   <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                   <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-brand-blue uppercase tracking-wider">
                        {post.category}
                      </span>
                   </div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">{post.date}</p>
                <h3 className="text-lg font-bold text-brand-navy group-hover:text-brand-blue transition-colors leading-tight mb-2">
                  {post.title}
                </h3>
                <div className="flex items-center gap-2 text-brand-blue font-bold text-xs">
                  Baca Selengkapnya <ArrowRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
             <button onClick={() => setView('landing')} className="btn-secondary px-8">Lihat Semua Artikel</button>
          </div>
        </div>
      </section>

      {/* Product/Program Description Deep Dive */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-orange rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-brand-blue">
                <ShieldCheck size={14} />
                Program Excellence
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                Investasi Terbaik untuk <span className="text-brand-blue">Masa Depan</span> Akademikmu
              </h2>
              <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                The Prams hadir sebagai solusi bimbingan belajar digital yang mengintegrasikan teknologi analitik canggih dengan kurikulum yang telah teruji meloloskan ribuan siswa ke perguruan tinggi impian.
              </p>
              
              <div className="space-y-8">
                {[
                  {
                    title: "Kurikulum Adaptif & Terukur",
                    desc: "Materi kami disusun berdasarkan kisi-kisi terbaru dan menggunakan sistem penilaian IRT (Item Response Theory) untuk memberikan simulasi skor yang akurat sesuai standar seleksi nasional.",
                    icon: Layout
                  },
                  {
                    title: "Mentor Praktisi & Akademisi",
                    desc: "Belajar langsung dari alumni PTN terbaik dan praktisi yang tidak hanya menguasai teori, tapi juga trik cepat (TPS) dan strategi manajemen waktu yang krusial saat ujian.",
                    icon: Users
                  },
                  {
                    title: "Live Coaching Interaktif",
                    desc: "Kami percaya pada interaksi dua arah. Setiap sesi live dirancang agar siswa bisa bertanya secara real-time dan mendapatkan solusi langsung atas kendala belajarnya.",
                    icon: MessageSquare
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-blue shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2 group-hover:text-brand-blue transition-colors">{item.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                   <div className="p-1 rounded-3xl bg-gradient-to-br from-brand-blue to-purple-600">
                      <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=400" className="rounded-[1.5rem] w-full aspect-[4/5] object-cover" alt="" />
                   </div>
                   <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 text-center">
                      <p className="text-3xl font-black text-white mb-1">98%</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Kepuasan Siswa</p>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="p-8 rounded-[2rem] bg-brand-orange text-white text-center shadow-2xl shadow-brand-orange/20">
                      <p className="text-3xl font-black mb-1">500+</p>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Alumni Kedokteran</p>
                   </div>
                   <div className="p-1 rounded-3xl bg-gradient-to-tr from-brand-orange to-amber-400">
                      <img src="https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?auto=format&fit=crop&q=80&w=400" className="rounded-[1.5rem] w-full aspect-[4/5] object-cover" alt="" />
                   </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 p-6 rounded-2xl bg-white text-brand-navy shadow-2xl">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                       <CheckCircle2 size={24} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Terakreditasi</p>
                       <p className="font-bold">Lembaga Resmi</p>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-20 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-brand-blue rounded-lg text-white">
                  <GraduationCap size={24} />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">The Prams</span>
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Keterangan Produk</p>
              <p className="text-xs leading-relaxed mb-6 italic">
                Platform bimbingan belajar digital unggulan untuk persiapan masuk PTN Kedokteran dan Sekolah Kedinasan. Dilengkapi kurikulum adaptif dan simulasi IRT real-time.
              </p>
              <div className="flex gap-4">
                <Instagram size={20} className="hover:text-white cursor-pointer" />
                <Rocket size={20} className="hover:text-white cursor-pointer" />
                <Youtube size={20} className="hover:text-white cursor-pointer" />
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                <Award size={16} className="text-brand-blue" />
                Program Unggulan
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="hover:text-white cursor-pointer flex items-center gap-2 group transition-all">
                  <span className="w-1 h-1 bg-slate-700 rounded-full group-hover:w-2 group-hover:bg-brand-blue transition-all" />
                  Kedokteran Express
                </li>
                <li className="hover:text-white cursor-pointer flex items-center gap-2 group transition-all">
                  <span className="w-1 h-1 bg-slate-700 rounded-full group-hover:w-2 group-hover:bg-brand-blue transition-all" />
                  SNBT Intensive
                </li>
                <li className="hover:text-white cursor-pointer flex items-center gap-2 group transition-all">
                  <span className="w-1 h-1 bg-slate-700 rounded-full group-hover:w-2 group-hover:bg-brand-blue transition-all" />
                  SKD CPNS Masterclass
                </li>
                <li className="hover:text-white cursor-pointer flex items-center gap-2 group transition-all">
                  <span className="w-1 h-1 bg-slate-700 rounded-full group-hover:w-2 group-hover:bg-brand-blue transition-all" />
                  Kedinasan Special
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                <CheckCircle2 size={16} className="text-brand-orange" />
                Internal
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="hover:text-white cursor-pointer flex items-center gap-2 group transition-all">
                  <span className="w-1 h-1 bg-slate-700 rounded-full group-hover:w-2 group-hover:bg-brand-orange transition-all" />
                  Tentang Kami
                </li>
                <li className="hover:text-white cursor-pointer flex items-center gap-2 group transition-all">
                  <span className="w-1 h-1 bg-slate-700 rounded-full group-hover:w-2 group-hover:bg-brand-orange transition-all" />
                  Karir & Prestasi
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                <Users size={16} className="text-brand-blue" />
                Bantuan
              </h4>
              <ul className="space-y-4 text-sm">
                <li onClick={() => {
                  const element = document.getElementById('faq-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }} className="hover:text-white cursor-pointer flex items-center gap-2 group transition-all">
                  <span className="w-1 h-1 bg-slate-700 rounded-full group-hover:w-2 group-hover:bg-brand-blue transition-all" />
                  FAQ Section
                </li>
                <li className="hover:text-white cursor-pointer flex items-center gap-2 group transition-all">
                  <span className="w-1 h-1 bg-slate-700 rounded-full group-hover:w-2 group-hover:bg-brand-blue transition-all" />
                  Syarat & Ketentuan
                </li>
                <li className="hover:text-white cursor-pointer flex items-center gap-2 group transition-all">
                  <span className="w-1 h-1 bg-slate-700 rounded-full group-hover:w-2 group-hover:bg-brand-blue transition-all" />
                  Privasi
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-[10px] tracking-widest">Kontak</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <MessageCircle size={18} className="text-brand-orange" />
                  <span>+62 812-3456-7890</span>
                </li>
                <li className="flex gap-2">
                  <HelpCircle size={18} className="text-brand-blue" />
                  <span>support@theprams.edu</span>
                </li>
              </ul>
              <div className="mt-8">
                <button className="w-full btn-primary bg-brand-blue/20 hover:bg-brand-blue border border-brand-blue/30 py-2 text-xs">
                  Hubungi Admin
                </button>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-xs">
            © 2026 The Prams Edu Platform. Crafted for Excellence.
          </div>
        </div>
      </footer>
    </div>
  );
};
