import React, { useState } from 'react';
import { 
  Rocket, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Users,
  PlayCircle,
  MapPin,
  Calendar,
  Star,
  ChevronLeft,
  ChevronRight,
  Target,
  BookOpen,
  Trophy
} from 'lucide-react';
import { View, User } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { PROGRAMS, TRYOUTS } from '../constants';

interface LoginPageProps {
  setView: (v: View) => void;
  setUser: (u: User) => void;
  setSelectedTryoutId?: (id: string) => void;
  isGuestModeDefault?: boolean;
  isRegisteringDefault?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  setView, 
  setUser, 
  setSelectedTryoutId,
  isGuestModeDefault = false,
  isRegisteringDefault = false 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [school, setSchool] = useState('');
  const [address, setAddress] = useState('');
  const [targetPTN, setTargetPTN] = useState('');
  const [joinReason, setJoinReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(isRegisteringDefault);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGuestMode, setIsGuestMode] = useState(isGuestModeDefault);
  const [registrationType, setRegistrationType] = useState<'premium' | 'free' | 'scholarship'>('premium');
  const [guestProgramId, setGuestProgramId] = useState(PROGRAMS[0]?.id || '');
  const [guestTryoutId, setGuestTryoutId] = useState(TRYOUTS[0]?.id || '');

  const guestTryoutOptions = TRYOUTS.filter((tryout) => {
    const selectedProgram = PROGRAMS.find((program) => program.id === guestProgramId);
    if (!selectedProgram) return true;
    const programText = `${selectedProgram.title} ${selectedProgram.category}`.toLowerCase();
    const tryoutText = `${tryout.title} ${tryout.category}`.toLowerCase();
    if (programText.includes('cpns') || programText.includes('kedinasan')) return tryoutText.includes('cpns');
    return tryoutText.includes('snbt');
  });

  const slides = [
    {
      title: "Solusi Cerdas Tembus Kampus Impian",
      desc: "Metode belajar terstruktur yang telah meloloskan ribuan siswa ke PTN favorit dan Sekolah Kedinasan.",
      icon: Rocket,
      color: "from-blue-600 to-indigo-700"
    },
    {
      title: "Mentor Ahli & Berpengalaman",
      desc: "Belajar langsung dari alumni UI, UGM, ITB yang sudah terbukti memahami pola soal ujian masuk.",
      icon: Users,
      color: "from-emerald-500 to-teal-700"
    },
    {
      title: "Kurikulum Berbasis Data",
      desc: "Bank soal yang selalu diperbarui mengikuti tren terbaru seleksi nasional maupun kedinasan.",
      icon: BookOpen,
      color: "from-amber-500 to-orange-700"
    },
    {
      title: "Tryout Simulasi Realistis",
      desc: "Sistem penilaian IRT (Item Response Theory) yang akurat dan simulasi CAT yang menyerupai asli.",
      icon: Target,
      color: "from-purple-600 to-pink-700"
    },
    {
      title: "Analitik Progres Mendalam",
      desc: "Dashboard khusus untuk memantau perkembangan nilai dan memetakan peluang kelulusanmu.",
      icon: Trophy,
      color: "from-cyan-500 to-blue-700"
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Auto-slide effect
  React.useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleAuth = (e: React.FormEvent, type: 'premium' | 'free' | 'guest') => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (type !== 'guest') {
      if (!email.trim() || !password.trim()) {
        setError('Email dan password tidak boleh kosong.');
        setIsLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Format email tidak valid.');
        setIsLoading(false);
        return;
      }
    } else {
      // Guest validation is typically handled by 'required' attribute on inputs, 
      // but let's be consistent.
    }
    
    // Simulate API Call
    setTimeout(() => {
      const mockUser: User = {
        id: type === 'guest' ? 'u_guest' : (type === 'premium' ? 'u_premium' : 'u_free'),
        name: name || (type === 'guest' ? 'Calon Mahasiswa (Guest)' : (type === 'premium' ? 'Budi Santoso' : 'Siswa Gratisan')),
        email: email || (type === 'guest' ? 'guest@theprams.com' : 'siswa@example.com'),
        avatar: `https://i.pravatar.cc/150?u=${type}`,
        isPremium: type === 'premium',
        premiumUntil: type === 'premium' ? '2026-12-31' : undefined,
        role: email === 'admin@theprams.com' ? 'Admin' : 'Student',
        address,
        targetPTN,
        joinReason,
        phone,
        school,
        program: PROGRAMS.find((program) => program.id === guestProgramId)?.title || 'SNBT Kedokteran'
      };
      
      setUser(mockUser);
      if (type === 'guest') {
        const selectedProgram = PROGRAMS.find((program) => program.id === guestProgramId);
        const selectedTryout = TRYOUTS.find((tryout) => tryout.id === guestTryoutId);
        const previous = JSON.parse(localStorage.getItem('theprams_demo_leads') || '[]');
        localStorage.setItem('theprams_demo_leads', JSON.stringify([
          {
            id: `tryout-${Date.now()}`,
            name: mockUser.name,
            email: mockUser.email,
            phone: mockUser.phone || '-',
            programOfInterest: `${selectedProgram?.title || 'Tryout Gratis'} - ${selectedTryout?.title || 'Tryout'}`,
            source: `Form Tryout Gratis - Target: ${mockUser.targetPTN || '-'}`,
            status: 'New',
            createdAt: new Date().toISOString().slice(0, 10)
          },
          ...previous
        ]));
        setSelectedTryoutId?.(guestTryoutId);
        setView('exam');
      } else {
        setView(mockUser.role === 'Admin' ? 'admin' : 'dashboard');
      }
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      {/* Left Column: Presentation Slider */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].color} p-16 flex flex-col justify-between`}
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {React.createElement(slides[currentSlide].icon, { size: 400, className: "text-white opacity-20" })}
              </div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-16 cursor-pointer" onClick={() => setView('landing')}>
                <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                  <Rocket className="text-white" size={24} />
                </div>
                <span className="text-2xl font-black text-white tracking-tighter uppercase">THE PRAMS</span>
              </div>

              <div className="max-w-md">
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl font-black text-white leading-tight mb-6"
                >
                  {slides[currentSlide].title}
                </motion.h1>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/80 text-xl leading-relaxed"
                >
                  {slides[currentSlide].desc}
                </motion.p>
              </div>
            </div>

            <div className="relative z-10">
               <div className="flex items-center gap-8 mb-12">
                  <div className="flex items-center gap-3">
                     <div className="flex -space-x-4">
                        {[1,2,3,4].map(i => (
                          <img key={i} src={`https://i.pravatar.cc/100?u=user${i + currentSlide}`} className="w-10 h-10 rounded-full border-2 border-white/20" alt="user" />
                        ))}
                     </div>
                     <p className="text-white/80 text-xs font-bold uppercase tracking-widest">+10k Students Jointed</p>
                  </div>
               </div>

               <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {slides.map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setCurrentSlide(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'}`} 
                      />
                    ))}
                  </div>
                  <div className="flex gap-3">
                     <button onClick={prevSlide} className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all">
                        <ChevronLeft size={20} />
                     </button>
                     <button onClick={nextSlide} className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all">
                        <ChevronRight size={20} />
                     </button>
                  </div>
               </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right Column: Auth Forms */}
      <div className="flex-1 flex flex-col p-8 lg:p-24 bg-white">
        <div className="lg:hidden flex items-center gap-3 mb-16">
           <div className="p-2 bg-brand-orange rounded-xl">
             <Rocket className="text-white" size={24} />
           </div>
           <span className="text-2xl font-black text-brand-navy tracking-tighter uppercase">THE PRAMS</span>
        </div>

        <div className="max-w-md w-full mx-auto my-auto">
           <div className="mb-12">
              <h2 className="text-4xl font-extrabold text-brand-navy tracking-tight mb-3">
                 {isGuestMode ? 'Tryout Gratis' : (isRegistering ? 'Wujudkan Impianmu.' : 'Senang Melihatmu Kembali!')}
              </h2>
              <p className="text-slate-500 font-medium">
                 {isGuestMode ? 'Lengkapi data diri untuk akses simulasi tryout.' : (isRegistering ? 'Daftar sekarang untuk memulai perjalananmu.' : 'Akses materi eksklusif dan evaluasi belajarmu.')}
              </p>
           </div>

           <AnimatePresence mode="wait">
              {isGuestMode ? (
                 <motion.form 
                   key="guest"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   onSubmit={(e) => handleAuth(e, 'guest')}
                   className="space-y-6"
                 >
                    <div className="space-y-4">
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Program Tujuan</label>
                          <select 
                            value={guestProgramId}
                            onChange={(e) => {
                              const nextProgramId = e.target.value;
                              setGuestProgramId(nextProgramId);
                              const nextProgram = PROGRAMS.find((program) => program.id === nextProgramId);
                              const nextTryout = TRYOUTS.find((tryout) => {
                                const programText = `${nextProgram?.title ?? ''} ${nextProgram?.category ?? ''}`.toLowerCase();
                                const tryoutText = `${tryout.title} ${tryout.category}`.toLowerCase();
                                return programText.includes('cpns') || programText.includes('kedinasan') ? tryoutText.includes('cpns') : tryoutText.includes('snbt');
                              });
                              if (nextTryout) setGuestTryoutId(nextTryout.id);
                            }}
                            className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold text-slate-600"
                            required
                          >
                            {PROGRAMS.map((program) => (
                              <option key={program.id} value={program.id}>{program.title}</option>
                            ))}
                          </select>
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Pilih Tryout Gratis</label>
                          <select 
                            value={guestTryoutId}
                            onChange={(e) => setGuestTryoutId(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold text-slate-600"
                            required
                          >
                            {guestTryoutOptions.map((tryout) => (
                              <option key={tryout.id} value={tryout.id}>Gratis - {tryout.title}</option>
                            ))}
                          </select>
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nama Lengkap</label>
                          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium text-slate-600" placeholder="Budi Santoso" required />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nomor WhatsApp</label>
                          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium text-slate-600" placeholder="08xxxxxxxxx" required />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Email</label>
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium text-slate-600" placeholder="example@theprams.com" required />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Cita-cita / Target</label>
                          <input type="text" value={targetPTN} onChange={(e) => setTargetPTN(e.target.value)} className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium text-slate-600" placeholder="Contoh: FK UI, STAN, CPNS Kemenkeu" required />
                       </div>
                    </div>
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full btn-primary py-5 text-sm uppercase tracking-widest font-black flex items-center justify-center gap-3 shadow-xl shadow-brand-blue/20"
                    >
                       {isLoading ? 'Sedang Memproses...' : 'Mulai Tryout Gratis'}
                       {!isLoading && <ArrowRight size={18} />}
                    </button>
                    <button type="button" onClick={() => setIsGuestMode(false)} className="w-full text-center text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-brand-blue transition-colors">
                       Kembali ke Login
                    </button>
                 </motion.form>
              ) : isRegistering ? (
                 <motion.div 
                   key="register"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="space-y-6"
                 >
                    <div className="grid md:grid-cols-2 gap-4">
                       <div className="md:col-span-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nama Lengkap</label>
                          <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium text-slate-600" 
                            placeholder="Budi Santoso" 
                          />
                       </div>
                       <div className="md:col-span-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Email Address</label>
                          <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium text-slate-600" 
                            placeholder="budi@example.com" 
                          />
                       </div>
                       <div className="md:col-span-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Password</label>
                          <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium text-slate-600" 
                            placeholder="••••••••" 
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Program Pilihan</label>
                          <select className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold text-slate-600">
                             <option>SNBT Kedokteran 2025</option>
                             <option>CPNS/Kedinasan Intensif</option>
                             <option>Reguler SNBT 2025</option>
                          </select>
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tipe Pendaftaran</label>
                          <select 
                            value={registrationType}
                            onChange={(e) => setRegistrationType(e.target.value as 'premium' | 'free' | 'scholarship')}
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold text-slate-600"
                          >
                             <option value="premium">Premium (Full Access)</option>
                             <option value="free">Akun Gratis (Fitur Terbatas)</option>
                             <option value="scholarship">Beasiswa (Khusus)</option>
                          </select>
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nomor WhatsApp</label>
                          <input 
                            type="tel" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium text-slate-600" 
                            placeholder="08xxxxxxxxx" 
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Asal Sekolah</label>
                          <input 
                            type="text" 
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium text-slate-600" 
                            placeholder="SMA Negeri 1 ..." 
                          />
                       </div>
                       <div className="md:col-span-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Alamat Tinggal Lengkap</label>
                          <textarea 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium text-slate-600 h-20 resize-none" 
                            placeholder="Jl. Raya Utama No. 123, Kota..."
                          ></textarea>
                       </div>
                       <div className="md:col-span-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Cita-Cita / Target PTN</label>
                          <input 
                            type="text" 
                            value={targetPTN}
                            onChange={(e) => setTargetPTN(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium text-slate-600" 
                            placeholder="FK UI / STAN" 
                          />
                       </div>
                       <div className="md:col-span-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Alasan Bergabung</label>
                          <input 
                            type="text" 
                            value={joinReason}
                            onChange={(e) => setJoinReason(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium text-slate-600" 
                            placeholder="Ingin fokus belajar..." 
                          />
                       </div>
                    </div>

                    {registrationType === 'free' && (
                      <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white rounded-xl text-brand-blue">
                            <ShieldCheck size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-brand-navy mb-2">Akun Gratis</p>
                            <ul className="space-y-1 text-xs font-medium text-slate-500 leading-relaxed">
                              <li>Akses dashboard dasar dan profil belajar.</li>
                              <li>Bisa mengikuti tryout gratis yang tersedia.</li>
                              <li>Materi premium, kelas intensif, analitik lengkap, dan bimbingan mentor tetap terkunci sampai upgrade paket.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    <button className="w-full btn-primary py-5 text-sm uppercase tracking-widest font-black" onClick={(e) => handleAuth(e, registrationType === 'free' ? 'free' : 'premium')}>
                       {registrationType === 'free' ? 'Buat Akun Gratis' : 'Konfirmasi Pendaftaran'} <ArrowRight size={18} />
                    </button>
                    <p className="text-center text-sm text-slate-500 font-medium">
                       Sudah punya akun? <button onClick={() => setIsRegistering(false)} className="text-brand-blue font-bold hover:underline">Login di sini</button>
                    </p>
                 </motion.div>
              ) : (
                 <motion.div 
                   key="login"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="space-y-6"
                 >
                    <div className="space-y-4">
                       <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-blue transition-colors" size={20} />
                          <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all outline-none font-medium text-slate-600" 
                            placeholder="Email Address" 
                          />
                       </div>
                       <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-blue transition-colors" size={20} />
                          <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all outline-none font-medium text-slate-600" 
                            placeholder="Password" 
                          />
                       </div>
                    </div>

                    <div className="flex flex-col gap-4">
                       <button 
                         onClick={(e) => handleAuth(e, 'premium')}
                         disabled={isLoading}
                         className="w-full btn-primary py-5 text-sm uppercase tracking-widest font-black flex items-center justify-center gap-3 shadow-xl shadow-brand-blue/20"
                       >
                          {isLoading ? 'Sedang Memverifikasi...' : 'Akses Dashboard Siswa'}
                          {!isLoading && <ArrowRight size={18} />}
                       </button>

                       <button 
                         type="button"
                         onClick={() => setIsGuestMode(true)}
                         className="w-full py-4 rounded-xl border-2 border-slate-100 text-xs font-black text-slate-500 uppercase tracking-widest hover:border-brand-orange hover:text-brand-orange transition-all flex items-center justify-center gap-2"
                       >
                          <PlayCircle size={18} />
                          Coba Tryout Gratis Sekarang
                       </button>
                    </div>

                    <div className="pt-8 border-t border-slate-100">
                       <p className="text-center text-sm text-slate-500 font-medium">
                          Belum punya akun? <button onClick={() => setIsRegistering(true)} className="text-brand-blue font-bold hover:underline">Daftar Sekarang</button>
                       </p>
                    </div>
                 </motion.div>
              )}
           </AnimatePresence>
        </div>

        <button 
          onClick={() => setView('landing')}
          className="mt-20 text-slate-400 hover:text-brand-blue transition-colors font-bold text-xs flex items-center gap-2 justify-center"
        >
           <ArrowLeft size={16} /> Kembali ke Beranda
        </button>
      </div>
    </div>
  );
};
