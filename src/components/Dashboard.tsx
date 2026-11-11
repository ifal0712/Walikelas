import React, { useState } from 'react';
import {
  Users,
  CalendarCheck,
  Award,
  AlertTriangle,
  GraduationCap,
  HeartHandshake,
  TrendingUp,
  ArrowRight,
  Sparkles,
  PhoneCall,
  UserCheck,
  ShieldAlert,
  ChevronRight,
  Filter
} from 'lucide-react';
import {
  Student,
  AttendanceRecord,
  GradeRecord,
  CharacterLog,
  DisciplineLog,
  AchievementRecord,
  WelfareCase,
  Classroom,
  PriorityStudent
} from '../types';

interface DashboardProps {
  classroom: Classroom | null;
  students: Student[];
  attendance: AttendanceRecord[];
  grades: GradeRecord[];
  characterLogs: CharacterLog[];
  disciplineLogs: DisciplineLog[];
  achievements: AchievementRecord[];
  welfareCases: WelfareCase[];
  onNavigateTab: (tab: string) => void;
  onSelectStudent: (student: Student) => void;
  onOpenAIWithPrompt: (prompt: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  classroom,
  students,
  attendance,
  grades,
  characterLogs,
  disciplineLogs,
  achievements,
  welfareCases,
  onNavigateTab,
  onSelectStudent,
  onOpenAIWithPrompt
}) => {
  const [priorityFilter, setPriorityFilter] = useState<'Semua' | 'Akademik' | 'Karakter' | 'Kehadiran' | 'Kedisiplinan'>('Semua');

  // Compute Overall Stats
  const studentCount = students.length;

  // Attendance stats
  const totalAtt = attendance.length;
  const hadirCount = attendance.filter(a => a.status === 'Hadir' || a.status === 'Terlambat').length;
  const attendanceRate = totalAtt > 0 ? (hadirCount / totalAtt) * 100 : 95.0;

  // Grade stats
  const averageGrade =
    grades.length > 0
      ? grades.reduce((acc, curr) => acc + curr.score, 0) / grades.length
      : 82.5;

  // Discipline & Awards
  const violationCount = disciplineLogs.filter(d => d.category === 'Pelanggaran' || d.category === 'Teguran').length;
  const activeWelfareCount = welfareCases.filter(w => w.status !== 'Selesai').length;

  // Compute "Daftar Siswa Prioritas" dynamically based on criteria
  const priorityList: PriorityStudent[] = [];

  students.forEach(student => {
    // 1. Kehadiran check (< 90%)
    const sAtt = attendance.filter(a => a.studentId === student.id);
    const sHadir = sAtt.filter(a => a.status === 'Hadir' || a.status === 'Terlambat').length;
    const sAttRate = sAtt.length > 0 ? (sHadir / sAtt.length) * 100 : 100;
    const alfaCount = sAtt.filter(a => a.status === 'Alfa').length;

    if (sAtt.length > 0 && (sAttRate < 90 || alfaCount >= 2)) {
      priorityList.push({
        student,
        category: 'Kehadiran',
        urgency: sAttRate < 80 || alfaCount >= 3 ? 'Tinggi' : 'Sedang',
        reason: `Tingkat kehadiran ${sAttRate.toFixed(1)}% dengan ${alfaCount} kali Alfa tanpa keterangan.`,
        recommendation: 'Lakukan pemanggilan orang tua secara santun dan susun komitmen jam istirahat malam teratur.',
        metrics: { attendanceRate: sAttRate }
      });
    }

    // 2. Akademik check (Avg < 75 or drop)
    const sGrades = grades.filter(g => g.studentId === student.id);
    if (sGrades.length > 0) {
      const sAvg = sGrades.reduce((acc, curr) => acc + curr.score, 0) / sGrades.length;
      if (sAvg < 75) {
        priorityList.push({
          student,
          category: 'Akademik',
          urgency: sAvg < 70 ? 'Tinggi' : 'Sedang',
          reason: `Rata-rata capaian akademik ${sAvg.toFixed(1)} berada di bawah standar ketuntasan minimal (75).`,
          recommendation: 'Jadwalkan pendampingan teman sebaya dan koordinasi dengan guru mapel untuk modul remedial.',
          metrics: { averageGrade: sAvg }
        });
      }
    }

    // 3. Kedisiplinan check
    const sDisc = disciplineLogs.filter(d => d.studentId === student.id && (d.category === 'Pelanggaran' || d.category === 'Teguran'));
    if (sDisc.length >= 1) {
      priorityList.push({
        student,
        category: 'Kedisiplinan',
        urgency: sDisc.some(d => d.level === 'Berat') ? 'Tinggi' : 'Sedang',
        reason: `Terdapat ${sDisc.length} catatan kedisiplinan aktif: "${sDisc[0].description.substring(0, 70)}..."`,
        recommendation: sDisc[0].followUpAction || 'Lakukan pembinaan reflektif edukatif yang berfokus pada restorative justice.',
        metrics: { violationCount: sDisc.length }
      });
    }

    // 4. Karakter & Welfare check
    const sWelfare = welfareCases.filter(w => w.studentId === student.id && w.status !== 'Selesai');
    const sChar = characterLogs.filter(c => c.studentId === student.id);
    const lowChar = sChar.filter(c => c.rating <= 2);

    if (sWelfare.length > 0 || lowChar.length >= 1) {
      const reasonText = sWelfare.length > 0
        ? `Indikasi ${sWelfare[0].triggerCategory} (${sWelfare[0].severity}): ${sWelfare[0].indications.substring(0, 70)}...`
        : `Evaluasi karakter ${lowChar[0].valueType} perlu pendampingan motivasi.`;
      
      priorityList.push({
        student,
        category: 'Karakter',
        urgency: sWelfare.some(w => w.severity === 'Kritis') ? 'Tinggi' : 'Sedang',
        reason: reasonText,
        recommendation: sWelfare.length > 0 ? `Tindak lanjut: ${sWelfare[0].actionRecommendation}` : 'Konsultasi personal santai dengan wali kelas.',
        metrics: { characterRating: lowChar.length > 0 ? lowChar[0].rating : 3 }
      });
    }
  });

  const filteredPriority = priorityFilter === 'Semua'
    ? priorityList
    : priorityList.filter(p => p.category === priorityFilter);

  return (
    <div className="space-y-6">
      
      {/* Welcome & Classroom Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 text-white p-6 sm:p-8 shadow-lg">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Pusat Koordinasi Wali Kelas Profesional
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang di {classroom?.name || 'Kelas Binaan'}
            </h1>
            <p className="text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              Memadukan koordinasi terpadu antara wali kelas, guru mata pelajaran, konseling BK, kesiswaan, dan orang tua murid demi kemajuan holistik anak didik.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenAIWithPrompt('Buatkan analisis komprehensif kondisi kelas bulan ini beserta ringkasan siswa prioritas yang butuh perhatian')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>Analisis Cerdas Kelas</span>
            </button>
            <button
              onClick={() => onNavigateTab('reports')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium border border-white/20 backdrop-blur-sm transition-all"
            >
              <span>Susun Laporan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Performance Indicators (Ringkasan Kelas) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total Siswa */}
        <div
          onClick={() => onNavigateTab('students')}
          className="cursor-pointer group bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Total Siswa</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{studentCount}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">100%</span> Aktif terdaftar
          </div>
        </div>

        {/* Kehadiran Rata-rata */}
        <div
          onClick={() => onNavigateTab('attendance')}
          className="cursor-pointer group bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Rata-rata Presensi</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-bold ${attendanceRate < 90 ? 'text-rose-600' : 'text-slate-900'}`}>
            {attendanceRate.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {attendanceRate < 90 ? (
              <span className="text-rose-600 font-bold inline-flex items-center gap-0.5">
                <AlertTriangle className="w-3 h-3" /> Waspada &lt;90%
              </span>
            ) : (
              <span className="text-emerald-600 font-semibold">Di atas target (90%)</span>
            )}
          </div>
        </div>

        {/* Rata-rata Nilai */}
        <div
          onClick={() => onNavigateTab('grades')}
          className="cursor-pointer group bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Rata-rata Nilai</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{averageGrade.toFixed(1)}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span>Kategori Baik</span>
          </div>
        </div>

        {/* Prestasi Siswa */}
        <div
          onClick={() => onNavigateTab('achievements')}
          className="cursor-pointer group bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Prestasi</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{achievements.length}</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">
            Portfolio Tersimpan
          </div>
        </div>

        {/* Pelanggaran / Disiplin */}
        <div
          onClick={() => onNavigateTab('discipline')}
          className="cursor-pointer group bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:shadow-md hover:border-rose-300 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Catatan Disiplin</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-bold ${violationCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {violationCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {violationCount > 0 ? 'Perlu pembinaan' : 'Nihil pelanggaran'}
          </div>
        </div>

        {/* Kesejahteraan / Early Warning */}
        <div
          onClick={() => onNavigateTab('welfare')}
          className="cursor-pointer group bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:shadow-md hover:border-teal-300 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Pantauan Khusus</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-bold ${activeWelfareCount > 0 ? 'text-teal-700' : 'text-slate-900'}`}>
            {activeWelfareCount}
          </div>
          <div className="text-[11px] text-teal-600 font-semibold mt-1">
            Early Warning Siswa
          </div>
        </div>
      </div>

      {/* Main Grid: Priority Students + Fast Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Daftar Siswa Prioritas */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Daftar Siswa Prioritas
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  {filteredPriority.length} Perhatian
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Identifikasi dini siswa yang membutuhkan intervensi akademik, karakter, kehadiran, atau kedisiplinan.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
              {(['Semua', 'Kehadiran', 'Akademik', 'Karakter', 'Kedisiplinan'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setPriorityFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                    priorityFilter === cat
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Cards */}
          {filteredPriority.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl bg-slate-50 border border-dashed border-slate-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Kondisi Siswa Stabil</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Tidak ada siswa dalam kategori prioritas ini yang memerlukan intervensi mendesak.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPriority.map((item, idx) => {
                const badgeColor =
                  item.category === 'Kehadiran'
                    ? 'bg-rose-100 text-rose-800 border-rose-200'
                    : item.category === 'Akademik'
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : item.category === 'Kedisiplinan'
                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                    : 'bg-purple-100 text-purple-800 border-purple-200';

                return (
                  <div
                    key={`${item.student.id}-${item.category}-${idx}`}
                    className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center shrink-0">
                          {item.student.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900 hover:text-emerald-600 cursor-pointer"
                              onClick={() => onSelectStudent(item.student)}
                            >
                              {item.student.name}
                            </h4>
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${badgeColor}`}>
                              {item.category}
                            </span>
                            {item.urgency === 'Tinggi' && (
                              <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-rose-600 text-white">
                                Urgensi Tinggi
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            NIS: {item.student.nis} • Ortu: {item.student.parentName || '-'} ({item.student.parentPhone || '-'})
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectStudent(item.student)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline shrink-0"
                      >
                        Detail <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Reason & Recommendation Box */}
                    <div className="text-xs space-y-1.5 bg-white p-3 rounded-lg border border-slate-200/80">
                      <div>
                        <span className="font-bold text-slate-700">Alasan: </span>
                        <span className="text-slate-600">{item.reason}</span>
                      </div>
                      <div>
                        <span className="font-bold text-emerald-700">Rekomendasi Tindak Lanjut: </span>
                        <span className="text-slate-600">{item.recommendation}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <div className="text-slate-400">
                        {item.student.address ? `Domisili: ${item.student.address}` : ''}
                      </div>
                      <div className="flex items-center gap-2">
                        {item.student.parentPhone && (
                          <a
                            href={`https://wa.me/${item.student.parentPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Assalamu'alaikum Bapak/Ibu ${item.student.parentName || ''}, salam hormat dari Wali Kelas ananda ${item.student.name}...`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold"
                          >
                            <PhoneCall className="w-3 h-3" />
                            WhatsApp Ortu
                          </a>
                        )}
                        <button
                          onClick={() => onOpenAIWithPrompt(`Tolong buatkan rekomendasi tindak lanjut edukatif dan draf komunikasi santun solutif untuk siswa ${item.student.name} terkait masalah ${item.category}: ${item.reason}`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold"
                        >
                          <Sparkles className="w-3 h-3 text-indigo-600" />
                          Solusi AI
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Actions & Coordination Hub */}
        <div className="space-y-6">
          
          {/* Quick Actions Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Aksi Cepat Wali Kelas
            </h3>
            
            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={() => onNavigateTab('attendance')}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                      Input Presensi Hari Ini
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Catat kehadiran, sakit, izin, atau alfa
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateTab('grades')}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                      Entri Nilai Akademik
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Tugas, ulangan harian, PTS, dan projek
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateTab('character')}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                      Observasi 10 Nilai Karakter
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Religius, jujur, disiplin, tanggung jawab, dll.
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateTab('communication')}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-teal-700">
                      Kirim Pesan WhatsApp Ortu
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Generator pesan apresiasi atau peringatan
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Coordination Hub (Guru Mapel, BK, Kesiswaan, Kepsek) */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3.5 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Pusat Koordinasi Sekolah
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h4 className="text-sm font-bold text-white">
              Sinergi Multi-Pihak Terpadu
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Wali kelas berperan sebagai simpul komunikasi sentral yang menghubungkan catatan guru mata pelajaran, rekomendasi konseling BK, pengawasan kesiswaan, dan pelaporan Kepala Sekolah.
            </p>
            
            <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Rujukan Guru BK</span>
                <span className="font-bold text-emerald-400">{activeWelfareCount} Siswa</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Laporan Berkala Kepsek</span>
                <span className="font-bold text-indigo-300">Siap Cetak / Unduh</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('reports')}
              className="w-full mt-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors text-center"
            >
              Buka Manajemen Laporan Kelas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
