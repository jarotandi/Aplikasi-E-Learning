import React from 'react';
import { motion } from 'motion/react';
import { TUTORS, PROGRAMS } from '../constants';
import { View } from '../types';
import { 
  ArrowLeft, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Youtube, 
  Mail,
  Linkedin,
  MessageCircle,
  PlayCircle,
  Trophy,
  ArrowRight
} from 'lucide-react';

interface MentorProfilePageProps {
  mentorId: string | null;
  setView: (v: View) => void;
  setSelectedProgramId: (id: string) => void;
}

export const MentorProfilePage: React.FC<MentorProfilePageProps> = ({ mentorId, setView, setSelectedProgramId }) => {
  const mentor = TUTORS.find(t => t.id === mentorId);

  if (!mentor) {
    return (
      <div className="pt-32 text-center pb-40">
        <h1 className="text-2xl font-bold">Mentor tidak ditemukan</h1>
        <button onClick={() => setView('landing')} className="btn-primary mt-4 mx-auto">Kembali ke Beranda</button>
      </div>
    );
  }

  const taughtPrograms = PROGRAMS.filter(p => p.tutors?.includes(mentor.id));

  return (
    <div className="pt-24 pb-24 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-blue mb-8 transition-colors text-sm font-bold"
        >
          <ArrowLeft size={16} /> Kembali
        </button>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Sidebar: Profile Card */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-premium p-8 bg-white sticky top-32"
            >
              <div className="relative mb-8">
                <img src={mentor.image} className="w-full aspect-square rounded-3xl object-cover shadow-2xl" alt={mentor.name} />
                <div className="absolute -bottom-4 right-4 bg-brand-blue text-white p-3 rounded-2xl shadow-xl">
                  <Award size={24} />
                </div>
              </div>
              
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-brand-navy mb-1">{mentor.name}</h1>
                <p className="text-brand-blue font-bold text-sm uppercase tracking-widest">{mentor.role}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-50 text-brand-blue rounded-lg">
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Pendidikan</p>
                    <p className="text-sm font-bold text-slate-700">{mentor.education}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <Award size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Pengalaman</p>
                    <p className="text-sm font-bold text-slate-700">{mentor.experience}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="btn-secondary py-3 flex items-center justify-center gap-2">
                  <Mail size={16} /> Email
                </button>
                <button className="btn-secondary py-3 flex items-center justify-center gap-2">
                  <Linkedin size={16} /> LinkedIn
                </button>
                <button className="btn-primary col-span-2 py-4 flex items-center justify-center gap-2">
                  <MessageCircle size={18} /> Tanya Mentor di WA
                </button>
              </div>
            </motion.div>
          </div>

          {/* Main Content: Bio, Subjects, Programs */}
          <div className="lg:col-span-2 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-premium p-10 bg-white"
            >
              <h2 className="text-2xl font-bold text-brand-navy mb-6 flex items-center gap-3">
                <BookOpen className="text-brand-orange" /> Tentang Mentor
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg mb-10 italic">
                "{mentor.bio}"
              </p>
              
              <div className="mb-10">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Materi yang Diampu</h4>
                <div className="flex flex-wrap gap-3">
                  {mentor.subjects.map((s, i) => (
                    <span key={i} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold border border-slate-100 italic transition-all hover:bg-white hover:shadow-lg hover:shadow-blue-500/10">
                      #{s}
                    </span>
                  ))}
                </div>
              </div>

              {mentor.videoUrl && (
                <div>
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Video Perkenalan</h4>
                  <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group cursor-pointer bg-slate-900 flex items-center justify-center">
                    {/* Simplified Iframe simulation */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                       <PlayCircle size={64} className="text-white opacity-80 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100" />
                    </div>
                    <img src={mentor.image} className="w-full h-full object-cover opacity-60" alt="Intro Video Thumbnail" />
                  </div>
                  <p className="mt-4 text-xs text-slate-400 text-center font-medium">Klik untuk menonton cuplikan metode mengajar {mentor.name}</p>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-brand-navy flex items-center gap-3">
                  <Trophy className="text-brand-blue" /> Program yang Dibimbing
                </h2>
                <button 
                  onClick={() => setView('programs')}
                  className="text-sm font-bold text-brand-blue hover:underline flex items-center gap-1"
                >
                  Lihat Semua <ArrowRight size={14} />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {taughtPrograms.map(program => (
                  <div 
                    key={program.id}
                    className="card-premium overflow-hidden bg-white group cursor-pointer border border-transparent hover:border-brand-blue/20 transition-all"
                    onClick={() => {
                      setSelectedProgramId(program.id);
                      setView('programDetail');
                    }}
                  >
                    <div className="h-40 relative">
                      <img src={program.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={program.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                      <div className="absolute bottom-5 left-5 right-5">
                        <span className="px-2 py-0.5 bg-brand-orange text-white rounded text-[8px] font-black uppercase tracking-[0.2em]">{program.category}</span>
                        <h4 className="text-white font-bold text-lg mt-2 group-hover:text-brand-orange transition-colors">{program.title}</h4>
                      </div>
                    </div>
                    <div className="p-5 flex items-center justify-between bg-white">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Akses Program</span>
                        <span className="text-sm font-bold text-brand-blue">Daftar Bimbingan</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-blue group-hover:text-white transition-all shadow-sm">
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
