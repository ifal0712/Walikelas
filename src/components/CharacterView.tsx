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

const CORE_VALUES: { type: CharacterValueType; desc: string; color: string; badgeColor: string }[] = [
  { type: 'Beriman & Berakhlak Mulia', desc: 'Integritas moral, etika ibadah, keteladanan budi pekerti', color: 'from-emerald-500 to-teal-600', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { type: 'Berkebinekaan Global', desc: 'Toleransi kebhinekaan, wawasan terbuka & adaptasi budaya', color: 'from-blue-500 to-indigo-600', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
  { type: 'Bergotong Royong', desc: 'Kolaborasi tim proyek, kepedulian sosial & sinergi kerja', color: 'from-cyan-500 to-blue-600', badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { type: 'Mandiri', desc: 'Inisiatif belajar mandiri, tangguh & bertanggung jawab', color: 'from-amber-500 to-orange-600', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
  { type: 'Bernalar Kritis', desc: 'Problem solving analitis, verifikasi data & evaluasi logis', color: 'from-purple-500 to-violet-600', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' },
  { type: 'Kreatif & Inovatif', desc: 'Gagasan orisinal, kreasi karya kejuruan & adaptasi solusi', color: 'from-rose-500 to-pink-600', badgeColor: 'bg-rose-50 text-rose-700 border-rose-200' },
  { type: 'Disiplin & Etos Kerja', desc: 'Kepatuhan K3/SOP industri, ketepatan waktu & presisi mutu', color: 'from-indigo-600 to-purple-700', badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { type: 'Kewirausahaan & Kepemimpinan', desc: 'Jiwa entrepreneurship, inisiatif memimpin & orientasi pasar', color: 'from-teal-600 to-emerald-700', badgeColor: 'bg-teal-50 text-teal-700 border-teal-200' }
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
    valueType: 'Beriman & Berakhlak Mulia',
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
            <Sparkles className="w-5 h-5 text-purple-600" />
            Pemantauan 8 Dimensi Profil Lulusan SMK
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Observasi perkembangan 8 dimensi Profil Lulusan Kurikulum Merdeka Kejuruan SMKN 1 Sidayu (Skala 1.0 s/d 5.0).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onOpenAIWithPrompt(`Tolong buatkan Ringkasan Evaluasi 8 Dimensi Profil Lulusan SMK untuk kelas XI RPL 1 berdasarkan catatan observasi karakter. Sorot capaian dimensi seperti Disiplin & Etos Kerja, Bergotong Royong, dan Mandiri, serta berikan rekomendasi penguatan karakter terapan untuk persiapan magang industri (PKL).`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs border border-purple-200 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Generate Evaluasi AI</span>
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
            <span>Catat Observasi Dimensi</span>
          </button>
        </div>
      </div>

      {/* Diagram 8 Dimensi Profil Lulusan SMK (Interactive Cards & Progress) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              Diagram Distribusi &amp; Indeks 8 Dimensi Profil Lulusan
            </h3>
            <p className="text-[11px] text-slate-500">
              Klik salah satu dimensi untuk memfilter catatan observasi siswa di bawah.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedValueFilter !== 'Semua' && (
              <button
                onClick={() => setSelectedValueFilter('Semua')}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg transition-colors"
              >
                Reset Filter ({selectedValueFilter})
              </button>
            )}
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Target Industri: 4.5+
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CORE_VALUES.map((val, idx) => {
            const logsForValue = characterLogs.filter(c => c.valueType === val.type);
            const avgRating =
              logsForValue.length > 0
                ? logsForValue.reduce((a, b) => a + b.rating, 0) / logsForValue.length
                : 4.6;
            const isSelected = selectedValueFilter === val.type;

            return (
              <div
                key={val.type}
                onClick={() => setSelectedValueFilter(isSelected ? 'Semua' : val.type)}
                className={`cursor-pointer p-3.5 rounded-xl border transition-all text-left space-y-2 ${
                  isSelected
                    ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50/60 shadow-xs'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900 leading-tight">{val.type}</span>
                  </div>
                  <span className="text-[11px] font-black text-amber-500 shrink-0">
                    ★ {avgRating.toFixed(1)}
                  </span>
                </div>
                
                <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{val.desc}</p>
                
                <div className="space-y-1 pt-1">
                  <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${val.color} rounded-full transition-all`}
                      style={{ width: `${(avgRating / 5) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-slate-400 font-medium">
                    <span>{logsForValue.length} Observasi</span>
                    <span>{((avgRating / 5) * 100).toFixed(0)}% Capaian</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
            <span>Dimensi Profil:</span>
          </div>
          <select
            value={selectedValueFilter}
            onChange={e => setSelectedValueFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none"
          >
            <option value="Semua">Semua 8 Dimensi</option>
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
