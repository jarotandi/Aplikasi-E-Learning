import React from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  MapPin, 
  Target, 
  MessageCircle, 
  School, 
  Phone, 
  Mail, 
  ArrowLeft,
  Calendar,
  ShieldCheck,
  Edit,
  Camera
} from 'lucide-react';
import { View, User as UserType } from '../types';

interface ProfilePageProps {
  setView: (v: View) => void;
  user: UserType | null;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ setView, user }) => {
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header / Cover */}
      <div className="h-48 bg-gradient-to-r from-brand-navy to-brand-blue relative">
        <button 
          onClick={() => setView('dashboard')}
          className="absolute top-6 left-6 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all flex items-center gap-2 text-sm font-medium px-4"
        >
          <ArrowLeft size={18} /> Kembali ke Dashboard
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Avatar & Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center border border-slate-100"
            >
              <div className="relative group mb-6">
                <img 
                  src={user.avatar} 
                  className="w-32 h-32 rounded-[2rem] object-cover ring-8 ring-slate-50 shadow-inner" 
                  alt={user.name} 
                />
                <button className="absolute bottom-0 right-0 p-2.5 bg-brand-blue text-white rounded-xl shadow-lg border-2 border-white hover:scale-110 transition-transform">
                  <Camera size={16} />
                </button>
              </div>

              <h2 className="text-2xl font-black text-brand-navy mb-1 tracking-tight">{user.name}</h2>
              <p className="text-brand-blue font-bold text-sm tracking-wider uppercase mb-6">{user.role}</p>

              <div className="w-full pt-6 border-t border-slate-50 space-y-4">
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                    <Mail size={16} />
                  </div>
                  <p className="text-xs font-medium truncate">{user.email}</p>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                      <Phone size={16} />
                    </div>
                    <p className="text-xs font-medium">{user.phone}</p>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-brand-navy p-8 rounded-[2.5rem] text-white overflow-hidden relative"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
               <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck className="text-brand-blue" size={24} />
                  <h3 className="font-bold tracking-tight">Status Akun</h3>
               </div>
               
               <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Membership</p>
                    <p className="text-sm font-bold">{user.isPremium ? 'Premium (Active)' : 'Free User'}</p>
                  </div>
                  {user.isPremium && (
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Berlaku Hingga</p>
                      <p className="text-sm font-bold flex items-center gap-2">
                        <Calendar size={14} className="text-brand-blue" /> 31 Desember 2025
                      </p>
                    </div>
                  )}
                  {!user.isPremium && (
                    <button 
                      onClick={() => setView('programs')}
                      className="w-full bg-brand-orange py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-colors mt-4"
                    >
                      Beli Paket Premium
                    </button>
                  )}
               </div>
            </motion.div>
          </div>

          {/* Right Column: Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-brand-navy tracking-tight">Informasi Akademik & Pribadi</h3>
                <button className="p-3 bg-slate-50 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-xl transition-all">
                  <Edit size={20} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                {/* School */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-brand-orange">
                      <School size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Asal Sekolah</p>
                      <p className="font-bold text-brand-navy">{user.school || 'Belum diisi'}</p>
                    </div>
                  </div>
                </div>

                {/* Target PTN */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-brand-blue">
                      <Target size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Target PTN / Cita-cita</p>
                      <p className="font-bold text-brand-navy">{user.targetPTN || 'Belum diisi'}</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mt-1">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Alamat Lengkap</p>
                      <p className="font-bold text-brand-navy leading-relaxed">{user.address || 'Belum diisi'}</p>
                    </div>
                  </div>
                </div>

                {/* Join Reason */}
                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mt-1">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Alasan Bergabung</p>
                      <p className="font-bold text-brand-navy leading-relaxed italic">"{user.joinReason || 'Belum diisi'}"</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Achievement / Stats section for completeness */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="grid grid-cols-2 lg:grid-cols-3 gap-6"
            >
               <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/50">
                  <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Tryout Selesai</p>
                  <p className="text-3xl font-black text-brand-navy">12</p>
               </div>
               <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/50">
                  <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Rata-rata Skor</p>
                  <p className="text-3xl font-black text-brand-blue">685</p>
               </div>
               <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/50 col-span-2 lg:col-span-1">
                  <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Quiz Bonus</p>
                  <p className="text-3xl font-black text-brand-orange">45</p>
               </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
