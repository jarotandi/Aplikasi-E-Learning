import React, { useState } from 'react';
import { 
  ChevronLeft, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  Lock,
  Smartphone,
  Building,
  FileText,
  Upload,
  Clock
} from 'lucide-react';
import { View, Program, ProgramPackage, User } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { PROGRAMS } from '../constants';
import { escapeHtml, isValidEmail, isValidIndonesianPhone, readStoredArray } from '../utils/security';

export const PaymentPage: React.FC<{ setView: (v: View) => void; selectedProgramId?: string | null; selectedPackageId?: string | null; user?: User | null; programs?: Program[] }> = ({ setView, selectedProgramId, selectedPackageId, user, programs = PROGRAMS }) => {
  const [step, setStep] = useState<'checkout' | 'processing' | 'success'>('checkout');
  const selectedProgram: Program = programs.find((program) => program.id === selectedProgramId) || programs[0] || PROGRAMS[0];
  const selectedPackage: ProgramPackage | null = selectedProgram.packages?.find((pkg) => pkg.id === selectedPackageId) || selectedProgram.packages?.find((pkg) => pkg.isPopular) || selectedProgram.packages?.[0] || null;
  const [paymentMethod, setPaymentMethod] = useState<'va' | 'ewallet' | 'cc'>('va');
  const [payerName, setPayerName] = useState(user?.name || 'Budi Santoso');
  const [payerEmail, setPayerEmail] = useState(user?.email || 'budi@example.com');
  const [payerPhone, setPayerPhone] = useState(user?.phone || '0812-3456-7890');
  const [paymentError, setPaymentError] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofError, setProofError] = useState('');
  const [proofSubmitted, setProofSubmitted] = useState(false);
  const isFreePackage = (selectedPackage?.price || selectedProgram.price) === 'Rp 0';
  const isScholarshipPackage = selectedPackage?.name.toLowerCase().includes('beasiswa') || selectedPackage?.id.toLowerCase().includes('scholar');
  const requiresPaymentProof = !isFreePackage && !isScholarshipPackage;
  const adminFee = isFreePackage ? 'Rp 0' : 'Rp 5.000';
  const paymentActionLabel = isScholarshipPackage ? 'Ajukan Beasiswa' : isFreePackage ? 'Aktifkan Paket Gratis' : 'Proses Pembayaran';
  const [invoiceNumber] = useState(() => `INV/${new Date().toISOString().slice(0, 10).replace(/-/g, '')}/TP/${Date.now().toString().slice(-5)}`);
  const [invoiceTime] = useState(() => new Date().toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }));

  const buildInvoiceHtml = (methodLabel: string) => `
      <html>
        <head>
          <title>${escapeHtml(invoiceNumber)}</title>
          <style>
            body { font-family: Arial, sans-serif; color:#0f172a; margin:40px; }
            .head { display:flex; justify-content:space-between; border-bottom:3px solid #2563eb; padding-bottom:18px; margin-bottom:28px; }
            .brand { font-size:24px; font-weight:900; color:#1e3a8a; }
            .muted { color:#64748b; font-size:12px; }
            table { width:100%; border-collapse:collapse; margin:24px 0; }
            td, th { padding:12px; border-bottom:1px solid #e2e8f0; text-align:left; }
            th { background:#f8fafc; color:#64748b; font-size:11px; text-transform:uppercase; }
            .total { font-size:24px; font-weight:900; color:#f59e0b; }
            .box { border:1px solid #e2e8f0; border-radius:14px; padding:18px; margin-top:18px; }
            @media print { button { display:none; } body { margin:24px; } }
          </style>
        </head>
        <body>
          <div class="head">
            <div><div class="brand">Bimbel The Prams</div><div class="muted">Invoice Pembayaran Program</div></div>
            <div><strong>${escapeHtml(invoiceNumber)}</strong><div class="muted">${escapeHtml(invoiceTime)}</div></div>
          </div>
          <div class="box">
            <div class="muted">Program</div>
            <h2>${escapeHtml(selectedProgram.title)}</h2>
            <p>Paket: <strong>${escapeHtml(selectedPackage?.name || '-')}</strong></p>
            <p>Nama: <strong>${escapeHtml(payerName || '-')}</strong></p>
            <p>Email: <strong>${escapeHtml(payerEmail || '-')}</strong></p>
            <p>WhatsApp: <strong>${escapeHtml(payerPhone || '-')}</strong></p>
          </div>
          <table>
            <thead><tr><th>Item</th><th>Durasi</th><th>Harga</th></tr></thead>
            <tbody><tr><td>${escapeHtml(selectedProgram.title)} - ${escapeHtml(selectedPackage?.name || 'Paket')}</td><td>${escapeHtml(selectedPackage?.duration || '-')}</td><td>${escapeHtml(selectedPackage?.price || selectedProgram.price)}</td></tr></tbody>
          </table>
          <p class="total">Total: ${escapeHtml(selectedPackage?.price || selectedProgram.price)}</p>
          <div class="box">Metode Pembayaran: <strong>${escapeHtml(methodLabel)}</strong></div>
          <div class="box">Status: ${isScholarshipPackage ? 'Pengajuan beasiswa tercatat - menunggu review admin.' : isFreePackage ? 'Aktif otomatis - Paket Gratis' : 'Menunggu/terverifikasi sesuai metode pembayaran. Jika belum menerima notifikasi, gunakan Verifikasi Manual.'}</div>
          <button onclick="window.print()">Cetak / Simpan PDF</button>
        </body>
      </html>
    `;

  const openInvoice = () => {
    const invoice = window.open('', '_blank');
    if (!invoice) return;
    const methodLabel = isScholarshipPackage ? 'Pengajuan Beasiswa' : isFreePackage ? 'Paket Gratis' : paymentMethod === 'va' ? 'Virtual Account' : paymentMethod === 'ewallet' ? 'E-Wallet' : 'Debit Card';
    invoice.document.write(buildInvoiceHtml(methodLabel));
    invoice.document.close();
  };

  const handlePayment = () => {
    if (!payerName.trim()) {
      setPaymentError('Nama lengkap wajib diisi.');
      return;
    }
    if (!isValidEmail(payerEmail)) {
      setPaymentError('Format email pembayaran tidak valid.');
      return;
    }
    if (!isValidIndonesianPhone(payerPhone)) {
      setPaymentError('Nomor WhatsApp harus diawali 08, 62, atau +62 dan berisi minimal 9 digit.');
      return;
    }
    setPaymentError('');
    const previous = readStoredArray('theprams_demo_transactions');
    const methodLabel = isScholarshipPackage ? 'Pengajuan Beasiswa' : isFreePackage ? 'Paket Gratis' : paymentMethod === 'va' ? 'Virtual Account' : paymentMethod === 'ewallet' ? 'E-Wallet' : 'Debit Card';
    localStorage.setItem('theprams_demo_transactions', JSON.stringify([
      {
        id: invoiceNumber,
        type: isScholarshipPackage ? 'scholarship' : isFreePackage ? 'free' : 'paid',
        student: payerName,
        phone: payerPhone,
        email: payerEmail,
        registrationData: {
          name: user?.name || payerName,
          email: user?.email || payerEmail,
          phone: user?.phone || payerPhone,
          school: user?.school || '-',
          address: user?.address || '-',
          targetPTN: user?.targetPTN || '-',
          joinReason: user?.joinReason || '-'
        },
        program: selectedProgram.title,
        packageName: selectedPackage?.name || '-',
        amount: selectedPackage?.price || selectedProgram.price,
        method: methodLabel,
        status: isScholarshipPackage ? 'Scholarship Review' : isFreePackage ? 'Free Active' : 'Pending',
        invoiceNumber,
        invoiceTime,
        invoiceHtml: buildInvoiceHtml(methodLabel),
        date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
        createdAt: new Date().toISOString()
      },
      ...previous
    ]));
    setStep('processing');
    setTimeout(() => setStep('success'), 2500);
  };

  const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const submitProof = async () => {
    if (!requiresPaymentProof) {
      setProofSubmitted(true);
      return;
    }
    if (!proofFile) {
      setProofError('Upload bukti pembayaran terlebih dahulu.');
      return;
    }
    setProofError('');
    const fileData = await readFileAsDataUrl(proofFile);
    const previous = readStoredArray('theprams_demo_payment_proofs');
    localStorage.setItem('theprams_demo_payment_proofs', JSON.stringify([
      {
        id: `proof-${Date.now()}`,
        invoiceId: invoiceNumber,
        type: 'Payment Proof',
        student: payerName,
        phone: payerPhone,
        email: payerEmail,
        verifiedEmail: payerEmail,
        verifiedPhone: payerPhone,
        program: selectedProgram.title,
        packageName: selectedPackage?.name || '-',
        fileName: proofFile.name,
        fileSize: proofFile.size,
        fileType: proofFile.type || 'application/octet-stream',
        fileData,
        status: 'Waiting Verification',
        createdAt: new Date().toISOString()
      },
      ...previous
    ]));
    setProofSubmitted(true);
  };

  return (
    <div className="pt-20 min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {step === 'checkout' && (
          <motion.div 
            key="checkout"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-5xl w-full grid lg:grid-cols-5 gap-8"
          >
            <div className="lg:col-span-3 space-y-6">
              <button 
                onClick={() => setView('programs')}
                className="flex items-center gap-2 text-slate-500 hover:text-brand-navy font-bold text-sm mb-4 transition-colors"
              >
                <ChevronLeft size={18} />
                Kembali ke Menu Sebelumnya
              </button>
              
              <div className="card-premium p-8 bg-white">
                <h2 className="text-2xl font-bold text-brand-navy mb-8 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-brand-navy text-white flex items-center justify-center text-sm">1</span>
                  {requiresPaymentProof ? 'Metode Pembayaran' : 'Konfirmasi Pendaftaran'}
                </h2>
                
                {requiresPaymentProof ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {[
                     { id: 'va', name: 'Virtual Account', icon: Building, color: 'text-indigo-500' },
                     { id: 'ewallet', name: 'E-Wallet', icon: Smartphone, color: 'text-brand-orange' },
                     { id: 'cc', name: 'Debit Card', icon: CreditCard, color: 'text-brand-blue' }
                   ].map((method) => (
                     <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-4 ${paymentMethod === method.id ? 'border-brand-blue bg-blue-50/30' : 'border-slate-100 opacity-60 hover:opacity-100'}`}
                     >
                        <method.icon className={method.color} size={24} />
                        <span className="font-bold text-sm text-brand-navy">{method.name}</span>
                     </button>
                   ))}
                </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-4">
                    <ShieldCheck className="text-emerald-600 mt-1" size={22} />
                    <div>
                      <p className="font-black text-brand-navy">{isScholarshipPackage ? 'Pendaftaran Beasiswa Tanpa Upload Dokumen' : 'Kelas Gratis Aktif Tanpa Bukti Pembayaran'}</p>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">
                        {isScholarshipPackage
                          ? 'Data pengajuan beasiswa akan langsung masuk ke database admin untuk direview.'
                          : 'Paket gratis bernilai Rp 0, jadi tidak perlu upload bukti pembayaran.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="card-premium p-8 bg-white">
                 <h2 className="text-2xl font-bold text-brand-navy mb-8 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-brand-navy text-white flex items-center justify-center text-sm">2</span>
                    Informasi Pembayaran
                 </h2>
                 <form className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nama Lengkap</label>
                          <input value={payerName} onChange={(e) => setPayerName(e.target.value)} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email</label>
                          <input type="email" value={payerEmail} onChange={(e) => setPayerEmail(e.target.value)} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium" />
                       </div>
                       <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nomor WhatsApp</label>
                          <input type="tel" value={payerPhone} onChange={(e) => setPayerPhone(e.target.value)} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium" />
                       </div>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-2xl flex items-start gap-4">
                       <ShieldCheck className="text-amber-600 mt-1" size={20} />
                       <p className="text-xs text-amber-900 leading-relaxed">
                          Data nama, email, dan WhatsApp dari pembayaran akan otomatis masuk ke form pendaftaran dan dikunci sesuai invoice. Data lain tetap dapat dilengkapi di tahap pendaftaran.
                       </p>
                    </div>
                    {paymentError && (
                      <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs font-bold text-red-600">
                        {paymentError}
                      </div>
                    )}
                 </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="card-premium p-8 bg-brand-navy text-white sticky top-32 overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                 
                 <h3 className="font-bold text-xl mb-8 relative z-10">Ringkasan Order</h3>
                 
                 <div className="space-y-6 relative z-10">
                    <div className="flex gap-4 items-center">
                       <img src={selectedProgram.image} className="w-16 h-16 rounded-xl object-cover border-2 border-white/10" alt="Program" />
                       <div>
                          <p className="text-sm font-bold">{selectedProgram.title}</p>
                          <p className="text-[10px] text-white/50">{selectedPackage?.name || selectedProgram.category}</p>
                       </div>
                    </div>
                    
                    <div className="h-px bg-white/10 w-full" />
                    
                    <div className="space-y-2">
                       <div className="flex justify-between text-white/60 text-sm">
                          <span>Harga Paket</span>
                          <span className="font-bold text-white">{selectedPackage?.price || selectedProgram.price}</span>
                       </div>
                       <div className="flex justify-between text-white/60 text-sm">
                          <span>Biaya Admin</span>
                          <span className="font-bold text-white">{adminFee}</span>
                       </div>
                       <div className="flex justify-between text-white/60 text-sm">
                          <span>Diskon Promo</span>
                          <span className="font-bold text-emerald-400">-Rp 0</span>
                       </div>
                    </div>

                    <div className="h-px bg-white/10 w-full" />

                    <div className="flex justify-between items-center py-2">
                       <p className="text-sm font-bold">Total Bayar</p>
                       <p className="text-2xl font-black text-brand-orange">{selectedPackage?.price || selectedProgram.price}</p>
                    </div>

                    <button 
                      onClick={handlePayment}
                      className="w-full btn-orange py-4 rounded-2xl shadow-xl shadow-brand-orange/20 flex items-center justify-center gap-3"
                    >
                       {paymentActionLabel}
                       <ArrowRight size={20} />
                    </button>

                    <div className="flex items-center justify-center gap-2 text-white/40 text-[10px] uppercase font-black tracking-widest mt-6">
                       <Lock size={12} />
                       Secure Checkout
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div 
            key="processing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-12 bg-white rounded-3xl shadow-2xl max-w-sm"
          >
            <div className="w-20 h-20 border-4 border-slate-100 border-t-brand-blue rounded-full animate-spin mx-auto mb-8" />
            <h2 className="text-2xl font-bold text-brand-navy mb-4">Memproses Pembayaran</h2>
            <p className="text-slate-500 text-sm">Mohon tunggu sebentar, jangan tutup halaman ini.</p>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-12 bg-white rounded-3xl shadow-2xl max-w-md w-full"
          >
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
               <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-bold text-brand-navy mb-4">Pembayaran Berhasil!</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
               {isScholarshipPackage
                 ? <>Pengajuan beasiswa untuk program <span className="font-bold text-brand-blue">{selectedProgram.title}</span> tercatat. Tidak perlu upload dokumen di tahap ini; admin akan mereview data pendaftaran.</>
                 : isFreePackage
                   ? <>Paket gratis untuk program <span className="font-bold text-brand-blue">{selectedProgram.title}</span> aktif tanpa upload bukti pembayaran.</>
                   : <>Pembayaran untuk program <span className="font-bold text-brand-blue">{selectedProgram.title}</span> tercatat. Upload bukti pembayaran agar admin dapat melakukan verifikasi maksimal 2x24 jam.</>}
            </p>

            <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left space-y-4">
               <div className="flex items-center gap-3 text-slate-400">
                  <FileText size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Digital Invoice</span>
               </div>
               <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <p className="text-xs font-bold text-slate-600">No. Invoice</p>
                  <p className="font-mono text-sm font-bold text-brand-navy">{invoiceNumber}</p>
               </div>
               <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-slate-600">Waktu Bayar</p>
                  <p className="text-sm font-bold text-brand-navy">{invoiceTime}</p>
               </div>
               <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-slate-600">Metode</p>
                  <p className="text-sm font-bold text-brand-navy">{isScholarshipPackage ? 'Pengajuan Beasiswa' : isFreePackage ? 'Paket Gratis' : paymentMethod === 'va' ? 'Virtual Account' : paymentMethod === 'ewallet' ? 'E-Wallet' : 'Debit Card'}</p>
               </div>
               <button onClick={openInvoice} className="w-full py-2 bg-white border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">
                  Unduh PDF Invoice
               </button>
            </div>

            {!requiresPaymentProof ? (
              <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-6 text-left space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-brand-navy">{isScholarshipPackage ? 'Siap Lanjut Form Pendaftaran' : 'Tidak Perlu Upload Bukti Pembayaran'}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      {isScholarshipPackage
                        ? 'Data beasiswa akan direview dari form pendaftaran. Lengkapi data siswa agar admin bisa menilai pengajuan.'
                        : 'Kelas gratis otomatis dicatat di sistem. Lengkapi form pendaftaran untuk membuat akun belajar.'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setView('finalRegistration')} className="w-full btn-primary py-4">
                  Lanjut Isi Form Pendaftaran
                </button>
              </div>
            ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-left space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                  <Upload size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-brand-navy">Upload Bukti Pembayaran</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Upload screenshot/struk pembayaran, lalu tunggu verifikasi admin maksimal 2x24 jam.
                  </p>
                </div>
              </div>

              <label className="block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">File bukti pembayaran</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(event) => {
                    setProofFile(event.target.files?.[0] || null);
                    setProofError('');
                    setProofSubmitted(false);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-blue file:px-4 file:py-2 file:text-xs file:font-bold file:text-white"
                />
              </label>

              {proofFile && (
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600">
                  File dipilih: <span className="font-bold text-brand-navy">{proofFile.name}</span>
                </div>
              )}

              {proofError && <p className="text-xs font-bold text-red-500">{proofError}</p>}

              {proofSubmitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex gap-3">
                  <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    Bukti pembayaran terkirim. Admin akan memverifikasi pembayaran maksimal 2x24 jam.
                  </p>
                  <button onClick={() => setView('finalRegistration')} className="w-full btn-primary py-3 mt-4">
                    Lanjut Isi Form Pendaftaran
                  </button>
                </div>
              ) : (
                <button onClick={submitProof} className="w-full btn-primary py-4">
                  Kirim Bukti Pembayaran
                </button>
              )}

              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
                <Clock size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900 leading-relaxed">
                  Proses verifikasi maksimal 2x24 jam setelah bukti pembayaran diterima. Paket gratis dan beasiswa tidak membutuhkan upload bukti pembayaran.
                </p>
              </div>
            </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
