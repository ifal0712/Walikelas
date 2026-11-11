import React, { useState } from 'react';
import {
  Award,
  Trophy,
  Medal,
  Plus,
  Sparkles,
  Printer,
  Calendar,
  X,
  Check,
  Search,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Student,
  AchievementRecord,
  AchievementCategory,
  AchievementLevel
} from '../types';

interface AchievementsViewProps {
  students: Student[];
  achievements: AchievementRecord[];
  onSaveAchievement: (ach: AchievementRecord) => void;
  onDeleteAchievement: (id: string) => void;
  onOpenAIWithPrompt: (prompt: string) => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  students,
  achievements,
  onSaveAchievement,
  onDeleteAchievement,
  onOpenAIWithPrompt
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAch, setNewAch] = useState<Partial<AchievementRecord>>({
    category: 'Akademik',
    title: '',
    rank: 'Juara 1',
    level: 'Kabupaten/Kota',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const filteredAchievements = achievements.filter(a => {
    return selectedCategory === 'Semua' || a.category === selectedCategory;
  });

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAch.studentId || !newAch.title || !newAch.rank) return;

    const student = students.find(s => s.id === newAch.studentId);
    if (!student) return;

    const achToSave: AchievementRecord = {
      id: `ach_${Date.now()}`,
      classId: student.classId,
      teacherId: student.teacherId,
      studentId: student.id,
      date: newAch.date || new Date().toISOString().split('T')[0],
      category: (newAch.category as AchievementCategory) || 'Akademik',
      title: newAch.title,
      rank: newAch.rank,
      level: (newAch.level as AchievementLevel) || 'Kabupaten/Kota',
      notes: newAch.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveAchievement(achToSave);
    setIsAddModalOpen(false);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  const handlePrintPortfolio = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Portofolio Prestasi & Rekam Jejak Juara Siswa
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dokumentasi prestasi akademik, non-akademik, olahraga, seni, keagamaan, dan kepengurusan organisasi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handlePrintPortfolio}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak Portofolio</span>
          </button>

          <button
            onClick={() => {
              if (students.length > 0) {
                setNewAch(prev => ({ ...prev, studentId: students[0].id }));
              }
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Prestasi</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {(['Semua', 'Akademik', 'Non Akademik', 'Olahraga', 'Seni', 'Keagamaan', 'Organisasi'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-amber-500 text-white border-amber-500 font-bold shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map(ach => {
          const student = students.find(s => s.id === ach.studentId);
          return (
            <div
              key={ach.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-amber-300 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
                    <Medal className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    Tingkat {ach.level}
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wide text-amber-600">
                    {ach.category} • {ach.rank}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5 line-clamp-2">
                    {ach.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Diraih oleh: <strong className="text-slate-800">{student?.name || 'Siswa'}</strong>
                  </p>
                </div>

                {ach.notes && (
                  <div className="mt-3 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-600">
                    "{ach.notes}"
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>{ach.date}</span>
                <button
                  onClick={() => onOpenAIWithPrompt(`Tolong buatkan draf pesan apresiasi resmi dan hangat dari wali kelas kepada orang tua ananda ${student?.name} atas raihan membanggakan: ${ach.rank} dalam ${ach.title} tingkat ${ach.level}.`)}
                  className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
                >
                  Kirim Apresiasi Ortu
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Tambah Prestasi Siswa
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Siswa Berprestasi *</label>
                <select
                  required
                  value={newAch.studentId || ''}
                  onChange={e => setNewAch({ ...newAch, studentId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none"
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
                  <label className="block font-bold text-slate-700 mb-1">Kategori Prestasi *</label>
                  <select
                    value={newAch.category || 'Akademik'}
                    onChange={e => setNewAch({ ...newAch, category: e.target.value as AchievementCategory })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Non Akademik">Non Akademik</option>
                    <option value="Olahraga">Olahraga</option>
                    <option value="Seni">Seni</option>
                    <option value="Keagamaan">Keagamaan</option>
                    <option value="Organisasi">Organisasi</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Peringkat / Capaian *</label>
                  <input
                    type="text"
                    required
                    placeholder="Juara 1 / Medali Emas / Finalis"
                    value={newAch.rank || ''}
                    onChange={e => setNewAch({ ...newAch, rank: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Kejuaraan / Kegiatan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: LKS Web Technologies, Turnamen Futsal Pelajar, MTQ Pelajar"
                  value={newAch.title || ''}
                  onChange={e => setNewAch({ ...newAch, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tingkat Penyelenggaraan *</label>
                  <select
                    value={newAch.level || 'Kabupaten/Kota'}
                    onChange={e => setNewAch({ ...newAch, level: e.target.value as AchievementLevel })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Sekolah">Sekolah</option>
                    <option value="Kecamatan">Kecamatan</option>
                    <option value="Kabupaten/Kota">Kabupaten/Kota</option>
                    <option value="Provinsi">Provinsi</option>
                    <option value="Nasional">Nasional</option>
                    <option value="Internasional">Internasional</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={newAch.date || ''}
                    onChange={e => setNewAch({ ...newAch, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Tambahan</label>
                <textarea
                  rows={2}
                  placeholder="Keterangan pembina, nomor piagam, atau kelanjutan lomba ke tingkat lebih tinggi."
                  value={newAch.notes || ''}
                  onChange={e => setNewAch({ ...newAch, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none"
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Prestasi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
