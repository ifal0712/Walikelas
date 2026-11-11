import React, { useState } from 'react';
import {
  CalendarCheck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserX,
  Sparkles,
  PhoneCall,
  Save,
  CheckSquare,
  FileSpreadsheet
} from 'lucide-react';
import { Student, AttendanceRecord, AttendanceStatus } from '../types';

interface AttendanceViewProps {
  students: Student[];
  attendance: AttendanceRecord[];
  onSaveAttendance: (records: AttendanceRecord[]) => void;
  onOpenAIWithPrompt: (prompt: string) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  students,
  attendance,
  onSaveAttendance,
  onOpenAIWithPrompt
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [viewMode, setViewMode] = useState<'daily' | 'recap'>('daily');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Local state for daily editing
  const existingRecordsForDate = attendance.filter(a => a.date === selectedDate);

  const [dailyStatus, setDailyStatus] = useState<Record<string, { status: AttendanceStatus; lateMinutes: number; notes: string }>>(() => {
    const initial: Record<string, { status: AttendanceStatus; lateMinutes: number; notes: string }> = {};
    students.forEach(st => {
      const rec = existingRecordsForDate.find(r => r.studentId === st.id);
      initial[st.id] = {
        status: rec ? rec.status : 'Hadir',
        lateMinutes: rec?.lateMinutes || 0,
        notes: rec?.notes || ''
      };
    });
    return initial;
  });

  // When selectedDate changes, reload daily status
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    const recs = attendance.filter(a => a.date === newDate);
    const updated: Record<string, { status: AttendanceStatus; lateMinutes: number; notes: string }> = {};
    students.forEach(st => {
      const rec = recs.find(r => r.studentId === st.id);
      updated[st.id] = {
        status: rec ? rec.status : 'Hadir',
        lateMinutes: rec?.lateMinutes || 0,
        notes: rec?.notes || ''
      };
    });
    setDailyStatus(updated);
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setDailyStatus(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleMarkAllHadir = () => {
    setDailyStatus(prev => {
      const updated = { ...prev };
      students.forEach(st => {
        updated[st.id] = {
          status: 'Hadir',
          lateMinutes: 0,
          notes: ''
        };
      });
      return updated;
    });
  };

  const handleSaveDaily = () => {
    const recordsToSave: AttendanceRecord[] = students.map(st => {
      const item = dailyStatus[st.id] || { status: 'Hadir', lateMinutes: 0, notes: '' };
      const existing = attendance.find(a => a.studentId === st.id && a.date === selectedDate);
      return {
        id: existing ? existing.id : `att_${Date.now()}_${st.id.substring(0, 6)}`,
        classId: st.classId,
        teacherId: st.teacherId,
        studentId: st.id,
        date: selectedDate,
        status: item.status,
        lateMinutes: item.lateMinutes,
        notes: item.notes,
        createdAt: existing ? existing.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });

    onSaveAttendance(recordsToSave);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  // Compute Overall and Per-Student Attendance Analysis
  const studentStats = students.map(st => {
    const sAtt = attendance.filter(a => a.studentId === st.id);
    const hadir = sAtt.filter(a => a.status === 'Hadir').length;
    const terlambat = sAtt.filter(a => a.status === 'Terlambat').length;
    const izin = sAtt.filter(a => a.status === 'Izin').length;
    const sakit = sAtt.filter(a => a.status === 'Sakit').length;
    const alfa = sAtt.filter(a => a.status === 'Alfa').length;
    const total = sAtt.length;
    const rate = total > 0 ? ((hadir + terlambat) / total) * 100 : 100;

    return {
      student: st,
      total,
      hadir,
      terlambat,
      izin,
      sakit,
      alfa,
      rate,
      isAtRisk: total > 0 && rate < 90
    };
  });

  const atRiskStudents = studentStats.filter(s => s.isAtRisk);

  return (
    <div className="space-y-6">
      
      {/* Top Header & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-emerald-600" />
            Manajemen Presensi & Disiplin Kehadiran
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan harian, rekapitulasi semester, analisis tren, dan sistem deteksi dini kehadiran &lt; 90%.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'daily'
                  ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Presensi Harian
            </button>
            <button
              onClick={() => setViewMode('recap')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'recap'
                  ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rekap Bulanan & Semester
            </button>
          </div>

          <button
            onClick={() => onOpenAIWithPrompt(`Analisis tren kehadiran kelas kami. Jumlah siswa berisiko kehadiran (<90%) ada ${atRiskStudents.length} siswa: ${atRiskStudents.map(s => `${s.student.name} (${s.rate.toFixed(1)}%, Alfa: ${s.alfa})`).join(', ')}. Berikan rekomendasi solutif edukatif dan draf pesan kepada orang tua.`)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold border border-indigo-200 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Analisis Presensi AI</span>
          </button>
        </div>
      </div>

      {/* Early Warning Banner if students are at risk (< 90%) */}
      {atRiskStudents.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                Peringatan: {atRiskStudents.length} Siswa Memiliki Kehadiran di Bawah 90%
              </h4>
              <p className="text-xs text-amber-800/90 mt-0.5">
                Sesuai standar operasional wali kelas, tindak lanjuti siswa berikut dengan dialog reflektif dan komunikasi santun kepada orang tua: {atRiskStudents.map(s => `${s.student.name} (${s.rate.toFixed(0)}%)`).join(', ')}.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenAIWithPrompt(`Buatkan pesan WhatsApp peringatan yang sangat santun, tidak menyalahkan, objektif, dan solutif untuk orang tua dari siswa berisiko kehadiran: ${atRiskStudents.map(s => `${s.student.name} (wali: ${s.student.parentName || '-'}, telp: ${s.student.parentPhone || '-'})`).join(', ')}.`)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 shadow-xs transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Draf Pesan Ortu (WA)</span>
          </button>
        </div>
      )}

      {/* VIEW 1: DAILY ATTENDANCE ENTRY */}
      {viewMode === 'daily' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Pilih Tanggal:</span>
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={e => handleDateChange(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkAllHadir}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs"
              >
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tandai Semua Hadir</span>
              </button>
              <button
                onClick={handleSaveDaily}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Presensi</span>
              </button>
            </div>
          </div>

          {isSavedNotice && (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Data presensi tanggal {selectedDate} berhasil disimpan dan disinkronkan ke Firestore!</span>
            </div>
          )}

          {/* Daily Table Grid */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-12 text-center">No</th>
                  <th className="p-3">Nama Siswa</th>
                  <th className="p-3 w-64 text-center">Status Kehadiran</th>
                  <th className="p-3 w-32">Keterlambatan</th>
                  <th className="p-3">Catatan / Alasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st, idx) => {
                  const state = dailyStatus[st.id] || { status: 'Hadir', lateMinutes: 0, notes: '' };
                  return (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 text-center text-slate-500 font-semibold">{idx + 1}</td>
                      <td className="p-3 font-bold text-slate-900">
                        <div>{st.name}</div>
                        <span className="text-[11px] text-slate-400 font-normal">NIS: {st.nis}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1 bg-slate-100 p-1 rounded-xl">
                          {(['Hadir', 'Izin', 'Sakit', 'Alfa', 'Terlambat'] as AttendanceStatus[]).map(s => {
                            const isSelected = state.status === s;
                            let activeClass = 'bg-white text-slate-800 shadow-2xs font-bold';
                            if (isSelected) {
                              if (s === 'Hadir') activeClass = 'bg-emerald-600 text-white font-bold';
                              if (s === 'Izin') activeClass = 'bg-blue-600 text-white font-bold';
                              if (s === 'Sakit') activeClass = 'bg-amber-500 text-white font-bold';
                              if (s === 'Alfa') activeClass = 'bg-rose-600 text-white font-bold';
                              if (s === 'Terlambat') activeClass = 'bg-purple-600 text-white font-bold';
                            }
                            return (
                              <button
                                key={s}
                                type="button"
                                onClick={() => handleStatusChange(st.id, s)}
                                className={`px-2 py-1 rounded-lg text-[11px] transition-all ${
                                  isSelected ? activeClass : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                {s}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                      <td className="p-3">
                        {state.status === 'Terlambat' ? (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-purple-600" />
                            <input
                              type="number"
                              min={1}
                              max={180}
                              value={state.lateMinutes || 15}
                              onChange={e => setDailyStatus(prev => ({
                                ...prev,
                                [st.id]: {
                                  ...prev[st.id],
                                  lateMinutes: parseInt(e.target.value) || 0
                                }
                              }))}
                              className="w-16 px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold"
                            />
                            <span className="text-[11px] text-slate-500">mnt</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          placeholder="Alasan izin / sakit / catatan..."
                          value={state.notes || ''}
                          onChange={e => setDailyStatus(prev => ({
                            ...prev,
                            [st.id]: {
                              ...prev[st.id],
                              notes: e.target.value
                            }
                          }))}
                          className="w-full px-2.5 py-1 rounded-lg border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:outline-none"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: RECAP & ANALYSIS */}
      {viewMode === 'recap' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Rekapitulasi Kehadiran Kumulatif Semester Ganjil
              </h3>
              <p className="text-xs text-slate-500">
                Evaluasi komprehensif tingkat kehadiran siswa, identifikasi risiko, dan persentase kehadiran.
              </p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Nama Siswa</th>
                  <th className="p-3 text-center">Total Hari</th>
                  <th className="p-3 text-center text-emerald-700">Hadir</th>
                  <th className="p-3 text-center text-purple-700">Terlambat</th>
                  <th className="p-3 text-center text-blue-700">Izin</th>
                  <th className="p-3 text-center text-amber-700">Sakit</th>
                  <th className="p-3 text-center text-rose-700">Alfa</th>
                  <th className="p-3 text-center">Persentase</th>
                  <th className="p-3">Status Evaluasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentStats.map(stat => (
                  <tr key={stat.student.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">
                      <div>{stat.student.name}</div>
                      <span className="text-[11px] text-slate-400 font-normal">NIS: {stat.student.nis}</span>
                    </td>
                    <td className="p-3 text-center text-slate-600 font-semibold">{stat.total}</td>
                    <td className="p-3 text-center font-bold text-emerald-700">{stat.hadir}</td>
                    <td className="p-3 text-center font-bold text-purple-700">{stat.terlambat}</td>
                    <td className="p-3 text-center font-bold text-blue-700">{stat.izin}</td>
                    <td className="p-3 text-center font-bold text-amber-700">{stat.sakit}</td>
                    <td className="p-3 text-center font-bold text-rose-700">{stat.alfa}</td>
                    <td className="p-3 text-center font-extrabold">
                      <span className={`px-2 py-0.5 rounded-full ${
                        stat.rate >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {stat.rate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-3">
                      {stat.isAtRisk ? (
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                            Berisiko &lt;90%
                          </span>
                          {stat.student.parentPhone && (
                            <a
                              href={`https://wa.me/${stat.student.parentPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Assalamu'alaikum Bapak/Ibu ${stat.student.parentName || ''}, salam dari Wali Kelas ananda ${stat.student.name}. Kami bermaksud mengonfirmasi kehadiran ananda...`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-700 hover:text-emerald-800 font-bold"
                            >
                              Hubungi Ortu
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Sangat Baik
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
