import React, { useState } from 'react';
import {
  Student,
  AttendanceRecord,
  GradeRecord,
  CharacterLog,
  DisciplineLog,
  AchievementRecord,
  WelfareCase
} from '../types';
import { StudentAttendanceChart } from './StudentAttendanceChart';
import {
  GraduationCap,
  CalendarCheck,
  Award,
  ShieldAlert,
  Sparkles,
  Phone,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileEdit,
  TrendingUp,
  User,
  Heart,
  MessageSquare,
  ShieldCheck,
  Star,
  ExternalLink
} from 'lucide-react';

interface StudentDashboardProps {
  student: Student;
  attendance: AttendanceRecord[];
  grades: GradeRecord[];
  characterLogs: CharacterLog[];
  disciplineLogs: DisciplineLog[];
  achievements: AchievementRecord[];
  welfareCases: WelfareCase[];
  onOpenEditModal: (student: Student) => void;
  onOpenAIWithStudent: (student: Student) => void;
  onOpenAIWithPrompt: (prompt: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  attendance,
  grades,
  characterLogs,
  disciplineLogs,
  achievements,
  welfareCases,
  onOpenEditModal,
  onOpenAIWithStudent,
  onOpenAIWithPrompt
}) => {
  const [activeTab, setActiveTab] = useState<'semua' | 'nilai' | 'presensi' | 'prestasi' | 'disiplin'>('semua');

  // Filter data strictly for this student
  const studentAttendance = attendance.filter(a => a.studentId === student.id);
  const studentGrades = grades.filter(g => g.studentId === student.id);
  const studentCharacters = characterLogs.filter(c => c.studentId === student.id);
  const studentDisciplines = disciplineLogs.filter(d => d.studentId === student.id);
  const studentAchievements = achievements.filter(a => a.studentId === student.id);
  const studentWelfare = welfareCases.filter(w => w.studentId === student.id && w.status !== 'Selesai');

  // Computed metrics
  const totalAtt = studentAttendance.length;
  const hadirCount = studentAttendance.filter(a => a.status === 'Hadir' || a.status === 'Terlambat').length;
  const attRate = totalAtt > 0 ? (hadirCount / totalAtt) * 100 : 96.5;

  const totalGrades = studentGrades.length;
  const avgGrade = totalGrades > 0 ? studentGrades.reduce((a, b) => a + b.score, 0) / totalGrades : 84.5;
  const kkmStandard = 75;
  const remedialGrades = studentGrades.filter(g => g.score < kkmStandard);

  const avgCharacter =
    studentCharacters.length > 0
      ? studentCharacters.reduce((acc, c) => acc + c.rating, 0) / studentCharacters.length
      : 4.5;

  const violations = studentDisciplines.filter(d => d.category === 'Pelanggaran' || d.category === 'Teguran');

  return (
    <div className="space-y-6">
      
      {/* 1. Header Profil Siswa & Identitas Isian Mandiri */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-100/40 via-teal-50/20 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          
          {/* Avatar & Main Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl shadow-sm shrink-0 ${
              student.gender === 'L'
                ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white'
                : 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white'
            }`}>
              {student.name[0]}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                  {student.name}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  student.gender === 'L'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-pink-50 text-pink-700 border border-pink-200'
                }`}>
                  {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                </span>

                {/* Badge Status Isian Siswa */}
                {student.filledByStudent ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Diisi Mandiri oleh Siswa</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    Buku Induk Sekolah
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-600 font-medium">
                <span>NIS: <strong className="text-slate-800">{student.nis}</strong></span>
                <span>•</span>
                <span>NISN: <strong className="text-slate-800">{student.nisn || '-'}</strong></span>
                <span>•</span>
                <span>TTL: <strong className="text-slate-800">{student.birthPlace || 'Gresik'}, {student.birthDate || '-'}</strong></span>
              </div>

              {/* Alamat & Kontak Cepat */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
                {student.address && (
                  <span className="truncate max-w-xs">
                    📍 {student.address}
                  </span>
                )}
                {student.phone && (
                  <span>
                    📱 {student.phone}
                  </span>
                )}
                {student.parentPhone && (
                  <a
                    href={`https://wa.me/${student.parentPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                  >
                    <Phone className="w-3 h-3 text-emerald-600" />
                    WA Ortu: {student.parentPhone}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons: Edit Isian Siswa & AI Assistant */}
          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
            <button
              onClick={() => onOpenEditModal(student)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs shadow-2xs transition-all active:scale-95"
              title="Perbarui / Lengkapi Data Isian Siswa"
            >
              <FileEdit className="w-4 h-4 text-emerald-600" />
              <span>Isi / Ubah Data Diri Siswa</span>
            </button>

            <button
              onClick={() => onOpenAIWithStudent(student)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Analisis AI Siswa</span>
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
          
          {/* Card 1: Kehadiran */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
            <div className="flex items-center justify-between text-xs text-emerald-800 font-bold">
              <span>Kehadiran</span>
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-black text-emerald-950">
              {attRate.toFixed(1)}%
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">
              {attRate >= 90 ? 'Memenuhi Standar Kemenag' : '⚠️ Butuh Perhatian (<90%)'}
            </span>
          </div>

          {/* Card 2: Rata-Rata Nilai */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80">
            <div className="flex items-center justify-between text-xs text-blue-800 font-bold">
              <span>Rata-rata Nilai</span>
              <GraduationCap className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-black text-blue-950">
              {avgGrade.toFixed(1)}
            </div>
            <span className="text-[10px] text-blue-700 font-medium">
              KKM: {kkmStandard} • {remedialGrades.length === 0 ? 'Semua Tuntas' : `${remedialGrades.length} Perlu Remedial`}
            </span>
          </div>

          {/* Card 3: Prestasi */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <div className="flex items-center justify-between text-xs text-amber-900 font-bold">
              <span>Prestasi Juara</span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-black text-amber-950">
              {studentAchievements.length}
            </div>
            <span className="text-[10px] text-amber-800 font-medium">
              {studentAchievements.length > 0 ? 'Portofolio Terverifikasi' : 'Belum Ada Portofolio'}
            </span>
          </div>

          {/* Card 4: Disiplin & Pelanggaran */}
          <div className={`p-3.5 rounded-2xl border ${
            violations.length > 0
              ? 'bg-rose-50/80 border-rose-200/90 text-rose-950'
              : 'bg-teal-50/70 border-teal-200/80 text-teal-950'
          }`}>
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Catatan Disiplin</span>
              {violations.length > 0 ? (
                <ShieldAlert className="w-4 h-4 text-rose-600" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-teal-600" />
              )}
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-black">
              {violations.length} {violations.length > 0 ? 'Catatan' : 'Nihil'}
            </div>
            <span className="text-[10px] font-medium opacity-90">
              {violations.length > 0 ? 'Dalam Pembinaan Edukatif' : 'Keteladanan Positif'}
            </span>
          </div>

        </div>
      </div>

      {/* 2. Ringkasan Pencapaian Siswa (Executive Synthesis Box) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs">
              <Star className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                Ringkasan Pencapaian & Evaluasi Perkembangan Siswa
              </h3>
              <p className="text-xs text-indigo-200">
                Sintesis holistik akademik, karakter Pancasila, keaktifan, dan rekam jejak siswa
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenAIWithPrompt(`Tolong susunkan draf catatan wali kelas resmi Kemendikbud untuk rapor siswa ${student.name} (NISN: ${student.nisn || '-'}), dengan rata-rata nilai ${avgGrade.toFixed(1)}, presensi ${attRate.toFixed(1)}%, prestasi ${studentAchievements.length}, dan catatan karakter positif.`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-xs transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Buat Catatan Rapor AI</span>
          </button>
        </div>

        {/* Synthesis Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          
          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 space-y-1">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wide block">
              1. Kekuatan Akademik
            </span>
            <p className="text-slate-200 leading-relaxed">
              {studentGrades.length > 0 ? (
                <>
                  Rata-rata capaian <strong>{avgGrade.toFixed(1)}</strong>. Nilai tertinggi diraih pada mata pelajaran{' '}
                  <strong className="text-white">
                    {studentGrades.reduce((prev, curr) => (curr.score > prev.score ? curr : prev), studentGrades[0]).subject} (
                    {studentGrades.reduce((prev, curr) => (curr.score > prev.score ? curr : prev), studentGrades[0]).score}
                  </strong>).
                </>
              ) : (
                'Memiliki motivasi belajar yang baik dan aktif berpartisipasi dalam diskusi kelas.'
              )}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 space-y-1">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide block">
              2. Karakter & Minat Bakat
            </span>
            <p className="text-slate-200 leading-relaxed">
              Rata-rata observasi karakter <strong>{avgCharacter.toFixed(1)}/5.0</strong>. Menunjukkan sikap tanggung jawab, sopan santun, serta minat pada bidang{' '}
              <strong className="text-white">{student.talentsAndInterests || 'Pengembangan Diri & Praktik Kejuruan'}</strong>.
              {student.dreams && ` Bercita-cita menjadi: ${student.dreams}.`}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 space-y-1">
            <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wide block">
              3. Rekomendasi Tindak Lanjut
            </span>
            <p className="text-slate-200 leading-relaxed">
              {attRate < 90 ? (
                <span className="text-rose-300 font-semibold">
                  Tingkat kehadiran di bawah 90%. Perlu pendampingan khusus wali kelas dan koordinasi langsung dengan orang tua ananda.
                </span>
              ) : remedialGrades.length > 0 ? (
                `Jadwalkan pendampingan remedial pada mata pelajaran ${remedialGrades.map(r => r.subject).join(', ')} agar mencapai standar KKM 75.`
              ) : (
                'Pertahankan konsistensi belajar, dorong ananda untuk mengikuti kompetisi/kejuaraan kejuruan tingkat kabupaten/provinsi.'
              )}
            </p>
          </div>

        </div>
      </div>

      {/* 3. GRAFIK KEHADIRAN SISWA (Secara Eksplisit Diminta User) */}
      <StudentAttendanceChart attendanceRecords={studentAttendance} targetRate={90} />

      {/* 4. Filter Tab Navigasi Modul Siswa */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('semua')}
          className={`py-2 px-3.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'semua'
              ? 'bg-white text-emerald-800 shadow-2xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Semua Modul
        </button>
        <button
          onClick={() => setActiveTab('nilai')}
          className={`py-2 px-3.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'nilai'
              ? 'bg-white text-emerald-800 shadow-2xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Hasil Belajar & Nilai ({studentGrades.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('prestasi')}
          className={`py-2 px-3.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'prestasi'
              ? 'bg-white text-emerald-800 shadow-2xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Prestasi ({studentAchievements.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('disiplin')}
          className={`py-2 px-3.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'disiplin'
              ? 'bg-white text-emerald-800 shadow-2xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Disiplin & Pelanggaran ({studentDisciplines.length})</span>
        </button>
      </div>

      {/* 5. Modul Nilai (Hasil Belajar) */}
      {(activeTab === 'semua' || activeTab === 'nilai') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-800">
                  Buku Nilai Akademik Siswa
                </h4>
                <p className="text-[11px] text-slate-500">
                  Daftar nilai tugas, ulangan, PTS, PAS, dan projek dengan standar KKM 75
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-slate-700">
              Rata-rata: <strong className="text-blue-700 font-extrabold">{avgGrade.toFixed(1)}</strong>
            </span>
          </div>

          {studentGrades.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs italic">
              Belum ada data nilai tercatat untuk siswa ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-100">
                  <tr>
                    <th className="p-3">Mata Pelajaran</th>
                    <th className="p-3">Jenis Asesmen</th>
                    <th className="p-3">Nilai</th>
                    <th className="p-3">Status KKM (75)</th>
                    <th className="p-3">Materi / Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentGrades.map(g => {
                    const isTuntas = g.score >= kkmStandard;
                    return (
                      <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-bold text-slate-800">{g.subject}</td>
                        <td className="p-3 text-slate-600">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                            {g.type}
                          </span>
                        </td>
                        <td className="p-3 font-black text-sm">
                          <span className={isTuntas ? 'text-emerald-700' : 'text-rose-600 font-extrabold'}>
                            {g.score}
                          </span>
                        </td>
                        <td className="p-3">
                          {isTuntas ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Tuntas
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              <AlertTriangle className="w-3 h-3" />
                              Remedial
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-500 text-[11px]">
                          {g.topic || g.notes || '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 6. Modul Prestasi Siswa */}
      {(activeTab === 'semua' || activeTab === 'prestasi') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-800">
                  Portofolio Prestasi & Kejuaraan Siswa
                </h4>
                <p className="text-[11px] text-slate-500">
                  Dokumentasi rekam jejak juara akademik dan non-akademik siswa
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              {studentAchievements.length} Prestasi
            </span>
          </div>

          {studentAchievements.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs italic">
              Belum ada portofolio prestasi tercatat. Dorong ananda mengikuti kegiatan ekstrakurikuler & kejuaraan!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {studentAchievements.map(ach => (
                <div key={ach.id} className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                    🏆
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-extrabold text-xs sm:text-sm text-slate-900">
                      {ach.title}
                    </h5>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-amber-800">
                      <span>{ach.rank}</span>
                      <span>•</span>
                      <span>Tingkat {ach.level}</span>
                      <span>•</span>
                      <span>{ach.category}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block pt-0.5">
                      Tanggal: {ach.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. Modul Pelanggaran & Tata Tertib Disiplin */}
      {(activeTab === 'semua' || activeTab === 'disiplin') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-800">
                  Rekam Disiplin & Pembinaan Edukatif
                </h4>
                <p className="text-[11px] text-slate-500">
                  Pencatatan pelanggaran, teguran, dan tindak lanjut berkeadilan (restorative justice)
                </p>
              </div>
            </div>

            <span className="text-xs font-bold">
              {violations.length === 0 ? (
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Teladan Bersih
                </span>
              ) : (
                <span className="text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  {violations.length} Catatan
                </span>
              )}
            </span>
          </div>

          {studentDisciplines.length === 0 ? (
            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-center text-xs text-emerald-800 space-y-1">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
              <p className="font-bold">Keteladanan Positif: Bersih dari Pelanggaran</p>
              <p className="text-[11px] text-emerald-600">Siswa tidak memiliki catatan teguran maupun pelanggaran tata tertib sekolah.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {studentDisciplines.map(d => (
                <div key={d.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        d.level === 'Ringan' ? 'bg-amber-100 text-amber-800' :
                        d.level === 'Sedang' ? 'bg-orange-100 text-orange-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {d.category} ({d.level})
                      </span>
                      <span className="text-slate-400 text-[10px]">{d.date}</span>
                    </div>

                    <span className="text-[10px] font-semibold text-slate-500">
                      Poin: {d.points || 0}
                    </span>
                  </div>

                  <p className="text-slate-700 font-medium leading-relaxed">
                    {d.description}
                  </p>

                  {d.followUpAction && (
                    <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-100 text-emerald-800 text-[11px] font-semibold">
                      🤝 Tindak Lanjut Edukatif: {d.followUpAction}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
