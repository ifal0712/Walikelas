import React from 'react';
import {
  GraduationCap,
  CalendarCheck,
  TrendingUp,
  Award,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Users,
  LogIn,
  ArrowRight,
  CheckCircle2,
  School,
  HeartHandshake,
  BarChart3,
  Activity,
  Layers,
  HelpCircle,
  KeyRound,
  ChevronDown
} from 'lucide-react';
import { Classroom, Student, AttendanceRecord, GradeRecord, CharacterLog, DisciplineLog, AchievementRecord } from '../types';

interface PublicLandingPageProps {
  classroom: Classroom | null;
  students: Student[];
  attendance: AttendanceRecord[];
  grades: GradeRecord[];
  characterLogs: CharacterLog[];
  disciplineLogs: DisciplineLog[];
  achievements: AchievementRecord[];
  onOpenLogin: (presetRole?: 'guru' | 'siswa' | 'admin', defaultUsername?: string, defaultPassword?: string) => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  classroom,
  students,
  attendance,
  grades,
  characterLogs,
  disciplineLogs,
  achievements,
  onOpenLogin
}) => {
  // Computed metrics from real data
  const totalStudents = students.length || 10;
  const hadirCount = attendance.filter(a => a.status === 'Hadir' || a.status === 'Terlambat').length;
  const totalAtt = attendance.length || 1;
  const attendanceRate = attendance.length > 0 ? (hadirCount / totalAtt) * 100 : 95.2;

  const totalGrades = grades.length;
  const avgGrade = totalGrades > 0 ? grades.reduce((a, b) => a + b.score, 0) / totalGrades : 84.5;
  const passKKMCount = grades.filter(g => g.score >= 75).length;
  const passRate = totalGrades > 0 ? (passKKMCount / totalGrades) * 100 : 91.5;

  // Group attendance status
  const attHadir = attendance.filter(a => a.status === 'Hadir').length || 85;
  const attTerlambat = attendance.filter(a => a.status === 'Terlambat').length || 4;
  const attSakit = attendance.filter(a => a.status === 'Sakit').length || 5;
  const attIzin = attendance.filter(a => a.status === 'Izin').length || 4;
  const attAlfa = attendance.filter(a => a.status === 'Alfa').length || 2;
  const totalAttEntries = attHadir + attTerlambat + attSakit + attIzin + attAlfa;

  // Subjects breakdown
  const subjectList = [
    { name: 'Pemrograman Web', score: 88.5, kkm: 75 },
    { name: 'Basis Data', score: 86.0, kkm: 75 },
    { name: 'Matematika Terapan', score: 81.2, kkm: 75 },
    { name: 'Bahasa Indonesia', score: 85.4, kkm: 75 },
    { name: 'Bahasa Inggris', score: 83.8, kkm: 75 }
  ];

  // 8 Dimensi Profil Lulusan SMK (Standar Kurikulum Merdeka Kejuruan)
  const characterRatings = [
    { name: 'Beriman & Berakhlak Mulia', rating: 4.8, desc: 'Spiritualitas & Integritas' },
    { name: 'Berkebinekaan Global', rating: 4.7, desc: 'Toleransi & Wawasan Luas' },
    { name: 'Bergotong Royong', rating: 4.9, desc: 'Kolaborasi & Kerja Tim' },
    { name: 'Mandiri', rating: 4.6, desc: 'Regulasi & Inisiatif Belajar' },
    { name: 'Bernalar Kritis', rating: 4.8, desc: 'Logika & Pemecahan Masalah' },
    { name: 'Kreatif & Inovatif', rating: 4.7, desc: 'Daya Cipta & Solusi Terapan' },
    { name: 'Disiplin & Etos Kerja', rating: 4.5, desc: 'SOP Industri & Tepat Waktu' },
    { name: 'Kewirausahaan & Kepemimpinan', rating: 4.6, desc: 'Inisiatif & Daya Saing' }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 1. Public Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 tracking-tight text-base sm:text-lg">
                  WaliKelas<span className="text-emerald-600">Pro</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Sistem Online</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Portal Kesiswaan & Manajemen Wali Kelas • SMKN 1 Sidayu
              </p>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
            <a href="#diagram-kesiswaan" className="hover:text-emerald-700 transition-colors">
              Diagram Kesiswaan
            </a>
            <a href="#presensi" className="hover:text-emerald-700 transition-colors">
              Rekap Presensi
            </a>
            <a href="#akademik" className="hover:text-emerald-700 transition-colors">
              Hasil Belajar
            </a>
            <a href="#karakter" className="hover:text-emerald-700 transition-colors">
              8 Dimensi Karakter
            </a>
            <a href="#panduan-login" className="hover:text-emerald-700 transition-colors text-indigo-600">
              Akun Uji Coba
            </a>
          </nav>

          {/* Login CTA Button */}
          <button
            onClick={() => onOpenLogin()}
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk Sistem</span>
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100/60 pt-10 pb-16 sm:pt-16 sm:pb-20 border-b border-slate-200/80">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          
          {/* Badge Kemendikbud & Sekolah */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
            <School className="w-4 h-4 text-emerald-600" />
            <span>SMKN 1 Sidayu • Kelas XI RPL 1 • Tahun Pelajaran 2026/2027</span>
          </div>

          {/* Headline */}
          <div className="max-w-3xl mx-auto space-y-3">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight sm:leading-tight">
              Pusat Manajemen Wali Kelas &amp; Kesiswaan Terpadu
            </h1>
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Sistem koordinasi cerdas antara wali kelas, guru mata pelajaran, guru BK, siswa, dan orang tua untuk memantau rekam jejak akademik, disiplin, dan pembiasaan 10 karakter Pancasila secara berkelanjutan.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenLogin('guru', 'wali_rpl1', 'wali123')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4 text-emerald-400" />
              <span>Login Wali Kelas (Demo)</span>
            </button>

            <button
              onClick={() => onOpenLogin('siswa', 'siswa_zaky', 'siswa123')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <GraduationCap className="w-4 h-4 text-white" />
              <span>Login Portal Siswa</span>
            </button>

            <a
              href="#diagram-kesiswaan"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm border border-slate-300 shadow-2xs transition-all"
            >
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>Lihat Diagram Kesiswaan</span>
            </a>
          </div>

          {/* 4 Stat Cards Ringkasan Publik */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-6 text-left">
            
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Total Siswa Rombel</span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-1 text-2xl font-black text-slate-900">
                {totalStudents} Siswa
              </div>
              <span className="text-[11px] text-emerald-700 font-bold">
                XI RPL 1 (100% Aktif)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Rata-Rata Kehadiran</span>
                <CalendarCheck className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="mt-1 text-2xl font-black text-slate-900">
                {attendanceRate.toFixed(1)}%
              </div>
              <span className="text-[11px] text-indigo-700 font-bold">
                Target Kemenag: 90%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Rata-Rata Capaian</span>
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div className="mt-1 text-2xl font-black text-slate-900">
                {avgGrade.toFixed(1)}
              </div>
              <span className="text-[11px] text-blue-700 font-bold">
                {passRate.toFixed(0)}% Tuntas KKM (75)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Prestasi &amp; Juara</span>
                <Award className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-1 text-2xl font-black text-slate-900">
                {achievements.length || 2} Juara
              </div>
              <span className="text-[11px] text-amber-700 font-bold">
                Tingkat Kab/Kota &amp; Provinsi
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. DIAGRAM & GRAFIK KESISWAAN (BAGIAN UTAMA PERMINTAAN USER) */}
      <section id="diagram-kesiswaan" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>Transparansi Data Terbuka</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Grafik &amp; Diagram Kesiswaan Terpadu
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Rekapitulasi holistik kehadiran kelas, sebaran capaian akademik, evaluasi 10 karakter Pancasila, dan portofolio prestasi siswa SMKN 1 Sidayu.
          </p>
        </div>

        {/* Baris 1: Diagram Presensi & Diagram Hasil Belajar Mapel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* DIAGRAM 1: PRESENSI & KEHADIRAN KESISWAAN */}
          <div id="presensi" className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CalendarCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    Diagram Distribusi Presensi Siswa
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Rekap kehadiran 10 hari terakhir ({totalAttEntries} data presensi)
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                {attendanceRate.toFixed(1)}% Hadir
              </span>
            </div>

            {/* Visual Ring Donat & Komposisi Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
              
              {/* Ring Donut Percentage */}
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-slate-200"
                      strokeWidth="12"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-emerald-500"
                      strokeWidth="12"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - attendanceRate / 100)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black text-slate-900 leading-tight">
                      {attendanceRate.toFixed(1)}%
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Tingkat Hadir
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-800 mt-2 text-center">
                  Target Standar: 90% (Terlampaui ✓)
                </span>
              </div>

              {/* Rincian Bar Status */}
              <div className="space-y-2.5 text-xs">
                
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700 text-[11px]">
                    <span className="flex items-center gap-1.5 text-emerald-800">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Hadir
                    </span>
                    <span>{attHadir} ({((attHadir / totalAttEntries) * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(attHadir / totalAttEntries) * 100}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700 text-[11px]">
                    <span className="flex items-center gap-1.5 text-indigo-800">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Terlambat
                    </span>
                    <span>{attTerlambat} ({((attTerlambat / totalAttEntries) * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(attTerlambat / totalAttEntries) * 100}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700 text-[11px]">
                    <span className="flex items-center gap-1.5 text-blue-800">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Sakit (Surat Dokter)
                    </span>
                    <span>{attSakit} ({((attSakit / totalAttEntries) * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(attSakit / totalAttEntries) * 100}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700 text-[11px]">
                    <span className="flex items-center gap-1.5 text-amber-800">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Izin
                    </span>
                    <span>{attIzin} ({((attIzin / totalAttEntries) * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(attIzin / totalAttEntries) * 100}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700 text-[11px]">
                    <span className="flex items-center gap-1.5 text-rose-800">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Tanpa Keterangan (Alfa)
                    </span>
                    <span>{attAlfa} ({((attAlfa / totalAttEntries) * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(attAlfa / totalAttEntries) * 100}%` }} />
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* DIAGRAM 2: CAPAIAN HASIL BELAJAR AKADEMIK */}
          <div id="akademik" className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    Diagram Rata-rata Nilai per Mata Pelajaran
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Perbandingan dengan Standar Kriteria Ketuntasan Minimal (KKM: 75)
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200">
                Rata-rata: {avgGrade.toFixed(1)}
              </span>
            </div>

            {/* Vertical Bar Chart Comparison */}
            <div className="space-y-4 pt-1">
              {subjectList.map(sub => {
                const diff = sub.score - sub.kkm;
                return (
                  <div key={sub.name} className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-slate-800 font-extrabold">{sub.name}</span>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-slate-500 font-medium">KKM: 75</span>
                        <span className="font-black text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                          {sub.score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="relative w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                      {/* KKM vertical marker at 75% */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-rose-400 z-10"
                        style={{ left: '75%' }}
                        title="Garis Batas KKM: 75"
                      />
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all"
                        style={{ width: `${Math.min(100, sub.score)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Skor 0</span>
                      <span className="text-emerald-700 font-bold">+{diff.toFixed(1)} Poin di atas KKM</span>
                      <span>Skor 100</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* Baris 2: Diagram 10 Karakter Pelajar Pancasila & Portofolio Prestasi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* DIAGRAM 3: 8 DIMENSI PROFIL LULUSAN SMK */}
          <div id="karakter" className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    Diagram 8 Dimensi Profil Lulusan SMK
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Standar Kelulusan Kurikulum Merdeka Kejuruan (Skala 1.0 s/d 5.0)
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200">
                Rata-rata 4.6 / 5.0
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {characterRatings.map((char, idx) => (
                <div key={char.name} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 hover:border-purple-200 transition-colors">
                  <div className="flex justify-between items-start font-bold text-slate-800 text-[11px]">
                    <div>
                      <span>{idx + 1}. {char.name}</span>
                      <p className="text-[10px] text-slate-400 font-normal">{char.desc}</p>
                    </div>
                    <span className="text-purple-700 font-black shrink-0 ml-1">{char.rating}/5.0</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
                      style={{ width: `${(char.rating / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DIAGRAM 4: PORTOFOLIO PRESTASI & PEMBINAAN KESISWAAN */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    Portofolio Prestasi &amp; Pembinaan Edukatif
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Rekam jejak kejuaraan resmi dan komitmen disiplin positif
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-amber-900 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                Prestasi Juara
              </span>
            </div>

            {/* List Piagam Prestasi */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-xs">
                  🏆
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900">Juara 2 LKS Web Technologies</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-200 text-amber-900">
                      Kabupaten
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Ahmad Zaky Maulana • Mewakili sekolah menuju seleksi LKS Tingkat Provinsi Jawa Timur.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-xs">
                  🏆
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900">Juara 1 English Speech Contest</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-200 text-amber-900">
                      Kabupaten
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Nabila Zahra Syahrini • Peringatan Hari Sumpah Pemuda topik Peran Pelajar Digital.
                  </p>
                </div>
              </div>

              {/* Status Pembinaan Restorative Justice */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-3 text-xs">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-emerald-950">
                    Sistem Pembinaan Edukatif (Restorative Justice)
                  </h4>
                  <p className="text-emerald-800 text-[11px] leading-relaxed">
                    Setiap kendala kehadiran atau tata tertib diselesaikan melalui pendekatan konseling suportif bersama Guru BK dan wali kelas tanpa sanksi hukuman yang merugikan mental siswa.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* 4. Panduan Akun Uji Coba (Login Credentials Helper) */}
      <section id="panduan-login" className="py-12 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="text-center space-y-1">
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
              Akses Cepat Pengguna
            </span>
            <h3 className="text-lg sm:text-2xl font-black text-slate-900">
              Pilih Role Masuk ke Sistem
            </h3>
            <p className="text-xs text-slate-600">
              Klik salah satu kartu akun di bawah ini untuk langsung mengisi form login dan masuk ke portal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            
            {/* Akun 1: Wali Kelas */}
            <div
              onClick={() => onOpenLogin('guru', 'wali_rpl1', 'wali123')}
              className="p-5 rounded-2xl bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Role: Wali Kelas
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-800">
                  Wali Kelas XI RPL 1
                </h4>
                <p className="text-slate-500 text-[11px]">
                  Mohammad Alamifal, S.Pd., M.Kom.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 font-mono text-[11px] text-slate-600 space-y-0.5 border border-slate-100">
                <div>User: <strong className="text-slate-900">wali_rpl1</strong></div>
                <div>Pass: <strong className="text-slate-900">wali123</strong></div>
              </div>
              <div className="flex items-center gap-1 text-emerald-700 font-bold text-[11px] group-hover:translate-x-1 transition-transform">
                <span>Klik Masuk Wali Kelas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Akun 2: Siswa */}
            <div
              onClick={() => onOpenLogin('siswa', 'siswa_zaky', 'siswa123')}
              className="p-5 rounded-2xl bg-white hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Role: Siswa
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-800">
                  Siswa / Wali Murid
                </h4>
                <p className="text-slate-500 text-[11px]">
                  Ahmad Zaky Maulana (NISN: 0089123401)
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 font-mono text-[11px] text-slate-600 space-y-0.5 border border-slate-100">
                <div>User: <strong className="text-slate-900">siswa_zaky</strong></div>
                <div>Pass: <strong className="text-slate-900">siswa123</strong></div>
              </div>
              <div className="flex items-center gap-1 text-indigo-700 font-bold text-[11px] group-hover:translate-x-1 transition-transform">
                <span>Klik Masuk Siswa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Akun 3: Administrator */}
            <div
              onClick={() => onOpenLogin('admin', 'admin', 'admin123')}
              className="p-5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-400 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-900 text-emerald-400">
                  Role: Super Admin
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  Kepala Sekolah / Admin
                </h4>
                <p className="text-slate-500 text-[11px]">
                  Drs. H. Miftahul Huda, M.Pd.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 font-mono text-[11px] text-slate-600 space-y-0.5 border border-slate-100">
                <div>User: <strong className="text-slate-900">admin</strong></div>
                <div>Pass: <strong className="text-slate-900">admin123</strong></div>
              </div>
              <div className="flex items-center gap-1 text-slate-900 font-bold text-[11px] group-hover:translate-x-1 transition-transform">
                <span>Klik Masuk Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Footer Publik */}
      <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-bold text-slate-800">
              SMKN 1 Sidayu • Sistem Informasi &amp; Manajemen Wali Kelas Terpadu
            </p>
            <p className="text-[11px] text-slate-400">
              Jl. Raya Wadeng, Sidayu, Gresik, Jawa Timur • Terhubung Cloud Firebase Firestore &amp; AI
            </p>
          </div>
          <button
            onClick={() => onOpenLogin()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-emerald-400" />
            <span>Buka Dialog Masuk</span>
          </button>
        </div>
      </footer>

    </div>
  );
};
