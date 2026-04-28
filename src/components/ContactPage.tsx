import React from 'react';
import { 
  BarChart3, 
  MessageCircle, 
  Mail, 
  MapPin, 
  ArrowRight,
  CheckCircle2,
  Phone,
  Clock,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react';
import { View } from '../types';

export const ContactPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="pt-28 min-h-screen bg-slate-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-brand-navy mb-4">Hubungi Kami</h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Punya pertanyaan tentang program kami? Konsultasikan jalur belajarmu dengan admin kami secara gratis.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="card-premium p-8 bg-white">
               <h3 className="font-bold text-brand-navy text-xl mb-6 italic">The Prams Center</h3>
               <div className="space-y-8">
                  <div className="flex gap-4">
                     <div className="p-3 bg-blue-50 text-brand-blue rounded-xl">
                        <MapPin size={24} />
                     </div>
                     <div>
                        <p className="font-bold text-brand-navy">Lokasi Fisik</p>
                        <p className="text-sm text-slate-500 leading-relaxed">
                           Jl. Jenderal Sudirman No. 123, <br />
                           Kota Jakarta Pusat, DKI Jakarta.
                        </p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <MessageCircle size={24} />
                     </div>
                     <div>
                        <p className="font-bold text-brand-navy">WhatsApp Admin</p>
                        <p className="text-sm text-slate-500">+62 812-3456-7890</p>
                        <p className="text-[10px] text-emerald-500 font-bold mt-1">FAST RESPONSE</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="p-3 bg-amber-50 text-brand-orange rounded-xl">
                        <Clock size={24} />
                     </div>
                     <div>
                        <p className="font-bold text-brand-navy">Jam Operasional</p>
                        <p className="text-sm text-slate-500">Senin - Sabtu: 09:00 - 18:00</p>
                        <p className="text-sm text-slate-500">Minggu: Tutup</p>
                     </div>
                  </div>
               </div>

               <div className="mt-12 pt-8 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">Ikuti Kami</p>
                  <div className="flex justify-center gap-6">
                     <button className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-brand-blue hover:bg-blue-50 transition-all">
                        <Instagram size={24} />
                     </button>
                     <button className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-brand-blue hover:bg-blue-50 transition-all">
                        <Facebook size={24} />
                     </button>
                     <button className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-brand-blue hover:bg-blue-50 transition-all">
                        <Twitter size={24} />
                     </button>
                  </div>
               </div>
            </div>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-2">
            <div className="card-premium p-10 bg-white">
               <h3 className="text-2xl font-bold text-brand-navy mb-8">Form Konsultasi Gratis</h3>
               {isSubmitted ? (
                 <div className="py-12 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
                       <CheckCircle2 size={40} />
                    </div>
                   <h4 className="text-2xl font-bold text-brand-navy mb-2">Pesan Terkirim!</h4>
                   <p className="text-slate-500">Terima kasih telah menghubungi kami. Tim support kami akan segera membalas melalui email atau WhatsApp.</p>
                 </div>
               ) : (
                 <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nama Lengkap</label>
                          <input required type="text" placeholder="Contoh: Budi Santoso" className="w-full px-5 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-brand-blue ring-offset-2 outline-none transition-all placeholder:text-slate-400" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Aktif</label>
                          <input required type="email" placeholder="nama@email.com" className="w-full px-5 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-brand-blue ring-offset-2 outline-none transition-all placeholder:text-slate-400" />
                       </div>
                    </div>
                    <div className="space-y-2 mb-6">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nomor WhatsApp</label>
                       <input required type="tel" placeholder="0812-xxxx-xxxx" className="w-full px-5 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-brand-blue ring-offset-2 outline-none transition-all placeholder:text-slate-400" />
                    </div>
                    <div className="space-y-2 mb-6">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Incaran Program</label>
                       <select className="w-full px-5 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-brand-blue ring-offset-2 outline-none transition-all text-slate-600">
                          <option>Pilih Program...</option>
                          <option>SNBT Kedokteran</option>
                          <option>SKD CPNS</option>
                          <option>Sekolah Kedinasan</option>
                       </select>
                    </div>
                    <div className="space-y-2 mb-8">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ceritakan Kebutuhanmu</label>
                       <textarea required rows={4} placeholder="Tuliskan kendalamu dalam belajar..." className="w-full px-5 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-brand-blue ring-offset-2 outline-none transition-all placeholder:text-slate-400" />
                    </div>
                    <button type="submit" className="w-full btn-primary text-lg py-4">
                       Kirim Pesan Sekarang
                       <ArrowRight size={20} />
                    </button>
                 </form>
               )}
               <div className="mt-6 flex items-center justify-center gap-3 text-xs text-slate-400">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  Privasi terjaga 100%. Admin kami akan membalas dalam <span className="font-bold">24 Jam</span>.
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
