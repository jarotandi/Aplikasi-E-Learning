import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  CheckCircle2, 
  Lock, 
  ChevronLeft, 
  FileText, 
  MessageSquare, 
  Download,
  Share2,
  Bookmark,
  Star,
  Send,
  X,
  Clock,
  Video,
  Monitor,
  Mail,
  Calendar,
  ExternalLink,
  Archive
} from 'lucide-react';
import { CURRICULUM, LIVE_SESSIONS } from '../constants';
import { View, VideoLesson, User } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const LearningPage: React.FC<{ setView: (v: View) => void; user: User | null; onUpgrade: () => void }> = ({ setView, user, onUpgrade }) => {
  const [curriculum, setCurriculum] = useState(CURRICULUM);
  const [activeLesson, setActiveLesson] = useState(curriculum[0].lessons[0]);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  
  // Video Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(33); // Mock initial progress
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  // Simulate video playback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 0.5;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress]);
  
  // Mentor Modal States
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [isQuestionSent, setIsQuestionSent] = useState(false);

  // Download States
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloaded, setIsDownloaded] = useState<number[]>([]);
  const [showDownloadSuccess, setShowDownloadSuccess] = useState<string | null>(null);
  const [bookmarkedLessons, setBookmarkedLessons] = useState<string[]>([]);

  // Tab State
  const [activeTab, setActiveTab] = useState<'content' | 'live'>('content');

  const totalLessons = curriculum.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const completedLessons = curriculum.reduce((acc, mod) => 
    acc + mod.lessons.filter(l => l.isCompleted).length, 0
  );
  const progressPercent = Math.round((completedLessons / totalLessons) * 100);
  const liveSession = LIVE_SESSIONS[0];
  const isPremium = Boolean(user?.isPremium);
  const freeLessonLimit = 2;
  const accessibleLessonIds = new Set(
    isPremium
      ? curriculum.flatMap((mod) => mod.lessons.map((lesson) => lesson.id))
      : curriculum.flatMap((mod) => mod.lessons).slice(0, freeLessonLimit).map((lesson) => lesson.id)
  );
  const isActiveLessonLocked = !accessibleLessonIds.has(activeLesson.id);

  const toggleComplete = (lessonId: string) => {
    if (!accessibleLessonIds.has(lessonId)) return;
    const updatedCurriculum = curriculum.map(mod => ({
      ...mod,
      lessons: mod.lessons.map(lesson => 
        lesson.id === lessonId ? { ...lesson, isCompleted: !lesson.isCompleted } : lesson
      )
    }));
    setCurriculum(updatedCurriculum);
    
    // Update active lesson state if it's the one being toggled
    if (activeLesson.id === lessonId) {
      setActiveLesson(prev => ({ ...prev, isCompleted: !prev.isCompleted }));
    }
  };

  const toggleBookmark = (lessonId: string) => {
    setBookmarkedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId) 
        : [...prev, lessonId]
    );
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setIsFeedbackSubmitted(true);
    setTimeout(() => {
      setIsFeedbackSubmitted(false);
      setFeedback('');
      setRating(0);
    }, 4000);
  };

  const startDownload = (id: number, name: string) => {
    setDownloadingId(id);
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadingId(null);
          setIsDownloaded(old => [...old, id]);
          setShowDownloadSuccess(name);
          setTimeout(() => setShowDownloadSuccess(null), 3000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const sendQuestion = () => {
    if (!questionText.trim()) return;
    setIsQuestionSent(true);
    setTimeout(() => {
      setIsQuestionSent(false);
      setQuestionText('');
      setIsMentorModalOpen(false);
    }, 2000);
  };

  return (
    <div className="pt-20 h-screen flex flex-col bg-white">
      {/* Header bar */}
      <div className="bg-slate-900 text-white px-4 md:px-8 py-4 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <button onClick={() => setView('dashboard')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
               <ChevronLeft size={24} />
            </button>
            <div>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">SNBT KEDOKTERAN</p>
               <h1 className="text-sm md:text-lg font-bold truncate max-w-[200px] md:max-w-md">{activeLesson.title}</h1>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-4">
               <p className="text-[10px] text-slate-400">Progres Kursus</p>
               <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-brand-blue transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <span className="text-xs font-bold">{progressPercent}%</span>
               </div>
            </div>
            <button 
              onClick={() => setView('dashboard')}
              className="btn-primary py-2 px-4 text-xs"
            >
               Selesai Belajar
            </button>
         </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
         {/* Main Content Area */}
         <div className="flex-1 overflow-y-auto bg-slate-50">
            <div className="max-w-4xl mx-auto p-4 md:p-10">
               {/* Video Player Custom Controls Mockup */}
               <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative group mb-8">
                  <img 
                    src="https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=1200" 
                    className="w-full h-full object-cover opacity-60" 
                    alt="Video Thumbnail" 
                  />
                  
                  {/* Glassmorph Video Overlay */}
                  <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                     <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-24 h-24 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95"
                    >
                        {isPlaying ? <Pause size={44} fill="white" /> : <Play size={44} className="ml-2" fill="white" />}
                     </button>
                  </div>

                  {/* Custom Player Controls */}
                  <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                     {/* Seek Bar */}
                     <div className="group/seek mb-4 relative cursor-pointer pt-2" onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        setProgress((x / rect.width) * 100);
                     }}>
                        <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                           <div 
                              className="h-full bg-brand-blue relative" 
                              style={{ width: `${progress}%` }}
                            >
                               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/seek:opacity-100 transition-opacity" />
                            </div>
                         </div>
                     </div>

                     <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                           <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-brand-blue transition-colors">
                              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                           </button>
                           
                           <div className="flex items-center gap-3 text-white">
                              <button onClick={() => setIsMuted(!isMuted)}>
                                 {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                              </button>
                              <input 
                                 type="range" 
                                 min="0" 
                                 max="100" 
                                 value={isMuted ? 0 : volume} 
                                 onChange={(e) => {
                                    setVolume(parseInt(e.target.value));
                                    if (parseInt(e.target.value) > 0) setIsMuted(false);
                                 }}
                                 className="w-20 h-1 accent-brand-blue cursor-pointer"
                              />
                           </div>
                           
                           <span className="text-xs text-white/70 font-mono tracking-tighter">
                              {Math.floor((activeLesson.duration ? 10 : 5) * (progress/100))}:42 / {activeLesson.duration}
                           </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-white">
                           <button className="text-white/70 hover:text-white transition-colors">CC</button>
                           <button className="text-white/70 hover:text-white transition-colors">1.0x</button>
                           <button className="text-white/70 hover:text-white transition-colors"><Maximize size={20} /></button>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Tabs Navigation */}
               <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
                  <button 
                    onClick={() => setActiveTab('content')}
                    className={`px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'content' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                  >
                     Video & Materi
                  </button>
                  <button 
                    onClick={() => setActiveTab('live')}
                    disabled={!isPremium}
                    className={`px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'live' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                  >
                     {isPremium ? <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> : <Lock size={14} />}
                     Live Session {isPremium ? '' : '(Premium)'}
                  </button>
               </div>

               {activeTab === 'content' ? (
                  <>
               {!isPremium && (
                 <div className="mb-6 p-5 bg-amber-50 border border-amber-100 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                       <p className="text-sm font-black text-brand-navy mb-1">Akun Gratis</p>
                       <p className="text-xs text-slate-600">Kamu bisa mencoba {freeLessonLimit} video/modul pertama. Materi lanjutan dan live session tersedia untuk akun premium.</p>
                    </div>
                    <button onClick={onUpgrade} className="px-4 py-3 bg-brand-orange text-white rounded-xl text-xs font-black">Upgrade Paket</button>
                 </div>
               )}

               {/* Lesson Detail */}
               <div className="mb-12">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                     <h2 className="text-2xl font-bold text-brand-navy">{activeLesson.title}</h2>
                     <div className="flex gap-2">
                        <button 
                          onClick={() => toggleComplete(activeLesson.id)}
                          disabled={isActiveLessonLocked}
                          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95 ${activeLesson.isCompleted ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-emerald-500/10' : 'bg-brand-blue text-white shadow-blue-500/20'}`}
                        >
                           {isActiveLessonLocked ? <Lock size={18} /> : activeLesson.isCompleted ? <CheckCircle2 size={18} fill="currentColor" /> : <Play size={18} />}
                           {isActiveLessonLocked ? 'Materi Premium' : activeLesson.isCompleted ? 'Sudah Dipelajari' : 'Tandai Selesai'}
                        </button>
                        <button className="p-3 bg-white rounded-2xl text-slate-500 hover:text-brand-blue border border-slate-100 shadow-sm transition-all hover:scale-110 active:scale-90">
                           <Share2 size={20} />
                        </button>
                     </div>
                  </div>
                  <div className="prose prose-slate max-w-none text-slate-600 space-y-4 leading-relaxed font-medium">
                     {isActiveLessonLocked ? (
                       <div className="p-8 bg-white border border-amber-100 rounded-3xl text-center">
                         <Lock size={32} className="text-amber-500 mx-auto mb-4" />
                         <p className="font-bold text-brand-navy mb-2">Materi ini tersedia untuk akun premium.</p>
                         <p className="text-sm text-slate-500 mb-5">Upgrade paket untuk membuka semua video, modul pembelajaran, live session, jadwal, dan rekaman kelas.</p>
                         <button onClick={onUpgrade} className="btn-primary mx-auto">Upgrade Paket</button>
                       </div>
                     ) : (
                       <p>
                          Dalam pertemuan kali ini, kita akan membahas dasar-dasar logika yang sering keluar di soal SNBT Penalaran Umum. 
                          Memahami silogisme, modus ponens, dan modus tollens adalah kunci utama untuk menjawab soal tipe penarikan kesimpulan.
                       </p>
                     )}
                  </div>
               </div>

               {/* Feedback Section */}
               <div className="card-premium p-10 bg-white mb-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <h3 className="font-bold text-brand-navy mb-6 flex items-center gap-3">
                     <div className="p-2 bg-blue-50 rounded-lg text-brand-blue"><MessageSquare size={20} /></div>
                     Beri Feedback Materi
                  </h3>
                  
                  <AnimatePresence mode="wait">
                  {isFeedbackSubmitted ? (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      className="bg-emerald-50 p-10 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-6 border border-emerald-100"
                    >
                       <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/50">
                          <CheckCircle2 size={40} />
                       </div>
                       <div>
                          <h4 className="text-xl font-bold text-emerald-900 mb-2">Terima Kasih!</h4>
                          <p className="text-emerald-700 font-medium">Feedback kamu sangat berharga untuk peningkatan kualitas belajar kita.</p>
                       </div>
                    </motion.div>
                  ) : (
                    <motion.form 
                      key="form"
                      onSubmit={handleFeedbackSubmit} 
                      className="space-y-6 relative z-10"
                    >
                       <div className="flex items-center gap-4">
                          <div className="flex items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                             {[1, 2, 3, 4, 5].map((s) => (
                               <button
                                  key={s}
                                  type="button"
                                  onClick={() => setRating(s)}
                                  className={`p-1.5 transition-all hover:scale-125 ${s <= rating ? 'text-amber-400' : 'text-slate-200'}`}
                               >
                                  <Star size={24} fill={s <= rating ? 'currentColor' : 'none'} />
                               </button>
                             ))}
                          </div>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">Beri rating video ini</p>
                       </div>
                       
                       <div className="group relative">
                          <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Ada bagian yang kurang jelas? Atau punya saran perbaikan?"
                            className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue outline-none transition-all min-h-[140px] shadow-inner"
                          />
                          <button 
                            type="submit"
                            disabled={rating === 0}
                            className="absolute bottom-6 right-6 px-4 py-3 bg-brand-blue text-white rounded-xl shadow-xl shadow-blue-500/20 disabled:opacity-30 disabled:shadow-none transition-all flex items-center gap-2 font-bold text-xs"
                          >
                             Kirim Feedback
                             <Send size={16} />
                          </button>
                       </div>
                    </motion.form>
                  )}
                  </AnimatePresence>
               </div>

               {/* Downloads */}
               <div className="card-premium p-8">
                  <h3 className="font-bold text-brand-navy mb-6 flex items-center gap-3">
                     <div className="p-2 bg-slate-50 rounded-lg"><Download size={20} className="text-slate-400" /></div>
                     Materi Pendukung
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                     {[
                       { id: 1, name: 'Modul Penalaran Umum PDF', size: '2.4 MB' },
                       { id: 2, name: 'Latihan Soal & Kunci Jawaban', size: '1.2 MB' }
                     ].map((doc) => (
                        <button
                          type="button"
                          key={doc.id} 
                          disabled={downloadingId !== null || isDownloaded.includes(doc.id)}
                          onClick={() => downloadingId === null && !isDownloaded.includes(doc.id) && startDownload(doc.id, doc.name)}
                          className={`flex flex-col gap-4 p-6 rounded-3xl border transition-all text-left disabled:cursor-not-allowed relative overflow-hidden ${isDownloaded.includes(doc.id) ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100 hover:border-brand-blue/30 hover:shadow-xl group'}`}
                        >
                          <div className="flex items-center justify-between">
                             <div className="p-3 bg-blue-50 text-brand-blue rounded-2xl">
                                <FileText size={24} />
                             </div>
                             {isDownloaded.includes(doc.id) ? (
                               <CheckCircle2 size={24} className="text-emerald-500" />
                             ) : downloadingId === doc.id ? (
                               <div className="text-[10px] font-black text-brand-blue">{downloadProgress}%</div>
                             ) : (
                               <Download size={20} className="text-slate-300 group-hover:text-brand-blue group-hover:rotate-6 transition-all" />
                             )}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-brand-navy mb-1">{doc.name}</p>
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{doc.size}</p>
                          </div>
                          
                           {downloadingId === doc.id && (
                              <div className="absolute bottom-0 left-0 h-1.5 bg-brand-blue transition-all duration-300" style={{ width: `${downloadProgress}%` }} />
                           )}
                       </button>
                     ))}
                  </div>
               </div>
               </>
               ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
                     <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-500 mb-8 animate-bounce">
                        <Monitor size={48} />
                     </div>
                     <h3 className="text-2xl font-bold text-brand-navy mb-4">Sesi Live Mendatang</h3>
                     <p className="text-slate-500 mb-8">Nantikan diskusi materi intensif langsung bersama mentor terbaik setiap Sabtu malam melalui Google Meet.</p>
                     <div className="p-6 bg-slate-900 rounded-3xl text-white w-full space-y-5">
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{liveSession.date}</span>
                           <span className="px-2 py-1 bg-red-500 text-[10px] font-black rounded-md">{liveSession.gmailStatus}</span>
                        </div>
                        <h4 className="text-lg font-bold">{liveSession.title}</h4>
                        <div className="flex items-center gap-4 text-xs">
                           <div className="flex items-center gap-2">
                              <Clock size={16} className="text-brand-orange" />
                              <span>{liveSession.time}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <Video size={16} className="text-brand-blue" />
                              <span>{liveSession.mode}</span>
                           </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3 pt-2">
                           <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-left">
                              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                 <Mail size={14} className="text-red-400" />
                                 Notifikasi Gmail
                              </div>
                              <p className="text-xs text-white/70 leading-relaxed">Reminder dan detail kelas dikirim ke email siswa H-1 dan 1 jam sebelum sesi.</p>
                           </div>
                           <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-left">
                              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                 <Calendar size={14} className="text-emerald-400" />
                                 Google Calendar
                              </div>
                              <p className="text-xs text-white/70 leading-relaxed">Jadwal otomatis tersimpan di Google Calendar dan halaman Schedule.</p>
                           </div>
                        </div>
                        <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-400/20 text-left">
                           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-2">
                              <Archive size={14} />
                              Rekaman Kelas
                           </div>
                           <p className="text-xs text-white/70 leading-relaxed">
                              {liveSession.recordingStatus} Rekaman bisa diputar ulang kapan saja.
                           </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-1">
                           <a
                              href={liveSession.calendarUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 px-4 py-3 rounded-xl bg-white text-brand-navy text-xs font-black flex items-center justify-center gap-2 hover:bg-blue-50 transition-all"
                           >
                              Tambah ke Calendar
                              <Calendar size={16} />
                           </a>
                           <a
                              href={liveSession.meetUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 px-4 py-3 rounded-xl bg-brand-blue text-white text-xs font-black flex items-center justify-center gap-2 hover:bg-blue-600 transition-all"
                           >
                              Masuk GMeet
                              <ExternalLink size={16} />
                           </a>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </div>

         {/* Right Sidebar - Module List */}
         <aside className="w-full lg:w-96 border-l border-slate-100 bg-white overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
               <h3 className="font-bold text-brand-navy">Daftar Modul</h3>
               <span className="bg-blue-50 text-brand-blue text-[10px] font-bold px-2 py-1 rounded-md">{totalLessons - completedLessons} Materi Lagi</span>
            </div>
            
            <div className="p-4 space-y-6">
               {curriculum.map((mod) => {
                 const modTotal = mod.lessons.length;
                 const modCompleted = mod.lessons.filter(l => l.isCompleted).length;
                 const modPercent = Math.round((modCompleted / modTotal) * 100);

                 return (
                   <div key={mod.id}>
                      <div className="px-2 mb-3">
                        <div className="flex justify-between items-center mb-1.5">
                           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{mod.title}</h4>
                           <span className="text-[10px] font-bold text-slate-500">{modPercent}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-brand-blue/30 transition-all duration-500" style={{ width: `${modPercent}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        {mod.lessons.map((lesson) => {
                          const isLocked = !accessibleLessonIds.has(lesson.id);

                          return (
                          <div key={lesson.id} className={`flex items-center gap-1 group pr-2 ${isLocked ? 'opacity-60' : ''}`}>
                             <button
                               onClick={() => {
                                 if (isLocked) return;
                                 setActiveLesson(lesson);
                               }}
                               disabled={isLocked}
                               className={`flex-1 flex items-center gap-3 p-3 rounded-2xl text-left transition-colors ${activeLesson.id === lesson.id ? 'bg-blue-50 text-brand-blue border border-brand-blue/10' : 'hover:bg-slate-50 text-slate-600'}`}
                             >
                                <div className="flex-shrink-0">
                                   {isLocked ? (
                                     <div className="w-7 h-7 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
                                        <Lock size={12} />
                                     </div>
                                   ) : lesson.isCompleted ? (
                                     <div className="w-7 h-7 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                        <CheckCircle2 size={14} />
                                     </div>
                                   ) : (
                                     <div className={`w-7 h-7 rounded-full flex items-center justify-center ${activeLesson.id === lesson.id ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        <Play size={10} className={activeLesson.id === lesson.id ? 'fill-white' : ''} />
                                     </div>
                                   )}
                                </div>
                                 <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-bold truncate leading-snug">{lesson.title}</p>
                                    <p className="text-[10px] font-medium opacity-60 mt-0.5">{isLocked ? 'Premium' : lesson.duration}</p>
                                 </div>
                              </button>
                             <button 
                               onClick={(e) => { e.stopPropagation(); toggleBookmark(lesson.id); }}
                               className={`p-2 rounded-xl transition-all ${bookmarkedLessons.includes(lesson.id) ? 'bg-amber-50 text-amber-500' : 'text-slate-300 hover:bg-slate-50 hover:text-slate-400'}`}
                              >
                                 <Bookmark size={14} fill={bookmarkedLessons.includes(lesson.id) ? 'currentColor' : 'none'} />
                              </button>
                           </div>
                        )})}
                      </div>
                   </div>
                 );
               })}
               
               {/* Locked Module Example */}
               <div className="opacity-50 pointer-events-none">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Matematika Intensif</h4>
                  <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex items-center gap-4">
                     <div className="w-8 h-8 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center">
                        <Lock size={16} />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-500">Persiapan Berhitung Cepat</p>
                        <p className="text-[10px] font-medium text-slate-400">Tersedia 01 Mei 2026</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Mentor Button & Modal */}
            <div className="sticky bottom-0 p-4 bg-white border-t border-slate-100">
               <button 
                 onClick={() => setIsMentorModalOpen(true)}
                 className="w-full btn-secondary text-sm py-4 group active:scale-95 transition-all"
               >
                  <div className="p-1 px-2 bg-emerald-500 text-white rounded text-[8px] font-black uppercase tracking-widest absolute -top-2 left-4 shadow-sm">Feedback</div>
                  <Star size={18} className="group-hover:rotate-12 transition-transform" />
                  Beri Rating Pelajaran
               </button>
            </div>
         </aside>
      </div>

      {/* Mentor Help Modal */}
      <AnimatePresence>
      {isMentorModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 pointer-events-none">
           <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMentorModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto"
           />
           
           <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden relative z-10 pointer-events-auto"
           >
              <div className="p-8 bg-brand-navy text-white flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-orange/20 flex items-center justify-center text-brand-orange">
                       <Star size={24} fill="currentColor" />
                    </div>
                    <div>
                       <h3 className="font-bold text-lg leading-none mb-1">Feedback Pelajaran</h3>
                       <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none">Bantu kami meningkatkan materi ini</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => setIsMentorModalOpen(false)}
                   className="p-2 hover:bg-white/10 rounded-full transition-colors"
                 >
                    <X size={24} />
                 </button>
              </div>
              
              <div className="p-10 space-y-8">
                 {isQuestionSent ? (
                   <div className="flex flex-col items-center justify-center text-center py-10">
                      <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/30">
                         <CheckCircle2 size={40} />
                      </div>
                      <h4 className="text-2xl font-bold text-brand-navy mb-2">Terima Kasih!</h4>
                      <p className="text-slate-500 font-medium">Feedback kamu telah kami simpan untuk pengembangan selanjutnya.</p>
                   </div>
                 ) : (
                   <>
                   <div className="space-y-6">
                      <div className="text-center space-y-4">
                         <p className="text-sm font-bold text-slate-500">Beri rating untuk materi "<span className="text-brand-blue">{activeLesson.title}</span>"</p>
                         <div className="flex items-center justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                 key={s}
                                 onClick={() => setRating(s)}
                                 className={`p-2 transition-all hover:scale-125 ${s <= rating ? 'text-amber-400' : 'text-slate-200'}`}
                              >
                                 <Star size={36} fill={s <= rating ? 'currentColor' : 'none'} />
                              </button>
                            ))}
                         </div>
                       </div>
                      <textarea 
                         value={questionText}
                         onChange={(e) => setQuestionText(e.target.value)}
                         placeholder="Apa pendapatmu tentang video ini? (Opsional)"
                         className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl min-h-[140px] outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue transition-all font-medium text-sm"
                      />
                   </div>
                   
                   <button 
                      onClick={sendQuestion}
                      disabled={rating === 0}
                      className="w-full btn-orange py-5 rounded-[1.5rem] shadow-xl shadow-brand-orange/20 disabled:opacity-50 disabled:shadow-none"
                   >
                      Bagikan Feedback
                      <Send size={20} />
                    </button>

                   <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50/50">
                      <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                         <Monitor size={16} />
                      </div>
                      
                   </div>
                   </>
                 )}
              </div>
           </motion.div>
        </div>
      )}
      </AnimatePresence>

      <AnimatePresence>
        {showDownloadSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[200] px-8 py-4 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10"
          >
             <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                <CheckCircle2 size={20} />
             </div>
             <div className="pr-4">
                <p className="text-sm font-bold">Download Berhasil!</p>
                <p className="text-[10px] text-slate-400 font-medium">"{showDownloadSuccess}" tersimpan.</p>
             </div>
             <button onClick={() => setShowDownloadSuccess(null)} className="p-1 hover:bg-white/10 rounded-lg">
                <X size={16} />
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
