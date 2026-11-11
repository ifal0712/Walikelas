import React, { useState } from 'react';
import {
  ShieldAlert,
  Award,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Sparkles,
  HeartHandshake,
  X,
  Check,
  Scale
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Student,
  DisciplineLog,
  DisciplineCategory,
  DisciplineLevel,
  DisciplineStatus
} from '../types';

interface DisciplineViewProps {
  students: Student[];
  disciplineLogs: DisciplineLog[];
  onSaveDisciplineLog: (log: DisciplineLog) => void;
  onOpenAIWithPrompt: (prompt: string) => void;
}

export const DisciplineView: React.FC<DisciplineViewProps> = ({
  students,
  disciplineLogs,
  onSaveDisciplineLog,
  onOpenAIWithPrompt
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'Semua' | DisciplineCategory>('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLog, setNewLog] = useState<Partial<DisciplineLog>>({
    category: 'Pembinaan',
    level: 'Ringan',
    description: '',
    followUpAction: '',
    points: 5,
    status: 'Dalam Proses',
    date: new Date().toISOString().split('T')[0]
  });

  const filteredLogs = disciplineLogs.filter(log => {
    return categoryFilter === 'Semua' || log.category === categoryFilter;
  });

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.studentId || !newLog.description) return;

    const student = students.find(s => s.id === newLog.studentId);
    if (!student) return;

    const isAward = newLog.category === 'Penghargaan';

    const logToSave: DisciplineLog = {
      id: `dsc_${Date.now()}`,
      classId: student.classId,
      teacherId: student.teacherId,
      studentId: student.id,
      date: newLog.date || new Date().toISOString().split('T')[0],
      category: (newLog.category as DisciplineCategory) || 'Pembinaan',
      level: (newLog.level as DisciplineLevel) || 'Ringan',
      description: newLog.description,
      followUpAction: newLog.followUpAction || 'Dialog reflektif edukatif dan pemantauan berkala',
      points: Number(newLog.points) || 5,
      status: (newLog.status as DisciplineStatus) || 'Dalam Proses',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveDisciplineLog(logToSave);
    setIsAddModalOpen(false);

    if (isAward) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            Tata Tertib, Pembinaan & Penghargaan Siswa
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pendekatan disiplin positif yang bersifat edukatif, humanis, non-punitif, serta apresiasi keteladanan siswa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onOpenAIWithPrompt(`Tolong berikan rekomendasi tindak lanjut edukatif berbasis restorative justice untuk kasus kedisiplinan di kelas kami, dengan fokus pada pembinaan karakter tanpa hukuman yang mempermalukan siswa.`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs border border-indigo-200 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Rekomendasi Edukatif AI</span>
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
            <span>Catat Perilaku / Penghargaan</span>
          </button>
        </div>
      </div>

      {/* 4 Category Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { cat: 'Pelanggaran', label: 'Pelanggaran', icon: AlertTriangle, color: 'text-rose-600 bg-rose-50 border-rose-200' },
          { cat: 'Teguran', label: 'Teguran Lisan/Tertulis', icon: ShieldAlert, color: 'text-amber-600 bg-amber-50 border-amber-200' },
          { cat: 'Pembinaan', label: 'Pembinaan Edukatif', icon: HeartHandshake, color: 'text-blue-600 bg-blue-50 border-blue-200' },
          { cat: 'Penghargaan', label: 'Penghargaan / Teladan', icon: Award, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' }
        ].map(item => {
          const count = disciplineLogs.filter(d => d.category === item.cat).length;
          const isSelected = categoryFilter === item.cat;
          const Icon = item.icon;

          return (
            <div
              key={item.cat}
              onClick={() => setCategoryFilter(isSelected ? 'Semua' : (item.cat as DisciplineCategory))}
              className={`cursor-pointer p-4 rounded-xl border transition-all text-left ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-200 bg-white shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">{item.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-bold text-slate-900">{count} Kasus</div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {item.cat === 'Penghargaan' ? 'Prestasi karakter' : 'Tingkat Ringan - Berat'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Filter and Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">
            Daftar Catatan Perilaku Siswa
          </h3>
          <span className="text-xs text-slate-500">
            Kategori: <strong className="text-slate-800">{categoryFilter}</strong> ({filteredLogs.length} data)
          </span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            Belum ada catatan pada kategori ini.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map(log => {
              const student = students.find(s => s.id === log.studentId);
              const isAward = log.category === 'Penghargaan';

              return (
                <div
                  key={log.id}
                  className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                    isAward
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : log.level === 'Berat'
                      ? 'bg-rose-50/50 border-rose-200'
                      : 'bg-slate-50/60 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        isAward ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-800'
                      }`}>
                        {student ? student.name[0] : 'S'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            {student ? student.name : 'Siswa'}
                          </h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isAward ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {log.category} • Tingkat {log.level}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Tanggal: {log.date} • Status: <strong className="text-slate-700">{log.status || 'Dalam Proses'}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-xs font-bold ${isAward ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {isAward ? `+${log.points || 10} Poin Apresiasi` : `${log.points || 5} Poin`}
                      </span>
                    </div>
                  </div>

                  {/* Description & Restorative Action */}
                  <div className="text-xs space-y-1 bg-white p-3 rounded-lg border border-slate-200/80">
                    <p className="text-slate-800">
                      <strong>Deskripsi Kejadian / Tindakan: </strong>
                      {log.description}
                    </p>
                    {log.followUpAction && (
                      <p className="text-emerald-800">
                        <strong>Tindak Lanjut Edukatif: </strong>
                        {log.followUpAction}
                      </p>
                    )}
                  </div>

                  {/* Action link */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-400">
                      Prinsip: Restorative Justice & Edukasi Karakter
                    </span>
                    <button
                      onClick={() => onOpenAIWithPrompt(`Tolong susun draf komunikasi tindak lanjut yang santun dan konstruktif untuk orang tua ananda ${student?.name} terkait catatan ${log.category} (${log.level}): "${log.description}". Rekomendasi solusi yang diusulkan: "${log.followUpAction}".`)}
                      className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
                    >
                      Draf Komunikasi Ortu via AI
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Catat Perilaku / Penghargaan Siswa
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
                  <label className="block font-bold text-slate-700 mb-1">Kategori *</label>
                  <select
                    value={newLog.category || 'Pembinaan'}
                    onChange={e => setNewLog({ ...newLog, category: e.target.value as DisciplineCategory })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Pelanggaran">Pelanggaran</option>
                    <option value="Teguran">Teguran</option>
                    <option value="Pembinaan">Pembinaan</option>
                    <option value="Penghargaan">Penghargaan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tingkat *</label>
                  <select
                    value={newLog.level || 'Ringan'}
                    onChange={e => setNewLog({ ...newLog, level: e.target.value as DisciplineLevel })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Ringan">Ringan</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Berat">Berat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={newLog.date || ''}
                    onChange={e => setNewLog({ ...newLog, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Poin Penyesuaian</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newLog.points || 5}
                    onChange={e => setNewLog({ ...newLog, points: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Perilaku / Prestasi *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Contoh: Siswa terlambat masuk jam pertama dikarenakan membantu orang tua, atau siswa berinisiatif merapikan kelas."
                  value={newLog.description || ''}
                  onChange={e => setNewLog({ ...newLog, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rekomendasi Tindak Lanjut Edukatif</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Dialog empatik, pembuatan jadwal harian, atau apresiasi piagam bintang kelas."
                  value={newLog.followUpAction || ''}
                  onChange={e => setNewLog({ ...newLog, followUpAction: e.target.value })}
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
                  <span>Simpan Data</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
