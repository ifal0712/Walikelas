import React, { useState } from 'react';
import {
  MessageSquare,
  Phone,
  Send,
  Sparkles,
  FileText,
  UserCheck,
  CheckCircle,
  Copy,
  Printer,
  Plus,
  X,
  Check,
  Share2
} from 'lucide-react';
import {
  Student,
  CommunicationLog,
  CommChannel,
  CommRecipient,
  CommCategory,
  CommStatus
} from '../types';
import { generateParentMessageAI } from '../services/gemini';

interface CommunicationViewProps {
  students: Student[];
  communications: CommunicationLog[];
  onSaveCommunication: (comm: CommunicationLog) => void;
  onOpenAIWithPrompt: (prompt: string) => void;
}

export const CommunicationView: React.FC<CommunicationViewProps> = ({
  students,
  communications,
  onSaveCommunication,
  onOpenAIWithPrompt
}) => {
  const [recipientFilter, setRecipientFilter] = useState<string>('Semua');
  const [categoryFilter, setCategoryFilter] = useState<string>('Semua');
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form Generator State
  const [genStudentId, setGenStudentId] = useState<string>(students[0]?.id || '');
  const [genCategory, setGenCategory] = useState<CommCategory>('Apresiasi');
  const [genChannel, setGenChannel] = useState<CommChannel>('WhatsApp');
  const [genRecipient, setGenRecipient] = useState<CommRecipient>('Orang Tua');
  const [genContext, setGenContext] = useState<string>('Perkembangan kedisiplinan dan tanggung jawab meningkat pesat bulan ini');
  const [generatedDraft, setGeneratedDraft] = useState<string>('');

  const selectedStudent = students.find(s => s.id === genStudentId);

  const handleGenerateDraft = async () => {
    if (!selectedStudent) return;
    setIsGenerating(true);
    try {
      const draft = await generateParentMessageAI(selectedStudent, genCategory, genChannel, genContext);
      setGeneratedDraft(draft);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyDraft = () => {
    if (!generatedDraft) return;
    navigator.clipboard.writeText(generatedDraft);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSaveToLog = (status: CommStatus = 'Terkirim') => {
    if (!selectedStudent || !generatedDraft) return;

    const newLog: CommunicationLog = {
      id: `com_${Date.now()}`,
      classId: selectedStudent.classId,
      teacherId: selectedStudent.teacherId,
      studentId: selectedStudent.id,
      date: new Date().toISOString().split('T')[0],
      channel: genChannel,
      recipient: genRecipient,
      category: genCategory,
      subject: `${genCategory} - ${selectedStudent.name}`,
      content: generatedDraft,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveCommunication(newLog);
    alert('Komunikasi berhasil dicatat ke dalam log arsip!');
  };

  const filteredLogs = communications.filter(c => {
    const matchRecipient = recipientFilter === 'Semua' || c.recipient === recipientFilter;
    const matchCategory = categoryFilter === 'Semua' || c.category === categoryFilter;
    return matchRecipient && matchCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            Pusat Komunikasi Orang Tua & Stakeholder Sekolah
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Draf pesan WhatsApp apresiasi, peringatan santun-solutif, undangan resmi pertemuan, dan koordinasi BK/Guru Mapel.
          </p>
        </div>

        <button
          onClick={() => {
            if (!generatedDraft && selectedStudent) {
              handleGenerateDraft();
            }
            setIsGeneratorOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-xs transition-colors"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Buat Pesan / Undangan Cerdas</span>
        </button>
      </div>

      {/* QUICK TEMPLATE GENERATOR MODAL / DRAWER */}
      {isGeneratorOpen && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5 sm:p-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                AI Generator Komunikasi Wali Kelas
              </h3>
            </div>
            <button
              onClick={() => setIsGeneratorOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Config Controls */}
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Siswa Sasaran *</label>
                <select
                  value={genStudentId}
                  onChange={e => setGenStudentId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Ortu: {s.parentName || '-'}, Telp: {s.parentPhone || '-'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Penerima Pesan</label>
                  <select
                    value={genRecipient}
                    onChange={e => setGenRecipient(e.target.value as CommRecipient)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Orang Tua">Orang Tua / Wali</option>
                    <option value="Guru BK">Guru BK (Rujukan)</option>
                    <option value="Guru Mapel">Guru Mata Pelajaran</option>
                    <option value="Kesiswaan">Kesiswaan</option>
                    <option value="Kepala Sekolah">Kepala Sekolah</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori Pesan</label>
                  <select
                    value={genCategory}
                    onChange={e => setGenCategory(e.target.value as CommCategory)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Apresiasi">Pesan Apresiasi (Positif)</option>
                    <option value="Informasi">Laporan Informasi Berkala</option>
                    <option value="Peringatan">Pesan Peringatan (Santun-Solutif)</option>
                    <option value="Undangan">Undangan Pertemuan Resmi</option>
                    <option value="Rujukan BK">Rujukan Konseling BK</option>
                    <option value="Koordinasi Mapel">Koordinasi Catatan Guru Mapel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Saluran Komunikasi</label>
                  <select
                    value={genChannel}
                    onChange={e => setGenChannel(e.target.value as CommChannel)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="WhatsApp">WhatsApp (Teks Instan)</option>
                    <option value="Surat Resmi">Surat Resmi Dicetak</option>
                    <option value="Pertemuan Langsung">Pertemuan Langsung</option>
                    <option value="Telepon">Panggilan Telepon</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kontak Tujuan</label>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800 truncate">
                    {selectedStudent?.parentPhone || 'Belum ada nomor'}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Konteks Tambahan</label>
                <textarea
                  rows={3}
                  value={genContext}
                  onChange={e => setGenContext(e.target.value)}
                  placeholder="Misal: Ananda menunjukkan peningkatan kedisiplinan, atau ananda belum mengumpulkan tugas matematika..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerateDraft}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isGenerating ? 'Menyusun Pesan Santun & Solutif...' : 'Generate Draf dengan AI'}</span>
              </button>
            </div>

            {/* Right Result Preview */}
            <div className="flex flex-col justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-800">Pratinjau Draf Komunikasi:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCopyDraft}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[11px]"
                    >
                      {isCopied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Tersalin' : 'Salin Teks'}</span>
                    </button>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed max-h-72 overflow-y-auto">
                  {generatedDraft || 'Klik tombol "Generate Draf dengan AI" untuk menyusun pesan otomatis yang santun dan objektif.'}
                </div>
              </div>

              {/* Action Buttons: WhatsApp Direct, Save to Log */}
              <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                {selectedStudent?.parentPhone && (
                  <a
                    href={`https://wa.me/${selectedStudent.parentPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(generatedDraft)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleSaveToLog('Terkirim')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim via WhatsApp Web</span>
                  </a>
                )}

                <button
                  onClick={() => handleSaveToLog('Draf')}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold transition-colors"
                >
                  Simpan ke Log Arsip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
            <span>Penerima:</span>
          </div>
          <select
            value={recipientFilter}
            onChange={e => setRecipientFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none"
          >
            <option value="Semua">Semua Penerima</option>
            <option value="Orang Tua">Orang Tua / Wali</option>
            <option value="Guru BK">Guru BK</option>
            <option value="Guru Mapel">Guru Mapel</option>
            <option value="Kesiswaan">Kesiswaan</option>
            <option value="Kepala Sekolah">Kepala Sekolah</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
            <span>Kategori:</span>
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Apresiasi">Apresiasi</option>
            <option value="Informasi">Informasi</option>
            <option value="Peringatan">Peringatan</option>
            <option value="Undangan">Undangan Pertemuan</option>
            <option value="Rujukan BK">Rujukan BK</option>
          </select>
        </div>

        <span className="text-xs text-slate-500">
          Total arsip: <strong className="text-slate-800">{filteredLogs.length}</strong> percakapan
        </span>
      </div>

      {/* Communications Log List */}
      <div className="space-y-3">
        {filteredLogs.map(log => {
          const student = students.find(s => s.id === log.studentId);
          return (
            <div
              key={log.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        {log.subject || `${log.category} Siswa`}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {log.recipient} • {log.channel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Terkait siswa: <strong className="text-slate-800">{student?.name || 'Siswa'}</strong> • Tanggal: {log.date}
                    </p>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  log.status === 'Terkirim' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {log.status}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                {log.content}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Arsip resmi wali kelas</span>
                {student?.parentPhone && (
                  <a
                    href={`https://wa.me/${student.parentPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(log.content)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
                  >
                    Buka di WhatsApp
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
