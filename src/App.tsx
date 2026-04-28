/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormEvent, useState, useEffect } from 'react';
import { TryoutSubtestResult, View, User } from './types';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentDashboard';
import { LearningPage } from './components/LearningPage';
import { TryoutExamPage } from './components/TryoutExamPage';
import { TryoutResultPage } from './components/TryoutResultPage';
import { TryoutListingPage } from './components/TryoutListingPage';
import { ContactPage } from './components/ContactPage';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginPage } from './components/LoginPage';
import { ProgramListingPage } from './components/ProgramListingPage';
import { ProgramDetailPage } from './components/ProgramDetailPage';
import { PaymentPage } from './components/PaymentPage';
import { FinalRegistrationPage } from './components/FinalRegistrationPage';
import { TestimonialsPage } from './components/TestimonialsPage';
import { MentorProfilePage } from './components/MentorProfilePage';
import { ProfilePage } from './components/ProfilePage';
import { BlogListingPage } from './components/BlogListingPage';
import { BlogPostPage } from './components/BlogPostPage';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronLeft, ExternalLink, Mail, MessageCircle, Video, X } from 'lucide-react';
import { LIVE_SESSIONS, PROGRAMS } from './constants';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [tryoutResults, setTryoutResults] = useState<TryoutSubtestResult[] | null>(null);
  const [selectedTryoutId, setSelectedTryoutId] = useState<string | null>(null);
  const [upgradeReturnView, setUpgradeReturnView] = useState<View | null>(null);
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [consultName, setConsultName] = useState('');
  const [consultMessage, setConsultMessage] = useState('');
  const [consultContext, setConsultContext] = useState('');
  const [consultPos, setConsultPos] = useState({ x: 24, y: 110 });
  const [didDragConsult, setDidDragConsult] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setView('landing');
  };

  const resolveProgramIdForUser = () => {
    const userProgram = `${user?.program ?? ''} ${user?.targetPTN ?? ''} ${user?.joinReason ?? ''}`.toLowerCase();
    if (userProgram.includes('cpns') || userProgram.includes('skd') || userProgram.includes('kedinasan')) {
      return 'skd-cpns';
    }
    return 'snbt-kedokteran';
  };

  const resolvePremiumPackageId = (programId: string) => {
    const program = PROGRAMS.find((item) => item.id === programId);
    return program?.packages?.find((pkg) => pkg.isPopular)?.id || program?.packages?.find((pkg) => pkg.name.toLowerCase().includes('premium'))?.id || program?.packages?.[0]?.id || null;
  };

  const saveLead = (lead: { name: string; phone: string; email?: string; programOfInterest: string; source: string }) => {
    const previous = JSON.parse(localStorage.getItem('theprams_demo_leads') || '[]');
    localStorage.setItem('theprams_demo_leads', JSON.stringify([
      {
        id: `local-${Date.now()}`,
        status: 'New',
        createdAt: new Date().toISOString().slice(0, 10),
        ...lead,
        email: lead.email || '-'
      },
      ...previous
    ]));
  };

  const openConsultation = (context = 'Konsultasi Website') => {
    if (user?.id === 'u_guest' && user.name && user.phone) {
      const programId = selectedProgramId || resolveProgramIdForUser();
      const program = PROGRAMS.find((item) => item.id === programId);
      saveLead({
        name: user.name,
        phone: user.phone,
        email: user.email,
        programOfInterest: program?.title || user.program || 'Konsultasi Tryout Gratis',
        source: context
      });
      window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(`Halo Admin The Prams, saya ${user.name}. Nomor WA saya ${user.phone}. Saya ingin konsultasi setelah mencoba tryout gratis. Target saya: ${user.targetPTN || '-'}.`)}`, '_blank');
      return;
    }

    setConsultName(user?.id === 'u_guest' ? user.name : user?.name || '');
    setConsultMessage('');
    setConsultContext(context);
    setIsConsultOpen(true);
  };

  const submitConsultation = (event: FormEvent) => {
    event.preventDefault();
    const programId = selectedProgramId || resolveProgramIdForUser();
    const program = PROGRAMS.find((item) => item.id === programId);
    saveLead({
      name: consultName,
      phone: user?.phone || 'Nomor dari WhatsApp saat user mengirim',
      email: user?.email,
      programOfInterest: program?.title || 'Konsultasi Program',
      source: `${consultContext} - Pesan: ${consultMessage}`
    });
    setIsConsultOpen(false);
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(`Halo Admin The Prams, saya ${consultName || user?.name || 'calon customer'}. ${consultMessage}`)}`, '_blank');
  };

  const openUpgradeProgram = (returnView: View | null = null) => {
    const programId = resolveProgramIdForUser();
    setUpgradeReturnView(returnView);
    setSelectedProgramId(programId);
    setSelectedPackageId(resolvePremiumPackageId(programId));
    setView('programDetail');
  };

  // Smooth scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  useEffect(() => {
    if (!tryoutResults || !user || view !== 'result') return;
    const weakest = [...tryoutResults].sort((a, b) => a.score - b.score)[0];
    saveLead({
      name: user.name,
      phone: user.phone || '-',
      email: user.email,
      programOfInterest: `${user.program || 'Tryout'} - Skor ${Math.round(tryoutResults.reduce((sum, item) => sum + item.score, 0) / tryoutResults.length)}/100`,
      source: `Hasil Tryout - Terlemah: ${weakest?.name || '-'} (${weakest?.score || 0}/100)`
    });
  }, [tryoutResults, user, view]);

  // Protection logic: redirect to login if trying to access dashboard while not logged in
  useEffect(() => {
    const protectedViews: View[] = ['dashboard', 'learning', 'exam', 'result', 'tryoutListing', 'profile', 'schedule'];
    if (protectedViews.includes(view) && !user) {
      setView('login');
    }
  }, [view, user]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar is only visible on certain pages */}
      {!['exam', 'result', 'payment', 'finalRegistration', 'admin', 'dashboard', 'learning', 'login'].includes(view) && (
        <Navbar currentView={view} setView={setView} user={user?.id === 'u_guest' ? null : user} logout={handleLogout} />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {view === 'landing' && <LandingPage setView={setView} />}
          {view === 'login' && <LoginPage setView={setView} setUser={setUser} setSelectedTryoutId={setSelectedTryoutId} />}
          {view === 'register' && <LoginPage setView={setView} setUser={setUser} setSelectedTryoutId={setSelectedTryoutId} isRegisteringDefault={true} />}
          {view === 'guestRegistration' && <LoginPage setView={setView} setUser={setUser} setSelectedTryoutId={setSelectedTryoutId} isGuestModeDefault={true} />}
          {view === 'programs' && <ProgramListingPage setView={setView} setSelectedProgramId={(id) => { setSelectedProgramId(id); setSelectedPackageId(null); }} />}
          {view === 'programDetail' && (
            <ProgramDetailPage 
              programId={selectedProgramId} 
              setView={setView} 
              selectedPackageId={selectedPackageId}
              setSelectedPackageId={setSelectedPackageId}
              returnToResult={upgradeReturnView === 'result' && user?.id === 'u_guest'}
              setSelectedMentorId={setSelectedMentorId} 
            />
          )}
          {view === 'payment' && <PaymentPage setView={setView} selectedProgramId={selectedProgramId} selectedPackageId={selectedPackageId} user={user} />}
          {view === 'finalRegistration' && (
            <FinalRegistrationPage
              setView={setView}
              user={user}
              selectedProgram={PROGRAMS.find((program) => program.id === selectedProgramId) || PROGRAMS[0]}
              selectedPackage={(PROGRAMS.find((program) => program.id === selectedProgramId) || PROGRAMS[0]).packages?.find((pkg) => pkg.id === selectedPackageId) || null}
            />
          )}
          {view === 'blogListing' && (
            <BlogListingPage 
              setView={setView} 
              setSelectedBlogId={setSelectedBlogId} 
            />
          )}
          {view === 'blogPost' && (
            <BlogPostPage 
              blogId={selectedBlogId} 
              setView={setView} 
            />
          )}
          {view === 'testimonials' && <TestimonialsPage setView={setView} />}
          {view === 'mentorProfile' && (
            <MentorProfilePage 
              mentorId={selectedMentorId} 
              setView={setView} 
              setSelectedProgramId={setSelectedProgramId} 
            />
          )}
          {view === 'dashboard' && <StudentDashboard setView={setView} user={user} logout={handleLogout} onUpgrade={openUpgradeProgram} />}
          {view === 'learning' && <LearningPage setView={setView} user={user} onUpgrade={openUpgradeProgram} />}
          {view === 'exam' && <TryoutExamPage setView={setView} setTryoutResults={setTryoutResults} selectedTryoutId={selectedTryoutId} />}
          {view === 'result' && <TryoutResultPage setView={setView} tryoutResults={tryoutResults} user={user} selectedTryoutId={selectedTryoutId} onUpgrade={() => openUpgradeProgram('result')} onConsult={() => openConsultation('Konsultasi Hasil Tryout')} />}
          {view === 'tryoutListing' && <TryoutListingPage setView={setView} user={user} />}
          {view === 'profile' && <ProfilePage setView={setView} user={user} />}
          {view === 'contact' && <ContactPage />}
          {view === 'admin' && <AdminDashboard logout={handleLogout} setView={setView} />}
          
          {view === 'schedule' && (
            <div className="min-h-screen bg-slate-50 px-4 py-10 md:px-8">
              <div className="max-w-5xl mx-auto">
                <button
                  onClick={() => setView('dashboard')}
                  className="flex items-center gap-2 text-slate-500 hover:text-brand-navy font-bold text-sm mb-8 transition-colors"
                >
                  <ChevronLeft size={18} />
                  Kembali ke Dashboard
                </button>

                {user?.isPremium ? (
                  <>
                    <div className="mb-8">
                      <p className="text-xs font-black uppercase tracking-widest text-brand-blue mb-2">Google Calendar Sync</p>
                      <h1 className="text-4xl font-black text-brand-navy mb-3">Semua Jadwal Kelas</h1>
                      <p className="text-slate-500 max-w-2xl">
                        Jadwal ini tersinkron dengan data Live Session. Reminder dikirim melalui Gmail, link GMeet tersedia, dan rekaman tersimpan di Kelas Saya setelah sesi selesai.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {LIVE_SESSIONS.map((session) => (
                        <div key={session.id} className="card-premium p-6 bg-white">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex gap-5">
                          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-brand-blue flex flex-col items-center justify-center shrink-0">
                            <Calendar size={22} />
                            <span className="text-[10px] font-black mt-1">{session.startTime}</span>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{session.date}</p>
                            <h2 className="text-xl font-bold text-brand-navy mb-2">{session.title}</h2>
                            <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest">
                              <span className="px-2 py-1 rounded-md bg-blue-50 text-brand-blue flex items-center gap-1">
                                <Video size={12} />
                                {session.mode}
                              </span>
                              <span className="px-2 py-1 rounded-md bg-red-50 text-red-500 flex items-center gap-1">
                                <Mail size={12} />
                                {session.gmailStatus}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-3">{session.recordingStatus}</p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 lg:min-w-[320px]">
                          <a
                            href={session.calendarUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 px-4 py-3 rounded-xl bg-slate-50 text-brand-navy text-xs font-black flex items-center justify-center gap-2 hover:bg-blue-50 transition-all"
                          >
                            Tambah Calendar
                            <Calendar size={16} />
                          </a>
                          <a
                            href={session.meetUrl}
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
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="card-premium p-10 bg-white text-center">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-6">
                      <Calendar size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-brand-navy mb-3">Jadwal Kelas Premium</h1>
                    <p className="text-slate-500 max-w-lg mx-auto mb-8">
                      Akun gratis belum mendapat akses jadwal live session, Google Calendar, dan link GMeet. Upgrade paket untuk membuka jadwal kelas.
                    </p>
                    <button onClick={() => openUpgradeProgram()} className="btn-primary mx-auto">Upgrade Paket</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Admin Toggle (For Demo purposes) */}
      <div className="fixed bottom-4 right-4 z-[999] flex gap-2">
         <button 
           onClick={() => setView(view === 'admin' ? 'landing' : 'admin')}
           className="p-3 bg-brand-navy text-white rounded-full shadow-2xl border-4 border-white hover:scale-110 transition-transform flex items-center gap-2"
           title="Demo Admin View"
         >
           <span className="text-[10px] font-bold">DEMO ADMIN</span>
         </button>
      </div>

      {!['exam', 'admin'].includes(view) && (
        <button
          type="button"
          onPointerDown={(event) => {
            setDidDragConsult(false);
            event.currentTarget.setPointerCapture(event.pointerId);
            const startClientX = event.clientX;
            const startClientY = event.clientY;
            const startX = consultPos.x;
            const startY = consultPos.y;
            const move = (moveEvent: PointerEvent) => {
              const deltaX = moveEvent.clientX - startClientX;
              const deltaY = moveEvent.clientY - startClientY;
              if (Math.abs(deltaX) + Math.abs(deltaY) > 6) setDidDragConsult(true);
              setConsultPos({
                x: Math.max(8, startX - deltaX),
                y: Math.max(8, startY - deltaY)
              });
            };
            const up = () => {
              window.removeEventListener('pointermove', move);
              window.removeEventListener('pointerup', up);
            };
            window.addEventListener('pointermove', move);
            window.addEventListener('pointerup', up);
          }}
          onClick={() => {
            if (!didDragConsult) openConsultation('Konsultasi via ikon WhatsApp');
          }}
          style={{ right: consultPos.x, bottom: consultPos.y }}
          className="fixed z-[998] w-14 h-14 rounded-full bg-emerald-500 text-white shadow-2xl flex items-center justify-center border-4 border-white touch-none cursor-grab active:cursor-grabbing"
          title="Drag untuk pindah, klik untuk konsultasi"
        >
          <MessageCircle size={26} />
        </button>
      )}

      {isConsultOpen && (
        <div className="fixed inset-0 z-[1000] bg-brand-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={submitConsultation} className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-brand-navy">Konsultasi Gratis</h3>
              <button type="button" onClick={() => setIsConsultOpen(false)} className="p-2 rounded-xl bg-slate-50 text-slate-400">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nama</label>
                <input required value={consultName} onChange={(e) => setConsultName(e.target.value)} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium" placeholder="Nama lengkap" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Pesan yang ingin disampaikan</label>
                <textarea required value={consultMessage} onChange={(e) => setConsultMessage(e.target.value)} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium min-h-[120px]" placeholder="Contoh: Saya ingin konsultasi program SNBT Kedokteran setelah tryout gratis." />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">Nomor WhatsApp pengirim akan direkap dari data tryout jika tersedia. Jika belum tersedia, nomor dicatat dari WhatsApp saat user mengirim pesan.</p>
              <button type="submit" className="w-full btn-primary py-4">Kirim Konsultasi</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
