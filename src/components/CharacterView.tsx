import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Plus,
  Star,
  CheckCircle,
  FileText,
  Calendar,
  X,
  Check,
  Award
} from 'lucide-react';
import { Student, CharacterLog, CharacterValueType } from '../types';

interface CharacterViewProps {
  students: Student[];
  characterLogs: CharacterLog[];
  onSaveCharacterLog: (log: CharacterLog) => void;
  onOpenAIWithPrompt: (prompt: string) => void;
}

const CORE_VALUES: { type: CharacterValueType; desc: string; color: string }[] = [
  { type: 'Religius', desc: 'Ketaatan beribadah, toleransi, syukur', color: 'from-emerald-500 to-teal-600' },
  { type: 'Jujur', desc: 'Kejujuran akademis, perkataan sesuai fakta', color: 'from-blue-500 to-indigo-600' },
  { type: 'Disiplin', desc: 'Ketepatan waktu, ketaatan tata tertib', color: 'from-purple-500 to-violet-600' },
  { type: 'Tanggung Jawab', desc: 'Penyelesaian tugas, konsekuensi amanah', color: 'from-amber-500 to-orange-600' },
  { type: 'Kerja Sama', desc: 'Kolaborasi tim, empati antarteman', color: 'from-cyan-500 to-blue-600' },
  { type: 'Kepedulian', desc: 'Peduli lingkungan, solidaritas sosial', color: 'from-rose-500 to-pink-600' },
  { type: 'Kepemimpinan', desc: 'Inisiatif, teladan, membimbing rekan', color: 'from-indigo-600 to-purple-700' },
  { type: 'Percaya Diri', desc: 'Keberanian berpendapat, optimisme', color: 'from-teal-600 to-emerald-700' },
  { type: 'Kemandirian', desc: 'Inisiatif belajar mandiri, pantang menyerah', color: 'from-orange-500 to-amber-600' },
  { type: 'Integritas', desc: 'Konsistensi moral, amanah, keteguhan hati', color: 'from-emerald-600 to-cyan-700' }
];

export const CharacterView: React.FC<CharacterViewProps> = ({
  students,
  characterLogs,
  onSaveCharacterLog,
  onOpenAIWithPrompt
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('Semua');
  const [selectedValueFilter, setSelectedValueFilter] = useState<string>('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLog, setNewLog] = useState<Partial<CharacterLog>>({
    valueType: 'Tanggung Jawab',
    rating: 5,
    context: 'Kegiatan Belajar Mengajar',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const filteredLogs = characterLogs.filter(log => {
    const matchStudent = selectedStudentId === 'Semua' || log.studentId === selectedStudentId;
    const matchValue = selectedValueFilter === 'Semua' || log.valueType === selectedValueFilter;
    return matchStudent && matchValue;
  });

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.studentId || !newLog.notes || !newLog.valueType) return;

    const student = students.find(s => s.id === newLog.studentId);
    if (!student) return;

    const logToSave: CharacterLog = {
      id: `chr_${Date.now()}`,
      classId: student.classId,
      teacherId: student.teacherId,
      studentId: student.id,
      date: newLog.date || new Date().toISOString().split('T')[0],
      valueType: newLog.valueType as CharacterValueType,
      rating: Number(newLog.rating) || 5,
      context: newLog.context || 'KBM Kelas',
      notes: newLog.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveCharacterLog(logToSave);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            Pemantauan 10 Nilai Karakter Bangsa
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Observasi perkembangan kepribadian, integritas, kemandirian, dan profil pelajar dengan bahasa objektif & konstruktif.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onOpenAIWithPrompt(`Tolong buatkan Ringkasan Catatan Karakter Bulanan untuk kelas kami berdasarkan observasi 10 nilai karakter. Sorot perkembangan positif siswa dalam religiusitas, tanggung jawab, dan kerja sama, serta berikan rekomendasi penguatan karakter yang konstruktif.`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs border border-purple-200 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Generate Catatan Bulanan AI</span>
          </button>

          <button
            onClick={() => {
              if (students.length > 0) {
                setNewLog(prev => ({ ...prev, studentId: students[0].id }));
              }
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Observasi Karakter</span>
          </button>
        </div>
      </div>

      {/* 10 Core Values Grid Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {CORE_VALUES.map(val => {
          const logsForValue = characterLogs.filter(c => c.valueType === val.type);
          const avgRating =
            logsForValue.length > 0
              ? logsForValue.reduce((a, b) => a + b.rating, 0) / logsForValue.length
              : 5.0;

          return (
            <div
              key={val.type}
              onClick={() => setSelectedValueFilter(selectedValueFilter === val.type ? 'Semua' : val.type)}
              className={`cursor-pointer p-3.5 rounded-xl border transition-all text-left ${
                selectedValueFilter === val.type
                  ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50/50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-800">{val.type}</span>
                <span className="text-[11px] font-extrabold text-amber-500 flex items-center">
                  ★ {avgRating.toFixed(1)}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">{val.desc}</p>
              <span className="text-[10px] text-slate-400 mt-2 block">
                {logsForValue.length} Observasi
              </span>
            </div>
          );
        })}
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
            <span>Filter Siswa:</span>
          </div>
          <select
            value={selectedStudentId}
            onChange={e => setSelectedStudentId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none"
          >
            <option value="Semua">Semua Siswa</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
            <span>Nilai Karakter:</span>
          </div>
          <select
            value={selectedValueFilter}
            onChange={e => setSelectedValueFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none"
          >
            <option value="Semua">Semua 10 Karakter</option>
            {CORE_VALUES.map(v => (
              <option key={v.type} value={v.type}>{v.type}</option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-500">
          Ditemukan <strong className="text-slate-800">{filteredLogs.length}</strong> catatan observasi
        </span>
      </div>

      {/* Logs Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLogs.map(log => {
          const student = students.find(s => s.id === log.studentId);
          return (
            <div
              key={log.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-bold text-sm flex items-center justify-center">
                    {student ? student.name[0] : 'S'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {student ? student.name : 'Siswa'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {log.context || 'Aktivitas Kelas'} • {log.date}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    {log.valueType}
                  </span>
                  <div className="text-amber-500 font-bold text-xs mt-1">
                    {'★'.repeat(log.rating)}{'☆'.repeat(5 - log.rating)}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                "{log.notes}"
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Evaluasi objektif & konstruktif</span>
                <button
                  onClick={() => onOpenAIWithPrompt(`Tolong buatkan draf pesan apresiasi santun untuk orang tua ananda ${student?.name || 'siswa'} atas perkembangan karakter ${log.valueType} (rating: ${log.rating}/5): "${log.notes}".`)}
                  className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
                >
                  Kirim Apresiasi ke Ortu
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Observation Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Catat Observasi Karakter Siswa
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Siswa *</label>
                <select
                  required
                  value={newLog.studentId || ''}
                  onChange={e => setNewLog({ ...newLog, studentId: e.target.value })}
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
                  <label className="block font-bold text-slate-700 mb-1">Nilai Karakter *</label>
                  <select
                    value={newLog.valueType || 'Tanggung Jawab'}
                    onChange={e => setNewLog({ ...newLog, valueType: e.target.value as CharacterValueType })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    {CORE_VALUES.map(v => (
                      <option key={v.type} value={v.type}>{v.type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Skala Penilaian (1 - 5) *</label>
                  <select
                    value={newLog.rating || 5}
                    onChange={e => setNewLog({ ...newLog, rating: parseInt(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold focus:border-emerald-500 focus:outline-none"
                  >
                    <option value={5}>★★★★★ (5 - Sangat Menonjol/Teladan)</option>
                    <option value={4}>★★★★☆ (4 - Membudaya dengan Baik)</option>
                    <option value={3}>★★★☆☆ (3 - Cukup/Mulai Berkembang)</option>
                    <option value={2}>★★☆☆☆ (2 - Perlu Bimbingan)</option>
                    <option value={1}>★☆☆☆☆ (1 - Perlu Perhatian Khusus)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Observasi</label>
                  <input
                    type="date"
                    value={newLog.date || ''}
                    onChange={e => setNewLog({ ...newLog, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Konteks Kegiatan</label>
                  <input
                    type="text"
                    placeholder="KBM, Praktikum, Upacara, Ekskul"
                    value={newLog.context || ''}
                    onChange={e => setNewLog({ ...newLog, context: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Observasi (Bahasa Konstruktif & Objektif) *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Contoh: Siswa berinisiatif membantu rekan sekelompok merapikan peralatan lab, menunjukkan kerja sama dan tanggung jawab tinggi."
                  value={newLog.notes || ''}
                  onChange={e => setNewLog({ ...newLog, notes: e.target.value })}
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
                  <span>Simpan Catatan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
