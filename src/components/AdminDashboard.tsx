import React, { useState, useMemo } from 'react';
import { 
  Users, 
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
  Image as ImageIcon
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { Quote } from 'lucide-react';
import { USER_ACCOUNTS, MOCK_FEEDBACKS, TESTIMONIALS, PROGRAMS } from '../constants';
import { UserAccount, Lead, Question, Testimonial, Program, ProgramPackage } from '../types';

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

type AdminRole = 'Super Admin' | 'Content Manager' | 'Support';

interface AdminMember {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  lastActive: string;
}

type AdminTab = 'overview' | 'users' | 'leads' | 'marketing' | 'website' | 'finance' | 'programs' | 'content' | 'questions' | 'testimonials' | 'reports' | 'settings';

export const AdminDashboard: React.FC<{ logout: () => void, setView?: (v: any) => void }> = ({ logout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [adminRole, setAdminRole] = useState<AdminRole>('Super Admin');
  const localLeads: Lead[] = (() => {
    try {
      return JSON.parse(localStorage.getItem('theprams_demo_leads') || '[]');
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
    'Super Admin': ['overview', 'users', 'leads', 'marketing', 'website', 'finance', 'programs', 'content', 'questions', 'testimonials', 'reports', 'settings'],
    'Content Manager': ['overview', 'programs', 'content', 'questions', 'testimonials', 'website'],
    'Support': ['overview', 'users', 'leads', 'settings', 'finance']
  };

  const isTabAllowed = (tab: AdminTab) => rolePermissions[adminRole].includes(tab);
  
  // User Management State
  const [users, setUsers] = useState<UserAccount[]>(USER_ACCOUNTS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);
  const [programsList, setProgramsList] = useState<Program[]>(PROGRAMS);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  const saveProgram = (updatedProg: Program) => {
    if (programsList.find(p => p.id === updatedProg.id)) {
      setProgramsList(programsList.map(p => p.id === updatedProg.id ? updatedProg : p));
    } else {
      setProgramsList([...programsList, updatedProg]);
    }
    setEditingProgram(null);
  };

  const deleteProgram = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus program ini?')) {
      setProgramsList(programsList.filter(p => p.id !== id));
    }
  };


  const pendingTestimonials = useMemo(() => testimonials.filter(t => t.status === 'Pending'), [testimonials]);
  const approvedTestimonials = useMemo(() => testimonials.filter(t => t.status === 'Approved'), [testimonials]);
  const rejectedTestimonials = useMemo(() => testimonials.filter(t => t.status === 'Rejected'), [testimonials]);

  const updateTestimonialStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };
  
  // Question Bank State
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>(['IRT', 'SNBT', 'CPNS', 'Kedokteran', 'Matematika']);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isManageTagsModalOpen, setIsManageTagsModalOpen] = useState(false);
  const [isUploadVideoModalOpen, setIsUploadVideoModalOpen] = useState(false);
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
  
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const deleteUser = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus akun ini?')) {
      setUsers(users.filter(u => u.id !== id));
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
  };

  const saveQuestion = (updatedQ: Question) => {
    if (questions.find(q => q.id === updatedQ.id)) {
      setQuestions(questions.map(q => q.id === updatedQ.id ? updatedQ : q));
    } else {
      setQuestions([updatedQ, ...questions]);
    }
    setEditingQuestion(null);
  };

  const deleteQuestion = (id: string) => {
    if (confirm('Delete this question?')) {
      setQuestions(questions.filter(q => q.id !== id));
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
                <button className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 border border-slate-100 relative">
                   <Bell size={20} />
                   <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>
                <button className="btn-primary py-2.5">
                   <Plus size={18} />
                   Add New
                </button>
             </div>
          </header>

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
                   <button className="btn-primary py-2 px-6">
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
                         {[...localLeads, ...MOCK_LEADS].map((lead) => (
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
                                    <button className="p-2 text-brand-blue hover:bg-blue-50 rounded-lg" title="Convert to Student">
                                       <UserPlus size={16} />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
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
                   <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          const newUser: UserAccount = {
                            id: Date.now().toString(),
                            name: '',
                            email: '',
                            role: 'Student',
                            avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
                            status: 'Active',
                            joinedAt: new Date().toISOString().split('T')[0]
                          };
                          setUsers([...users, newUser]);
                        }}
                        className="btn-primary py-2 px-6"
                      >
                         <Plus size={18} />
                         Add Staff User
                      </button>
                   </div>
                </div>

                <div className="card-premium overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-100">
                         <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User Details</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">System Role</th>
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
                                      const updatedUsers = users.map(u => u.id === user.id ? { ...u, role: e.target.value as any } : u);
                                      setUsers(updatedUsers);
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
                                 <div className="flex flex-wrap gap-1 max-w-[200px]">
                                    {rolePermissions[(user.role as any) === 'Admin' ? 'Super Admin' : (user.role as any)]?.slice(0, 3).map(tab => (
                                      <span key={tab} className="text-[8px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{tab}</span>
                                    ))}
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-slate-400 hover:text-brand-blue transition-colors">
                                       <Shield size={16} />
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
                    <p className="text-3xl font-black text-brand-navy">124</p>
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
                    <p className="text-3xl font-black text-brand-navy">78%</p>
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
                    {[
                      { title: 'Anatomi Dasar Bagian 1', program: 'Kedokteran Express', duration: '45:20', views: '1.2k', date: '2 hari lalu' },
                      { title: 'TPA Penalaran Logis', program: 'SNBT Intensive', duration: '32:15', views: '2.5k', date: '3 hari lalu' },
                      { title: 'UUD 1945 & Amandemen', program: 'CPNS Masterclass', duration: '58:40', views: '840', date: '5 hari lalu' },
                      { title: 'Persiapan Psikotes', program: 'Kedinasan Special', duration: '25:10', views: '1.1k', date: '1 minggu lalu' },
                    ].map((video, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-brand-blue/30 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-10 bg-slate-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                            <Play size={16} className="text-slate-400 group-hover:text-brand-blue relative z-10" />
                            <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-brand-navy">{video.title}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{video.program}</p>
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
                            <button className="p-2 text-slate-300 hover:text-brand-blue transition-colors"><Edit2 size={16} /></button>
                            <button className="p-2 text-slate-300 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
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
                  <button className="btn-primary py-2 px-6 flex items-center gap-2">
                    <Plus size={18} /> New Campaign
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="card-premium p-6">
                    <TrendingUp className="text-emerald-500 mb-4" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Conversion Rate</p>
                    <p className="text-3xl font-black text-brand-navy">4.8%</p>
                    <p className="text-[10px] text-emerald-500 font-bold mt-2">+0.5% from last week</p>
                  </div>
                  <div className="card-premium p-6">
                    <Users className="text-brand-blue mb-4" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Leads</p>
                    <p className="text-3xl font-black text-brand-navy">2,450</p>
                    <p className="text-[10px] text-brand-blue font-bold mt-2">Organic: 65% | Paid: 35%</p>
                  </div>
                  <div className="card-premium p-6">
                    <Target className="text-brand-orange mb-4" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total ROI</p>
                    <p className="text-3xl font-black text-brand-navy">3.2x</p>
                    <p className="text-[10px] text-brand-orange font-bold mt-2">Target ROI: 4.0x</p>
                  </div>
                </div>

                <div className="card-premium p-8">
                  <h3 className="font-bold text-brand-navy mb-6">Landing Page Management</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'SNBT Intensive 2025', url: '/snbt-2025', status: 'Active', hits: '12k' },
                      { name: 'Kedokteran Special', url: '/kedokteran', status: 'Active', hits: '8.5k' },
                      { name: 'CPNS Masterclass', url: '/cpns', status: 'Draft', hits: '0' },
                    ].map((page, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white shadow-sm rounded-xl"><Layout size={18} className="text-slate-400" /></div>
                          <div>
                            <p className="text-sm font-bold text-brand-navy">{page.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{page.url}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="text-xs font-bold text-brand-navy">{page.hits}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Views</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${page.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                            {page.status}
                          </span>
                          <button className="p-2 text-slate-300 hover:text-brand-blue"><Edit2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'website' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-brand-navy">Website Editor Panel</h2>
                  <div className="flex gap-3">
                    <button className="btn-secondary py-2 px-6">Preview Changes</button>
                    <button className="btn-primary py-2 px-6">Publish Updates</button>
                  </div>
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
                          <button className="px-4 py-2 bg-white rounded-lg text-[10px] font-bold text-brand-blue border border-slate-200">Change Image</button>
                        </div>
                      </div>
                    </div>

                    <div className="card-premium p-8">
                      <h3 className="font-bold text-brand-navy mb-6">Global Navigation</h3>
                      <div className="flex flex-wrap gap-3">
                        {['Beranda', 'Program', 'Tryout', 'Testimoni', 'Kontak'].map(nav => (
                          <div key={nav} className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                            <span className="text-sm font-bold text-brand-navy">{nav}</span>
                            <button className="text-slate-300 hover:text-red-400"><X size={14} /></button>
                          </div>
                        ))}
                        <button className="px-4 py-2 border border-dashed border-slate-200 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest">+ Add Menu</button>
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
                          <button className="w-full py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-widest">Edit SEO Tags</button>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'finance' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-brand-navy">Pusat Keuangan</h2>
                  <button className="btn-secondary py-2 px-6 flex items-center gap-2">
                    <Download size={18} /> Export Report
                  </button>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Revenue', value: 'Rp 1.850 jt', color: 'text-brand-blue', icon: Banknote },
                    { label: 'Pending Payment', value: 'Rp 42 jt', color: 'text-brand-orange', icon: Clock },
                    { label: 'Net Profit', value: 'Rp 680 jt', color: 'text-emerald-500', icon: TrendingUp },
                    { label: 'Active Subscriptions', value: '1,120', color: 'text-indigo-500', icon: Users },
                  ].map((stat, i) => (
                    <div key={i} className="card-premium p-6">
                      <stat.icon className={`${stat.color} mb-3`} size={20} />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-xl font-black text-brand-navy">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="card-premium overflow-hidden">
                  <div className="p-8 border-b border-slate-100">
                    <h3 className="font-bold text-brand-navy">Recent Transactions</h3>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Program</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        ...localTransactions,
                        { student: 'Andi Pratama', program: 'Med-Express', amount: 'Rp 3.500.000', status: 'Success', date: '25 Apr 2026' },
                        { student: 'Salsabila Putri', program: 'SNBT Gold', amount: 'Rp 2.250.000', status: 'Success', date: '25 Apr 2026' },
                        { student: 'Dewi Lestari', program: 'CPNS Master', amount: 'Rp 1.800.000', status: 'Pending', date: '24 Apr 2026' },
                        { student: 'Budi Santoso', program: 'Med-Express', amount: 'Rp 3.500.000', status: 'Success', date: '24 Apr 2026' },
                      ].map((tx, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-4 text-sm font-bold text-brand-navy">{tx.student}</td>
                          <td className="px-8 py-4 text-xs text-slate-500">
                            {tx.program}
                            {tx.method && <p className="text-[10px] text-slate-400 mt-1">{tx.method} {tx.packageName ? `- ${tx.packageName}` : ''}</p>}
                          </td>
                          <td className="px-8 py-4 text-sm font-mono font-bold text-brand-navy">{tx.amount}</td>
                          <td className="px-8 py-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${tx.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-right text-xs text-slate-400 font-medium">{tx.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-4 bg-slate-50 text-center">
                    <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-brand-blue">Load More Transactions</button>
                  </div>
                </div>
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
                        <input type="text" placeholder="Search programs..." className="text-sm bg-transparent border-none focus:ring-0 font-medium" />
                      </div>
                      <button className="btn-primary py-2 px-6 whitespace-nowrap">
                         <Plus size={18} />
                         New Program
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {[
                     { label: 'Courses', value: '12', icon: BookOpen, color: 'text-brand-blue' },
                     { label: 'Avg Price', value: 'Rp 1.8M', icon: DollarSign, color: 'text-emerald-500' },
                     { label: 'Total Sales', value: '840', icon: TrendingUp, color: 'text-brand-orange' },
                     { label: 'Published', value: '9', icon: Globe, color: 'text-indigo-500' }
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
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500">
                         <Filter size={14} />
                         <span>Category: All</span>
                      </div>
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
                         {programsList.map((item, i) => (
                           <tr key={i} className="hover:bg-slate-50/30 transition-colors group">
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
                               <button className="w-full py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-brand-blue hover:text-brand-blue transition-all">
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
                      <button className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white shadow-sm text-brand-navy">All ({testimonials.length})</button>
                      <button className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">Pending ({pendingTestimonials.length})</button>
                      <button className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">Approved ({approvedTestimonials.length})</button>
                   </div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {testimonials.map((t) => (
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
                             <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-200 transition-all">
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
                      <button className="btn-secondary flex items-center gap-2 px-6">
                        <Download size={18} />
                        Export
                      </button>
                   </div>
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
                            <div className="w-10 h-6 bg-slate-200 rounded-full relative">
                               <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all translate-x-4 bg-brand-blue" />
                            </div>
                         </div>
                         <div className="flex items-center justify-between">
                            <div>
                               <p className="text-sm font-bold text-brand-navy">Auto-Lock Session</p>
                               <p className="text-xs text-slate-400">Logout after 30 minutes of inactivity</p>
                            </div>
                            <div className="w-10 h-6 bg-brand-blue rounded-full relative">
                               <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all translate-x-4" />
                            </div>
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
                            <div className="w-10 h-6 bg-brand-blue rounded-full relative">
                               <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all translate-x-4" />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}
         </div>

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
                      <button onClick={() => setEditingProgram(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
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
                         onClick={() => setEditingProgram(null)}
                         className="px-6 py-2.5 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-200 transition-colors"
                      >
                         Discard
                      </button>
                      <button 
                         onClick={() => saveProgram(editingProgram)}
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
