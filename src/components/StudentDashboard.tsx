import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutGrid, 
  BookOpen, 
  Rocket, 
  Calendar, 
  BarChart2, 
  User, 
  ChevronRight,
  Clock,
  Play,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Trophy,
  MessageSquare,
  LogOut
} from 'lucide-react';
import { View, User as UserType } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CURRICULUM, LIVE_SESSIONS, TRYOUT_SUBTEST_RESULTS } from '../constants';
import { Lock } from 'lucide-react';

const data = [
  { name: 'Tryout 1', score: 450 },
  { name: 'Tryout 2', score: 520 },
  { name: 'Tryout 3', score: 610 },
  { name: 'Tryout 4', score: 580 },
  { name: 'Tryout 5', score: 690 },
  { name: 'Tryout 6', score: 720 },
];

export const StudentDashboard: React.FC<{ setView: (v: View) => void, user: UserType | null, logout: () => void, onUpgrade: () => void }> = ({ setView, user, logout, onUpgrade }) => {
  // Calculate real progress for UI consistency
  const totalLessons = CURRICULUM.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const completedLessons = CURRICULUM.reduce((acc, mod) => 
    acc + mod.lessons.filter(l => l.isCompleted).length, 0
  );
  const progressPercent = Math.round((completedLessons / totalLessons) * 100);
  const weakestTryoutSubjects = [...TRYOUT_SUBTEST_RESULTS].sort((a, b) => a.score - b.score).slice(0, 2);
  const lessonLookup = new Map(
    CURRICULUM.flatMap((mod) =>
      mod.lessons.map((lesson) => [
        lesson.id,
        {
          moduleTitle: mod.title,
          title: lesson.title,
          duration: lesson.duration,
          isCompleted: lesson.isCompleted
        }
      ] as const)
    )
  );
  const recommendedLessons = weakestTryoutSubjects.flatMap((subject) =>
    subject.recommendedLessonIds
      .map((lessonId) => {
        const lesson = lessonLookup.get(lessonId);
        return lesson ? { ...lesson, subjectName: subject.name, score: subject.score } : null;
      })
      .filter((lesson): lesson is NonNullable<typeof lesson> => Boolean(lesson))
  ).slice(0, 3);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-brand-navy text-white hidden lg:flex flex-col shadow-xl">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center font-bold text-xl italic shadow-lg shadow-blue-600/30">
            TP
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none tracking-tight">The Prams</h1>
            <span className="text-[10px] text-blue-400 uppercase tracking-widest font-semibold">Edu Platform</span>
          </div>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1">
           {[
             { name: 'Overview', icon: LayoutGrid, active: true },
             { name: 'Kelas Saya', icon: BookOpen, active: false, view: 'learning' },
             { name: 'Tryout', icon: Rocket, active: false, view: 'tryoutListing' },
             { name: 'Hasil & Ranking', icon: BarChart2, active: false, view: 'result' },
             { name: 'Jadwal', icon: Calendar, active: false, view: 'schedule' },
             { name: 'Profil', icon: User, active: false, view: 'profile' }
           ].map((item, i) => (
             <button
                key={i}
                disabled={!user?.isPremium && ['Tryout', 'Hasil & Ranking', 'Jadwal'].includes(item.name)}
                onClick={() => item.view && setView(item.view as View)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-r-lg transition-all border-l-4 ${!user?.isPremium && ['Tryout', 'Hasil & Ranking', 'Jadwal'].includes(item.name) ? 'opacity-40 grayscale' : ''} ${item.active ? 'bg-brand-blue/20 text-brand-blue border-brand-blue font-bold' : 'text-slate-400 hover:text-white border-transparent'}`}
             >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
                {!user?.isPremium && ['Tryout', 'Hasil & Ranking', 'Jadwal'].includes(item.name) && <Lock size={12} className="ml-auto" />}
             </button>
           ))}
           
           <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-r-lg transition-all border-l-4 border-transparent text-slate-400 hover:text-red-400 hover:bg-red-400/10 mt-4"
           >
              <LogOut size={20} />
              <span className="font-medium">Keluar</span>
           </button>
        </nav>

        <div className="p-6 mt-auto">
           <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5">
              {user?.isPremium ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Premium Member</p>
                  </div>
                  <p className="text-xs text-white">Berlaku s/d: <span className="font-bold">31 Des 2025</span></p>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-full" />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-blue-400" />
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Free Account</p>
                  </div>
                  <p className="text-xs text-white">Status: <span className="font-bold text-blue-300">Akses Terbatas</span></p>
                  <button 
                    onClick={onUpgrade}
                    className="w-full bg-brand-orange hover:bg-orange-600 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange-500/20"
                  >
                    Beli Paket Premium
                  </button>
                </div>
              )}
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-20 lg:pt-0 p-4 lg:p-10">
         <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
               <h1 className="text-2xl font-bold text-brand-navy">Selamat pagi, {user?.name.split(' ')[0]}! 👋</h1>
               <p className="text-slate-500">{user?.isPremium ? 'Ayo lanjutkan belajarmu. Target SNBT 2025 tinggal 120 hari lagi.' : 'Tingkatkan akunmu untuk akses simulasi tryout lengkap.'}</p>
            </div>
            <div className="flex items-center gap-3">
               <div className={`card-premium py-2 px-4 flex items-center gap-2 ${user?.isPremium ? 'border-emerald-100 bg-emerald-50/30 text-emerald-600' : 'border-amber-100 bg-amber-50/30 text-amber-600'}`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{user?.isPremium ? 'MEMBER PREMIUM' : 'FREE USER'}</span>
                  <p className="text-sm font-bold text-brand-navy">SNBT 2025</p>
               </div>
               <button className="p-2 card-premium text-slate-600 relative">
                  <AlertCircle size={20} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
               </button>
            </div>
         </header>

         {/* Stats */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Progress Belajar', value: user?.isPremium ? `${progressPercent}%` : '8%', icon: BookOpen, color: 'text-brand-blue' },
              { label: 'Skor Terakhir', value: user?.isPremium ? '720' : '-', icon: Trophy, color: 'text-amber-500' },
              { label: 'Ranking Cohort', value: user?.isPremium ? '#12' : '-', icon: TrendingUp, color: 'text-emerald-500' },
              { label: 'Tryout Selesai', value: user?.isPremium ? '06' : '01', icon: CheckCircle2, color: 'text-indigo-500' }
            ].map((stat, i) => (
              <div key={i} className="card-premium p-4 group">
                 <div className={`p-2 rounded-lg bg-slate-50 inline-block mb-3 transition-colors ${stat.color} group-hover:bg-brand-blue group-hover:text-white`}>
                    <stat.icon size={20} />
                 </div>
                 <p className="text-xs text-slate-500">{stat.label}</p>
                 <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-brand-navy">{stat.value}</p>
                    {!user?.isPremium && i > 0 && <Lock size={12} className="text-slate-300" />}
                 </div>
              </div>
            ))}
         </div>

         <div className="grid lg:grid-cols-3 gap-8">
            {/* Chart Area */}
            <div className="lg:col-span-2 space-y-8">
               <div className="card-premium p-6">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="font-bold text-brand-navy">Perkembangan Skor</h3>
                     <select className="text-xs bg-slate-50 border-none rounded-lg p-1.5 focus:ring-0">
                        <option>30 Hari Terakhir</option>
                        <option>Semua Waktu</option>
                     </select>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                        <Tooltip />
                        <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               <div className="grid md:grid-cols-2 gap-6">
                  <div className="card-premium p-6">
                     <h3 className="font-bold text-brand-navy mb-4">Lanjutkan Belajar</h3>
                     <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl group cursor-pointer hover:bg-brand-blue/5 transition-colors"
                          onClick={() => setView('learning')}>
                        <div className="relative">
                           <img 
                              src="https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=200" 
                              className="w-16 h-16 rounded-xl object-cover" 
                              alt="Lesson" 
                           />
                           <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play size={20} className="text-white fill-white" />
                           </div>
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-xs font-bold text-brand-blue mb-1 uppercase tracking-wider">SNBT KEDOKTERAN</p>
                           <h4 className="font-bold text-brand-navy truncate">Logika Dasar & Penarikan...</h4>
                           <div className="flex items-center gap-2 mt-1">
                              <div className="h-1 flex-1 bg-slate-200 rounded-full">
                                 <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progressPercent}%` }} />
                              </div>
                              <span className="text-[10px] text-slate-500 font-bold">{progressPercent}%</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="card-premium p-6">
                     <h3 className="font-bold text-brand-navy mb-4 text-sm flex items-center justify-between">
                        Feedback Terbaru
                        <MessageSquare size={16} className="text-brand-blue" />
                     </h3>
                     <div className="space-y-3">
                        <div className="p-3 bg-slate-50 rounded-xl">
                           <p className="text-[10px] text-slate-400 mb-1 font-bold">2 Jam Yang Lalu</p>
                           <p className="text-xs text-slate-600 line-clamp-2">"Video Penalaran Umum part 2 sangat membantu! Penjelasannya to the point banget..."</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button className="text-[10px] font-bold text-brand-blue hover:underline text-left">Lihat Feedback Semua Materi</button>
                          <button 
                            onClick={() => setView('testimonials')}
                            className="w-full py-2 bg-brand-blue/5 text-brand-blue rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all"
                          >
                            Tulis Testimoni Alumni
                          </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Sidebar info */}
            <div className="space-y-8">
               <div className="card-premium p-6">
                  <h3 className="font-bold text-brand-navy mb-4">Jadwal Kelas Hari Ini</h3>
                  {user?.isPremium ? (
                    <>
                      <div className="space-y-4">
                         {LIVE_SESSIONS.map((item, i) => (
                           <div key={i} className="flex gap-4 items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                              <div className="text-center min-w-[50px]">
                                 <p className="text-xs font-bold text-brand-blue">{item.startTime}</p>
                                 <div className="w-1 h-8 bg-blue-50 mx-auto my-1 rounded-full relative">
                                    <div className="absolute top-0 left-0 w-full h-1/2 bg-brand-blue rounded-full" />
                                 </div>
                              </div>
                              <div>
                                 <h4 className="text-sm font-bold text-brand-navy mb-1">{item.title}</h4>
                                 <p className="text-[10px] text-slate-500 mb-2">Mentor: {item.instructor}</p>
                                 <span className="px-2 py-0.5 bg-blue-50 text-brand-blue text-[10px] font-bold rounded-md">{item.mode}</span>
                                 <p className="text-[10px] text-emerald-600 font-bold mt-2">{item.gmailStatus}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                      <button
                        onClick={() => setView('schedule')}
                        className="w-full mt-6 text-sm text-slate-400 flex items-center justify-center gap-1 hover:text-brand-blue transition-colors"
                      >
                         Lihat Semua Jadwal <ChevronRight size={14} />
                      </button>
                    </>
                  ) : (
                    <div className="p-5 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center">
                       <div className="w-10 h-10 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Lock size={18} />
                       </div>
                       <p className="text-sm font-bold text-brand-navy mb-1">Jadwal tersedia untuk Premium</p>
                       <p className="text-xs text-slate-500 mb-4">Akun gratis belum memiliki akses live session dan Google Calendar.</p>
                       <button onClick={onUpgrade} className="w-full py-2 bg-brand-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                          Upgrade Paket
                       </button>
                    </div>
                  )}
               </div>

               <div className="card-premium p-6 bg-gradient-to-br from-brand-orange to-amber-500 text-white">
                  <h3 className="font-bold mb-2">Rekomendasi Belajar</h3>
                  <p className="text-xs text-white/80 mb-6">Tersinkron dari hasil tryout terakhir dan materi di Kelas Saya:</p>
                  <div className="space-y-3">
                     {recommendedLessons.length > 0 ? (
                       recommendedLessons.map((lesson) => (
                          <div key={lesson.title} className="bg-white/10 p-3 rounded-xl border border-white/20">
                             <p className="text-xs font-bold">{lesson.title}</p>
                            <p className="text-[10px] text-white/60">{lesson.subjectName} lemah: {lesson.score}% • {lesson.duration}</p>
                            <p className="text-[10px] text-white/50 mt-1">{lesson.moduleTitle}</p>
                          </div>
                        ))
                     ) : (
                       <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                          <p className="text-xs font-bold">Semua materi sudah selesai</p>
                          <p className="text-[10px] text-white/60">Cek Live Session atau ulangi materi penting.</p>
                       </div>
                     )}
                  </div>
                  <button 
                    onClick={() => setView('learning')}
                    className="w-full mt-6 py-2 bg-white text-brand-orange text-xs font-bold rounded-xl shadow-lg"
                  >
                     Pelajari Materi Ini
                  </button>
               </div>
            </div>
         </div>
      </main>
    </div>
  );
};
