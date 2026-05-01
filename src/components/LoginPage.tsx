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
import { Program, View, User } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { PROGRAMS, TRYOUTS } from '../constants';
import { isValidEmail, isValidIndonesianPhone } from '../utils/security';

interface LoginPageProps {
  setView: (v: View) => void;
  setUser: (u: User) => void;
  setSelectedTryoutId?: (id: string) => void;
  setSelectedProgramId?: (id: string) => void;
  setSelectedPackageId?: (id: string | null) => void;
  isGuestModeDefault?: boolean;
  isRegisteringDefault?: boolean;
  initialProgramId?: string | null;
  initialPackageId?: string | null;
  initialUser?: User | null;
  programs?: Program[];
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  setView, 
  setUser, 
  setSelectedTryoutId,
  setSelectedProgramId,
  setSelectedPackageId,
  isGuestModeDefault = false,
  isRegisteringDefault = false,
  initialProgramId = null,
  initialPackageId = null,
  initialUser = null,
  programs = PROGRAMS
}) => {
  const [email, setEmail] = useState(initialUser?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState(initialUser?.name || '');
  const [phone, setPhone] = useState(initialUser?.phone || '');
  const [school, setSchool] = useState(initialUser?.school || '');
  const [address, setAddress] = useState(initialUser?.address || '');
  const [targetPTN, setTargetPTN] = useState(initialUser?.targetPTN || '');
  const [joinReason, setJoinReason] = useState(initialUser?.joinReason || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(isRegisteringDefault);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGuestMode, setIsGuestMode] = useState(isGuestModeDefault);
  const [registerProgramId, setRegisterProgramId] = useState(initialProgramId || programs[0]?.id || '');
  const [registerPackageId, setRegisterPackageId] = useState(initialPackageId || programs.find((program) => program.id === (initialProgramId || programs[0]?.id))?.packages?.find((pkg) => pkg.isPopular)?.id || programs[0]?.packages?.[0]?.id || '');
  const [guestProgramId, setGuestProgramId] = useState(programs[0]?.id || '');
  const [guestTryoutId, setGuestTryoutId] = useState(TRYOUTS[0]?.id || '');
  const [isRegistrationVerificationOpen, setIsRegistrationVerificationOpen] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'phone'>('email');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const isPasswordValid = password.length >= 8 && /[A-Z]/.test(password) && /[^A-Za-z0-9]/.test(password);

  const selectedRegisterProgram = programs.find((program) => program.id === registerProgramId) || programs[0] || PROGRAMS[0];
  const selectedRegisterPackage = selectedRegisterProgram.packages?.find((pkg) => pkg.id === registerPackageId) || selectedRegisterProgram.packages?.find((pkg) => pkg.isPopular) || selectedRegisterProgram.packages?.[0] || null;
  const isSelectedPackageFree = selectedRegisterPackage?.price === 'Rp 0';
  const isScholarshipPackage = selectedRegisterPackage?.name.toLowerCase().includes('beasiswa') || selectedRegisterPackage?.id.toLowerCase().includes('scholar');

  React.useEffect(() => {
    const program = programs.find((item) => item.id === registerProgramId);
    if (!program?.packages?.length) return;
    if (!program.packages.some((pkg) => pkg.id === registerPackageId)) {
      setRegisterPackageId(program.packages.find((pkg) => pkg.isPopular)?.id || program.packages[0].id);
    }
  }, [programs, registerProgramId, registerPackageId]);

  const buildRegisteredUser = (): User => ({
    id: isSelectedPackageFree ? 'u_free' : 'u_premium',
    name: name || (isSelectedPackageFree ? 'Siswa Gratisan' : 'Budi Santoso'),
    email: email || 'siswa@example.com',
    avatar: `https://i.pravatar.cc/150?u=${registerPackageId || 'siswa'}`,
    isPremium: false,
    premiumUntil: undefined,
    role: email === 'admin@theprams.com' ? 'Admin' : 'Student',
    accountType: isScholarshipPackage ? 'Scholarship' : isSelectedPackageFree ? 'Free' : 'Paid',
    packageName: selectedRegisterPackage?.name || '-',
    paymentStatus: isScholarshipPackage ? 'Scholarship Review' : isSelectedPackageFree ? 'Free Active' : 'Pending Payment',
    address,
    targetPTN,
    joinReason,
    phone,
    school,
    program: programs.find((program) => program.id === registerProgramId)?.title || 'SNBT Kedokteran'
  });

  const completeVerifiedRegistration = () => {
    if (!verificationSent) {
      setError('Kirim kode verifikasi terlebih dahulu.');
      return;
    }
    if (verificationCode.trim() !== '123456') {
      setError('Kode verifikasi salah. Gunakan kode demo 123456.');
      return;
    }

    const mockUser = buildRegisteredUser();
    setUser(mockUser);
    setSelectedProgramId?.(registerProgramId);
    setSelectedPackageId?.(selectedRegisterPackage?.id || null);
    setError('');
    setView('payment');
  };

  const guestTryoutOptions = TRYOUTS.filter((tryout) => {
    const selectedProgram = programs.find((program) => program.id === guestProgramId);
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

      if (!isValidEmail(email)) {
        setError('Format email tidak valid.');
        setIsLoading(false);
        return;
      }

      if (isRegistering) {
        if (!name.trim()) {
          setError('Nama lengkap wajib diisi.');
          setIsLoading(false);
          return;
        }
        if (!isPasswordValid) {
          setError('Password minimal 8 karakter, mengandung 1 huruf besar, dan 1 simbol.');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Password dan ulangi password belum sama.');
          setIsLoading(false);
          return;
        }
        if (!isValidIndonesianPhone(phone)) {
          setError('Nomor WhatsApp harus diawali 08, 62, atau +62 dan berisi minimal 9 digit.');
          setIsLoading(false);
          return;
        }
        setVerificationMethod('email');
        setVerificationCode('');
        setVerificationSent(false);
        setIsRegistrationVerificationOpen(true);
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
        accountType: type === 'premium' ? 'Paid' : 'Free',
        packageName: type === 'guest' ? 'Tryout Gratis' : type === 'premium' ? 'Premium Demo' : 'Gratis',
        paymentStatus: type === 'premium' ? 'Payment Approved' : 'Free Active',
        address,
        targetPTN,
        joinReason,
        phone,
        school,
        program: programs.find((program) => program.id === (isRegistering ? registerProgramId : guestProgramId))?.title || 'SNBT Kedokteran'
      };
      
      setUser(mockUser);
      if (type === 'guest') {
        const selectedProgram = programs.find((program) => program.id === guestProgramId);
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
      } else if (isRegistering) {
        setSelectedProgramId?.(registerProgramId);
        setSelectedPackageId?.(selectedRegisterPackage?.id || null);
        setView('payment');
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
                              const nextProgram = programs.find((program) => program.id === nextProgramId);
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
                            {programs.map((program) => (
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
                   key={isRegistrationVerificationOpen ? "verify-register" : "register"}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="space-y-6"
                 >
                  {isRegistrationVerificationOpen ? (
                    <>
                      <div className="p-6 rounded-3xl bg-blue-50 border border-blue-100">
                        <p className="text-xs font-black uppercase tracking-widest text-brand-blue mb-2">Verifikasi Pendaftaran</p>
                        <h3 className="text-2xl font-black text-brand-navy mb-2">Pilih metode verifikasi</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Verifikasi email atau nomor HP terlebih dahulu. Setelah terverifikasi, kamu akan diarahkan ke pembayaran.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setVerificationMethod('email');
                            setVerificationSent(false);
                            setVerificationCode('');
                            setError('');
                          }}
                          className={`p-4 rounded-2xl border-2 text-left transition-all ${verificationMethod === 'email' ? 'border-brand-blue bg-blue-50 text-brand-blue' : 'border-slate-100 bg-white text-slate-500'}`}
                        >
                          <Mail size={20} className="mb-3" />
                          <span className="text-sm font-black">Email</span>
                          <p className="text-xs mt-1">{email}</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setVerificationMethod('phone');
                            setVerificationSent(false);
                            setVerificationCode('');
                            setError('');
                          }}
                          className={`p-4 rounded-2xl border-2 text-left transition-all ${verificationMethod === 'phone' ? 'border-brand-blue bg-blue-50 text-brand-blue' : 'border-slate-100 bg-white text-slate-500'}`}
                        >
                          <Target size={20} className="mb-3" />
                          <span className="text-sm font-black">No. HP</span>
                          <p className="text-xs mt-1">{phone}</p>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setVerificationSent(true);
                          setError('');
                        }}
                        className="w-full btn-secondary py-4"
                      >
                        {verificationMethod === 'email' ? 'Kirim Link Verifikasi Email' : 'Kirim Kode OTP WhatsApp'}
                      </button>

                      {verificationSent && (
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 leading-relaxed">
                          {verificationMethod === 'email'
                            ? `Link verifikasi demo dikirim ke ${email}. Masukkan kode demo 123456 untuk melanjutkan.`
                            : `Kode OTP demo dikirim ke ${phone}. Masukkan kode demo 123456 untuk melanjutkan.`}
                        </div>
                      )}

                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                          {verificationMethod === 'email' ? 'Kode dari Link Email' : 'Kode OTP'}
                        </label>
                        <input
                          value={verificationCode}
                          onChange={(event) => {
                            setVerificationCode(event.target.value);
                            setError('');
                          }}
                          className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold text-slate-600 tracking-[0.3em]"
                          placeholder="123456"
                          inputMode="numeric"
                        />
                      </div>

                      {error && (
                        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-xs font-bold text-red-600">
                          {error}
                        </div>
                      )}

                      <button type="button" onClick={completeVerifiedRegistration} className="w-full btn-primary py-5 text-sm uppercase tracking-widest font-black">
                        Verifikasi & Lanjut Pembayaran <ArrowRight size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsRegistrationVerificationOpen(false);
                          setVerificationSent(false);
                          setVerificationCode('');
                          setError('');
                        }}
                        className="w-full text-center text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-brand-blue transition-colors"
                      >
                        Kembali ke Form Pendaftaran
                      </button>
                    </>
                  ) : (
                    <>
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
                       <div className="md:col-span-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Ulangi Password</label>
                          <input 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium text-slate-600" 
                            placeholder="Ketik ulang password" 
                          />
                          {password && !isPasswordValid && <p className="text-xs text-red-500 font-bold mt-2">Password minimal 8 karakter, mengandung 1 huruf besar, dan 1 simbol.</p>}
                          {confirmPassword && password !== confirmPassword && <p className="text-xs text-red-500 font-bold mt-2">Password dan ulangi password belum sama.</p>}
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Program Pilihan</label>
                          <select
                            value={registerProgramId}
                            onChange={(e) => setRegisterProgramId(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold text-slate-600"
                          >
                             {programs.map((program) => (
                               <option key={program.id} value={program.id}>{program.title}</option>
                             ))}
                          </select>
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Paket Belajar</label>
                          <select 
                            value={registerPackageId}
                            onChange={(e) => setRegisterPackageId(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold text-slate-600"
                          >
                             {selectedRegisterProgram.packages?.map((pkg) => (
                               <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                             ))}
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

                    {selectedRegisterPackage && (
                      <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white rounded-xl text-brand-blue">
                            <ShieldCheck size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-brand-navy mb-2">{selectedRegisterPackage.name}</p>
                            <p className="text-xs font-bold text-brand-blue mb-3">{selectedRegisterPackage.price} - {selectedRegisterPackage.duration}</p>
                            <ul className="space-y-1 text-xs font-medium text-slate-500 leading-relaxed">
                              {selectedRegisterPackage.features.slice(0, 5).map((feature) => (
                                <li key={feature}>{feature}</li>
                              ))}
                            </ul>
                            {isScholarshipPackage && (
                              <p className="mt-3 text-xs font-bold text-amber-700">
                                Jalur beasiswa tetap melalui verifikasi email/No. HP, lalu masuk halaman pembayaran Rp 0 untuk pencatatan dan review admin.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-xs font-bold text-red-600">
                        {error}
                      </div>
                    )}

                    <button className="w-full btn-primary py-5 text-sm uppercase tracking-widest font-black" onClick={(e) => handleAuth(e, isSelectedPackageFree ? 'free' : 'premium')}>
                       Lanjut ke Verifikasi <ArrowRight size={18} />
                    </button>
                    <p className="text-center text-sm text-slate-500 font-medium">
                       Sudah punya akun? <button onClick={() => setIsRegistering(false)} className="text-brand-blue font-bold hover:underline">Login di sini</button>
                    </p>
                    </>
                  )}
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
