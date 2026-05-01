import React, { useState } from 'react';
import { 
  Trophy, 
  ChevronRight, 
  Download, 
  RotateCcw, 
  BarChart2, 
  Target, 
  Brain, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TryoutSubtestResult, User, View } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { CURRICULUM, TRYOUTS, TRYOUT_SUBTEST_RESULTS } from '../constants';
import { escapeHtml } from '../utils/security';

const MOCK_QUESTIONS = [
  { id: 1, text: "Jika semua peserta The Prams rajin berlatih tryout, maka rata-rata skor nasional akan meningkat...", isCorrect: true, userAns: "C", keyAns: "C", explanation: "Berdasarkan prinsip Modus Tollens: Jika P maka Q. Ternyata tidak Q. Maka kesimpulannya tidak P. Dalam konteks ini, karena rata-rata skor tidak meningkat, maka kesimpulannya tidak semua peserta rajin berlatih." },
  { id: 2, text: "Semua dokter adalah ilmuwan. Beberapa ilmuwan adalah penulis. Simpulan yang tepat adalah...", isCorrect: false, userAns: "B", keyAns: "D", explanation: "Karena 'beberapa ilmuwan' tidak menjamin keikutsertaan 'dokter' dalam kelompok penulis tersebut, maka tidak ada hubungan pasti yang bisa ditarik antara dokter dan penulis." },
  { id: 3, text: "Berapakah hasil dari 25% dari 80 dikali 3?", isCorrect: true, userAns: "A", keyAns: "A", explanation: "25% dari 80 = 20. Kemudian 20 x 3 = 60." },
];

export const TryoutResultPage: React.FC<{ setView: (v: View) => void; tryoutResults?: TryoutSubtestResult[] | null; user: User | null; selectedTryoutId?: string | null; onUpgrade: () => void; onConsult: () => void }> = ({ setView, tryoutResults, user, selectedTryoutId, onUpgrade, onConsult }) => {
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const isGuestTryout = user?.id === 'u_guest';
  const selectedTryout = TRYOUTS.find((tryout) => tryout.id === selectedTryoutId) || TRYOUTS[0];
  const resultData = tryoutResults?.length ? tryoutResults : TRYOUT_SUBTEST_RESULTS;
  const totalCorrect = resultData.reduce((sum, sub) => sum + sub.correct, 0);
  const totalWrong = resultData.reduce((sum, sub) => sum + sub.wrong, 0);
  const totalSkip = resultData.reduce((sum, sub) => sum + sub.skip, 0);
  const totalAnswered = totalCorrect + totalWrong + totalSkip;
  const accuracy = Math.round((totalCorrect / totalAnswered) * 100);
  const averageScore = resultData.reduce((sum, sub) => sum + sub.score, 0) / resultData.length;
  const totalScore = (averageScore * 10).toFixed(1);
  const ranking = Math.max(1, Math.round(1250 - (averageScore / 100) * 1250));
  const weakestSubjects = [...resultData].sort((a, b) => a.score - b.score).slice(0, 2);
  const weakestSubject = weakestSubjects[0];
  const lessonLookup = new Map(
    CURRICULUM.flatMap((mod) =>
      mod.lessons.map((lesson) => [lesson.id, { ...lesson, moduleTitle: mod.title }] as const)
    )
  );
  const recommendations = weakestSubjects.flatMap((subject) =>
    subject.recommendedLessonIds
      .map((lessonId) => {
        const lesson = lessonLookup.get(lessonId);
        return lesson ? { ...lesson, subjectName: subject.name, score: subject.score } : null;
      })
      .filter((lesson): lesson is NonNullable<typeof lesson> => Boolean(lesson))
  ).slice(0, 3);
  const radarData = resultData.map((sub) => ({
    subject: sub.name,
    A: sub.score,
    B: Math.min(100, sub.score + 15),
    fullMark: 100
  }));
  const targetLabel = user?.targetPTN || (selectedTryout.category === 'CPNS' ? 'CPNS / Kedinasan' : 'PTN Pilihan');
  const chanceLevel = averageScore >= 78 ? 'Tinggi' : averageScore >= 60 ? 'Sedang' : averageScore >= 45 ? 'Perlu Ditingkatkan' : 'Rendah';
  const chanceColor = averageScore >= 78 ? 'emerald' : averageScore >= 60 ? 'blue' : averageScore >= 45 ? 'amber' : 'red';
  const aiInsight = averageScore >= 70
    ? `AI agent melihat performamu sudah kompetitif, tetapi ${weakestSubject.name} masih menjadi titik rawan yang perlu dikunci agar peluang ${targetLabel} lebih stabil.`
    : `AI agent menilai peluangmu untuk ${targetLabel} belum aman karena skor rata-rata masih ${Math.round(averageScore)}/100 dan subtes terlemah ada di ${weakestSubject.name}. Fokuskan latihan bertahap sebelum mengambil paket intensif.`;
  const guestResources = weakestSubjects.flatMap((subject) => [
    {
      subjectName: subject.name,
      score: subject.score,
      title: `Artikel ringkas: strategi memperbaiki ${subject.name}`,
      desc: `Baca rangkuman konsep dasar, contoh soal, dan pola kesalahan umum untuk target ${targetLabel}.`
    },
    {
      subjectName: subject.name,
      score: subject.score,
      title: `Rekomendasi buku/modul sekolah untuk ${subject.name}`,
      desc: 'Gunakan buku paket SMA/latihan UTBK yang membahas konsep dasar sebelum lanjut ke soal intensif.'
    }
  ]).slice(0, 3);
  const visibleQuestions = showAllQuestions
    ? [
        ...MOCK_QUESTIONS,
        { id: 4, text: 'Pernyataan manakah yang melemahkan argumen pada teks bacaan?', isCorrect: false, userAns: '-', keyAns: 'B', explanation: 'Soal kosong dihitung sebagai tidak menjawab. Pada tipe ini, cari opsi yang langsung menyerang hubungan sebab-akibat utama.' },
        { id: 5, text: 'Jika x + y = 12 dan x - y = 4, nilai x adalah...', isCorrect: false, userAns: '-', keyAns: 'C', explanation: 'Gunakan eliminasi dua persamaan. Jumlahkan kedua persamaan sehingga 2x = 16, maka x = 8.' }
      ]
    : MOCK_QUESTIONS;

  const openPdfReport = () => {
    const rows = resultData.map((sub) => `
      <tr>
        <td>${escapeHtml(sub.name)}</td>
        <td>${escapeHtml(sub.score)}/100</td>
        <td>${escapeHtml(sub.correct)}</td>
        <td>${escapeHtml(sub.wrong)}</td>
        <td>${escapeHtml(sub.skip)}</td>
      </tr>
    `).join('');
    const report = window.open('', '_blank');
    if (!report) return;
    report.document.write(`
      <html>
        <head>
          <title>The Prams - Laporan Hasil Tryout</title>
          <style>
            body { font-family: Arial, sans-serif; color: #0f172a; margin: 40px; }
            .brand { display:flex; align-items:center; justify-content:space-between; border-bottom: 3px solid #2563eb; padding-bottom: 18px; margin-bottom: 28px; }
            .logo { font-size: 24px; font-weight: 900; color:#1e3a8a; }
            .badge { background:#eff6ff; color:#2563eb; padding:8px 12px; border-radius:10px; font-size:11px; font-weight:800; }
            .grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin: 24px 0; }
            .card { border:1px solid #e2e8f0; border-radius:14px; padding:16px; }
            .label { font-size:10px; color:#64748b; text-transform:uppercase; font-weight:800; letter-spacing:.08em; }
            .value { font-size:28px; font-weight:900; margin-top:6px; }
            table { width:100%; border-collapse:collapse; margin-top:20px; }
            th, td { border-bottom:1px solid #e2e8f0; text-align:left; padding:12px; font-size:13px; }
            th { background:#f8fafc; font-size:11px; text-transform:uppercase; color:#64748b; }
            .note { background:#f8fafc; border-left:4px solid #2563eb; padding:16px; margin-top:24px; line-height:1.5; }
            @media print { button { display:none; } body { margin: 24px; } }
          </style>
        </head>
        <body>
          <div class="brand">
            <div>
              <div class="logo">Bimbel The Prams</div>
              <div>Laporan Hasil ${escapeHtml(selectedTryout.title)}</div>
            </div>
            <div class="badge">AI Assisted Analysis</div>
          </div>
          <h1>Hasil Tryout ${escapeHtml(user?.name || 'Peserta')}</h1>
          <p>Target: <strong>${escapeHtml(targetLabel)}</strong> | Status: <strong>${isGuestTryout ? 'Tryout Gratis' : 'Tryout Premium'}</strong></p>
          <div class="grid">
            <div class="card"><div class="label">Skor Total</div><div class="value">${escapeHtml(totalScore)}/1000</div></div>
            <div class="card"><div class="label">Akurasi</div><div class="value">${escapeHtml(accuracy)}%</div></div>
            <div class="card"><div class="label">Peluang</div><div class="value">${escapeHtml(chanceLevel)}</div></div>
          </div>
          <h2>Detail Subtes</h2>
          <table>
            <thead><tr><th>Subtes</th><th>Skor</th><th>Benar</th><th>Salah</th><th>Kosong</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="note"><strong>Analisa AI Agent:</strong> ${escapeHtml(aiInsight)}</div>
          <div class="note"><strong>Rekomendasi:</strong> Fokus pada ${escapeHtml(weakestSubjects.map((item) => item.name).join(', '))}. Konsultasi gratis disarankan untuk menyusun rencana belajar yang sesuai target.</div>
          <button onclick="window.print()">Cetak / Simpan PDF</button>
        </body>
      </html>
    `);
    report.document.close();
  };

  const toggleExpand = (id: number) => {
    setExpandedQuestions(prev => expandedQuestions.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="pt-20 min-h-screen bg-slate-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
         {/* Top Header */}
         <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-6">
               <div className="w-20 h-20 bg-brand-blue text-white rounded-3xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
                  <Trophy size={40} />
               </div>
               <div>
                  <h1 className="text-3xl font-bold text-brand-navy">Ujian Selesai!</h1>
                  <p className="text-slate-500">Berikut analisis performa {user?.name || 'peserta'} berdasarkan jawaban yang dikumpulkan.</p>
               </div>
            </div>
            <div className="flex gap-3">
               <button onClick={() => setView('tryoutListing')} className="btn-secondary">
                  <RotateCcw size={18} />
                  Ikut Ulang
               </button>
               <button onClick={openPdfReport} className="btn-primary">
                  <Download size={18} />
                  Unduh Hasil
               </button>
            </div>
         </div>

         <div className="grid lg:grid-cols-3 gap-8">
            {/* Main stats */}
            <div className="lg:col-span-2 space-y-8">
               {/* Score Cards */}
               <div className="grid sm:grid-cols-3 gap-6">
                  <div className="card-premium p-6 bg-brand-blue text-white">
                     <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">Skor Total</p>
                     <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold">{totalScore}</span>
                        <span className="text-sm font-medium text-white/70 mb-1">/ 1000</span>
                     </div>
                  </div>
                  <div className="card-premium p-6 bg-white">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Ranking</p>
                     <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-brand-navy">#{ranking}</span>
                        <span className="text-sm font-medium text-slate-400 mb-1">/ 1.250</span>
                     </div>
                  </div>
                  <div className="card-premium p-6 bg-white">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Akurasi</p>
                     <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-emerald-600">{accuracy}%</span>
                        <span className="text-sm font-medium text-slate-400 mb-1">Benar</span>
                     </div>
                  </div>
               </div>

               {/* Comparison Chart */}
               <div className="card-premium p-8 bg-white">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-xl font-bold text-brand-navy flex items-center gap-2">
                        <BarChart2 size={24} className="text-brand-blue" />
                        Analisis Topik
                     </h3>
                     <div className="flex items-center gap-4 text-xs font-bold">
                        <div className="flex items-center gap-2 text-brand-blue">
                           <div className="w-3 h-3 bg-brand-blue rounded-full" /> Nilai Peserta
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                           <div className="w-3 h-3 bg-slate-300 rounded-full" /> Rata-rata Nasional
                        </div>
                     </div>
                  </div>
                  <div className="h-[400px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                           <PolarGrid stroke="#e2e8f0" />
                           <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fill: '#64748b'}} />
                           <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                           <Radar name="Budi" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.6} />
                           <Radar name="Nasional" dataKey="B" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.2} />
                           <Tooltip />
                        </RadarChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               {/* Subtest Breakdowns */}
               <div className="card-premium p-8 bg-white">
                  <h3 className="font-bold text-brand-navy mb-6">Detail Per Subtes</h3>
                  <div className="space-y-4">
                     {resultData.map((sub, i) => (
                       <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                          <div className="flex items-center justify-between mb-4">
                             <h4 className="font-bold text-brand-navy">{sub.name}</h4>
                             <span className={`font-bold ${sub.score < 50 ? 'text-red-500' : 'text-emerald-600'}`}>{sub.score} / {sub.total}</span>
                          </div>
                          <div className="flex items-center gap-4 mb-4">
                             <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden flex">
                                <div className="h-full bg-emerald-500" style={{ width: `${(sub.correct / (sub.correct + sub.wrong + sub.skip)) * 100}%` }} />
                                <div className="h-full bg-red-500" style={{ width: `${(sub.wrong / (sub.correct + sub.wrong + sub.skip)) * 100}%` }} />
                             </div>
                             <span className="text-xs font-bold text-slate-400">{Math.round((sub.correct / (sub.correct + sub.wrong + sub.skip)) * 100)}% Match</span>
                          </div>
                          <div className="flex gap-6">
                             <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                <CheckCircle2 size={12} className="text-emerald-500" /> {sub.correct} Benar
                             </div>
                             <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                <XCircle size={12} className="text-red-500" /> {sub.wrong} Salah
                             </div>
                             <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                <AlertCircle size={12} className="text-slate-400" /> {sub.skip} Kosong
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Detailed Question Review */}
               <div className="card-premium p-8 bg-white mt-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-brand-navy flex items-center gap-3">
                       <BookOpen size={24} className="text-brand-blue" />
                       Review Soal & Pembahasan
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">Penalaran Umum</span>
                  </div>

                  <div className="space-y-4">
                     {visibleQuestions.map((q) => (
                       <div key={q.id} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${expandedQuestions.includes(q.id) ? 'border-brand-blue shadow-lg' : 'border-slate-100'}`}>
                          <button 
                            onClick={() => toggleExpand(q.id)}
                            className="w-full flex items-center gap-4 p-5 text-left bg-white hover:bg-slate-50/50 transition-colors"
                          >
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${q.isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                {q.isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                             </div>
                             <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-brand-navy truncate">Soal #{q.id}: {q.text}</p>
                                <div className="flex items-center gap-3 mt-1">
                                   <span className="text-[10px] font-bold text-slate-400">JAWABAN KAMU: <span className={q.isCorrect ? 'text-emerald-500' : 'text-red-500'}>{q.userAns}</span></span>
                                   {!q.isCorrect && <span className="text-[10px] font-bold text-emerald-500">KUNCI: {q.keyAns}</span>}
                                </div>
                             </div>
                             {expandedQuestions.includes(q.id) ? <ChevronUp size={20} className="text-slate-300" /> : <ChevronDown size={20} className="text-slate-300" />}
                          </button>
                          
                          <AnimatePresence>
                             {expandedQuestions.includes(q.id) && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden bg-slate-50"
                                >
                                   <div className="p-6 border-t border-slate-100">
                                      <div className="bg-white p-5 rounded-xl border border-slate-200 mb-4 shadow-sm">
                                         <p className="text-sm text-brand-navy leading-relaxed mb-4">{q.text}</p>
                                         <div className="flex items-center gap-2 mb-4">
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-bold rounded-lg uppercase">Kunci Jawaban: {q.keyAns}</span>
                                         </div>
                                      </div>
                                      <div className="flex gap-4">
                                         <div className="w-10 h-10 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center flex-shrink-0">
                                            <AlertCircle size={20} />
                                         </div>
                                         <div>
                                            <h5 className="text-[10px] font-bold text-brand-blue uppercase tracking-widest mb-1">Pembahasan & Analisis</h5>
                                            <p className="text-sm text-slate-600 leading-relaxed">{q.explanation}</p>
                                         </div>
                                      </div>
                                      <div className="mt-6 pt-6 border-t border-slate-200/60 flex items-center justify-between">
                                         <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                                            <BookOpen size={14} /> Pembahasan tersimpan di laporan tryout
                                          </div>
                                         {!isGuestTryout && (
                                           <button className="text-[10px] font-bold text-brand-blue hover:underline">Lihat Pembahasan Video</button>
                                         )}
                                      </div>
                                   </div>
                                </motion.div>
                             )}
                          </AnimatePresence>
                       </div>
                     ))}
                     <button
                       onClick={() => setShowAllQuestions(!showAllQuestions)}
                       className="w-full py-4 text-xs font-bold text-slate-500 hover:text-brand-blue transition-colors bg-slate-50 rounded-2xl border border-dashed border-slate-200 mt-2"
                     >
                       {showAllQuestions ? 'Sembunyikan Soal Tambahan' : 'Lihat Soal Lainnya'}
                     </button>
                  </div>
               </div>
            </div>

            {/* Recommendations & More */}
            <div className="space-y-8">
               <div className="card-premium p-8 bg-white">
                  <h3 className="font-bold text-brand-navy mb-6 flex items-center gap-2">
                     <Target size={20} className="text-brand-orange" />
                     Rekomendasi Belajar
                  </h3>
                  <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                     Berdasarkan hasil skormu yang paling rendah di <span className="font-bold text-brand-navy">{weakestSubject.name}</span> ({weakestSubject.score}/{weakestSubject.total}), 
                     AI agent merekomendasikan referensi berikut sesuai skor dan target <span className="font-bold text-brand-navy">{targetLabel}</span>:
                  </p>
                  <div className="space-y-4">
                     {(isGuestTryout ? guestResources : recommendations).map((rec, i) => (
                       <button 
                         key={`${rec.subjectName}-${i}`} 
                         onClick={() => {
                           if (!isGuestTryout) setView('learning');
                         }}
                         className="w-full p-4 bg-slate-50 hover:bg-brand-blue/5 rounded-2xl text-left border border-slate-100 group transition-all"
                       >
                          <p className="text-[10px] font-bold text-brand-blue mb-1 uppercase tracking-widest">{rec.subjectName} • {rec.score}%</p>
                          <div className="flex items-center justify-between">
                             <h4 className="text-sm font-bold text-brand-navy">{rec.title}</h4>
                             <ChevronRight size={18} className="text-slate-400 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                          </div>
                          {'desc' in rec && <p className="text-xs text-slate-500 mt-2 leading-relaxed">{rec.desc}</p>}
                       </button>
                     ))}
                  </div>
               </div>

               <div className="card-premium p-8 bg-gradient-to-br from-brand-navy to-indigo-900 text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Brain size={120} />
                  </div>
                  <h3 className="text-xl font-bold mb-4 relative z-10">Mau Skormu Lebih Tinggi?</h3>
                  <p className="text-blue-100 text-sm mb-8 leading-relaxed relative z-10">
                     {aiInsight} Ambil konsultasi gratis untuk memetakan paket belajar yang paling sesuai sebelum upgrade.
                  </p>
                  <button onClick={onConsult} className="w-full btn-orange relative z-10 group mb-3">
                     Konsultasi Gratis
                     <MessageCircle size={18} className="group-hover:translate-x-1 transition-all" />
                  </button>
                  <button onClick={onUpgrade} className="w-full bg-white/10 hover:bg-white/15 text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest relative z-10 group flex items-center justify-center gap-2">
                     Lihat Program Gratis
                     <ArrowRight size={18} className="group-hover:translate-x-1 transition-all" />
                  </button>
               </div>

               <div className="card-premium p-8 bg-white">
                  <h3 className="font-bold text-brand-navy mb-6">Peluang Lolos</h3>
                  <div className={`text-center p-6 rounded-3xl border ${
                    chanceColor === 'emerald' ? 'bg-emerald-50 border-emerald-100' :
                    chanceColor === 'blue' ? 'bg-blue-50 border-blue-100' :
                    chanceColor === 'amber' ? 'bg-amber-50 border-amber-100' :
                    'bg-red-50 border-red-100'
                  }`}>
                     <p className="font-bold text-xs uppercase tracking-widest mb-2">TARGET: {targetLabel}</p>
                     <div className="text-5xl font-bold text-brand-navy mb-2">{chanceLevel}</div>
                     <p className="text-slate-600 text-xs leading-relaxed">Berdasarkan skor rata-rata {Math.round(averageScore)}/100, peluang ini masih estimasi simulasi. Konsultasi gratis bisa membantu menentukan strategi perbaikan paling cepat.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
