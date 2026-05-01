import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  Users, 
  GraduationCap,
  BookOpen, 
  Rocket, 
  DollarSign, 
  Users2, 
  CheckCircle2, 
  MoreVertical,
  Plus,
  Search,
  Bell,
  PieChart as PieChartIcon,
  Filter,
  Trash2,
  Edit2,
  MessageSquare,
  Star,
  LogOut,
  UserPlus,
  Award,
  FileText,
  Shield,
  ThumbsUp,
  MapPin,
  Calendar,
  Clock,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
  Globe,
  Wallet,
  Megaphone,
  Layout,
  Banknote,
  Video,
  Play,
  TrendingDown,
  TrendingUp,
  Target,
  Download,
  Settings,
  Copy,
  Tags,
  Upload,
  FileUp,
  Save,
  X,
  Check,
  Info,
  Image as ImageIcon,
  Smartphone,
  RefreshCw
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { Quote } from 'lucide-react';
import { BLOG_POSTS, USER_ACCOUNTS, MOCK_FEEDBACKS, TESTIMONIALS, PROGRAMS } from '../constants';
import { BlogPost, UserAccount, Lead, Question, Testimonial, Program, ProgramPackage, WebsiteQuestion } from '../types';

const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'Rina Wijaya', email: 'rina@mail.com', phone: '0812345678', programOfInterest: 'SNBT Kedokteran', source: 'Instagram', status: 'Qualified', createdAt: '2026-04-20' },
  { id: '2', name: 'Andi Pratama', email: 'andi@mail.com', phone: '0819876543', programOfInterest: 'SKD CPNS', source: 'Google', status: 'New', createdAt: '2026-04-22' },
  { id: '3', name: 'Siska Putri', email: 'siska@mail.com', phone: '0811223344', programOfInterest: 'Kedinasan', source: 'TikTok', status: 'Contacted', createdAt: '2026-04-23' },
];

const MOCK_QUESTIONS: Question[] = [
  { id: '1', subject: 'Penalaran Umum', difficulty: 'Hard', text: 'Semua X adalah Y...', options: [], correctOptionId: 'A', explanation: '...', program: 'SNBT' },
  { id: '2', subject: 'Penalaran Matematika', difficulty: 'Medium', text: 'Hasil dari 2x + 5...', options: [], correctOptionId: 'B', explanation: '...', program: 'SNBT' },
];

const revenueData = [
  { name: 'Mon', rev: 4000, students: 240 },
  { name: 'Tue', rev: 3000, students: 139 },
  { name: 'Wed', rev: 2000, students: 980 },
  { name: 'Thu', rev: 2780, students: 390 },
  { name: 'Fri', rev: 1890, students: 480 },
  { name: 'Sat', rev: 2390, students: 380 },
  { name: 'Sun', rev: 3490, students: 430 },
];

const programData = [
  { name: 'SNBT Kedokteran', value: 420 },
  { name: 'SKD CPNS', value: 215 },
  { name: 'Sekolah Kedinasan', value: 180 },
  { name: 'OSN Matematika', value: 95 },
];

const programPerformanceData = [
  { name: 'SNBT Kedokteran', active: 420, leads: 650, revenue: 1050 },
  { name: 'SKD CPNS', active: 215, leads: 450, revenue: 268 },
  { name: 'Kedinasan', active: 180, leads: 310, revenue: 270 },
  { name: 'OSN Math', active: 95, leads: 220, revenue: 95 },
  { name: 'Poltekkes', active: 154, leads: 280, revenue: 185 },
];

const COLORS = ['#2563eb', '#1e3a8a', '#f59e0b', '#10b981', '#6366f1'];

const readStorageArray = <T,>(key: string, fallback: T[] = []): T[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const USER_STORAGE_KEY = 'theprams_demo_users';
const LEAD_STORAGE_KEY = 'theprams_demo_leads';

const getAccountTypeFromRecord = (record: any): UserAccount['accountType'] => {
  const text = `${record.type || ''} ${record.status || ''} ${record.packageName || ''}`.toLowerCase();
  if (text.includes('scholar') || text.includes('beasiswa')) return 'Scholarship';
  if (text.includes('free') || text.includes('gratis')) return 'Free';
  return 'Paid';
};

const isApprovedStudentRecord = (record: any) => {
  const type = getAccountTypeFromRecord(record);
  const status = String(record.status || '').toLowerCase();
  if (type === 'Free') return true;
  if (type === 'Scholarship') return status.includes('approved');
  return status.includes('approved') || status.includes('success');
};

const userFromStudentRecord = (record: any, prefix = 'student'): UserAccount => {
  const sourceId = record.invoiceNumber || record.id || `${prefix}-${Date.now()}`;
  const data = record.registrationData || {};
  const accountType = getAccountTypeFromRecord(record);
  return {
    id: `${prefix}-${sourceId}`,
    name: data.name || record.name || record.student || 'Siswa Baru',
    email: data.email || record.email || '-',
    role: 'Student',
    program: record.program || data.program || '-',
    status: 'Active',
    avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(sourceId)}`,
    joinedAt: String(record.createdAt || new Date().toISOString()).slice(0, 10),
    accountType,
    packageName: record.packageName || '-',
    paymentStatus: record.status || '-',
    source: accountType === 'Free' ? 'Paket Gratis' : accountType === 'Scholarship' ? 'Approval Beasiswa' : 'Approval Pembayaran'
  };
};

const parseRupiah = (value: string | number | undefined) => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  return Number(String(value).replace(/[^\d]/g, '')) || 0;
};

const formatRupiah = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;
const formatRupiahInput = (value: number) => value ? value.toLocaleString('id-ID') : '';

interface FinanceEntry {
  id: string;
  type: 'fixed' | 'variable' | 'budget';
  name: string;
  category: string;
  amount: number;
  period: string;
  note: string;
  createdAt: string;
}

interface FinanceRealization {
  id: string;
  financeEntryId: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  note: string;
  createdAt: string;
}

interface AssetEntry {
  id: string;
  type: 'fixed_asset' | 'current_asset';
  name: string;
  category: string;
  acquisitionValue: number;
  currentValue: number;
  acquisitionDate: string;
  usefulLifeMonths: number;
  depreciationPerMonth: number;
  note: string;
  createdAt: string;
}

interface AuditEvent {
  id: string;
  module: string;
  action: string;
  detail: string;
  actor: string;
  createdAt: string;
}

interface NotificationEvent {
  id: string;
  channel: 'Email' | 'WhatsApp' | 'System';
  recipient: string;
  subject: string;
  message: string;
  status: 'Draft' | 'Queued' | 'Sent';
  createdAt: string;
}

type MarketingInstrumentType = 'Landing Page' | 'Paid Ad Creative' | 'Organic Content' | 'Social Account' | 'Broadcast / Nurture';

interface LandingPageSection {
  id: string;
  type: 'Hero' | 'Benefits' | 'Program Detail' | 'Social Proof' | 'Offer' | 'FAQ' | 'Lead Form' | 'CTA';
  title: string;
  body: string;
  cta?: string;
  imageUrl?: string;
  imageLayout?: 'None' | 'Background' | 'Left' | 'Right' | 'Top';
  imageSize?: 'Small' | 'Medium' | 'Large' | 'Full';
  imageAlign?: 'Start' | 'Center' | 'End';
  visible: boolean;
}

interface AiReferenceFile {
  id: string;
  name: string;
  type: string;
  size: number;
  preview?: string;
  text?: string;
}

interface CampaignImageAsset {
  id: string;
  name: string;
  source: 'Internet' | 'Upload' | 'Reference';
  url: string;
  keyword?: string;
  createdAt: string;
}

interface MarketingInstrument {
  id: string;
  type: MarketingInstrumentType;
  name: string;
  owner: string;
  format: string;
  brief: string;
  previewUrl: string;
  status: 'Draft' | 'Ready' | 'Published';
  landingPageSections?: LandingPageSection[];
  aiNotes?: string[];
  createdAt: string;
}

interface MarketingCampaign {
  id: string;
  name: string;
  program: string;
  goal: 'Lead Generation' | 'Pendaftaran Tryout' | 'Penjualan Paket' | 'Awareness';
  status: 'Draft' | 'Active' | 'Paused' | 'Completed';
  audience: string;
  location: string;
  channels: string[];
  instruments?: MarketingInstrument[];
  activeInstrumentId?: string;
  imageAssets?: CampaignImageAsset[];
  instrumentType: MarketingInstrumentType;
  instrumentName: string;
  instrumentOwner: string;
  instrumentFormat: string;
  instrumentBrief: string;
  instrumentPreviewUrl: string;
  landingPageName: string;
  landingPageUrl: string;
  headline: string;
  cta: string;
  budget: number;
  dailyBudget: number;
  startDate: string;
  endDate: string;
  targetLeads: number;
  targetRoi: number;
  views: number;
  clicks: number;
  leads: number;
  registrations: number;
  revenue: number;
  notes: string;
  createdAt: string;
}

interface VideoLessonRecord {
  id: string;
  title: string;
  program: string;
  duration: string;
  views: string;
  date: string;
  status: 'Draft' | 'Published' | 'Archived';
  access: 'Free' | 'Premium' | 'Scholarship';
  thumbnail: string;
  description: string;
  mentor: string;
  module: string;
  tags: string[];
  notes: string;
}

const defaultFinanceEntries: FinanceEntry[] = [
  { id: 'fixed-mentor', type: 'fixed', name: 'Honor Mentor Tetap', category: 'Gaji & Mentor', amount: 8500000, period: 'Bulanan', note: 'Biaya tetap operasional kelas', createdAt: '2026-04-01' },
  { id: 'fixed-tools', type: 'fixed', name: 'Tools Pembelajaran', category: 'Software', amount: 1200000, period: 'Bulanan', note: 'LMS, meeting, dan storage', createdAt: '2026-04-01' },
  { id: 'var-ads', type: 'variable', name: 'Iklan Tryout Gratis', category: 'Marketing', amount: 2500000, period: 'April 2026', note: 'Campaign pendaftaran', createdAt: '2026-04-18' },
  { id: 'budget-scholarship', type: 'budget', name: 'Kuota Beasiswa Prams Scholar', category: 'Beasiswa', amount: 15000000, period: 'Batch berjalan', note: 'Subsidi akses siswa terpilih', createdAt: '2026-04-20' }
];

const defaultAssetEntries: AssetEntry[] = [
  { id: 'asset-laptop', type: 'fixed_asset', name: 'Laptop Editor Konten', category: 'Peralatan Kantor', acquisitionValue: 12000000, currentValue: 10800000, acquisitionDate: '2026-04-01', usefulLifeMonths: 36, depreciationPerMonth: 333333, note: 'Aset tetap untuk produksi materi', createdAt: '2026-04-01' },
  { id: 'asset-cash', type: 'current_asset', name: 'Kas Operasional', category: 'Aset Lancar', acquisitionValue: 25000000, currentValue: 25000000, acquisitionDate: '2026-04-01', usefulLifeMonths: 0, depreciationPerMonth: 0, note: 'Saldo kas demo', createdAt: '2026-04-01' }
];

const defaultMarketingCampaigns: MarketingCampaign[] = [
  {
    id: 'campaign-snbt-tryout',
    name: 'Tryout Gratis SNBT Mei 2026',
    program: 'SNBT Kedokteran',
    goal: 'Lead Generation',
    status: 'Active',
    audience: 'Siswa kelas 12 dan gap year yang mengejar PTN favorit',
    location: 'Jawa, Sumatera, Bali',
    channels: ['Instagram Ads', 'TikTok Ads', 'WhatsApp Broadcast'],
    instrumentType: 'Landing Page',
    instrumentName: 'LP Tryout Gratis SNBT Mei',
    instrumentOwner: 'Website / The Prams',
    instrumentFormat: 'Hero + benefit + testimoni + form lead',
    instrumentBrief: 'Landing page fokus pada pendaftaran tryout gratis, social proof, dan form WhatsApp.',
    instrumentPreviewUrl: '/campaign/snbt-tryout-mei?utm_source=campaign',
    landingPageName: 'SNBT Intensive 2026',
    landingPageUrl: '/campaign/snbt-tryout-mei',
    headline: 'Tryout SNBT Gratis dengan Pembahasan Mentor',
    cta: 'Daftar Tryout Gratis',
    budget: 4500000,
    dailyBudget: 300000,
    startDate: '2026-05-01',
    endDate: '2026-05-15',
    targetLeads: 900,
    targetRoi: 4,
    views: 18400,
    clicks: 1260,
    leads: 640,
    registrations: 96,
    revenue: 14200000,
    notes: 'Prioritaskan creative video pendek dan follow-up WhatsApp kurang dari 15 menit.',
    createdAt: '2026-05-01'
  },
  {
    id: 'campaign-cpns-masterclass',
    name: 'CPNS Masterclass Early Bird',
    program: 'SKD CPNS',
    goal: 'Penjualan Paket',
    status: 'Draft',
    audience: 'Fresh graduate dan pekerja yang menargetkan seleksi CPNS',
    location: 'Nasional',
    channels: ['Google Ads', 'Email Campaign', 'Organic Social'],
    instrumentType: 'Paid Ad Creative',
    instrumentName: 'Google Search CPNS Early Bird',
    instrumentOwner: 'Google Ads / The Prams',
    instrumentFormat: 'Responsive search ad + sitelink',
    instrumentBrief: 'Iklan high intent untuk keyword SKD CPNS, diarahkan ke landing page paket early bird.',
    instrumentPreviewUrl: '/campaign/cpns-masterclass?utm_source=google_ads',
    landingPageName: 'CPNS Masterclass',
    landingPageUrl: '/campaign/cpns-masterclass',
    headline: 'Kuasai TWK, TIU, dan TKP dari Nol',
    cta: 'Ambil Paket Early Bird',
    budget: 3000000,
    dailyBudget: 200000,
    startDate: '2026-05-08',
    endDate: '2026-05-28',
    targetLeads: 420,
    targetRoi: 3.5,
    views: 0,
    clicks: 0,
    leads: 0,
    registrations: 0,
    revenue: 0,
    notes: 'Siapkan landing page dan form lead sebelum campaign aktif.',
    createdAt: '2026-04-29'
  }
];

const buildLandingPageTemplate = (campaign: Pick<MarketingCampaign, 'program' | 'headline' | 'cta'>): LandingPageSection[] => [
  { id: `lp-hero-${Date.now()}`, type: 'Hero', title: campaign.headline || `Daftar ${campaign.program}`, body: `Program ${campaign.program} dirancang untuk membantu siswa mencapai target belajar dengan arahan mentor The Prams.`, cta: campaign.cta || 'Daftar Sekarang', visible: true },
  { id: `lp-benefit-${Date.now()}`, type: 'Benefits', title: 'Kenapa memilih program ini?', body: 'Kurikulum terarah, latihan terukur, pembahasan intensif, dan monitoring progres belajar.', visible: true },
  { id: `lp-detail-${Date.now()}`, type: 'Program Detail', title: `Detail ${campaign.program}`, body: 'Jelaskan jadwal, fasilitas, mentor, materi inti, dan hasil yang diharapkan dari program.', visible: true },
  { id: `lp-proof-${Date.now()}`, type: 'Social Proof', title: 'Bukti dan testimoni siswa', body: 'Tambahkan testimoni, statistik kelulusan, atau cerita siswa agar pengunjung lebih percaya.', visible: true },
  { id: `lp-form-${Date.now()}`, type: 'Lead Form', title: 'Konsultasi gratis', body: 'Form singkat: nama, WhatsApp, kelas/status, dan program minat.', cta: campaign.cta || 'Kirim Data', visible: true },
  { id: `lp-faq-${Date.now()}`, type: 'FAQ', title: 'Pertanyaan yang sering ditanyakan', body: 'Jawab pertanyaan tentang jadwal, biaya, mentor, metode belajar, dan proses pendaftaran.', visible: true }
];

const landingPageTemplateOptions = [
  { id: 'lead-form', name: 'Lead Form', detail: 'Hero, benefit, form singkat, social proof, FAQ.' },
  { id: 'webinar-event', name: 'Webinar / Event', detail: 'Agenda, pembicara, jadwal, form registrasi.' },
  { id: 'consultation', name: 'Consultation Booking', detail: 'Problem, solusi, benefit konsultasi, booking CTA.' },
  { id: 'waitlist', name: 'Waitlist / Pre-launch', detail: 'Teaser program, benefit early access, form waitlist.' },
  { id: 'course-offer', name: 'Course / Program Offer', detail: 'Detail program, kurikulum, mentor, offer, FAQ.' },
  { id: 'resource-download', name: 'Resource Download', detail: 'Hook materi gratis, isi resource, form download.' }
];

const buildLandingPageTemplateByKind = (campaign: Pick<MarketingCampaign, 'program' | 'headline' | 'cta'>, templateId: string): LandingPageSection[] => {
  const stamp = Date.now();
  if (templateId === 'webinar-event') {
    return [
      { id: `lp-${stamp}-hero`, type: 'Hero', title: `Webinar ${campaign.program}`, body: 'Ikuti sesi live bersama mentor untuk memahami strategi belajar dan jalur persiapan yang paling tepat.', cta: 'Daftar Webinar', visible: true },
      { id: `lp-${stamp}-detail`, type: 'Program Detail', title: 'Yang akan dibahas', body: 'Materi inti, kesalahan umum, strategi latihan, dan sesi tanya jawab langsung.', visible: true },
      { id: `lp-${stamp}-proof`, type: 'Social Proof', title: 'Dipandu mentor berpengalaman', body: 'Tambahkan profil mentor, pengalaman, dan bukti hasil siswa.', visible: true },
      { id: `lp-${stamp}-form`, type: 'Lead Form', title: 'Amankan kursi webinar', body: 'Form singkat untuk nama, WhatsApp, kelas/status, dan target program.', cta: 'Daftar Gratis', visible: true },
      { id: `lp-${stamp}-faq`, type: 'FAQ', title: 'FAQ Webinar', body: 'Jawab pertanyaan tentang jadwal, link meeting, replay, dan materi pendukung.', visible: true }
    ];
  }
  if (templateId === 'consultation') {
    return [
      { id: `lp-${stamp}-hero`, type: 'Hero', title: `Konsultasi ${campaign.program}`, body: 'Bingung mulai dari mana? Dapatkan rekomendasi program dan strategi belajar sesuai targetmu.', cta: 'Konsultasi Gratis', visible: true },
      { id: `lp-${stamp}-benefit`, type: 'Benefits', title: 'Apa yang kamu dapatkan?', body: 'Diagnosis kebutuhan, rekomendasi program, estimasi jadwal belajar, dan arahan follow-up.', visible: true },
      { id: `lp-${stamp}-proof`, type: 'Social Proof', title: 'Dipercaya siswa The Prams', body: 'Tambahkan testimoni konsultasi dan perubahan progres belajar siswa.', visible: true },
      { id: `lp-${stamp}-form`, type: 'Lead Form', title: 'Jadwalkan konsultasi', body: 'Form nama, WhatsApp, kelas/status, target, dan waktu konsultasi.', cta: 'Booking Konsultasi', visible: true },
      { id: `lp-${stamp}-faq`, type: 'FAQ', title: 'Pertanyaan konsultasi', body: 'Jelaskan biaya, durasi, kanal konsultasi, dan langkah setelah konsultasi.', visible: true }
    ];
  }
  if (templateId === 'waitlist') {
    return [
      { id: `lp-${stamp}-hero`, type: 'Hero', title: `Daftar Waitlist ${campaign.program}`, body: 'Masuk daftar prioritas untuk mendapatkan info batch, bonus, dan akses awal.', cta: 'Masuk Waitlist', visible: true },
      { id: `lp-${stamp}-offer`, type: 'Offer', title: 'Benefit early access', body: 'Prioritas kursi, info promo, bonus materi awal, dan reminder pembukaan batch.', visible: true },
      { id: `lp-${stamp}-detail`, type: 'Program Detail', title: 'Tentang program', body: 'Jelaskan ringkas program, target siswa, dan outcome yang dijanjikan.', visible: true },
      { id: `lp-${stamp}-form`, type: 'Lead Form', title: 'Gabung waitlist', body: 'Form singkat untuk nama, WhatsApp, kelas/status, dan target.', cta: 'Gabung Sekarang', visible: true },
      { id: `lp-${stamp}-faq`, type: 'FAQ', title: 'FAQ Waitlist', body: 'Jawab kapan batch dibuka, apakah berbayar, dan bagaimana follow-up dilakukan.', visible: true }
    ];
  }
  if (templateId === 'course-offer') {
    return [
      { id: `lp-${stamp}-hero`, type: 'Hero', title: campaign.headline || `Program ${campaign.program}`, body: 'Halaman penawaran program dengan value proposition, detail kelas, dan CTA pendaftaran.', cta: campaign.cta || 'Daftar Sekarang', visible: true },
      { id: `lp-${stamp}-benefit`, type: 'Benefits', title: 'Manfaat utama', body: 'Kurikulum terarah, mentor ahli, latihan intensif, evaluasi progres, dan komunitas belajar.', visible: true },
      { id: `lp-${stamp}-detail`, type: 'Program Detail', title: 'Kurikulum dan fasilitas', body: 'Jelaskan jadwal, materi, tryout, modul, mentor, rekaman, dan support belajar.', visible: true },
      { id: `lp-${stamp}-proof`, type: 'Social Proof', title: 'Bukti hasil', body: 'Tambahkan testimoni, statistik, atau cerita siswa.', visible: true },
      { id: `lp-${stamp}-offer`, type: 'Offer', title: 'Paket dan bonus', body: 'Jelaskan harga, bonus, deadline promo, dan garansi/benefit tambahan.', cta: campaign.cta || 'Ambil Paket', visible: true },
      { id: `lp-${stamp}-form`, type: 'Lead Form', title: 'Daftar atau konsultasi', body: 'Form singkat untuk follow-up admin.', cta: campaign.cta || 'Kirim Data', visible: true },
      { id: `lp-${stamp}-faq`, type: 'FAQ', title: 'FAQ Program', body: 'Jawab pertanyaan biaya, jadwal, akses materi, dan mekanisme pembayaran.', visible: true }
    ];
  }
  if (templateId === 'resource-download') {
    return [
      { id: `lp-${stamp}-hero`, type: 'Hero', title: `Download Materi Gratis ${campaign.program}`, body: 'Tawarkan e-book, checklist, atau latihan soal sebagai lead magnet.', cta: 'Download Gratis', visible: true },
      { id: `lp-${stamp}-benefit`, type: 'Benefits', title: 'Isi materi', body: 'Jelaskan poin yang akan didapat setelah download.', visible: true },
      { id: `lp-${stamp}-proof`, type: 'Social Proof', title: 'Cocok untuk siapa?', body: 'Jelaskan target pembaca dan manfaat praktisnya.', visible: true },
      { id: `lp-${stamp}-form`, type: 'Lead Form', title: 'Kirim materi ke WhatsApp', body: 'Form nama, WhatsApp, email opsional, dan program minat.', cta: 'Kirim Materi', visible: true },
      { id: `lp-${stamp}-cta`, type: 'CTA', title: 'Butuh bimbingan lanjut?', body: 'Arahkan lead download ke konsultasi atau program utama.', cta: campaign.cta || 'Konsultasi', visible: true }
    ];
  }
  return buildLandingPageTemplate(campaign);
};

const defaultVideoLessons: VideoLessonRecord[] = [
  { id: 'video-1', title: 'Anatomi Dasar Bagian 1', program: 'Kedokteran Express', duration: '45:20', views: '1.2k', date: '2 hari lalu', status: 'Published', access: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=400', description: 'Pengenalan anatomi dasar untuk calon mahasiswa kedokteran dengan pendekatan visual.', mentor: 'dr. Pramono', module: 'Foundation Kedokteran', tags: ['Kedokteran', 'Anatomi'], notes: 'Tambahkan kuis singkat setelah menit 20.' },
  { id: 'video-2', title: 'TPA Penalaran Logis', program: 'SNBT Intensive', duration: '32:15', views: '2.5k', date: '3 hari lalu', status: 'Published', access: 'Free', thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400', description: 'Materi pola penalaran logis, implikasi, negasi, dan penarikan kesimpulan.', mentor: 'Siti Aminah, M.Pd.', module: 'Penalaran Umum', tags: ['SNBT', 'Logika'], notes: 'Cocok sebagai materi gratis setelah tryout.' },
  { id: 'video-3', title: 'UUD 1945 & Amandemen', program: 'CPNS Masterclass', duration: '58:40', views: '840', date: '5 hari lalu', status: 'Draft', access: 'Premium', thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=400', description: 'Pembahasan TWK tentang konstitusi dan perubahan amandemen penting.', mentor: 'Admin The Prams', module: 'TWK CPNS', tags: ['CPNS', 'TWK'], notes: 'Review ulang contoh soal sebelum publish.' },
  { id: 'video-4', title: 'Persiapan Psikotes', program: 'Kedinasan Special', duration: '25:10', views: '1.1k', date: '1 minggu lalu', status: 'Published', access: 'Scholarship', thumbnail: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=400', description: 'Strategi dasar psikotes untuk sekolah kedinasan dan latihan konsentrasi.', mentor: 'Admin The Prams', module: 'Kedinasan', tags: ['Psikotes', 'Kedinasan'], notes: 'Bisa dibuka untuk siswa beasiswa approved.' },
];

const nonDepreciableFixedAssetCategories = ['Tanah/Bangunan'];

const budgetDirections = [
  { value: 'Marketing', label: 'Anggaran Marketing', target: 'Digital Marketing' },
  { value: 'Digital Marketing', label: 'Anggaran Digital Marketing', target: 'Digital Marketing' },
  { value: 'Editor Konten', label: 'Anggaran Editor / Desain Konten', target: 'Website Editor & Content Library' },
  { value: 'Pembuatan Program', label: 'Anggaran Pembuatan Program', target: 'Program Inventory' },
  { value: 'Materi Program', label: 'Anggaran Materi Program', target: 'Perancangan Materi' },
  { value: 'Freelance', label: 'Anggaran Freelance', target: 'Vendor / Freelancer' },
  { value: 'Lainnya', label: 'Anggaran Lainnya', target: 'Operasional Lainnya' }
];

const BLOG_EDITOR_TEMPLATES: Array<{ label: string; category: BlogPost['category']; title: string; excerpt: string; content: string; tags: string[] }> = [
  {
    label: 'Template Tips Belajar',
    category: 'Tips & Trik',
    title: 'Judul Tips Belajar yang Spesifik',
    excerpt: 'Ringkas masalah utama siswa dan janji solusi praktis dalam satu kalimat.',
    content: `# Judul Tips Belajar yang Spesifik

Pembuka singkat: jelaskan masalah yang sering dialami siswa dan kenapa topik ini penting.

## 1. Diagnosis Masalah
Tuliskan cara mengenali masalah belajar, contoh gejala, dan data yang perlu dilihat.

## 2. Langkah Praktis
Berikan langkah yang bisa langsung dilakukan siswa hari ini.

## 3. Contoh Penerapan
Masukkan contoh jadwal, cara review soal, atau pola latihan.

## Checklist
- Target harian jelas.
- Ada evaluasi kesalahan.
- Ada waktu istirahat.
- Ada tryout atau latihan terukur.
`,
    tags: ['Tips Belajar', 'Strategi', 'Tryout']
  },
  {
    label: 'Template Literasi',
    category: 'Literasi',
    title: 'Judul Artikel Literasi',
    excerpt: 'Ringkas teknik membaca, memahami teks, atau menjawab soal literasi.',
    content: `# Judul Artikel Literasi

Pembuka: jelaskan jenis bacaan atau kesalahan literasi yang sering muncul.

## Konsep Utama
Jelaskan prinsip membaca aktif, ide pokok, inferensi, atau bukti teks.

## Contoh Pola Soal
Tulis contoh pola pertanyaan dan cara mengeliminasi pilihan jawaban.

## Latihan Mandiri
Berikan latihan kecil yang bisa dilakukan siswa setelah membaca artikel.
`,
    tags: ['Literasi', 'SNBT', 'Membaca']
  },
  {
    label: 'Template Info Seleksi',
    category: 'Info PTN',
    title: 'Judul Info Seleksi Terbaru',
    excerpt: 'Ringkas informasi seleksi, administrasi, jadwal, atau persiapan dokumen.',
    content: `# Judul Info Seleksi Terbaru

Pembuka: jelaskan konteks seleksi dan siapa yang perlu membaca artikel ini.

## Hal yang Perlu Diperhatikan
Uraikan poin penting secara praktis dan mudah dipindai.

## Dokumen atau Data yang Perlu Disiapkan
Tuliskan daftar dokumen, data diri, atau bukti pendukung.

## Rekomendasi Langkah Berikutnya
Berikan saran aksi yang realistis untuk siswa.
`,
    tags: ['Info Seleksi', 'Pendaftaran', 'Persiapan']
  },
  {
    label: 'Template CPNS/SKD',
    category: 'Materi',
    title: 'Judul Strategi SKD CPNS',
    excerpt: 'Ringkas strategi TWK, TIU, TKP, manajemen waktu, atau evaluasi simulasi.',
    content: `# Judul Strategi SKD CPNS

Pembuka: jelaskan tantangan SKD yang ingin diselesaikan.

## TWK
Tuliskan fokus materi, contoh konteks, dan cara review.

## TIU
Jelaskan pola logika/hitungan dan strategi waktu.

## TKP
Jelaskan prinsip memilih jawaban yang konsisten dengan pelayanan publik.

## Simulasi
Berikan pola latihan dengan timer dan cara evaluasi.
`,
    tags: ['CPNS', 'SKD', 'Strategi']
  }
];

type AdminRole = 'Super Admin' | 'Content Manager' | 'Support';

interface AdminMember {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  lastActive: string;
}

type AdminTab = 'overview' | 'users' | 'leads' | 'inquiries' | 'marketing' | 'website' | 'finance' | 'programs' | 'content' | 'questions' | 'testimonials' | 'reports' | 'settings';

export const AdminDashboard: React.FC<{ logout: () => void, setView?: (v: any) => void, programs?: Program[], onProgramsChange?: (programs: Program[]) => void, blogPosts?: BlogPost[], onBlogPostsChange?: (posts: BlogPost[]) => void }> = ({ logout, setView, programs = PROGRAMS, onProgramsChange, blogPosts = BLOG_POSTS, onBlogPostsChange }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [adminRole, setAdminRole] = useState<AdminRole>('Super Admin');
  const [actionMessage, setActionMessage] = useState('');
  const actionMessageTimerRef = useRef<number | null>(null);
  const [isSaveWebsiteConfirmOpen, setIsSaveWebsiteConfirmOpen] = useState(false);
  const [programSearchTerm, setProgramSearchTerm] = useState('');
  const [programCategoryFilter, setProgramCategoryFilter] = useState('All');
  const [financeTransactions, setFinanceTransactions] = useState<any[]>(() => readStorageArray('theprams_demo_transactions'));
  const [paymentProofs, setPaymentProofs] = useState<any[]>(() => readStorageArray('theprams_demo_payment_proofs'));
  const [financeEntries, setFinanceEntries] = useState<FinanceEntry[]>(() => readStorageArray('theprams_demo_finance_entries', defaultFinanceEntries));
  const [financeRealizations, setFinanceRealizations] = useState<FinanceRealization[]>(() => readStorageArray('theprams_demo_finance_realizations'));
  const [assetEntries, setAssetEntries] = useState<AssetEntry[]>(() => readStorageArray('theprams_demo_assets', defaultAssetEntries));
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() => readStorageArray('theprams_demo_audit_events'));
  const [notificationEvents, setNotificationEvents] = useState<NotificationEvent[]>(() => readStorageArray('theprams_demo_notifications'));
  const [marketingCampaigns, setMarketingCampaigns] = useState<MarketingCampaign[]>(() => readStorageArray('theprams_demo_marketing_campaigns', defaultMarketingCampaigns));
  const [editingCampaign, setEditingCampaign] = useState<MarketingCampaign | null>(null);
  const [marketingMetricDetail, setMarketingMetricDetail] = useState<null | { title: string; value: string; description: string; formula: string; rows: any[]; recommendation: string }>(null);
  const [campaignPendingSave, setCampaignPendingSave] = useState<MarketingCampaign | null>(null);
  const [campaignBudgetWarning, setCampaignBudgetWarning] = useState<null | { campaign: MarketingCampaign; available: number; required: number; shortage: number }>(null);
  const [campaignValidationWarning, setCampaignValidationWarning] = useState<null | { campaign: MarketingCampaign; title: string; message: string; actionLabel?: string; action?: 'draft' | 'edit' }>(null);
  const [isCampaignCloseConfirmOpen, setIsCampaignCloseConfirmOpen] = useState(false);
  const [instrumentPreviewCampaign, setInstrumentPreviewCampaign] = useState<MarketingCampaign | null>(null);
  const [instrumentEditorCampaign, setInstrumentEditorCampaign] = useState<MarketingCampaign | null>(null);
  const [landingPageAiPrompt, setLandingPageAiPrompt] = useState('');
  const [landingPageAiChat, setLandingPageAiChat] = useState<Array<{ role: 'agent' | 'user'; text: string }>>([
    { role: 'agent', text: 'Saya bisa membuat landing page otomatis dari instruksi singkat. Contoh: "buat landing page tryout gratis SNBT dengan form WhatsApp dan testimoni".' }
  ]);
  const [landingPageImageSearch, setLandingPageImageSearch] = useState('');
  const [imageSearchResults, setImageSearchResults] = useState<CampaignImageAsset[]>([]);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [landingPageReferenceFiles, setLandingPageReferenceFiles] = useState<AiReferenceFile[]>([]);
  const [financeForm, setFinanceForm] = useState({
    type: 'fixed' as FinanceEntry['type'],
    name: '',
    category: 'Operasional',
    amount: '',
    period: 'Bulanan',
    note: ''
  });
  const [realizationForm, setRealizationForm] = useState({
    financeEntryId: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    note: ''
  });
  const [assetForm, setAssetForm] = useState({
    type: 'fixed_asset' as AssetEntry['type'],
    name: '',
    category: 'Peralatan Kantor',
    acquisitionValue: '',
    currentValue: '',
    acquisitionDate: new Date().toISOString().slice(0, 10),
    usefulLifeMonths: '36',
    note: ''
  });
  const [financeSubView, setFinanceSubView] = useState<'payments' | 'inputs' | 'realization' | 'assets' | 'accounting' | 'reports' | 'audit'>('payments');
  const [financialReportPeriod, setFinancialReportPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [paymentSearchTerm, setPaymentSearchTerm] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('All');
  const [financeMetricDetail, setFinanceMetricDetail] = useState<null | { title: string; rows: any[]; description: string }>(null);
  const [selectedFinanceRecord, setSelectedFinanceRecord] = useState<any | null>(null);
  const marketingChannels = ['Instagram Ads', 'TikTok Ads', 'Google Ads', 'WhatsApp Broadcast', 'Email Campaign', 'Organic Social'];
  const [leadsList, setLeadsList] = useState<Lead[]>(MOCK_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadPendingConvert, setLeadPendingConvert] = useState<Lead | null>(null);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [leadForm, setLeadForm] = useState<Omit<Lead, 'id' | 'createdAt'>>({
    name: '',
    email: '',
    phone: '',
    programOfInterest: programs[0]?.title || 'SNBT Kedokteran',
    source: 'Admin Input',
    status: 'New',
    note: '',
    lastContactedAt: ''
  });
  const [leadNoteDraft, setLeadNoteDraft] = useState('');
  const localLeads: Lead[] = (() => {
    try {
      return JSON.parse(localStorage.getItem(LEAD_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  })();
  const localTransactions = (() => {
    try {
      return JSON.parse(localStorage.getItem('theprams_demo_transactions') || '[]');
    } catch {
      return [];
    }
  })();
  
  // Admin Team Management State
  const [adminTeam, setAdminTeam] = useState<AdminMember[]>([
    { id: '1', name: 'dr. Pramono', email: 'pram@theprams.com', role: 'Super Admin', lastActive: 'Sekarang' },
    { id: '2', name: 'Maya Sari', email: 'maya@theprams.com', role: 'Content Manager', lastActive: '2 jam lalu' },
    { id: '3', name: 'Rudi Hermawan', email: 'help@theprams.com', role: 'Support', lastActive: '1 hari lalu' },
  ]);

  // Tab permissions mapping
  const rolePermissions: Record<AdminRole, AdminTab[]> = {
    'Super Admin': ['overview', 'users', 'leads', 'inquiries', 'marketing', 'website', 'finance', 'programs', 'content', 'questions', 'testimonials', 'reports', 'settings'],
    'Content Manager': ['overview', 'programs', 'content', 'questions', 'testimonials', 'website'],
    'Support': ['overview', 'users', 'leads', 'inquiries', 'settings', 'finance']
  };

  const isTabAllowed = (tab: AdminTab) => rolePermissions[adminRole].includes(tab);

  const notify = (message: string) => {
    if (actionMessageTimerRef.current) {
      window.clearTimeout(actionMessageTimerRef.current);
    }
    setActionMessage(message);
    actionMessageTimerRef.current = window.setTimeout(() => {
      setActionMessage('');
      actionMessageTimerRef.current = null;
    }, 2600);
  };

  useEffect(() => {
    return () => {
      if (actionMessageTimerRef.current) {
        window.clearTimeout(actionMessageTimerRef.current);
      }
    };
  }, []);

  const recordAudit = (module: string, action: string, detail: string) => {
    const event: AuditEvent = {
      id: `audit-${Date.now()}`,
      module,
      action,
      detail,
      actor: adminRole,
      createdAt: new Date().toLocaleString('id-ID')
    };
    const nextEvents = [event, ...auditEvents].slice(0, 100);
    setAuditEvents(nextEvents);
    localStorage.setItem('theprams_demo_audit_events', JSON.stringify(nextEvents));
  };

  const queueNotification = (channel: NotificationEvent['channel'], recipient: string, subject: string, message: string) => {
    const event: NotificationEvent = {
      id: `notif-${Date.now()}`,
      channel,
      recipient,
      subject,
      message,
      status: 'Queued',
      createdAt: new Date().toLocaleString('id-ID')
    };
    const nextEvents = [event, ...notificationEvents].slice(0, 100);
    setNotificationEvents(nextEvents);
    localStorage.setItem('theprams_demo_notifications', JSON.stringify(nextEvents));
  };

  const downloadTextFile = (filename: string, content: string, mime = 'text/csv') => {
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    notify(`${filename} berhasil dibuat.`);
  };

  const refreshFinanceCenter = () => {
    setFinanceTransactions(readStorageArray('theprams_demo_transactions'));
    setPaymentProofs(readStorageArray('theprams_demo_payment_proofs'));
    setFinanceEntries(readStorageArray('theprams_demo_finance_entries', defaultFinanceEntries));
    setFinanceRealizations(readStorageArray('theprams_demo_finance_realizations'));
    setAssetEntries(readStorageArray('theprams_demo_assets', defaultAssetEntries));
    notify('Financial Center disinkronkan dengan pembayaran dan dokumen terbaru.');
  };

  const saveFinanceEntries = (nextEntries: FinanceEntry[]) => {
    setFinanceEntries(nextEntries);
    localStorage.setItem('theprams_demo_finance_entries', JSON.stringify(nextEntries));
  };

  const addFinanceEntry = () => {
    if (!financeForm.name.trim() || !financeForm.category.trim() || parseRupiah(financeForm.amount) <= 0) {
      notify('Nama, kategori, dan nominal wajib diisi.');
      return;
    }
    const nextEntry: FinanceEntry = {
      id: `finance-${Date.now()}`,
      type: financeForm.type,
      name: financeForm.name.trim(),
      category: financeForm.category.trim(),
      amount: parseRupiah(financeForm.amount),
      period: financeForm.period.trim() || 'Bulanan',
      note: financeForm.note.trim(),
      createdAt: new Date().toISOString().slice(0, 10)
    };
    saveFinanceEntries([nextEntry, ...financeEntries]);
    setFinanceForm({ type: 'fixed', name: '', category: 'Operasional', amount: '', period: 'Bulanan', note: '' });
    recordAudit('Financial Center', 'Create Finance Plan', `${nextEntry.name} - ${formatRupiah(nextEntry.amount)}`);
    notify('Input keuangan berhasil ditambahkan.');
  };

  const saveMarketingCampaigns = (nextCampaigns: MarketingCampaign[]) => {
    setMarketingCampaigns(nextCampaigns);
    localStorage.setItem('theprams_demo_marketing_campaigns', JSON.stringify(nextCampaigns));
  };

  const closeCampaignEditor = () => {
    setEditingCampaign(null);
    setCampaignPendingSave(null);
    setCampaignBudgetWarning(null);
    setCampaignValidationWarning(null);
    setIsCampaignCloseConfirmOpen(false);
    setInstrumentPreviewCampaign(null);
    setInstrumentEditorCampaign(null);
  };

  const requestCloseCampaignEditor = () => {
    setIsCampaignCloseConfirmOpen(true);
  };

  const closeInstrumentEditor = () => {
    setInstrumentEditorCampaign(null);
  };

  const hydrateCampaign = (campaign: MarketingCampaign): MarketingCampaign => ({
    ...campaign,
    instrumentType: campaign.instrumentType || 'Landing Page',
    instrumentName: campaign.instrumentName || campaign.landingPageName || campaign.name,
    instrumentOwner: campaign.instrumentOwner || 'The Prams',
    instrumentFormat: campaign.instrumentFormat || 'Campaign asset',
    instrumentBrief: campaign.instrumentBrief || campaign.headline || campaign.notes || '',
    instrumentPreviewUrl: campaign.instrumentPreviewUrl || campaign.landingPageUrl || '',
    instruments: campaign.instruments?.length ? campaign.instruments : [{
      id: `instrument-${campaign.id}`,
      type: campaign.instrumentType || 'Landing Page',
      name: campaign.instrumentName || campaign.landingPageName || campaign.name,
      owner: campaign.instrumentOwner || 'The Prams',
      format: campaign.instrumentFormat || 'Campaign asset',
      brief: campaign.instrumentBrief || campaign.headline || campaign.notes || '',
      previewUrl: campaign.instrumentPreviewUrl || campaign.landingPageUrl || '',
      status: campaign.status === 'Active' ? 'Ready' : 'Draft',
      landingPageSections: [],
      aiNotes: [],
      createdAt: campaign.createdAt
    }],
    activeInstrumentId: campaign.activeInstrumentId || campaign.instruments?.[0]?.id || `instrument-${campaign.id}`,
    imageAssets: campaign.imageAssets || []
  });

  const getActiveInstrument = (campaign: MarketingCampaign) => {
    const hydrated = hydrateCampaign(campaign);
    return hydrated.instruments?.find((item) => item.id === hydrated.activeInstrumentId) || hydrated.instruments?.[0];
  };

  const syncCampaignFromInstrument = (campaign: MarketingCampaign, instrument: MarketingInstrument): MarketingCampaign => ({
    ...campaign,
    activeInstrumentId: instrument.id,
    instrumentType: instrument.type,
    instrumentName: instrument.name,
    instrumentOwner: instrument.owner,
    instrumentFormat: instrument.format,
    instrumentBrief: instrument.brief,
    instrumentPreviewUrl: instrument.previewUrl,
    landingPageName: instrument.type === 'Landing Page' ? instrument.name : campaign.landingPageName,
    landingPageUrl: instrument.type === 'Landing Page' ? instrument.previewUrl : campaign.landingPageUrl,
    imageAssets: hydrateCampaign(campaign).imageAssets || [],
    instruments: (hydrateCampaign(campaign).instruments || []).map((item) => item.id === instrument.id ? instrument : item)
  });

  const openNewCampaign = () => {
    const programName = programsList[0]?.title || 'SNBT Kedokteran';
    const instrumentId = `instrument-${Date.now()}`;
    setEditingCampaign({
      id: `campaign-${Date.now()}`,
      name: 'Campaign Baru',
      program: programName,
      goal: 'Lead Generation',
      status: 'Draft',
      audience: 'Siswa kelas 12 dan gap year',
      location: 'Nasional',
      channels: ['Instagram Ads', 'WhatsApp Broadcast'],
      instrumentType: 'Landing Page',
      instrumentName: `${programName} Lead Page`,
      instrumentOwner: 'Website / The Prams',
      instrumentFormat: 'Landing page form lead',
      instrumentBrief: `Instrumen utama untuk mengumpulkan lead ${programName} dari iklan dan konten organik.`,
      instrumentPreviewUrl: `/campaign/${programName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      instruments: [{
        id: instrumentId,
        type: 'Landing Page',
        name: `${programName} Lead Page`,
        owner: 'Website / The Prams',
        format: 'Landing page form lead',
        brief: `Instrumen utama untuk mengumpulkan lead ${programName} dari iklan dan konten organik.`,
        previewUrl: `/campaign/${programName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        status: 'Draft',
        landingPageSections: [],
        aiNotes: [],
        createdAt: new Date().toISOString().slice(0, 10)
      }],
      activeInstrumentId: instrumentId,
      imageAssets: [],
      landingPageName: `${programName} Campaign`,
      landingPageUrl: `/campaign/${programName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      headline: `Daftar ${programName} bersama The Prams`,
      cta: 'Daftar Sekarang',
      budget: 0,
      dailyBudget: 0,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      targetLeads: 100,
      targetRoi: 3,
      views: 0,
      clicks: 0,
      leads: 0,
      registrations: 0,
      revenue: 0,
      notes: '',
      createdAt: new Date().toISOString().slice(0, 10)
    });
  };

  const getMarketingBudgetStatus = (campaign: MarketingCampaign) => {
    const isMarketingCategory = (category = '') => {
      const text = category.toLowerCase();
      return text.includes('marketing') || text.includes('digital');
    };
    const marketingBudgetEntries = financeEntries.filter((entry) => entry.type === 'budget' && isMarketingCategory(entry.category));
    const budgetPool = marketingBudgetEntries.length
      ? marketingBudgetEntries.reduce((sum, entry) => sum + entry.amount, 0)
      : financeEntries.filter((entry) => entry.type === 'budget').reduce((sum, entry) => sum + entry.amount, 0);
    const realizedBudget = financeRealizations
      .filter((row) => {
        const source = financeEntries.find((entry) => entry.id === row.financeEntryId);
        return source?.type === 'budget' && (!marketingBudgetEntries.length || isMarketingCategory(source.category));
      })
      .reduce((sum, row) => sum + row.amount, 0);
    const committedCampaignBudget = marketingCampaigns
      .filter((item) => item.id !== campaign.id && item.status !== 'Completed')
      .reduce((sum, item) => sum + item.budget, 0);
    const available = Math.max(0, budgetPool - realizedBudget - committedCampaignBudget);
    const remainingAfterCampaign = available - campaign.budget;
    return {
      budgetPool,
      realizedBudget,
      committedCampaignBudget,
      available,
      remainingAfterCampaign,
      isEnough: remainingAfterCampaign >= 0,
      sourceLabel: marketingBudgetEntries.length ? 'Anggaran Marketing / Digital Marketing' : 'Total Anggaran Financial Center'
    };
  };

  const getInstrumentPreset = (type: MarketingCampaign['instrumentType']) => {
    const presets: Record<MarketingCampaign['instrumentType'], { owner: string; format: string; brief: string; previewLabel: string; fields: string[] }> = {
      'Landing Page': {
        owner: 'Website / The Prams',
        format: 'Hero + benefit + testimoni + form lead',
        brief: 'Halaman tujuan setelah user klik iklan/konten. Fokus pada satu CTA, form sederhana, social proof, dan tracking UTM.',
        previewLabel: 'Preview halaman',
        fields: ['URL landing page', 'headline', 'CTA', 'form lead', 'UTM source']
      },
      'Paid Ad Creative': {
        owner: 'Ads Manager',
        format: 'Headline + primary text + visual/video + final URL',
        brief: 'Materi iklan berbayar untuk Meta/TikTok/Google. Perlu copy, visual, audience, CTA, dan final URL ke landing page.',
        previewLabel: 'Preview creative ads',
        fields: ['platform ads', 'format creative', 'primary text', 'headline', 'destination URL']
      },
      'Organic Content': {
        owner: 'Content Library / Social Media',
        format: 'Reels, carousel, story, live/Q&A',
        brief: 'Konten non-iklan untuk membangun awareness dan lead. Perlu kalender konten, hook, caption, CTA, dan link campaign.',
        previewLabel: 'Preview konten',
        fields: ['format konten', 'hook', 'caption', 'jadwal posting', 'CTA']
      },
      'Social Account': {
        owner: 'Instagram / TikTok / YouTube / LinkedIn',
        format: 'Akun/channel distribusi',
        brief: 'Akun sosial yang menjadi kanal distribusi campaign. Perlu handle akun, bio/link, audience, dan tracking source.',
        previewLabel: 'Preview akun/channel',
        fields: ['nama akun', 'handle', 'bio/link', 'platform', 'tracking source']
      },
      'Broadcast / Nurture': {
        owner: 'WhatsApp / Email',
        format: 'Segment list + message sequence',
        brief: 'Pesan follow-up untuk lead. Perlu segmentasi, template pesan, jadwal kirim, dan CTA ke pendaftaran/konsultasi.',
        previewLabel: 'Preview pesan',
        fields: ['segment lead', 'template pesan', 'jadwal follow-up', 'CTA', 'owner admin']
      }
    };
    return presets[type];
  };

  const applyInstrumentType = (type: MarketingCampaign['instrumentType']) => {
    if (!editingCampaign) return;
    const preset = getInstrumentPreset(type);
    const instrumentId = `instrument-${Date.now()}`;
    const nextInstrument: MarketingInstrument = {
      id: instrumentId,
      type,
      name: `${editingCampaign.program} ${type}`,
      owner: preset.owner,
      format: preset.format,
      brief: preset.brief,
      previewUrl: editingCampaign.landingPageUrl,
      status: 'Draft',
      landingPageSections: type === 'Landing Page' ? [] : undefined,
      aiNotes: type === 'Landing Page' ? [] : undefined,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setEditingCampaign({
      ...editingCampaign,
      instrumentType: type,
      instrumentOwner: nextInstrument.owner,
      instrumentFormat: nextInstrument.format,
      instrumentBrief: nextInstrument.brief,
      instrumentName: nextInstrument.name,
      instrumentPreviewUrl: nextInstrument.previewUrl,
      instruments: [...(hydrateCampaign(editingCampaign).instruments || []), nextInstrument],
      activeInstrumentId: instrumentId
    });
  };

  const saveInstrumentEditor = () => {
    if (!instrumentEditorCampaign) return;
    setEditingCampaign(instrumentEditorCampaign);
    setInstrumentEditorCampaign(null);
    notify('Detail instrumen diterapkan ke campaign editor.');
  };

  const selectCampaignInstrument = (instrument: MarketingInstrument) => {
    if (!editingCampaign) return;
    setEditingCampaign(syncCampaignFromInstrument(editingCampaign, instrument));
  };

  const updateActiveInstrument = (patch: Partial<MarketingInstrument>) => {
    if (!editingCampaign) return;
    const active = getActiveInstrument(editingCampaign);
    if (!active) return;
    const nextInstrument = { ...active, ...patch };
    setEditingCampaign(syncCampaignFromInstrument(editingCampaign, nextInstrument));
  };

  const createLandingPageDesign = (mode: 'blank' | 'template' | 'ai') => {
    if (!editingCampaign) return;
    const active = getActiveInstrument(editingCampaign);
    if (!active) return;
    const sections = mode === 'blank'
      ? [{ id: `lp-hero-${Date.now()}`, type: 'Hero' as const, title: editingCampaign.headline, body: 'Tulis copy utama landing page di sini.', cta: editingCampaign.cta, visible: true }]
      : buildLandingPageTemplate(editingCampaign);
    const aiNotes = mode === 'ai'
      ? [
        'AI menyusun struktur landing page berdasarkan goal, audience, dan program.',
        'Prioritas: headline spesifik, CTA jelas, form singkat, social proof sebelum form.',
        'Tambahkan tracking UTM untuk setiap channel campaign.'
      ]
      : active.aiNotes || [];
    updateActiveInstrument({
      landingPageSections: sections,
      aiNotes,
      status: 'Draft',
      brief: mode === 'ai' ? `Landing page AI draft untuk ${editingCampaign.program}: fokus lead generation dan conversion.` : active.brief
    });
    notify(mode === 'ai' ? 'AI Agent membuat draft landing page.' : 'Landing page design dibuat.');
  };

  const updateLandingPageSection = (sectionId: string, patch: Partial<LandingPageSection>) => {
    const active = editingCampaign ? getActiveInstrument(editingCampaign) : null;
    if (!active) return;
    updateActiveInstrument({
      landingPageSections: (active.landingPageSections || []).map((section) => section.id === sectionId ? { ...section, ...patch } : section)
    });
  };

  const addLandingPageSection = (type: LandingPageSection['type']) => {
    const active = editingCampaign ? getActiveInstrument(editingCampaign) : null;
    if (!active) return;
    const nextSection: LandingPageSection = {
      id: `lp-section-${Date.now()}`,
      type,
      title: type,
      body: `Tulis konten ${type.toLowerCase()} di sini.`,
      cta: type === 'CTA' || type === 'Lead Form' ? editingCampaign?.cta : undefined,
      visible: true
    };
    updateActiveInstrument({ landingPageSections: [...(active.landingPageSections || []), nextSection] });
  };

  const analyzeLandingPageWithAi = () => {
    const active = editingCampaign ? getActiveInstrument(editingCampaign) : null;
    if (!active) return;
    const sections = active.landingPageSections || [];
    const notes = [
      sections.some((section) => section.type === 'Hero') ? 'Hero sudah ada. Pastikan headline menyebut hasil yang spesifik.' : 'Tambahkan Hero section agar value proposition langsung jelas.',
      sections.some((section) => section.type === 'Social Proof') ? 'Social proof sudah ada sebelum keputusan pendaftaran.' : 'Tambahkan testimoni atau bukti hasil sebelum form.',
      sections.some((section) => section.type === 'Lead Form') ? 'Lead form sudah ada. Idealnya hanya nama, WhatsApp, kelas/status, dan program minat.' : 'Tambahkan Lead Form untuk menangkap prospek.',
      sections.length >= 5 ? 'Struktur landing page cukup lengkap untuk draft awal.' : 'Tambahkan minimal 5 section agar offer lebih meyakinkan.'
    ];
    updateActiveInstrument({ aiNotes: notes });
    notify('AI Agent menganalisis landing page.');
  };

  const updateInstrumentEditorActive = (patch: Partial<MarketingInstrument>) => {
    if (!instrumentEditorCampaign) return;
    const active = getActiveInstrument(instrumentEditorCampaign);
    if (!active) return;
    const nextInstrument = { ...active, ...patch };
    setInstrumentEditorCampaign(syncCampaignFromInstrument(instrumentEditorCampaign, nextInstrument));
  };

  const createLandingPageEditorDesign = (mode: 'blank' | 'template', templateId = 'lead-form') => {
    if (!instrumentEditorCampaign) return;
    const active = getActiveInstrument(instrumentEditorCampaign);
    if (!active) return;
    const sections = mode === 'blank'
      ? [{ id: `lp-hero-${Date.now()}`, type: 'Hero' as const, title: instrumentEditorCampaign.headline, body: 'Tulis copy utama landing page di sini.', cta: instrumentEditorCampaign.cta, visible: true }]
      : buildLandingPageTemplateByKind(instrumentEditorCampaign, templateId);
    const aiNotes = active.aiNotes || [];
    updateInstrumentEditorActive({ landingPageSections: sections, aiNotes, status: 'Draft' });
    notify('Landing page design dibuat di editor.');
  };

  const updateLandingPageEditorSection = (sectionId: string, patch: Partial<LandingPageSection>) => {
    const active = instrumentEditorCampaign ? getActiveInstrument(instrumentEditorCampaign) : null;
    if (!active) return;
    updateInstrumentEditorActive({
      landingPageSections: (active.landingPageSections || []).map((section) => section.id === sectionId ? { ...section, ...patch } : section)
    });
  };

  const addLandingPageEditorSection = (type: LandingPageSection['type']) => {
    const active = instrumentEditorCampaign ? getActiveInstrument(instrumentEditorCampaign) : null;
    if (!active) return;
    const nextSection: LandingPageSection = {
      id: `lp-section-${Date.now()}`,
      type,
      title: type,
      body: `Tulis konten ${type.toLowerCase()} di sini.`,
      cta: type === 'CTA' || type === 'Lead Form' ? instrumentEditorCampaign?.cta : undefined,
      visible: true
    };
    updateInstrumentEditorActive({ landingPageSections: [...(active.landingPageSections || []), nextSection] });
  };

  const moveLandingPageEditorSection = (sectionId: string, direction: -1 | 1) => {
    const active = instrumentEditorCampaign ? getActiveInstrument(instrumentEditorCampaign) : null;
    const sections = [...(active?.landingPageSections || [])];
    const index = sections.findIndex((section) => section.id === sectionId);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= sections.length) return;
    [sections[index], sections[nextIndex]] = [sections[nextIndex], sections[index]];
    updateInstrumentEditorActive({ landingPageSections: sections });
  };

  const deleteLandingPageEditorSection = (sectionId: string) => {
    const active = instrumentEditorCampaign ? getActiveInstrument(instrumentEditorCampaign) : null;
    if (!active) return;
    updateInstrumentEditorActive({ landingPageSections: (active.landingPageSections || []).filter((section) => section.id !== sectionId) });
  };

  const analyzeLandingPageEditorWithAi = () => {
    const active = instrumentEditorCampaign ? getActiveInstrument(instrumentEditorCampaign) : null;
    if (!active) return;
    const sections = active.landingPageSections || [];
    const notes = [
      sections.some((section) => section.type === 'Hero') ? 'Hero tersedia. Pastikan value proposition langsung terlihat di viewport pertama.' : 'Hero section belum ada.',
      sections.some((section) => section.type === 'Social Proof') ? 'Social proof tersedia. Letakkan sebelum form agar trust meningkat.' : 'Tambahkan Social Proof sebelum Lead Form.',
      sections.some((section) => section.type === 'Lead Form') ? 'Lead Form tersedia. Jaga field tetap singkat.' : 'Lead Form belum ada, landing page belum siap capture lead.',
      sections.some((section) => section.type === 'FAQ') ? 'FAQ tersedia untuk mengurangi friksi keputusan.' : 'Tambahkan FAQ untuk menjawab keberatan umum.',
      sections.length >= 6 ? 'Struktur cukup lengkap untuk draft publish.' : 'Tambahkan section offer, proof, dan FAQ agar lebih lengkap.'
    ];
    updateInstrumentEditorActive({ aiNotes: notes });
    notify('AI Agent menganalisis landing page di editor.');
  };

  const runLandingPageAiAgent = () => {
    if (!instrumentEditorCampaign || !landingPageAiPrompt.trim()) return;
    const prompt = landingPageAiPrompt.trim();
    const imageDatabase = hydrateCampaign(instrumentEditorCampaign).imageAssets || [];
    const referenceSummary = landingPageReferenceFiles.length || imageDatabase.length
      ? ` Referensi yang dibaca: ${[
        ...landingPageReferenceFiles.map((file) => `${file.name}${file.text ? ' (isi teks tersedia)' : file.preview ? ' (gambar tersedia)' : ' (metadata tersedia)'}`),
        ...imageDatabase.map((image) => `${image.name} dari database gambar`)
      ].join(', ')}.`
      : '';
    const lower = prompt.toLowerCase();
    const templateId = lower.includes('webinar') || lower.includes('event') ? 'webinar-event'
      : lower.includes('konsultasi') || lower.includes('booking') ? 'consultation'
      : lower.includes('waitlist') || lower.includes('prelaunch') || lower.includes('pre-launch') ? 'waitlist'
      : lower.includes('download') || lower.includes('ebook') || lower.includes('materi gratis') ? 'resource-download'
      : lower.includes('paket') || lower.includes('harga') || lower.includes('program') ? 'course-offer'
      : 'lead-form';
    const sections = buildLandingPageTemplateByKind(instrumentEditorCampaign, templateId).map((section) => {
      if (section.type === 'Hero') {
        return {
          ...section,
          title: prompt.length > 18 ? prompt.replace(/^buat(kan)?\s*/i, '').slice(0, 90) : section.title,
          body: `Landing page ini dibuat dari instruksi: "${prompt}". Fokus pada ${instrumentEditorCampaign.program}, target ${instrumentEditorCampaign.audience}, dan CTA ${instrumentEditorCampaign.cta || 'Daftar Sekarang'}.${referenceSummary}`
        };
      }
      return section;
    });
    const notes = [
      `AI Agent memilih template: ${landingPageTemplateOptions.find((item) => item.id === templateId)?.name || 'Lead Form'}.`,
      'Struktur otomatis sudah dibuat. Review copy, bukti/testimoni, dan field form sebelum publish.',
      'Gunakan panel Properties untuk menyesuaikan setiap section.'
    ];
    updateInstrumentEditorActive({ landingPageSections: sections, aiNotes: notes, status: 'Draft' });
    setLandingPageAiChat((current) => [
      ...current,
      { role: 'user', text: prompt },
      { role: 'agent', text: `Saya membuat landing page otomatis dengan template ${landingPageTemplateOptions.find((item) => item.id === templateId)?.name || 'Lead Form'}. Silakan cek canvas dan edit section di panel kanan.` }
    ]);
    setLandingPageAiPrompt('');
    notify('AI Agent membuat landing page dari chat.');
  };

  const openInternetImageSearch = () => {
    const keyword = landingPageImageSearch.trim() || instrumentEditorCampaign?.program || 'education students';
    const results = Array.from({ length: 12 }).map((_, index) => ({
      id: `internet-${Date.now()}-${index}`,
      name: `${keyword} ${index + 1}`,
      source: 'Internet' as const,
      url: `https://source.unsplash.com/1200x800/?${encodeURIComponent(`${keyword} education students ${index}`)}`,
      keyword,
      createdAt: new Date().toISOString()
    }));
    setImageSearchResults(results);
    setIsImageSearchOpen(true);
    notify(`Pilihan gambar internet untuk "${keyword}" dibuka.`);
  };

  const addImageAssetToDatabase = (asset: CampaignImageAsset) => {
    if (!instrumentEditorCampaign) return;
    const hydrated = hydrateCampaign(instrumentEditorCampaign);
    const nextAssets = [{ ...asset, id: `image-${Date.now()}` }, ...(hydrated.imageAssets || [])];
    setInstrumentEditorCampaign({ ...instrumentEditorCampaign, imageAssets: nextAssets });
    notify('Gambar ditambahkan ke database gambar campaign.');
  };

  const applyImageAssetToSection = (sectionId: string, asset: CampaignImageAsset) => {
    updateLandingPageEditorSection(sectionId, {
      imageUrl: asset.url,
      imageLayout: 'Right',
      imageSize: 'Medium',
      imageAlign: 'Center'
    });
    notify('Gambar dari database diterapkan ke section.');
  };

  const removeImageAssetFromDatabase = (assetId: string) => {
    if (!instrumentEditorCampaign) return;
    const hydrated = hydrateCampaign(instrumentEditorCampaign);
    const removedAsset = (hydrated.imageAssets || []).find((asset) => asset.id === assetId);
    const nextAssets = (hydrated.imageAssets || []).filter((asset) => asset.id !== assetId);
    const active = getActiveInstrument(instrumentEditorCampaign);
    const nextSections = removedAsset && active?.landingPageSections
      ? active.landingPageSections.map((section) => section.imageUrl === removedAsset.url ? {
        ...section,
        imageUrl: '',
        imageLayout: 'None' as const,
        imageSize: 'Medium' as const,
        imageAlign: 'Center' as const
      } : section)
      : active?.landingPageSections;
    const nextCampaign = active && nextSections
      ? syncCampaignFromInstrument({ ...instrumentEditorCampaign, imageAssets: nextAssets }, { ...active, landingPageSections: nextSections })
      : { ...instrumentEditorCampaign, imageAssets: nextAssets };
    setInstrumentEditorCampaign(nextCampaign);
    if (removedAsset) {
      setLandingPageReferenceFiles((current) => current.filter((file) => file.preview !== removedAsset.url && file.id !== `db-${removedAsset.id}`));
    }
    notify('Gambar dihapus dari database gambar campaign.');
  };

  const clearSectionImage = (sectionId: string) => {
    updateLandingPageEditorSection(sectionId, {
      imageUrl: '',
      imageLayout: 'None',
      imageSize: 'Medium',
      imageAlign: 'Center'
    });
    notify('Gambar dilepas dari section.');
  };

  const removeAiReferenceFile = (fileId: string) => {
    setLandingPageReferenceFiles((current) => current.filter((file) => file.id !== fileId));
    notify('Referensi AI dihapus.');
  };

  const uploadSectionImage = (sectionId: string, file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const asset: CampaignImageAsset = {
        id: `upload-${Date.now()}`,
        name: file.name,
        source: 'Upload',
        url: String(reader.result || ''),
        createdAt: new Date().toISOString()
      };
      addImageAssetToDatabase(asset);
      applyImageAssetToSection(sectionId, asset);
    };
    reader.readAsDataURL(file);
  };

  const readAiReferenceFiles = (files: FileList | null) => {
    if (!files?.length) return;
    Array.from(files).forEach((file) => {
      const id = `ref-${Date.now()}-${file.name}`;
      const base: AiReferenceFile = { id, name: file.name, type: file.type || 'unknown', size: file.size };
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setLandingPageReferenceFiles((current) => [...current, { ...base, preview: String(reader.result || '') }]);
          addImageAssetToDatabase({
            id: `ref-image-${Date.now()}`,
            name: file.name,
            source: 'Reference',
            url: String(reader.result || ''),
            keyword: 'AI reference',
            createdAt: new Date().toISOString()
          });
        };
        reader.readAsDataURL(file);
      } else if (/\.(txt|csv|json|md)$/i.test(file.name) || file.type.includes('text')) {
        const reader = new FileReader();
        reader.onload = () => {
          setLandingPageReferenceFiles((current) => [...current, { ...base, text: String(reader.result || '').slice(0, 6000) }]);
        };
        reader.readAsText(file);
      } else {
        setLandingPageReferenceFiles((current) => [...current, base]);
      }
    });
    notify('File referensi ditambahkan ke AI Agent.');
  };

  const addImageAssetAsAiReference = (asset: CampaignImageAsset) => {
    const exists = landingPageReferenceFiles.some((file) => file.id === `db-${asset.id}`);
    if (exists) {
      notify('Gambar database sudah ada di referensi AI.');
      return;
    }
    setLandingPageReferenceFiles((current) => [
      ...current,
      {
        id: `db-${asset.id}`,
        name: asset.name,
        type: `database/${asset.source.toLowerCase()}`,
        size: 0,
        preview: asset.url,
        text: `Gambar dari database campaign. Source: ${asset.source}. Keyword: ${asset.keyword || '-'}`
      }
    ]);
    notify('Gambar dari database ditambahkan ke referensi AI.');
  };

  const saveCampaign = (campaign: MarketingCampaign) => {
    if (!campaign.name.trim() || !campaign.program.trim() || !campaign.landingPageUrl.trim()) {
      notify('Nama campaign, program, dan URL landing page wajib diisi.');
      return;
    }
    const normalized: MarketingCampaign = {
      ...campaign,
      name: campaign.name.trim(),
      program: campaign.program.trim(),
      audience: campaign.audience.trim(),
      location: campaign.location.trim() || 'Nasional',
      instrumentType: campaign.instrumentType || 'Landing Page',
      instrumentName: campaign.instrumentName?.trim() || campaign.landingPageName.trim() || campaign.name.trim(),
      instrumentOwner: campaign.instrumentOwner?.trim() || 'The Prams',
      instrumentFormat: campaign.instrumentFormat?.trim() || 'Campaign asset',
      instrumentBrief: campaign.instrumentBrief?.trim() || campaign.headline.trim(),
      instrumentPreviewUrl: campaign.instrumentPreviewUrl?.trim() || campaign.landingPageUrl.trim(),
      instruments: (hydrateCampaign(campaign).instruments || []).map((instrument) => instrument.id === campaign.activeInstrumentId ? {
        ...instrument,
        type: campaign.instrumentType,
        name: campaign.instrumentName?.trim() || instrument.name,
        owner: campaign.instrumentOwner?.trim() || instrument.owner,
        format: campaign.instrumentFormat?.trim() || instrument.format,
        brief: campaign.instrumentBrief?.trim() || instrument.brief,
        previewUrl: campaign.instrumentPreviewUrl?.trim() || instrument.previewUrl
      } : instrument),
      landingPageName: campaign.landingPageName.trim() || campaign.name.trim(),
      landingPageUrl: campaign.landingPageUrl.trim().startsWith('/') ? campaign.landingPageUrl.trim() : `/${campaign.landingPageUrl.trim()}`,
      headline: campaign.headline.trim(),
      cta: campaign.cta.trim() || 'Daftar Sekarang',
      channels: campaign.channels.length ? campaign.channels : ['Organic Social'],
      budget: Number(campaign.budget) || 0,
      dailyBudget: Number(campaign.dailyBudget) || 0,
      targetLeads: Number(campaign.targetLeads) || 0,
      targetRoi: Number(campaign.targetRoi) || 0,
      views: Number(campaign.views) || 0,
      clicks: Number(campaign.clicks) || 0,
      leads: Number(campaign.leads) || 0,
      registrations: Number(campaign.registrations) || 0,
      revenue: Number(campaign.revenue) || 0,
      notes: campaign.notes.trim()
    };
    const exists = marketingCampaigns.some((item) => item.id === normalized.id);
    const nextCampaigns = exists
      ? marketingCampaigns.map((item) => item.id === normalized.id ? normalized : item)
      : [normalized, ...marketingCampaigns];
    saveMarketingCampaigns(nextCampaigns);
    closeCampaignEditor();
    recordAudit('Digital Marketing', exists ? 'Update Campaign' : 'Create Campaign', `${normalized.name} - ${normalized.status}`);
    notify(exists ? 'Campaign berhasil diperbarui.' : 'Campaign baru disimpan sebagai draft.');
  };

  const requestSaveCampaign = (campaign: MarketingCampaign) => {
    if (!campaign.name.trim() || !campaign.program.trim() || !campaign.landingPageUrl.trim()) {
      notify('Nama campaign, program, dan URL landing page wajib diisi.');
      return;
    }
    if (campaign.budget <= 0) {
      setCampaignValidationWarning({
        campaign,
        title: 'Budget Campaign Masih Nol',
        message: campaign.status === 'Draft'
          ? 'Campaign draft boleh disimpan, tetapi budget masih Rp 0 sehingga belum siap dipublish atau dianalisis ROI-nya.'
          : 'Campaign aktif tidak bisa disimpan dengan budget Rp 0. Isi budget terlebih dahulu atau simpan sebagai Draft.',
        actionLabel: campaign.status === 'Draft' ? 'Tetap Simpan Draft' : 'Simpan Sebagai Draft',
        action: 'draft'
      });
      notify('Budget campaign masih Rp 0.');
      return;
    }
    if (campaign.dailyBudget > 0 && campaign.budget < campaign.dailyBudget) {
      setCampaignValidationWarning({
        campaign,
        title: 'Budget Harian Melebihi Total Budget',
        message: `Total budget ${formatRupiah(campaign.budget)} lebih kecil dari budget harian ${formatRupiah(campaign.dailyBudget)}. Naikkan total budget atau turunkan budget harian sebelum menyimpan campaign.`,
        actionLabel: 'Kembali Edit',
        action: 'edit'
      });
      notify('Budget harian lebih besar dari total budget.');
      return;
    }
    const budgetStatus = getMarketingBudgetStatus(campaign);
    if (campaign.budget > budgetStatus.available) {
      setCampaignPendingSave(null);
      setCampaignBudgetWarning({
        campaign,
        available: budgetStatus.available,
        required: campaign.budget,
        shortage: Math.max(0, campaign.budget - budgetStatus.available)
      });
      notify('Anggaran campaign belum memenuhi. Pilih tambah anggaran atau simpan sebagai draft.');
      return;
    }
    setCampaignPendingSave(campaign);
  };

  const saveCampaignAsDraftFromWarning = () => {
    if (!campaignBudgetWarning) return;
    const draftCampaign: MarketingCampaign = { ...campaignBudgetWarning.campaign, status: 'Draft' };
    setCampaignBudgetWarning(null);
    setCampaignPendingSave(draftCampaign);
  };

  const handleCampaignValidationAction = () => {
    if (!campaignValidationWarning) return;
    if (campaignValidationWarning.action === 'draft') {
      const draftCampaign: MarketingCampaign = { ...campaignValidationWarning.campaign, status: 'Draft' };
      setCampaignValidationWarning(null);
      setCampaignPendingSave(draftCampaign);
      return;
    }
    setCampaignValidationWarning(null);
  };

  const goToFinancialBudget = () => {
    const campaign = campaignBudgetWarning?.campaign;
    closeCampaignEditor();
    setActiveTab('finance');
    setFinanceSubView('inputs');
    setFinanceForm({
      type: 'budget',
      name: campaign ? `Tambahan Anggaran ${campaign.name}` : 'Tambahan Anggaran Marketing',
      category: 'Digital Marketing',
      amount: campaign ? String(Math.max(0, campaign.budget - getMarketingBudgetStatus(campaign).available)) : '',
      period: 'Campaign berjalan',
      note: campaign ? `Tambahan budget untuk campaign ${campaign.name}` : 'Tambahan budget campaign digital marketing'
    });
    notify('Dialihkan ke Financial Center untuk menambah Anggaran Digital Marketing.');
  };

  const updateCampaignStatus = (campaign: MarketingCampaign, status: MarketingCampaign['status']) => {
    const nextCampaign = { ...campaign, status };
    saveMarketingCampaigns(marketingCampaigns.map((item) => item.id === campaign.id ? nextCampaign : item));
    recordAudit('Digital Marketing', 'Update Campaign Status', `${campaign.name} -> ${status}`);
    notify(`Campaign ${campaign.name} sekarang ${status}.`);
  };

  const duplicateCampaign = (campaign: MarketingCampaign) => {
    const duplicated: MarketingCampaign = {
      ...campaign,
      id: `campaign-${Date.now()}`,
      name: `${campaign.name} Copy`,
      status: 'Draft',
      views: 0,
      clicks: 0,
      leads: 0,
      registrations: 0,
      revenue: 0,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    saveMarketingCampaigns([duplicated, ...marketingCampaigns]);
    notify('Campaign berhasil diduplikasi sebagai draft.');
  };

  const deleteCampaign = (campaign: MarketingCampaign) => {
    saveMarketingCampaigns(marketingCampaigns.filter((item) => item.id !== campaign.id));
    recordAudit('Digital Marketing', 'Delete Campaign', campaign.name);
    notify('Campaign dihapus dari daftar demo.');
  };

  const getCampaignAgentInsight = (campaign: MarketingCampaign) => {
    const durationDays = Math.max(1, Math.ceil((new Date(campaign.endDate).getTime() - new Date(campaign.startDate).getTime()) / 86400000) + 1);
    const targetLeads = Math.max(1, campaign.targetLeads);
    const leadGap = Math.max(0, targetLeads - campaign.leads);
    const actualCpl = campaign.leads ? Math.round(campaign.budget / campaign.leads) : 0;
    const plannedCpl = campaign.budget ? Math.round(campaign.budget / targetLeads) : 0;
    const targetDailyLeads = Math.ceil(leadGap / durationDays);
    const observedClickToLead = campaign.clicks ? campaign.leads / campaign.clicks : 0.12;
    const observedCtr = campaign.views ? campaign.clicks / campaign.views : 0.018;
    const requiredClicks = Math.ceil(leadGap / Math.max(0.03, observedClickToLead));
    const requiredViews = Math.ceil(requiredClicks / Math.max(0.005, observedCtr));
    const dailyBudgetNeeded = campaign.dailyBudget || Math.ceil((campaign.budget || plannedCpl * targetLeads) / durationDays);
    const budgetHealth = campaign.budget === 0
      ? 'Budget belum diisi. Campaign bisa disimpan sebagai draft, tapi belum siap dipublish untuk paid ads.'
      : plannedCpl < 8000
        ? 'Target agresif. CPL terlalu rendah untuk paid ads, perlu organic support dan retargeting.'
        : plannedCpl <= 35000
          ? 'Target realistis untuk edukasi jika creative kuat dan follow-up cepat.'
          : 'Budget per lead cukup lega. Prioritaskan kualitas lead dan segmentasi audience.';
    const primaryChannel = campaign.channels[0] || 'Organic Social';
    const channelMix = campaign.channels.map((channel) => {
      if (channel.includes('Google')) return `${channel}: high intent, arahkan ke keyword program dan landing page pendaftaran.`;
      if (channel.includes('TikTok')) return `${channel}: gunakan video pendek hook masalah belajar, testimoni, dan tryout gratis.`;
      if (channel.includes('Instagram')) return `${channel}: pakai reels, carousel bukti hasil, dan retargeting visitor landing page.`;
      if (channel.includes('WhatsApp')) return `${channel}: follow-up lead hangat, broadcast segmentasi, dan reminder deadline.`;
      if (channel.includes('Email')) return `${channel}: nurture lead lama dengan benefit, jadwal, dan promo terbatas.`;
      return `${channel}: buat konten organik konsisten untuk edukasi, social proof, dan CTA ke landing page.`;
    });
    const organicPlan = [
      `3 reels/video pendek per minggu: masalah siswa, solusi cepat, CTA ke ${campaign.cta}.`,
      `2 carousel per minggu: breakdown materi, alur program, bukti hasil/testimoni.`,
      `1 live/Q&A per minggu: bahas ${campaign.program}, kumpulkan pertanyaan, arahkan ke form lead.`,
      `Story harian: polling, reminder deadline, cuplikan kelas, link ${campaign.landingPageUrl}.`
    ];
    const recommendation = campaign.budget === 0
      ? 'Isi budget dan budget harian sebelum publish paid ads. Untuk organic, campaign tetap bisa berjalan dengan target konten mingguan.'
      : leadGap === 0
        ? 'Target leads sudah tercapai. Fokuskan budget ke retargeting dan konversi registrasi.'
        : `Butuh sekitar ${requiredClicks.toLocaleString('id-ID')} klik atau ${requiredViews.toLocaleString('id-ID')} views lagi untuk mengejar ${leadGap.toLocaleString('id-ID')} lead.`;

    return {
      durationDays,
      leadGap,
      actualCpl,
      plannedCpl,
      targetDailyLeads,
      dailyBudgetNeeded,
      primaryChannel,
      budgetHealth,
      channelMix,
      organicPlan,
      recommendation
    };
  };

  const openMarketingMetricDetail = (metric: 'conversion' | 'leads' | 'roi') => {
    const totalViews = marketingCampaigns.reduce((sum, item) => sum + item.views, 0);
    const totalClicks = marketingCampaigns.reduce((sum, item) => sum + item.clicks, 0);
    const totalLeads = marketingCampaigns.reduce((sum, item) => sum + item.leads, 0);
    const totalBudget = marketingCampaigns.reduce((sum, item) => sum + item.budget, 0);
    const totalRevenue = marketingCampaigns.reduce((sum, item) => sum + item.revenue, 0);
    const rows = marketingCampaigns.map((campaign) => ({
      name: campaign.name,
      program: campaign.program,
      status: campaign.status,
      views: campaign.views,
      clicks: campaign.clicks,
      leads: campaign.leads,
      budget: campaign.budget,
      revenue: campaign.revenue,
      conversion: campaign.clicks ? `${((campaign.leads / campaign.clicks) * 100).toFixed(1)}%` : '0.0%',
      roi: campaign.budget ? `${(campaign.revenue / campaign.budget).toFixed(1)}x` : '0.0x'
    }));
    if (metric === 'conversion') {
      setMarketingMetricDetail({
        title: 'Conversion Rate',
        value: `${totalClicks ? ((totalLeads / totalClicks) * 100).toFixed(1) : '0.0'}%`,
        description: 'Persentase klik campaign yang berubah menjadi lead. Angka 0.0% biasanya berarti belum ada klik atau belum ada lead tercatat.',
        formula: `Total leads (${totalLeads.toLocaleString('id-ID')}) / total clicks (${totalClicks.toLocaleString('id-ID')}) x 100`,
        rows,
        recommendation: totalClicks === 0 ? 'Tambahkan tracking clicks/views atau jalankan campaign terlebih dahulu.' : totalLeads === 0 ? 'Perbaiki form, CTA, dan offer landing page karena klik belum berubah menjadi lead.' : 'Optimasi campaign dengan conversion rate terendah terlebih dahulu.'
      });
    } else if (metric === 'leads') {
      setMarketingMetricDetail({
        title: 'Active Leads',
        value: totalLeads.toLocaleString('id-ID'),
        description: 'Jumlah lead yang berasal dari seluruh campaign marketing di workspace ini.',
        formula: `Akumulasi leads dari ${marketingCampaigns.length} campaign`,
        rows,
        recommendation: totalLeads === 0 ? 'Gunakan tombol Lead untuk simulasi, atau hubungkan landing page form ke source campaign.' : 'Follow-up lead aktif melalui WhatsApp dan tandai progresnya di Manage Leads.'
      });
    } else {
      setMarketingMetricDetail({
        title: 'Total ROI',
        value: `${totalBudget ? (totalRevenue / totalBudget).toFixed(1) : '0.0'}x`,
        description: 'Perbandingan revenue attribution terhadap total budget campaign.',
        formula: `Total revenue (${formatRupiah(totalRevenue)}) / total budget (${formatRupiah(totalBudget)})`,
        rows,
        recommendation: totalBudget === 0 ? 'Isi budget campaign agar ROI bisa dianalisis.' : totalRevenue === 0 ? 'Tambahkan revenue attribution dari registrasi/pembayaran yang berasal dari campaign.' : 'Naikkan budget pada campaign dengan ROI tertinggi dan pause campaign dengan ROI rendah.'
      });
    }
  };

  const openMarketingChannel = (campaign: MarketingCampaign, channel = campaign.channels[0] || 'Organic Social') => {
    const campaignText = encodeURIComponent(`${campaign.name} - ${campaign.headline} - ${campaign.landingPageUrl}`);
    const channelUrls: Record<string, string> = {
      'Instagram Ads': 'https://business.facebook.com/adsmanager/manage/campaigns',
      'TikTok Ads': 'https://ads.tiktok.com/i18n/campaign',
      'Google Ads': 'https://ads.google.com/aw/campaigns',
      'WhatsApp Broadcast': `https://web.whatsapp.com/send?text=${campaignText}`,
      'Email Campaign': `mailto:?subject=${encodeURIComponent(campaign.name)}&body=${campaignText}`,
      'Organic Social': ''
    };
    if (channel === 'Organic Social') {
      closeCampaignEditor();
      setActiveTab('content');
      notify('Organic Social diarahkan ke Content Library. Buat reels, carousel, live/Q&A, dan story dari plan campaign.');
      return;
    }
    window.open(channelUrls[channel] || campaign.landingPageUrl, '_blank');
    notify(`Channel ${channel} dibuka untuk campaign ${campaign.name}.`);
  };

  const captureCampaignLead = (campaign: MarketingCampaign) => {
    const primaryChannel = campaign.channels[0] || 'Organic Social';
    const nextLead: Lead = {
      id: `lead-${Date.now()}`,
      name: `Lead ${campaign.program}`,
      email: 'lead.campaign@mail.com',
      phone: '081234567000',
      programOfInterest: campaign.program,
      source: `Campaign: ${campaign.name} | Channel: ${primaryChannel}`,
      status: 'New',
      note: `Masuk dari ${campaign.landingPageUrl}. Routing follow-up: ${primaryChannel}`,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setLeadsList([nextLead, ...leadsList]);
    saveMarketingCampaigns(marketingCampaigns.map((item) => item.id === campaign.id ? { ...item, leads: item.leads + 1 } : item));
    openMarketingChannel(campaign, primaryChannel);
    notify(`Lead demo ditambahkan dan diarahkan ke ${primaryChannel}.`);
  };

  const deleteFinanceEntry = (id: string) => {
    saveFinanceEntries(financeEntries.filter((entry) => entry.id !== id));
    recordAudit('Financial Center', 'Delete Finance Plan', id);
    notify('Input keuangan dihapus.');
  };

  const saveFinanceRealizations = (nextRows: FinanceRealization[]) => {
    setFinanceRealizations(nextRows);
    localStorage.setItem('theprams_demo_finance_realizations', JSON.stringify(nextRows));
  };

  const addFinanceRealization = () => {
    const source = financeEntries.find((entry) => entry.id === realizationForm.financeEntryId);
    const amount = parseRupiah(realizationForm.amount);
    if (!source || amount <= 0) {
      notify('Pilih rencana biaya/anggaran dan isi nominal realisasi.');
      return;
    }
    const nextRow: FinanceRealization = {
      id: `realization-${Date.now()}`,
      financeEntryId: source.id,
      name: source.name,
      category: source.category,
      amount,
      date: realizationForm.date,
      note: realizationForm.note.trim(),
      createdAt: new Date().toISOString()
    };
    saveFinanceRealizations([nextRow, ...financeRealizations]);
    setRealizationForm({ financeEntryId: '', amount: '', date: new Date().toISOString().slice(0, 10), note: '' });
    recordAudit('Financial Center', 'Realize Budget/Cost', `${nextRow.name} - ${formatRupiah(nextRow.amount)}`);
    notify('Realisasi biaya/anggaran masuk pembukuan otomatis.');
  };

  const saveAssetEntries = (nextRows: AssetEntry[]) => {
    setAssetEntries(nextRows);
    localStorage.setItem('theprams_demo_assets', JSON.stringify(nextRows));
  };

  const addAssetEntry = () => {
    const acquisitionValue = parseRupiah(assetForm.acquisitionValue);
    const currentValue = parseRupiah(assetForm.currentValue) || acquisitionValue;
    const isNonDepreciableFixedAsset = assetForm.type === 'fixed_asset' && nonDepreciableFixedAssetCategories.includes(assetForm.category);
    const usefulLifeMonths = assetForm.type === 'fixed_asset' && !isNonDepreciableFixedAsset ? Number(assetForm.usefulLifeMonths) || 1 : 0;
    if (!assetForm.name.trim() || acquisitionValue <= 0) {
      notify('Nama aset dan nilai perolehan wajib diisi.');
      return;
    }
    const nextAsset: AssetEntry = {
      id: `asset-${Date.now()}`,
      type: assetForm.type,
      name: assetForm.name.trim(),
      category: assetForm.category.trim() || (assetForm.type === 'fixed_asset' ? 'Aset Tetap' : 'Aset Lancar'),
      acquisitionValue,
      currentValue,
      acquisitionDate: assetForm.acquisitionDate,
      usefulLifeMonths,
      depreciationPerMonth: assetForm.type === 'fixed_asset' && !isNonDepreciableFixedAsset ? Math.round(acquisitionValue / usefulLifeMonths) : 0,
      note: assetForm.note.trim(),
      createdAt: new Date().toISOString()
    };
    saveAssetEntries([nextAsset, ...assetEntries]);
    setAssetForm({ type: 'fixed_asset', name: '', category: 'Peralatan Kantor', acquisitionValue: '', currentValue: '', acquisitionDate: new Date().toISOString().slice(0, 10), usefulLifeMonths: '36', note: '' });
    recordAudit('Financial Center', 'Register Asset', `${nextAsset.name} - ${formatRupiah(nextAsset.currentValue)}`);
    notify('Aset berhasil ditambahkan ke pembukuan.');
  };

  const openStoredInvoice = (tx: any) => {
    const invoice = window.open('', '_blank');
    if (!invoice) return;
    const invoiceNumber = tx.invoiceNumber || tx.id || 'INV/DEMO/TP/00000';
    const invoiceTime = tx.invoiceTime || tx.date || new Date().toLocaleString('id-ID');
    const methodLabel = tx.method || 'Manual/Admin';
    const amount = tx.amount || 'Rp 0';
    const fallbackInvoice = `
      <html>
        <head>
          <title>${invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; color:#0f172a; margin:40px; }
            .head { display:flex; justify-content:space-between; border-bottom:3px solid #2563eb; padding-bottom:18px; margin-bottom:28px; }
            .brand { font-size:24px; font-weight:900; color:#1e3a8a; }
            .muted { color:#64748b; font-size:12px; }
            .box { border:1px solid #e2e8f0; border-radius:14px; padding:18px; margin-top:18px; }
            table { width:100%; border-collapse:collapse; margin:24px 0; }
            td, th { padding:12px; border-bottom:1px solid #e2e8f0; text-align:left; }
            th { background:#f8fafc; color:#64748b; font-size:11px; text-transform:uppercase; }
            .total { font-size:24px; font-weight:900; color:#f59e0b; }
            @media print { button { display:none; } body { margin:24px; } }
          </style>
        </head>
        <body>
          <div class="head">
            <div><div class="brand">Bimbel The Prams</div><div class="muted">Invoice Pembayaran Program</div></div>
            <div><strong>${invoiceNumber}</strong><div class="muted">${invoiceTime}</div></div>
          </div>
          <div class="box">
            <div class="muted">Calon Siswa</div>
            <h2>${tx.student || '-'}</h2>
            <p>Email: <strong>${tx.email || '-'}</strong></p>
            <p>WhatsApp: <strong>${tx.phone || '-'}</strong></p>
          </div>
          <table>
            <thead><tr><th>Program</th><th>Paket</th><th>Metode</th><th>Nominal</th></tr></thead>
            <tbody>
              <tr>
                <td>${tx.program || '-'}</td>
                <td>${tx.packageName || '-'}</td>
                <td>${methodLabel}</td>
                <td>${amount}</td>
              </tr>
            </tbody>
          </table>
          <p class="total">Total: ${amount}</p>
          <div class="box">Status: <strong>${tx.status || '-'}</strong></div>
          <button onclick="window.print()">Cetak / Simpan PDF</button>
        </body>
      </html>
    `;
    invoice.document.write(tx.invoiceHtml || fallbackInvoice);
    invoice.document.close();
  };

  const openStoredProof = (proof: any) => {
    if (!proof.fileData) {
      notify('Dokumen hanya tersedia sebagai metadata file.');
      return;
    }
    const doc = window.open('', '_blank');
    if (!doc) return;
    if (String(proof.fileType).includes('pdf')) {
      doc.document.write(`<iframe src="${proof.fileData}" style="border:0;width:100%;height:100vh"></iframe>`);
    } else {
      doc.document.write(`<img src="${proof.fileData}" style="max-width:100%;height:auto" alt="${proof.fileName || 'Bukti pembayaran'}" />`);
    }
    doc.document.close();
  };

  const updateFinanceRecordStatus = (invoiceId: string, nextStatus: string) => {
    const nextTransactions = financeTransactions.map((tx) => (
      (tx.invoiceNumber || tx.id) === invoiceId ? { ...tx, status: nextStatus, reviewedAt: new Date().toISOString() } : tx
    ));
    setFinanceTransactions(nextTransactions);
    localStorage.setItem('theprams_demo_transactions', JSON.stringify(nextTransactions));

    const nextProofs = paymentProofs.map((proof) => (
      proof.invoiceId === invoiceId ? { ...proof, status: nextStatus, reviewedAt: new Date().toISOString() } : proof
    ));
    setPaymentProofs(nextProofs);
    localStorage.setItem('theprams_demo_payment_proofs', JSON.stringify(nextProofs));
    setSelectedFinanceRecord((current: any) => current ? { ...current, tx: { ...current.tx, status: nextStatus }, proof: current.proof ? { ...current.proof, status: nextStatus } : current.proof } : current);
    const updatedTx = financeTransactions.find((tx) => (tx.invoiceNumber || tx.id) === invoiceId) || selectedFinanceRecord?.tx;
    recordAudit('Payment Workflow', 'Update Status', `${invoiceId} -> ${nextStatus}`);
    if (updatedTx) {
      const template = buildReviewTemplate({ ...updatedTx, status: nextStatus });
      if (nextStatus === 'Needs Revision') {
        queueNotification('Email', updatedTx.email || '-', 'Review Ulang Data Pendaftaran The Prams', template);
        queueNotification('WhatsApp', updatedTx.phone || '-', 'Review Ulang Data Pendaftaran The Prams', template);
      } else if (nextStatus.includes('Approved')) {
        queueNotification('Email', updatedTx.email || '-', 'Pendaftaran The Prams Disetujui', `Halo ${updatedTx.student || 'Calon Siswa'}, status kamu sudah diperbarui menjadi ${nextStatus}. Silakan lanjut mengikuti arahan admin The Prams.`);
      }
      const approvedTx = { ...updatedTx, status: nextStatus };
      if (isApprovedStudentRecord(approvedTx)) {
        const studentUser = userFromStudentRecord(approvedTx, 'tx');
        const exists = users.some((item) => item.id === studentUser.id || `${item.email}-${item.program}-${item.packageName || ''}`.toLowerCase() === `${studentUser.email}-${studentUser.program}-${studentUser.packageName || ''}`.toLowerCase());
        if (!exists) {
          persistUsers([studentUser, ...users]);
          recordAudit('User & Roles', 'Auto Create Student', `${studentUser.name} - ${studentUser.accountType}`);
        }
      }
    }
    notify(`Status diperbarui menjadi ${nextStatus}.`);
  };

  const buildReviewTemplate = (tx: any) => {
    const invoiceId = tx.invoiceNumber || tx.id || '-';
    const isScholarship = String(tx.status || '').toLowerCase().includes('scholarship') || String(tx.packageName || '').toLowerCase().includes('beasiswa');
    const documentLabel = isScholarship ? 'dokumen beasiswa' : 'bukti pembayaran';
    return [
      `Halo ${tx.student || 'Calon Siswa'},`,
      '',
      'Terima kasih sudah mendaftar di Bimbel The Prams.',
      '',
      'Setelah pengecekan oleh admin, data pendaftaran kamu perlu direview ulang dengan detail berikut:',
      `- Program: ${tx.program || '-'}`,
      `- Paket: ${tx.packageName || '-'}`,
      `- No. Invoice: ${invoiceId}`,
      `- Status saat ini: ${tx.status || '-'}`,
      '',
      `Mohon cek kembali data pendaftaran dan ${documentLabel} yang kamu lampirkan. Jika ada data yang belum sesuai, silakan kirim ulang ${documentLabel} yang benar atau hubungi admin untuk bantuan verifikasi.`,
      '',
      'Yang perlu dipastikan:',
      '- Nama, email, dan nomor WhatsApp sesuai dengan data pendaftaran.',
      `- ${documentLabel} terlihat jelas dan dapat dibaca.`,
      '- Nomor invoice/program/paket sesuai dengan pilihan pendaftaran.',
      '',
      'Terima kasih,',
      'Admin Bimbel The Prams'
    ].join('\n');
  };

  const openReviewEmail = (tx: any) => {
    const subject = encodeURIComponent('Review Ulang Data Pendaftaran The Prams');
    const body = encodeURIComponent(buildReviewTemplate(tx));
    window.open(`mailto:${tx.email || ''}?subject=${subject}&body=${body}`, '_blank');
  };

  const openReviewWhatsapp = (tx: any) => {
    const phone = String(tx.phone || '').replace(/\D/g, '').replace(/^0/, '62');
    window.open(`https://wa.me/${phone || '6281234567890'}?text=${encodeURIComponent(buildReviewTemplate(tx))}`, '_blank');
  };

  const addDemoLead = () => {
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: 'Lead Baru',
      email: 'leadbaru@mail.com',
      phone: '081234000999',
      programOfInterest: 'SNBT Kedokteran',
      source: 'Admin Input',
      status: 'New',
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setLeadsList([newLead, ...leadsList]);
    notify('Lead baru ditambahkan.');
  };

  const allLeads = useMemo(() => [...localLeads, ...leadsList], [localLeads, leadsList]);

  const openNewLeadForm = () => {
    setLeadForm({
      name: '',
      email: '',
      phone: '',
      programOfInterest: programsList[0]?.title || 'SNBT Kedokteran',
      source: 'Admin Input',
      status: 'New',
      note: '',
      lastContactedAt: ''
    });
    setIsLeadFormOpen(true);
  };

  const saveLeadForm = () => {
    if (!leadForm.name.trim() || !leadForm.phone.trim()) {
      notify('Nama dan nomor WhatsApp lead wajib diisi.');
      return;
    }
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: leadForm.name.trim(),
      email: leadForm.email.trim() || '-',
      phone: leadForm.phone.trim(),
      programOfInterest: leadForm.programOfInterest.trim() || 'Konsultasi Program',
      source: leadForm.source.trim() || 'Admin Input',
      status: leadForm.status,
      note: leadForm.note?.trim(),
      lastContactedAt: leadForm.lastContactedAt || undefined,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    const nextLocalLeads = [newLead, ...localLeads];
    localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(nextLocalLeads));
    setIsLeadFormOpen(false);
    recordAudit('Lead Management', 'Create Lead', `${newLead.name} - ${newLead.programOfInterest}`);
    notify('Lead baru berhasil ditambahkan.');
  };

  const convertLeadToStudent = (lead: Lead) => {
    const exists = users.some((user) => user.email === lead.email && user.role === 'Student');
    if (!exists) {
      persistUsers([
        {
          id: `student-${lead.id}`,
          name: lead.name,
          email: lead.email,
          role: 'Student',
          program: lead.programOfInterest,
          status: 'Active',
          avatar: `https://i.pravatar.cc/150?u=${lead.id}`,
          joinedAt: new Date().toISOString().slice(0, 10),
          accountType: 'Free',
          packageName: 'Trial / Lead',
          paymentStatus: 'Converted',
          source: 'Konversi Lead'
        },
        ...users
      ]);
    }
    updateLeadStatus(lead, 'Converted', 'Lead dikonversi menjadi siswa gratis/trial.');
    setLeadPendingConvert(null);
    notify(exists ? `${lead.name} sudah terdaftar sebagai siswa. Status lead ditandai Converted.` : `${lead.name} berhasil dikonversi menjadi siswa.`);
  };

  const updateLeadStatus = (lead: Lead, status: Lead['status'], note?: string) => {
    const nextLead: Lead = {
      ...lead,
      status,
      note: note ?? lead.note,
      lastContactedAt: ['Contacted', 'Qualified', 'Converted'].includes(status) ? new Date().toLocaleString('id-ID') : lead.lastContactedAt
    };
    const localLeadExists = localLeads.some((item) => item.id === lead.id);
    if (localLeadExists) {
      const nextLocalLeads = localLeads.map((item) => item.id === lead.id ? nextLead : item);
      localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(nextLocalLeads));
    } else {
      setLeadsList((prev) => prev.map((item) => item.id === lead.id ? nextLead : item));
    }
    setSelectedLead(nextLead);
    setLeadNoteDraft(nextLead.note || '');
  };

  const openLeadWhatsapp = (lead: Lead) => {
    const phone = String(lead.phone || '').replace(/\D/g, '').replace(/^0/, '62');
    window.open(`https://wa.me/${phone || '6281234567890'}?text=${encodeURIComponent(`Halo ${lead.name}, saya admin The Prams. Saya melihat kamu tertarik dengan ${lead.programOfInterest}. Boleh saya bantu jelaskan pilihan program yang paling sesuai?`)}`, '_blank');
    updateLeadStatus(lead, lead.status === 'New' ? 'Contacted' : lead.status, lead.note);
  };

  const runContextualAdd = () => {
    if (activeTab === 'leads') addDemoLead();
    else if (activeTab === 'users') {
      const newUser: UserAccount = {
        id: Date.now().toString(),
        name: 'Staff Baru',
        email: 'staffbaru@theprams.com',
        role: 'Support',
        avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
        status: 'Active',
        joinedAt: new Date().toISOString().split('T')[0]
      };
    persistUsers([newUser, ...users]);
    notify('Staff baru ditambahkan.');
    } else if (activeTab === 'programs') {
      setEditingProgram({
        id: `program-${Date.now()}`,
        title: 'Program Baru',
        category: 'Persiapan Akademik',
        description: 'Deskripsi singkat program baru.',
        target: 'Siswa umum',
        price: 'Rp 0',
        facilities: ['Tryout', 'Modul Digital'],
        image: PROGRAMS[0].image,
        color: 'bg-brand-blue',
        packages: []
      });
    } else if (activeTab === 'questions') {
      setEditingQuestion({
        id: Date.now().toString(),
        subject: 'Penalaran Umum',
        difficulty: 'Medium',
        text: '',
        options: [{ id: 'A', text: '' }, { id: 'B', text: '' }],
        correctOptionId: 'A',
        explanation: '',
        program: 'SNBT',
        tags: []
      });
    } else if (activeTab === 'content') {
      setIsUploadVideoModalOpen(true);
    } else if (activeTab === 'marketing') {
      openNewCampaign();
    } else {
      notify(`Aksi tambah untuk tab ${activeTab} tersedia di mode demo.`);
    }
  };
  
  // User Management State
  const [users, setUsers] = useState<UserAccount[]>(() => readStorageArray(USER_STORAGE_KEY, USER_ACCOUNTS.map((user) => ({
    ...user,
    accountType: user.role === 'Student' ? 'Paid' : 'Staff',
    source: 'Demo Seed'
  }))));
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [userDirectoryView, setUserDirectoryView] = useState<'students' | 'staff'>('students');
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);
  const [testimonialFilter, setTestimonialFilter] = useState<'All' | 'Pending' | 'Approved'>('All');
  const [programsList, setProgramsList] = useState<Program[]>(programs);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [programPendingSave, setProgramPendingSave] = useState<Program | null>(null);
  const [websiteQuestions, setWebsiteQuestions] = useState<WebsiteQuestion[]>(() => readStorageArray('theprams_demo_website_questions'));
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [blogPostDrafts, setBlogPostDrafts] = useState<BlogPost[]>(blogPosts);

  useEffect(() => {
    setProgramsList(programs);
  }, [programs]);

  useEffect(() => {
    setBlogPostDrafts(blogPosts);
  }, [blogPosts]);

  const persistUsers = (nextUsers: UserAccount[]) => {
    setUsers(nextUsers);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUsers));
  };

  const syncApprovedStudentsToUsers = (baseUsers = users) => {
    const registrations = readStorageArray<any>('theprams_demo_registrations');
    const transactions = readStorageArray<any>('theprams_demo_transactions');
    const systemStudents = [
      ...transactions.filter(isApprovedStudentRecord).map((record) => userFromStudentRecord(record, 'tx')),
      ...registrations.filter(isApprovedStudentRecord).map((record) => userFromStudentRecord(record, 'reg'))
    ];
    const existingIds = new Set(baseUsers.map((user) => user.id));
    const existingEmails = new Set(baseUsers.map((user) => `${user.email}-${user.program}-${user.packageName || ''}`.toLowerCase()));
    const newStudents = systemStudents.filter((student) => {
      const key = `${student.email}-${student.program}-${student.packageName || ''}`.toLowerCase();
      return !existingIds.has(student.id) && !existingEmails.has(key);
    });
    if (!newStudents.length) return baseUsers;
    const nextUsers = [...newStudents, ...baseUsers];
    persistUsers(nextUsers);
    return nextUsers;
  };

  useEffect(() => {
    syncApprovedStudentsToUsers();
  }, []);

  const saveWebsiteQuestions = (nextQuestions: WebsiteQuestion[]) => {
    setWebsiteQuestions(nextQuestions);
    localStorage.setItem('theprams_demo_website_questions', JSON.stringify(nextQuestions));
  };

  const saveWebsiteQuestionAnswer = (question: WebsiteQuestion, answer: string) => {
    const nextQuestions = websiteQuestions.map((item) => item.id === question.id ? {
      ...item,
      adminAnswer: answer,
      status: 'Dibalas' as const,
      answeredAt: new Date().toLocaleString('id-ID')
    } : item);
    saveWebsiteQuestions(nextQuestions);
    queueNotification('WhatsApp', question.phone || '-', 'Jawaban pertanyaan The Prams', answer);
    recordAudit('Website Questions', 'Answer Question', `${question.name} - ${question.phone}`);
    notify('Jawaban tersimpan dan masuk outbox WhatsApp.');
  };

  const openQuestionWhatsapp = (question: WebsiteQuestion) => {
    const phone = String(question.phone || '').replace(/\D/g, '').replace(/^0/, '62');
    const message = question.adminAnswer || `Halo ${question.name}, terima kasih sudah bertanya ke Bimbel The Prams. Saya bantu jawab pertanyaan kamu: ${question.question}`;
    window.open(`https://wa.me/${phone || '6281234567890'}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const saveBlogPost = (post: BlogPost) => {
    const sanitized: BlogPost = {
      ...post,
      id: post.id.trim() || `blog-${Date.now()}`,
      title: post.title.trim() || 'Judul Artikel Baru',
      excerpt: post.excerpt.trim() || 'Ringkasan artikel belum diisi.',
      content: post.content.trim() || '# Artikel Baru\n\nTulis konten artikel di sini.',
      author: post.author.trim() || 'Admin The Prams',
      authorRole: post.authorRole.trim() || 'Content Specialist',
      authorAvatar: post.authorAvatar.trim() || 'https://i.pravatar.cc/150?u=admin',
      image: post.image.trim() || BLOG_POSTS[0].image,
      date: post.date.trim() || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      readTime: post.readTime.trim() || '5 min read',
      tags: post.tags.map((tag) => tag.trim()).filter(Boolean)
    };
    const nextPosts = blogPostDrafts.find((item) => item.id === sanitized.id)
      ? blogPostDrafts.map((item) => item.id === sanitized.id ? sanitized : item)
      : [sanitized, ...blogPostDrafts];
    setBlogPostDrafts(nextPosts);
    onBlogPostsChange?.(nextPosts);
    setEditingBlogPost(null);
    recordAudit('Website Editor', 'Save Blog/Literasi', sanitized.title);
    notify('Konten Info Menarik tersimpan dan tampil di website.');
  };

  const saveProgram = (updatedProg: Program) => {
    const sanitizedProgram: Program = {
      ...updatedProg,
      id: updatedProg.id.trim() || `program-${Date.now()}`,
      title: updatedProg.title.trim() || 'Program Tanpa Nama',
      category: updatedProg.category.trim() || 'General',
      description: updatedProg.description.trim() || 'Deskripsi program belum diisi.',
      target: updatedProg.target.trim() || 'Siswa umum',
      price: updatedProg.price.trim() || 'Rp 0',
      image: updatedProg.image.trim() || PROGRAMS[0].image,
      color: updatedProg.color.trim() || 'bg-brand-blue',
      facilities: (updatedProg.facilities || []).map((item) => item.trim()).filter(Boolean),
      curriculum: (updatedProg.curriculum || []).filter((item) => item.topic.trim() || item.description.trim()),
      packages: (updatedProg.packages || []).map((pkg, index) => ({
        ...pkg,
        id: pkg.id || `pkg-${Date.now()}-${index}`,
        name: pkg.name.trim() || `Paket ${index + 1}`,
        price: pkg.price.trim() || 'Rp 0',
        duration: pkg.duration.trim() || '-',
        features: pkg.features.map((feature) => feature.trim()).filter(Boolean)
      }))
    };
    let nextPrograms: Program[];
    if (programsList.find(p => p.id === sanitizedProgram.id)) {
      nextPrograms = programsList.map(p => p.id === sanitizedProgram.id ? sanitizedProgram : p);
    } else {
      nextPrograms = [...programsList, sanitizedProgram];
    }
    setProgramsList(nextPrograms);
    onProgramsChange?.(nextPrograms);
    setEditingProgram(null);
    recordAudit('Program Inventory', 'Save Program', sanitizedProgram.title);
    notify('Program berhasil disimpan dan tersinkron ke menu program.');
  };

  const deleteProgram = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus program ini?')) {
      const nextPrograms = programsList.filter(p => p.id !== id);
      setProgramsList(nextPrograms);
      onProgramsChange?.(nextPrograms);
      recordAudit('Program Inventory', 'Delete Program', id);
      notify('Program berhasil dihapus.');
    }
  };

  const resetProgramsToDefault = () => {
    if (confirm('Reset semua program demo ke data awal?')) {
      setProgramsList(PROGRAMS);
      onProgramsChange?.(PROGRAMS);
      notify('Program demo dikembalikan ke data awal.');
    }
  };

  const programCategories = useMemo(() => ['All', ...Array.from(new Set(programsList.map((program) => program.category)))], [programsList]);
  const filteredProgramsList = useMemo(() => {
    return programsList.filter((program) => {
      const keyword = programSearchTerm.toLowerCase();
      const matchesSearch = `${program.title} ${program.category} ${program.description} ${program.schedule || ''}`.toLowerCase().includes(keyword);
      const matchesCategory = programCategoryFilter === 'All' || program.category === programCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [programsList, programSearchTerm, programCategoryFilter]);


  const pendingTestimonials = useMemo(() => testimonials.filter(t => t.status === 'Pending'), [testimonials]);
  const approvedTestimonials = useMemo(() => testimonials.filter(t => t.status === 'Approved'), [testimonials]);
  const rejectedTestimonials = useMemo(() => testimonials.filter(t => t.status === 'Rejected'), [testimonials]);

  const updateTestimonialStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    notify(`Testimoni ditandai ${status}.`);
  };

  const visibleTestimonials = useMemo(() => {
    if (testimonialFilter === 'All') return testimonials;
    return testimonials.filter((item) => item.status === testimonialFilter);
  }, [testimonialFilter, testimonials]);

  const openNewUserForm = (kind: 'student' | 'staff') => {
    setEditingUser({
      id: `user-${Date.now()}`,
      name: '',
      email: '',
      role: kind === 'student' ? 'Student' : 'Support',
      program: kind === 'student' ? (programsList[0]?.title || 'SNBT Kedokteran') : 'Admin Panel',
      status: 'Active',
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      joinedAt: new Date().toISOString().slice(0, 10),
      accountType: kind === 'student' ? 'Free' : 'Staff',
      packageName: kind === 'student' ? 'Manual Input' : 'Staff Account',
      paymentStatus: kind === 'student' ? 'Manual Active' : 'Internal',
      source: kind === 'student' ? 'Add User Siswa' : 'Add User Admin'
    });
  };

  const saveUser = (user: UserAccount) => {
    if (!user.name.trim() || !user.email.trim()) {
      notify('Nama dan email user wajib diisi.');
      return;
    }
    const sanitizedUser: UserAccount = {
      ...user,
      id: user.id || `user-${Date.now()}`,
      name: user.name.trim(),
      email: user.email.trim(),
      avatar: user.avatar.trim() || `https://i.pravatar.cc/150?u=${encodeURIComponent(user.email)}`,
      joinedAt: user.joinedAt || new Date().toISOString().slice(0, 10),
      program: ['Student', 'Tutor'].includes(user.role) ? (user.program?.trim() || programsList[0]?.title || 'General') : user.program?.trim(),
      accountType: user.role === 'Student' ? (user.accountType === 'Staff' ? 'Free' : user.accountType || 'Free') : 'Staff',
      packageName: user.packageName?.trim() || (user.role === 'Student' ? 'Manual Input' : 'Staff Account'),
      paymentStatus: user.paymentStatus?.trim() || (user.role === 'Student' ? 'Manual Active' : 'Internal'),
      source: user.source?.trim() || (user.role === 'Student' ? 'Add User Siswa' : 'Add User Admin')
    };
    const nextUsers = users.some((item) => item.id === sanitizedUser.id)
      ? users.map((item) => item.id === sanitizedUser.id ? sanitizedUser : item)
      : [sanitizedUser, ...users];
    persistUsers(nextUsers);
    setEditingUser(null);
    recordAudit('User & Roles', 'Save User', `${sanitizedUser.name} - ${sanitizedUser.role}`);
    notify('User berhasil disimpan.');
  };

  const financeRows = useMemo(() => {
    const demoRows = [
      { id: 'demo-1', student: 'Andi Pratama', program: 'Med-Express', packageName: 'Premium', amount: 'Rp 3.500.000', status: 'Success', method: 'Virtual Account', date: '25 Apr 2026', type: 'paid' },
      { id: 'demo-2', student: 'Salsabila Putri', program: 'SNBT Gold', packageName: 'Premium', amount: 'Rp 2.250.000', status: 'Success', method: 'E-Wallet', date: '25 Apr 2026', type: 'paid' },
      { id: 'demo-3', student: 'Dewi Lestari', program: 'CPNS Master', packageName: 'Beasiswa Prams Scholar', amount: 'Rp 0', status: 'Scholarship Review', method: 'Beasiswa', date: '24 Apr 2026', type: 'scholarship' }
    ];
    return [...financeTransactions, ...demoRows];
  }, [financeTransactions]);

  const paymentStatusOptions = useMemo(() => ['All', ...Array.from(new Set(financeRows.map((tx) => tx.status || 'Unknown')))], [financeRows]);
  const filteredFinanceRows = useMemo(() => {
    const keyword = paymentSearchTerm.toLowerCase();
    return financeRows.filter((tx) => {
      const rowType = String(tx.type || (String(tx.status).toLowerCase().includes('scholarship') ? 'scholarship' : String(tx.status).toLowerCase().includes('free') ? 'free' : 'paid'));
      const matchesSearch = `${tx.student || ''} ${tx.email || ''} ${tx.phone || ''} ${tx.program || ''} ${tx.packageName || ''} ${tx.invoiceNumber || tx.id || ''}`.toLowerCase().includes(keyword);
      const matchesStatus = paymentStatusFilter === 'All' || tx.status === paymentStatusFilter;
      const matchesType = paymentTypeFilter === 'All' || rowType === paymentTypeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [financeRows, paymentSearchTerm, paymentStatusFilter, paymentTypeFilter]);

  const financeSummary = useMemo(() => {
    const paidRevenue = financeRows
      .filter((tx) => !String(tx.status).toLowerCase().includes('scholarship') && !String(tx.status).toLowerCase().includes('free'))
      .reduce((sum, tx) => sum + parseRupiah(tx.amount), 0);
    const pendingRevenue = financeRows
      .filter((tx) => String(tx.status).toLowerCase().includes('pending'))
      .reduce((sum, tx) => sum + parseRupiah(tx.amount), 0);
    const scholarshipApplications = financeRows.filter((tx) => String(tx.status).toLowerCase().includes('scholarship')).length;
    const fixedCost = financeRealizations
      .filter((row) => financeEntries.find((entry) => entry.id === row.financeEntryId)?.type === 'fixed')
      .reduce((sum, row) => sum + row.amount, 0);
    const variableCost = financeRealizations
      .filter((row) => financeEntries.find((entry) => entry.id === row.financeEntryId)?.type === 'variable')
      .reduce((sum, row) => sum + row.amount, 0);
    const budget = financeEntries.filter((entry) => entry.type === 'budget').reduce((sum, entry) => sum + entry.amount, 0);
    return {
      paidRevenue,
      pendingRevenue,
      scholarshipApplications,
      fixedCost,
      variableCost,
      budget,
      netProfit: paidRevenue - fixedCost - variableCost
    };
  }, [financeRows, financeEntries, financeRealizations]);

  const accountingRows = useMemo(() => {
    const paymentRows = financeRows.map((tx) => {
      const amount = parseRupiah(tx.amount);
      const isIncome = amount > 0 && !String(tx.status).toLowerCase().includes('scholarship') && !String(tx.status).toLowerCase().includes('free');
      return {
        id: `ledger-${tx.id || tx.invoiceNumber}`,
        date: tx.createdAt || tx.date || '-',
        source: tx.invoiceNumber || tx.id || '-',
        description: `Pendaftaran ${tx.program || '-'} - ${tx.packageName || '-'}`,
        account: isIncome ? 'Pendapatan Kelas' : String(tx.status).toLowerCase().includes('scholarship') ? 'Piutang/Kuota Beasiswa' : 'Akun Gratis',
        debit: isIncome ? amount : 0,
        credit: 0,
        status: tx.status || '-'
      };
    });
    const realizationRows = financeRealizations.map((row) => {
      const source = financeEntries.find((entry) => entry.id === row.financeEntryId);
      return {
      id: `ledger-${row.id}`,
      date: row.date,
      source: row.id,
      description: `${row.name}${row.note ? ` - ${row.note}` : ''}`,
      account: source?.type === 'budget' ? `Realisasi Anggaran - ${row.category}` : source?.type === 'fixed' ? `Realisasi Biaya Tetap - ${row.category}` : `Realisasi Biaya Variabel - ${row.category}`,
      debit: 0,
      credit: row.amount,
      status: 'Realized'
    };
    });
    const assetRows = assetEntries.flatMap((asset) => {
      const baseRow = {
        id: `ledger-${asset.id}`,
        date: asset.acquisitionDate,
        source: asset.id,
        description: asset.name,
        account: asset.type === 'fixed_asset' ? `Aset Tetap - ${asset.category}` : `Aset Lancar - ${asset.category}`,
        debit: asset.currentValue,
        credit: 0,
        status: 'Asset Registered'
      };
      if (asset.type !== 'fixed_asset' || asset.depreciationPerMonth <= 0 || nonDepreciableFixedAssetCategories.includes(asset.category)) return [baseRow];
      return [
        baseRow,
        {
          id: `ledger-dep-${asset.id}`,
          date: new Date().toISOString().slice(0, 10),
          source: asset.id,
          description: `Depresiasi bulanan ${asset.name}`,
          account: `Beban Depresiasi - ${asset.category}`,
          debit: 0,
          credit: asset.depreciationPerMonth,
          status: 'Depreciation'
        }
      ];
    });
    return [...paymentRows, ...realizationRows, ...assetRows];
  }, [financeRows, financeEntries, financeRealizations, assetEntries]);

  const financialReports = useMemo(() => {
    const now = new Date();
    const periodLabel = financialReportPeriod === 'monthly'
      ? now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
      : financialReportPeriod === 'quarterly'
        ? `Kuartal ${Math.floor(now.getMonth() / 3) + 1} ${now.getFullYear()}`
        : `Tahun ${now.getFullYear()}`;
    const revenue = financeRows
      .filter((tx) => !String(tx.status).toLowerCase().includes('scholarship') && !String(tx.status).toLowerCase().includes('free'))
      .reduce((sum, tx) => sum + parseRupiah(tx.amount), 0);
    const realizedExpenses = financeRealizations.reduce((sum, row) => sum + row.amount, 0);
    const depreciationExpense = assetEntries
      .filter((asset) => asset.type === 'fixed_asset' && asset.depreciationPerMonth > 0 && !nonDepreciableFixedAssetCategories.includes(asset.category))
      .reduce((sum, asset) => sum + asset.depreciationPerMonth, 0);
    const fixedAssets = assetEntries.filter((asset) => asset.type === 'fixed_asset').reduce((sum, asset) => sum + asset.currentValue, 0);
    const currentAssets = assetEntries.filter((asset) => asset.type === 'current_asset').reduce((sum, asset) => sum + asset.currentValue, 0);
    const pendingReceivable = financeRows.filter((tx) => String(tx.status).toLowerCase().includes('pending')).reduce((sum, tx) => sum + parseRupiah(tx.amount), 0);
    const scholarshipReserve = financeEntries.filter((entry) => entry.type === 'budget' && entry.category.toLowerCase().includes('beasiswa')).reduce((sum, entry) => sum + entry.amount, 0);
    const totalExpenses = realizedExpenses + depreciationExpense;
    const netIncome = revenue - totalExpenses;
    const totalAssets = currentAssets + fixedAssets + pendingReceivable;
    const liabilities = financeSummary.pendingRevenue;
    const equity = totalAssets - liabilities;
    return {
      periodLabel,
      incomeStatement: [
        { label: 'Pendapatan Kelas Berbayar', amount: revenue },
        { label: 'Realisasi Biaya & Anggaran', amount: -realizedExpenses },
        { label: 'Beban Depresiasi Aset Tetap', amount: -depreciationExpense },
        { label: 'Laba/Rugi Bersih', amount: netIncome, total: true }
      ],
      balanceSheet: [
        { label: 'Aset Lancar', amount: currentAssets },
        { label: 'Piutang/Pending Payment', amount: pendingReceivable },
        { label: 'Aset Tetap Bersih', amount: fixedAssets },
        { label: 'Total Aset', amount: totalAssets, total: true },
        { label: 'Kewajiban/Pending Operasional', amount: liabilities },
        { label: 'Cadangan Beasiswa', amount: scholarshipReserve },
        { label: 'Ekuitas Demo', amount: equity, total: true }
      ],
      cashFlow: [
        { label: 'Kas Masuk dari Pembayaran', amount: revenue },
        { label: 'Kas Keluar Realisasi Biaya', amount: -realizedExpenses },
        { label: 'Investasi/Pencatatan Aset', amount: -assetEntries.reduce((sum, asset) => sum + asset.acquisitionValue, 0) },
        { label: 'Arus Kas Bersih Demo', amount: revenue - realizedExpenses - assetEntries.reduce((sum, asset) => sum + asset.acquisitionValue, 0), total: true }
      ]
    };
  }, [financialReportPeriod, financeRows, financeRealizations, assetEntries, financeEntries, financeSummary.pendingRevenue]);
  
  // Question Bank State
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>(['IRT', 'SNBT', 'CPNS', 'Kedokteran', 'Matematika']);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isManageTagsModalOpen, setIsManageTagsModalOpen] = useState(false);
  const [isUploadVideoModalOpen, setIsUploadVideoModalOpen] = useState(false);
  const [videoLessons, setVideoLessons] = useState<VideoLessonRecord[]>(() => readStorageArray('theprams_demo_video_lessons', defaultVideoLessons));
  const [editingVideo, setEditingVideo] = useState<VideoLessonRecord | null>(null);
  const [newTagInput, setNewTagInput] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'completed'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    duration: '',
    program: PROGRAMS[0].title
  });

  const saveVideoLessons = (nextVideos: VideoLessonRecord[]) => {
    setVideoLessons(nextVideos);
    localStorage.setItem('theprams_demo_video_lessons', JSON.stringify(nextVideos));
  };

  const saveVideoEditor = (video: VideoLessonRecord) => {
    if (!video.title.trim()) {
      notify('Judul video wajib diisi.');
      return;
    }
    const sanitized: VideoLessonRecord = {
      ...video,
      title: video.title.trim(),
      program: video.program.trim() || PROGRAMS[0].title,
      duration: video.duration.trim() || '00:00',
      thumbnail: video.thumbnail.trim() || defaultVideoLessons[0].thumbnail,
      tags: video.tags.map((tag) => tag.trim()).filter(Boolean)
    };
    const nextVideos = videoLessons.some((item) => item.id === sanitized.id)
      ? videoLessons.map((item) => item.id === sanitized.id ? sanitized : item)
      : [sanitized, ...videoLessons];
    saveVideoLessons(nextVideos);
    setEditingVideo(null);
    recordAudit('Content Library', 'Save Video Lesson', sanitized.title);
    notify('Detail video berhasil disimpan.');
  };
  
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All' || u.role === roleFilter;
      const matchesDirectory = userDirectoryView === 'students'
        ? u.role === 'Student'
        : u.role !== 'Student';
      return matchesSearch && matchesRole && matchesDirectory;
    });
  }, [users, searchTerm, roleFilter, userDirectoryView]);

  const deleteUser = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus akun ini?')) {
      persistUsers(users.filter(u => u.id !== id));
      notify('User berhasil dihapus.');
    }
  };

  // Question Bank Functions
  const duplicateQuestion = (q: Question) => {
    const newQuestion: Question = {
      ...q,
      id: Date.now().toString(),
      text: `${q.text} (Copy)`
    };
    setQuestions([newQuestion, ...questions]);
    notify('Soal berhasil diduplikasi.');
  };

  const saveQuestion = (updatedQ: Question) => {
    if (questions.find(q => q.id === updatedQ.id)) {
      setQuestions(questions.map(q => q.id === updatedQ.id ? updatedQ : q));
    } else {
      setQuestions([updatedQ, ...questions]);
    }
    setEditingQuestion(null);
    notify('Soal berhasil disimpan.');
  };

  const deleteQuestion = (id: string) => {
    if (confirm('Delete this question?')) {
      setQuestions(questions.filter(q => q.id !== id));
      notify('Soal berhasil dihapus.');
    }
  };

  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus('processing');
    
    // Simulate parsing
    setTimeout(() => {
      const newQuestions: Question[] = [
        { 
          id: (Date.now() + 1).toString(), 
          subject: 'Penalaran Umum', 
          difficulty: 'Medium', 
          text: 'Hasil import CSV 1...', 
          options: [{id: 'A', text: 'Option A'}, {id: 'B', text: 'Option B'}], 
          correctOptionId: 'A', 
          explanation: 'Imported explanation', 
          program: 'SNBT',
          tags: ['CSV Import']
        },
        { 
          id: (Date.now() + 2).toString(), 
          subject: 'Penalaran Matematika', 
          difficulty: 'Hard', 
          text: 'Hasil import CSV 2...', 
          options: [{id: 'A', text: 'Option A'}, {id: 'B', text: 'Option B'}], 
          correctOptionId: 'B', 
          explanation: 'Imported explanation 2', 
          program: 'SKD',
          tags: ['CSV Import']
        }
      ];
      
      setQuestions([...newQuestions, ...questions]);
      setImportStatus('done');
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportStatus('idle');
      }, 1500);
    }, 2000);
  };

  const addTag = (tag: string) => {
    if (!availableTags.includes(tag)) {
      setAvailableTags([...availableTags, tag]);
    }
  };

  const simulateVideoUpload = () => {
    if (!videoForm.title) return;
    setUploadStatus('uploading');
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus('completed');
          setTimeout(() => {
            setIsUploadVideoModalOpen(false);
            setUploadStatus('idle');
            setVideoForm({ title: '', description: '', duration: '', program: PROGRAMS[0].title });
          }, 1500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const toggleQuestionTag = (tag: string) => {
    if (!editingQuestion) return;
    const currentTags = editingQuestion.tags || [];
    const newTags = currentTags.includes(tag) 
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    setEditingQuestion({ ...editingQuestion, tags: newTags });
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-navy text-white border-r border-white/5 hidden lg:flex flex-col shadow-xl">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center font-bold text-xl italic shadow-lg shadow-blue-600/30">
            TP
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none tracking-tight">The Prams</h1>
            <span className="text-[10px] text-blue-400 uppercase tracking-widest font-semibold">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1 overflow-y-auto">
            {[
              { id: 'overview', name: 'Dashboard', icon: PieChartIcon },
              { id: 'leads', name: 'Manage Leads', icon: UserPlus },
              { id: 'inquiries', name: 'Pertanyaan Website', icon: MessageSquare },
              { id: 'users', name: 'User & Roles', icon: Users },
              { id: 'programs', name: 'Programs', icon: Award },
              { id: 'content', name: 'Content Library', icon: Video },
              { id: 'marketing', name: 'Digital Marketing', icon: Megaphone },
              { id: 'website', name: 'Website Editor', icon: Globe },
              { id: 'finance', name: 'Financial Center', icon: Banknote },
              { id: 'questions', name: 'Question Bank', icon: BookOpen },
              { id: 'testimonials', name: 'Testimonials', icon: MessageSquare },
              { id: 'reports', name: 'Deep Analytics', icon: LineChartIcon },
              { id: 'settings', name: 'Settings', icon: Settings },
            ].filter(item => isTabAllowed(item.id as AdminTab)).map((item) => (
             <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-r-lg transition-all border-l-4 ${activeTab === item.id ? 'bg-brand-blue/20 text-brand-blue border-brand-blue font-bold' : 'text-slate-400 hover:text-white border-transparent'}`}
             >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
             </button>
           ))}
        </nav>
        
        <div className="p-6 mt-auto border-t border-white/5 space-y-4">
           {adminRole === 'Super Admin' && (
             <div className="space-y-2 mb-4">
                <p className="text-[8px] font-black text-white/30 uppercase tracking-widest px-1">Role Switcher (Debug)</p>
                <div className="grid grid-cols-1 gap-1">
                   {(['Super Admin', 'Content Manager', 'Support'] as AdminRole[]).map(role => (
                     <button 
                       key={role}
                       onClick={() => {
                         setAdminRole(role);
                         setActiveTab('overview');
                       }}
                       className={`px-2 py-1 rounded text-[8px] font-bold border transition-all ${adminRole === role ? 'bg-white text-brand-navy border-white' : 'border-white/10 text-white/40 hover:border-white/30'}`}
                     >
                        {role}
                     </button>
                   ))}
                </div>
             </div>
           )}
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <img src="https://i.pravatar.cc/150?u=admin" className="w-10 h-10 rounded-xl" alt="Admin" />
                 <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{adminRole === 'Super Admin' ? 'dr. Pramono' : adminRole}</p>
                    <p className="text-[10px] text-emerald-500 font-bold">{adminRole.toUpperCase()}</p>
                 </div>
              </div>
              <button 
                onClick={logout} 
                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                 <LogOut size={18} />
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
          <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
             <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 max-w-md w-full">
                <Search size={18} className="text-slate-400" />
                <input 
                 type="text" 
                 placeholder="Search dashboard..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="bg-transparent border-none text-sm w-full focus:ring-0" 
                />
             </div>
             <div className="flex items-center gap-4">
                <h2 className="hidden md:block text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                  Active: {activeTab}
                </h2>
                <button
                  onClick={() => notify('Notifikasi: 3 pembayaran menunggu verifikasi dan 2 testimoni pending.')}
                  className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 border border-slate-100 relative"
                >
                   <Bell size={20} />
                   <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>
             </div>
          </header>
          <AnimatePresence>
            {actionMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.96 }}
                className="fixed right-6 bottom-6 z-[2000] bg-brand-navy text-white px-5 py-4 rounded-2xl shadow-2xl max-w-sm text-sm font-bold"
              >
                {actionMessage}
              </motion.div>
            )}
          </AnimatePresence>

         <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                   {[
                     { label: 'Total Siswa Aktif', value: '1,284', trend: '+12%', icon: Users2, color: 'text-brand-blue' },
                     { label: 'Active Leads', value: '450', trend: '+25%', icon: UserPlus, color: 'text-brand-orange' },
                     { label: 'Tryout Offline Boyolali', value: '15 Mei', trend: 'Upcoming', icon: MapPin, color: 'text-brand-orange' },
                     { label: 'Revenue (MTD)', value: 'Rp 420jt', trend: '+14%', icon: DollarSign, color: 'text-emerald-500' }
                   ].map((stat, i) => (
                     <div key={i} className="card-premium p-6">
                        <div className="flex justify-between items-start mb-4">
                           <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color}`}>
                              <stat.icon size={24} />
                           </div>
                           <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                              {stat.trend}
                           </span>
                        </div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
                        <p className="text-2xl font-bold text-brand-navy mt-1">{stat.value}</p>
                     </div>
                   ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-2 card-premium p-8">
                      <div className="flex items-center justify-between mb-8">
                         <h3 className="text-xl font-bold text-brand-navy">Growth Analytics</h3>
                         <div className="flex gap-4">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-brand-blue uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-brand-blue" /> Students</span>
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-brand-orange uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-brand-orange" /> Leads</span>
                         </div>
                      </div>
                      <div className="h-80 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                              { name: 'Week 1', students: 40, leads: 120 },
                              { name: 'Week 2', students: 65, leads: 180 },
                              { name: 'Week 3', students: 85, leads: 240 },
                              { name: 'Week 4', students: 120, leads: 310 },
                            ]}>
                               <defs>
                                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                     <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                                     <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                  </linearGradient>
                                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                     <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                                     <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                  </linearGradient>
                               </defs>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                               <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                               <Tooltip 
                                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                               />
                               <Area type="monotone" dataKey="students" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                               <Area type="monotone" dataKey="leads" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                            </AreaChart>
                         </ResponsiveContainer>
                      </div>
                   </div>

                   <div className="card-premium p-8">
                      <h3 className="font-bold text-brand-navy mb-8">Program Popularity</h3>
                      <div className="h-64 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                               <Pie
                                  data={programData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                               >
                                  {programData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                               </Pie>
                               <Tooltip />
                            </PieChart>
                         </ResponsiveContainer>
                      </div>
                      <div className="mt-8 space-y-3">
                         {programData.map((prog, i) => (
                           <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                 <span className="text-xs font-medium text-slate-600">{prog.name}</span>
                              </div>
                              <span className="text-xs font-bold text-brand-navy">{prog.value}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'leads' && (
              <div className="animate-in fade-in duration-500 space-y-6">
                <div className="flex justify-between items-center">
                   <div>
                      <h2 className="text-2xl font-bold text-brand-navy">Lead Management</h2>
                      <p className="text-sm text-slate-500">Capture and convert potential students</p>
                   </div>
                   <button onClick={openNewLeadForm} className="btn-primary py-2 px-6">
                      <Plus size={18} />
                      Add New Lead
                   </button>
                </div>

                <div className="card-premium overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-100">
                         <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Lead Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Interest</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Source</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {allLeads.map((lead) => (
                           <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-6 py-4">
                                 <p className="text-sm font-bold text-brand-navy">{lead.name}</p>
                                 <p className="text-[10px] text-slate-400 font-medium">{lead.email}</p>
                              </td>
                              <td className="px-6 py-4 text-sm font-bold text-slate-600">{lead.programOfInterest}</td>
                              <td className="px-6 py-4">
                                 <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase">{lead.source}</span>
                              </td>
                              <td className="px-6 py-4">
                                 <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                    lead.status === 'Qualified' ? 'bg-emerald-50 text-emerald-600' :
                                    'bg-amber-50 text-amber-600'
                                 }`}>
                                    {lead.status}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex items-center justify-end gap-2 group-hover:opacity-100 opacity-0 transition-opacity">
                                    <button
                                      onClick={() => setLeadPendingConvert(lead)}
                                      className="p-2 text-brand-blue hover:bg-blue-50 rounded-lg"
                                      title="Convert to Student"
                                    >
                                       <UserPlus size={16} />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedLead(lead);
                                        setLeadNoteDraft(lead.note || '');
                                      }}
                                      className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"
                                      title="Detail Lead"
                                    >
                                       <MoreVertical size={16} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              </div>
            )}

             {activeTab === 'users' && (
              <div className="animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                   <div>
                      <h2 className="text-2xl font-bold text-brand-navy">User Management & Permissions</h2>
                      <p className="text-sm text-slate-500">Control role assignments and granular access levels</p>
                   </div>
                   <div className="flex flex-wrap items-center gap-3">
                      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                        <button onClick={() => setUserDirectoryView('students')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${userDirectoryView === 'students' ? 'bg-white shadow-sm text-brand-navy' : 'text-slate-400 hover:text-slate-600'}`}>
                          User Siswa
                        </button>
                        <button onClick={() => setUserDirectoryView('staff')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${userDirectoryView === 'staff' ? 'bg-white shadow-sm text-brand-navy' : 'text-slate-400 hover:text-slate-600'}`}>
                          Admin & Staff
                        </button>
                      </div>
                      <button 
                        onClick={() => openNewUserForm('student')}
                        className="btn-secondary py-2 px-5"
                      >
                         <Plus size={18} />
                         Add User Siswa
                      </button>
                      <button 
                        onClick={() => openNewUserForm('staff')}
                        className="btn-primary py-2 px-5"
                      >
                         <Plus size={18} />
                         Add User Admin
                      </button>
                      <button
                        onClick={() => {
                          syncApprovedStudentsToUsers();
                          notify('Daftar siswa disinkronkan dari registrasi, pembayaran approved, dan beasiswa approved.');
                        }}
                        className="btn-secondary py-2 px-5"
                      >
                         <RefreshCw size={18} />
                         Sync Approved
                      </button>
                   </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total User', value: users.length, icon: Users, color: 'text-brand-blue' },
                    { label: 'Student', value: users.filter((item) => item.role === 'Student').length, icon: GraduationCap, color: 'text-emerald-500' },
                    { label: 'Gratis', value: users.filter((item) => item.role === 'Student' && item.accountType === 'Free').length, icon: CheckCircle2, color: 'text-emerald-500' },
                    { label: 'Berbayar/Beasiswa', value: users.filter((item) => item.role === 'Student' && ['Paid', 'Scholarship'].includes(String(item.accountType))).length, icon: Award, color: 'text-brand-orange' },
                  ].map((stat) => (
                    <div key={stat.label} className="card-premium p-5 bg-white">
                      <stat.icon size={20} className={`${stat.color} mb-3`} />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-2xl font-black text-brand-navy mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="card-premium overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-100">
                         <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User Details</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">System Role</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Tipe Akun</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Access Level</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {filteredUsers.map((user) => (
                           <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                    <div className="relative">
                                      <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover" alt="" />
                                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                                    </div>
                                    <div>
                                       <p className="text-sm font-bold text-brand-navy">{user.name || 'New User'}</p>
                                       <p className="text-[10px] text-slate-400 font-medium">{user.email || 'pending email'}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <select 
                                    value={user.role}
                                    onChange={(e) => {
                                      const nextRole = e.target.value as UserAccount['role'];
                                      const updatedUsers = users.map((u) => {
                                        const nextAccountType: UserAccount['accountType'] = nextRole === 'Student' ? (u.accountType === 'Staff' ? 'Free' : u.accountType || 'Free') : 'Staff';
                                        return u.id === user.id ? { ...u, role: nextRole, accountType: nextAccountType } : u;
                                      });
                                      persistUsers(updatedUsers);
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest outline-none border border-transparent transition-all hover:border-slate-200 ${
                                       user.role === 'Admin' ? 'bg-purple-50 text-purple-600' :
                                       user.role === 'Tutor' || user.role === 'Content Manager' ? 'bg-amber-50 text-amber-600' :
                                       'bg-blue-50 text-brand-blue'
                                    }`}
                                 >
                                    <option value="Admin">Super Admin</option>
                                    <option value="Content Manager">Content Manager</option>
                                    <option value="Support">Support Staff</option>
                                    <option value="Tutor">Educator</option>
                                    <option value="Student">Student User</option>
                                 </select>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                  user.accountType === 'Scholarship' ? 'bg-indigo-50 text-indigo-600' :
                                  user.accountType === 'Paid' ? 'bg-amber-50 text-amber-600' :
                                  user.accountType === 'Staff' ? 'bg-slate-100 text-slate-500' :
                                  'bg-emerald-50 text-emerald-600'
                                }`}>
                                  {user.accountType || (user.role === 'Student' ? 'Free' : 'Staff')}
                                </span>
                                <p className="text-[10px] text-slate-400 mt-1">{user.packageName || '-'}</p>
                                <p className="text-[10px] text-slate-400">{user.paymentStatus || user.source || '-'}</p>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex flex-wrap gap-1 max-w-[200px]">
                                    {rolePermissions[(user.role as any) === 'Admin' ? 'Super Admin' : (user.role as any)]?.slice(0, 3).map(tab => (
                                      <span key={tab} className="text-[8px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{tab}</span>
                                    ))}
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => notify(`Hak akses ${user.name || 'New User'} mengikuti role: ${user.role}.`)} className="p-2 text-slate-400 hover:text-brand-blue transition-colors">
                                       <Shield size={16} />
                                    </button>
                                    <button onClick={() => setEditingUser(user)} className="p-2 text-slate-400 hover:text-brand-blue transition-colors">
                                       <Edit2 size={16} />
                                    </button>
                                    <button 
                                      onClick={() => deleteUser(user.id)}
                                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                       <Trash2 size={16} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              </div>
            )}

            {/* Feedback Tab content skipped for brevity... */}

            {activeTab === 'inquiries' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy">Pertanyaan dari Website</h2>
                    <p className="text-sm text-slate-500">Menampung semua pertanyaan dari form kontak dan tombol WhatsApp, termasuk nomor penanya.</p>
                  </div>
                  <button
                    onClick={() => {
                      const latest = readStorageArray<WebsiteQuestion>('theprams_demo_website_questions');
                      setWebsiteQuestions(latest);
                      notify('Data pertanyaan website disinkronkan.');
                    }}
                    className="btn-secondary py-2 px-5 flex items-center gap-2"
                  >
                    <RefreshCw size={18} /> Sync Data
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { label: 'Total Pertanyaan', value: websiteQuestions.length, color: 'text-brand-blue' },
                    { label: 'Belum Dibalas', value: websiteQuestions.filter((q) => q.status === 'Baru').length, color: 'text-brand-orange' },
                    { label: 'Sudah Dibalas', value: websiteQuestions.filter((q) => q.status === 'Dibalas').length, color: 'text-emerald-500' },
                  ].map((stat) => (
                    <div key={stat.label} className="card-premium p-6">
                      <MessageSquare className={`${stat.color} mb-3`} size={22} />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-3xl font-black text-brand-navy mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  {websiteQuestions.length === 0 && (
                    <div className="card-premium p-10 text-center">
                      <p className="font-bold text-brand-navy">Belum ada pertanyaan masuk.</p>
                      <p className="text-sm text-slate-500 mt-1">Pertanyaan dari halaman kontak dan direct WhatsApp akan muncul di sini.</p>
                    </div>
                  )}
                  {websiteQuestions.map((question) => (
                    <div key={question.id} className="card-premium p-6 bg-white">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${question.status === 'Dibalas' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{question.status}</span>
                            <span className="px-2 py-1 rounded-lg bg-blue-50 text-brand-blue text-[10px] font-black uppercase">{question.source}</span>
                            <span className="text-[10px] text-slate-400 font-bold">{question.createdAt}</span>
                          </div>
                          <h3 className="text-lg font-black text-brand-navy">{question.name}</h3>
                          <p className="text-xs text-slate-500 mt-1">{question.email} - WA: {question.phone || '-'}</p>
                          <p className="text-xs font-bold text-brand-blue mt-1">{question.programOfInterest}</p>
                          <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{question.question}</p>
                          </div>
                        </div>
                        <div className="lg:w-[420px] space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Jawaban Admin</label>
                          <textarea
                            id={`answer-${question.id}`}
                            defaultValue={question.adminAnswer || `Halo ${question.name}, terima kasih sudah menghubungi The Prams. `}
                            className="w-full h-32 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm text-slate-600"
                          />
                          {question.answeredAt && <p className="text-[10px] text-slate-400">Terakhir dijawab: {question.answeredAt}</p>}
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const textarea = document.getElementById(`answer-${question.id}`) as HTMLTextAreaElement | null;
                                saveWebsiteQuestionAnswer(question, textarea?.value || '');
                              }}
                              className="flex-1 btn-primary py-2.5"
                            >
                              <Save size={16} /> Simpan Jawaban
                            </button>
                            <button onClick={() => openQuestionWhatsapp(question)} className="px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 font-black text-xs">
                              WhatsApp
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy">Content Management</h2>
                    <p className="text-sm text-slate-500">Manage video lessons and learning materials</p>
                  </div>
                  <button 
                    onClick={() => setIsUploadVideoModalOpen(true)}
                    className="btn-primary py-2 px-6 flex items-center gap-2"
                  >
                    <Plus size={18} /> Upload Video
                  </button>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <div className="card-premium p-6">
                    <Video className="text-brand-blue mb-4" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Videos</p>
                    <p className="text-3xl font-black text-brand-navy">{videoLessons.length}</p>
                  </div>
                  <div className="card-premium p-6">
                    <Clock className="text-brand-orange mb-4" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Watch Time</p>
                    <p className="text-3xl font-black text-brand-navy">8.5k hrs</p>
                  </div>
                  <div className="card-premium p-6">
                    <Users className="text-indigo-500 mb-4" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Viewers</p>
                    <p className="text-3xl font-black text-brand-navy">842</p>
                  </div>
                  <div className="card-premium p-6">
                    <CheckCircle2 className="text-emerald-500 mb-4" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Completion</p>
                    <p className="text-3xl font-black text-brand-navy">{Math.round((videoLessons.filter((video) => video.status === 'Published').length / Math.max(videoLessons.length, 1)) * 100)}%</p>
                  </div>
                </div>

                <div className="card-premium p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-brand-navy">Recent Lessons</h3>
                    <div className="flex gap-2">
                      <select className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none">
                        <option>All Programs</option>
                        <option>Kedokteran Express</option>
                        <option>SNBT Intensive</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {videoLessons.map((video) => (
                      <div key={video.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-brand-blue/30 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-10 bg-slate-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                            <img src={video.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="" />
                            <Play size={16} className="text-slate-400 group-hover:text-brand-blue relative z-10" />
                            <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-brand-navy">{video.title}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{video.program}</p>
                            <div className="flex gap-1 mt-1">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${video.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : video.status === 'Draft' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>{video.status}</span>
                              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-brand-blue text-[8px] font-black uppercase">{video.access}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-8 text-right">
                          <div className="hidden md:block">
                            <p className="text-xs font-bold text-brand-navy">{video.duration}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Duration</p>
                          </div>
                          <div className="hidden md:block">
                            <p className="text-xs font-bold text-brand-navy">{video.views}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Views</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setEditingVideo(video)} className="p-2 text-slate-300 hover:text-brand-blue transition-colors"><Edit2 size={16} /></button>
                            <button onClick={() => {
                              saveVideoLessons(videoLessons.filter((item) => item.id !== video.id));
                              notify(`Video "${video.title}" dihapus dari daftar demo.`);
                            }} className="p-2 text-slate-300 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'marketing' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy">Marketing & Campaigns</h2>
                    <p className="text-sm text-slate-500">Manage landing pages and monitor conversion funnels</p>
                  </div>
                  <button onClick={openNewCampaign} className="btn-primary py-2 px-6 flex items-center gap-2">
                    <Plus size={18} /> New Campaign
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <button onClick={() => openMarketingMetricDetail('conversion')} className="card-premium p-6 text-left hover:-translate-y-1 transition-all">
                    <TrendingUp className="text-emerald-500 mb-4" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Conversion Rate</p>
                    <p className="text-3xl font-black text-brand-navy">
                      {marketingCampaigns.reduce((sum, item) => sum + item.clicks, 0) ? ((marketingCampaigns.reduce((sum, item) => sum + item.leads, 0) / marketingCampaigns.reduce((sum, item) => sum + item.clicks, 0)) * 100).toFixed(1) : '0.0'}%
                    </p>
                    <p className="text-[10px] text-emerald-500 font-bold mt-2">Click to lead rate | Klik untuk detail</p>
                  </button>
                  <button onClick={() => openMarketingMetricDetail('leads')} className="card-premium p-6 text-left hover:-translate-y-1 transition-all">
                    <Users className="text-brand-blue mb-4" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Leads</p>
                    <p className="text-3xl font-black text-brand-navy">{marketingCampaigns.reduce((sum, item) => sum + item.leads, 0).toLocaleString('id-ID')}</p>
                    <p className="text-[10px] text-brand-blue font-bold mt-2">{marketingCampaigns.filter((item) => item.status === 'Active').length} active campaigns | Klik untuk detail</p>
                  </button>
                  <button onClick={() => openMarketingMetricDetail('roi')} className="card-premium p-6 text-left hover:-translate-y-1 transition-all">
                    <Target className="text-brand-orange mb-4" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total ROI</p>
                    <p className="text-3xl font-black text-brand-navy">
                      {marketingCampaigns.reduce((sum, item) => sum + item.budget, 0) ? (marketingCampaigns.reduce((sum, item) => sum + item.revenue, 0) / marketingCampaigns.reduce((sum, item) => sum + item.budget, 0)).toFixed(1) : '0.0'}x
                    </p>
                    <p className="text-[10px] text-brand-orange font-bold mt-2">Revenue {formatRupiah(marketingCampaigns.reduce((sum, item) => sum + item.revenue, 0))} | Klik untuk detail</p>
                  </button>
                </div>

                <div className="card-premium p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-brand-navy">Campaign Workspace</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{marketingCampaigns.length} campaigns</span>
                  </div>
                  <div className="space-y-4">
                    {marketingCampaigns.map((campaign) => {
                      const hydratedCampaign = hydrateCampaign(campaign);
                      const clickRate = hydratedCampaign.views ? (hydratedCampaign.clicks / hydratedCampaign.views) * 100 : 0;
                      const conversionRate = hydratedCampaign.clicks ? (hydratedCampaign.leads / hydratedCampaign.clicks) * 100 : 0;
                      const roi = hydratedCampaign.budget ? hydratedCampaign.revenue / hydratedCampaign.budget : 0;
                      const agentInsight = getCampaignAgentInsight(hydratedCampaign);
                      return (
                        <div key={hydratedCampaign.id} className="p-5 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                          <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-5">
                            <div className="flex items-start gap-4 min-w-0">
                              <div className="p-3 bg-white shadow-sm rounded-xl"><Megaphone size={18} className="text-brand-blue" /></div>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <p className="text-sm font-bold text-brand-navy">{hydratedCampaign.name}</p>
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${hydratedCampaign.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : hydratedCampaign.status === 'Paused' ? 'bg-amber-50 text-amber-600' : hydratedCampaign.status === 'Completed' ? 'bg-blue-50 text-brand-blue' : 'bg-slate-100 text-slate-400'}`}>
                                    {hydratedCampaign.status}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-mono">{hydratedCampaign.landingPageUrl}</p>
                                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{hydratedCampaign.headline} | CTA: {hydratedCampaign.cta}</p>
                                <p className="text-[10px] text-brand-blue font-black uppercase tracking-widest mt-2">{hydratedCampaign.instrumentType}: {hydratedCampaign.instrumentName}</p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {hydratedCampaign.channels.map((channel) => (
                                    <span key={channel} className="px-2.5 py-1 rounded-lg bg-white border border-slate-100 text-[10px] font-bold text-slate-500">{channel}</span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 xl:min-w-[520px]">
                              {[
                                { label: 'Views', value: hydratedCampaign.views.toLocaleString('id-ID') },
                                { label: 'CTR', value: `${clickRate.toFixed(1)}%` },
                                { label: 'Leads', value: `${hydratedCampaign.leads}/${hydratedCampaign.targetLeads}` },
                                { label: 'Reg.', value: hydratedCampaign.registrations.toLocaleString('id-ID') },
                                { label: 'ROI', value: `${roi.toFixed(1)}x` }
                              ].map((metric) => (
                                <div key={metric.label} className="rounded-xl bg-white border border-slate-100 p-3">
                                  <p className="text-xs font-black text-brand-navy">{metric.value}</p>
                                  <p className="text-[9px] text-slate-400 uppercase tracking-widest">{metric.label}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-5 grid md:grid-cols-4 gap-3">
                            {[
                              { label: 'Views', value: hydratedCampaign.views },
                              { label: 'Clicks', value: hydratedCampaign.clicks },
                              { label: 'Leads', value: hydratedCampaign.leads },
                              { label: 'Registrations', value: hydratedCampaign.registrations }
                            ].map((step, index, arr) => {
                              const max = arr[0].value || 1;
                              return (
                                <div key={step.label} className="rounded-xl bg-white border border-slate-100 p-3">
                                  <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-2">
                                    <span>{step.label}</span>
                                    <span>{step.value.toLocaleString('id-ID')}</span>
                                  </div>
                                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                                    <div className="h-full bg-brand-blue" style={{ width: `${Math.max(4, Math.min(100, (step.value / max) * 100))}%` }} />
                                  </div>
                                  {index > 0 && <p className="text-[9px] text-slate-400 mt-2">{arr[index - 1].value ? ((step.value / arr[index - 1].value) * 100).toFixed(1) : '0.0'}% dari tahap sebelumnya</p>}
                                </div>
                              );
                            })}
                          </div>

                          <div className="mt-5 grid lg:grid-cols-3 gap-3">
                            <div className="lg:col-span-2 rounded-2xl bg-blue-50 border border-blue-100 p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Rocket size={16} className="text-brand-blue" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-blue">AI Agent Analysis</p>
                              </div>
                              <p className="text-xs font-bold text-brand-navy leading-relaxed">{agentInsight.recommendation}</p>
                              <p className="text-[10px] text-slate-500 mt-2">CPL target: {formatRupiah(agentInsight.plannedCpl)} | Lead harian: {agentInsight.targetDailyLeads}/hari | Channel utama: {agentInsight.primaryChannel}</p>
                            </div>
                            <div className="rounded-2xl bg-white border border-slate-100 p-4">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Channel Routing</p>
                              <div className="flex flex-wrap gap-2">
                                {campaign.channels.map((channel) => (
                                  <button key={channel} onClick={() => openMarketingChannel(hydratedCampaign, channel)} className="px-3 py-2 rounded-xl bg-slate-50 text-[10px] font-bold text-slate-600 hover:text-brand-blue">
                                    {channel}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                            <div className="text-xs text-slate-500">
                              <span className="font-bold text-brand-navy">{hydratedCampaign.program}</span> | {hydratedCampaign.goal} | Budget {formatRupiah(hydratedCampaign.budget)}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button onClick={() => setEditingCampaign(hydratedCampaign)} className="px-3 py-2 rounded-xl border border-slate-100 text-xs font-bold text-slate-500 hover:text-brand-blue flex items-center gap-2"><Edit2 size={14} /> Edit</button>
                              <button onClick={() => captureCampaignLead(hydratedCampaign)} className="px-3 py-2 rounded-xl border border-slate-100 text-xs font-bold text-slate-500 hover:text-emerald-600 flex items-center gap-2"><UserPlus size={14} /> Lead</button>
                              <button onClick={() => duplicateCampaign(hydratedCampaign)} className="px-3 py-2 rounded-xl border border-slate-100 text-xs font-bold text-slate-500 hover:text-brand-blue flex items-center gap-2"><Copy size={14} /> Duplicate</button>
                              {hydratedCampaign.status !== 'Active' && <button onClick={() => updateCampaignStatus(hydratedCampaign, 'Active')} className="px-3 py-2 rounded-xl bg-emerald-50 text-xs font-bold text-emerald-600 flex items-center gap-2"><CheckCircle2 size={14} /> Publish</button>}
                              {hydratedCampaign.status === 'Active' && <button onClick={() => updateCampaignStatus(hydratedCampaign, 'Paused')} className="px-3 py-2 rounded-xl bg-amber-50 text-xs font-bold text-amber-600 flex items-center gap-2"><Clock size={14} /> Pause</button>}
                              <button onClick={() => deleteCampaign(hydratedCampaign)} className="px-3 py-2 rounded-xl bg-red-50 text-xs font-bold text-red-500 flex items-center gap-2"><Trash2 size={14} /> Delete</button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {!marketingCampaigns.length && (
                      <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl">
                        <Megaphone className="mx-auto text-slate-300 mb-3" size={32} />
                        <p className="text-sm font-bold text-brand-navy">Belum ada campaign</p>
                        <button onClick={openNewCampaign} className="btn-primary py-2 px-5 mt-4 inline-flex items-center gap-2"><Plus size={16} /> New Campaign</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'website' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy">Website Editor Panel</h2>
                    <p className="text-sm text-slate-500">Panel editing visual untuk mengatur UI, konten, layout, brand, responsive behavior, dan SEO website publik.</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setView?.('landing')} className="btn-secondary py-2 px-6">Preview Changes</button>
                    <button onClick={() => setIsSaveWebsiteConfirmOpen(true)} className="btn-secondary py-2 px-6">Save Changes</button>
                    <button onClick={() => notify('Update website dipublikasikan di mode demo.')} className="btn-primary py-2 px-6">Publish Updates</button>
                  </div>
                </div>

                <div className="card-premium p-8 bg-white">
                  <h3 className="font-bold text-brand-navy mb-6">Rincian Menu Website Editor</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: 'Preview Changes', detail: 'Melihat hasil perubahan draft di halaman landing sebelum disimpan atau dipublikasikan.' },
                      { name: 'Save Changes', detail: 'Menyimpan draft konfigurasi UI. Saat diklik muncul konfirmasi Iya/Tidak.' },
                      { name: 'Publish Updates', detail: 'Mempublikasikan draft agar dianggap aktif di website publik pada mode demo.' },
                      { name: 'Home Hero Section', detail: 'Mengubah konten hero, gambar, overlay, tinggi section, dan alignment teks.' },
                      { name: 'Section Builder', detail: 'Mengatur urutan section, menambah section, toggle visibility, dan membuka editor section.' },
                      { name: 'Typography System', detail: 'Mengatur gaya heading, body text, dan button text agar konsisten.' },
                      { name: 'CTA & Button Style', detail: 'Mengatur teks tombol, gaya button, dan tampilan CTA utama.' },
                      { name: 'Global Navigation', detail: 'Mengatur item navbar, tambah menu, dan hapus menu dari draft.' },
                      { name: 'Brand Identity', detail: 'Mengatur warna brand, card radius, surface style, dan shadow system.' },
                      { name: 'Responsive Controls', detail: 'Mengatur perilaku UI di mobile/tablet seperti stacking, spacing, dan visibility.' },
                      { name: 'Reusable Components', detail: 'Membuka editor komponen yang dipakai berulang: card, accordion, testimonial, footer.' },
                      { name: 'SEO Metadata', detail: 'Mengatur preview Google, SEO title, meta description, dan SEO tags.' },
                    ].map((item) => (
                      <div key={item.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <p className="text-sm font-black text-brand-navy mb-1">{item.name}</p>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-premium p-8 bg-white">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="font-bold text-brand-navy">Editor Info Menarik & Literasi</h3>
                      <p className="text-xs text-slate-500 mt-1">Tulis, edit, dan publish blog/artikel literasi yang tampil di menu Info Menarik.</p>
                    </div>
                    <button
                      onClick={() => setEditingBlogPost({
                        id: `blog-${Date.now()}`,
                        title: 'Artikel Literasi Baru',
                        excerpt: 'Ringkasan singkat artikel untuk kartu Info Menarik.',
                        content: '# Artikel Literasi Baru\n\nTulis isi artikel di sini.',
                        author: 'Admin The Prams',
                        authorRole: 'Content Specialist',
                        authorAvatar: 'https://i.pravatar.cc/150?u=admin',
                        category: 'Literasi',
                        image: BLOG_POSTS[0].image,
                        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                        readTime: '5 min read',
                        tags: ['Literasi']
                      })}
                      className="btn-primary py-2 px-5 flex items-center gap-2"
                    >
                      <Plus size={18} /> Tulis Artikel
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {blogPostDrafts.map((post) => (
                      <div key={post.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-slate-100">
                          <img src={post.image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 rounded-lg bg-blue-50 text-brand-blue text-[9px] font-black uppercase">{post.category}</span>
                          <span className="text-[9px] text-slate-400 font-bold">{post.readTime}</span>
                        </div>
                        <p className="text-sm font-black text-brand-navy line-clamp-2">{post.title}</p>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">{post.excerpt}</p>
                        <div className="flex gap-2 mt-4">
                          <button onClick={() => setEditingBlogPost(post)} className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-brand-blue uppercase">Edit</button>
                          <button
                            onClick={() => {
                              const nextPosts = blogPostDrafts.filter((item) => item.id !== post.id);
                              setBlogPostDrafts(nextPosts);
                              onBlogPostsChange?.(nextPosts);
                              notify('Artikel dihapus dari Info Menarik.');
                            }}
                            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-300 hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { title: 'Hero Section', desc: 'Mengatur judul utama, sub-headline, dan gambar pembuka halaman depan.', icon: Layout },
                    { title: 'Navigation', desc: 'Mengelola menu navbar publik seperti Beranda, Program, Tryout, Testimoni, dan Kontak.', icon: Globe },
                    { title: 'Brand Identity', desc: 'Meninjau warna brand utama dan sekunder yang dipakai di landing page.', icon: ImageIcon },
                    { title: 'SEO Metadata', desc: 'Mengatur judul pencarian, deskripsi Google preview, dan tag SEO dasar.', icon: Search },
                    { title: 'Typography', desc: 'Mengatur skala heading, gaya body text, weight, dan jarak antar elemen.', icon: FileText },
                    { title: 'Section Layout', desc: 'Mengatur urutan section, padding, container width, dan visibilitas blok halaman.', icon: Layout },
                    { title: 'CTA Buttons', desc: 'Mengatur teks tombol utama, link tujuan, warna, radius, dan gaya hover.', icon: Target },
                    { title: 'Responsive UI', desc: 'Mengontrol tampilan desktop/mobile, spacing, dan prioritas konten di layar kecil.', icon: Smartphone },
                  ].map((item) => (
                    <div key={item.title} className="card-premium p-5 bg-white">
                      <item.icon size={20} className="text-brand-blue mb-3" />
                      <p className="text-sm font-black text-brand-navy mb-1">{item.title}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="card-premium p-8">
                      <h3 className="font-bold text-brand-navy mb-6">Home Hero Section</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Hero Title</label>
                          <input className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold" defaultValue="Wujudkan Mimpi Menjadi Dokter Bersama The Prams" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Sub-headline</label>
                          <textarea className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 h-24" defaultValue="Bimbingan belajar spesialis persiapan masuk Kedokteran dan sekolah kedinasan dengan metode penalaran yang teruji." />
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          <ImageIcon className="text-slate-300" size={32} />
                          <div className="flex-1">
                            <p className="text-xs font-bold text-brand-navy">Hero Background Image</p>
                            <p className="text-[10px] text-slate-400">Recommended: 1920x1080px (Max 2MB)</p>
                          </div>
                          <button onClick={() => notify('Pemilih gambar hero dibuka di mode demo.')} className="px-4 py-2 bg-white rounded-lg text-[10px] font-bold text-brand-blue border border-slate-200">Change Image</button>
                        </div>
                        <div className="grid md:grid-cols-3 gap-3">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Hero Height</label>
                            <select onChange={() => notify('Tinggi hero diperbarui di draft.')} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold">
                              <option>Large 750px</option>
                              <option>Medium 640px</option>
                              <option>Compact 520px</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Overlay</label>
                            <select onChange={() => notify('Overlay hero diperbarui di draft.')} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold">
                              <option>Navy Gradient</option>
                              <option>Dark Soft</option>
                              <option>Light Clean</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Text Align</label>
                            <select onChange={() => notify('Alignment hero diperbarui di draft.')} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold">
                              <option>Left</option>
                              <option>Center</option>
                              <option>Right</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card-premium p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-brand-navy">Section Builder</h3>
                        <button onClick={() => notify('Section baru ditambahkan ke draft halaman.')} className="px-4 py-2 border border-dashed border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest">+ Add Section</button>
                      </div>
                      <div className="space-y-3">
                        {[
                          { name: 'Hero Carousel', status: 'Visible', order: '01' },
                          { name: 'Program Unggulan', status: 'Visible', order: '02' },
                          { name: 'Why Choose The Prams', status: 'Visible', order: '03' },
                          { name: 'Mentor Preview', status: 'Visible', order: '04' },
                          { name: 'Testimonials', status: 'Hidden Mobile', order: '05' },
                          { name: 'FAQ Section', status: 'Visible', order: '06' },
                        ].map((section) => (
                          <div key={section.name} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black text-slate-400">{section.order}</span>
                              <div>
                                <p className="text-sm font-bold text-brand-navy">{section.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{section.status}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => notify(`${section.name} dipindahkan ke atas.`)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold">Up</button>
                              <button onClick={() => notify(`Visibilitas ${section.name} diubah.`)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold">Toggle</button>
                              <button onClick={() => notify(`Editor ${section.name} dibuka.`)} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-brand-blue">Edit</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="card-premium p-8">
                        <h3 className="font-bold text-brand-navy mb-6">Typography System</h3>
                        <div className="space-y-4">
                          {['H1 Display', 'Section Heading', 'Body Text', 'Button Text'].map((type) => (
                            <div key={type} className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-500">{type}</span>
                              <select onChange={() => notify(`${type} typography diperbarui.`)} className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-bold">
                                <option>Default</option>
                                <option>Compact</option>
                                <option>Bold</option>
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="card-premium p-8">
                        <h3 className="font-bold text-brand-navy mb-6">CTA & Button Style</h3>
                        <div className="space-y-4">
                          <input className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold" defaultValue="Lihat Program" />
                          <input className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold" defaultValue="Ikut Tryout Gratis" />
                          <div className="grid grid-cols-3 gap-3">
                            {['Solid', 'Outline', 'Soft'].map((style) => (
                              <button key={style} onClick={() => notify(`Style CTA ${style} dipilih.`)} className="py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase">{style}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card-premium p-8">
                      <h3 className="font-bold text-brand-navy mb-6">Global Navigation</h3>
                      <div className="flex flex-wrap gap-3">
                        {['Beranda', 'Program', 'Tryout', 'Testimoni', 'Kontak'].map(nav => (
                          <div key={nav} className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                            <span className="text-sm font-bold text-brand-navy">{nav}</span>
                            <button onClick={() => notify(`Menu ${nav} dihapus dari draft navigasi.`)} className="text-slate-300 hover:text-red-400"><X size={14} /></button>
                          </div>
                        ))}
                        <button onClick={() => notify('Menu baru ditambahkan ke draft navigasi.')} className="px-4 py-2 border border-dashed border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest">+ Add Menu</button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="card-premium p-8 bg-brand-navy text-white">
                      <h3 className="font-bold mb-6">Brand Identity</h3>
                      <div className="space-y-6">
                        <div>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Primary Color</p>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-blue rounded-xl" />
                            <code className="text-xs text-white/60">#2563EB</code>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Secondary Color</p>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-orange rounded-xl" />
                            <code className="text-xs text-white/60">#F59E0B</code>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Surface & Border Radius</p>
                          <div className="grid grid-cols-2 gap-3">
                            <select onChange={() => notify('Style card diperbarui.')} className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-xs">
                              <option>Card 8px</option>
                              <option>Card 12px</option>
                              <option>Card 16px</option>
                            </select>
                            <select onChange={() => notify('Shadow system diperbarui.')} className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-xs">
                              <option>Soft Shadow</option>
                              <option>Flat</option>
                              <option>Elevated</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card-premium p-8">
                      <h3 className="font-bold text-brand-navy mb-4">Responsive Controls</h3>
                      <div className="space-y-3">
                        {[
                          'Mobile hero text wraps before CTA',
                          'Hide decorative stats on small screens',
                          'Stack program cards on mobile',
                          'Compress navbar spacing on tablet',
                        ].map((rule) => (
                          <button key={rule} onClick={() => notify(`${rule} diperbarui.`)} className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-left">
                            <span className="text-xs font-bold text-slate-600">{rule}</span>
                            <CheckCircle2 size={16} className="text-emerald-500" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="card-premium p-8">
                      <h3 className="font-bold text-brand-navy mb-4">Reusable Components</h3>
                      <div className="space-y-3">
                        {['Program Card', 'Mentor Card', 'FAQ Accordion', 'Testimonial Card', 'Footer Block'].map((component) => (
                          <button key={component} onClick={() => notify(`Editor komponen ${component} dibuka.`)} className="w-full py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:text-brand-blue">
                            Edit {component}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="card-premium p-8">
                       <h3 className="font-bold text-brand-navy mb-4">SEO Metadata</h3>
                       <div className="space-y-4">
                          <div className="p-3 bg-blue-50 rounded-xl">
                             <p className="text-[10px] font-bold text-brand-blue mb-1">Google Preview</p>
                             <p className="text-sm font-bold text-blue-800 line-clamp-1">The Prams - Bimbingan Belajar Kedokteran...</p>
                             <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">Lulus seleksi kampus impian dengan metode penalaran kedokteran eksklusif dr. Pramono.</p>
                          </div>
                          <button onClick={() => notify('Editor SEO tags dibuka.')} className="w-full py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-widest">Edit SEO Tags</button>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'finance' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy">Pusat Keuangan</h2>
                    <p className="text-sm text-slate-500">Transaksi pendaftaran, invoice, bukti bayar, beasiswa, biaya, dan anggaran demo.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={refreshFinanceCenter} className="btn-secondary py-2 px-5 flex items-center gap-2">
                      <RefreshCw size={18} /> Sync Data
                    </button>
                    <button
                      onClick={() => {
                        const rows = [
                          'type,name,program,package,amount,status,date',
                          ...financeRows.map((tx) => `transaction,"${tx.student || '-'}","${tx.program || '-'}","${tx.packageName || '-'}","${tx.amount || 0}","${tx.status || '-'}","${tx.date || tx.createdAt || '-'}"`),
                          ...financeEntries.map((entry) => `${entry.type},"${entry.name}","${entry.category}","${entry.period}",${entry.amount},"${entry.note}","${entry.createdAt}"`),
                          ...paymentProofs.map((proof) => `document,"${proof.student || '-'}","${proof.program || '-'}","${proof.packageName || '-'}","${proof.fileName || '-'}","${proof.status || '-'}","${proof.createdAt || '-'}"`)
                        ];
                        downloadTextFile('finance-center-report.csv', rows.join('\n'));
                      }}
                      className="btn-secondary py-2 px-5 flex items-center gap-2"
                    >
                      <Download size={18} /> Export Report
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { label: 'Revenue Tercatat', value: formatRupiah(financeSummary.paidRevenue), color: 'text-brand-blue', icon: Banknote, description: 'Transaksi berbayar yang tercatat sebagai pendapatan.', rows: financeRows.filter((tx) => !String(tx.status).toLowerCase().includes('scholarship') && !String(tx.status).toLowerCase().includes('free') && parseRupiah(tx.amount) > 0) },
                    { label: 'Pending Payment', value: formatRupiah(financeSummary.pendingRevenue), color: 'text-brand-orange', icon: Clock, description: 'Transaksi yang masih menunggu pembayaran atau verifikasi admin.', rows: financeRows.filter((tx) => String(tx.status).toLowerCase().includes('pending')) },
                    { label: 'Net Profit Demo', value: formatRupiah(financeSummary.netProfit), color: financeSummary.netProfit >= 0 ? 'text-emerald-500' : 'text-red-500', icon: TrendingUp, description: 'Perhitungan demo: revenue tercatat dikurangi biaya tetap dan biaya variabel.', rows: [
                      { student: 'Revenue Tercatat', program: 'Pendapatan', amount: formatRupiah(financeSummary.paidRevenue), status: 'Debit' },
                      { student: 'Biaya Tetap', program: 'Pengeluaran', amount: formatRupiah(financeSummary.fixedCost), status: 'Kredit' },
                      { student: 'Biaya Variabel', program: 'Pengeluaran', amount: formatRupiah(financeSummary.variableCost), status: 'Kredit' },
                      { student: 'Net Profit Demo', program: 'Saldo', amount: formatRupiah(financeSummary.netProfit), status: financeSummary.netProfit >= 0 ? 'Profit' : 'Loss' }
                    ] },
                    { label: 'Pengajuan Beasiswa', value: String(financeSummary.scholarshipApplications), color: 'text-indigo-500', icon: Award, description: 'Semua transaksi dengan status pengajuan atau approval beasiswa.', rows: financeRows.filter((tx) => String(tx.status).toLowerCase().includes('scholarship') || String(tx.packageName || '').toLowerCase().includes('beasiswa')) },
                  ].map((stat, i) => (
                    <button key={i} type="button" onClick={() => setFinanceMetricDetail({ title: stat.label, rows: stat.rows, description: stat.description })} className="card-premium p-6 text-left hover:border-brand-blue/40 transition-all">
                      <stat.icon className={`${stat.color} mb-3`} size={20} />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-xl font-black text-brand-navy">{stat.value}</p>
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 p-1.5 bg-white border border-slate-100 rounded-2xl w-fit shadow-sm">
                  {[
                    { id: 'payments', label: 'Data Sistem Pembayaran' },
                    { id: 'inputs', label: 'Input Biaya & Anggaran' },
                    { id: 'realization', label: 'Realisasi Anggaran & Biaya' },
                    { id: 'assets', label: 'Aset' },
                    { id: 'accounting', label: 'Pembukuan Otomatis' },
                    { id: 'reports', label: 'Laporan Keuangan' },
                    { id: 'audit', label: 'Audit & Notifikasi' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setFinanceSubView(item.id as typeof financeSubView)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${financeSubView === item.id ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-slate-400 hover:text-brand-blue'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {financeSubView === 'payments' && (
                <>
                <div className="card-premium overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex flex-col gap-5">
                    <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-brand-navy">Data Sistem Pembayaran</h3>
                      <p className="text-xs text-slate-500 mt-1">Semua pendaftaran yang masuk pembayaran akan tercatat di sini.</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-[10px] font-black uppercase tracking-widest">{filteredFinanceRows.length}/{financeRows.length} Records</span>
                    </div>
                    <div className="grid md:grid-cols-4 gap-3">
                      <div className="md:col-span-2 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100">
                        <Search size={16} className="text-slate-400" />
                        <input
                          value={paymentSearchTerm}
                          onChange={(event) => setPaymentSearchTerm(event.target.value)}
                          className="w-full bg-transparent outline-none text-sm font-medium text-slate-600"
                          placeholder="Cari siswa, invoice, program, paket..."
                        />
                      </div>
                      <select value={paymentStatusFilter} onChange={(event) => setPaymentStatusFilter(event.target.value)} className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-600 outline-none">
                        {paymentStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                      <select value={paymentTypeFilter} onChange={(event) => setPaymentTypeFilter(event.target.value)} className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-600 outline-none">
                        <option value="All">Semua Tipe</option>
                        <option value="paid">Berbayar</option>
                        <option value="free">Gratis</option>
                        <option value="scholarship">Beasiswa</option>
                      </select>
                    </div>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Program</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Dokumen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredFinanceRows.map((tx, i) => {
                        const proof = paymentProofs.find((item) => item.invoiceId === (tx.invoiceNumber || tx.id));
                        const isScholarship = String(tx.status).toLowerCase().includes('scholarship');
                        const isFree = String(tx.status).toLowerCase().includes('free') || String(tx.type).toLowerCase() === 'free';
                        const uploadNotRequired = isScholarship || isFree;
                        return (
                        <tr key={tx.id || i} className="hover:bg-slate-50/50 transition-colors align-top">
                          <td className="px-8 py-4">
                            <button
                              type="button"
                              onClick={() => setSelectedFinanceRecord({ tx, proof })}
                              className="text-left text-sm font-bold text-brand-navy hover:text-brand-blue hover:underline"
                            >
                              {tx.student}
                            </button>
                            <p className="text-[10px] text-slate-400">{tx.email || '-'}</p>
                            <p className="text-[10px] text-slate-400">{tx.phone || '-'}</p>
                          </td>
                          <td className="px-8 py-4 text-xs text-slate-500">
                            {tx.program}
                            {tx.method && <p className="text-[10px] text-slate-400 mt-1">{tx.method} {tx.packageName ? `- ${tx.packageName}` : ''}</p>}
                            {tx.registrationData && (
                              <p className="text-[10px] text-slate-400 mt-1">Sekolah: {tx.registrationData.school || '-'}</p>
                            )}
                          </td>
                          <td className="px-8 py-4 text-sm font-mono font-bold text-brand-navy">{tx.amount}</td>
                          <td className="px-8 py-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${isScholarship ? 'bg-indigo-50 text-indigo-600' : tx.status === 'Success' || tx.status === 'Free Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                              {tx.status}
                            </span>
                            <p className="text-[10px] text-slate-400 mt-2">{tx.date || '-'}</p>
                          </td>
                          <td className="px-8 py-4 text-right">
                            <div className="flex flex-col items-end gap-2">
                              <button onClick={() => openStoredInvoice(tx)} className="px-3 py-1.5 rounded-lg bg-blue-50 text-brand-blue text-[10px] font-black uppercase tracking-widest">
                                Invoice
                              </button>
                              {proof ? (
                                <button onClick={() => openStoredProof(proof)} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                  {isScholarship ? 'Dokumen Beasiswa' : 'Bukti Bayar'}
                                </button>
                              ) : uploadNotRequired ? (
                                <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                  Tidak perlu upload
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-slate-300">Belum upload bukti</span>
                              )}
                            </div>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredFinanceRows.length === 0 && (
                    <div className="p-10 text-center text-sm font-bold text-slate-400">
                      Tidak ada data pembayaran yang cocok dengan filter.
                    </div>
                  )}
                  <div className="p-4 bg-slate-50 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Invoice dan bukti bayar dibaca dari database demo browser.
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="card-premium overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <h3 className="font-bold text-brand-navy">Database Dokumen Bukti Pembayaran / Beasiswa</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {paymentProofs.length === 0 && <p className="p-6 text-sm text-slate-400 font-bold">Belum ada dokumen yang diupload.</p>}
                      {paymentProofs.map((proof) => (
                        <div key={proof.id} className="p-5 flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold text-brand-navy">{proof.fileName}</p>
                            <p className="text-[10px] text-slate-400">{proof.student} - {proof.program}</p>
                            <p className="text-[10px] text-slate-400">{proof.type || 'Payment Proof'} - {Math.ceil((proof.fileSize || 0) / 1024)} KB</p>
                          </div>
                          <button onClick={() => openStoredProof(proof)} className="px-3 py-2 rounded-xl bg-slate-50 text-brand-blue text-[10px] font-black uppercase tracking-widest">
                            Buka
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card-premium p-6">
                    <h3 className="font-bold text-brand-navy mb-4">Sistem Beasiswa</h3>
                    <div className="space-y-4">
                      {financeRows.filter((tx) => String(tx.status).toLowerCase().includes('scholarship')).map((tx) => {
                        const proof = paymentProofs.find((item) => item.invoiceId === (tx.invoiceNumber || tx.id));
                        return (
                          <div key={tx.id} className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-black text-brand-navy">{tx.student}</p>
                                <p className="text-xs text-slate-500">{tx.program} - {tx.packageName}</p>
                                <p className="text-[10px] font-bold text-indigo-600 mt-2">{proof ? 'Dokumen sudah diterima, siap review admin.' : 'Tidak perlu upload dokumen. Review dari data pendaftaran.'}</p>
                              </div>
                              <span className="px-2 py-1 rounded-lg bg-white text-indigo-600 text-[10px] font-black uppercase">Review</span>
                            </div>
                          </div>
                        );
                      })}
                      {financeRows.filter((tx) => String(tx.status).toLowerCase().includes('scholarship')).length === 0 && (
                        <p className="text-sm text-slate-400 font-bold">Belum ada pengajuan beasiswa.</p>
                      )}
                    </div>
                  </div>
                </div>
                </>
                )}

                {financeSubView === 'inputs' && (
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="card-premium p-6 lg:col-span-1">
                    <h3 className="font-bold text-brand-navy mb-5">Input Keuangan Lain</h3>
                    <div className="space-y-3">
                      <select value={financeForm.type} onChange={(e) => setFinanceForm({ ...financeForm, type: e.target.value as FinanceEntry['type'] })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                        <option value="fixed">Biaya Tetap</option>
                        <option value="variable">Biaya Variabel</option>
                        <option value="budget">Anggaran</option>
                      </select>
                      <input value={financeForm.name} onChange={(e) => setFinanceForm({ ...financeForm, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Nama item, misal Honor Mentor" />
                      {financeForm.type === 'budget' ? (
                        <div className="space-y-2">
                          <select value={financeForm.category} onChange={(e) => setFinanceForm({ ...financeForm, category: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                            {budgetDirections.map((item) => (
                              <option key={item.value} value={item.value}>{item.label}</option>
                            ))}
                          </select>
                          <p className="text-[10px] text-slate-500 font-bold px-1">
                            Arah: {budgetDirections.find((item) => item.value === financeForm.category)?.target || 'Operasional Lainnya'}
                          </p>
                        </div>
                      ) : (
                        <input value={financeForm.category} onChange={(e) => setFinanceForm({ ...financeForm, category: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Kategori, misal Operasional" />
                      )}
                      <input value={financeForm.amount} onChange={(e) => setFinanceForm({ ...financeForm, amount: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Nominal, misal 2500000" inputMode="numeric" />
                      <input value={financeForm.period} onChange={(e) => setFinanceForm({ ...financeForm, period: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Periode" />
                      <textarea value={financeForm.note} onChange={(e) => setFinanceForm({ ...financeForm, note: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none h-20 resize-none" placeholder="Catatan" />
                      <button onClick={addFinanceEntry} className="w-full btn-primary py-3">
                        <Plus size={18} /> Tambah Input
                      </button>
                    </div>
                  </div>

                  <div className="card-premium overflow-hidden lg:col-span-2">
                    <div className="p-6 border-b border-slate-100">
                      <h3 className="font-bold text-brand-navy">Biaya Tetap, Biaya Variabel, dan Anggaran</h3>
                    </div>
                    <table className="w-full text-left">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jenis</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nominal</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {financeEntries.map((entry) => (
                          <tr key={entry.id}>
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-brand-navy">{entry.name}</p>
                              <p className="text-[10px] text-slate-400">{entry.category} - {entry.period}</p>
                              {entry.note && <p className="text-[10px] text-slate-500 mt-1">{entry.note}</p>}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${entry.type === 'fixed' ? 'bg-red-50 text-red-500' : entry.type === 'variable' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-brand-blue'}`}>
                                {entry.type === 'fixed' ? 'Biaya Tetap' : entry.type === 'variable' ? 'Biaya Variabel' : 'Anggaran'}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-sm font-black text-brand-navy">{formatRupiah(entry.amount)}</td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => deleteFinanceEntry(entry.id)} className="p-2 text-slate-400 hover:text-red-500">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="grid md:grid-cols-3 gap-4 p-6 bg-slate-50">
                      <div><p className="text-[10px] font-black uppercase text-slate-400">Total Biaya Tetap</p><p className="font-black text-brand-navy">{formatRupiah(financeSummary.fixedCost)}</p></div>
                      <div><p className="text-[10px] font-black uppercase text-slate-400">Total Biaya Variabel</p><p className="font-black text-brand-navy">{formatRupiah(financeSummary.variableCost)}</p></div>
                      <div><p className="text-[10px] font-black uppercase text-slate-400">Total Anggaran</p><p className="font-black text-brand-navy">{formatRupiah(financeSummary.budget)}</p></div>
                    </div>
                  </div>
                </div>
                )}

                {financeSubView === 'realization' && (
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="card-premium p-6">
                    <h3 className="font-bold text-brand-navy mb-5">Realisasi Anggaran / Biaya</h3>
                    <div className="space-y-3">
                      <select value={realizationForm.financeEntryId} onChange={(e) => setRealizationForm({ ...realizationForm, financeEntryId: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                        <option value="">Pilih rencana biaya/anggaran</option>
                        {financeEntries.map((entry) => (
                          <option key={entry.id} value={entry.id}>{entry.name} - {entry.type === 'budget' ? 'Anggaran' : entry.type === 'fixed' ? 'Biaya Tetap' : 'Biaya Variabel'}</option>
                        ))}
                      </select>
                      <input value={realizationForm.amount} onChange={(e) => setRealizationForm({ ...realizationForm, amount: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Nominal yang dipakai" inputMode="numeric" />
                      <input type="date" value={realizationForm.date} onChange={(e) => setRealizationForm({ ...realizationForm, date: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" />
                      <textarea value={realizationForm.note} onChange={(e) => setRealizationForm({ ...realizationForm, note: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none h-20 resize-none" placeholder="Catatan realisasi" />
                      <button onClick={addFinanceRealization} className="w-full btn-primary py-3">
                        <Plus size={18} /> Realisasikan
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-4 leading-relaxed">Input biaya/anggaran tidak masuk pembukuan sampai direalisasikan di halaman ini.</p>
                  </div>
                  <div className="card-premium overflow-hidden lg:col-span-2">
                    <div className="p-6 border-b border-slate-100">
                      <h3 className="font-bold text-brand-navy">Riwayat Realisasi</h3>
                    </div>
                    <table className="w-full text-left">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nominal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {financeRealizations.map((row) => (
                          <tr key={row.id}>
                            <td className="px-6 py-4"><p className="text-sm font-bold text-brand-navy">{row.name}</p><p className="text-[10px] text-slate-400">{row.category} {row.note ? `- ${row.note}` : ''}</p></td>
                            <td className="px-6 py-4 text-xs font-bold text-slate-500">{row.date}</td>
                            <td className="px-6 py-4 font-mono text-sm font-black text-red-500">{formatRupiah(row.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {financeRealizations.length === 0 && <div className="p-10 text-center text-sm font-bold text-slate-400">Belum ada realisasi biaya/anggaran.</div>}
                  </div>
                </div>
                )}

                {financeSubView === 'assets' && (
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="card-premium p-6">
                    <h3 className="font-bold text-brand-navy mb-5">Input Aset</h3>
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 mb-4">
                      <p className="text-xs font-black text-brand-navy mb-2">Aturan pencatatan aset</p>
                      <ul className="space-y-1 text-[11px] text-slate-600 font-medium leading-relaxed">
                        <li>Aset lancar tidak memakai depresiasi.</li>
                        <li>Aset tetap memakai depresiasi bulanan sesuai umur manfaat.</li>
                        <li>Tanah/Bangunan dicatat sebagai aset tetap tanpa depresiasi.</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <select value={assetForm.type} onChange={(e) => setAssetForm({ ...assetForm, type: e.target.value as AssetEntry['type'], category: e.target.value === 'fixed_asset' ? 'Peralatan Kantor' : 'Kas/Bank' })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                        <option value="fixed_asset">Aset Tetap</option>
                        <option value="current_asset">Aset Lancar</option>
                      </select>
                      <input value={assetForm.name} onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Nama aset" />
                      <select value={assetForm.category} onChange={(e) => setAssetForm({ ...assetForm, category: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                        {assetForm.type === 'fixed_asset' ? (
                          <>
                            <option>Kendaraan</option>
                            <option>Tanah/Bangunan</option>
                            <option>Peralatan Kantor</option>
                            <option>Perlengkapan Kantor</option>
                          </>
                        ) : (
                          <>
                            <option>Kas/Bank</option>
                            <option>Piutang</option>
                            <option>Persediaan Modul</option>
                          </>
                        )}
                      </select>
                      <input value={assetForm.acquisitionValue} onChange={(e) => setAssetForm({ ...assetForm, acquisitionValue: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Nilai perolehan" inputMode="numeric" />
                      <input value={assetForm.currentValue} onChange={(e) => setAssetForm({ ...assetForm, currentValue: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Nilai saat ini" inputMode="numeric" />
                      <input type="date" value={assetForm.acquisitionDate} onChange={(e) => setAssetForm({ ...assetForm, acquisitionDate: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" />
                      {assetForm.type === 'fixed_asset' && !nonDepreciableFixedAssetCategories.includes(assetForm.category) && (
                        <input value={assetForm.usefulLifeMonths} onChange={(e) => setAssetForm({ ...assetForm, usefulLifeMonths: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" placeholder="Umur manfaat bulan" inputMode="numeric" />
                      )}
                      {assetForm.type === 'fixed_asset' && nonDepreciableFixedAssetCategories.includes(assetForm.category) && (
                        <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs font-bold text-brand-blue">
                          Tanah/Bangunan dicatat sebagai aset tetap tanpa depresiasi.
                        </div>
                      )}
                      {assetForm.type === 'current_asset' && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-700">
                          Aset lancar masuk neraca tanpa depresiasi. Penyesuaian nilai dilakukan sebagai koreksi persediaan/piutang bila diperlukan.
                        </div>
                      )}
                      <textarea value={assetForm.note} onChange={(e) => setAssetForm({ ...assetForm, note: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none h-20 resize-none" placeholder="Catatan aset" />
                      <button onClick={addAssetEntry} className="w-full btn-primary py-3">
                        <Plus size={18} /> Tambah Aset
                      </button>
                    </div>
                  </div>
                  <div className="card-premium overflow-hidden lg:col-span-2">
                    <div className="p-6 border-b border-slate-100">
                      <h3 className="font-bold text-brand-navy">Daftar Aset</h3>
                    </div>
                    <table className="w-full text-left">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aset</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nilai</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Depresiasi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {assetEntries.map((asset) => (
                          <tr key={asset.id}>
                            <td className="px-6 py-4"><p className="text-sm font-bold text-brand-navy">{asset.name}</p><p className="text-[10px] text-slate-400">{asset.type === 'fixed_asset' ? 'Aset Tetap' : 'Aset Lancar'} - {asset.category}</p></td>
                            <td className="px-6 py-4"><p className="font-mono text-sm font-black text-brand-navy">{formatRupiah(asset.currentValue)}</p><p className="text-[10px] text-slate-400">Perolehan {formatRupiah(asset.acquisitionValue)}</p></td>
                            <td className="px-6 py-4 text-sm font-mono font-bold text-red-500">
                              {asset.type === 'fixed_asset'
                                ? asset.depreciationPerMonth > 0 ? formatRupiah(asset.depreciationPerMonth) : 'Tanpa depresiasi'
                                : 'Tidak didepresiasi'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                )}

                {financeSubView === 'accounting' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="card-premium p-6">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Debit Otomatis</p>
                      <p className="text-2xl font-black text-emerald-600">{formatRupiah(accountingRows.reduce((sum, row) => sum + row.debit, 0))}</p>
                    </div>
                    <div className="card-premium p-6">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Kredit Otomatis</p>
                      <p className="text-2xl font-black text-red-500">{formatRupiah(accountingRows.reduce((sum, row) => sum + row.credit, 0))}</p>
                    </div>
                    <div className="card-premium p-6">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Saldo Akuntansi Demo</p>
                      <p className="text-2xl font-black text-brand-navy">{formatRupiah(accountingRows.reduce((sum, row) => sum + row.debit - row.credit, 0))}</p>
                    </div>
                  </div>
                  <div className="card-premium overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <h3 className="font-bold text-brand-navy">Jurnal Pembukuan Otomatis</h3>
                      <p className="text-xs text-slate-500 mt-1">Dibentuk otomatis dari transaksi pembayaran, pengajuan beasiswa, biaya tetap, biaya variabel, dan anggaran.</p>
                    </div>
                    <table className="w-full text-left">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Akun</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Keterangan</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Debit</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kredit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {accountingRows.map((row) => (
                          <tr key={row.id}>
                            <td className="px-6 py-4 text-xs font-bold text-slate-500">{row.date}</td>
                            <td className="px-6 py-4 text-sm font-black text-brand-navy">{row.account}</td>
                            <td className="px-6 py-4 text-xs text-slate-500">{row.description}<p className="text-[10px] text-slate-400 mt-1">{row.source} - {row.status}</p></td>
                            <td className="px-6 py-4 font-mono text-sm font-bold text-emerald-600">{row.debit ? formatRupiah(row.debit) : '-'}</td>
                            <td className="px-6 py-4 font-mono text-sm font-bold text-red-500">{row.credit ? formatRupiah(row.credit) : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                )}

                {financeSubView === 'reports' && (
                <div className="space-y-6">
                  <div className="card-premium p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-brand-navy">Laporan Keuangan</h3>
                      <p className="text-xs text-slate-500 mt-1">Neraca, Laba Rugi, dan Arus Kas untuk periode {financialReports.periodLabel}.</p>
                    </div>
                    <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl">
                      {[
                        { id: 'monthly', label: 'Bulanan' },
                        { id: 'quarterly', label: 'Kuartal' },
                        { id: 'yearly', label: 'Tahunan' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setFinancialReportPeriod(item.id as typeof financialReportPeriod)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${financialReportPeriod === item.id ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-400'}`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6">
                    {[
                      { title: 'Laporan Laba Rugi', rows: financialReports.incomeStatement, color: 'text-emerald-600' },
                      { title: 'Neraca', rows: financialReports.balanceSheet, color: 'text-brand-blue' },
                      { title: 'Laporan Arus Kas', rows: financialReports.cashFlow, color: 'text-brand-orange' }
                    ].map((report) => (
                      <div key={report.title} className="card-premium overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                          <h4 className="font-black text-brand-navy">{report.title}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{financialReports.periodLabel}</p>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {report.rows.map((row) => (
                            <div key={row.label} className={`p-5 flex items-center justify-between gap-4 ${row.total ? 'bg-slate-50' : ''}`}>
                              <span className={`text-sm ${row.total ? 'font-black text-brand-navy' : 'font-bold text-slate-600'}`}>{row.label}</span>
                              <span className={`font-mono text-sm font-black ${row.total ? report.color : row.amount < 0 ? 'text-red-500' : 'text-brand-navy'}`}>
                                {row.amount < 0 ? `(${formatRupiah(Math.abs(row.amount))})` : formatRupiah(row.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                )}

                {financeSubView === 'audit' && (
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="card-premium overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <h3 className="font-bold text-brand-navy">Audit Trail Sistem</h3>
                      <p className="text-xs text-slate-500 mt-1">Riwayat aksi admin untuk pembayaran, biaya, realisasi, aset, dan approval.</p>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
                      {auditEvents.length === 0 && <p className="p-6 text-sm text-slate-400 font-bold">Belum ada audit trail.</p>}
                      {auditEvents.map((event) => (
                        <div key={event.id} className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-black text-brand-navy">{event.action}</p>
                              <p className="text-xs text-slate-500 mt-1">{event.detail}</p>
                              <p className="text-[10px] text-slate-400 mt-2">{event.module} - {event.actor}</p>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{event.createdAt}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card-premium overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <h3 className="font-bold text-brand-navy">Outbox Notifikasi</h3>
                      <p className="text-xs text-slate-500 mt-1">Draft/queue pesan email, WhatsApp, dan sistem dari workflow admin.</p>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
                      {notificationEvents.length === 0 && <p className="p-6 text-sm text-slate-400 font-bold">Belum ada notifikasi.</p>}
                      {notificationEvents.map((event) => (
                        <div key={event.id} className="p-5">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <p className="text-sm font-black text-brand-navy">{event.subject}</p>
                              <p className="text-[10px] text-slate-400 mt-1">{event.channel} ke {event.recipient}</p>
                            </div>
                            <span className="px-2 py-1 rounded-lg bg-blue-50 text-brand-blue text-[10px] font-black uppercase">{event.status}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line line-clamp-4">{event.message}</p>
                          <p className="text-[10px] text-slate-400 mt-3">{event.createdAt}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                )}
              </div>
            )}

            {activeTab === 'programs' && (
              <div className="animate-in fade-in duration-500 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                   <div>
                      <h2 className="text-2xl font-bold text-brand-navy">Program Inventory & Curriculum</h2>
                      <p className="text-sm text-slate-500">Manage all educational offerings and their detailed specifications</p>
                   </div>
                   <div className="flex items-center gap-3 w-full md:w-auto">
                      <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl">
                        <Search size={18} className="text-slate-400" />
                        <input
                          type="text"
                          value={programSearchTerm}
                          onChange={(event) => setProgramSearchTerm(event.target.value)}
                          placeholder="Search programs..."
                          className="text-sm bg-transparent border-none focus:ring-0 font-medium"
                        />
                      </div>
                      <button
                        onClick={resetProgramsToDefault}
                        className="btn-secondary py-2 px-5 whitespace-nowrap"
                      >
                         Reset
                      </button>
                      <button
                        onClick={() => runContextualAdd()}
                        className="btn-primary py-2 px-6 whitespace-nowrap"
                      >
                         <Plus size={18} />
                         New Program
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {[
                     { label: 'Courses', value: String(programsList.length), icon: BookOpen, color: 'text-brand-blue' },
                     { label: 'Packages', value: String(programsList.reduce((sum, program) => sum + (program.packages?.length || 0), 0)), icon: DollarSign, color: 'text-emerald-500' },
                     { label: 'Categories', value: String(programCategories.length - 1), icon: TrendingUp, color: 'text-brand-orange' },
                     { label: 'Published', value: String(programsList.length), icon: Globe, color: 'text-indigo-500' }
                   ].map((p, i) => (
                     <div key={i} className="card-premium p-5 flex flex-col gap-2">
                        <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${p.color}`}>
                           <p.icon size={20} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{p.label}</p>
                           <p className="text-lg font-black text-brand-navy">{p.value}</p>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="card-premium overflow-hidden">
                   <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                      <label className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500">
                         <Filter size={14} />
                         <span>Category:</span>
                         <select
                           value={programCategoryFilter}
                           onChange={(event) => setProgramCategoryFilter(event.target.value)}
                           className="bg-transparent outline-none font-black text-slate-600"
                         >
                           {programCategories.map((category) => (
                             <option key={category} value={category}>{category}</option>
                           ))}
                         </select>
                      </label>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500">
                         <TrendingUp size={14} />
                         <span>Sort: Newest</span>
                      </div>
                   </div>
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50">
                         <tr>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Program & Schedule</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Visibility</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {filteredProgramsList.map((item) => (
                           <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                                      <img src={item.image} className="w-full h-full object-cover" alt="" />
                                   </div>
                                   <div>
                                      <p className="text-sm font-bold text-brand-navy line-clamp-1">{item.title}</p>
                                      <p className="text-[10px] text-slate-400 font-medium italic">{item.schedule || 'TBA'}</p>
                                   </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <span className="px-2 py-1 bg-blue-50 text-brand-blue rounded-lg text-[10px] font-black uppercase tracking-wider">{item.category}</span>
                              </td>
                              <td className="px-6 py-4">
                                 <p className="text-sm font-black text-brand-navy">{item.price}</p>
                                 <p className="text-[9px] text-slate-400 font-bold uppercase">{item.packages?.length || 0} Packages</p>
                              </td>
                              <td className="px-6 py-4">
                                 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Active
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => setEditingProgram(item)}
                                      className="p-2 text-slate-400 hover:text-brand-blue hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-slate-100"
                                    >
                                      <Edit2 size={16} />
                                    </button>
                                    <button 
                                      onClick={() => deleteProgram(item.id)}
                                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-slate-100"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                   {filteredProgramsList.length === 0 && (
                     <div className="p-10 text-center text-sm font-bold text-slate-400">
                       Tidak ada program yang cocok dengan filter editor.
                     </div>
                   )}

                </div>
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="animate-in fade-in duration-500 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                   <div>
                      <h2 className="text-2xl font-bold text-brand-navy">Question Bank Central</h2>
                      <p className="text-sm text-slate-500">Manage {questions.length} indexed questions for all tryouts</p>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                         <Search size={18} className="text-slate-400" />
                         <input 
                           type="text" 
                           placeholder="Filter questions..." 
                           className="text-sm bg-transparent border-none focus:ring-0 font-medium text-slate-600 w-32 md:w-auto"
                         />
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                         <Filter size={18} className="text-slate-400" />
                         <select className="text-sm bg-transparent border-none focus:ring-0 font-medium text-slate-600">
                            <option>All Subjects</option>
                            <option>Penalaran Umum</option>
                            <option>Penalaran Matematika</option>
                         </select>
                      </div>
                      <button 
                        onClick={() => setEditingQuestion({
                          id: Date.now().toString(),
                          subject: 'Penalaran Umum',
                          difficulty: 'Medium',
                          text: '',
                          options: [
                            { id: 'A', text: '' },
                            { id: 'B', text: '' },
                            { id: 'C', text: '' },
                            { id: 'D', text: '' },
                            { id: 'E', text: '' }
                          ],
                          correctOptionId: 'A',
                          explanation: '',
                          program: 'SNBT',
                          tags: []
                        })}
                        className="btn-primary py-2 px-6 flex items-center gap-2"
                      >
                         <Plus size={18} />
                         <span className="hidden md:inline">Add Question</span>
                      </button>
                      <button 
                        onClick={() => setIsImportModalOpen(true)}
                        className="btn-secondary py-2 px-6 flex items-center gap-2"
                      >
                         <FileUp size={18} />
                         <span className="hidden md:inline">Batch Import</span>
                       </button>
                       <button 
                         onClick={() => setIsManageTagsModalOpen(true)}
                         className="btn-secondary py-2 px-6 flex items-center gap-2"
                       >
                          <Tags size={18} />
                          <span className="hidden md:inline">Manage Tags</span>
                       </button>
                    </div>
                </div>

                <div className="card-premium overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-100">
                         <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Question Preview</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Metadata</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Tags</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Difficulty</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {questions.map((q) => (
                           <tr key={q.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="py-5 px-6">
                                 <p className="text-sm font-medium text-brand-navy line-clamp-1 max-w-lg">{q.text || <span className="italic text-slate-300">(No text)</span>}</p>
                                 <div className="flex gap-2 mt-1">
                                    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">Ans: {q.correctOptionId}</span>
                                    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{q.program}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <p className="text-xs font-bold text-slate-600 tracking-tight">{q.subject}</p>
                                 <p className="text-[10px] text-slate-400 font-medium whitespace-nowrap">ID: {q.id}</p>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex flex-wrap gap-1 justify-center max-w-[150px]">
                                    {q.tags?.map((tag, i) => (
                                      <span key={i} className="text-[8px] font-black text-brand-blue bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                        {tag}
                                      </span>
                                    )) || <span className="text-[8px] text-slate-300 font-bold uppercase">-</span>}
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                                   q.difficulty === 'Hard' ? 'bg-red-50 text-red-600' : 
                                   q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' :
                                   'bg-emerald-50 text-emerald-600'
                                 }`}>
                                    {q.difficulty}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => duplicateQuestion(q)}
                                      className="p-2 text-slate-400 hover:text-brand-orange hover:bg-orange-50 rounded-lg transition-colors" 
                                      title="Duplicate Question"
                                    >
                                       <Copy size={16} />
                                    </button>
                                    <button 
                                      onClick={() => setEditingQuestion(q)}
                                      className="p-2 text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors" 
                                      title="Edit Question"
                                    >
                                       <Edit2 size={16} />
                                    </button>
                                    <button 
                                      onClick={() => deleteQuestion(q.id)}
                                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
                                      title="Delete Question"
                                    >
                                       <Trash2 size={16} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>

                {/* Question Editor Modal */}
                <AnimatePresence>
                  {editingQuestion && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col my-auto"
                      >
                         <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="p-2 bg-white/10 rounded-xl">
                                  <BookOpen size={20} className="text-brand-blue" />
                               </div>
                               <div>
                                  <h3 className="font-bold">Edit Question</h3>
                                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-black">Question ID: {editingQuestion.id}</p>
                               </div>
                            </div>
                            <button onClick={() => setEditingQuestion(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                               <X size={20} />
                            </button>
                         </div>

                         <div className="p-8 grid md:grid-cols-2 gap-8 overflow-y-auto max-h-[70vh]">
                            <div className="space-y-6">
                               <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Question Content</label>
                                  <textarea 
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-medium text-slate-600 h-40 resize-none focus:border-brand-blue transition-colors"
                                    value={editingQuestion.text}
                                    onChange={(e) => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                                    placeholder="Enter question text here..."
                                  />
                               </div>

                               <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Answer Options</label>
                                  <div className="space-y-3">
                                    {editingQuestion.options.map((opt, idx) => (
                                      <div key={idx} className="flex gap-3">
                                         <button 
                                           onClick={() => setEditingQuestion({ ...editingQuestion, correctOptionId: opt.id })}
                                           className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${editingQuestion.correctOptionId === opt.id ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                         >
                                            {opt.id}
                                         </button>
                                         <input 
                                           className="flex-1 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm font-medium text-slate-600 focus:border-brand-blue transition-colors"
                                           value={opt.text}
                                           onChange={(e) => {
                                             const newOpts = [...editingQuestion.options];
                                             newOpts[idx] = { ...opt, text: e.target.value };
                                             setEditingQuestion({ ...editingQuestion, options: newOpts });
                                           }}
                                           placeholder={`Option ${opt.id}...`}
                                         />
                                      </div>
                                    ))}
                                  </div>
                               </div>
                            </div>

                            <div className="space-y-6">
                               <div className="grid grid-cols-2 gap-4">
                                  <div>
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Subject</label>
                                     <select 
                                       className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm font-bold text-slate-600"
                                       value={editingQuestion.subject}
                                       onChange={(e) => setEditingQuestion({ ...editingQuestion, subject: e.target.value as any })}
                                     >
                                        <option>Penalaran Umum</option>
                                        <option>Literasi Bahasa</option>
                                        <option>Penalaran Matematika</option>
                                        <option>Pengetahuan Umum</option>
                                     </select>
                                  </div>
                                  <div>
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Difficulty</label>
                                     <select 
                                       className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm font-bold text-slate-600"
                                       value={editingQuestion.difficulty}
                                       onChange={(e) => setEditingQuestion({ ...editingQuestion, difficulty: e.target.value as any })}
                                     >
                                        <option>Easy</option>
                                        <option>Medium</option>
                                        <option>Hard</option>
                                     </select>
                                  </div>
                               </div>

                               <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Explanation / Discussion</label>
                                  <textarea 
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none font-medium text-slate-600 h-32 resize-none focus:border-brand-blue transition-colors text-sm"
                                    value={editingQuestion.explanation}
                                    onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                                    placeholder="Explain the correct answer steps..."
                                  />
                               </div>

                               <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Organization & Tags</label>
                                  <div className="space-y-4">
                                     <div className="flex flex-wrap gap-2">
                                        {availableTags.map((tag) => (
                                          <button 
                                            key={tag}
                                            onClick={() => toggleQuestionTag(tag)}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${editingQuestion.tags?.includes(tag) ? 'bg-brand-blue text-white border-brand-blue' : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-brand-blue'}`}
                                          >
                                             {tag}
                                          </button>
                                        ))}
                                        <div className="flex items-center gap-1">
                                           <input 
                                             type="text"
                                             placeholder="New tag..."
                                             className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-slate-50 border border-slate-200 outline-none focus:border-brand-blue w-24"
                                             onKeyDown={(e) => {
                                               if (e.key === 'Enter') {
                                                 const val = (e.target as HTMLInputElement).value.trim();
                                                 if (val && !availableTags.includes(val)) {
                                                   addTag(val);
                                                   toggleQuestionTag(val);
                                                   (e.target as HTMLInputElement).value = '';
                                                 }
                                                 e.preventDefault();
                                               }
                                             }}
                                           />
                                        </div>
                                     </div>
                                     <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                                        <div className="flex gap-2">
                                           <Tags size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                           <p className="text-[10px] text-amber-700 font-medium leading-relaxed uppercase tracking-widest">
                                             Tags help in filtering questions during tryout generation and IRT analysis.
                                           </p>
                                        </div>
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>

                         <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                               <div className="flex items-center gap-1.5">
                                  <div className={`w-2 h-2 rounded-full ${editingQuestion.text.length > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                  Text
                               </div>
                               <div className="flex items-center gap-1.5">
                                  <div className={`w-2 h-2 rounded-full ${editingQuestion.options.every(o => o.text.length > 0) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                  Options
                               </div>
                               <div className="flex items-center gap-1.5">
                                  <div className={`w-2 h-2 rounded-full ${editingQuestion.explanation.length > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                  Exp
                               </div>
                            </div>
                            <div className="flex gap-3">
                               <button 
                                 onClick={() => setEditingQuestion(null)}
                                 className="px-6 py-2.5 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-colors"
                               >
                                  Cancel
                               </button>
                               <button 
                                 onClick={() => saveQuestion(editingQuestion)}
                                 className="btn-primary py-2.5 px-8 shadow-xl shadow-blue-500/20"
                               >
                                  <Save size={18} />
                                  Save Question
                               </button>
                            </div>
                         </div>
                      </motion.div>
                    </div>
                  )}

                  {isManageTagsModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                       <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
                      >
                         <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <Tags size={24} className="text-brand-blue" />
                               <h3 className="font-bold">Manage Question Categories</h3>
                            </div>
                            <button onClick={() => setIsManageTagsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                               <X size={20} />
                            </button>
                         </div>
                         <div className="p-8 space-y-6">
                            <div className="space-y-4">
                               <div className="flex gap-2">
                                  <input 
                                    type="text" 
                                    placeholder="Add new category/tag..." 
                                    value={newTagInput}
                                    onChange={(e) => setNewTagInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && newTagInput.trim() && (addTag(newTagInput.trim()), setNewTagInput(''))}
                                    className="flex-1 px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm"
                                  />
                                  <button 
                                    onClick={() => {
                                      if (newTagInput.trim()) {
                                        addTag(newTagInput.trim());
                                        setNewTagInput('');
                                      }
                                    }}
                                    className="btn-primary px-6"
                                  >
                                     Add
                                  </button>
                               </div>

                               <div className="flex flex-wrap gap-2 pt-4">
                                  {availableTags.map(tag => (
                                    <div key={tag} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl group hover:border-brand-blue transition-all">
                                       <span className="text-xs font-bold text-brand-navy">{tag}</span>
                                       <button 
                                         onClick={() => setAvailableTags(availableTags.filter(t => t !== tag))}
                                         className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                       >
                                          <X size={12} />
                                       </button>
                                    </div>
                                  ))}
                               </div>

                               {availableTags.length === 0 && (
                                 <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                       <Tags size={32} className="text-slate-200" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-400">No categories defined yet.</p>
                                 </div>
                               )}
                            </div>

                            <div className="p-6 bg-blue-50 rounded-2xl flex items-start gap-3">
                               <Info size={20} className="text-brand-blue shrink-0 mt-0.5" />
                               <div>
                                  <h5 className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-1">Semantic Tagging</h5>
                                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                                    Use consistent tags for better reporting. Suggestions: IRT-Stable, High-Discrimination, or sub-topics.
                                  </p>
                                </div>
                            </div>
                         </div>
                       </motion.div>
                    </div>
                  )}

                  {isImportModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                       <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
                      >
                         <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <FileUp size={24} className="text-brand-orange" />
                               <h3 className="font-bold">Batch Question Import</h3>
                            </div>
                            <button onClick={() => setIsImportModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                               <X size={20} />
                            </button>
                         </div>
                         <div className="p-8 space-y-6">
                            <div className="p-6 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center group hover:border-brand-blue transition-colors relative">
                               {importStatus === 'idle' ? (
                                 <>
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                                       <Upload size={32} className="text-slate-400 group-hover:text-brand-blue" />
                                    </div>
                                    <h4 className="font-bold text-brand-navy mb-1">Click or drag CSV file</h4>
                                    <p className="text-xs text-slate-400 mb-6">Compatible with standard The Prams mapping</p>
                                    <input 
                                      type="file" 
                                      accept=".csv"
                                      onChange={handleCsvImport}
                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="flex gap-2">
                                       <span className="px-3 py-1 bg-slate-100 rounded-lg text-[8px] font-black text-slate-500 uppercase">.CSV</span>
                                       <span className="px-3 py-1 bg-slate-100 rounded-lg text-[8px] font-black text-slate-500 uppercase">Max 5MB</span>
                                    </div>
                                 </>
                               ) : importStatus === 'processing' ? (
                                  <div className="py-8 flex flex-col items-center">
                                     <div className="w-12 h-12 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin mb-4" />
                                     <h4 className="font-bold text-brand-navy mb-1">Processing Questions...</h4>
                                     <p className="text-xs text-slate-400">Mapping fields and verifying structure</p>
                                  </div>
                               ) : (
                                  <div className="py-8 flex flex-col items-center">
                                     <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                                        <Check size={32} className="text-emerald-500" />
                                     </div>
                                     <h4 className="font-bold text-brand-navy mb-1">Import Successful!</h4>
                                     <p className="text-xs text-slate-400">Questions have been added to your bank</p>
                                  </div>
                               )}
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
                               <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CSV Mapping Guide</h5>
                               <div className="grid grid-cols-2 gap-y-2 text-[10px] font-bold">
                                  <div className="text-slate-500">text</div>
                                  <div className="text-brand-navy text-right">Question Payload</div>
                                  <div className="text-slate-500">option_a, b, c...</div>
                                  <div className="text-brand-navy text-right">Choices Array</div>
                                  <div className="text-slate-500">correct_ans</div>
                                  <div className="text-brand-navy text-right">Key (A-E)</div>
                                  <div className="text-slate-500">tags</div>
                                  <div className="text-brand-navy text-right">Comma separated</div>
                               </div>
                               <button
                                  onClick={() => downloadTextFile('question-import-template.csv', 'subject,difficulty,text,option_a,option_b,correct_ans,tags\nPenalaran Umum,Medium,Contoh soal...,Pilihan A,Pilihan B,A,SNBT')}
                                  className="w-full py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-brand-blue hover:text-brand-blue transition-all"
                               >
                                  Download CSV Template
                               </button>
                            </div>
                         </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {activeTab === 'testimonials' && (
              <div className="animate-in fade-in duration-500 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                   <div>
                      <h2 className="text-2xl font-bold text-brand-navy">Testimonials Moderation</h2>
                      <p className="text-sm text-slate-500">Manage student feedback and public testimonials</p>
                   </div>
                   <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                      <button onClick={() => setTestimonialFilter('All')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${testimonialFilter === 'All' ? 'bg-white shadow-sm text-brand-navy' : 'text-slate-400 hover:text-slate-600'}`}>All ({testimonials.length})</button>
                      <button onClick={() => setTestimonialFilter('Pending')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${testimonialFilter === 'Pending' ? 'bg-white shadow-sm text-brand-navy' : 'text-slate-400 hover:text-slate-600'}`}>Pending ({pendingTestimonials.length})</button>
                      <button onClick={() => setTestimonialFilter('Approved')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${testimonialFilter === 'Approved' ? 'bg-white shadow-sm text-brand-navy' : 'text-slate-400 hover:text-slate-600'}`}>Approved ({approvedTestimonials.length})</button>
                   </div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {visibleTestimonials.map((t) => (
                     <motion.div 
                       layout
                       key={t.id} 
                       className={`card-premium p-6 flex flex-col gap-4 border-l-4 transition-all ${
                         t.status === 'Approved' ? 'border-l-emerald-500' : 
                         t.status === 'Rejected' ? 'border-l-red-500' : 
                         'border-l-amber-500'
                       }`}
                     >
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <img src={t.image} className="w-10 h-10 rounded-xl object-cover" alt="" />
                              <div>
                                 <p className="text-sm font-bold text-brand-navy">{t.studentName}</p>
                                 <p className="text-[10px] text-slate-400 font-medium">{t.createdAt}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} size={14} className={s <= t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-100 fill-slate-100'} />
                              ))}
                           </div>
                        </div>

                        <div className="flex-1">
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <Quote size={20} className="text-slate-200 mb-2" />
                            <p className="text-xs text-slate-600 italic leading-relaxed">"{t.content}"</p>
                          </div>
                          
                          <div className="mt-4 space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Program</p>
                            <p className="text-xs font-bold text-brand-blue">{t.programId || 'General'}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                           <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                             t.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                             t.status === 'Rejected' ? 'bg-red-50 text-red-600' : 
                             'bg-amber-50 text-amber-600'
                           }`}>
                              {t.status}
                           </span>

                           <div className="flex gap-2">
                             {t.status !== 'Approved' && (
                               <button 
                                 onClick={() => updateTestimonialStatus(t.id, 'Approved')}
                                 className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm shadow-emerald-500/10"
                                 title="Approve"
                               >
                                  <Check size={16} />
                               </button>
                             )}
                             {t.status !== 'Rejected' && (
                               <button 
                                 onClick={() => updateTestimonialStatus(t.id, 'Rejected')}
                                 className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm shadow-red-500/10"
                                 title="Reject"
                               >
                                  <X size={16} />
                               </button>
                             )}
                             <button onClick={() => {
                               setTestimonials((prev) => prev.filter((item) => item.id !== t.id));
                               notify('Testimoni dihapus.');
                             }} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-200 transition-all">
                                <Trash2 size={16} />
                             </button>
                           </div>
                        </div>
                     </motion.div>
                   ))}
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="animate-in fade-in duration-500 space-y-8">
                <div className="flex justify-between items-center">
                   <div>
                      <h2 className="text-2xl font-bold text-brand-navy">Deep Analytics & Reports</h2>
                      <p className="text-sm text-slate-500">Comprehensive breakdown of revenue, growth, and payment metrics</p>
                   </div>
                   <div className="flex gap-3">
                      <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <Calendar size={16} className="text-slate-400" />
                        <select className="text-xs font-bold text-slate-600 bg-transparent border-none outline-none cursor-pointer">
                          <option>7 Days Lately</option>
                          <option>Last 30 Days</option>
                          <option>Year to Date</option>
                          <option>Custom Range</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <Filter size={16} className="text-slate-400" />
                        <select className="text-xs font-bold text-slate-600 bg-transparent border-none outline-none cursor-pointer">
                          <option>All Programs</option>
                          <option>SNBT Only</option>
                          <option>CPNS Only</option>
                        </select>
                      </div>
                      <button
                        onClick={() => downloadTextFile('analytics-report.csv', 'metric,value\nActive Subscriptions,950\nRetention Rate,92.4%\nGross Revenue MTD,Rp 1.84M')}
                        className="btn-secondary flex items-center gap-2 px-6"
                      >
                        <Download size={18} />
                        Export
                      </button>
                   </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { title: 'Date Range', desc: 'Filter periode laporan 7 hari, 30 hari, year-to-date, atau custom range.', icon: Calendar },
                    { title: 'Program Filter', desc: 'Membatasi data analitik berdasarkan semua program, SNBT, atau CPNS.', icon: Filter },
                    { title: 'Export CSV', desc: 'Mengunduh ringkasan metrik demo seperti subscription, retention, dan revenue.', icon: Download },
                    { title: 'Metric Panels', desc: 'Menampilkan growth, revenue method, acquisition, revenue per program, dan quick stats.', icon: LineChartIcon },
                  ].map((item) => (
                    <div key={item.title} className="card-premium p-5 bg-white">
                      <item.icon size={20} className="text-brand-orange mb-3" />
                      <p className="text-sm font-black text-brand-navy mb-1">{item.title}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    {/* Subscription Growth Trends */}
                    <div className="card-premium p-8">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="font-bold text-brand-navy">Subscription Growth Trends</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Active vs New Subscriptions</p>
                        </div>
                        <div className="flex gap-4">
                           <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full bg-brand-blue" />
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Growth Rate</span>
                           </div>
                        </div>
                      </div>
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={[
                            { name: 'Jan', active: 400, new: 50 },
                            { name: 'Feb', active: 450, new: 65 },
                            { name: 'Mar', active: 580, new: 120 },
                            { name: 'Apr', active: 750, new: 180 },
                            { name: 'May', active: 820, new: 150 },
                            { name: 'Jun', active: 950, new: 210 },
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                            <Tooltip 
                               contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Line type="monotone" dataKey="active" stroke="#2563eb" strokeWidth={4} dot={{ r: 6, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="new" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Revenue by Payment Method */}
                      <div className="card-premium p-8 flex flex-col">
                        <h3 className="font-bold text-brand-navy mb-6">Revenue by Payment Method</h3>
                        <div className="flex-1 flex items-center justify-center min-h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'VA Bank', value: 45 },
                                  { name: 'E-Wallet', value: 35 },
                                  { name: 'CC/Debit', value: 15 },
                                  { name: 'Other', value: 5 },
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius="60%"
                                outerRadius="85%"
                                paddingAngle={8}
                                dataKey="value"
                              >
                                {COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none' }}
                                formatter={(value: number) => `${value}%`}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-6">
                           {[
                             { name: 'VA Bank', color: COLORS[0], val: '45%' },
                             { name: 'E-Wallet', color: COLORS[1], val: '35%' },
                             { name: 'CC/Debit', color: COLORS[2], val: '15%' },
                             { name: 'Other', color: COLORS[3], val: '5%' },
                           ].map((m, i) => (
                             <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                                <div className="flex items-center gap-2">
                                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                                   <span className="text-[10px] font-bold text-slate-500">{m.name}</span>
                                </div>
                                <span className="text-[10px] font-black text-brand-navy">{m.val}</span>
                             </div>
                           ))}
                        </div>
                      </div>

                      {/* Revenue Breakdown (Alt view) */}
                      <div className="card-premium p-8">
                         <h3 className="font-bold text-brand-navy mb-6">User Acquisition Trends</h3>
                         <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 8}} />
                                <YAxis hide />
                                <Tooltip cursor={{fill: '#f8fafc'}} />
                                <Bar dataKey="students" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={24} />
                              </BarChart>
                            </ResponsiveContainer>
                         </div>
                         <div className="mt-6 space-y-4">
                            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white rounded-lg text-indigo-500"><Users size={16} /></div>
                                  <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">Retention Rate</div>
                               </div>
                               <span className="text-sm font-black text-indigo-900">92.4%</span>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Revenue by Program */}
                    <div className="card-premium p-8 h-fit">
                       <h3 className="font-bold text-brand-navy mb-8">Revenue by Program</h3>
                       <div className="h-64 w-full mb-8">
                          <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={programPerformanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                                <YAxis hide />
                                <Tooltip 
                                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={32}>
                                   {programPerformanceData.map((entry, index) => (
                                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                   ))}
                                </Bar>
                             </BarChart>
                          </ResponsiveContainer>
                       </div>
                       <div className="space-y-5">
                         {programPerformanceData.map((item, i) => (
                           <div key={i} className="space-y-2">
                             <div className="flex justify-between items-center text-[10px] font-bold">
                               <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                  <span className="text-slate-500 uppercase tracking-widest">{item.name}</span>
                               </div>
                               <span className="text-brand-navy font-black">Rp {item.revenue}jt</span>
                             </div>
                             <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 whileInView={{ width: `${(item.revenue / 1100) * 100}%` }}
                                 viewport={{ once: true }}
                                 transition={{ duration: 1, delay: i * 0.1 }}
                                 className="h-full bg-brand-orange" 
                               />
                             </div>
                           </div>
                         ))}
                       </div>
                       <div className="mt-8 p-6 bg-brand-navy rounded-[2rem] text-white shadow-xl shadow-brand-navy/20 relative overflow-hidden">
                          <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full" />
                          <p className="text-[10px] font-bold uppercase opacity-60 mb-1 tracking-widest">Gross Revenue MTD</p>
                          <div className="flex items-end gap-2">
                            <p className="text-3xl font-black">Rp 1.84M</p>
                            <span className="text-[10px] font-bold text-emerald-400 mb-1.5">+12.5%</span>
                          </div>
                       </div>
                    </div>

                    <div className="card-premium p-8">
                       <h3 className="font-bold text-brand-navy mb-6">Quick Stats</h3>
                       <div className="space-y-4">
                          {[
                            { label: 'Avg Sale Value', val: 'Rp 2.4jt', icon: DollarSign },
                            { label: 'Churn Rate', val: '1.2%', icon: TrendingDown },
                            { label: 'CAC', val: 'Rp 280rb', icon: Target },
                          ].map((s, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 group hover:bg-white hover:shadow-lg transition-all duration-300">
                               <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-slate-50"><s.icon size={16} className="text-slate-400" /></div>
                                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</span>
                               </div>
                               <span className="text-sm font-black text-brand-navy">{s.val}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="animate-in fade-in duration-500 space-y-6">
                <div>
                   <h2 className="text-2xl font-bold text-brand-navy">General Settings</h2>
                   <p className="text-sm text-slate-500">Configure global platform behavior</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { title: 'Admin Security', desc: 'Mengatur 2FA dan penguncian sesi admin agar akses panel lebih aman.', icon: Shield },
                    { title: 'Notifications', desc: 'Mengatur alert saat lead baru masuk dari website, tryout gratis, atau pembayaran.', icon: Bell },
                    { title: 'Role Scope', desc: 'Hak akses menu mengikuti role aktif: Super Admin, Content Manager, atau Support.', icon: Users },
                  ].map((item) => (
                    <div key={item.title} className="card-premium p-5 bg-white">
                      <item.icon size={20} className="text-emerald-500 mb-3" />
                      <p className="text-sm font-black text-brand-navy mb-1">{item.title}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="card-premium p-8 space-y-6">
                      <h3 className="font-bold text-brand-navy flex items-center gap-2">
                        <Shield size={18} className="text-brand-blue" />
                        Platform Security
                      </h3>
                      <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <div>
                               <p className="text-sm font-bold text-brand-navy">Two-Factor Authentication</p>
                               <p className="text-xs text-slate-400">Force 2FA for all admin accounts</p>
                            </div>
                            <button onClick={() => notify('Pengaturan 2FA admin diperbarui.')} className="w-10 h-6 bg-slate-200 rounded-full relative">
                               <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all translate-x-4 bg-brand-blue" />
                            </button>
                         </div>
                         <div className="flex items-center justify-between">
                            <div>
                               <p className="text-sm font-bold text-brand-navy">Auto-Lock Session</p>
                               <p className="text-xs text-slate-400">Logout after 30 minutes of inactivity</p>
                            </div>
                            <button onClick={() => notify('Auto-lock session diperbarui.')} className="w-10 h-6 bg-brand-blue rounded-full relative">
                               <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all translate-x-4" />
                            </button>
                         </div>
                      </div>
                   </div>

                   <div className="card-premium p-8 space-y-6">
                      <h3 className="font-bold text-brand-navy flex items-center gap-2">
                        <Bell size={18} className="text-emerald-500" />
                        System Notifications
                      </h3>
                      <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <div>
                               <p className="text-sm font-bold text-brand-navy">New Lead Alerts</p>
                               <p className="text-xs text-slate-400">Notify when a new lead registers</p>
                            </div>
                            <button onClick={() => notify('Notifikasi lead baru diperbarui.')} className="w-10 h-6 bg-brand-blue rounded-full relative">
                               <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all translate-x-4" />
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}
         </div>

         {/* Program Editor Modal */}
         <AnimatePresence>
           {isSaveWebsiteConfirmOpen && (
             <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mb-6">
                    <Save size={28} />
                  </div>
                  <h3 className="text-2xl font-black text-brand-navy mb-3">Simpan perubahan website?</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-8">
                    Perubahan UI akan disimpan sebagai draft Website Editor. Pilih Iya untuk menyimpan, atau Tidak untuk kembali mengedit tanpa menyimpan.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setIsSaveWebsiteConfirmOpen(false);
                        notify('Perubahan website tidak disimpan.');
                      }}
                      className="btn-secondary py-4"
                    >
                      Tidak
                    </button>
                    <button
                      onClick={() => {
                        setIsSaveWebsiteConfirmOpen(false);
                        notify('Perubahan website berhasil disimpan sebagai draft.');
                      }}
                      className="btn-primary py-4"
                    >
                      Iya
                    </button>
                  </div>
                </motion.div>
             </div>
           )}
          </AnimatePresence>

          <AnimatePresence>
            {marketingMetricDetail && (
              <div className="fixed inset-0 z-[121] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[88vh] overflow-hidden flex flex-col"
                >
                  <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Marketing Metric Detail</p>
                      <h3 className="text-2xl font-black">{marketingMetricDetail.title}</h3>
                    </div>
                    <button onClick={() => setMarketingMetricDetail(null)} className="p-2 rounded-full hover:bg-white/10">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="p-8 overflow-y-auto space-y-6">
                    <div className="grid lg:grid-cols-3 gap-4">
                      <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-blue mb-2">Nilai Saat Ini</p>
                        <p className="text-4xl font-black text-brand-navy">{marketingMetricDetail.value}</p>
                      </div>
                      <div className="lg:col-span-2 rounded-2xl bg-slate-50 border border-slate-100 p-5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Penjelasan</p>
                        <p className="text-sm font-bold text-slate-600 leading-relaxed">{marketingMetricDetail.description}</p>
                        <p className="text-xs font-mono text-brand-blue mt-3">{marketingMetricDetail.formula}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Rocket size={18} className="text-brand-orange" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange">AI Agent Recommendation</p>
                      </div>
                      <p className="text-sm font-bold text-amber-900 leading-relaxed">{marketingMetricDetail.recommendation}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-100 overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign</th>
                            <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Clicks</th>
                            <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Leads</th>
                            <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Conv.</th>
                            <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ROI</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {marketingMetricDetail.rows.map((row) => (
                            <tr key={row.name} className="hover:bg-slate-50">
                              <td className="px-5 py-4">
                                <p className="text-sm font-bold text-brand-navy">{row.name}</p>
                                <p className="text-[10px] text-slate-400">{row.program}</p>
                              </td>
                              <td className="px-5 py-4 text-xs font-bold text-slate-500">{row.status}</td>
                              <td className="px-5 py-4 text-xs font-black text-brand-navy">{row.clicks.toLocaleString('id-ID')}</td>
                              <td className="px-5 py-4 text-xs font-black text-brand-navy">{row.leads.toLocaleString('id-ID')}</td>
                              <td className="px-5 py-4 text-xs font-black text-emerald-600">{row.conversion}</td>
                              <td className="px-5 py-4 text-xs font-black text-brand-orange">{row.roi}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {editingCampaign && (
              <div className="fixed inset-0 z-[122] flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col"
                >
                  <div className="p-5 sm:p-6 bg-brand-navy text-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <Megaphone size={22} className="text-brand-blue" />
                      <div>
                        <h3 className="font-bold">Campaign Editor</h3>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest">Campaign, audience, landing page, budget, tracking</p>
                      </div>
                    </div>
                    <button onClick={requestCloseCampaignEditor} className="p-3 bg-white/10 hover:bg-white/20 rounded-full">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="p-5 sm:p-8 grid lg:grid-cols-3 gap-6 lg:gap-8 overflow-y-auto flex-1">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nama Campaign</label>
                          <input value={editingCampaign.name} onChange={(e) => setEditingCampaign({ ...editingCampaign, name: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Program</label>
                          <select value={editingCampaign.program} onChange={(e) => setEditingCampaign({ ...editingCampaign, program: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold">
                            {[...new Set([editingCampaign.program, ...programsList.map((program) => program.title), 'SNBT Kedokteran', 'SKD CPNS', 'Kedinasan'])].map((program) => (
                              <option key={program}>{program}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tujuan</label>
                          <select value={editingCampaign.goal} onChange={(e) => setEditingCampaign({ ...editingCampaign, goal: e.target.value as MarketingCampaign['goal'] })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold">
                            {['Lead Generation', 'Pendaftaran Tryout', 'Penjualan Paket', 'Awareness'].map((goal) => <option key={goal}>{goal}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Status</label>
                          <select value={editingCampaign.status} onChange={(e) => setEditingCampaign({ ...editingCampaign, status: e.target.value as MarketingCampaign['status'] })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold">
                            {['Draft', 'Active', 'Paused', 'Completed'].map((status) => <option key={status}>{status}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Target Audience</label>
                          <textarea value={editingCampaign.audience} onChange={(e) => setEditingCampaign({ ...editingCampaign, audience: e.target.value })} className="w-full h-24 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm text-slate-600" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Lokasi Target</label>
                          <textarea value={editingCampaign.location} onChange={(e) => setEditingCampaign({ ...editingCampaign, location: e.target.value })} className="w-full h-24 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm text-slate-600" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Channel Marketing</label>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {marketingChannels.map((channel) => {
                            const checked = editingCampaign.channels.includes(channel);
                            return (
                              <button
                                key={channel}
                                type="button"
                                onClick={() => setEditingCampaign({
                                  ...editingCampaign,
                                  channels: checked ? editingCampaign.channels.filter((item) => item !== channel) : [...editingCampaign.channels, channel]
                                })}
                                className={`px-4 py-3 rounded-xl border text-xs font-bold flex items-center justify-between ${checked ? 'bg-blue-50 border-blue-100 text-brand-blue' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                              >
                                {channel}
                                {checked && <Check size={14} />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Landing Page</label>
                          <input value={editingCampaign.landingPageName} onChange={(e) => setEditingCampaign({ ...editingCampaign, landingPageName: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">URL</label>
                          <input value={editingCampaign.landingPageUrl} onChange={(e) => setEditingCampaign({ ...editingCampaign, landingPageUrl: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-mono text-sm" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Headline</label>
                          <input value={editingCampaign.headline} onChange={(e) => setEditingCampaign({ ...editingCampaign, headline: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">CTA</label>
                          <input value={editingCampaign.cta} onChange={(e) => setEditingCampaign({ ...editingCampaign, cta: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                        </div>
                      </div>

                      <div className="rounded-3xl border border-slate-100 p-5 bg-white">
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <div>
                            <h4 className="font-black text-brand-navy">Marketing Instrument</h4>
                            <p className="text-xs text-slate-500">Pilih bentuk instrumen campaign, lalu edit detail dan preview-nya.</p>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-[10px] font-black uppercase tracking-widest">{editingCampaign.instrumentType}</span>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2 mb-5">
                          {(['Landing Page', 'Paid Ad Creative', 'Organic Content', 'Social Account', 'Broadcast / Nurture'] as MarketingCampaign['instrumentType'][]).map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => applyInstrumentType(type)}
                              className={`px-3 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest text-left ${editingCampaign.instrumentType === type ? 'bg-brand-blue text-white border-brand-blue' : 'bg-slate-50 text-slate-500 border-slate-100 hover:text-brand-blue'}`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>

                        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 mb-5">
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Instrument Library</p>
                            <span className="text-[10px] font-bold text-slate-400">{hydrateCampaign(editingCampaign).instruments?.length || 0} assets</span>
                          </div>
                          <div className="grid md:grid-cols-2 gap-3">
                            {(hydrateCampaign(editingCampaign).instruments || []).map((instrument) => (
                              <button
                                key={instrument.id}
                                type="button"
                                onClick={() => selectCampaignInstrument(instrument)}
                                className={`text-left p-4 rounded-2xl border transition-all ${editingCampaign.activeInstrumentId === instrument.id ? 'bg-white border-brand-blue shadow-sm' : 'bg-white/70 border-slate-100 hover:border-blue-100'}`}
                              >
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue">{instrument.type}</span>
                                  <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${instrument.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : instrument.status === 'Ready' ? 'bg-blue-50 text-brand-blue' : 'bg-slate-100 text-slate-500'}`}>{instrument.status}</span>
                                </div>
                                <p className="text-sm font-black text-brand-navy">{instrument.name}</p>
                                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{instrument.owner} | {instrument.format}</p>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-5">
                          <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nama Instrumen</label>
                                <input value={editingCampaign.instrumentName} onChange={(e) => setEditingCampaign({ ...editingCampaign, instrumentName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" placeholder="Contoh: Reels Tryout SNBT Batch 1" />
                              </div>
                              <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{editingCampaign.instrumentType === 'Social Account' ? 'Akun / Handle' : editingCampaign.instrumentType === 'Paid Ad Creative' ? 'Platform / Ads Account' : 'Owner / Channel'}</label>
                                <input value={editingCampaign.instrumentOwner} onChange={(e) => setEditingCampaign({ ...editingCampaign, instrumentOwner: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Format Instrumen</label>
                              <input value={editingCampaign.instrumentFormat} onChange={(e) => setEditingCampaign({ ...editingCampaign, instrumentFormat: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                            </div>
                            <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{editingCampaign.instrumentType === 'Broadcast / Nurture' ? 'Template Pesan / Sequence' : editingCampaign.instrumentType === 'Organic Content' ? 'Hook, Caption, dan CTA' : 'Brief Editing Instrumen'}</label>
                              <textarea value={editingCampaign.instrumentBrief} onChange={(e) => setEditingCampaign({ ...editingCampaign, instrumentBrief: e.target.value })} className="w-full h-28 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm text-slate-600" />
                            </div>
                            <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Preview / Destination URL</label>
                              <input value={editingCampaign.instrumentPreviewUrl} onChange={(e) => setEditingCampaign({ ...editingCampaign, instrumentPreviewUrl: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-mono text-xs" />
                            </div>
                          </div>

                          <div className="rounded-2xl bg-slate-950 text-white p-5 flex flex-col justify-between min-h-[320px]">
                            {(() => {
                              const preset = getInstrumentPreset(editingCampaign.instrumentType);
                              const activeInstrument = getActiveInstrument(editingCampaign);
                              const landingSections = activeInstrument?.landingPageSections || [];
                              const isLandingPage = activeInstrument?.type === 'Landing Page';
                              if (isLandingPage && landingSections.length === 0) {
                                return (
                                  <div className="h-full flex flex-col justify-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Landing Page belum dibuat</p>
                                    <h5 className="text-2xl font-black mb-3">Mulai desain dulu untuk menampilkan preview</h5>
                                    <p className="text-sm text-white/60 leading-relaxed mb-6">Preview tidak ditampilkan sebelum landing page memiliki section. Pilih mulai kosong, gunakan template, atau generate dengan AI Agent.</p>
                                    <div className="grid gap-2">
                                      <button onClick={() => createLandingPageDesign('blank')} className="px-4 py-3 rounded-xl bg-white text-brand-navy text-xs font-black uppercase tracking-widest">Create Blank Page</button>
                                      <button onClick={() => createLandingPageDesign('template')} className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white text-xs font-black uppercase tracking-widest">Use Template</button>
                                    </div>
                                  </div>
                                );
                              }
                              return (
                                <>
                                  <div>
                                    <div className="flex items-center justify-between gap-3 mb-5">
                                      <p className="text-[10px] font-black uppercase tracking-widest text-white/50">{preset.previewLabel}</p>
                                      <span className="px-2 py-1 rounded-lg bg-white/10 text-[9px] font-black uppercase tracking-widest">{editingCampaign.instrumentType}</span>
                                    </div>
                                    <h5 className="text-xl font-black leading-tight mb-2">{editingCampaign.instrumentName || editingCampaign.headline}</h5>
                                    <p className="text-xs text-white/60 mb-5">{editingCampaign.instrumentOwner} | {editingCampaign.instrumentFormat}</p>
                                    <div className="rounded-2xl bg-white/10 border border-white/10 p-4 mb-4">
                                      <p className="text-sm font-bold leading-relaxed">{editingCampaign.headline}</p>
                                      <p className="text-xs text-white/60 mt-3 leading-relaxed">{editingCampaign.instrumentBrief}</p>
                                    </div>
                                    {isLandingPage && (
                                      <div className="space-y-2 mb-4 max-h-56 overflow-y-auto pr-1">
                                        {landingSections.filter((section) => section.visible).map((section) => (
                                          <div key={section.id} className="rounded-xl bg-white text-brand-navy p-3">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{section.type}</p>
                                            <p className="text-sm font-black">{section.title}</p>
                                            <p className="text-[10px] text-slate-500 line-clamp-2">{section.body}</p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-2">
                                      {preset.fields.map((field) => (
                                        <div key={field} className="rounded-xl bg-white/5 border border-white/10 p-3">
                                          <p className="text-[9px] font-black uppercase tracking-widest text-white/40">{field}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="mt-5 flex items-center justify-between gap-3">
                                    <p className="text-[10px] font-mono text-white/40 truncate">{editingCampaign.instrumentPreviewUrl}</p>
                                    <div className="flex gap-2 shrink-0">
                                      <button onClick={() => setInstrumentPreviewCampaign(editingCampaign)} className="px-4 py-2 rounded-xl bg-white text-brand-navy text-[10px] font-black uppercase tracking-widest">
                                        Preview
                                      </button>
                                      <button onClick={() => setInstrumentEditorCampaign(editingCampaign)} className="px-4 py-2 rounded-xl bg-brand-blue text-white text-[10px] font-black uppercase tracking-widest">
                                        Edit
                                      </button>
                                    </div>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </div>

                      {getActiveInstrument(editingCampaign)?.type === 'Landing Page' && (
                        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-brand-blue mb-1">Landing Page Editor</p>
                            <p className="text-sm font-bold text-brand-navy">Builder fleksibel dan AI Agent sekarang berada di editor landing page.</p>
                            <p className="text-xs text-slate-500 mt-1">Klik Edit pada preview instrumen untuk membuka workspace seperti aplikasi editor.</p>
                          </div>
                          <button onClick={() => setInstrumentEditorCampaign(editingCampaign)} className="btn-primary py-3 px-5 shrink-0">
                            <Edit2 size={16} /> Open Landing Page Editor
                          </button>
                        </div>
                      )}

                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Budget</label>
                          <div className="flex items-center rounded-xl bg-slate-50 border border-slate-100 focus-within:ring-2 focus-within:ring-blue-100">
                            <span className="pl-4 text-xs font-black text-slate-400">Rp</span>
                            <input inputMode="numeric" value={formatRupiahInput(editingCampaign.budget)} onChange={(e) => setEditingCampaign({ ...editingCampaign, budget: parseRupiah(e.target.value) })} className="w-full px-3 py-3 rounded-xl bg-transparent outline-none font-bold" placeholder="3.000.000" />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">Total dana campaign. Contoh: 3000000 atau 3.000.000</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Budget Harian</label>
                          <div className="flex items-center rounded-xl bg-slate-50 border border-slate-100 focus-within:ring-2 focus-within:ring-blue-100">
                            <span className="pl-4 text-xs font-black text-slate-400">Rp</span>
                            <input inputMode="numeric" value={formatRupiahInput(editingCampaign.dailyBudget)} onChange={(e) => setEditingCampaign({ ...editingCampaign, dailyBudget: parseRupiah(e.target.value) })} className="w-full px-3 py-3 rounded-xl bg-transparent outline-none font-bold" placeholder="200.000" />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">Batas belanja per hari untuk paid ads.</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Mulai</label>
                          <input type="date" value={editingCampaign.startDate} onChange={(e) => setEditingCampaign({ ...editingCampaign, startDate: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Selesai</label>
                          <input type="date" value={editingCampaign.endDate} onChange={(e) => setEditingCampaign({ ...editingCampaign, endDate: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-5 gap-4">
                        {[
                          { key: 'targetLeads', label: 'Target Leads' },
                          { key: 'views', label: 'Views' },
                          { key: 'clicks', label: 'Clicks' },
                          { key: 'leads', label: 'Leads' },
                          { key: 'registrations', label: 'Registrasi' }
                        ].map((field) => (
                          <div key={field.key}>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{field.label}</label>
                            <input type="number" value={Number(editingCampaign[field.key as keyof MarketingCampaign])} onChange={(e) => setEditingCampaign({ ...editingCampaign, [field.key]: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                          </div>
                        ))}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Revenue Attribution</label>
                          <div className="flex items-center rounded-xl bg-slate-50 border border-slate-100 focus-within:ring-2 focus-within:ring-blue-100">
                            <span className="pl-4 text-xs font-black text-slate-400">Rp</span>
                            <input inputMode="numeric" value={formatRupiahInput(editingCampaign.revenue)} onChange={(e) => setEditingCampaign({ ...editingCampaign, revenue: parseRupiah(e.target.value) })} className="w-full px-3 py-3 rounded-xl bg-transparent outline-none font-bold" placeholder="0" />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Target ROI</label>
                          <input type="number" step="0.1" value={editingCampaign.targetRoi} onChange={(e) => setEditingCampaign({ ...editingCampaign, targetRoi: Number(e.target.value) })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Catatan Optimasi</label>
                        <textarea value={editingCampaign.notes} onChange={(e) => setEditingCampaign({ ...editingCampaign, notes: e.target.value })} className="w-full h-24 px-5 py-4 rounded-2xl bg-amber-50 border border-amber-100 outline-none text-sm text-amber-900" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-slate-100 p-5 bg-slate-50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Campaign Report</p>
                        {[
                          { label: 'Conversion Rate', value: `${editingCampaign.clicks ? ((editingCampaign.leads / editingCampaign.clicks) * 100).toFixed(1) : '0.0'}%` },
                          { label: 'Cost per Lead', value: editingCampaign.leads ? formatRupiah(Math.round(editingCampaign.budget / editingCampaign.leads)) : 'Rp 0' },
                          { label: 'ROI Aktual', value: `${editingCampaign.budget ? (editingCampaign.revenue / editingCampaign.budget).toFixed(1) : '0.0'}x` },
                          { label: 'Target Leads', value: `${editingCampaign.leads}/${editingCampaign.targetLeads}` }
                        ].map((metric) => (
                          <div key={metric.label} className="flex items-center justify-between py-3 border-b border-slate-200 last:border-0">
                            <span className="text-xs font-bold text-slate-500">{metric.label}</span>
                            <span className="text-sm font-black text-brand-navy">{metric.value}</span>
                          </div>
                        ))}
                      </div>

                      <div className={`rounded-2xl border p-5 ${getMarketingBudgetStatus(editingCampaign).isEnough ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                        {(() => {
                          const budgetStatus = getMarketingBudgetStatus(editingCampaign);
                          return (
                            <>
                              <div className="flex items-center gap-2 mb-4">
                                <Wallet size={18} className={budgetStatus.isEnough ? 'text-emerald-600' : 'text-red-500'} />
                                <p className={`text-[10px] font-black uppercase tracking-widest ${budgetStatus.isEnough ? 'text-emerald-700' : 'text-red-600'}`}>Budget Check</p>
                              </div>
                              <div className="space-y-3">
                                {[
                                  { label: 'Sumber Anggaran', value: budgetStatus.sourceLabel },
                                  { label: 'Total Pool', value: formatRupiah(budgetStatus.budgetPool) },
                                  { label: 'Sudah Direalisasi', value: formatRupiah(budgetStatus.realizedBudget) },
                                  { label: 'Terpakai Campaign Lain', value: formatRupiah(budgetStatus.committedCampaignBudget) },
                                  { label: 'Tersedia Sekarang', value: formatRupiah(budgetStatus.available) },
                                  { label: 'Sisa Setelah Campaign Ini', value: formatRupiah(budgetStatus.remainingAfterCampaign) }
                                ].map((row) => (
                                  <div key={row.label} className="flex items-center justify-between gap-4 rounded-xl bg-white/80 border border-white px-3 py-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{row.label}</span>
                                    <span className="text-xs font-black text-brand-navy text-right">{row.value}</span>
                                  </div>
                                ))}
                              </div>
                              <p className={`text-xs font-bold leading-relaxed mt-4 ${budgetStatus.isEnough ? 'text-emerald-800' : 'text-red-700'}`}>
                                {budgetStatus.isEnough
                                  ? 'Anggaran memenuhi. Campaign bisa disimpan atau dipublish.'
                                  : 'Anggaran belum memenuhi. Tambah Anggaran Marketing di Financial Center atau turunkan budget campaign.'}
                              </p>
                            </>
                          );
                        })()}
                      </div>

                      <div className="rounded-2xl border border-slate-100 p-5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Funnel</p>
                        {[
                          { label: 'Views', value: editingCampaign.views },
                          { label: 'Clicks', value: editingCampaign.clicks },
                          { label: 'Leads', value: editingCampaign.leads },
                          { label: 'Registrations', value: editingCampaign.registrations }
                        ].map((step, index, arr) => (
                          <div key={step.label} className="mb-4 last:mb-0">
                            <div className="flex justify-between text-xs font-bold mb-2">
                              <span className="text-slate-500">{step.label}</span>
                              <span className="text-brand-navy">{step.value.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div className="h-full bg-brand-orange" style={{ width: `${Math.max(4, Math.min(100, (step.value / (arr[0].value || 1)) * 100))}%` }} />
                            </div>
                            {index > 0 && <p className="text-[9px] text-slate-400 mt-1">{arr[index - 1].value ? ((step.value / arr[index - 1].value) * 100).toFixed(1) : '0.0'}% conversion</p>}
                          </div>
                        ))}
                      </div>

                      <div className="rounded-2xl bg-blue-50 p-5 text-brand-navy">
                        <Info size={18} className="text-brand-blue mb-3" />
                        <p className="text-xs font-bold leading-relaxed">
                          Campaign yang disimpan akan muncul di workspace marketing. Tombol Lead menambahkan lead demo ke modul Manage Leads dengan source campaign.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <Rocket size={18} className="text-brand-blue" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-brand-blue">AI Agent Target Analysis</p>
                        </div>
                        {(() => {
                          const insight = getCampaignAgentInsight(editingCampaign);
                          return (
                            <div className="space-y-4">
                              <p className="text-xs font-bold text-brand-navy leading-relaxed">{insight.recommendation}</p>
                              <div className="grid grid-cols-2 gap-3">
                                {[
                                  { label: 'Durasi', value: `${insight.durationDays} hari` },
                                  { label: 'Gap Lead', value: insight.leadGap.toLocaleString('id-ID') },
                                  { label: 'CPL Target', value: formatRupiah(insight.plannedCpl) },
                                  { label: 'Lead/Hari', value: insight.targetDailyLeads.toLocaleString('id-ID') }
                                ].map((item) => (
                                  <div key={item.label} className="rounded-xl bg-white border border-blue-100 p-3">
                                    <p className="text-sm font-black text-brand-navy">{item.value}</p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="rounded-xl bg-white border border-blue-100 p-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Budget Reading</p>
                                <p className="text-xs font-bold text-slate-600 leading-relaxed">{insight.budgetHealth}</p>
                              </div>
                              <div className="rounded-xl bg-white border border-blue-100 p-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Channel Algorithm</p>
                                <div className="space-y-2">
                                  {insight.channelMix.map((item) => (
                                    <p key={item} className="text-xs font-bold text-slate-600 leading-relaxed">{item}</p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {editingCampaign.channels.includes('Organic Social') && (
                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                          <div className="flex items-center gap-2 mb-4">
                            <FileText size={18} className="text-emerald-600" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Organic Content Plan</p>
                          </div>
                          <div className="space-y-3">
                            {getCampaignAgentInsight(editingCampaign).organicPlan.map((item) => (
                              <div key={item} className="flex gap-3 rounded-xl bg-white border border-emerald-100 p-3">
                                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                <p className="text-xs font-bold text-slate-600 leading-relaxed">{item}</p>
                              </div>
                            ))}
                          </div>
                          <button onClick={() => openMarketingChannel(editingCampaign, 'Organic Social')} className="w-full mt-4 py-3 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest">
                            Buat Konten Organik
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-5 sm:px-8 py-4 border-t border-slate-100 flex flex-wrap justify-between gap-3 bg-white shrink-0 shadow-[0_-10px_30px_rgba(15,23,42,0.06)]">
                    <button onClick={requestCloseCampaignEditor} className="btn-secondary py-3 px-6 flex items-center gap-2"><X size={16} /> Kembali</button>
                    <button onClick={() => requestSaveCampaign(editingCampaign)} className="btn-primary py-3 px-8 flex items-center gap-2">
                      <Save size={18} /> Save Campaign
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {campaignPendingSave && (
              <div className="fixed inset-0 z-[132] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mb-6">
                    <Save size={26} />
                  </div>
                  <h3 className="text-xl font-black text-brand-navy mb-2">Simpan Campaign?</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    Campaign <span className="font-bold text-brand-blue">{campaignPendingSave.name}</span> akan disimpan dengan status <span className="font-bold">{campaignPendingSave.status}</span>.
                  </p>
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 mb-6">
                    <div className="flex justify-between gap-4 py-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Budget</span>
                      <span className="text-xs font-black text-brand-navy">{formatRupiah(campaignPendingSave.budget)}</span>
                    </div>
                    <div className="flex justify-between gap-4 py-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Budget Harian</span>
                      <span className="text-xs font-black text-brand-navy">{formatRupiah(campaignPendingSave.dailyBudget)}</span>
                    </div>
                    <div className="flex justify-between gap-4 py-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Leads</span>
                      <span className="text-xs font-black text-brand-navy">{campaignPendingSave.targetLeads.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCampaignPendingSave(null)}
                      className="btn-secondary py-3"
                    >
                      Tidak
                    </button>
                    <button
                      type="button"
                      onClick={() => saveCampaign(campaignPendingSave)}
                      className="btn-primary py-3"
                    >
                      Iya
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isCampaignCloseConfirmOpen && (
              <div className="fixed inset-0 z-[131] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
                >
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-brand-orange flex items-center justify-center mb-6">
                    <X size={26} />
                  </div>
                  <h3 className="text-xl font-black text-brand-navy mb-2">Tutup Campaign Editor?</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    Perubahan yang belum disimpan tidak akan masuk ke daftar campaign. Pilih Iya untuk menutup editor, atau Tidak untuk kembali mengedit.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCampaignCloseConfirmOpen(false)}
                      className="btn-secondary py-3"
                    >
                      Tidak
                    </button>
                    <button
                      type="button"
                      onClick={closeCampaignEditor}
                      className="btn-primary py-3"
                    >
                      Iya
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {campaignBudgetWarning && (
              <div className="fixed inset-0 z-[133] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8"
                >
                  <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-6">
                    <Wallet size={26} />
                  </div>
                  <h3 className="text-xl font-black text-brand-navy mb-2">Anggaran Campaign Kurang</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    Campaign <span className="font-bold text-brand-blue">{campaignBudgetWarning.campaign.name}</span> membutuhkan budget lebih besar dari anggaran marketing yang tersedia. Pilih tambah anggaran, simpan dulu sebagai draft, atau kembali mengedit nominal budget.
                  </p>
                  <div className="grid sm:grid-cols-3 gap-3 mb-6">
                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tersedia</p>
                      <p className="text-sm font-black text-brand-navy">{formatRupiah(campaignBudgetWarning.available)}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Kebutuhan</p>
                      <p className="text-sm font-black text-brand-navy">{formatRupiah(campaignBudgetWarning.required)}</p>
                    </div>
                    <div className="rounded-2xl bg-red-50 border border-red-100 p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1">Kurang</p>
                      <p className="text-sm font-black text-red-600">{formatRupiah(campaignBudgetWarning.shortage)}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 mb-6">
                    <p className="text-xs font-bold text-amber-900 leading-relaxed">
                      Campaign tidak akan dipublish sebelum anggaran cukup. Jika tetap ingin menyimpan, sistem akan menyimpannya sebagai Draft.
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setCampaignBudgetWarning(null)}
                      className="btn-secondary py-3"
                    >
                      Kembali Edit
                    </button>
                    <button
                      type="button"
                      onClick={saveCampaignAsDraftFromWarning}
                      className="py-3 rounded-xl bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest hover:bg-slate-200"
                    >
                      Simpan Draft
                    </button>
                    <button
                      type="button"
                      onClick={goToFinancialBudget}
                      className="btn-primary py-3 flex items-center justify-center gap-2"
                    >
                      <Wallet size={18} /> Tambah Anggaran
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {campaignValidationWarning && (
              <div className="fixed inset-0 z-[134] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8"
                >
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-brand-orange flex items-center justify-center mb-6">
                    <Info size={26} />
                  </div>
                  <h3 className="text-xl font-black text-brand-navy mb-2">{campaignValidationWarning.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">{campaignValidationWarning.message}</p>
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 mb-6">
                    <div className="flex justify-between gap-4 py-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Campaign</span>
                      <span className="text-xs font-black text-brand-navy text-right">{campaignValidationWarning.campaign.name}</span>
                    </div>
                    <div className="flex justify-between gap-4 py-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Budget</span>
                      <span className="text-xs font-black text-brand-navy">{formatRupiah(campaignValidationWarning.campaign.budget)}</span>
                    </div>
                    <div className="flex justify-between gap-4 py-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Budget Harian</span>
                      <span className="text-xs font-black text-brand-navy">{formatRupiah(campaignValidationWarning.campaign.dailyBudget)}</span>
                    </div>
                  </div>
                  <div className={`grid ${campaignValidationWarning.action === 'edit' ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                    <button
                      type="button"
                      onClick={() => setCampaignValidationWarning(null)}
                      className="btn-secondary py-3"
                    >
                      Kembali Edit
                    </button>
                    {campaignValidationWarning.action !== 'edit' && (
                      <button
                        type="button"
                        onClick={handleCampaignValidationAction}
                        className="btn-primary py-3"
                      >
                        {campaignValidationWarning.actionLabel || 'Lanjut'}
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {instrumentPreviewCampaign && (
              <div className="fixed inset-0 z-[136] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                >
                  <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Instrument Preview</p>
                      <h3 className="text-xl font-black">{instrumentPreviewCampaign.instrumentName}</h3>
                    </div>
                    <button onClick={() => setInstrumentPreviewCampaign(null)} className="p-2 rounded-full hover:bg-white/10">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-8 overflow-y-auto grid lg:grid-cols-2 gap-6">
                    <div className="rounded-3xl bg-slate-950 text-white p-6 min-h-[420px] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-5">
                          <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest">{instrumentPreviewCampaign.instrumentType}</span>
                          <span className="text-[10px] text-white/40">{instrumentPreviewCampaign.instrumentOwner}</span>
                        </div>
                        <h4 className="text-3xl font-black leading-tight mb-3">{instrumentPreviewCampaign.headline}</h4>
                        <p className="text-sm text-white/60 leading-relaxed mb-6">{instrumentPreviewCampaign.instrumentBrief}</p>
                        <div className="rounded-2xl bg-white text-brand-navy p-5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">CTA</p>
                          <p className="text-xl font-black">{instrumentPreviewCampaign.cta || 'Daftar Sekarang'}</p>
                        </div>
                      </div>
                      <p className="text-[10px] font-mono text-white/40 truncate mt-6">{instrumentPreviewCampaign.instrumentPreviewUrl}</p>
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-slate-100 p-5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Preview Detail</p>
                        {[
                          ['Tipe Instrumen', instrumentPreviewCampaign.instrumentType],
                          ['Nama Instrumen', instrumentPreviewCampaign.instrumentName],
                          ['Owner / Akun', instrumentPreviewCampaign.instrumentOwner],
                          ['Format', instrumentPreviewCampaign.instrumentFormat],
                          ['Destination', instrumentPreviewCampaign.instrumentPreviewUrl],
                          ['Landing Page', instrumentPreviewCampaign.landingPageUrl]
                        ].map(([label, value]) => (
                          <div key={label} className="flex justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
                            <span className="text-xs font-bold text-brand-navy text-right">{value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-blue mb-3">Checklist Sebelum Publish</p>
                        {getInstrumentPreset(instrumentPreviewCampaign.instrumentType).fields.map((field) => (
                          <div key={field} className="flex items-center gap-2 py-2">
                            <CheckCircle2 size={15} className="text-emerald-500" />
                            <span className="text-xs font-bold text-slate-600">{field}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {instrumentEditorCampaign && (
              <div className="fixed inset-0 z-[137] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  className={`bg-white shadow-2xl overflow-hidden flex flex-col ${instrumentEditorCampaign.instrumentType === 'Landing Page' ? 'rounded-2xl w-[96vw] h-[92vh]' : 'rounded-3xl max-w-4xl w-full max-h-[90vh]'}`}
                >
                  <div className="p-5 bg-brand-navy text-white flex items-center justify-between shrink-0">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Edit Instrument</p>
                      <h3 className="text-xl font-black">{instrumentEditorCampaign.instrumentType === 'Landing Page' ? 'Landing Page Visual Editor' : instrumentEditorCampaign.instrumentType}</h3>
                    </div>
                    <div className="flex gap-2">
                      {instrumentEditorCampaign.instrumentType === 'Landing Page' && (
                        <>
                          <select onChange={(e) => e.target.value && createLandingPageEditorDesign('template', e.target.value)} defaultValue="" className="px-3 py-2 rounded-xl bg-white/10 text-xs font-black uppercase tracking-widest outline-none">
                            <option value="" className="text-slate-900">Templates</option>
                            {landingPageTemplateOptions.map((template) => (
                              <option key={template.id} value={template.id} className="text-slate-900">{template.name}</option>
                            ))}
                          </select>
                        </>
                      )}
                      <button onClick={closeInstrumentEditor} className="p-2 rounded-full hover:bg-white/10">
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                  {instrumentEditorCampaign.instrumentType === 'Landing Page' ? (() => {
                    const active = getActiveInstrument(instrumentEditorCampaign);
                    const sections = active?.landingPageSections || [];
                    const selectedSection = sections[0];
                    return (
                      <div className="grid grid-cols-12 min-h-0 flex-1 bg-slate-100">
                        <aside className="col-span-3 xl:col-span-2 bg-white border-r border-slate-200 overflow-y-auto p-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Sections</p>
                          <div className="space-y-2">
                            {sections.length === 0 && (
                              <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
                                <p className="text-sm font-black text-brand-navy">Belum ada desain</p>
                                <p className="text-xs text-slate-500 mt-1">Pilih template dari toolbar, mulai Blank Page, atau minta AI Agent membuat halaman dari chat.</p>
                              </div>
                            )}
                            {sections.map((section, index) => (
                              <div key={section.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue">{section.type}</span>
                                  <div className="flex gap-1">
                                    <button onClick={() => moveLandingPageEditorSection(section.id, -1)} className="px-2 py-1 rounded-lg bg-white text-[10px] font-bold">Up</button>
                                    <button onClick={() => moveLandingPageEditorSection(section.id, 1)} className="px-2 py-1 rounded-lg bg-white text-[10px] font-bold">Down</button>
                                  </div>
                                </div>
                                <p className="text-xs font-black text-brand-navy line-clamp-1">{index + 1}. {section.title}</p>
                                <div className="flex gap-2 mt-3">
                                  <button onClick={() => updateLandingPageEditorSection(section.id, { visible: !section.visible })} className="flex-1 px-2 py-2 rounded-xl bg-white text-[10px] font-bold">{section.visible ? 'Hide' : 'Show'}</button>
                                  <button onClick={() => deleteLandingPageEditorSection(section.id)} className="px-2 py-2 rounded-xl bg-red-50 text-red-500 text-[10px] font-bold">Delete</button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            {(['Hero', 'Benefits', 'Program Detail', 'Social Proof', 'Offer', 'FAQ', 'Lead Form', 'CTA'] as LandingPageSection['type'][]).map((type) => (
                              <button key={type} onClick={() => addLandingPageEditorSection(type)} className="px-2 py-2 rounded-xl border border-dashed border-slate-200 text-[9px] font-black uppercase text-slate-500">{type}</button>
                            ))}
                          </div>
                          <div className="mt-5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Template Options</p>
                            <div className="space-y-2">
                              {landingPageTemplateOptions.map((template) => (
                                <button key={template.id} onClick={() => createLandingPageEditorDesign('template', template.id)} className="w-full text-left rounded-2xl bg-slate-50 border border-slate-100 p-3 hover:border-blue-100">
                                  <p className="text-xs font-black text-brand-navy">{template.name}</p>
                                  <p className="text-[10px] text-slate-500 mt-1">{template.detail}</p>
                                </button>
                              ))}
                            </div>
                          </div>
                        </aside>

                        <main className="col-span-6 xl:col-span-7 overflow-y-auto p-6">
                          <div className="mx-auto max-w-4xl bg-white shadow-2xl min-h-[900px]">
                            {sections.length === 0 ? (
                              <div className="min-h-[720px] flex flex-col items-center justify-center text-center p-10">
                                <Layout size={42} className="text-slate-300 mb-4" />
                                <h4 className="text-2xl font-black text-brand-navy">Preview belum tersedia</h4>
                                <p className="text-sm text-slate-500 mt-2 max-w-md">Landing page belum punya section. Preview akan muncul setelah Anda membuat desain dari template, blank page, atau AI Agent.</p>
                                <div className="flex flex-wrap justify-center gap-2 mt-6">
                                  <button onClick={() => createLandingPageEditorDesign('blank')} className="btn-secondary py-3 px-5">Blank Page</button>
                                  <button onClick={() => createLandingPageEditorDesign('template', 'lead-form')} className="btn-secondary py-3 px-5">Use Template</button>
                                </div>
                              </div>
                            ) : sections.filter((section) => section.visible).map((section) => {
                              const hasImage = Boolean(section.imageUrl && section.imageLayout !== 'None');
                              const isBackground = hasImage && section.imageLayout === 'Background';
                              const imageSizeClass = section.imageSize === 'Small' ? 'max-w-xs' : section.imageSize === 'Large' ? 'max-w-2xl' : section.imageSize === 'Full' ? 'w-full' : 'max-w-md';
                              const imageAlignClass = section.imageAlign === 'Start' ? 'justify-self-start' : section.imageAlign === 'End' ? 'justify-self-end' : 'justify-self-center';
                              return (
                                <section
                                  key={section.id}
                                  className={`relative overflow-hidden p-10 border-b border-slate-100 ${section.type === 'Hero' ? 'bg-brand-navy text-white min-h-[420px]' : section.type === 'Lead Form' ? 'bg-blue-50' : 'bg-white'}`}
                                  style={isBackground ? { backgroundImage: `linear-gradient(rgba(15,23,42,.72), rgba(15,23,42,.72)), url(${section.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                                >
                                  <div className={`${hasImage && !isBackground ? 'grid md:grid-cols-2 gap-8 items-center' : ''}`}>
                                    {hasImage && !isBackground && section.imageLayout === 'Left' && <img src={section.imageUrl} alt={section.title} className={`${imageSizeClass} ${imageAlignClass} w-full aspect-[4/3] object-cover rounded-2xl`} />}
                                    <div>
                                      {hasImage && !isBackground && section.imageLayout === 'Top' && <img src={section.imageUrl} alt={section.title} className={`${imageSizeClass} ${imageAlignClass} w-full aspect-[16/7] object-cover rounded-2xl mb-6`} />}
                                      <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${section.type === 'Hero' || isBackground ? 'text-white/50' : 'text-brand-blue'}`}>{section.type}</p>
                                      <h2 className={`text-3xl font-black leading-tight ${section.type === 'Hero' || isBackground ? 'text-white' : 'text-brand-navy'}`}>{section.title}</h2>
                                      <p className={`mt-4 text-sm leading-relaxed max-w-2xl ${section.type === 'Hero' || isBackground ? 'text-white/70' : 'text-slate-600'}`}>{section.body}</p>
                                      {section.cta && <button className="mt-6 px-6 py-3 rounded-xl bg-brand-orange text-white text-xs font-black uppercase tracking-widest">{section.cta}</button>}
                                    </div>
                                    {hasImage && !isBackground && section.imageLayout === 'Right' && <img src={section.imageUrl} alt={section.title} className={`${imageSizeClass} ${imageAlignClass} w-full aspect-[4/3] object-cover rounded-2xl`} />}
                                  </div>
                                </section>
                              );
                            })}
                          </div>
                        </main>

                        <aside className="col-span-3 bg-white border-l border-slate-200 overflow-y-auto p-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Properties</p>
                          {selectedSection ? (
                            <div className="space-y-4">
                              <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Section Type</label>
                                <select value={selectedSection.type} onChange={(e) => updateLandingPageEditorSection(selectedSection.id, { type: e.target.value as LandingPageSection['type'] })} className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold">
                                  {['Hero', 'Benefits', 'Program Detail', 'Social Proof', 'Offer', 'FAQ', 'Lead Form', 'CTA'].map((type) => <option key={type}>{type}</option>)}
                                </select>
                              </div>
                              <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Title</label>
                                <input value={selectedSection.title} onChange={(e) => updateLandingPageEditorSection(selectedSection.id, { title: e.target.value })} className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none" />
                              </div>
                              <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Body</label>
                                <textarea value={selectedSection.body} onChange={(e) => updateLandingPageEditorSection(selectedSection.id, { body: e.target.value })} className="w-full h-32 px-3 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" />
                              </div>
                              <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">CTA</label>
                                <input value={selectedSection.cta || ''} onChange={(e) => updateLandingPageEditorSection(selectedSection.id, { cta: e.target.value })} className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none" />
                              </div>
                              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Image Layout</p>
                                <select value={selectedSection.imageLayout || 'None'} onChange={(e) => updateLandingPageEditorSection(selectedSection.id, { imageLayout: e.target.value as LandingPageSection['imageLayout'] })} className="w-full px-3 py-3 rounded-xl bg-white border border-slate-100 text-xs font-bold">
                                  {['None', 'Background', 'Left', 'Right', 'Top'].map((layout) => <option key={layout}>{layout}</option>)}
                                </select>
                                <div className="grid grid-cols-2 gap-2 mt-3">
                                  <select value={selectedSection.imageSize || 'Medium'} onChange={(e) => updateLandingPageEditorSection(selectedSection.id, { imageSize: e.target.value as LandingPageSection['imageSize'] })} className="px-3 py-2 rounded-xl bg-white border border-slate-100 text-xs font-bold">
                                    {['Small', 'Medium', 'Large', 'Full'].map((size) => <option key={size}>{size}</option>)}
                                  </select>
                                  <select value={selectedSection.imageAlign || 'Center'} onChange={(e) => updateLandingPageEditorSection(selectedSection.id, { imageAlign: e.target.value as LandingPageSection['imageAlign'] })} className="px-3 py-2 rounded-xl bg-white border border-slate-100 text-xs font-bold">
                                    {['Start', 'Center', 'End'].map((align) => <option key={align}>{align}</option>)}
                                  </select>
                                </div>
                                <input value={selectedSection.imageUrl || ''} onChange={(e) => updateLandingPageEditorSection(selectedSection.id, { imageUrl: e.target.value })} className="w-full mt-3 px-3 py-3 rounded-xl bg-white border border-slate-100 text-xs font-mono outline-none" placeholder="Image URL" />
                                <div className="flex gap-2 mt-3">
                                  <input value={landingPageImageSearch} onChange={(e) => setLandingPageImageSearch(e.target.value)} className="min-w-0 flex-1 px-3 py-2 rounded-xl bg-white border border-slate-100 text-xs outline-none" placeholder="Cari gambar internet" />
                                  <button onClick={openInternetImageSearch} className="px-3 py-2 rounded-xl bg-brand-blue text-white text-[10px] font-black uppercase">Search</button>
                                </div>
                                <label className="mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white border border-dashed border-slate-200 text-xs font-black text-slate-500 cursor-pointer">
                                  <Upload size={14} /> Upload dari PC
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadSectionImage(selectedSection.id, e.target.files?.[0])} />
                                </label>
                                <div className="mt-3">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Database Gambar</p>
                                  <div className="grid grid-cols-3 gap-2 max-h-44 overflow-y-auto">
                                    {(hydrateCampaign(instrumentEditorCampaign).imageAssets || []).map((asset) => (
                                      <div key={asset.id} className="relative rounded-xl overflow-hidden border border-slate-100 bg-white group">
                                        <button onClick={() => applyImageAssetToSection(selectedSection.id, asset)} className="block w-full">
                                          <img src={asset.url} alt={asset.name} className="w-full aspect-square object-cover" />
                                          <span className="absolute left-1 bottom-1 right-1 truncate rounded bg-slate-900/70 px-1 py-0.5 text-[8px] text-white">{asset.name}</span>
                                        </button>
                                        <button onClick={() => removeImageAssetFromDatabase(asset.id)} className="absolute right-1 top-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-90">
                                          <X size={12} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                {selectedSection.imageUrl && (
                                  <div className="relative mt-3">
                                    <img src={selectedSection.imageUrl} alt="Section preview" className="w-full aspect-video object-cover rounded-xl border border-slate-100" />
                                    <button onClick={() => clearSectionImage(selectedSection.id)} className="absolute right-2 top-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg">
                                      <X size={14} />
                                    </button>
                                  </div>
                                )}
                              </div>
                              <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-3">AI Agent Chat</p>
                                <div className="space-y-2 max-h-52 overflow-y-auto pr-1 mb-3">
                                  {landingPageAiChat.map((chat, index) => (
                                    <div key={`${chat.role}-${index}`} className={`rounded-xl p-3 text-xs font-bold leading-relaxed ${chat.role === 'agent' ? 'bg-white text-amber-900' : 'bg-brand-navy text-white'}`}>
                                      {chat.text}
                                    </div>
                                  ))}
                                  {(active?.aiNotes || []).map((note) => (
                                    <div key={note} className="rounded-xl bg-white border border-amber-100 p-3 text-xs font-bold text-amber-900 leading-relaxed">{note}</div>
                                  ))}
                                </div>
                                <textarea
                                  value={landingPageAiPrompt}
                                  onChange={(e) => setLandingPageAiPrompt(e.target.value)}
                                  className="w-full h-20 px-3 py-2 rounded-xl bg-white border border-amber-100 text-xs outline-none"
                                  placeholder="Contoh: buat landing page tryout gratis SNBT dengan testimoni dan form WhatsApp"
                                />
                                <label className="mt-2 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white border border-dashed border-amber-200 text-xs font-black text-amber-700 cursor-pointer">
                                  <FileUp size={14} /> Upload referensi untuk AI
                                  <input
                                    type="file"
                                    multiple
                                    accept="image/*,.txt,.csv,.json,.md,.xls,.xlsx,.pdf"
                                    className="hidden"
                                    onChange={(e) => readAiReferenceFiles(e.target.files)}
                                  />
                                </label>
                                {(hydrateCampaign(instrumentEditorCampaign).imageAssets || []).length > 0 && (
                                  <div className="mt-3">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-2">Ambil dari Database Gambar</p>
                                    <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
                                      {(hydrateCampaign(instrumentEditorCampaign).imageAssets || []).map((asset) => (
                                        <div key={asset.id} className="relative rounded-xl overflow-hidden border border-amber-100 bg-white">
                                          <button onClick={() => addImageAssetAsAiReference(asset)} className="block w-full">
                                            <img src={asset.url} alt={asset.name} className="w-full aspect-square object-cover" />
                                            <span className="absolute left-1 bottom-1 right-1 truncate rounded bg-slate-900/70 px-1 py-0.5 text-[8px] text-white">{asset.name}</span>
                                          </button>
                                          <button onClick={() => removeImageAssetFromDatabase(asset.id)} className="absolute right-1 top-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center">
                                            <X size={12} />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {landingPageReferenceFiles.length > 0 && (
                                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto pr-1">
                                    {landingPageReferenceFiles.map((file) => (
                                      <div key={file.id} className="rounded-xl bg-white border border-amber-100 p-2">
                                        <div className="flex items-center gap-2">
                                          {file.preview ? <img src={file.preview} alt={file.name} className="w-10 h-10 rounded-lg object-cover" /> : <FileText size={18} className="text-amber-600" />}
                                          <div className="min-w-0">
                                            <p className="text-[10px] font-black text-brand-navy truncate">{file.name}</p>
                                            <p className="text-[9px] text-slate-400">{Math.ceil(file.size / 1024)} KB {file.text ? '| teks terbaca' : file.preview ? '| gambar terbaca' : '| metadata'}</p>
                                          </div>
                                          <button onClick={() => removeAiReferenceFile(file.id)} className="ml-auto w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                            <X size={12} />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <button onClick={runLandingPageAiAgent} className="w-full mt-2 py-3 rounded-xl bg-brand-orange text-white text-xs font-black uppercase tracking-widest">
                                  Kirim ke AI Agent
                                </button>
                              </div>
                              <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-blue mb-2">Readiness</p>
                                <p className="text-3xl font-black text-brand-navy">{Math.min(100, sections.length * 16)}%</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm font-bold text-slate-400">Pilih atau buat section untuk mengedit properti.</p>
                          )}
                        </aside>
                      </div>
                    );
                  })() : (
                    <div className="p-8 overflow-y-auto space-y-5">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nama Instrumen</label>
                          <input value={instrumentEditorCampaign.instrumentName} onChange={(e) => setInstrumentEditorCampaign({ ...instrumentEditorCampaign, instrumentName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Owner / Akun / Platform</label>
                          <input value={instrumentEditorCampaign.instrumentOwner} onChange={(e) => setInstrumentEditorCampaign({ ...instrumentEditorCampaign, instrumentOwner: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Format</label>
                          <input value={instrumentEditorCampaign.instrumentFormat} onChange={(e) => setInstrumentEditorCampaign({ ...instrumentEditorCampaign, instrumentFormat: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Preview / Destination URL</label>
                          <input value={instrumentEditorCampaign.instrumentPreviewUrl} onChange={(e) => setInstrumentEditorCampaign({ ...instrumentEditorCampaign, instrumentPreviewUrl: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-mono text-xs" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                          {instrumentEditorCampaign.instrumentType === 'Paid Ad Creative' ? 'Copy Iklan / Creative Brief' : instrumentEditorCampaign.instrumentType === 'Organic Content' ? 'Hook, Caption, Script, CTA' : instrumentEditorCampaign.instrumentType === 'Broadcast / Nurture' ? 'Template Pesan dan Follow-up' : 'Brief Editing'}
                        </label>
                        <textarea value={instrumentEditorCampaign.instrumentBrief} onChange={(e) => setInstrumentEditorCampaign({ ...instrumentEditorCampaign, instrumentBrief: e.target.value })} className="w-full h-40 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm text-slate-600" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Headline</label>
                          <input value={instrumentEditorCampaign.headline} onChange={(e) => setInstrumentEditorCampaign({ ...instrumentEditorCampaign, headline: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">CTA</label>
                          <input value={instrumentEditorCampaign.cta} onChange={(e) => setInstrumentEditorCampaign({ ...instrumentEditorCampaign, cta: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                        </div>
                      </div>
                      <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-3">Field yang perlu dicek untuk {instrumentEditorCampaign.instrumentType}</p>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {getInstrumentPreset(instrumentEditorCampaign.instrumentType).fields.map((field) => (
                            <label key={field} className="flex items-center gap-2 rounded-xl bg-white border border-amber-100 p-3 text-xs font-bold text-slate-600">
                              <input type="checkbox" className="rounded border-slate-300" defaultChecked />
                              {field}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="px-8 py-4 border-t border-slate-100 flex justify-between gap-3 bg-white shrink-0">
                    <button onClick={closeInstrumentEditor} className="btn-secondary py-3 px-6">Batal</button>
                    <button onClick={saveInstrumentEditor} className="btn-primary py-3 px-8 flex items-center gap-2"><Save size={18} /> Terapkan</button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isImageSearchOpen && (
              <div className="fixed inset-0 z-[138] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                >
                  <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Internet Image Search</p>
                      <h3 className="text-xl font-black">Pilih gambar untuk database campaign</h3>
                    </div>
                    <button onClick={() => setIsImageSearchOpen(false)} className="p-2 rounded-full hover:bg-white/10">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-6 overflow-y-auto">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {imageSearchResults.map((asset) => (
                        <div key={asset.id} className="rounded-2xl border border-slate-100 overflow-hidden bg-white">
                          <div className="relative">
                            <img src={asset.url} alt={asset.name} className="w-full aspect-[4/3] object-cover bg-slate-100" />
                            <button onClick={() => setImageSearchResults((current) => current.filter((item) => item.id !== asset.id))} className="absolute right-2 top-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg">
                              <X size={14} />
                            </button>
                          </div>
                          <div className="p-4">
                            <p className="text-sm font-black text-brand-navy">{asset.name}</p>
                            <p className="text-[10px] text-slate-400 mt-1">Source: Internet | Keyword: {asset.keyword}</p>
                            <button
                              onClick={() => addImageAssetToDatabase(asset)}
                              className="w-full mt-3 py-3 rounded-xl bg-brand-blue text-white text-xs font-black uppercase tracking-widest"
                            >
                              Simpan ke Database
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-5">
                      Gambar yang dipilih akan masuk database gambar campaign terlebih dahulu. Setelah itu pilih dari database gambar di panel Properties untuk dijadikan bahan edit section.
                    </p>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {editingVideo && (
             <div className="fixed inset-0 z-[122] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
               <motion.div
                 initial={{ opacity: 0, scale: 0.96, y: 12 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.96, y: 12 }}
                 className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden"
               >
                 <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <Video size={22} className="text-brand-blue" />
                     <div>
                       <h3 className="font-bold">Video Lesson Editor</h3>
                       <p className="text-[10px] text-white/50 uppercase tracking-widest">Metadata, akses, thumbnail, dan catatan materi</p>
                     </div>
                   </div>
                   <button onClick={() => setEditingVideo(null)} className="p-2 hover:bg-white/10 rounded-full">
                     <X size={20} />
                   </button>
                 </div>

                 <div className="p-8 grid lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-2 space-y-5">
                     <div className="grid md:grid-cols-2 gap-4">
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Judul Video</label>
                         <input value={editingVideo.title} onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Program</label>
                         <select value={editingVideo.program} onChange={(e) => setEditingVideo({ ...editingVideo, program: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold">
                           {programsList.map((program) => <option key={program.id} value={program.title}>{program.title}</option>)}
                           <option>Kedokteran Express</option>
                           <option>SNBT Intensive</option>
                           <option>CPNS Masterclass</option>
                           <option>Kedinasan Special</option>
                         </select>
                       </div>
                     </div>

                     <div className="grid md:grid-cols-4 gap-4">
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Durasi</label>
                         <input value={editingVideo.duration} onChange={(e) => setEditingVideo({ ...editingVideo, duration: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Views</label>
                         <input value={editingVideo.views} onChange={(e) => setEditingVideo({ ...editingVideo, views: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Status</label>
                         <select value={editingVideo.status} onChange={(e) => setEditingVideo({ ...editingVideo, status: e.target.value as VideoLessonRecord['status'] })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold">
                           <option>Draft</option>
                           <option>Published</option>
                           <option>Archived</option>
                         </select>
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Akses</label>
                         <select value={editingVideo.access} onChange={(e) => setEditingVideo({ ...editingVideo, access: e.target.value as VideoLessonRecord['access'] })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold">
                           <option>Free</option>
                           <option>Premium</option>
                           <option>Scholarship</option>
                         </select>
                       </div>
                     </div>

                     <div className="grid md:grid-cols-2 gap-4">
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Mentor</label>
                         <input value={editingVideo.mentor} onChange={(e) => setEditingVideo({ ...editingVideo, mentor: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Modul / Chapter</label>
                         <input value={editingVideo.module} onChange={(e) => setEditingVideo({ ...editingVideo, module: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" />
                       </div>
                     </div>

                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Deskripsi Video</label>
                       <textarea value={editingVideo.description} onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })} className="w-full h-28 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm text-slate-600" />
                     </div>

                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Catatan Editor / Materi</label>
                       <textarea value={editingVideo.notes} onChange={(e) => setEditingVideo({ ...editingVideo, notes: e.target.value })} className="w-full h-24 px-5 py-4 rounded-2xl bg-amber-50 border border-amber-100 outline-none text-sm text-amber-900" />
                     </div>
                   </div>

                   <div className="space-y-5">
                     <div className="card-premium p-5 bg-white">
                       <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 mb-4">
                         <img src={editingVideo.thumbnail} className="w-full h-full object-cover" alt="" />
                       </div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Thumbnail URL</label>
                       <input value={editingVideo.thumbnail} onChange={(e) => setEditingVideo({ ...editingVideo, thumbnail: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none text-xs" />
                     </div>

                     <div className="card-premium p-5 bg-white">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tags (pisahkan koma)</label>
                       <input value={editingVideo.tags.join(', ')} onChange={(e) => setEditingVideo({ ...editingVideo, tags: e.target.value.split(',') })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm" />
                       <div className="flex flex-wrap gap-2 mt-4">
                         {editingVideo.tags.filter(Boolean).map((tag) => (
                           <span key={tag} className="px-2 py-1 rounded-lg bg-blue-50 text-brand-blue text-[10px] font-black uppercase">{tag.trim()}</span>
                         ))}
                       </div>
                     </div>

                     <div className="card-premium p-5 bg-slate-50">
                       <p className="text-sm font-black text-brand-navy mb-3">Checklist Publish</p>
                       {[
                         ['Judul', editingVideo.title],
                         ['Durasi', editingVideo.duration],
                         ['Thumbnail', editingVideo.thumbnail],
                         ['Deskripsi', editingVideo.description],
                       ].map(([label, value]) => (
                         <div key={label} className="flex items-center justify-between py-2 border-b border-slate-200 last:border-b-0">
                           <span className="text-xs font-bold text-slate-500">{label}</span>
                           <CheckCircle2 size={16} className={value ? 'text-emerald-500' : 'text-slate-300'} />
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>

                 <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                   <button onClick={() => notify(`Preview video "${editingVideo.title}" dibuka di mode demo.`)} className="btn-secondary py-3 px-6">
                     <Play size={16} /> Preview
                   </button>
                   <div className="flex gap-3">
                     <button onClick={() => setEditingVideo(null)} className="btn-secondary py-3 px-6">Batal</button>
                     <button onClick={() => saveVideoEditor(editingVideo)} className="btn-primary py-3 px-8">
                       <Save size={18} /> Simpan Video
                     </button>
                   </div>
                 </div>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

         <AnimatePresence>
           {isLeadFormOpen && (
             <div className="fixed inset-0 z-[122] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
               <motion.div
                 initial={{ opacity: 0, scale: 0.96, y: 12 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.96, y: 12 }}
                 className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden"
               >
                 <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <UserPlus size={22} className="text-brand-orange" />
                     <div>
                       <h3 className="font-bold">Add New Lead</h3>
                       <p className="text-[10px] text-white/50 uppercase tracking-widest">Input calon siswa baru ke pipeline follow-up</p>
                     </div>
                   </div>
                   <button onClick={() => setIsLeadFormOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                     <X size={20} />
                   </button>
                 </div>

                 <div className="p-8 space-y-6">
                   <div className="grid md:grid-cols-2 gap-4">
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nama Lead</label>
                       <input value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" placeholder="Contoh: Rina Wijaya" />
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nomor WhatsApp</label>
                       <input value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" placeholder="0812-xxxx-xxxx" />
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Email</label>
                       <input type="email" value={leadForm.email} onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" placeholder="nama@email.com" />
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Status Pipeline</label>
                       <select value={leadForm.status} onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value as Lead['status'] })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold">
                         <option value="New">New</option>
                         <option value="Contacted">Contacted</option>
                         <option value="Qualified">Qualified</option>
                         <option value="Converted">Converted</option>
                         <option value="Lost">Lost</option>
                       </select>
                     </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-4">
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Minat Program</label>
                       <select value={leadForm.programOfInterest} onChange={(e) => setLeadForm({ ...leadForm, programOfInterest: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold">
                         {programsList.map((program) => (
                           <option key={program.id} value={program.title}>{program.title}</option>
                         ))}
                         <option value="Konsultasi Program">Konsultasi Program</option>
                         <option value="Tryout Gratis">Tryout Gratis</option>
                       </select>
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Sumber Lead</label>
                       <select value={leadForm.source} onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold">
                         <option>Admin Input</option>
                         <option>Form Kontak Website</option>
                         <option>Tryout Gratis</option>
                         <option>WhatsApp</option>
                         <option>Instagram</option>
                         <option>Google</option>
                         <option>TikTok</option>
                         <option>Referral</option>
                       </select>
                     </div>
                   </div>

                   <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Catatan Awal</label>
                     <textarea value={leadForm.note || ''} onChange={(e) => setLeadForm({ ...leadForm, note: e.target.value })} className="w-full h-28 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm text-slate-600" placeholder="Contoh: Tertarik paket premium, minta dihubungi malam hari." />
                   </div>

                   <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                     <div className="flex items-start gap-3">
                       <Info size={18} className="text-brand-blue shrink-0 mt-0.5" />
                       <p className="text-xs text-slate-600 leading-relaxed">
                         Lead yang ditambahkan di sini belum otomatis menjadi siswa. Gunakan tombol Convert to Student jika calon siswa sudah siap dimasukkan ke daftar user siswa.
                       </p>
                     </div>
                   </div>
                 </div>

                 <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                   <button onClick={() => setIsLeadFormOpen(false)} className="btn-secondary py-3 px-6">
                     Batal
                   </button>
                   <button onClick={saveLeadForm} className="btn-primary py-3 px-8">
                     <Save size={18} /> Simpan Lead
                   </button>
                 </div>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

         <AnimatePresence>
           {leadPendingConvert && (
             <div className="fixed inset-0 z-[126] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
               <motion.div
                 initial={{ opacity: 0, scale: 0.96, y: 12 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.96, y: 12 }}
                 className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
               >
                 <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mb-6">
                   <UserPlus size={26} />
                 </div>
                 <h3 className="text-xl font-black text-brand-navy mb-2">Convert lead menjadi siswa?</h3>
                 <p className="text-sm text-slate-500 leading-relaxed mb-6">
                   Lead <span className="font-bold text-brand-navy">{leadPendingConvert.name}</span> akan dibuat sebagai user siswa trial/gratis dan status lead berubah menjadi Converted.
                 </p>
                 <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-8">
                   <p className="text-xs font-bold text-brand-navy">{leadPendingConvert.programOfInterest}</p>
                   <p className="text-[10px] text-slate-400 mt-1">{leadPendingConvert.email} - {leadPendingConvert.phone}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                   <button
                     onClick={() => setLeadPendingConvert(null)}
                     className="btn-secondary py-3"
                   >
                     Batal
                   </button>
                   <button
                     onClick={() => convertLeadToStudent(leadPendingConvert)}
                     className="btn-primary py-3"
                   >
                     Ya, Convert
                   </button>
                 </div>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

         <AnimatePresence>
           {selectedLead && (
             <div className="fixed inset-0 z-[123] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
               <motion.div
                 initial={{ opacity: 0, scale: 0.96, y: 12 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.96, y: 12 }}
                 className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden"
               >
                 <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <UserPlus size={22} className="text-brand-orange" />
                     <div>
                       <h3 className="font-bold">Detail Lead</h3>
                       <p className="text-[10px] text-white/50 uppercase tracking-widest">Calon siswa sebelum menjadi user aktif</p>
                     </div>
                   </div>
                   <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-white/10 rounded-full">
                     <X size={20} />
                   </button>
                 </div>

                 <div className="p-8 grid lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-2 space-y-6">
                     <div className="grid md:grid-cols-2 gap-4">
                       {[
                         ['Nama', selectedLead.name],
                         ['Email', selectedLead.email],
                         ['WhatsApp', selectedLead.phone],
                         ['Tanggal Masuk', selectedLead.createdAt],
                         ['Minat Program', selectedLead.programOfInterest],
                         ['Sumber Lead', selectedLead.source],
                       ].map(([label, value]) => (
                         <div key={label} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                           <p className="text-sm font-bold text-brand-navy break-words">{value || '-'}</p>
                         </div>
                       ))}
                     </div>

                     <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                       <div className="flex items-start gap-3">
                         <Info size={18} className="text-brand-blue shrink-0 mt-0.5" />
                         <div>
                           <p className="text-sm font-black text-brand-navy mb-1">Interpretasi Lead</p>
                           <p className="text-xs text-slate-600 leading-relaxed">
                             Lead ini adalah calon siswa yang sudah menunjukkan minat, tetapi belum tentu menjadi siswa aktif. Jika sudah siap ikut program, gunakan Convert to Student atau arahkan ke pendaftaran paket.
                           </p>
                         </div>
                       </div>
                     </div>

                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Catatan Follow-up Admin</label>
                       <textarea
                         value={leadNoteDraft}
                         onChange={(event) => setLeadNoteDraft(event.target.value)}
                         className="w-full h-32 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-sm text-slate-600"
                         placeholder="Contoh: Sudah dihubungi, tertarik paket premium tetapi menunggu diskusi orang tua."
                       />
                       <button
                         onClick={() => {
                           updateLeadStatus(selectedLead, selectedLead.status, leadNoteDraft);
                           notify('Catatan lead disimpan.');
                         }}
                         className="mt-3 btn-secondary py-2 px-5"
                       >
                         <Save size={16} /> Simpan Catatan
                       </button>
                     </div>
                   </div>

                   <div className="space-y-5">
                     <div className="card-premium p-5 bg-white">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Status Lead</p>
                       <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                         selectedLead.status === 'Converted' ? 'bg-emerald-50 text-emerald-600' :
                         selectedLead.status === 'Lost' ? 'bg-red-50 text-red-600' :
                         selectedLead.status === 'Qualified' ? 'bg-blue-50 text-brand-blue' :
                         'bg-amber-50 text-amber-600'
                       }`}>
                         {selectedLead.status}
                       </span>
                       <p className="text-[10px] text-slate-400 mt-3">Terakhir dihubungi: {selectedLead.lastContactedAt || '-'}</p>
                     </div>

                     <div className="card-premium p-5 bg-white">
                       <p className="text-sm font-black text-brand-navy mb-4">Update Pipeline</p>
                       <div className="grid grid-cols-2 gap-2">
                         {(['New', 'Contacted', 'Qualified', 'Lost'] as Lead['status'][]).map((status) => (
                           <button
                             key={status}
                             onClick={() => {
                               updateLeadStatus(selectedLead, status, leadNoteDraft);
                               notify(`Status lead menjadi ${status}.`);
                             }}
                             className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${selectedLead.status === status ? 'bg-brand-blue text-white border-brand-blue' : 'bg-slate-50 text-slate-500 border-slate-100'}`}
                           >
                             {status}
                           </button>
                         ))}
                       </div>
                     </div>

                     <div className="card-premium p-5 bg-white space-y-3">
                       <button onClick={() => openLeadWhatsapp(selectedLead)} className="w-full py-3 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-widest">
                         Hubungi WhatsApp
                       </button>
                       <button onClick={() => setLeadPendingConvert(selectedLead)} className="w-full btn-primary py-3 text-xs uppercase tracking-widest">
                         <UserPlus size={16} /> Convert to Student
                       </button>
                       <button
                         onClick={() => {
                           const csv = [
                             'field,value',
                             `name,"${selectedLead.name}"`,
                             `email,"${selectedLead.email}"`,
                             `phone,"${selectedLead.phone}"`,
                             `program,"${selectedLead.programOfInterest}"`,
                             `source,"${selectedLead.source}"`,
                             `status,"${selectedLead.status}"`,
                             `note,"${leadNoteDraft}"`
                           ].join('\n');
                           downloadTextFile(`lead-${selectedLead.id}.csv`, csv);
                         }}
                         className="w-full py-3 rounded-xl bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-widest"
                       >
                         Export Detail
                       </button>
                     </div>
                   </div>
                 </div>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

         <AnimatePresence>
           {editingUser && (
             <div className="fixed inset-0 z-[124] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
               <motion.div
                 initial={{ opacity: 0, scale: 0.96, y: 12 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.96, y: 12 }}
                 className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden"
               >
                 <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <Users size={22} className="text-brand-blue" />
                     <div>
                       <h3 className="font-bold">Add / Edit User</h3>
                       <p className="text-[10px] text-white/50 uppercase tracking-widest">
                         {editingUser.role === 'Student' ? 'Form khusus user siswa' : 'Form khusus user admin/staff'}
                       </p>
                     </div>
                   </div>
                   <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-white/10 rounded-full">
                     <X size={20} />
                   </button>
                 </div>

                 <div className="p-8 grid lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-2 space-y-5">
                     <div className="grid md:grid-cols-2 gap-4">
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nama Lengkap</label>
                         <input value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" placeholder="Contoh: Budi Santoso" />
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Email Login</label>
                         <input type="email" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold" placeholder="nama@email.com" />
                       </div>
                     </div>

                     <div className="grid md:grid-cols-3 gap-4">
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Role</label>
                         <select
                           value={editingUser.role}
                           onChange={(e) => {
                             const nextRole = e.target.value as UserAccount['role'];
                             setEditingUser({
                               ...editingUser,
                               role: nextRole,
                               accountType: nextRole === 'Student' ? (editingUser.accountType === 'Staff' ? 'Free' : editingUser.accountType || 'Free') : 'Staff'
                             });
                           }}
                           className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none"
                         >
                           {editingUser.role === 'Student' ? (
                             <option value="Student">Student User</option>
                           ) : (
                             <>
                               <option value="Support">Support Staff</option>
                               <option value="Content Manager">Content Manager</option>
                               <option value="Admin">Super Admin</option>
                               <option value="Tutor">Tutor / Educator</option>
                             </>
                           )}
                         </select>
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Status</label>
                         <select value={editingUser.status} onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as UserAccount['status'] })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                           <option value="Active">Active</option>
                           <option value="Pending">Pending</option>
                           <option value="Inactive">Inactive</option>
                         </select>
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tanggal Join</label>
                         <input type="date" value={editingUser.joinedAt} onChange={(e) => setEditingUser({ ...editingUser, joinedAt: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none" />
                       </div>
                     </div>

                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Program / Scope</label>
                       <select value={editingUser.program || ''} onChange={(e) => setEditingUser({ ...editingUser, program: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                         <option value="">General / Semua Program</option>
                         {programsList.map((program) => (
                           <option key={program.id} value={program.title}>{program.title}</option>
                         ))}
                       </select>
                     </div>

                     {editingUser.role === 'Student' && (
                       <div className="grid md:grid-cols-3 gap-4">
                         <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tipe Siswa</label>
                           <select value={editingUser.accountType || 'Free'} onChange={(e) => setEditingUser({ ...editingUser, accountType: e.target.value as UserAccount['accountType'] })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none">
                             <option value="Free">Gratis</option>
                             <option value="Paid">Berbayar</option>
                             <option value="Scholarship">Beasiswa</option>
                           </select>
                         </div>
                         <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Paket Belajar</label>
                           <input value={editingUser.packageName || ''} onChange={(e) => setEditingUser({ ...editingUser, packageName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none" placeholder="Gratis / Premium / Beasiswa" />
                         </div>
                         <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Status Pembayaran</label>
                           <input value={editingUser.paymentStatus || ''} onChange={(e) => setEditingUser({ ...editingUser, paymentStatus: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none" placeholder="Free Active / Approved" />
                         </div>
                       </div>
                     )}

                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Avatar URL</label>
                       <input value={editingUser.avatar} onChange={(e) => setEditingUser({ ...editingUser, avatar: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm" />
                     </div>
                   </div>

                   <div className="space-y-5">
                     <div className="card-premium p-5 bg-slate-50">
                       <div className="flex items-center gap-3 mb-4">
                         <img src={editingUser.avatar} className="w-12 h-12 rounded-xl object-cover bg-white" alt="" />
                         <div>
                           <p className="text-sm font-black text-brand-navy">{editingUser.name || 'Nama User'}</p>
                           <p className="text-[10px] text-slate-400 font-bold">{editingUser.email || 'email belum diisi'}</p>
                         </div>
                       </div>
                       <span className="inline-flex px-2 py-1 rounded-lg bg-blue-50 text-brand-blue text-[10px] font-black uppercase">{editingUser.role}</span>
                     </div>

                     <div className="card-premium p-5 bg-white">
                       <h4 className="font-black text-brand-navy mb-3">Rincian Akses Role</h4>
                       <div className="flex flex-wrap gap-2">
                         {(rolePermissions[(editingUser.role as any) === 'Admin' ? 'Super Admin' : (editingUser.role as any) as AdminRole] || ['overview']).map((tab) => (
                           <span key={tab} className="px-2 py-1 rounded-lg bg-slate-50 text-slate-500 text-[9px] font-black uppercase">{tab}</span>
                         ))}
                         {editingUser.role === 'Student' && <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase">student dashboard</span>}
                         {editingUser.role === 'Tutor' && <span className="px-2 py-1 rounded-lg bg-amber-50 text-amber-600 text-[9px] font-black uppercase">kelas & materi</span>}
                       </div>
                       <p className="text-[10px] text-slate-400 leading-relaxed mt-4">
                         Admin dan Content Manager mendapat akses panel demo sesuai role. Student/Tutor tersimpan sebagai akun operasional dan dapat difilter di tabel user.
                       </p>
                     </div>
                   </div>
                 </div>

                 <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                   <button onClick={() => setEditingUser(null)} className="px-6 py-2.5 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100">
                     Batal
                   </button>
                   <button onClick={() => saveUser(editingUser)} className="btn-primary py-2.5 px-8">
                     <Save size={18} /> Simpan User
                   </button>
                 </div>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

         <AnimatePresence>
           {editingBlogPost && (
             <div className="fixed inset-0 z-[125] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
               <motion.div
                 initial={{ opacity: 0, scale: 0.96, y: 12 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.96, y: 12 }}
                 className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
               >
                 <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <FileText size={22} className="text-brand-orange" />
                     <div>
                       <h3 className="font-bold">Editor Info Menarik</h3>
                       <p className="text-[10px] text-white/50 uppercase tracking-widest">Blog, artikel, dan literasi</p>
                     </div>
                   </div>
                   <button onClick={() => setEditingBlogPost(null)} className="p-2 hover:bg-white/10 rounded-full">
                     <X size={20} />
                   </button>
                 </div>

                 <div className="px-8 py-5 bg-slate-50 border-b border-slate-100">
                   <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                     <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Template Cepat</p>
                       <p className="text-xs text-slate-500">Gunakan struktur artikel panjang tanpa mengubah desain halaman Info Menarik.</p>
                     </div>
                     <div className="flex flex-wrap gap-2">
                       {BLOG_EDITOR_TEMPLATES.map((template) => (
                         <button
                           key={template.label}
                           onClick={() => setEditingBlogPost({
                             ...editingBlogPost,
                             title: template.title,
                             excerpt: template.excerpt,
                             category: template.category,
                             content: template.content,
                             tags: template.tags
                           })}
                           className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-brand-blue hover:border-brand-blue"
                         >
                           {template.label}
                         </button>
                       ))}
                     </div>
                   </div>
                 </div>

                 <div className="p-8 overflow-y-auto grid lg:grid-cols-2 gap-8">
                   <div className="space-y-5">
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Judul</label>
                       <input value={editingBlogPost.title} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, title: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold outline-none" />
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Ringkasan Kartu</label>
                       <textarea value={editingBlogPost.excerpt} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, excerpt: e.target.value })} className="w-full h-24 px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm" />
                     </div>
                     <div className="grid md:grid-cols-2 gap-4">
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Kategori</label>
                         <select value={editingBlogPost.category} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, category: e.target.value as BlogPost['category'] })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold">
                           <option>Tips & Trik</option>
                           <option>Info PTN</option>
                           <option>Materi</option>
                           <option>Inspirasi</option>
                           <option>Literasi</option>
                         </select>
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Read Time</label>
                         <input value={editingBlogPost.readTime} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, readTime: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold" />
                       </div>
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tanggal Publish</label>
                       <input value={editingBlogPost.date} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, date: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none" placeholder="30 April 2026" />
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">URL Gambar</label>
                       <input value={editingBlogPost.image} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, image: e.target.value })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" />
                     </div>
                     <div className="grid md:grid-cols-2 gap-4">
                       <input value={editingBlogPost.author} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, author: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold" placeholder="Author" />
                       <input value={editingBlogPost.authorRole} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, authorRole: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold" placeholder="Author role" />
                     </div>
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tags (pisahkan koma)</label>
                       <input value={editingBlogPost.tags.join(', ')} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, tags: e.target.value.split(',') })} className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm outline-none" />
                     </div>
                     <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                       <p className="text-sm font-black text-brand-navy mb-2">Panduan isi artikel</p>
                       <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-600">
                         <span>Minimal 4 heading</span>
                         <span>1 checklist praktis</span>
                         <span>Contoh penerapan</span>
                         <span>CTA lembut ke program</span>
                       </div>
                     </div>
                   </div>

                   <div className="space-y-5">
                     <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Konten Markdown</label>
                       <textarea value={editingBlogPost.content} onChange={(e) => setEditingBlogPost({ ...editingBlogPost, content: e.target.value })} className="w-full h-[520px] px-5 py-4 rounded-2xl bg-slate-950 text-slate-100 border border-slate-800 outline-none font-mono text-xs leading-relaxed" />
                     </div>
                     <div className="grid grid-cols-3 gap-3">
                       {[
                         { label: 'Kata', value: editingBlogPost.content.trim().split(/\s+/).filter(Boolean).length },
                         { label: 'Heading', value: (editingBlogPost.content.match(/^##?\s/gm) || []).length },
                         { label: 'Tags', value: editingBlogPost.tags.filter(Boolean).length }
                       ].map((stat) => (
                         <div key={stat.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                           <p className="text-[10px] font-black text-slate-400 uppercase">{stat.label}</p>
                           <p className="text-lg font-black text-brand-navy">{stat.value}</p>
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>

                 <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                   <button onClick={() => setView?.('blogListing')} className="btn-secondary py-2.5 px-6">Preview Info Menarik</button>
                   <div className="flex gap-3">
                     <button onClick={() => setEditingBlogPost(null)} className="px-6 py-2.5 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100">Batal</button>
                     <button onClick={() => saveBlogPost(editingBlogPost)} className="btn-primary py-2.5 px-8">
                       <Save size={18} /> Simpan Artikel
                     </button>
                   </div>
                 </div>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

         {/* Program Editor Modal */}
         <AnimatePresence>
           {editingProgram && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col my-auto max-h-[90vh]"
                >
                   <div className="p-6 bg-brand-navy text-white flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-white/10 rounded-xl">
                            <Award size={20} className="text-brand-blue" />
                         </div>
                         <h3 className="font-bold">Edit Program: {editingProgram.title}</h3>
                      </div>
                      <button onClick={() => { setEditingProgram(null); setProgramPendingSave(null); }} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                         <X size={20} />
                      </button>
                   </div>

                   <div className="p-8 overflow-y-auto">
                      <div className="grid md:grid-cols-2 gap-10">
                         {/* Basic Info */}
                         <div className="space-y-6">
                            <h4 className="text-xs font-black text-brand-blue uppercase tracking-widest border-b pb-2">Program Details</h4>
                            
                            <div className="grid grid-cols-2 gap-4">
                               <div className="col-span-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Program Title</label>
                                  <input 
                                    className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm"
                                    value={editingProgram.title}
                                    onChange={(e) => setEditingProgram({ ...editingProgram, title: e.target.value })}
                                  />
                               </div>
                               <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Category</label>
                                  <input 
                                    className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm"
                                    value={editingProgram.category}
                                    onChange={(e) => setEditingProgram({ ...editingProgram, category: e.target.value })}
                                  />
                               </div>
                               <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Base Price Display</label>
                                  <input 
                                    className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none font-bold text-sm"
                                    value={editingProgram.price}
                                    onChange={(e) => setEditingProgram({ ...editingProgram, price: e.target.value })}
                                  />
                               </div>
                            </div>

                            <div>
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Short Description</label>
                               <textarea 
                                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm h-20 resize-none"
                                  value={editingProgram.description}
                                  onChange={(e) => setEditingProgram({ ...editingProgram, description: e.target.value })}
                               />
                            </div>

                            <div>
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Long Description / Detail Program</label>
                               <textarea 
                                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm h-28 resize-none"
                                  value={editingProgram.longDescription || ''}
                                  onChange={(e) => setEditingProgram({ ...editingProgram, longDescription: e.target.value })}
                                  placeholder="Deskripsi panjang yang muncul di halaman detail program."
                               />
                            </div>

                            <div>
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Target Audience</label>
                               <input 
                                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm font-medium"
                                  value={editingProgram.target}
                                  onChange={(e) => setEditingProgram({ ...editingProgram, target: e.target.value })}
                               />
                            </div>

                            <div>
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Schedule Text</label>
                               <input 
                                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-sm font-medium"
                                  value={editingProgram.schedule}
                                  onChange={(e) => setEditingProgram({ ...editingProgram, schedule: e.target.value })}
                                  placeholder="e.g. Sen & Rab, 19:00"
                               />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                               <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Image URL</label>
                                  <input 
                                     className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-xs"
                                     value={editingProgram.image}
                                     onChange={(e) => setEditingProgram({ ...editingProgram, image: e.target.value })}
                                  />
                               </div>
                               <div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Theme Color (Tailwind Class)</label>
                                  <input 
                                     className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-xs"
                                     value={editingProgram.color}
                                     onChange={(e) => setEditingProgram({ ...editingProgram, color: e.target.value })}
                                     placeholder="bg-blue-600"
                                  />
                               </div>
                            </div>

                            <div>
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Facilities (Comma separated)</label>
                               <textarea 
                                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none text-xs h-20"
                                  value={editingProgram.facilities?.join(', ')}
                                  onChange={(e) => setEditingProgram({ ...editingProgram, facilities: e.target.value.split(',').map(f => f.trim()) })}
                               />
                            </div>

                            <div>
                               <div className="flex items-center justify-between mb-3">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Curriculum</label>
                                  <button
                                    type="button"
                                    onClick={() => setEditingProgram({
                                      ...editingProgram,
                                      curriculum: [
                                        ...(editingProgram.curriculum || []),
                                        { week: (editingProgram.curriculum?.length || 0) + 1, topic: 'Topik Baru', description: 'Deskripsi materi.' }
                                      ]
                                    })}
                                    className="text-[10px] font-black text-brand-blue uppercase tracking-widest hover:underline"
                                  >
                                    + Add Week
                                  </button>
                               </div>
                               <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                  {(editingProgram.curriculum || []).map((item, index) => (
                                    <div key={`${item.week}-${index}`} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                      <div className="grid grid-cols-12 gap-2 mb-2">
                                        <input
                                          type="number"
                                          value={item.week}
                                          onChange={(event) => {
                                            const next = [...(editingProgram.curriculum || [])];
                                            next[index] = { ...item, week: Number(event.target.value) || index + 1 };
                                            setEditingProgram({ ...editingProgram, curriculum: next });
                                          }}
                                          className="col-span-2 px-3 py-2 rounded-xl bg-white border border-slate-200 outline-none text-xs font-bold"
                                        />
                                        <input
                                          value={item.topic}
                                          onChange={(event) => {
                                            const next = [...(editingProgram.curriculum || [])];
                                            next[index] = { ...item, topic: event.target.value };
                                            setEditingProgram({ ...editingProgram, curriculum: next });
                                          }}
                                          className="col-span-9 px-3 py-2 rounded-xl bg-white border border-slate-200 outline-none text-xs font-bold"
                                          placeholder="Topik"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setEditingProgram({ ...editingProgram, curriculum: editingProgram.curriculum?.filter((_, i) => i !== index) || [] })}
                                          className="col-span-1 text-slate-300 hover:text-red-500"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                      <textarea
                                        value={item.description}
                                        onChange={(event) => {
                                          const next = [...(editingProgram.curriculum || [])];
                                          next[index] = { ...item, description: event.target.value };
                                          setEditingProgram({ ...editingProgram, curriculum: next });
                                        }}
                                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 outline-none text-xs h-16 resize-none"
                                        placeholder="Deskripsi minggu ini"
                                      />
                                    </div>
                                  ))}
                               </div>
                            </div>
                         </div>

                         {/* Packages Info */}
                         <div className="space-y-6">
                            <div className="flex items-center justify-between border-b pb-2">
                               <h4 className="text-xs font-black text-brand-orange uppercase tracking-widest">Program Packages</h4>
                               <button 
                                  onClick={() => {
                                     const newPackage: ProgramPackage = {
                                        id: `pkg-${Date.now()}`,
                                        name: 'New Package',
                                        price: 'Rp 0',
                                        duration: '1 Bulan',
                                        features: []
                                     };
                                     setEditingProgram({
                                        ...editingProgram,
                                        packages: [...(editingProgram.packages || []), newPackage]
                                     });
                                  }}
                                  className="flex items-center gap-1 text-[10px] font-black text-brand-blue uppercase tracking-widest hover:underline"
                               >
                                  <Plus size={14} /> Add Package
                               </button>
                            </div>

                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                               {editingProgram.packages?.map((pkg, pIdx) => (
                                  <div key={pkg.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 relative group">
                                     <button 
                                        onClick={() => {
                                           const newPkgs = editingProgram.packages?.filter((_, i) => i !== pIdx);
                                           setEditingProgram({ ...editingProgram, packages: newPkgs });
                                        }}
                                        className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                     >
                                        <Trash2 size={14} />
                                     </button>
                                     
                                     <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div>
                                           <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Package Name</label>
                                           <input 
                                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 outline-none text-[11px] font-bold"
                                              value={pkg.name}
                                              onChange={(e) => {
                                                 const newPkgs = [...(editingProgram.packages || [])];
                                                 newPkgs[pIdx] = { ...pkg, name: e.target.value };
                                                 setEditingProgram({ ...editingProgram, packages: newPkgs });
                                              }}
                                           />
                                        </div>
                                        <div>
                                           <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Price</label>
                                           <input 
                                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 outline-none text-[11px] font-bold"
                                              value={pkg.price}
                                              onChange={(e) => {
                                                 const newPkgs = [...(editingProgram.packages || [])];
                                                 newPkgs[pIdx] = { ...pkg, price: e.target.value };
                                                 setEditingProgram({ ...editingProgram, packages: newPkgs });
                                              }}
                                           />
                                        </div>
                                        <div>
                                           <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Duration</label>
                                           <input 
                                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 outline-none text-[11px] font-bold"
                                              value={pkg.duration}
                                              onChange={(e) => {
                                                 const newPkgs = [...(editingProgram.packages || [])];
                                                 newPkgs[pIdx] = { ...pkg, duration: e.target.value };
                                                 setEditingProgram({ ...editingProgram, packages: newPkgs });
                                              }}
                                           />
                                        </div>
                                        <label className="flex items-center gap-2 mt-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                           <input
                                             type="checkbox"
                                             checked={Boolean(pkg.isPopular)}
                                             onChange={(e) => {
                                                const newPkgs = [...(editingProgram.packages || [])].map((item, index) => (
                                                  index === pIdx ? { ...item, isPopular: e.target.checked } : { ...item, isPopular: false }
                                                ));
                                                setEditingProgram({ ...editingProgram, packages: newPkgs });
                                             }}
                                             className="rounded border-slate-300"
                                           />
                                           Popular
                                        </label>
                                     </div>

                                     <div>
                                        <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Features (Line separated)</label>
                                        <textarea 
                                           className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 outline-none text-[10px] h-20"
                                           value={pkg.features.join('\n')}
                                           onChange={(e) => {
                                              const newPkgs = [...(editingProgram.packages || [])];
                                              newPkgs[pIdx] = { ...pkg, features: e.target.value.split('\n').filter(f => f.trim()) };
                                              setEditingProgram({ ...editingProgram, packages: newPkgs });
                                           }}
                                        />
                                     </div>
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
                      <button 
                         onClick={() => { setEditingProgram(null); setProgramPendingSave(null); }}
                         className="px-6 py-2.5 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-200 transition-colors"
                      >
                         Discard
                      </button>
                      <button 
                         onClick={() => setProgramPendingSave(editingProgram)}
                         className="btn-primary py-2.5 px-8 shadow-xl shadow-blue-500/20"
                      >
                         <Save size={18} />
                         Update Program
                      </button>
                   </div>
                </motion.div>
             </div>
           )}
         </AnimatePresence>

         <AnimatePresence>
           {programPendingSave && (
             <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
               <motion.div
                 initial={{ opacity: 0, scale: 0.96, y: 12 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.96, y: 12 }}
                 className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
               >
                 <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mb-6">
                   <Save size={26} />
                 </div>
                 <h3 className="text-xl font-black text-brand-navy mb-2">Simpan Perubahan Program?</h3>
                 <p className="text-sm text-slate-500 leading-relaxed mb-8">
                   Perubahan pada <span className="font-bold text-brand-blue">{programPendingSave.title}</span> akan tersinkron ke menu program, detail program, form pendaftaran, dan pembayaran.
                 </p>
                 <div className="grid grid-cols-2 gap-3">
                   <button
                     type="button"
                     onClick={() => setProgramPendingSave(null)}
                     className="px-6 py-3 rounded-xl border-2 border-slate-100 text-slate-500 text-xs font-black uppercase tracking-widest hover:bg-slate-50"
                   >
                     Tidak
                   </button>
                   <button
                     type="button"
                     onClick={() => saveProgram(programPendingSave)}
                     className="btn-primary py-3 text-xs uppercase tracking-widest font-black"
                   >
                     Ya, Update
                   </button>
                 </div>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

         <AnimatePresence>
           {financeMetricDetail && (
             <div className="fixed inset-0 z-[135] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
               <motion.div
                 initial={{ opacity: 0, scale: 0.96, y: 12 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.96, y: 12 }}
                 className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col"
               >
                 <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Detail Metrik</p>
                     <h3 className="text-xl font-black">{financeMetricDetail.title}</h3>
                     <p className="text-xs text-white/60 mt-1">{financeMetricDetail.description}</p>
                   </div>
                   <button onClick={() => setFinanceMetricDetail(null)} className="p-2 rounded-full hover:bg-white/10">
                     <X size={20} />
                   </button>
                 </div>
                 <div className="overflow-y-auto">
                   <table className="w-full text-left">
                     <thead className="bg-slate-50 sticky top-0">
                       <tr>
                         <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama / Item</th>
                         <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Program / Kategori</th>
                         <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nominal</th>
                         <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       {financeMetricDetail.rows.map((row, index) => (
                         <tr key={row.id || `${row.student}-${index}`} className="hover:bg-slate-50">
                           <td className="px-6 py-4">
                             <p className="text-sm font-bold text-brand-navy">{row.student || row.name || '-'}</p>
                             <p className="text-[10px] text-slate-400">{row.email || row.invoiceNumber || row.id || ''}</p>
                           </td>
                           <td className="px-6 py-4 text-xs font-bold text-slate-600">{row.program || row.category || '-'}</td>
                           <td className="px-6 py-4 text-sm font-mono font-black text-brand-navy">{typeof row.amount === 'number' ? formatRupiah(row.amount) : row.amount || 'Rp 0'}</td>
                           <td className="px-6 py-4">
                             <span className="px-2 py-1 rounded-lg bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">{row.status || '-'}</span>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                   {financeMetricDetail.rows.length === 0 && (
                     <div className="p-10 text-center text-sm font-bold text-slate-400">
                       Belum ada data untuk metrik ini.
                     </div>
                   )}
                 </div>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

         <AnimatePresence>
           {selectedFinanceRecord && (
             <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
               <motion.div
                 initial={{ opacity: 0, scale: 0.96, y: 12 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.96, y: 12 }}
                 className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
               >
                 <div className="p-6 bg-brand-navy text-white flex items-center justify-between">
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Detail Calon Siswa</p>
                     <h3 className="text-xl font-black">{selectedFinanceRecord.tx.student}</h3>
                   </div>
                   <button onClick={() => setSelectedFinanceRecord(null)} className="p-2 rounded-full hover:bg-white/10">
                     <X size={20} />
                   </button>
                 </div>

                 <div className="p-8 overflow-y-auto grid lg:grid-cols-2 gap-6">
                   <div className="space-y-5">
                     <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                       <h4 className="font-black text-brand-navy mb-4">Informasi Pendaftaran</h4>
                       {[
                         ['Nama', selectedFinanceRecord.tx.registrationData?.name || selectedFinanceRecord.tx.student],
                         ['Email', selectedFinanceRecord.tx.registrationData?.email || selectedFinanceRecord.tx.email],
                         ['WhatsApp', selectedFinanceRecord.tx.registrationData?.phone || selectedFinanceRecord.tx.phone],
                         ['Sekolah', selectedFinanceRecord.tx.registrationData?.school || '-'],
                         ['Alamat', selectedFinanceRecord.tx.registrationData?.address || '-'],
                         ['Target', selectedFinanceRecord.tx.registrationData?.targetPTN || '-'],
                         ['Alasan Bergabung', selectedFinanceRecord.tx.registrationData?.joinReason || '-']
                       ].map(([label, value]) => (
                         <div key={label} className="flex justify-between gap-4 py-2 border-b border-slate-200/70 last:border-b-0">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
                           <span className="text-xs font-bold text-brand-navy text-right">{value || '-'}</span>
                         </div>
                       ))}
                     </div>

                     <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                       <h4 className="font-black text-brand-navy mb-4">Program & Pembayaran</h4>
                       {[
                         ['Program', selectedFinanceRecord.tx.program],
                         ['Paket', selectedFinanceRecord.tx.packageName],
                         ['Nominal', selectedFinanceRecord.tx.amount],
                         ['Metode', selectedFinanceRecord.tx.method || '-'],
                         ['Status', selectedFinanceRecord.tx.status],
                         ['Invoice', selectedFinanceRecord.tx.invoiceNumber || selectedFinanceRecord.tx.id],
                         ['Tanggal', selectedFinanceRecord.tx.date || '-']
                       ].map(([label, value]) => (
                         <div key={label} className="flex justify-between gap-4 py-2 border-b border-blue-100 last:border-b-0">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
                           <span className="text-xs font-bold text-brand-navy text-right">{value || '-'}</span>
                         </div>
                       ))}
                       <button onClick={() => openStoredInvoice(selectedFinanceRecord.tx)} className="w-full mt-4 btn-secondary py-3">
                         <FileText size={18} /> Buka Invoice
                       </button>
                     </div>
                   </div>

                   <div className="space-y-5">
                     <div className="p-5 rounded-2xl bg-white border border-slate-200">
                       <h4 className="font-black text-brand-navy mb-4">Dokumen Lampiran</h4>
                       {selectedFinanceRecord.proof ? (
                         <div className="space-y-4">
                           <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                             <p className="text-sm font-black text-brand-navy">{selectedFinanceRecord.proof.fileName}</p>
                             <p className="text-[10px] text-slate-400 mt-1">{selectedFinanceRecord.proof.type || 'Payment Proof'} - {Math.ceil((selectedFinanceRecord.proof.fileSize || 0) / 1024)} KB</p>
                             <p className="text-[10px] font-bold text-slate-500 mt-2">Status: {selectedFinanceRecord.proof.status || '-'}</p>
                           </div>
                           <button onClick={() => openStoredProof(selectedFinanceRecord.proof)} className="w-full btn-secondary py-3">
                             <Upload size={18} /> Buka Lampiran
                           </button>
                         </div>
                       ) : (String(selectedFinanceRecord.tx.status || '').toLowerCase().includes('scholarship') || String(selectedFinanceRecord.tx.status || '').toLowerCase().includes('free') || String(selectedFinanceRecord.tx.type || '').toLowerCase() === 'free') ? (
                         <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-800">
                           Paket gratis/beasiswa tidak memerlukan upload bukti pembayaran. Review dilakukan dari data pendaftaran.
                         </div>
                       ) : (
                         <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-xs font-bold text-amber-800">
                           Calon siswa belum melampirkan bukti pembayaran/dokumen beasiswa.
                         </div>
                       )}
                     </div>

                     <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                       <h4 className="font-black text-brand-navy mb-4">Aksi Admin</h4>
                       {(selectedFinanceRecord.proof || String(selectedFinanceRecord.tx.status || '').toLowerCase().includes('scholarship') || String(selectedFinanceRecord.tx.status || '').toLowerCase().includes('free') || String(selectedFinanceRecord.tx.type || '').toLowerCase() === 'free') ? (
                         <div className="grid grid-cols-2 gap-3">
                           <button
                             onClick={() => updateFinanceRecordStatus(selectedFinanceRecord.tx.invoiceNumber || selectedFinanceRecord.tx.id, String(selectedFinanceRecord.tx.status).toLowerCase().includes('scholarship') ? 'Scholarship Approved' : 'Payment Approved')}
                             className="py-3 rounded-xl bg-emerald-500 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-600"
                           >
                             Approve
                           </button>
                           <button
                             onClick={() => updateFinanceRecordStatus(selectedFinanceRecord.tx.invoiceNumber || selectedFinanceRecord.tx.id, 'Needs Revision')}
                             className="py-3 rounded-xl bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600"
                           >
                             Tidak
                           </button>
                         </div>
                       ) : (
                         <p className="text-xs text-slate-500 font-bold leading-relaxed">Approve/tolak tersedia setelah lampiran diterima.</p>
                       )}

                       <div className="grid grid-cols-2 gap-3 mt-4">
                         <button onClick={() => openReviewEmail(selectedFinanceRecord.tx)} className="py-3 rounded-xl bg-white border border-slate-200 text-brand-blue text-xs font-black uppercase tracking-widest">
                           Email Review
                         </button>
                         <button onClick={() => openReviewWhatsapp(selectedFinanceRecord.tx)} className="py-3 rounded-xl bg-white border border-slate-200 text-emerald-600 text-xs font-black uppercase tracking-widest">
                           WhatsApp Review
                         </button>
                       </div>
                       <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">
                         Gunakan tombol review jika data ditolak atau lampiran belum sesuai. Pesan akan mengarahkan calon siswa untuk memverifikasi ulang data/dokumen.
                       </p>
                     </div>
                   </div>
                 </div>
               </motion.div>
             </div>
           )}
         </AnimatePresence>

          {/* Video Upload Modal */}
          <AnimatePresence>
            {isUploadVideoModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 pointer-events-none">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => uploadStatus === 'idle' && setIsUploadVideoModalOpen(false)}
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto"
                />
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 pointer-events-auto flex flex-col max-h-[90vh]"
                >
                  <div className="p-8 bg-brand-navy text-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                        <Video size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-none mb-1">Upload Video Materi</h3>
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none">Content Library Management</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => uploadStatus === 'idle' && setIsUploadVideoModalOpen(false)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="p-10 overflow-y-auto space-y-8">
                    {uploadStatus === 'idle' ? (
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Video Title</label>
                             <input 
                               value={videoForm.title}
                               onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
                               placeholder="e.g. Strategi IRT SNBT 2024"
                               className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all font-medium"
                             />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Associated Program</label>
                             <select 
                               value={videoForm.program}
                               onChange={(e) => setVideoForm({...videoForm, program: e.target.value})}
                               className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all font-bold text-sm"
                             >
                               {PROGRAMS.map(p => <option key={p.id}>{p.title}</option>)}
                             </select>
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Duration (Min:Sec)</label>
                             <input 
                               value={videoForm.duration}
                               onChange={(e) => setVideoForm({...videoForm, duration: e.target.value})}
                               placeholder="e.g. 45:20"
                               className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all font-mono"
                             />
                           </div>
                        </div>
                        <div className="space-y-6">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Video Description</label>
                             <textarea 
                               value={videoForm.description}
                               onChange={(e) => setVideoForm({...videoForm, description: e.target.value})}
                               placeholder="Jelaskan detail materi pembahasan video ini..."
                               className="w-full h-44 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all text-sm font-medium resize-none"
                             />
                           </div>
                        </div>
                        
                        <div className="md:col-span-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Video File</label>
                           <label className="w-full p-10 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 hover:bg-slate-50 hover:border-brand-blue transition-all cursor-pointer group">
                              <div className="p-4 bg-blue-50 text-brand-blue rounded-2xl group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                 <Plus size={32} />
                              </div>
                              <div className="text-center">
                                 <p className="text-sm font-bold text-brand-navy">Choose video or drag and drop</p>
                                 <p className="text-xs text-slate-400 mt-1">MP4, MOV up to 500MB</p>
                              </div>
                              <input type="file" className="hidden" accept="video/*" onChange={simulateVideoUpload} />
                           </label>
                        </div>
                      </div>
                    ) : uploadStatus === 'uploading' ? (
                      <div className="py-20 flex flex-col items-center justify-center text-center gap-8">
                         <div className="relative">
                            <svg className="w-32 h-32 transform -rotate-90">
                              <circle 
                                cx="64" cy="64" r="60" 
                                stroke="currentColor" 
                                strokeWidth="8" 
                                fill="transparent" 
                                className="text-slate-100"
                              />
                              <circle 
                                cx="64" cy="64" r="60" 
                                stroke="currentColor" 
                                strokeWidth="8" 
                                fill="transparent" 
                                strokeDasharray={377}
                                strokeDashoffset={377 - (377 * uploadProgress) / 100}
                                className="text-brand-blue transition-all duration-300"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-brand-navy">
                               {uploadProgress}%
                            </div>
                         </div>
                         <div>
                            <h4 className="text-xl font-bold text-brand-navy mb-2">Mengupload Video...</h4>
                            <p className="text-slate-500 font-medium">Harap jangan menutup jendela ini hingga proses selesai.</p>
                         </div>
                      </div>
                    ) : (
                      <div className="py-20 flex flex-col items-center justify-center text-center gap-8 animate-in zoom-in-95 duration-500">
                         <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/50">
                            <Check size={48} strokeWidth={4} />
                         </div>
                         <div>
                            <h4 className="text-2xl font-bold text-brand-navy mb-2">Video Berhasil Diupload!</h4>
                            <p className="text-slate-500 font-medium">Materi "{videoForm.title}" telah ditambahkan ke database.</p>
                         </div>
                      </div>
                    )}
                  </div>

                  {uploadStatus === 'idle' && (
                    <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4 shrink-0">
                       <button 
                          onClick={() => setIsUploadVideoModalOpen(false)}
                          className="px-6 py-3 text-xs font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                       >
                          Cancel
                       </button>
                       <button 
                          disabled={!videoForm.title}
                          onClick={simulateVideoUpload}
                          className="btn-primary py-3 px-10 shadow-xl shadow-blue-500/20 disabled:opacity-50"
                       >
                          Start Upload
                       </button>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>
      </main>
    </div>
  );
};
