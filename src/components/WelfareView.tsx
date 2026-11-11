import React, { useState } from 'react';
import {
  HeartHandshake,
  AlertOctagon,
  ShieldAlert,
  UserCheck,
  Plus,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  Check,
  PhoneCall
} from 'lucide-react';
import {
  Student,
  WelfareCase,
  WelfareTrigger,
  WelfareSeverity,
  WelfareAction,
  WelfareStatus
} from '../types';

interface WelfareViewProps {
  students: Student[];
  welfareCases: WelfareCase[];
  onSaveWelfareCase: (wCase: WelfareCase) => void;
  onOpenAIWithPrompt: (prompt: string) => void;
}

export const WelfareView: React.FC<WelfareViewProps> = ({
  students,
  welfareCases,
  onSaveWelfareCase,
  onOpenAIWithPrompt
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string>('Semua');
  const [newCase, setNewCase] = useState<Partial<WelfareCase>>({
    triggerCategory: 'Penurunan Motivasi',
    severity: 'Perlu Perhatian',
    indications: '',
    actionRecommendation: 'Rujukan Guru BK',
    status: 'Aktif',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const filteredCases = welfareCases.filter(c => {
    return filterSeverity === 'Semua' || c.severity === filterSeverity;
  });

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCase.studentId || !newCase.indications) return;

    const student = students.find(s => s.id === newCase.studentId);
    if (!student) return;

    const caseToSave: WelfareCase = {
      id: `wel_${Date.now()}`,
      classId: student.classId,
      teacherId: student.teacherId,
      studentId: student.id,
      date: newCase.date || new Date().toISOString().split('T')[0],
      triggerCategory: (newCase.triggerCategory as WelfareTrigger) || 'Penurunan Motivasi',
      severity: (newCase.severity as WelfareSeverity) || 'Perlu Perhatian',
      indications: newCase.indications,
      actionRecommendation: (newCase.actionRecommendation as WelfareAction) || 'Konsultasi Wali Kelas',
      status: (newCase.status as WelfareStatus) || 'Aktif',
      notes: newCase.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveWelfareCase(caseToSave);
    setIsAddModalOpen(false);
  };

  const handleUpdateStatus = (wCase: WelfareCase, newStatus: WelfareStatus) => {
    onSaveWelfareCase({
      ...wCase,
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-teal-600" />
            Monitoring Kesejahteraan & Deteksi Dini Siswa (Early Warning)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pendampingan humanis untuk deteksi penurunan motivasi, kesulitan belajar, konflik sosial, perundungan, dan masalah emosional.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onOpenAIWithPrompt(`Tolong lakukan telaah konseling dasar untuk kasus kesejahteraan siswa kelas kami: ${welfareCases.map(c => `[Siswa: ${students.find(s => s.id === c.studentId)?.name || 'Siswa'}] Kategori: ${c.triggerCategory}, Tingkat: ${c.severity}, Gejala: ${c.indications}`).join('; ')}. Berikan rekomendasi langkah penanganan terpadu untuk Wali Kelas, Guru BK, Orang Tua, dan Kesiswaan.`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 font-bold text-xs border border-teal-200 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Asisten Konseling Dasar AI</span>
          </button>

          <button
            onClick={() => {
              if (students.length > 0) {
                setNewCase(prev => ({ ...prev, studentId: students[0].id }));
              }
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Kasus Pemantauan</span>
          </button>
        </div>
      </div>

      {/* 5 Indicator Triggers Info */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {[
          { title: 'Penurunan Motivasi', desc: 'Sering lesu, tugas tertunda, tidak fokus', color: 'border-amber-200 bg-amber-50/50' },
          { title: 'Kesulitan Belajar', desc: 'Pemahaman konsep terhambat, butuh remedial', color: 'border-blue-200 bg-blue-50/50' },
          { title: 'Konflik Sosial', desc: 'Perselisihan antarteman, mengisolasi diri', color: 'border-purple-200 bg-purple-50/50' },
          { title: 'Perundungan (Bullying)', desc: 'Cemoohan verbal, intimidasi fisik/digital', color: 'border-rose-300 bg-rose-50/70' },
          { title: 'Masalah Emosional', desc: 'Kecemasan tinggi, murung berkepanjangan', color: 'border-teal-200 bg-teal-50/50' }
        ].map(item => (
          <div key={item.title} className={`p-3.5 rounded-xl border ${item.color} text-xs`}>
            <span className="font-bold text-slate-900 block mb-1">{item.title}</span>
            <p className="text-slate-600 leading-tight">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Case List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-teal-600" />
            Daftar Kasus Kesejahteraan Siswa dalam Pemantauan
          </h3>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500">Filter Tingkat:</span>
            <select
              value={filterSeverity}
              onChange={e => setFilterSeverity(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 font-bold text-slate-800 bg-slate-50 focus:outline-none"
            >
              <option value="Semua">Semua Tingkat</option>
              <option value="Waspada">Waspada</option>
              <option value="Perlu Perhatian">Perlu Perhatian</option>
              <option value="Kritis">Kritis</option>
            </select>
          </div>
        </div>

        {filteredCases.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800">Kondisi Siswa Aman & Sejahtera</h4>
            <p className="mt-1">Tidak ada kasus aktif pemantauan emosional atau kesejahteraan.</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredCases.map(c => {
              const student = students.find(s => s.id === c.studentId);
              const isCritical = c.severity === 'Kritis';

              return (
                <div
                  key={c.id}
                  className={`p-4 rounded-xl border transition-all space-y-3 ${
                    isCritical
                      ? 'bg-rose-50/50 border-rose-200'
                      : c.severity === 'Perlu Perhatian'
                      ? 'bg-amber-50/40 border-amber-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        isCritical ? 'bg-rose-200 text-rose-800' : 'bg-teal-100 text-teal-800'
                      }`}>
                        {student ? student.name[0] : 'S'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            {student ? student.name : 'Siswa'}
                          </h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isCritical ? 'bg-rose-600 text-white' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {c.severity}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                            {c.triggerCategory}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Dicatat: {c.date} • Kontak Ortu: {student?.parentPhone || '-'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <select
                        value={c.status}
                        onChange={e => handleUpdateStatus(c, e.target.value as WelfareStatus)}
                        className="text-xs font-bold px-2 py-1 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Dalam Pemantauan">Dalam Pemantauan</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-xs space-y-1.5 bg-white p-3 rounded-xl border border-slate-200/80">
                    <div>
                      <strong className="text-slate-800">Gejala / Indikasi Teramati: </strong>
                      <span className="text-slate-700">{c.indications}</span>
                    </div>
                    <div className="pt-1">
                      <strong className="text-emerald-700">Rekomendasi Alur Tindakan: </strong>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {c.actionRecommendation}
                      </span>
                    </div>
                    {c.notes && (
                      <div className="pt-1 text-slate-500">
                        <strong>Catatan Konseling: </strong>{c.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-400">
                      Koordinasi: {c.actionRecommendation}
                    </span>
                    <button
                      onClick={() => onOpenAIWithPrompt(`Tolong susun draf rujukan resmi konseling untuk ananda ${student?.name} kepada Guru BK sekolah. Gejala: ${c.indications}. Kategori: ${c.triggerCategory}. Rekomendasi: ${c.actionRecommendation}. Sertakan riwayat observasi objektif dan poin-poin yang perlu digali dalam sesi bimbingan konseling.`)}
                      className="text-teal-700 hover:text-teal-800 font-bold hover:underline"
                    >
                      Draf Surat Rujukan BK via AI
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
                Catat Indikasi Pemantauan Kesejahteraan Siswa
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
                  value={newCase.studentId || ''}
                  onChange={e => setNewCase({ ...newCase, studentId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none"
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
                  <label className="block font-bold text-slate-700 mb-1">Indikasi Masalah *</label>
                  <select
                    value={newCase.triggerCategory || 'Penurunan Motivasi'}
                    onChange={e => setNewCase({ ...newCase, triggerCategory: e.target.value as WelfareTrigger })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Penurunan Motivasi">Penurunan Motivasi</option>
                    <option value="Kesulitan Belajar">Kesulitan Belajar</option>
                    <option value="Konflik Sosial">Konflik Sosial</option>
                    <option value="Perundungan">Perundungan (Bullying)</option>
                    <option value="Masalah Emosional">Masalah Emosional</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tingkat Urgensi *</label>
                  <select
                    value={newCase.severity || 'Perlu Perhatian'}
                    onChange={e => setNewCase({ ...newCase, severity: e.target.value as WelfareSeverity })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Waspada">Waspada (Tahap Awal)</option>
                    <option value="Perlu Perhatian">Perlu Perhatian (Sedang)</option>
                    <option value="Kritis">Kritis (Mendesak)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rekomendasi Alur Penanganan *</label>
                <select
                  value={newCase.actionRecommendation || 'Rujukan Guru BK'}
                  onChange={e => setNewCase({ ...newCase, actionRecommendation: e.target.value as WelfareAction })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none font-bold"
                >
                  <option value="Konsultasi Wali Kelas">Konsultasi Personal Wali Kelas</option>
                  <option value="Rujukan Guru BK">Rujukan Guru Bimbingan Konseling (BK)</option>
                  <option value="Panggilan Orang Tua">Panggilan Orang Tua Murid</option>
                  <option value="Koordinasi Tim Kesiswaan">Koordinasi Tim Kesiswaan Sekolah</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Gejala yang Teramati / Kronologi Kejadian *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Deskripsikan fakta objektif yang teramati, perubahan sikap, atau laporan dari guru mapel/rekan sekelas..."
                  value={newCase.indications || ''}
                  onChange={e => setNewCase({ ...newCase, indications: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none"
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs"
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
