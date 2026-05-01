import { Program, Tryout, Testimonial, Module, UserAccount, Feedback, FAQ, USP, Tutor, BlogPost } from './types';

export const LIVE_SESSIONS = [
  {
    id: 'live-irt-snbt',
    date: 'Sabtu, 04 Mei 2024',
    time: '19:00 - 21:00 WIB',
    startTime: '19:00',
    title: 'Deep Dive: Strategi IRT di TPS SNBT',
    instructor: 'dr. Pramono',
    mode: 'Google Meet',
    gmailStatus: 'GMAIL NOTIFIED',
    calendarUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Deep%20Dive%3A%20Strategi%20IRT%20di%20TPS%20SNBT',
    meetUrl: 'https://meet.google.com/abc-defg-hij',
    recordingStatus: 'Rekaman otomatis tersimpan di Kelas Saya setelah sesi selesai.'
  }
];

export const TRYOUT_SUBTEST_RESULTS = [
  {
    name: 'Penalaran Umum',
    score: 85,
    total: 100,
    correct: 18,
    wrong: 2,
    skip: 0,
    recommendedLessonIds: ['l2']
  },
  {
    name: 'Pengetahuan Umum',
    score: 65,
    total: 100,
    correct: 13,
    wrong: 7,
    skip: 0,
    recommendedLessonIds: ['l6']
  },
  {
    name: 'Memahami Bacaan',
    score: 90,
    total: 100,
    correct: 18,
    wrong: 2,
    skip: 0,
    recommendedLessonIds: ['l7']
  },
  {
    name: 'Pengetahuan Kuantitatif',
    score: 42,
    total: 100,
    correct: 9,
    wrong: 11,
    skip: 0,
    recommendedLessonIds: ['l3', 'l4']
  },
  {
    name: 'Literasi Bahasa Inggris',
    score: 55,
    total: 100,
    correct: 11,
    wrong: 9,
    skip: 0,
    recommendedLessonIds: ['l5']
  },
  {
    name: 'Literasi Bahasa Indonesia',
    score: 75,
    total: 100,
    correct: 15,
    wrong: 5,
    skip: 0,
    recommendedLessonIds: ['l8']
  }
];

export const USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'u1',
    name: 'Budi Santoso',
    email: 'budi@example.com',
    role: 'Student',
    program: 'SNBT Kedokteran',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=budi',
    joinedAt: '2024-01-15'
  },
  {
    id: 'u2',
    name: 'dr. Pramono',
    email: 'pramono@theprams.id',
    role: 'Admin',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    joinedAt: '2023-01-01'
  },
  {
    id: 'u3',
    name: 'Siti Aminah',
    email: 'siti@example.com',
    role: 'Tutor',
    program: 'Biologi',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=siti',
    joinedAt: '2023-11-20'
  },
  {
    id: 'u4',
    name: 'Rahmat Hidayat',
    email: 'rahmat@example.com',
    role: 'Student',
    program: 'SKD CPNS',
    status: 'Pending',
    avatar: 'https://i.pravatar.cc/150?u=rahmat',
    joinedAt: '2024-02-01'
  }
];

export const MOCK_FEEDBACKS: Feedback[] = [
  {
    id: 'f1',
    userName: 'Budi Santoso',
    userAvatar: 'https://i.pravatar.cc/150?u=budi',
    rating: 5,
    comment: 'Materinya sangat jelas dan mudah dipahami. Terima kasih dr. Pramono!',
    type: 'Video',
    targetName: 'Logika Dasar & Penarikan Kesimpulan',
    createdAt: '2024-03-20'
  },
  {
    id: 'f2',
    userName: 'Ani Wijaya',
    userAvatar: 'https://i.pravatar.cc/150?u=ani',
    rating: 4,
    comment: 'Tryoutnya sangat menantang, mirip sekali dengan soal tahun lalu.',
    type: 'Tryout',
    targetName: 'Simulasi SNBT #1 2025',
    createdAt: '2024-03-18'
  }
];

export const US_POINTS: USP[] = [
  {
    id: 'usp-1',
    title: 'Experienced Mentors',
    description: 'Learn directly from top PTN alumni and experienced practitioners who yield high success rates.',
    icon: 'GraduationCap'
  },
  {
    id: 'usp-2',
    title: 'Structured Curriculum',
    description: 'Syllabus designed systematically to ensure deep conceptual mastery and effective learning.',
    icon: 'BookOpen'
  },
  {
    id: 'usp-3',
    title: 'Realistic Tryouts',
    description: 'Exam simulations using precise IRT scoring standards to reflect your actual standing.',
    icon: 'Target'
  },
  {
    id: 'usp-4',
    title: 'Measurable Progress',
    description: 'Track your learning journey with detailed analytical dashboards and performance insights.',
    icon: 'BarChart3'
  }
];

export const FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: 'Kapan kelas bimbingan dimulai?',
    answer: 'Kelas bimbingan dimulai setiap awal bulan. Untuk detail jadwal spesifik program, silakan cek halaman detail program masing-masing.',
    category: 'Program'
  },
  {
    id: 'faq-2',
    question: 'Apakah bisa mencicil biaya pendaftaran?',
    answer: 'Ya, kami menyediakan opsi pembayaran secara bertahap (cicilan 2-3 kali) untuk program-program premium tertentu.',
    category: 'Enrollment'
  },
  {
    id: 'faq-3',
    question: 'Bagaimana jika saya berhalangan hadir kelas live?',
    answer: 'Jangan khawatir, setiap sesi kelas live akan direkam dan dapat diakses kembali melalui dashboard akun siswa kapan saja.',
    category: 'General'
  },
  {
    id: 'faq-4',
    question: 'Apakah ada garansi uang kembali?',
    answer: 'Kami memberikan jaminan kualitas. Namun, kebijakan pengembalian dana hanya berlaku jika pembatalan dilakukan 7 hari sebelum program dimulai.',
    category: 'Enrollment'
  },
  {
    id: 'faq-5',
    question: 'Bagaimana cara mengakses modul pembelajaran?',
    answer: 'Setelah pendaftaran dikonfirmasi, Anda dapat login ke dashboard siswa. Semua modul digital akan tersedia di menu "Materi Saya".',
    category: 'General'
  },
  {
    id: 'faq-6',
    question: 'Perangkat apa saja yang didukung untuk akses platform?',
    answer: 'Platform The Prams dapat diakses melalui laptop (Windows/Mac), tablet, maupun smartphone (Android/iOS) menggunakan browser terbaru.',
    category: 'Technical'
  },
  {
    id: 'faq-7',
    question: 'Apakah ada ujian simulasi sebelum SNBT asli?',
    answer: 'Ya, kami mengadakan Tryout Nasional berkala dengan sistem penilaian IRT yang sangat mirip dengan standar Panitia SNPMB.',
    category: 'Program'
  },
  {
    id: 'faq-8',
    question: 'Lupa password, bagaimana cara resetnya?',
    answer: 'Klik tombol "Lupa Password" di halaman login, masukkan email Anda, dan kami akan mengirimkan link instruksi reset password.',
    category: 'Technical'
  },
  {
    id: 'faq-9',
    question: 'Apa itu sistem penilaian IRT yang digunakan di The Prams?',
    answer: 'Item Response Theory (IRT) adalah sistem penilaian di mana bobot nilai tiap soal berbeda tergantung tingkat kesulitan. Semakin sedikit orang yang bisa menjawab soal tersebut, semakin tinggi bobot nilainya. Kami menggunakan algoritma ini agar skor Tryout Anda seakurat mungkin dengan ujian aslinya.',
    category: 'Program'
  },
  {
    id: 'faq-10',
    question: 'Apakah ada program beasiswa bagi siswa berprestasi?',
    answer: 'Tentu! Kami memiliki program "Prams Scholar" yang memberikan potongan biaya hingga 100% bagi siswa dengan nilai Tryout tertinggi atau yang memiliki prestasi akademik tingkat nasional.',
    category: 'Enrollment'
  },
  {
    id: 'faq-11',
    question: 'Dapatkah saya mengganti program bimbingan setelah mendaftar?',
    answer: 'Perubahan program dapat dilakukan maksimal 3 hari setelah pendaftaran dengan menghubungi tim support kami, selama kuota program tujuan masih tersedia.',
    category: 'Enrollment'
  }
];

export const TUTORS: Tutor[] = [
  {
    id: 'tutor-1',
    name: 'dr. Pramono',
    role: 'Senior Medical Mentor',
    subjects: ['Biologi', 'Penalaran Umum'],
    bio: 'dr. Pramono adalah praktisi medis yang memiliki passion besar dalam dunia pendidikan. Telah membantu ribuan siswa lolos Fakultas Kedokteran melalui metode penalaran klinis.',
    experience: '8+ Tahun Pengalaman Mengajar',
    education: 'Fakultas Kedokteran Universitas Indonesia',
    image: 'https://i.pravatar.cc/300?u=pramono',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'tutor-2',
    name: 'Siti Aminah, M.Pd.',
    role: 'Expert Math Tutor',
    subjects: ['Penalaran Matematika', 'Kuantitatif'],
    bio: 'Ibu Siti adalah pakar olimpiade matematika yang berfokus pada penyederhanaan rumus-rumus rumit sehingga mudah dipahami oleh siapa saja.',
    experience: '5+ Tahun Pengalaman Mengajar',
    education: 'Magister Pendidikan Matematika ITB',
    image: 'https://i.pravatar.cc/300?u=siti'
  }
];

export const CAROUSEL_SLIDES = [
  {
    id: 1,
    title: 'Berhenti Batasi Diri.',
    subtitle: 'Kembangkan Skill dan Rintis Karir di Komunitas Upskilling Terbesar.',
    image: 'https://images.unsplash.com/photo-1523240715632-990371d236e9?auto=format&fit=crop&q=80&w=1400',
    ctaText: 'Lihat Program',
    link: 'programs',
    stats: [
      { label: 'TOP STARTUPS', value: 'LinkedIn 2023', icon: 'LinkedIn' },
      { label: 'AWS EdStart Member', value: 'AWS', icon: 'AWS' },
      { label: 'COURSE REPORT', value: '4.9/5', icon: 'Star' }
    ]
  },
  {
    id: 2,
    title: 'Persiapan SNBT 2025.',
    subtitle: 'Lolos Fakultas Kedokteran dengan Metode IRT Terakurat.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1400',
    ctaText: 'Ikut Tryout',
    link: 'tryoutListing',
    stats: [
      { label: 'SISWA LOLOS', value: '5,000+', icon: 'Users' },
      { label: 'TRYOUTS', value: '1,000+', icon: 'Rocket' },
      { label: 'USER RATING', value: '4.9', icon: 'Check' }
    ]
  },
  {
    id: 3,
    title: 'Karir Impian Menantimu.',
    subtitle: 'Bimbingan SKD CPNS & Kedinasan paling Intensif di Indonesia.',
    image: 'https://images.unsplash.com/photo-1454165833767-1316b321d021?auto=format&fit=crop&q=80&w=1400',
    ctaText: 'Cek Blog',
    link: 'blogListing',
    stats: [
      { label: 'MODUL', value: '200+', icon: 'Book' },
      { label: 'MENTOR', value: '50+', icon: 'Users' },
      { label: 'SUKSES RATE', value: '98%', icon: 'Award' }
    ]
  }
];

export const PROGRAMS: Program[] = [
  {
    id: 'snbt-kedokteran',
    title: 'SNBT Kedokteran',
    category: 'Persiapan PTN',
    description: 'Program khusus bagi pejuang kursi kedokteran dengan kurikulum fokus pada subtes pendukung.',
    longDescription: 'Program Intensif SNBT Kedokteran dirancang khusus untuk memberikan keunggulan kompetitif bagi calon mahasiswa kedokteran. Kami fokus pada penguasaan materi yang memiliki bobot tinggi dan strategi pengerjaan soal dengan sistem IRT.',
    target: 'Siswa SMA Kelas 12 & Gap Year yang ingin masuk Fakultas Kedokteran',
    price: 'Rp 2.500.000',
    facilities: ['10+ Tryout IRT', 'Modul Premium', 'Grup Eksklusif', 'Konsultasi Jurusan'],
    image: 'https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=800',
    color: 'bg-blue-600',
    curriculum: [
      { week: 1, topic: 'Foundation & Logic', description: 'Penguatan logika dasar dan penalaran umum.' },
      { week: 2, topic: 'Advanced Biology', description: 'Materi biologi fokus pada sistem tubuh manusia dan genetika.' },
      { week: 3, topic: 'Medical Mathematics', description: 'Kalkulasi dosis dan statistik kesehatan dasar.' },
      { week: 4, topic: 'Final Warp Up', description: 'Simulasi final dan strategi manajemen waktu.' }
    ],
    schedule: 'Setiap Senin, Rabu, Jumat | 19:00 - 21:00 WIB',
    tutors: ['tutor-1', 'tutor-2'],
    packages: [
      {
        id: 'snbt-free',
        name: 'Gratis',
        price: 'Rp 0',
        duration: 'Trial',
        features: ['Akses tryout gratis terbatas', 'Ringkasan hasil tryout', 'Rekomendasi belajar berbasis skor', 'Artikel dan referensi belajar dasar', 'Tidak termasuk live session, jadwal kelas, mentor, dan video premium']
      },
      {
        id: 'snbt-scholarship',
        name: 'Beasiswa Prams Scholar',
        price: 'Rp 0',
        duration: '6 Bulan',
        features: ['Seleksi berdasarkan skor tryout minimal 85 atau prestasi akademik setara', 'Wajib mengunggah rapor/sertifikat dan esai motivasi saat review admin', 'Mengikuti wawancara singkat dengan tim akademik', 'Kuota terbatas dan keputusan final maksimal 3x24 jam', 'Jika lolos, mendapat akses setara Premium tanpa biaya']
      },
      {
        id: 'snbt-starter',
        name: 'Starter',
        price: 'Rp 1.500.000',
        duration: '3 Bulan',
        features: ['5 Tryout IRT', 'E-Modul Lengkap', 'Rekaman Kelas', 'Grup Diskusi Umum']
      },
      {
        id: 'snbt-premium',
        name: 'Premium',
        price: 'Rp 2.500.000',
        duration: '6 Bulan',
        features: ['15 Tryout IRT', 'Modul Cetak & Digital', 'Akses Kelas Live Mingguan', 'Grup Eksklusif Mentor', 'Konsultasi Jurusan'],
        isPopular: true
      },
      {
        id: 'snbt-pro',
        name: 'Ultimate Pro',
        price: 'Rp 4.000.000',
        duration: '12 Bulan',
        features: ['Tryout Unlimited', 'Buku Paket Eksklusif', 'Privat 1-on-1 (2x/Bulan)', 'Garansi Lolos / Coaching Khusus', 'Simulasi Ujian Offline']
      }
    ]
  },
  {
    id: 'skd-cpns',
    title: 'SKD CPNS',
    category: 'Persiapan Karir',
    description: 'Bimbingan intensif materi TWK, TIU, dan TKP dengan sistem CAT yang realistis.',
    longDescription: 'Kuasai seleksi administrasi dan ujian SKD dengan metode "The Prams Zero to Hero". Kami membedah kisi-kisi BKN terbaru dan melatih ketenangan mental dalam menghadapi timer ujian.',
    target: 'Lulusan SMA/D3/S1 yang ingin berkarir sebagai PNS',
    price: 'Rp 1.200.000',
    facilities: ['Simulasi CAT CPNS', 'E-book Materi', 'Review Pembahasan', 'Analitik Ranking'],
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    color: 'bg-indigo-900',
    curriculum: [
      { week: 1, topic: 'TWK Deep Dive', description: 'Sejarah, Pancasila, dan Pilar Negara.' },
      { week: 2, topic: 'TIU Mastery', description: 'Logika, deret, dan matematika praktis.' },
      { week: 3, topic: 'TKP Psychology', description: 'Memahami pola pikir pelayanan publik.' },
      { week: 4, topic: 'Full Simulation', description: 'Tryout marathon 100 soal CAT.' }
    ],
    schedule: 'Setiap Selasa, Kamis | 19:30 - 21:30 WIB',
    tutors: ['tutor-2'],
    packages: [
      {
        id: 'cpns-free',
        name: 'Gratis',
        price: 'Rp 0',
        duration: 'Trial',
        features: ['Akses tryout gratis terbatas', 'Ringkasan hasil tryout', 'Rekomendasi belajar berbasis skor', 'Artikel dan referensi belajar dasar', 'Tidak termasuk live session, jadwal kelas, mentor, dan video premium']
      },
      {
        id: 'cpns-scholarship',
        name: 'Beasiswa Prams Scholar',
        price: 'Rp 0',
        duration: '3 Bulan',
        features: ['Seleksi berdasarkan skor tryout SKD minimal 85 atau bukti prestasi akademik', 'Wajib melampirkan rapor/transkrip, sertifikat, atau surat keterangan ekonomi bila ada', 'Mengikuti wawancara singkat dan komitmen belajar terjadwal', 'Kuota terbatas per batch dan keputusan final maksimal 3x24 jam', 'Jika lolos, mendapat akses setara Intensive Premium tanpa biaya']
      },
      {
        id: 'cpns-short',
        name: 'Short Course',
        price: 'Rp 800.000',
        duration: '1 Bulan',
        features: ['2 Simulasi CAT', 'E-Book Ringkas', 'Grup Belajar WA']
      },
      {
        id: 'cpns-premium',
        name: 'Intensive Premium',
        price: 'Rp 1.200.000',
        duration: '3 Bulan',
        features: ['10 Simulasi CAT', 'Modul Fisik + Digital', 'Review Pembahasan Live', 'Analitik Ranking Nasional'],
        isPopular: true
      }
    ]
  }
];

export const TRYOUTS: Tryout[] = [
  {
    id: 'to-1',
    title: 'Simulasi SNBT #1 2025',
    category: 'SNBT',
    duration: 195,
    questions: 155,
    difficulty: 'Sedang',
    isPremium: false,
    status: 'available'
  },
  {
    id: 'to-2',
    title: 'Tryout SKD CPNS Batch III',
    category: 'CPNS',
    duration: 100,
    questions: 110,
    difficulty: 'Sulit',
    isPremium: true,
    status: 'available'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    studentName: 'Andi Pratama',
    studentRole: 'Alumni Kedokteran UI 2024',
    content: 'The Prams membantu saya memahami pola soal yang sebelumnya terasa sangat sulit. Metode penalaran dr. Pramono benar-benar "game changer" buat saya yang dulu benci Biologi.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?u=andi',
    status: 'Approved',
    programId: 'snbt-kedokteran',
    createdAt: '2024-03-01'
  },
  {
    id: '2',
    studentName: 'Salsabila Putri',
    studentRole: 'Lolos SNBT Akuntansi UGM',
    content: 'Tryout IRT di sini akurat banget! Skor simulasi saya hampir sama dengan skor asli pas ujian. Fitur pembahasannya juga sangat detail dan mudah dimengerti.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?u=salsa',
    status: 'Approved',
    programId: 'snbt-kedokteran',
    createdAt: '2024-03-05'
  },
  {
    id: '3',
    studentName: 'Rizwan Hakim',
    studentRole: 'CPNS Kemenkumham 2023',
    content: 'Berkat bimbingan di program SKD, saya bisa dapet skor TIU 165! Padahal sebelumnya selalu mentok di angka 100. Terima kasih The Prams!',
    rating: 5,
    image: 'https://i.pravatar.cc/150?u=rizwan',
    status: 'Approved',
    programId: 'skd-cpns',
    createdAt: '2024-02-15'
  },
  {
    id: '4',
    studentName: 'Dewi Lestari',
    studentRole: 'Kedinasan IPDN 2024',
    content: 'Tes Karakteristik Pribadi (TKP) selalu jadi momok, tapi mentor di sini ngasih trik gimana cara ngelihat pola jawaban yang diinginkan sistem. Sangat membantu!',
    rating: 5,
    image: 'https://i.pravatar.cc/150?u=dewi',
    status: 'Approved',
    programId: 'skd-cpns',
    createdAt: '2024-03-10'
  },
  {
    id: '5',
    studentName: 'Farhan Azis',
    studentRole: 'Lolos Kedokteran Unair',
    content: 'Materi Biologinya juara! Gak cuma hafal, tapi diajarin konsep dasarnya. Bikin soal serumit apapun jadi kerasa logis pengerjaannya.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?u=farhan',
    status: 'Approved',
    programId: 'snbt-kedokteran',
    createdAt: '2024-03-12'
  },
  {
    id: '6',
    studentName: 'Linda Wahyuni',
    studentRole: 'Alumni SNBT ITB 2024',
    content: 'Adminnya fast response, mentornya friendly. Belajar jadi gak kerasa beban. Sangat recommended buat yang mau persiapan serius!',
    rating: 4,
    image: 'https://i.pravatar.cc/150?u=linda',
    status: 'Approved',
    programId: 'snbt-kedokteran',
    createdAt: '2024-03-15'
  },
  {
    id: '7',
    studentName: 'Pending Student',
    studentRole: 'Target 2025',
    content: 'This is a pending testimonial for admin testing.',
    rating: 3,
    image: 'https://i.pravatar.cc/150?u=pending',
    status: 'Pending',
    programId: 'snbt-kedokteran',
    createdAt: '2024-04-20'
  }
];

export const CURRICULUM: Module[] = [
  {
    id: 'm1',
    title: 'Pendahuluan & Strategi Belajar',
    lessons: [
      { id: 'l1', title: 'Cara Belajar Efektif di The Prams', duration: '05:20', isCompleted: true },
      { id: 'l2', title: 'Bedah Kisi-kisi SNBT Terbaru', duration: '12:45', isCompleted: false }
    ]
  },
  {
    id: 'm2',
    title: 'Penguatan Materi Lemah dari Tryout',
    lessons: [
      { id: 'l3', title: 'Pengetahuan Kuantitatif: Aljabar & Persamaan', duration: '18:30', isCompleted: false },
      { id: 'l4', title: 'Pengetahuan Kuantitatif: Peluang & Statistik Dasar', duration: '16:10', isCompleted: false },
      { id: 'l5', title: 'Literasi Bahasa Inggris: Main Idea & Inference', duration: '14:20', isCompleted: false },
      { id: 'l6', title: 'Pengetahuan Umum: Isu Aktual & Konteks Sosial', duration: '11:50', isCompleted: false },
      { id: 'l7', title: 'Memahami Bacaan: Strategi Skimming & Scanning', duration: '13:15', isCompleted: false },
      { id: 'l8', title: 'Literasi Bahasa Indonesia: Ide Pokok & Simpulan', duration: '15:05', isCompleted: false }
    ]
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: '5 Strategi Ampuh Menaklukkan Soal Penalaran Matematika SNBT 2025',
    excerpt: 'Penalaran Matematika sering menjadi momok bagi siswa. Pelajari cara membedah logika soal tanpa harus menghafal rumus rumit.',
    content: `
# 5 Strategi Ampuh Menaklukkan Soal Penalaran Matematika SNBT 2025

Penalaran Matematika bukan sekadar menghitung angka, melainkan menguji kemampuan Anda dalam menganalisis data, memecahkan masalah, dan mengambil kesimpulan logis dari konteks kehidupan sehari-hari. Berikut adalah 5 strategi yang bisa Anda terapkan:

## 1. Pahami Konteks, Bukan Hanya Rumus
Soal SNBT modern lebih menekankan pada pemahaman konteks. Sebelum mulai menghitung, baca seluruh narasi soal untuk memahami apa yang sebenarnya ditanyakan.

## 2. Identifikasi Data Penting
Seringkali soal memberikan informasi tambahan yang hanya berfungsi sebagai pengecoh. Latihlah mata Anda untuk melihat angka dan hubungan variabel yang krusial saja.

## 3. Gunakan Metode Eliminasi
Jika Anda ragu dengan jawaban akhir, cobalah memasukkan pilihan jawaban ke dalam persamaan soal. Terkadang mencari mana yang salah lebih cepat daripada mencari mana yang benar.

## 4. Manajemen Waktu
Jangan habiskan lebih dari 2 menit untuk satu soal. Jika buntu, tandai dan lanjutkan ke soal berikutnya agar Anda tidak kehilangan poin di soal yang lebih mudah.

## 5. Latihan dengan Soal Berbasis IRT
Di The Prams, kami menyediakan simulasi dengan sistem IRT agar Anda terbiasa dengan bobot nilai yang berbeda untuk setiap tingkat kesulitan soal.

Tetap semangat belajar dan jangan lupa untuk terus berlatih setiap hari!
    `,
    author: 'Siti Aminah, M.Pd.',
    authorRole: 'Expert Math Tutor',
    authorAvatar: 'https://i.pravatar.cc/150?u=siti',
    category: 'Tips & Trik',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    date: '25 April 2026',
    readTime: '5 min read',
    tags: ['SNBT', 'Matematika', 'Tips Belajar']
  },
  {
    id: 'blog-2',
    title: 'Mengapa Fakultas Kedokteran Masih Menjadi Jurusan Terfavorit?',
    excerpt: 'Simak ulasan mendalam mengenai prospek karir, tantangan masa studi, dan alasan idealis di balik tingginya peminat FK di Indonesia.',
    content: `
# Mengapa Fakultas Kedokteran Masih Menjadi Jurusan Terfavorit?

Setiap tahun, ribuan siswa berlomba-lomba memperebutkan kursi di Fakultas Kedokteran (FK). Fenomena ini bukan tanpa alasan. Berikut adalah beberapa faktor utama yang menjadikannya primadona:

## Prospek Karir yang Stabil
Sektor kesehatan adalah kebutuhan dasar manusia yang tidak akan pernah surut. Kebutuhan akan tenaga dokter di Indonesia masih sangat tinggi, terutama untuk daerah-daerah di luar pulau Jawa.

## Prestise Sosial
Secara kultural, profesi dokter masih dipandang sangat tinggi oleh masyarakat Indonesia. Hal ini memberikan motivasi tersendiri bagi orang tua maupun calon mahasiswa.

## Ladang Pengabdian
Bagi banyak orang, menjadi dokter adalah jalan untuk mengabdi kepada kemanusiaan. Kemampuan untuk menolong orang lain di saat paling kritis memberikan kepuasan batin yang tidak ternilai dengan materi.

## Tantangan yang Menantang
Siswa dengan kemampuan akademik tinggi seringkali merasa tertantang dengan kurikulum FK yang padat dan masa studi yang panjang. Ini menjadi bukti dedikasi dan kegigihan mereka.

Persaingan masuk FK memang ketat, tapi dengan persiapan yang tepat sejak sekarang, impian mengenakan jas putih bukanlah hal yang mustahil.
    `,
    author: 'dr. Pramono',
    authorRole: 'Senior Medical Mentor',
    authorAvatar: 'https://i.pravatar.cc/150?u=pramono',
    category: 'Info PTN',
    image: 'https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=800',
    date: '20 April 2026',
    readTime: '7 min read',
    tags: ['Kedokteran', 'PTN', 'Karir']
  },
  {
    id: 'blog-3',
    title: 'Update Kisi-kisi SKD CPNS 2024: Apa yang Berubah?',
    excerpt: 'BKN baru saja merilis detail mengenai ambang batas dan jenis soal baru untuk Tes Karakteristik Pribadi. Cek perbandingannya di sini.',
    content: `
# Update Kisi-kisi SKD CPNS 2024: Apa yang Berubah?

Bagi Anda pejuang NIP, sangat penting untuk tetap update dengan regulasi terbaru dari BKN. Tahun 2024 membawa beberapa penyesuaian yang perlu Anda antisipasi:

## Fokus pada Jejaring Kerja
Di subtes TKP, porsi soal mengenai jejaring kerja dan teknologi informasi komunikas ditingkatkan. Ini menunjukkan Pemerintah mencari ASN yang melek digital dan mampu berkolaborasi secara luas.

## Variasi Soal Anti-Radikalisme
TWK masih akan menguji pemahaman pilar negara, namun dengan narasi yang lebih kontemporer terkait pencegahan paham radikal dan penguatan nilai-nilai Pancasila di era global.

## TIU: Penekanan pada Deret Figur
Beberapa laporan tryout menunjukkan adanya peningkatan variasi pada soal deret gambar (figural). Pastikan Anda melatih ketajaman visual Anda.

Jangan sampai strategi belajar Anda ketinggalan zaman. Update terus pengetahuan Anda dan perbanyak latihan harian di The Prams!
    `,
    author: 'Admin The Prams',
    authorRole: 'Content Specialist',
    authorAvatar: 'https://i.pravatar.cc/150?u=admin',
    category: 'Materi',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800',
    date: '15 April 2026',
    readTime: '4 min read',
    tags: ['CPNS', 'SKD', 'ASN']
  },
  {
    id: 'blog-4',
    title: 'Literasi Bacaan: Cara Menemukan Gagasan Utama Tanpa Terjebak Distraktor',
    excerpt: 'Latihan literasi yang efektif dimulai dari membaca tujuan soal, memetakan paragraf, lalu menguji pilihan jawaban dengan bukti teks.',
    content: `
# Literasi Bacaan: Cara Menemukan Gagasan Utama Tanpa Terjebak Distraktor

Subtes literasi menilai kemampuan memahami pesan, bukan sekadar cepat membaca. Saat mengerjakan bacaan panjang, mulai dari pertanyaan agar fokus membaca lebih tajam.

## Peta Paragraf
Tandai fungsi tiap paragraf: pembuka isu, data pendukung, contoh, sanggahan, atau kesimpulan. Cara ini membantu Anda melihat struktur argumen.

## Bukti Teks
Jawaban yang benar harus punya dukungan langsung dari bacaan. Jika pilihan terdengar bagus tetapi tidak punya bukti, besar kemungkinan itu distraktor.

## Latihan Konsisten
Gunakan artikel opini, laporan sains populer, dan teks sosial budaya sebagai bahan latihan. Setelah membaca, tulis satu kalimat gagasan utama dan dua bukti pendukung.
    `,
    author: 'Admin The Prams',
    authorRole: 'Content Specialist',
    authorAvatar: 'https://i.pravatar.cc/150?u=admin',
    category: 'Literasi',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
    date: '30 April 2026',
    readTime: '5 min read',
    tags: ['Literasi', 'SNBT', 'Membaca']
  },
  {
    id: 'blog-5',
    title: 'Roadmap Belajar SNBT 90 Hari: Dari Diagnostik sampai Simulasi Final',
    excerpt: 'Panduan bertahap untuk membagi waktu belajar, membaca hasil tryout, dan menentukan prioritas materi dalam 90 hari.',
    content: `
# Roadmap Belajar SNBT 90 Hari: Dari Diagnostik sampai Simulasi Final

Belajar SNBT akan lebih efektif jika dimulai dari peta kemampuan, bukan langsung mengejar semua materi sekaligus. Dalam 90 hari, target utamanya adalah memahami kelemahan, memperbaiki pola berpikir, dan membiasakan diri dengan tekanan waktu.

## Fase 1: Diagnostik dan Pemetaan
Mulai dengan satu tryout penuh. Jangan fokus pada nilai akhir saja. Catat subtes yang paling lemah, jenis soal yang sering salah, dan alasan salahnya: tidak paham konsep, salah baca, terburu-buru, atau kehabisan waktu.

## Fase 2: Penguatan Konsep
Gunakan 30 hari pertama untuk memperbaiki dua subtes terlemah. Buat target kecil harian, misalnya 20 soal penalaran matematika atau dua bacaan literasi dengan pembahasan mendalam.

## Fase 3: Latihan Pola Soal
Setelah konsep mulai stabil, masuk ke latihan pola. Kelompokkan soal berdasarkan tipe: sebab-akibat, data tabel, gagasan utama, inferensi, kuantitatif dasar, dan logika formal.

## Fase 4: Simulasi dan Evaluasi
Di 30 hari terakhir, lakukan simulasi mingguan. Setelah simulasi, evaluasi minimal 60 menit. Kesalahan yang tidak dievaluasi biasanya akan terulang pada tryout berikutnya.

## Checklist Mingguan
- 1 tryout atau mini tryout.
- 3 sesi review kesalahan.
- 2 sesi penguatan materi lemah.
- 1 sesi membaca artikel panjang untuk melatih stamina literasi.

Roadmap ini fleksibel. Jika skor subtes tertentu belum naik, kurangi materi baru dan tambah waktu review.
    `,
    author: 'Admin The Prams',
    authorRole: 'Academic Planner',
    authorAvatar: 'https://i.pravatar.cc/150?u=admin',
    category: 'Tips & Trik',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
    date: '29 April 2026',
    readTime: '8 min read',
    tags: ['SNBT', 'Roadmap', 'Tryout']
  },
  {
    id: 'blog-6',
    title: 'Cara Membaca Hasil Tryout: Jangan Cuma Lihat Skor Akhir',
    excerpt: 'Skor tryout baru berguna jika dibaca bersama pola salah, waktu pengerjaan, dan prioritas perbaikan subtes.',
    content: `
# Cara Membaca Hasil Tryout: Jangan Cuma Lihat Skor Akhir

Tryout adalah alat diagnosis. Skor akhir memang penting, tetapi keputusan belajar yang baik biasanya muncul dari detail yang lebih kecil: soal mana yang salah, berapa lama waktu terpakai, dan konsep apa yang belum stabil.

## Bedakan Salah Konsep dan Salah Strategi
Salah konsep berarti Anda belum memahami materi. Salah strategi berarti Anda sebenarnya paham, tetapi memilih cara yang terlalu panjang, salah membaca instruksi, atau terpancing distraktor.

## Buat Tabel Kesalahan
Setelah tryout, buat empat kolom: nomor soal, subtes, alasan salah, dan rencana perbaikan. Jika alasan salah berulang, itu prioritas utama minggu berikutnya.

## Perhatikan Soal yang Ditinggalkan
Soal kosong bukan sekadar kehilangan poin. Itu sinyal bahwa manajemen waktu belum stabil atau ada tipe soal yang membuat Anda ragu sejak awal.

## Ukur Perbaikan Kecil
Target realistis bukan selalu naik 100 poin dalam satu minggu. Kadang target terbaik adalah menurunkan jumlah salah ceroboh dari 8 menjadi 4, atau menyelesaikan bacaan 2 menit lebih cepat.

Tryout yang baik bukan yang membuat panik, tetapi yang memberi arah belajar berikutnya.
    `,
    author: 'dr. Pramono',
    authorRole: 'Senior Medical Mentor',
    authorAvatar: 'https://i.pravatar.cc/150?u=pramono',
    category: 'Materi',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    date: '28 April 2026',
    readTime: '6 min read',
    tags: ['Tryout', 'Evaluasi', 'Strategi']
  },
  {
    id: 'blog-7',
    title: 'Panduan Literasi Bahasa Indonesia: Membaca Cepat tapi Tetap Akurat',
    excerpt: 'Teknik membaca aktif untuk menemukan struktur argumen, ide pokok, dan simpulan tanpa kehilangan detail penting.',
    content: `
# Panduan Literasi Bahasa Indonesia: Membaca Cepat tapi Tetap Akurat

Literasi bukan lomba membaca paling cepat. Yang diuji adalah kemampuan memahami informasi, menghubungkan gagasan, dan menilai pilihan jawaban berdasarkan bukti teks.

## Baca Pertanyaan Terlebih Dahulu
Dengan membaca pertanyaan lebih awal, Anda tahu informasi apa yang harus dicari. Ini membuat proses membaca lebih terarah.

## Tandai Fungsi Kalimat
Saat membaca, bedakan kalimat definisi, contoh, data, pendapat, dan kesimpulan. Pilihan jawaban sering menjebak dengan mengambil contoh lalu menjadikannya gagasan utama.

## Waspadai Kata Ekstrem
Kata seperti selalu, pasti, semua, tidak pernah, dan hanya perlu diperiksa ketat. Jika teks tidak mendukung secara penuh, pilihan itu biasanya salah.

## Latihan Review
Setelah mengerjakan soal literasi, jangan hanya cek kunci. Tulis alasan mengapa empat pilihan lain salah. Latihan ini membuat kemampuan eliminasi lebih tajam.
    `,
    author: 'Admin The Prams',
    authorRole: 'Literacy Coach',
    authorAvatar: 'https://i.pravatar.cc/150?u=admin',
    category: 'Literasi',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800',
    date: '27 April 2026',
    readTime: '7 min read',
    tags: ['Literasi', 'Bahasa Indonesia', 'SNBT']
  },
  {
    id: 'blog-8',
    title: 'SKD CPNS: Strategi Membagi Waktu TWK, TIU, dan TKP',
    excerpt: 'Pembagian waktu SKD perlu disesuaikan dengan karakter subtes agar tidak terlalu lama tertahan di soal yang menguras energi.',
    content: `
# SKD CPNS: Strategi Membagi Waktu TWK, TIU, dan TKP

SKD menuntut ketahanan, kecepatan, dan konsistensi. Banyak peserta bukan gagal karena tidak belajar, tetapi karena waktu habis di bagian yang salah.

## Pahami Karakter Subtes
TWK menguji pemahaman kebangsaan dan konteks. TIU menguji logika serta ketelitian. TKP menguji penilaian situasi, sehingga pilihan jawabannya sering terlihat sama-sama benar.

## Jangan Terjebak Satu Nomor
Jika soal TIU membutuhkan hitungan panjang, tandai dulu dan lanjutkan. Soal yang menghabiskan terlalu banyak waktu bisa merusak ritme seluruh ujian.

## TKP Perlu Konsistensi Nilai
Pada TKP, cari jawaban yang menunjukkan pelayanan publik, integritas, kolaborasi, dan adaptasi. Jangan menjawab berdasarkan emosi pribadi saja.

## Simulasi dengan Timer
Latihan tanpa timer membuat Anda paham konsep, tetapi belum tentu siap ujian. Minimal seminggu sekali, gunakan simulasi penuh dengan batas waktu.
    `,
    author: 'Admin The Prams',
    authorRole: 'CPNS Program Specialist',
    authorAvatar: 'https://i.pravatar.cc/150?u=admin',
    category: 'Materi',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800',
    date: '26 April 2026',
    readTime: '6 min read',
    tags: ['CPNS', 'SKD', 'Manajemen Waktu']
  },
  {
    id: 'blog-9',
    title: 'Checklist Beasiswa Bimbel: Data yang Perlu Disiapkan Sebelum Mengajukan',
    excerpt: 'Pengajuan beasiswa lebih kuat jika data akademik, motivasi, dan komitmen belajar ditulis jelas sejak awal.',
    content: `
# Checklist Beasiswa Bimbel: Data yang Perlu Disiapkan Sebelum Mengajukan

Beasiswa bukan hanya soal nilai tinggi. Admin dan tim akademik perlu melihat kesiapan belajar, konsistensi, dan alasan mengapa bantuan program akan berdampak.

## Data Akademik
Siapkan rapor, hasil tryout, sertifikat, atau bukti prestasi yang relevan. Jika belum punya prestasi formal, hasil tryout dan catatan belajar tetap bisa menjadi bahan pertimbangan.

## Esai Motivasi
Tulis alasan mengikuti program secara spesifik. Hindari jawaban terlalu umum seperti ingin sukses. Jelaskan target, kendala, dan komitmen belajar mingguan.

## Komitmen Waktu
Beasiswa lebih tepat diberikan kepada siswa yang siap mengikuti jadwal. Tuliskan kapan Anda bisa belajar dan bagaimana menjaga konsistensi.

## Kesiapan Follow-up
Admin bisa menghubungi untuk wawancara singkat. Pastikan nomor WhatsApp aktif dan data pendaftaran lengkap.
    `,
    author: 'Admin The Prams',
    authorRole: 'Scholarship Reviewer',
    authorAvatar: 'https://i.pravatar.cc/150?u=admin',
    category: 'Info PTN',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800',
    date: '24 April 2026',
    readTime: '5 min read',
    tags: ['Beasiswa', 'Pendaftaran', 'Persiapan']
  },
  {
    id: 'blog-10',
    title: 'Belajar Mandiri vs Bimbel: Kapan Harus Mulai Minta Bantuan Mentor?',
    excerpt: 'Tidak semua masalah belajar selesai dengan menambah jam. Kadang yang dibutuhkan adalah diagnosis mentor dan strategi baru.',
    content: `
# Belajar Mandiri vs Bimbel: Kapan Harus Mulai Minta Bantuan Mentor?

Belajar mandiri sangat penting. Namun, ada fase ketika siswa membutuhkan mentor agar tidak mengulang kesalahan yang sama terlalu lama.

## Saat Skor Stagnan
Jika skor tryout tidak naik setelah beberapa minggu, masalahnya mungkin bukan jumlah latihan, tetapi cara evaluasi. Mentor bisa membantu membaca pola salah.

## Saat Tidak Tahu Prioritas
Banyak siswa belajar semua materi sekaligus. Akibatnya energi habis, tetapi dampaknya kecil. Mentor membantu menentukan urutan materi yang paling penting.

## Saat Butuh Simulasi dan Akuntabilitas
Jadwal kelas, tugas, dan review rutin membantu menjaga konsistensi. Ini penting terutama saat motivasi mulai turun.

## Saat Target Sangat Kompetitif
Untuk jurusan atau seleksi dengan persaingan tinggi, strategi kecil bisa memberi perbedaan besar: pemilihan soal, manajemen waktu, dan evaluasi tryout.
    `,
    author: 'dr. Pramono',
    authorRole: 'Senior Medical Mentor',
    authorAvatar: 'https://i.pravatar.cc/150?u=pramono',
    category: 'Inspirasi',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800',
    date: '23 April 2026',
    readTime: '6 min read',
    tags: ['Mentor', 'Belajar', 'Motivasi']
  }
];
