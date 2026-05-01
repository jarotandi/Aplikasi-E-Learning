export type View = 
  | 'landing' 
  | 'programs' 
  | 'programDetail' 
  | 'mentorProfile'
  | 'tryoutListing' 
  | 'dashboard' 
  | 'learning' 
  | 'exam' 
  | 'result' 
  | 'admin' 
  | 'contact' 
  | 'testimonials'
  | 'schedule'
  | 'profile'
  | 'login'
  | 'payment'
  | 'finalRegistration'
  | 'blogListing'
  | 'blogPost'
  | 'register'
  | 'guestRegistration';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Program' | 'Technical' | 'Enrollment';
}

export interface USP {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
}

export interface Tutor {
  id: string;
  name: string;
  role: string;
  subjects: string[];
  bio: string;
  experience: string;
  education: string;
  image: string;
  videoUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isPremium: boolean;
  premiumUntil?: string;
  role: 'Student' | 'Tutor' | 'Admin' | 'Support' | 'Content Manager';
  permissions?: string[];
  accountType?: 'Free' | 'Paid' | 'Scholarship' | 'Staff';
  packageName?: string;
  paymentStatus?: string;
  // New informational fields
  address?: string;
  targetPTN?: string;
  joinReason?: string;
  phone?: string;
  school?: string;
  program?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  programOfInterest: string;
  source: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
  createdAt: string;
  lastContactedAt?: string;
  note?: string;
}

export interface Question {
  id: string;
  subject: 'Penalaran Umum' | 'Literasi Bahasa' | 'Penalaran Matematika' | 'Pengetahuan Umum';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  program: string;
  tags?: string[];
}

export interface Testimonial {
  id: string;
  studentName: string;
  studentRole: string;
  content: string;
  rating: number;
  image: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  programId?: string;
  createdAt: string;
}

export interface CurriculumItem {
  week: number;
  topic: string;
  description: string;
}

export interface ProgramPackage {
  id: string;
  name: string;
  price: string;
  duration: string;
  features: string[];
  isPopular?: boolean;
}

export interface Program {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription?: string;
  target: string;
  price: string;
  facilities: string[];
  image: string;
  color: string;
  curriculum?: CurriculumItem[];
  schedule?: string;
  tutors?: string[]; // Array of Tutor IDs
  packages?: ProgramPackage[];
}

export interface Tryout {
  id: string;
  title: string;
  category: string;
  duration: number; // minutes
  questions: number;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  isPremium: boolean;
  status: 'available' | 'completed' | 'in_progress';
}

export interface TryoutSubtestResult {
  name: string;
  score: number;
  total: number;
  correct: number;
  wrong: number;
  skip: number;
  recommendedLessonIds: string[];
}

export interface VideoLesson {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: VideoLesson[];
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Tutor' | 'Admin' | 'Support' | 'Content Manager';
  program?: string;
  status: 'Active' | 'Pending' | 'Inactive';
  avatar: string;
  joinedAt: string;
  accountType?: 'Free' | 'Paid' | 'Scholarship' | 'Staff';
  packageName?: string;
  paymentStatus?: string;
  source?: string;
}

export interface Feedback {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  type: 'Lesson' | 'Tryout' | 'Video';
  targetName: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  category: 'Tips & Trik' | 'Info PTN' | 'Materi' | 'Inspirasi' | 'Literasi';
  image: string;
  date: string;
  readTime: string;
  tags: string[];
}

export interface WebsiteQuestion {
  id: string;
  name: string;
  email: string;
  phone: string;
  question: string;
  programOfInterest: string;
  source: string;
  status: 'Baru' | 'Dibalas' | 'Follow Up';
  adminAnswer?: string;
  createdAt: string;
  answeredAt?: string;
}
