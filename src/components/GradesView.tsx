import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Plus,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Filter,
  Check,
  X,
  Award,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Student, GradeRecord, AssessmentType } from '../types';

interface GradesViewProps {
  students: Student[];
  grades: GradeRecord[];
  onSaveGrade: (grade: GradeRecord) => void;
  onDeleteGrade: (id: string) => void;
  onOpenAIWithPrompt: (prompt: string) => void;
}

export const GradesView: React.FC<GradesViewProps> = ({
  students,
  grades,
  onSaveGrade,
  onDeleteGrade,
  onOpenAIWithPrompt
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('Semua');
  const [selectedType, setSelectedType] = useState<string>('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGrade, setNewGrade] = useState<Partial<GradeRecord>>({
    subject: 'Pemrograman Web',
    type: 'Tugas',
    score: 85,
    semester: 'Ganjil',
    date: new Date().toISOString().split('T')[0],
    topic: '',
    notes: ''
  });

  // Extract unique subjects
  const allSubjects = Array.from(new Set(grades.map(g => g.subject)));
  if (!allSubjects.includes('Pemrograman Web')) allSubjects.unshift('Pemrograman Web');
  if (!allSubjects.includes('Basis Data')) allSubjects.push('Basis Data');
  if (!allSubjects.includes('Matematika Terapan')) allSubjects.push('Matematika Terapan');
  if (!allSubjects.includes('Bahasa Indonesia')) allSubjects.push('Bahasa Indonesia');
  if (!allSubjects.includes('Bahasa Inggris')) allSubjects.push('Bahasa Inggris');

  // Filter grades
  const filteredGrades = grades.filter(g => {
    const matchSub = selectedSubject === 'Semua' || g.subject === selectedSubject;
    const matchType = selectedType === 'Semua' || g.type === selectedType;
    return matchSub && matchType;
  });

  // Class Average
  const classAvg =
    grades.length > 0
      ? grades.reduce((acc, curr) => acc + curr.score, 0) / grades.length
      : 82;

  // Compute student-by-student analysis
  const studentAnalysis = students.map(st => {
    const stGrades = grades.filter(g => g.studentId === st.id);
    const avg =
      stGrades.length > 0
        ? stGrades.reduce((a, b) => a + b.score, 0) / stGrades.length
        : 0;

    // Strengths: subject with highest score
    const sorted = [...stGrades].sort((a, b) => b.score - a.score);
    const strength = sorted.length > 0 ? `${sorted[0].subject} (${sorted[0].score})` : 'Belum cukup data';
    const improvement =
      sorted.length > 1
        ? `${sorted[sorted.length - 1].subject} (${sorted[sorted.length - 1].score})`
        : 'Pertahankan prestasi';

    // Trend: compare latest grade with average
    const latest = stGrades[stGrades.length - 1];
    const trend = latest ? (latest.score >= avg ? 'Meningkat' : 'Menurun') : 'Stabil';

    return {
      student: st,
      gradeCount: stGrades.length,
      avg,
      strength,
      improvement,
      trend,
      grades: stGrades
    };
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGrade.studentId || !newGrade.subject || newGrade.score === undefined) return;

    const student = students.find(s => s.id === newGrade.studentId);
    if (!student) return;

    const gradeToSave: GradeRecord = {
      id: `grd_${Date.now()}`,
      classId: student.classId,
      teacherId: student.teacherId,
      studentId: student.id,
      subject: newGrade.subject || 'Pemrograman Web',
      type: (newGrade.type as AssessmentType) || 'Tugas',
      score: Number(newGrade.score),
      semester: (newGrade.semester as any) || 'Ganjil',
      date: newGrade.date || new Date().toISOString().split('T')[0],
      topic: newGrade.topic || '',
      notes: newGrade.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveGrade(gradeToSave);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            Manajemen Hasil Belajar & Analisis Akademik
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengelolaan nilai tugas, ulangan harian, PTS, PAS, projek, praktikum, dan portofolio per mata pelajaran.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onOpenAIWithPrompt(`Tolong lakukan analisis hasil belajar kelas kami: Rata-rata kelas saat ini adalah ${classAvg.toFixed(1)}. Siswa dengan rata-rata tertinggi: ${studentAnalysis.filter(s => s.avg >= 88).map(s => s.student.name).join(', ')}. Siswa yang membutuhkan remedial / bimbingan khusus: ${studentAnalysis.filter(s => s.avg < 75 && s.avg > 0).map(s => `${s.student.name} (${s.avg.toFixed(1)})`).join(', ')}. Berikan rekomendasi pembelajaran berdiferensiasi dan saran tindak lanjut belajar.`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs border border-indigo-200 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Analisis Nilai AI</span>
          </button>

          <button
            onClick={() => {
              if (students.length > 0) {
                setNewGrade(prev => ({ ...prev, studentId: students[0].id }));
              }
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Entri Nilai Siswa</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Rata-rata Nilai Kelas</span>
          <div className="text-2xl font-bold text-slate-900">{classAvg.toFixed(1)} / 100</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            Standar Ketuntasan Minimal (KKM): 75.0
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Total Penilaian Terdata</span>
          <div className="text-2xl font-bold text-slate-900">{grades.length} Evaluasi</div>
          <span className="text-[11px] text-slate-500 mt-1 inline-block">
            Mencakup tugas, PTS, projek, dan praktikum
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Siswa Butuh Pengayaan / Remedial</span>
          <div className="text-2xl font-bold text-amber-600">
            {studentAnalysis.filter(s => s.avg < 75 && s.avg > 0).length} Siswa
          </div>
          <span className="text-[11px] text-amber-700 font-semibold mt-1 inline-block">
            Rekomendasi pendampingan modul
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
            <Filter className="w-4 h-4 text-emerald-600" />
            <span>Mata Pelajaran:</span>
          </div>
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none"
          >
            <option value="Semua">Semua Mata Pelajaran</option>
            {allSubjects.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Jenis Penilaian:</span>
          </div>
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none"
          >
            <option value="Semua">Semua Jenis</option>
            <option value="Tugas">Tugas</option>
            <option value="Ulangan">Ulangan</option>
            <option value="PTS">PTS</option>
            <option value="PAS">PAS</option>
            <option value="Projek">Projek</option>
            <option value="Praktikum">Praktikum</option>
            <option value="Portofolio">Portofolio</option>
          </select>
        </div>

        <span className="text-xs text-slate-500">
          Menampilkan <strong className="text-slate-800">{filteredGrades.length}</strong> catatan nilai
        </span>
      </div>

      {/* Student Academic Analysis Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          Rekapitulasi Capaian Akademik per Siswa
        </h3>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Nama Siswa</th>
                <th className="p-3 text-center">Rata-rata</th>
                <th className="p-3 text-center">Tren Capaian</th>
                <th className="p-3">Kekuatan Siswa</th>
                <th className="p-3">Area Perlu Perbaikan</th>
                <th className="p-3">Saran Tindak Lanjut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentAnalysis.map(item => (
                <tr key={item.student.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">
                    <div>{item.student.name}</div>
                    <span className="text-[11px] text-slate-400 font-normal">NIS: {item.student.nis}</span>
                  </td>
                  <td className="p-3 text-center font-extrabold text-sm">
                    <span className={`px-2.5 py-1 rounded-full ${
                      item.avg >= 85 ? 'bg-emerald-100 text-emerald-800' :
                      item.avg >= 75 ? 'bg-blue-100 text-blue-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {item.avg > 0 ? item.avg.toFixed(1) : '-'}
                    </span>
                  </td>
                  <td className="p-3 text-center font-bold">
                    {item.trend === 'Meningkat' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <TrendingUp className="w-3.5 h-3.5" /> Naik
                      </span>
                    ) : item.trend === 'Menurun' ? (
                      <span className="inline-flex items-center gap-1 text-rose-600">
                        <TrendingDown className="w-3.5 h-3.5" /> Turun
                      </span>
                    ) : (
                      <span className="text-slate-500">Stabil</span>
                    )}
                  </td>
                  <td className="p-3 text-emerald-800 font-semibold">{item.strength}</td>
                  <td className="p-3 text-amber-800 font-semibold">{item.improvement}</td>
                  <td className="p-3 text-slate-600">
                    {item.avg >= 85
                      ? 'Diberikan projek pengayaan dan persiapan kompetisi LKS'
                      : item.avg >= 75
                      ? 'Pemantauan konsistensi tugas terstruktur mingguan'
                      : 'Bimbingan remedial khusus dan komunikasi dengan orang tua'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Entry Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Input Nilai Hasil Belajar Siswa
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Siswa *</label>
                <select
                  required
                  value={newGrade.studentId || ''}
                  onChange={e => setNewGrade({ ...newGrade, studentId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.nis})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran *</label>
                  <select
                    value={newGrade.subject || 'Pemrograman Web'}
                    onChange={e => setNewGrade({ ...newGrade, subject: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    {allSubjects.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Penilaian *</label>
                  <select
                    value={newGrade.type || 'Tugas'}
                    onChange={e => setNewGrade({ ...newGrade, type: e.target.value as AssessmentType })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Tugas">Tugas</option>
                    <option value="Ulangan">Ulangan</option>
                    <option value="PTS">PTS</option>
                    <option value="PAS">PAS</option>
                    <option value="Projek">Projek</option>
                    <option value="Praktikum">Praktikum</option>
                    <option value="Portofolio">Portofolio</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nilai (0 - 100) *</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={newGrade.score ?? 85}
                    onChange={e => setNewGrade({ ...newGrade, score: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Penilaian</label>
                  <input
                    type="date"
                    value={newGrade.date || ''}
                    onChange={e => setNewGrade({ ...newGrade, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Materi / Topik Pembelajaran</label>
                <input
                  type="text"
                  placeholder="Contoh: REST API Client, Relasi Database, Struktur Aljabar"
                  value={newGrade.topic || ''}
                  onChange={e => setNewGrade({ ...newGrade, topic: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Kualitatif / Feedback</label>
                <input
                  type="text"
                  placeholder="Contoh: Logika algoritma rapi, pengujian fungsi lengkap"
                  value={newGrade.notes || ''}
                  onChange={e => setNewGrade({ ...newGrade, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Nilai</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
