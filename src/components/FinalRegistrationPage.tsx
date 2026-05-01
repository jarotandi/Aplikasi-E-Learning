import React, { useEffect, useState } from 'react';
import { CheckCircle2, Lock, UserCheck } from 'lucide-react';
import { Program, ProgramPackage, User, View } from '../types';

const USER_STORAGE_KEY = 'theprams_demo_users';

export const FinalRegistrationPage: React.FC<{
  setView: (v: View) => void;
  user: User | null;
  selectedProgram: Program;
  selectedPackage: ProgramPackage | null;
}> = ({ setView, user, selectedProgram, selectedPackage }) => {
  const [name] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [phone] = useState(user?.phone || '');
  const [school, setSchool] = useState(user?.school || '');
  const [address, setAddress] = useState(user?.address || '');
  const [target, setTarget] = useState(user?.targetPTN || '');
  const [joinReason, setJoinReason] = useState(user?.joinReason || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verification, setVerification] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [submitted, setSubmitted] = useState(false);
  const isScholarship = Boolean(selectedPackage?.name.toLowerCase().includes('beasiswa') || selectedPackage?.id.toLowerCase().includes('scholar'));
  const isFree = selectedPackage?.price === 'Rp 0' && !isScholarship;
  const accountType = isScholarship ? 'Scholarship' : isFree ? 'Free' : 'Paid';
  const registrationStatus = isScholarship ? 'Waiting Scholarship Review' : isFree ? 'Active Free' : 'Waiting Payment Verification';
  const isPasswordValid = password.length >= 8 && /[A-Z]/.test(password) && /[^A-Za-z0-9]/.test(password);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isPasswordValid) return;
    if (password !== confirmPassword) return;
    if (verification.trim() !== '7') {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      if (nextAttempts >= 2) {
        setSecondsLeft(10);
        setVerification('');
        setAttempts(0);
      }
      return;
    }
    const registrationId = `reg-${Date.now()}`;
    const registrationRecord = {
        id: registrationId,
        name,
        email,
        phone,
        school,
        address,
        target,
        joinReason,
        program: selectedProgram.title,
        packageName: selectedPackage?.name || '-',
        type: accountType.toLowerCase(),
        status: registrationStatus,
        createdAt: new Date().toISOString().slice(0, 10)
      };
    const previous = JSON.parse(localStorage.getItem('theprams_demo_registrations') || '[]');
    localStorage.setItem('theprams_demo_registrations', JSON.stringify([
      registrationRecord,
      ...previous
    ]));
    if (isFree) {
      const previousUsers = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '[]');
      const userKey = `${email}-${selectedProgram.title}-${selectedPackage?.name || '-'}`.toLowerCase();
      const exists = previousUsers.some((item: any) => `${item.email}-${item.program}-${item.packageName || ''}`.toLowerCase() === userKey);
      if (!exists) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify([
          {
            id: `reg-${registrationId}`,
            name,
            email,
            role: 'Student',
            program: selectedProgram.title,
            status: 'Active',
            avatar: user?.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(email || registrationId)}`,
            joinedAt: new Date().toISOString().slice(0, 10),
            accountType: 'Free',
            packageName: selectedPackage?.name || 'Gratis',
            paymentStatus: 'Free Active',
            source: 'Pendaftaran Gratis'
          },
          ...previousUsers
        ]));
      }
    }
    setSubmitted(true);
    setTimeout(() => setView(isFree ? 'learning' : 'dashboard'), 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="max-w-3xl mx-auto card-premium bg-white p-8">
        {submitted ? (
          <div className="text-center py-12">
            <CheckCircle2 size={64} className="text-emerald-500 mx-auto mb-6" />
            <h1 className="text-3xl font-black text-brand-navy mb-3">{isFree ? 'Akses Gratis Aktif' : isScholarship ? 'Pengajuan Beasiswa Terkirim' : 'Pendaftaran Terkirim'}</h1>
            <p className="text-slate-500 mb-8">
              {isFree ? 'Akun gratis aktif tanpa menunggu konfirmasi.' : isScholarship ? 'Data pendaftaran beasiswa masuk database admin untuk direview.' : 'Data pendaftaran masuk database admin. Verifikasi pembayaran maksimal 2x24 jam.'}
            </p>
            <button onClick={() => setView('landing')} className="btn-primary mx-auto">Kembali ke Beranda</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-6">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-brand-blue mb-2">Form Pendaftaran</p>
              <h1 className="text-3xl font-black text-brand-navy">{selectedProgram.title}</h1>
              <p className="text-slate-500 text-sm mt-2">Jika tidak menerima notifikasi email, tunggu 10 detik lalu isi form pendaftaran manual ini.</p>
            </div>

            {secondsLeft > 0 ? (
              <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl text-center">
                <p className="text-sm font-bold text-brand-navy mb-1">Menunggu notifikasi email...</p>
                <p className="text-xs text-slate-500">Form manual akan muncul dalam {secondsLeft} detik.</p>
              </div>
            ) : (
              <>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3">
              <Lock size={18} className="text-brand-blue shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600">Nama, email, dan WhatsApp otomatis dari form tryout/pembayaran dan tidak dapat diedit di tahap ini.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input value={name} readOnly className="px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-500" />
              <input value={email} readOnly className="px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-500" />
              <input value={phone} readOnly className="px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-500" />
              <input value={selectedPackage?.name || '-'} readOnly className="px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-500" />
              <input required value={school} onChange={(e) => setSchool(e.target.value)} placeholder="Asal sekolah / instansi" className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none" />
              <input required value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Target / cita-cita" className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none" />
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Buat password akun" className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none" />
              <input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Ulangi password" className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none" />
              {password && !isPasswordValid && <p className="md:col-span-2 text-xs text-red-500 font-bold">Password minimal 8 karakter, mengandung 1 huruf besar, dan 1 karakter spesial.</p>}
              {confirmPassword && password !== confirmPassword && <p className="md:col-span-2 text-xs text-red-500 font-bold">Password dan ulangi password belum sama.</p>}
              <textarea required value={joinReason} onChange={(e) => setJoinReason(e.target.value)} placeholder="Alasan bergabung" className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none md:col-span-2 min-h-[90px]" />
              <textarea required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Alamat lengkap" className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none md:col-span-2 min-h-[100px]" />
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Verifikasi keamanan: 3 + 4 = ?</label>
              <input required value={verification} onChange={(e) => setVerification(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-100 outline-none" placeholder="Masukkan jawaban" />
              {attempts > 0 && <p className="text-xs text-red-500 mt-2">Jawaban salah. Percobaan tersisa: {2 - attempts}</p>}
            </div>

            {!isFree && !isScholarship && (
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-900">
                Setelah form dikirim, pembayaran akan diverifikasi maksimal 2x24 jam.
              </div>
            )}

            {isScholarship && (
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs text-indigo-900">
                Paket beasiswa tidak perlu upload bukti pembayaran. Admin akan mereview data pendaftaran dan menghubungi jika perlu wawancara singkat.
              </div>
            )}

            <button className="w-full btn-primary py-4 flex items-center justify-center gap-2">
              <UserCheck size={18} />
              Kirim Form Pendaftaran
            </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
