import React, { useState } from 'react';
import {
  ShieldCheck,
  School,
  Users,
  CalendarCheck,
  Award,
  AlertTriangle,
  GraduationCap,
  Plus,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Settings,
  Sparkles,
  ArrowRight,
  X,
  Check,
  UserPlus
} from 'lucide-react';
import { Classroom, Student, WelfareCase, UserProfile } from '../types';

interface AdminPortalProps {
  currentAdmin: UserProfile;
  classes: Classroom[];
  students: Student[];
  welfareCases: WelfareCase[];
  onSelectClass: (c: Classroom) => void;
  onAddClass: (newClass: Classroom) => void;
  onSwitchToTeacherMode: () => void;
  onLogoutAdmin: () => void;
  onOpenAIWithPrompt: (prompt: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentAdmin,
  classes,
  students,
  welfareCases,
  onSelectClass,
  onAddClass,
  onSwitchToTeacherMode,
  onLogoutAdmin,
  onOpenAIWithPrompt
}) => {
  const [adminTab, setAdminTab] = useState<'overview' | 'classes' | 'teachers' | 'supervision' | 'reports'>('overview');
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);

  // New Class Form State
  const [newClassName, setNewClassName] = useState('Kelas XI RPL 2');
  const [newGrade, setNewGrade] = useState('XI (Sebelas)');
  const [newMajor, setNewMajor] = useState('Rekayasa Perangkat Lunak');
  const [newTeacherName, setNewTeacherName] = useState('Siti Fatimah, S.Pd.');

  // Pre-configured school classes list (combined with live classes)
  const allSchoolClasses: Classroom[] = [
    ...classes,
    ...(classes.some(c => c.name.includes('RPL 2')) ? [] : [{
      id: 'cls_rpl2',
      teacherId: 'teacher_rpl2',
      name: 'Kelas XI RPL 2',
      grade: 'XI (Sebelas)',
      academicYear: '2026/2027',
      semester: 'Ganjil' as const,
      schoolName: 'SMKN 1 Sidayu',
      major: 'Rekayasa Perangkat Lunak',
      targetAttendanceRate: 90,
      createdAt: new Date().toISOString()
    }]),
    ...(classes.some(c => c.name.includes('TKJ 1')) ? [] : [{
      id: 'cls_tkj1',
      teacherId: 'teacher_tkj1',
      name: 'Kelas XII TKJ 1',
      grade: 'XII (Dua Belas)',
      academicYear: '2026/2027',
      semester: 'Ganjil' as const,
      schoolName: 'SMKN 1 Sidayu',
      major: 'Teknik Komputer & Jaringan',
      targetAttendanceRate: 90,
      createdAt: new Date().toISOString()
    }]),
    ...(classes.some(c => c.name.includes('DKV 1')) ? [] : [{
      id: 'cls_dkv1',
      teacherId: 'teacher_dkv1',
      name: 'Kelas X DKV 1',
      grade: 'X (Sepuluh)',
      academicYear: '2026/2027',
      semester: 'Ganjil' as const,
      schoolName: 'SMKN 1 Sidayu',
      major: 'Desain Komunikasi Visual',
      targetAttendanceRate: 90,
      createdAt: new Date().toISOString()
    }])
  ];

  // Teachers directory
  const homeroomTeachers = [
    { name: 'Mohammad Alamifal, S.Pd., M.Kom.', nip: '19850920 201101 1 009', classAssigned: 'Kelas XI RPL 1', email: 'alamifal@smkn1sidayu.sch.id', status: 'Laporan Lengkap' },
    { name: 'Siti Fatimah, S.Pd.', nip: '19890412 201402 2 004', classAssigned: 'Kelas XI RPL 2', email: 'sitifatimah@smkn1sidayu.sch.id', status: 'Laporan Lengkap' },
    { name: 'Drs. Hendro Wibowo', nip: '19740315 199903 1 003', classAssigned: 'Kelas XII TKJ 1', email: 'hendro@smkn1sidayu.sch.id', status: 'Menunggu Review' },
    { name: 'Rina Kusuma Wardhani, M.Ds.', nip: '19920108 201903 2 011', classAssigned: 'Kelas X DKV 1', email: 'rinakusuma@smkn1sidayu.sch.id', status: 'Laporan Lengkap' }
  ];

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    const createdClass: Classroom = {
      id: `cls_${Date.now()}`,
      teacherId: `teacher_${Date.now()}`,
      name: newClassName,
      grade: newGrade,
      academicYear: '2026/2027',
      semester: 'Ganjil',
      schoolName: 'SMKN 1 Sidayu',
      major: newMajor,
      targetAttendanceRate: 90,
      createdAt: new Date().toISOString()
    };
    onAddClass(createdClass);
    setIsAddClassOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Executive Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-900/40">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Portal Administrator & Supervisi Sekolah SMKN 1 Sidayu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang, {currentAdmin.displayName}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
              Panel kendali terpusat untuk Kepala Sekolah, Wakasek Kesiswaan, dan Pengawas Sekolah dalam memantau kinerja seluruh wali kelas, presensi sekolah, serta penanganan kasus siswa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenAIWithPrompt(`Tolong susun analisis eksekutif komprehensif tingkat sekolah untuk Kepala Sekolah dan Tim Pengawas SMKN 1 Sidayu, mencakup koordinasi 4 rombel kejuruan, rekap kasus kesejahteraan BK, dan audit kedisiplinan semester berjalan.`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Analisis Eksekutif AI</span>
            </button>

            <button
              onClick={onSwitchToTeacherMode}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 backdrop-blur-sm transition-all"
            >
              <span>Buka Ruang Wali Kelas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* School KPIs Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Total Rombel Aktif</span>
          <div className="text-2xl font-bold text-slate-900">{allSchoolClasses.length} Kelas</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            Tingkat X, XI, XII
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Guru Wali Kelas</span>
          <div className="text-2xl font-bold text-slate-900">{homeroomTeachers.length} Guru</div>
          <span className="text-[11px] text-slate-500 mt-1 inline-block">
            Terhubung & Aktif
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Total Siswa Sekolah</span>
          <div className="text-2xl font-bold text-slate-900">{students.length > 0 ? students.length * 4 : 144} Siswa</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            Rekap Dapodik
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Rata-rata Presensi</span>
          <div className="text-2xl font-bold text-slate-900">93.8%</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            Target &gt;90% Tercapai
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Kasus BK & Kesiswaan</span>
          <div className="text-2xl font-bold text-teal-700">{welfareCases.length || 3} Kasus</div>
          <span className="text-[11px] text-teal-600 font-semibold mt-1 inline-block">
            Dalam Penanganan Terpadu
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Standar KKM Sekolah</span>
          <div className="text-2xl font-bold text-slate-900">75.0</div>
          <span className="text-[11px] text-slate-500 mt-1 inline-block">
            Kurikulum Merdeka
          </span>
        </div>
      </div>

      {/* Admin Nav Subtabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2 overflow-x-auto text-xs font-bold">
        <div className="flex items-center gap-1.5">
          {[
            { id: 'overview', label: 'Ringkasan Rombel Sekolah', icon: School },
            { id: 'teachers', label: 'Direktori Guru Wali Kelas', icon: Users },
            { id: 'supervision', label: 'Supervisi BK & Kesiswaan', icon: AlertTriangle },
            { id: 'reports', label: 'Audit Dokumen Laporan', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setIsAddClassOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shrink-0 shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Rombel Kelas</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW / CLASSES LIST */}
      {adminTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Daftar Rombel & Kelas Binaan SMKN 1 Sidayu
            </h3>
            <span className="text-xs text-slate-500">
              Pilih kelas untuk langsung memantau data secara mendalam
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {allSchoolClasses.map(cls => (
              <div
                key={cls.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {cls.grade}
                    </span>
                    <span className="text-xs text-slate-400">
                      {cls.academicYear}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mt-2">
                    {cls.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Jurusan: {cls.major || 'Teknologi Informasi'}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-1.5 text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Target Kehadiran:</span>
                      <strong className="text-emerald-700">{cls.targetAttendanceRate}%</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Status Laporan:</span>
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                        <CheckCircle className="w-3.5 h-3.5" /> Terverifikasi
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectClass(cls);
                    onSwitchToTeacherMode();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Pantau & Kelola Kelas</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TEACHERS DIRECTORY */}
      {adminTab === 'teachers' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Direktori Guru Wali Kelas SMKN 1 Sidayu
              </h3>
              <p className="text-xs text-slate-500">
                Pengawasan penugasan wali kelas, NIP resmi, rombel binaan, dan status pelaporan.
              </p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Nama Guru Wali Kelas</th>
                  <th className="p-3">NIP</th>
                  <th className="p-3">Rombel Binaan</th>
                  <th className="p-3">Email Akun</th>
                  <th className="p-3">Status Kepatuhan Dokumen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {homeroomTeachers.map((tch, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{tch.name}</td>
                    <td className="p-3 font-mono text-slate-600">{tch.nip}</td>
                    <td className="p-3 font-semibold text-emerald-800">{tch.classAssigned}</td>
                    <td className="p-3 text-slate-600">{tch.email}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        {tch.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SUPERVISION KESISWAAN & BK */}
      {adminTab === 'supervision' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Supervisi Terpadu Kesiswaan & Bimbingan Konseling (BK)
              </h3>
              <p className="text-xs text-slate-500">
                Deteksi dini penanganan kasus perundungan, penurunan motivasi, dan ketidakhadiran lintas rombel.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {welfareCases.length > 0 ? (
              welfareCases.map(c => {
                const student = students.find(s => s.id === c.studentId);
                return (
                  <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {student?.name || 'Siswa Binaan'} ({c.triggerCategory})
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                        {c.severity}
                      </span>
                    </div>
                    <p className="text-slate-700">{c.indications}</p>
                    <div className="text-emerald-700 font-semibold">
                      Alur Tindakan Terpilih: {c.actionRecommendation} • Status: {c.status}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 italic">Tidak ada kasus kesiswaan eskalasi mendesak.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LAPORAN */}
      {adminTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Audit & Verifikasi Laporan Wali Kelas Seluruh Sekolah
              </h3>
              <p className="text-xs text-slate-500">
                Pemeriksaan kepatuhan pelaporan berkala bulanan dan tengah semester (PTS) untuk ditandatangani Kepala Sekolah.
              </p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Rombel Kelas</th>
                  <th className="p-3">Wali Kelas</th>
                  <th className="p-3">Laporan Terkini</th>
                  <th className="p-3">Status Pengesahan</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {homeroomTeachers.map((tch, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{tch.classAssigned}</td>
                    <td className="p-3 text-slate-700">{tch.name}</td>
                    <td className="p-3 font-semibold text-emerald-800">Laporan Bulanan Oktober/November 2026</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                        <CheckCircle className="w-3.5 h-3.5" /> Disahkan Kepala Sekolah
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={onSwitchToTeacherMode}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"
                      >
                        Lihat Laporan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD CLASS MODAL */}
      {isAddClassOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Tambah Rombel / Kelas Baru
              </h3>
              <button onClick={() => setIsAddClassOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Rombel Kelas *</label>
                <input
                  type="text"
                  required
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                  placeholder="Contoh: Kelas XI RPL 2"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tingkat *</label>
                <select
                  value={newGrade}
                  onChange={e => setNewGrade(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="X (Sepuluh)">X (Sepuluh)</option>
                  <option value="XI (Sebelas)">XI (Sebelas)</option>
                  <option value="XII (Dua Belas)">XII (Dua Belas)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kompetensi Keahlian / Jurusan *</label>
                <input
                  type="text"
                  required
                  value={newMajor}
                  onChange={e => setNewMajor(e.target.value)}
                  placeholder="Rekayasa Perangkat Lunak"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Wali Kelas yang Ditugaskan</label>
                <input
                  type="text"
                  value={newTeacherName}
                  onChange={e => setNewTeacherName(e.target.value)}
                  placeholder="Nama Guru Wali Kelas"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddClassOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Buat Kelas</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
