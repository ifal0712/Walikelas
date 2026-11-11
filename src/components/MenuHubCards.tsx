import React from 'react';
import {
  Users,
  CalendarCheck,
  GraduationCap,
  Sparkles,
  Scale,
  Award,
  MessageSquare,
  HeartHandshake,
  FileText,
  ChevronRight,
  School,
  TrendingUp,
  Bot
} from 'lucide-react';
import {
  Classroom,
  Student,
  AttendanceRecord,
  GradeRecord,
  CharacterLog,
  DisciplineLog,
  AchievementRecord,
  WelfareCase
} from '../types';

interface MenuHubCardsProps {
  classroom: Classroom | null;
  students: Student[];
  attendance: AttendanceRecord[];
  grades: GradeRecord[];
  characterLogs: CharacterLog[];
  disciplineLogs: DisciplineLog[];
  achievements: AchievementRecord[];
  welfareCases: WelfareCase[];
  onNavigateTab: (tab: string) => void;
  onOpenAIWithPrompt: (prompt: string) => void;
}

export const MenuHubCards: React.FC<MenuHubCardsProps> = ({
  classroom,
  students,
  attendance,
  grades,
  characterLogs,
  disciplineLogs,
  achievements,
  welfareCases,
  onNavigateTab,
  onOpenAIWithPrompt
}) => {
  // Calculated stats
  const totalStudents = students.length;
  const hadirCount = attendance.filter(a => a.status === 'Hadir' || a.status === 'Terlambat').length;
  const attRate = attendance.length > 0 ? (hadirCount / attendance.length) * 100 : 95.0;
  const gradeAvg = grades.length > 0 ? grades.reduce((a, b) => a + b.score, 0) / grades.length : 82.5;
  const activeWelfare = welfareCases.filter(w => w.status !== 'Selesai').length;
  const violationsCount = disciplineLogs.filter(d => d.category === 'Pelanggaran' || d.category === 'Teguran').length;

  // 4 Kelompok Menu Kerja dengan 3 Kata Keterangan Muncul saat Cursor Menyorot (Hover)
  const menuGroups = [
    {
      groupTitle: 'Administrasi & Presensi Siswa',
      groupColor: 'bg-emerald-500',
      items: [
        {
          id: 'students',
          title: 'Data Siswa',
          hoverText: 'Kelola data siswa', // Tepat 3 kata
          icon: Users,
          color: 'from-emerald-500 to-teal-600',
          badgeText: `${totalStudents} Siswa`,
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        },
        {
          id: 'attendance',
          title: 'Presensi Harian',
          hoverText: 'Rekap presensi harian', // Tepat 3 kata
          icon: CalendarCheck,
          color: 'from-indigo-500 to-blue-600',
          badgeText: `${attRate.toFixed(1)}% Hadir`,
          badgeColor: attRate < 90 ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
        },
        {
          id: 'dashboard',
          title: 'Dashboard Kelas',
          hoverText: 'Ringkasan analitik kelas', // Tepat 3 kata
          icon: TrendingUp,
          color: 'from-teal-600 to-cyan-700',
          badgeText: 'Statistik Kelas',
          badgeColor: 'bg-teal-50 text-teal-700 border-teal-200'
        }
      ]
    },
    {
      groupTitle: 'Akademik & Karakter Siswa',
      groupColor: 'bg-blue-500',
      items: [
        {
          id: 'grades',
          title: 'Hasil Belajar',
          hoverText: 'Pantau nilai akademik', // Tepat 3 kata
          icon: GraduationCap,
          color: 'from-blue-600 to-cyan-600',
          badgeText: `Rata-rata: ${gradeAvg.toFixed(1)}`,
          badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
        },
        {
          id: 'character',
          title: '10 Karakter',
          hoverText: 'Catat karakter Pancasila', // Tepat 3 kata
          icon: Sparkles,
          color: 'from-purple-600 to-violet-600',
          badgeText: '10 Nilai Profil',
          badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
        },
        {
          id: 'achievements',
          title: 'Prestasi Siswa',
          hoverText: 'Dokumentasi prestasi juara', // Tepat 3 kata
          icon: Award,
          color: 'from-amber-500 to-orange-500',
          badgeText: `${achievements.length} Prestasi`,
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
        }
      ]
    },
    {
      groupTitle: 'Disiplin & Bimbingan Konseling',
      groupColor: 'bg-teal-500',
      items: [
        {
          id: 'discipline',
          title: 'Tata Tertib',
          hoverText: 'Pembinaan disiplin positif', // Tepat 3 kata
          icon: Scale,
          color: 'from-rose-500 to-amber-600',
          badgeText: `${violationsCount} Catatan`,
          badgeColor: violationsCount > 0 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        },
        {
          id: 'welfare',
          title: 'Kesejahteraan (BK)',
          hoverText: 'Deteksi dini konseling', // Tepat 3 kata
          icon: HeartHandshake,
          color: 'from-teal-600 to-emerald-700',
          badgeText: `${activeWelfare} Kasus Aktif`,
          badgeColor: activeWelfare > 0 ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-teal-50 text-teal-700 border-teal-200'
        }
      ]
    },
    {
      groupTitle: 'Komunikasi & Laporan Resmi',
      groupColor: 'bg-purple-500',
      items: [
        {
          id: 'communication',
          title: 'Komunikasi Ortu',
          hoverText: 'Kirim pesan WhatsApp', // Tepat 3 kata
          icon: MessageSquare,
          color: 'from-teal-600 to-cyan-600',
          badgeText: 'Direct WhatsApp',
          badgeColor: 'bg-teal-50 text-teal-700 border-teal-200'
        },
        {
          id: 'reports',
          title: 'Laporan Resmi',
          hoverText: 'Cetak laporan resmi', // Tepat 3 kata
          icon: FileText,
          color: 'from-slate-700 to-slate-900',
          badgeText: 'Format Kemendikbud',
          badgeColor: 'bg-slate-100 text-slate-800 border-slate-200'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 md:pb-6">
      
      {/* Header Banner Ringkas & Simpel */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-950 text-white p-5 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-emerald-200 border border-white/15">
              <School className="w-3.5 h-3.5 text-amber-300" />
              <span>{classroom?.schoolName || 'SMKN 1 Sidayu'} • {classroom?.name || 'Kelas XI RPL 1'}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
              Menu Utama Wali Kelas
            </h1>
            <p className="text-xs text-emerald-100/90 max-w-lg">
              Sorot kursor pada kartu menu untuk melihat keterangan fungsi dan klik untuk membuka modul.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1 sm:pt-0">
            <button
              onClick={() => onOpenAIWithPrompt('Tolong susun analisis komprehensif kondisi kelas bulan ini dan ringkasan siswa yang memerlukan perhatian segera.')}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-extrabold text-xs shadow-md transition-all shrink-0"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Konsultasi AI</span>
            </button>
          </div>
        </div>

        {/* Ringkasan Indikator Singkat */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/15 text-center">
          <div className="p-1.5 rounded-lg bg-white/10">
            <span className="text-[10px] text-emerald-200 block">Total Siswa</span>
            <span className="text-sm sm:text-base font-black">{totalStudents}</span>
          </div>
          <div className="p-1.5 rounded-lg bg-white/10">
            <span className="text-[10px] text-emerald-200 block">Kehadiran</span>
            <span className={`text-sm sm:text-base font-black ${attRate < 90 ? 'text-amber-300' : 'text-white'}`}>
              {attRate.toFixed(1)}%
            </span>
          </div>
          <div className="p-1.5 rounded-lg bg-white/10">
            <span className="text-[10px] text-emerald-200 block">Rata-rata Nilai</span>
            <span className="text-sm sm:text-base font-black">{gradeAvg.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Grid Kelompok Kartu Sederhana dengan Hover 3 Kata Keterangan */}
      <div className="space-y-6">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-3">
            
            {/* Header Kelompok */}
            <div className="flex items-center gap-2 px-1">
              <div className={`w-2 h-4 rounded-full ${group.groupColor}`} />
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-tight uppercase">
                {group.groupTitle}
              </h2>
            </div>

            {/* Grid Kartu Simpel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.items.map(item => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => onNavigateTab(item.id)}
                    className="group relative cursor-pointer bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 p-4 flex flex-col justify-between space-y-3"
                    title={item.hoverText}
                  >
                    {/* Baris Atas: Ikon Utama & Status Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeColor}`}>
                        {item.badgeText}
                      </span>
                    </div>

                    {/* Judul Menu */}
                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-800 group-hover:text-emerald-700 transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    {/* Baris Keterangan 3 Kata: Muncul saat Kursor Menyorot (Hover) */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between min-h-[28px]">
                      {/* 3 Kata Keterangan dengan animasi muncul saat hover */}
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/70 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1 transition-all duration-200 ease-out max-sm:opacity-100">
                        {item.hoverText}
                      </span>
                      
                      {/* Ikon Aksi Panah */}
                      <div className="w-6 h-6 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-700 flex items-center justify-center transition-colors shrink-0">
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Kartu Khusus Asisten AI: Simpel dengan 3 Kata Keterangan saat Menyorot */}
      <div
        onClick={() => onOpenAIWithPrompt('Tolong bantu saya merangkum data dan menyusun draf komunikasi wali kelas.')}
        className="group relative cursor-pointer bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-md hover:shadow-lg hover:border-emerald-400 border border-transparent transition-all duration-200"
        title="Solusi cerdas kelas"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                Asisten AI Gemini
                <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-amber-400 text-slate-950">
                  AI Aktif
                </span>
              </h3>
              {/* 3 Kata Keterangan Asisten AI saat cursor menyorot */}
              <p className="text-xs font-bold text-amber-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1 transition-all duration-200 max-sm:opacity-100">
                Solusi cerdas kelas
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 text-white font-bold text-xs shrink-0 group-hover:bg-white/25 transition-colors">
            <span>Buka AI</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

    </div>
  );
};
