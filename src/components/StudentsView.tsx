import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Sparkles,
  Award,
  BookOpen,
  CalendarCheck,
  Shield,
  Heart,
  X,
  Check,
  UserCheck,
  LayoutGrid,
  FileEdit,
  GraduationCap,
  ChevronRight,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import {
  Student,
  AttendanceRecord,
  GradeRecord,
  CharacterLog,
  DisciplineLog,
  AchievementRecord,
  WelfareCase,
  Gender,
  UserProfile
} from '../types';
import { StudentDashboard } from './StudentDashboard';
import { StudentDataInputModal } from './StudentDataInputModal';

interface StudentsViewProps {
  students: Student[];
  attendance: AttendanceRecord[];
  grades: GradeRecord[];
  characterLogs: CharacterLog[];
  disciplineLogs: DisciplineLog[];
  achievements: AchievementRecord[];
  welfareCases: WelfareCase[];
  onSaveStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onOpenAIWithStudent: (student: Student) => void;
  selectedStudentModal: Student | null;
  onCloseStudentModal: () => void;
  onOpenStudentModal: (student: Student) => void;
  currentUser?: UserProfile | null;
  onOpenAIWithPrompt?: (prompt: string) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  attendance,
  grades,
  characterLogs,
  disciplineLogs,
  achievements,
  welfareCases,
  onSaveStudent,
  onDeleteStudent,
  onOpenAIWithStudent,
  selectedStudentModal,
  onCloseStudentModal,
  onOpenStudentModal,
  currentUser,
  onOpenAIWithPrompt
}) => {
  // If user is logged in as a student, lock/default to their studentId
  const initialStudentId =
    currentUser?.role === 'siswa' && currentUser?.studentId
      ? currentUser.studentId
      : students[0]?.id || '';

  const [selectedStudentId, setSelectedStudentId] = useState<string>(initialStudentId);
  const [viewMode, setViewMode] = useState<'dashboard' | 'direktori'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'All' | 'L' | 'P'>('All');
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Partial<Student>>({});
  const [isSelfInputModalOpen, setIsSelfInputModalOpen] = useState(false);
  const [studentForSelfInput, setStudentForSelfInput] = useState<Student | null>(null);

  // Sync selectedStudentId if students change or initial student is set
  React.useEffect(() => {
    if (!selectedStudentId && students.length > 0) {
      setSelectedStudentId(students[0].id);
    }
  }, [students, selectedStudentId]);

  // Selected student object
  const selectedStudent =
    students.find(s => s.id === selectedStudentId) || students[0] || null;

  // Filter students for directory
  const filteredStudents = students.filter(st => {
    const matchesSearch =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.nis.includes(searchQuery) ||
      (st.nisn && st.nisn.includes(searchQuery));
    const matchesGender = genderFilter === 'All' || st.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  const handleOpenAddModal = () => {
    setEditingStudent({
      name: '',
      nis: '',
      nisn: '',
      gender: 'L',
      birthPlace: '',
      birthDate: '',
      address: '',
      phone: '',
      emergencyContact: '',
      parentName: '',
      parentPhone: '',
      parentJob: '',
      healthHistory: 'Sehat',
      talentsAndInterests: '',
      specialNotes: '',
      status: 'Aktif'
    });
    setIsEditing(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setEditingStudent(student);
    setIsEditing(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent.name || !editingStudent.nis) return;

    const studentToSave: Student = {
      id: editingStudent.id || `std_${Date.now()}`,
      classId: editingStudent.classId || 'cls_default',
      teacherId: editingStudent.teacherId || 'current_teacher',
      nis: editingStudent.nis || '',
      nisn: editingStudent.nisn || '',
      name: editingStudent.name || '',
      gender: (editingStudent.gender as Gender) || 'L',
      birthPlace: editingStudent.birthPlace || '',
      birthDate: editingStudent.birthDate || '',
      address: editingStudent.address || '',
      phone: editingStudent.phone || '',
      emergencyContact: editingStudent.emergencyContact || '',
      parentName: editingStudent.parentName || '',
      parentPhone: editingStudent.parentPhone || '',
      parentJob: editingStudent.parentJob || '',
      healthHistory: editingStudent.healthHistory || '',
      talentsAndInterests: editingStudent.talentsAndInterests || '',
      specialNotes: editingStudent.specialNotes || '',
      status: editingStudent.status || 'Aktif',
      createdAt: editingStudent.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveStudent(studentToSave);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Selector Navigasi Siswa */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs space-y-4">
        
        {/* Baris Atas: Judul & Toggle Mode Tampilan */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>Menu Data Siswa & Dashboard Terpadu</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Data bersumber dari formulir isian mandiri siswa. Wali kelas dapat memilih siswa untuk membuka dashboard evaluasi lengkap.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle View Mode: Dashboard Siswa vs Direktori Buku Induk */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setViewMode('dashboard')}
                className={`py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all ${
                  viewMode === 'dashboard'
                    ? 'bg-white text-emerald-800 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Dashboard Siswa</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('direktori')}
                className={`py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all ${
                  viewMode === 'direktori'
                    ? 'bg-white text-emerald-800 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Buku Induk ({students.length})</span>
              </button>
            </div>

            {/* Tombol Isian Data Siswa Mandiri */}
            <button
              onClick={() => {
                setStudentForSelfInput(selectedStudent);
                setIsSelfInputModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors shadow-2xs"
              title="Isi formulir data siswa mandiri"
            >
              <FileEdit className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Formulir Isian Siswa</span>
              <span className="sm:hidden">Isian Siswa</span>
            </button>
          </div>
        </div>

        {/* Baris Pemilih Nama Siswa (Wali Kelas Menampilkan Nama Siswa yang Dapat Dipilih) */}
        {students.length > 0 ? (
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pilih Nama Siswa Rombel:</span>
              </span>

              {/* Quick Dropdown Selector */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="p-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none max-w-xs"
                >
                  {students.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.nis}) {st.gender === 'L' ? '• L' : '• P'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Horizontal Scrollable Quick Student Avatar Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
              {students.map(st => {
                const isSelected = selectedStudent?.id === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => {
                      setSelectedStudentId(st.id);
                      setViewMode('dashboard');
                    }}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs scale-102'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isSelected
                        ? 'bg-white text-emerald-800'
                        : st.gender === 'L'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-pink-100 text-pink-700'
                    }`}>
                      {st.name[0]}
                    </div>
                    <span className="truncate max-w-[120px]">{st.name}</span>
                    {st.filledByStudent && (
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-emerald-500'}`} title="Diisi mandiri oleh siswa" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-slate-500">
            Belum ada data siswa. Silakan inisialisasi data contoh atau tambah siswa baru.
          </div>
        )}

      </div>

      {/* 2. KONTEN UTAMA BERDASARKAN MODE */}
      {viewMode === 'dashboard' && selectedStudent ? (
        /* ================== MODE 1: DASHBOARD SISWA TERPADU ================== */
        <StudentDashboard
          student={selectedStudent}
          attendance={attendance}
          grades={grades}
          characterLogs={characterLogs}
          disciplineLogs={disciplineLogs}
          achievements={achievements}
          welfareCases={welfareCases}
          onOpenEditModal={st => {
            setStudentForSelfInput(st);
            setIsSelfInputModalOpen(true);
          }}
          onOpenAIWithStudent={onOpenAIWithStudent}
          onOpenAIWithPrompt={prompt => {
            if (onOpenAIWithPrompt) onOpenAIWithPrompt(prompt);
          }}
        />
      ) : (
        /* ================== MODE 2: BUKU INDUK DIREKTORI SELURUH SISWA ================== */
        <div className="space-y-4">
          
          {/* Top Bar: Search, Gender Filter & Tambah Siswa */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Filter Direktori:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {(['All', 'L', 'P'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => setGenderFilter(g)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      genderFilter === g
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {g === 'All' ? 'Semua' : g === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama / NIS / NISN..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none w-48 sm:w-60"
                />
              </div>

              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Siswa</span>
              </button>
            </div>
          </div>

          {/* Grid Kartu Siswa */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredStudents.map(student => {
              const sAtt = attendance.filter(a => a.studentId === student.id);
              const sHadir = sAtt.filter(a => a.status === 'Hadir' || a.status === 'Terlambat').length;
              const attRate = sAtt.length > 0 ? (sHadir / sAtt.length) * 100 : 96.5;

              const sGrades = grades.filter(g => g.studentId === student.id);
              const avgScore =
                sGrades.length > 0
                  ? sGrades.reduce((a, b) => a + b.score, 0) / sGrades.length
                  : 84.5;

              const sAchievements = achievements.filter(a => a.studentId === student.id);
              const sWelfare = welfareCases.filter(w => w.studentId === student.id && w.status !== 'Selesai');

              return (
                <div
                  key={student.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all p-4 sm:p-5 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm ${
                          student.gender === 'L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                        }`}>
                          {student.name[0]}
                        </div>
                        <div>
                          <h3
                            onClick={() => {
                              setSelectedStudentId(student.id);
                              setViewMode('dashboard');
                            }}
                            className="text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-600 cursor-pointer line-clamp-1"
                            title="Klik untuk membuka Dashboard Siswa"
                          >
                            {student.name}
                          </h3>
                          <p className="text-[11px] text-slate-500 font-mono">
                            NIS: {student.nis} {student.nisn ? `• NISN: ${student.nisn}` : ''}
                          </p>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        student.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {student.status}
                      </span>
                    </div>

                    {/* Mini Metrics */}
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-500 block">Kehadiran</span>
                        <span className={`font-black text-xs ${attRate < 90 ? 'text-rose-600' : 'text-slate-800'}`}>
                          {attRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-500 block">Rata-rata Nilai</span>
                        <span className="font-black text-xs text-slate-800">
                          {avgScore.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {student.filledByStudent && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Data Siswa Mandiri
                        </span>
                      )}
                      {sAchievements.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <Award className="w-3 h-3 text-amber-600" />
                          {sAchievements.length} Prestasi
                        </span>
                      )}
                      {sWelfare.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <Heart className="w-3 h-3 text-rose-500" />
                          Pantauan BK
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => {
                        setSelectedStudentId(student.id);
                        setViewMode('dashboard');
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold transition-colors"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Buka Dashboard</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setStudentForSelfInput(student);
                          setIsSelfInputModalOpen(true);
                        }}
                        title="Formulir Isian Siswa"
                        className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus data siswa ${student.name}?`)) {
                            onDeleteStudent(student.id);
                          }
                        }}
                        title="Hapus Siswa"
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 3. MODAL ISIAN DATA SISWA MANDIRI */}
      <StudentDataInputModal
        isOpen={isSelfInputModalOpen}
        onClose={() => setIsSelfInputModalOpen(false)}
        student={studentForSelfInput}
        onSaveStudent={onSaveStudent}
        isStudentUser={currentUser?.role === 'siswa'}
      />

      {/* 4. MODAL ADD / EDIT MANUAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingStudent.id ? 'Ubah Data Siswa' : 'Tambah Siswa Baru'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.name || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                    placeholder="Contoh: Muhammad Rizki"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin *</label>
                  <select
                    value={editingStudent.gender || 'L'}
                    onChange={e => setEditingStudent({ ...editingStudent, gender: e.target.value as Gender })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIS *</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.nis || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, nis: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                    placeholder="20261101"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NISN</label>
                  <input
                    type="text"
                    value={editingStudent.nisn || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, nisn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                    placeholder="0089123401"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Siswa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
