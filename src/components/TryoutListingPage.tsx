import React from 'react';
import { 
  Rocket, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  Lock, 
  BarChart3, 
  Filter,
  Play
} from 'lucide-react';
import { TRYOUTS } from '../constants';
import { View, User } from '../types';

export const TryoutListingPage: React.FC<{ setView: (v: View) => void; user: User | null }> = ({ setView, user }) => {
  return (
    <div className="pt-28 min-h-screen bg-slate-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-brand-navy mb-4">Pusat Tryout Digital</h1>
            <p className="text-slate-500 max-w-xl">
              Uji kemampuanmu dengan simulasi ujian berbasis IRT dan CAT yang paling mendekati aslinya. 
              Dapatkan analisis mendalam setelah pengerjaan.
            </p>
          </div>
          <div className="flex gap-3">
             <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl">
                <Filter size={18} className="text-slate-400" />
                <select className="text-sm bg-transparent border-none focus:ring-0 font-medium text-slate-600">
                   <option>Semua Kategori</option>
                   <option>SNBT</option>
                   <option>CPNS/SKD</option>
                </select>
             </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TRYOUTS.map((to) => (
             <div key={to.id} className="card-premium overflow-hidden flex flex-col h-full bg-white group">
                <div className={`h-2 text-center ${to.isPremium ? 'bg-brand-orange' : 'bg-brand-blue'}`} />
                <div className="p-8 flex-1 flex flex-col">
                   <div className="flex justify-between items-start mb-6">
                      <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${to.isPremium ? 'bg-amber-50 text-brand-orange' : 'bg-blue-50 text-brand-blue'}`}>
                         {to.category}
                      </div>
                      {to.isPremium && (
                        <div className="p-1.5 bg-amber-100 text-brand-orange rounded-lg">
                           <Lock size={16} />
                        </div>
                      )}
                   </div>
                   <h3 className="text-xl font-bold text-brand-navy mb-4 group-hover:text-brand-blue transition-colors">
                      {to.title}
                   </h3>
                   <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                         <Clock size={16} className="text-slate-400" />
                         <span>{to.duration} Menit</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                         <BarChart3 size={16} className="text-slate-400" />
                         <span>{to.questions} Soal</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                         <span className="w-2 h-2 rounded-full bg-emerald-500" />
                         <span>{to.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                         <CheckCircle2 size={16} className="text-slate-400" />
                         <span>IRT Scoring</span>
                      </div>
                   </div>

                   <div className="mt-auto pt-6 border-t border-slate-100">
                      {to.status === 'completed' ? (
                        <div className="flex items-center justify-between">
                           <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Skor Akhir</span>
                              <span className="text-lg font-bold text-brand-navy">720.5</span>
                           </div>
                           <button 
                             onClick={() => setView('result')}
                             className="text-brand-blue font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                           >
                              Review Hasil <ChevronRight size={16} />
                           </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                           {!to.isPremium ? (
                              <button 
                                 onClick={() => setView('exam')}
                                 className="w-full btn-orange py-4 flex items-center justify-center gap-2 group/btn"
                              >
                                 Try for Free
                                 <Play size={16} className="fill-white group-hover/btn:translate-x-1 transition-transform" />
                              </button>
                           ) : (
                              <button 
                                 onClick={() => {
                                    if (user?.isPremium) {
                                       setView('exam');
                                    } else {
                                       setView('payment');
                                    }
                                 }}
                                 disabled={!user}
                                 className={`w-full py-4 rounded-xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${user?.isPremium ? 'bg-brand-blue text-white shadow-xl shadow-blue-500/20' : 'bg-slate-100 text-slate-400 cursor-not-allowed group'}`}
                              >
                                 {user?.isPremium ? (
                                    <>
                                       Start Tryout
                                       <Play size={16} className="fill-white" />
                                    </>
                                 ) : (
                                    <>
                                       <Lock size={16} />
                                       {user ? 'Premium Only' : 'Login to Access'}
                                    </>
                                 )}
                              </button>
                           )}
                           
                           {to.isPremium && !user?.isPremium && (
                              <p className="text-[10px] text-center text-slate-400 italic">
                                 Buka akses dengan berlangganan paket Premium
                              </p>
                           )}
                        </div>
                      )}
                   </div>
                </div>
             </div>
          ))}
          
          {/* Empty State / Coming Soon */}
          <div className="card-premium border-dashed border-2 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mb-4 shadow-sm">
                <Rocket size={32} />
             </div>
             <h4 className="font-bold text-slate-400">Tryout Selanjutnya</h4>
             <p className="text-xs text-slate-400 max-w-[150px] mt-2">Dapatkan info simulasi terbaru via WhatsApp.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
