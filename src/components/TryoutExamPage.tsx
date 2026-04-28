import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  Flag, 
  AlertCircle,
  CheckCircle2,
  Bookmark,
  Filter,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TryoutSubtestResult, View } from '../types';
import { TRYOUTS } from '../constants';

interface TryoutQuestionMeta {
  subject: string;
  correctAnswer: string;
  recommendedLessonIds: string[];
}

const QUESTION_COUNT = 40;
const QUESTION_META: TryoutQuestionMeta[] = Array.from({ length: QUESTION_COUNT }, (_, index) => {
  const questionNumber = index + 1;
  if (questionNumber <= 7) return { subject: 'Penalaran Umum', correctAnswer: 'C', recommendedLessonIds: ['l2'] };
  if (questionNumber <= 14) return { subject: 'Pengetahuan Umum', correctAnswer: 'B', recommendedLessonIds: ['l6'] };
  if (questionNumber <= 20) return { subject: 'Memahami Bacaan', correctAnswer: 'D', recommendedLessonIds: ['l7'] };
  if (questionNumber <= 28) return { subject: 'Pengetahuan Kuantitatif', correctAnswer: 'A', recommendedLessonIds: ['l3', 'l4'] };
  if (questionNumber <= 34) return { subject: 'Literasi Bahasa Indonesia', correctAnswer: 'E', recommendedLessonIds: ['l8'] };
  return { subject: 'Literasi Bahasa Inggris', correctAnswer: 'B', recommendedLessonIds: ['l5'] };
});

export const TryoutExamPage: React.FC<{ setView: (v: View) => void; setTryoutResults: (results: TryoutSubtestResult[]) => void; selectedTryoutId?: string | null }> = ({ setView, setTryoutResults, selectedTryoutId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeLeft, setTimeLeft] = useState(120 * 60); // 120 minutes in seconds
  const [flagged, setFlagged] = useState<number[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [navFilter, setNavFilter] = useState<'all' | 'unanswered' | 'flagged'>('all');
  const selectedTryout = TRYOUTS.find((tryout) => tryout.id === selectedTryoutId) || TRYOUTS[0];

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-save effect
  useEffect(() => {
    const autoSave = setInterval(() => {
      // Simulate saving progress
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    }, 30000); // Every 30 seconds
    return () => clearInterval(autoSave);
  }, [answers, flagged]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleFlag = (num: number) => {
    setFlagged(prev => prev.includes(num) ? prev.filter(f => f !== num) : [...prev, num]);
  };

  const selectAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const submitExam = () => {
    const grouped = QUESTION_META.reduce<Record<string, TryoutSubtestResult>>((acc, meta, index) => {
      const questionNumber = index + 1;
      const answer = answers[questionNumber];
      if (!acc[meta.subject]) {
        acc[meta.subject] = {
          name: meta.subject,
          score: 0,
          total: 100,
          correct: 0,
          wrong: 0,
          skip: 0,
          recommendedLessonIds: meta.recommendedLessonIds
        };
      }

      if (!answer) {
        acc[meta.subject].skip += 1;
      } else if (answer === meta.correctAnswer) {
        acc[meta.subject].correct += 1;
      } else {
        acc[meta.subject].wrong += 1;
      }

      return acc;
    }, {});

    const results = Object.values(grouped).map((subtest) => {
      const questionTotal = subtest.correct + subtest.wrong + subtest.skip;
      return {
        ...subtest,
        score: Math.round((subtest.correct / questionTotal) * 100)
      };
    });

    setTryoutResults(results);
    setView('result');
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-10 h-10 bg-brand-navy rounded-xl flex items-center justify-center text-white">
                  <Bookmark size={20} />
               </div>
               <div className="hidden sm:block">
                  <h1 className="text-sm font-bold text-brand-navy">{selectedTryout.title}</h1>
                  <p className="text-[10px] text-brand-blue font-bold tracking-widest uppercase">Tryout Gratis: {selectedTryout.category}</p>
               </div>
            </div>
         </div>

         <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 px-5 py-2 bg-slate-50 border border-slate-200 rounded-2xl">
               <Clock size={20} className={timeLeft < 600 ? 'text-red-500 animate-pulse' : 'text-slate-400'} />
               <span className={`font-mono text-lg font-bold ${timeLeft < 600 ? 'text-red-600' : 'text-brand-navy'}`}>
                  {formatTime(timeLeft)}
               </span>
            </div>
            <button 
               onClick={() => setShowExitModal(true)}
               className="btn-primary bg-emerald-600 hover:bg-emerald-700 py-2.5"
            >
               Selesai Ujian
            </button>
         </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
         {/* Question Area */}
         <main className="flex-1 overflow-y-auto p-4 md:p-12 relative">
            <div className="max-w-3xl mx-auto">
               <div className="mb-8 flex items-center justify-between">
                  <span className="px-4 py-1.5 bg-brand-blue/10 text-brand-blue rounded-full text-xs font-bold ring-1 ring-brand-blue/20">
                     Pertanyaan ke-{currentQuestion} dari {QUESTION_COUNT}
                  </span>
                  <button 
                    onClick={() => toggleFlag(currentQuestion)}
                    className={`flex items-center gap-2 text-xs font-bold transition-colors ${flagged.includes(currentQuestion) ? 'text-brand-orange' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                     <Flag size={16} fill={flagged.includes(currentQuestion) ? 'currentColor' : 'none'} />
                     {flagged.includes(currentQuestion) ? 'Ragu-ragu (Ditandai)' : 'Tandai Ragu-ragu'}
                  </button>
               </div>

               <div className="card-premium p-8 mb-8 bg-white border-slate-200">
                  <div className="prose prose-slate max-w-none text-brand-navy text-lg leading-relaxed mb-10">
                     <p>
                        Jika semua peserta The Prams rajin berlatih tryout, maka rata-rata skor nasional akan meningkat. 
                        Diketahui bahwa rata-rata skor nasional tahun ini tidak meningkat sama sekali dibandingkan tahun lalu.
                     </p>
                     <p className="font-bold mt-4 italic">Manakah simpulan yang paling tepat?</p>
                  </div>

                  <div className="space-y-4">
                     {[
                       { key: 'A', text: 'Ada peserta The Prams yang rajin berlatih tryout.' },
                       { key: 'B', text: 'Semua peserta The Prams tidak rajin berlatih tryout.' },
                       { key: 'C', text: 'Tidak semua peserta The Prams rajin berlatih tryout.' },
                       { key: 'D', text: 'Rata-rata skor nasional menurun karena faktor lain.' },
                       { key: 'E', text: 'Peserta The Prams tidak berpengaruh pada skor nasional.' }
                     ].map((opt) => (
                       <button
                         key={opt.key}
                         onClick={() => selectAnswer(opt.key)}
                         className={`w-full group text-left flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${answers[currentQuestion] === opt.key ? 'border-brand-blue bg-blue-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                       >
                          <div className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${answers[currentQuestion] === opt.key ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                             {opt.key}
                          </div>
                          <span className={`font-medium ${answers[currentQuestion] === opt.key ? 'text-brand-blue' : 'text-slate-600'}`}>
                             {opt.text}
                          </span>
                       </button>
                     ))}
                  </div>
               </div>

               {/* Navigation Buttons */}
               <div className="flex items-center justify-between mt-12 pb-20">
                  <button 
                    disabled={currentQuestion === 1}
                    onClick={() => setCurrentQuestion(q => q - 1)}
                    className="btn-secondary py-3 px-8 disabled:opacity-30 disabled:pointer-events-none"
                  >
                     <ChevronLeft size={20} />
                     Sebelumnya
                   </button>
                   <button 
                    disabled={currentQuestion === QUESTION_COUNT}
                    onClick={() => setCurrentQuestion(q => q + 1)}
                    className="btn-primary py-3 px-8 disabled:opacity-30 disabled:pointer-events-none"
                  >
                     Selanjutnya
                     <ChevronRight size={20} />
                   </button>
               </div>
            </div>
         </main>

         {/* Right Sidebar - Selection Grid */}
         <aside className="w-80 bg-white border-l border-slate-200 hidden xl:flex flex-col">
            <div className="p-6 border-b border-slate-100">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-brand-navy flex items-center gap-2">
                     <LayoutGrid size={18} />
                     Navigasi Soal
                  </h3>
                  <div className="relative group">
                     <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                        <Filter size={16} />
                     </button>
                     <div className="absolute right-0 mt-2 w-40 bg-white shadow-xl border border-slate-100 rounded-xl py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50">
                        {['all', 'unanswered', 'flagged'].map((f) => (
                           <button
                              key={f}
                              onClick={() => setNavFilter(f as any)}
                              className={`w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest ${navFilter === f ? 'text-brand-blue bg-blue-50' : 'text-slate-500 hover:bg-slate-50'}`}
                           >
                              {f === 'all' ? 'Semua Soal' : f === 'unanswered' ? 'Belum Jawab' : 'Ragu-ragu'}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
               <p className="text-[10px] font-medium text-slate-400">Menampilkan: <span className="font-bold text-brand-blue uppercase">{navFilter}</span></p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
               <div className="grid grid-cols-5 gap-3">
                  {Array.from({ length: QUESTION_COUNT }).map((_, i) => {
                    const num = i + 1;
                    const isAnswered = !!answers[num];
                    const isFlagged = flagged.includes(num);
                    const isActive = currentQuestion === num;

                    if (navFilter === 'unanswered' && isAnswered) return null;
                    if (navFilter === 'flagged' && !isFlagged) return null;

                    return (
                      <button
                        key={num}
                        onClick={() => setCurrentQuestion(num)}
                        className={`
                          aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-all border-2
                          ${isActive ? 'border-brand-blue bg-white text-brand-blue scale-110 shadow-md z-10' : 
                            isFlagged ? 'border-brand-orange bg-brand-orange text-white' : 
                            isAnswered ? 'border-emerald-500 bg-emerald-500 text-white' : 
                            'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300'}
                        `}
                      >
                        {num}
                      </button>
                    )
                  })}
               </div>
            </div>

            <div className="p-6 bg-slate-50 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                     <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                     Terjawab
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                     <div className="w-3 h-3 rounded-sm bg-brand-orange" />
                     Ragu-ragu
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                     <div className="w-3 h-3 rounded-sm bg-slate-200" />
                     Belum
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                     <div className="w-3 h-3 rounded-sm border border-brand-blue" />
                     Aktif
                  </div>
               </div>
            </div>
         </aside>
      </div>

      {/* Auto-save Toast */}
      <AnimatePresence>
         {showSavedToast && (
            <motion.div 
               initial={{ y: 50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: 50, opacity: 0 }}
               className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-brand-navy text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-white/10"
            >
               <Save size={14} className="text-emerald-400" />
               <span className="text-[10px] font-bold uppercase tracking-widest">Progress Tersimpan Otomatis</span>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-navy/60 backdrop-blur-sm">
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl text-center"
           >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-bold text-brand-navy mb-4">Selesaikan Ujian Sekarang?</h2>
              <p className="text-slate-500 mb-8">
                 Kamu masih memiliki <span className="font-bold text-brand-blue"> {formatTime(timeLeft)} </span> sisa waktu. 
                 Apakah kamu yakin ingin mengakhiri sesi Simulasi SNBT ini?
              </p>
              <div className="grid grid-cols-2 gap-4">
                 <button 
                   onClick={() => setShowExitModal(false)}
                   className="btn-secondary border-slate-200 text-slate-600"
                 >
                    Batal
                 </button>
                 <button 
                    onClick={submitExam}
                    className="btn-primary bg-emerald-600 hover:bg-emerald-700"
                 >
                    Ya, Kumpulkan
                 </button>
              </div>
           </motion.div>
        </div>
      )}
    </div>
  );
};
