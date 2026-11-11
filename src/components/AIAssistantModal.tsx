import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Copy,
  CheckCircle,
  FileText,
  UserCheck,
  ShieldAlert,
  GraduationCap,
  HeartHandshake,
  MessageSquare,
  Bot
} from 'lucide-react';
import { askGemini, parseAIStructuredOutput } from '../services/gemini';
import { AIAnalysisResult } from '../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  contextDataSummary?: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  initialPrompt,
  contextDataSummary
}) => {
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [role, setRole] = useState<'Sekretaris' | 'Analis Akademik' | 'Analis Karakter' | 'Konseling Dasar' | 'Penghubung Ortu' | 'Penyusun Laporan'>('Sekretaris');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  React.useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
      handleExecute(initialPrompt);
    }
  }, [initialPrompt]);

  if (!isOpen) return null;

  const handleExecute = async (promptText?: string) => {
    const textToSend = promptText || prompt;
    if (!textToSend.trim()) return;

    setIsLoading(true);
    try {
      const fullPrompt = `
Peran Anda saat ini: ${role} Wali Kelas Sekolah Indonesia.
${contextDataSummary ? `Konteks Kelas Saat Ini:\n${contextDataSummary}\n` : ''}
Permintaan Wali Kelas:
${textToSend}
      `.trim();

      const raw = await askGemini(fullPrompt);
      const parsed = parseAIStructuredOutput(raw);
      setResult(parsed);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyOnlyDraft = () => {
    if (!result?.communicationDraft) return;
    navigator.clipboard.writeText(result.communicationDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2500);
  };

  const copyWholeResponse = () => {
    if (!result?.rawText) return;
    navigator.clipboard.writeText(result.rawText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Asisten Manajemen Wali Kelas Cerdas
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  Kemendikbud AI Core
                </span>
              </div>
              <p className="text-xs text-emerald-100/80">
                Pusat analisis temuan, rekomendasi solutif, tindak lanjut, dan draf komunikasi resmi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="px-5 py-2.5 border-b border-slate-100 bg-slate-50 flex items-center gap-2 overflow-x-auto text-xs font-bold">
          <span className="text-slate-500 shrink-0">Mode Peran:</span>
          {[
            { id: 'Sekretaris', label: 'Sekretaris Kelas', icon: Bot },
            { id: 'Analis Akademik', label: 'Analis Akademik', icon: GraduationCap },
            { id: 'Analis Karakter', label: 'Analis Karakter', icon: Sparkles },
            { id: 'Konseling Dasar', label: 'Asisten Konseling BK', icon: HeartHandshake },
            { id: 'Penghubung Ortu', label: 'Penghubung Orang Tua', icon: MessageSquare },
            { id: 'Penyusun Laporan', label: 'Penyusun Laporan', icon: FileText }
          ].map(r => {
            const Icon = r.icon;
            return (
              <button
                key={r.id}
                onClick={() => setRole(r.id as any)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  role === r.id
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Quick Preset Prompts */}
          <div className="space-y-2">
            <span className="text-slate-500 font-bold block">Pilihan Permintaan Cepat:</span>
            <div className="flex flex-wrap gap-2">
              {[
                'Analisis komprehensif siswa berisiko kehadiran (<90%) dan solusinya',
                'Buatkan pesan apresiasi prestasi & kedisiplinan siswa ke orang tua',
                'Draf surat rujukan konseling BK untuk siswa yang terindikasi demotivasi',
                'Analisis hasil belajar PTS dan strategi remedial pembelajaran berdiferensiasi',
                'Susun surat undangan resmi pertemuan paguyuban orang tua murid'
              ].map((pill, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPrompt(pill);
                    handleExecute(pill);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 font-medium text-left transition-colors"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input Box */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleExecute()}
              placeholder="Tulis instruksi atau pertanyaan untuk Asisten Wali Kelas..."
              className="flex-1 p-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:outline-none text-xs text-slate-800 bg-slate-50/50 focus:bg-white"
            />
            <button
              onClick={() => handleExecute()}
              disabled={isLoading || !prompt.trim()}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold inline-flex items-center gap-2 shadow-xs transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Kirim</span>
            </button>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="py-12 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-slate-600 font-bold">
                Asisten AI sedang menganalisis data dan menyusun rekomendasi objektif...
              </p>
            </div>
          )}

          {/* Structured Output Cards */}
          {result && !isLoading && (
            <div className="space-y-4 pt-2">
              
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Hasil Telaah & Rekomendasi Terstruktur
                </span>
                <button
                  onClick={copyWholeResponse}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  {copiedAll ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? 'Tersalin' : 'Salin Semua'}</span>
                </button>
              </div>

              {/* 1. Ringkasan Temuan */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  1. Ringkasan Temuan
                </h4>
                <p className="text-slate-700 leading-relaxed pl-4 whitespace-pre-wrap">
                  {result.findingsSummary}
                </p>
              </div>

              {/* 2. Analisis */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  2. Analisis Mendalam
                </h4>
                <p className="text-slate-700 leading-relaxed pl-4 whitespace-pre-wrap">
                  {result.analysis}
                </p>
              </div>

              {/* 3. Rekomendasi */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-1.5">
                <h4 className="font-bold text-emerald-900 text-xs uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  3. Rekomendasi Solutif & Edukatif
                </h4>
                <p className="text-emerald-950 leading-relaxed pl-4 whitespace-pre-wrap">
                  {result.recommendations}
                </p>
              </div>

              {/* 4. Tindak Lanjut */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  4. Tindak Lanjut Wali Kelas & Koordinasi
                </h4>
                <p className="text-slate-700 leading-relaxed pl-4 whitespace-pre-wrap">
                  {result.followUp}
                </p>
              </div>

              {/* 5. Draf Komunikasi */}
              {result.communicationDraft && (
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-indigo-950 text-xs uppercase tracking-wide flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      5. Draf Komunikasi Resmi (WhatsApp / Surat)
                    </h4>
                    <button
                      onClick={copyOnlyDraft}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-indigo-200 hover:bg-indigo-100 text-indigo-800 font-bold"
                    >
                      {copiedDraft ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedDraft ? 'Draf Tersalin!' : 'Salin Draf'}</span>
                    </button>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-indigo-100 text-slate-800 font-sans whitespace-pre-wrap leading-relaxed">
                    {result.communicationDraft}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Standar: Ringkasan Temuan • Analisis • Rekomendasi • Tindak Lanjut • Draf Komunikasi
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
