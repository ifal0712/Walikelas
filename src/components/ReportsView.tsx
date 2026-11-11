import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Sparkles,
  Copy,
  CheckCircle,
  Calendar,
  Layers,
  Check,
  Plus
} from 'lucide-react';
import {
  Student,
  Classroom,
  ClassReport,
  ReportPeriodType
} from '../types';
import { generatePeriodicReportAI } from '../services/gemini';

interface ReportsViewProps {
  classroom: Classroom | null;
  students: Student[];
  reports: ClassReport[];
  attendanceCount: number;
  attendanceAvg: number;
  gradeAvg: number;
  achievementsCount: number;
  violationsCount: number;
  welfareCasesCount: number;
  onSaveReport: (report: ClassReport) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  classroom,
  students,
  reports,
  attendanceAvg,
  gradeAvg,
  achievementsCount,
  violationsCount,
  welfareCasesCount,
  onSaveReport
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriodType>('Bulanan');
  const [periodDate, setPeriodDate] = useState<string>('November 2026');
  const [highlights, setHighlights] = useState<string>('Siswa aktif dalam persiapan ujian semester dan lomba kejuruan');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [activeReport, setActiveReport] = useState<ClassReport | null>(reports[0] || null);

  const handleGenerate = async () => {
    if (!classroom) return;
    setIsGenerating(true);

    try {
      const result = await generatePeriodicReportAI(classroom, selectedPeriod, periodDate, {
        studentCount: students.length,
        attendanceAvg,
        gradeAvg,
        achievementsCount,
        violationsCount,
        welfareCasesCount,
        highlights
      });

      const newReport: ClassReport = {
        id: `rep_${Date.now()}`,
        classId: classroom.id,
        teacherId: classroom.teacherId,
        periodType: selectedPeriod,
        periodDate,
        title: `Laporan ${selectedPeriod} Kondisi Kelas ${classroom.name} (${periodDate})`,
        summary: result.findingsSummary,
        achievementsSummary: `${achievementsCount} prestasi tercatat. ${highlights}`,
        challenges: `${violationsCount} catatan kedisiplinan dan ${welfareCasesCount} siswa dalam pemantauan kesejahteraan.`,
        dataAnalysis: result.analysis,
        followUp: result.followUp,
        recommendations: result.recommendations,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      onSaveReport(newReport);
      setActiveReport(newReport);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyReport = () => {
    if (!activeReport) return;
    const text = `
${activeReport.title}
Sekolah: ${classroom?.schoolName || 'SMKN 1 Sidayu'}
Tahun Pelajaran: ${classroom?.academicYear || '2026/2027'} - Semester ${classroom?.semester || 'Ganjil'}

1. RINGKASAN KONDISI KELAS:
${activeReport.summary}

2. PRESTASI SISWA:
${activeReport.achievementsSummary || '-'}

3. KENDALA YANG MUNCUL:
${activeReport.challenges || '-'}

4. ANALISIS DATA:
${activeReport.dataAnalysis || '-'}

5. TINDAK LANJUT & REKOMENDASI:
Tindak Lanjut: ${activeReport.followUp || '-'}
Rekomendasi: ${activeReport.recommendations || '-'}
    `.trim();

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs print:hidden">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Penyusun Laporan Berkala Kelas Otomatis
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Format baku Kemendikbud: Ringkasan kondisi, prestasi, kendala, analisis data, tindak lanjut, dan rekomendasi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeReport && (
            <>
              <button
                onClick={handleCopyReport}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs"
              >
                {isCopied ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'Tersalin' : 'Salin Laporan'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Ekspor PDF</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Generator Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 print:hidden">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Konfigurasi Laporan AI Otomatis
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Jenis Laporan *</label>
            <select
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value as ReportPeriodType)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none font-bold"
            >
              <option value="Harian">Laporan Harian</option>
              <option value="Mingguan">Laporan Mingguan</option>
              <option value="Bulanan">Laporan Bulanan</option>
              <option value="PTS">Laporan Tengah Semester (PTS)</option>
              <option value="PAS">Laporan Akhir Semester (PAS)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Periode Waktu *</label>
            <input
              type="text"
              value={periodDate}
              onChange={e => setPeriodDate(e.target.value)}
              placeholder="Contoh: November 2026 / Minggu ke-2"
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Catatan Tambahan</label>
            <input
              type="text"
              value={highlights}
              onChange={e => setHighlights(e.target.value)}
              placeholder="Sorotan khusus kegiatan belajar atau kendala..."
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:brightness-105 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{isGenerating ? 'Menyusun Laporan Baku dengan AI...' : 'Susun Laporan Kelas Baru'}</span>
        </button>
      </div>

      {/* History Selector */}
      {reports.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold print:hidden">
          <span className="text-slate-400">Pilih Arsip:</span>
          {reports.map(rep => (
            <button
              key={rep.id}
              onClick={() => setActiveReport(rep)}
              className={`px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap ${
                activeReport?.id === rep.id
                  ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {rep.periodType} - {rep.periodDate}
            </button>
          ))}
        </div>
      )}

      {/* Printable Report Document Card */}
      {activeReport ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-6 text-slate-900 print:shadow-none print:border-none print:p-0">
          
          {/* Formal School Header */}
          <div className="text-center pb-6 border-b-2 border-slate-900 space-y-1">
            <h1 className="text-base sm:text-lg font-extrabold uppercase tracking-wider text-slate-900">
              PEMERINTAH PROVINSI JAWA TIMUR
            </h1>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wide text-slate-800">
              DINAS PENDIDIKAN • CABANG DINAS WILAYAH GRESIK
            </h2>
            <h3 className="text-lg sm:text-xl font-black text-emerald-800 uppercase">
              {classroom?.schoolName || 'SMK NEGERI 1 SIDAYU'}
            </h3>
            <p className="text-xs text-slate-600">
              Jl. Raya Wadeng Sidayu Gresik • Telp. (031) 3949821 • Website: smkn1sidayu.sch.id
            </p>
          </div>

          {/* Title of Document */}
          <div className="text-center space-y-1 py-2">
            <h3 className="text-sm sm:text-base font-black uppercase underline decoration-2 underline-offset-4">
              {activeReport.title}
            </h3>
            <p className="text-xs text-slate-600">
              Tahun Ajaran: {classroom?.academicYear || '2026/2027'} • Semester: {classroom?.semester || 'Ganjil'} • Program: {classroom?.major || 'Rekayasa Perangkat Lunak'}
            </p>
          </div>

          {/* 5 Formal Sections */}
          <div className="space-y-5 text-xs sm:text-sm leading-relaxed">
            
            {/* 1. Ringkasan Kondisi Kelas */}
            <div className="space-y-1.5">
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
                Ringkasan Kondisi Aktual Kelas
              </h4>
              <p className="text-slate-800 text-justify pl-7">
                {activeReport.summary}
              </p>
            </div>

            {/* 2. Prestasi Siswa */}
            <div className="space-y-1.5">
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
                Prestasi dan Capaian Siswa
              </h4>
              <p className="text-slate-800 text-justify pl-7">
                {activeReport.achievementsSummary || 'Prestasi terdokumentasi dalam portofolio kelas dan rekam jejak juara.'}
              </p>
            </div>

            {/* 3. Kendala yang Muncul */}
            <div className="space-y-1.5">
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">3</span>
                Kendala dan Hambatan Pembelajaran
              </h4>
              <p className="text-slate-800 text-justify pl-7">
                {activeReport.challenges || 'Kendala tertangani dengan bimbingan personal dan pendampingan terpadu.'}
              </p>
            </div>

            {/* 4. Analisis Data */}
            <div className="space-y-1.5">
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">4</span>
                Analisis Data (Presensi, Akademik & Karakter)
              </h4>
              <p className="text-slate-800 text-justify pl-7 whitespace-pre-wrap">
                {activeReport.dataAnalysis || 'Tingkat kehadiran mencapai target minimal dan ketuntasan materi berada di atas KKM.'}
              </p>
            </div>

            {/* 5. Tindak Lanjut & Rekomendasi */}
            <div className="space-y-1.5">
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">5</span>
                Tindak Lanjut & Rekomendasi Strategis
              </h4>
              <div className="pl-7 space-y-2">
                <div>
                  <strong className="text-slate-900">Rencana Tindak Lanjut: </strong>
                  <span className="text-slate-800">{activeReport.followUp || '-'}</span>
                </div>
                <div>
                  <strong className="text-slate-900">Rekomendasi bagi Sekolah & Orang Tua: </strong>
                  <span className="text-slate-800">{activeReport.recommendations || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formal Signatures Block */}
          <div className="pt-10 grid grid-cols-2 gap-8 text-xs text-center border-t border-slate-200 mt-8">
            <div className="space-y-16">
              <div>
                <p>Mengetahui,</p>
                <p className="font-bold">Kepala SMK Negeri 1 Sidayu</p>
              </div>
              <div>
                <p className="font-extrabold underline text-slate-900">Drs. H. Miftahul Huda, M.Pd.</p>
                <p className="text-slate-600">NIP. 19680514 199412 1 002</p>
              </div>
            </div>

            <div className="space-y-16">
              <div>
                <p>Gresik, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="font-bold">Wali Kelas {classroom?.name || 'XI RPL 1'}</p>
              </div>
              <div>
                <p className="font-extrabold underline text-slate-900">Mohammad Alamifal, S.Pd., M.Kom.</p>
                <p className="text-slate-600">NIP. 19850920 201101 1 009</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
          Belum ada laporan tersimpan. Gunakan panel konfigurasi di atas untuk menyusun laporan kelas otomatis.
        </div>
      )}
    </div>
  );
};
