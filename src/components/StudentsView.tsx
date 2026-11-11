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
  UserCheck
} from 'lucide-react';
import {
  Student,
  AttendanceRecord,
  GradeRecord,
  CharacterLog,
  DisciplineLog,
  AchievementRecord,
  WelfareCase,
  Gender
} from '../types';

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
  onOpenStudentModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'All' | 'L' | 'P'>('All');
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Partial<Student>>({});
  const [detailTab, setDetailTab] = useState<'biodata' | 'presensi' | 'nilai' | 'karakter' | 'prestasi' | 'kesejahteraan'>('biodata');

  // Filter students
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
      
      {/* Top Bar: Title, Search, Filters & Add Student */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            Buku Induk & Profil Lengkap Siswa
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola data demografis, kontak darurat, rekam medis, orang tua, dan catatan perkembangan siswa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
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

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map(student => {
          const sAtt = attendance.filter(a => a.studentId === student.id);
          const sHadir = sAtt.filter(a => a.status === 'Hadir' || a.status === 'Terlambat').length;
          const attRate = sAtt.length > 0 ? (sHadir / sAtt.length) * 100 : 100;

          const sGrades = grades.filter(g => g.studentId === student.id);
          const avgScore =
            sGrades.length > 0
              ? sGrades.reduce((a, b) => a + b.score, 0) / sGrades.length
              : 0;

          const sAchievements = achievements.filter(a => a.studentId === student.id);
          const sWelfare = welfareCases.filter(w => w.studentId === student.id && w.status !== 'Selesai');

          return (
            <div
              key={student.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
            >
              {/* Header Info */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm ${
                      student.gender === 'L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                    }`}>
                      {student.name[0]}
                    </div>
                    <div>
                      <h3
                        onClick={() => onOpenStudentModal(student)}
                        className="text-sm font-bold text-slate-900 hover:text-emerald-600 cursor-pointer line-clamp-1"
                      >
                        {student.name}
                      </h3>
                      <p className="text-xs text-slate-500">
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

                {/* Metrics Preview */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[11px] text-slate-500 block">Kehadiran</span>
                    <span className={`font-bold ${attRate < 90 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {attRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[11px] text-slate-500 block">Rata-rata Nilai</span>
                    <span className="font-bold text-slate-800">
                      {avgScore > 0 ? avgScore.toFixed(1) : '-'}
                    </span>
                  </div>
                </div>

                {/* Additional highlights: Achievements or Welfare warning */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {sAchievements.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      <Award className="w-3 h-3 text-amber-600" />
                      {sAchievements.length} Prestasi
                    </span>
                  )}
                  {sWelfare.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      <Heart className="w-3 h-3 text-rose-500" />
                      Pantauan Khusus
                    </span>
                  )}
                  {student.talentsAndInterests && (
                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-600 truncate max-w-[190px]">
                      Bakat: {student.talentsAndInterests}
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => onOpenAIWithStudent(student)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Analisis AI</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenStudentModal(student)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                  >
                    Profil
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(student)}
                    title="Ubah Data Siswa"
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
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

      {/* STUDENT DETAIL MODAL */}
      {selectedStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center shadow-xs">
                  {selectedStudentModal.name[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedStudentModal.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    NIS: {selectedStudentModal.nis} • NISN: {selectedStudentModal.nisn || '-'} • Gender: {selectedStudentModal.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </p>
                </div>
              </div>
              <button
                onClick={onCloseStudentModal}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Subtabs */}
            <div className="flex items-center gap-2 px-5 py-2.5 border-b border-slate-100 bg-slate-100/60 overflow-x-auto text-xs font-bold">
              {[
                { id: 'biodata', label: 'Biodata & Ortu', icon: UserCheck },
                { id: 'presensi', label: 'Presensi', icon: CalendarCheck },
                { id: 'nilai', label: 'Buku Nilai', icon: BookOpen },
                { id: 'karakter', label: '10 Karakter', icon: Sparkles },
                { id: 'prestasi', label: 'Prestasi', icon: Award },
                { id: 'kesejahteraan', label: 'Kesejahteraan & Disiplin', icon: Shield }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setDetailTab(tab.id as any)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                      detailTab === tab.id
                        ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body Content */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {detailTab === 'biodata' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        Informasi Personal
                      </h4>
                      <div>
                        <span className="text-slate-500">Tempat, Tanggal Lahir: </span>
                        <span className="font-semibold text-slate-800">
                          {selectedStudentModal.birthPlace || '-'}, {selectedStudentModal.birthDate || '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Alamat Rumah: </span>
                        <span className="font-semibold text-slate-800">{selectedStudentModal.address || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">No. Telepon Siswa: </span>
                        <span className="font-semibold text-slate-800">{selectedStudentModal.phone || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Kontak Darurat: </span>
                        <span className="font-semibold text-slate-800">{selectedStudentModal.emergencyContact || '-'}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        Data Orang Tua / Wali
                      </h4>
                      <div>
                        <span className="text-slate-500">Nama Orang Tua/Wali: </span>
                        <span className="font-semibold text-slate-800">{selectedStudentModal.parentName || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Pekerjaan: </span>
                        <span className="font-semibold text-slate-800">{selectedStudentModal.parentJob || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">No. WhatsApp/HP: </span>
                        <span className="font-semibold text-slate-800">{selectedStudentModal.parentPhone || '-'}</span>
                      </div>
                      {selectedStudentModal.parentPhone && (
                        <div className="pt-1">
                          <a
                            href={`https://wa.me/${selectedStudentModal.parentPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            Hubungi via WhatsApp
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Riwayat Kesehatan & Minat */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        Riwayat Kesehatan
                      </h4>
                      <p className="text-slate-700 leading-relaxed">
                        {selectedStudentModal.healthHistory || 'Tidak ada riwayat alergi atau penyakit kronis tercatat.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                        Minat, Bakat & Catatan Khusus
                      </h4>
                      <p className="text-slate-700 leading-relaxed">
                        <strong className="text-slate-800">Minat/Bakat: </strong>
                        {selectedStudentModal.talentsAndInterests || 'Belum terdata khusus.'}
                      </p>
                      <p className="text-slate-700 leading-relaxed pt-1">
                        <strong className="text-slate-800">Catatan Khusus: </strong>
                        {selectedStudentModal.specialNotes || 'Tidak ada catatan khusus.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {detailTab === 'presensi' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800">Rekapitulasi Kehadiran Siswa</h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-600 font-bold">
                        <tr>
                          <th className="p-2.5">Tanggal</th>
                          <th className="p-2.5">Status</th>
                          <th className="p-2.5">Keterlambatan</th>
                          <th className="p-2.5">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {attendance.filter(a => a.studentId === selectedStudentModal.id).map(a => (
                          <tr key={a.id} className="hover:bg-slate-50">
                            <td className="p-2.5 text-slate-700">{a.date}</td>
                            <td className="p-2.5 font-bold">
                              <span className={`px-2 py-0.5 rounded-full text-[11px] ${
                                a.status === 'Hadir' ? 'bg-emerald-100 text-emerald-800' :
                                a.status === 'Sakit' ? 'bg-amber-100 text-amber-800' :
                                a.status === 'Izin' ? 'bg-blue-100 text-blue-800' :
                                a.status === 'Alfa' ? 'bg-rose-100 text-rose-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {a.status}
                              </span>
                            </td>
                            <td className="p-2.5 text-slate-600">{a.lateMinutes ? `${a.lateMinutes} menit` : '-'}</td>
                            <td className="p-2.5 text-slate-600">{a.notes || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {detailTab === 'nilai' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800">Buku Nilai Hasil Belajar</h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-600 font-bold">
                        <tr>
                          <th className="p-2.5">Mata Pelajaran</th>
                          <th className="p-2.5">Jenis</th>
                          <th className="p-2.5">Nilai</th>
                          <th className="p-2.5">Materi/Topik</th>
                          <th className="p-2.5">Catatan Evaluasi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {grades.filter(g => g.studentId === selectedStudentModal.id).map(g => (
                          <tr key={g.id} className="hover:bg-slate-50">
                            <td className="p-2.5 font-semibold text-slate-800">{g.subject}</td>
                            <td className="p-2.5 text-slate-600">{g.type}</td>
                            <td className="p-2.5 font-bold text-emerald-700">{g.score}</td>
                            <td className="p-2.5 text-slate-600">{g.topic || '-'}</td>
                            <td className="p-2.5 text-slate-500">{g.notes || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {detailTab === 'karakter' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800">Observasi 10 Nilai Karakter</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {characterLogs.filter(c => c.studentId === selectedStudentModal.id).map(c => (
                      <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-emerald-700">{c.valueType}</span>
                          <span className="font-extrabold text-amber-500">★ {c.rating}/5</span>
                        </div>
                        <p className="text-slate-700 text-[11px] leading-relaxed">{c.notes}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{c.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detailTab === 'prestasi' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800">Portofolio Prestasi</h4>
                  {achievements.filter(a => a.studentId === selectedStudentModal.id).length === 0 ? (
                    <p className="text-slate-500 italic">Belum ada portofolio prestasi tercatat.</p>
                  ) : (
                    <div className="space-y-2">
                      {achievements.filter(a => a.studentId === selectedStudentModal.id).map(a => (
                        <div key={a.id} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-900 block">{a.title}</span>
                            <span className="text-xs text-amber-800 font-semibold">
                              {a.rank} • Tingkat {a.level} ({a.category})
                            </span>
                          </div>
                          <span className="text-xs text-slate-500">{a.date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {detailTab === 'kesejahteraan' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-800 mb-2">Kasus Pemantauan Kesejahteraan (Early Warning)</h4>
                    {welfareCases.filter(w => w.studentId === selectedStudentModal.id).length === 0 ? (
                      <p className="text-slate-500 italic">Kondisi siswa sehat dan aman, tidak ada kasus aktif.</p>
                    ) : (
                      welfareCases.filter(w => w.studentId === selectedStudentModal.id).map(w => (
                        <div key={w.id} className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-rose-800">{w.triggerCategory}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">{w.severity}</span>
                          </div>
                          <p className="text-slate-700">{w.indications}</p>
                          <div className="text-[11px] font-semibold text-emerald-700 pt-1">
                            Rekomendasi Aksi: {w.actionRecommendation}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 mb-2">Catatan Kedisiplinan & Penghargaan</h4>
                    {disciplineLogs.filter(d => d.studentId === selectedStudentModal.id).length === 0 ? (
                      <p className="text-slate-500 italic">Nihil pelanggaran disiplin.</p>
                    ) : (
                      disciplineLogs.filter(d => d.studentId === selectedStudentModal.id).map(d => (
                        <div key={d.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 mb-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{d.category} ({d.level})</span>
                            <span className="text-xs text-slate-500">{d.date}</span>
                          </div>
                          <p className="text-slate-700">{d.description}</p>
                          {d.followUpAction && (
                            <p className="text-emerald-700 font-semibold">Tindak Lanjut: {d.followUpAction}</p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => {
                  onCloseStudentModal();
                  onOpenAIWithStudent(selectedStudentModal);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-xs hover:shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Analisis AI Siswa Lengkap</span>
              </button>

              <button
                onClick={onCloseStudentModal}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT STUDENT MODAL */}
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
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={editingStudent.birthPlace || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, birthPlace: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                    placeholder="Gresik"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={editingStudent.birthDate || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, birthDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Tempat Tinggal</label>
                <input
                  type="text"
                  value={editingStudent.address || ''}
                  onChange={e => setEditingStudent({ ...editingStudent, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  placeholder="Jl. Raya Sidayu No. 12"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    value={editingStudent.parentName || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, parentName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                    placeholder="Nama Ayah/Ibu"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pekerjaan Orang Tua</label>
                  <input
                    type="text"
                    value={editingStudent.parentJob || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, parentJob: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                    placeholder="Wiraswasta / PNS"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. WhatsApp Orang Tua</label>
                  <input
                    type="text"
                    value={editingStudent.parentPhone || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, parentPhone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                    placeholder="081234567890"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kontak Darurat</label>
                  <input
                    type="text"
                    value={editingStudent.emergencyContact || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, emergencyContact: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                    placeholder="081234567891 (Paman/Bibi)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Riwayat Kesehatan</label>
                  <input
                    type="text"
                    value={editingStudent.healthHistory || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, healthHistory: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                    placeholder="Sehat / Alergi debu"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Minat & Bakat</label>
                  <input
                    type="text"
                    value={editingStudent.talentsAndInterests || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, talentsAndInterests: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                    placeholder="Desain grafis, Futsal, Robotika"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Khusus Wali Kelas</label>
                <textarea
                  rows={2}
                  value={editingStudent.specialNotes || ''}
                  onChange={e => setEditingStudent({ ...editingStudent, specialNotes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  placeholder="Catatan kebiasaan belajar, kepribadian, atau latar belakang keluarga"
                />
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
