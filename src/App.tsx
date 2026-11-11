/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  GraduationCap,
  Sparkles,
  Scale,
  Award,
  MessageSquare,
  HeartHandshake,
  FileText,
  CloudCheck,
  RefreshCw,
  Database
} from 'lucide-react';
import {
  Classroom,
  Student,
  AttendanceRecord,
  GradeRecord,
  CharacterLog,
  DisciplineLog,
  AchievementRecord,
  CommunicationLog,
  ClassReport,
  WelfareCase,
  UserProfile
} from './types';
import {
  auth,
  db,
  loginWithGoogle,
  logoutUser,
  onAuthStateChanged,
  saveRecord,
  removeRecord,
  subscribeToTeacherData,
  seedDemoDataForTeacher
} from './services/firebase';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { StudentsView } from './components/StudentsView';
import { AttendanceView } from './components/AttendanceView';
import { GradesView } from './components/GradesView';
import { CharacterView } from './components/CharacterView';
import { DisciplineView } from './components/DisciplineView';
import { AchievementsView } from './components/AchievementsView';
import { CommunicationView } from './components/CommunicationView';
import { WelfareView } from './components/WelfareView';
import { ReportsView } from './components/ReportsView';
import { AIAssistantModal } from './components/AIAssistantModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  // Classroom State
  const [currentClass, setCurrentClass] = useState<Classroom | null>({
    id: 'cls_rpl1',
    teacherId: 'guest_teacher',
    name: 'Kelas XI RPL 1',
    grade: 'XI (Sebelas)',
    academicYear: '2026/2027',
    semester: 'Ganjil',
    schoolName: 'SMKN 1 Sidayu',
    major: 'Rekayasa Perangkat Lunak',
    targetAttendanceRate: 90,
    createdAt: new Date().toISOString()
  });

  // Core Data Collections
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [characterLogs, setCharacterLogs] = useState<CharacterLog[]>([]);
  const [disciplineLogs, setDisciplineLogs] = useState<DisciplineLog[]>([]);
  const [achievements, setAchievements] = useState<AchievementRecord[]>([]);
  const [communications, setCommunications] = useState<CommunicationLog[]>([]);
  const [reports, setReports] = useState<ClassReport[]>([]);
  const [welfareCases, setWelfareCases] = useState<WelfareCase[]>([]);

  // Modals
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState('');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        const profile: UserProfile = {
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Wali Kelas',
          schoolName: 'SMKN 1 Sidayu',
          role: 'wali_kelas',
          createdAt: new Date().toISOString()
        };
        setCurrentUser(profile);
        setIsFirebaseConnected(true);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Realtime Data Sync from Firestore
  useEffect(() => {
    const teacherId = currentUser?.id || 'guest_teacher';

    const unsubs: (() => void)[] = [];

    try {
      unsubs.push(
        subscribeToTeacherData<Classroom>('classes', teacherId, data => {
          if (data.length > 0) {
            setCurrentClass(data[0]);
          }
        })
      );
      unsubs.push(subscribeToTeacherData<Student>('students', teacherId, setStudents));
      unsubs.push(subscribeToTeacherData<AttendanceRecord>('attendance', teacherId, setAttendance));
      unsubs.push(subscribeToTeacherData<GradeRecord>('grades', teacherId, setGrades));
      unsubs.push(subscribeToTeacherData<CharacterLog>('characterLogs', teacherId, setCharacterLogs));
      unsubs.push(subscribeToTeacherData<DisciplineLog>('disciplineLogs', teacherId, setDisciplineLogs));
      unsubs.push(subscribeToTeacherData<AchievementRecord>('achievements', teacherId, setAchievements));
      unsubs.push(subscribeToTeacherData<CommunicationLog>('communications', teacherId, setCommunications));
      unsubs.push(subscribeToTeacherData<ClassReport>('reports', teacherId, setReports));
      unsubs.push(subscribeToTeacherData<WelfareCase>('welfareCases', teacherId, setWelfareCases));
    } catch (e) {
      console.warn('Realtime listeners fallback:', e);
      setIsFirebaseConnected(false);
    }

    return () => {
      unsubs.forEach(fn => fn());
    };
  }, [currentUser]);

  // Seed sample data helper
  const handleSeedData = async () => {
    const teacherId = currentUser?.id || 'guest_teacher';
    setIsSeeding(true);
    try {
      await seedDemoDataForTeacher(teacherId);
      alert('Data awal contoh (Kelas XI RPL 1 - SMKN 1 Sidayu) berhasil diinisialisasi di Firebase Firestore!');
    } catch (e: any) {
      console.error(e);
      alert('Gagal inisialisasi data: ' + e.message);
    } finally {
      setIsSeeding(false);
    }
  };

  // Quick prompt trigger for AI
  const handleOpenAIWithPrompt = (prompt: string) => {
    setAiInitialPrompt(prompt);
    setIsAIModalOpen(true);
  };

  // Student AI analysis trigger
  const handleOpenAIWithStudent = (student: Student) => {
    const prompt = `Analisis komprehensif perkembangan siswa ${student.name} (NIS: ${student.nis}). Berikan ringkasan temuan akademik, presensi, 10 nilai karakter, catatan disiplin, dan rekomendasi tindak lanjut edukatif serta draf pesan untuk orang tua.`;
    handleOpenAIWithPrompt(prompt);
  };

  // Navigation tabs
  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Data Siswa', icon: Users, badge: students.length },
    { id: 'attendance', label: 'Presensi', icon: CalendarCheck },
    { id: 'grades', label: 'Hasil Belajar', icon: GraduationCap },
    { id: 'character', label: '10 Karakter', icon: Sparkles },
    { id: 'discipline', label: 'Kedisiplinan', icon: Scale },
    { id: 'achievements', label: 'Prestasi', icon: Award, badge: achievements.length },
    { id: 'communication', label: 'Komunikasi Ortu', icon: MessageSquare },
    { id: 'welfare', label: 'Kesejahteraan (BK)', icon: HeartHandshake, badge: welfareCases.filter(w => w.status !== 'Selesai').length, badgeColor: 'bg-rose-500' },
    { id: 'reports', label: 'Laporan Kelas', icon: FileText }
  ];

  // Context summary for AI
  const contextSummary = `
Kelas: ${currentClass?.name || 'Kelas XI RPL 1'} (${currentClass?.schoolName || 'SMKN 1 Sidayu'})
Jumlah Siswa: ${students.length}
Rata-rata Presensi: ${attendance.length > 0 ? ((attendance.filter(a => a.status === 'Hadir' || a.status === 'Terlambat').length / attendance.length) * 100).toFixed(1) : '95.0'}%
Rata-rata Nilai: ${grades.length > 0 ? (grades.reduce((a, b) => a + b.score, 0) / grades.length).toFixed(1) : '82.5'}
Kasus Kesejahteraan Aktif: ${welfareCases.filter(w => w.status !== 'Selesai').length}
Prestasi: ${achievements.length}
  `.trim();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Global Header */}
      <Header
        currentClass={currentClass}
        classes={currentClass ? [currentClass] : []}
        onSelectClass={setCurrentClass}
        user={currentUser}
        isFirebaseConnected={isFirebaseConnected}
        onLogin={loginWithGoogle}
        onLogout={logoutUser}
        onOpenAI={() => {
          setAiInitialPrompt('');
          setIsAIModalOpen(true);
        }}
      />

      {/* Main Navigation Subheader */}
      <nav className="bg-white border-b border-slate-200 sticky top-16 sm:top-20 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 overflow-x-auto py-2.5 no-scrollbar">
            <div className="flex items-center gap-1 sm:gap-2">
              {navTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                        isActive
                          ? 'bg-white text-emerald-800'
                          : tab.badgeColor
                          ? `${tab.badgeColor} text-white`
                          : 'bg-slate-200 text-slate-800'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Inisialisasi Data Demo Button if students is empty */}
            {students.length === 0 && (
              <button
                onClick={handleSeedData}
                disabled={isSeeding}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors shrink-0 disabled:opacity-50"
              >
                <Database className="w-3.5 h-3.5" />
                <span>{isSeeding ? 'Memuat Data...' : 'Muat Data Contoh (XI RPL 1)'}</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* If no students yet and not seeding, show friendly intro */}
        {students.length === 0 && !isSeeding && (
          <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Selamat Datang di Sistem Manajemen Wali Kelas Profesional
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                Belum ada data siswa terhubung. Klik tombol di samping untuk langsung menginisialisasi sampel lengkap <strong>Kelas XI RPL 1 - SMKN 1 Sidayu</strong> (profil siswa, presensi harian, nilai akademik, rekap 10 karakter, kasus kesejahteraan, dan prestasi) ke database Firestore Anda!
              </p>
            </div>
            <button
              onClick={handleSeedData}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shrink-0 transition-colors"
            >
              <Database className="w-4 h-4" />
              <span>Inisialisasi Data Lengkap</span>
            </button>
          </div>
        )}

        {/* Tab 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <Dashboard
            classroom={currentClass}
            students={students}
            attendance={attendance}
            grades={grades}
            characterLogs={characterLogs}
            disciplineLogs={disciplineLogs}
            achievements={achievements}
            welfareCases={welfareCases}
            onNavigateTab={setActiveTab}
            onSelectStudent={st => {
              setSelectedStudentForModal(st);
            }}
            onOpenAIWithPrompt={handleOpenAIWithPrompt}
          />
        )}

        {/* Tab 2: Students View */}
        {activeTab === 'students' && (
          <StudentsView
            students={students}
            attendance={attendance}
            grades={grades}
            characterLogs={characterLogs}
            disciplineLogs={disciplineLogs}
            achievements={achievements}
            welfareCases={welfareCases}
            onSaveStudent={st => {
              saveRecord('students', { ...st, teacherId: currentUser?.id || 'guest_teacher' });
            }}
            onDeleteStudent={id => removeRecord('students', id)}
            onOpenAIWithStudent={handleOpenAIWithStudent}
            selectedStudentModal={selectedStudentForModal}
            onCloseStudentModal={() => setSelectedStudentForModal(null)}
            onOpenStudentModal={st => setSelectedStudentForModal(st)}
          />
        )}

        {/* Tab 3: Attendance View */}
        {activeTab === 'attendance' && (
          <AttendanceView
            students={students}
            attendance={attendance}
            onSaveAttendance={records => {
              const teacherId = currentUser?.id || 'guest_teacher';
              records.forEach(r => saveRecord('attendance', { ...r, teacherId }));
            }}
            onOpenAIWithPrompt={handleOpenAIWithPrompt}
          />
        )}

        {/* Tab 4: Grades View */}
        {activeTab === 'grades' && (
          <GradesView
            students={students}
            grades={grades}
            onSaveGrade={g => {
              saveRecord('grades', { ...g, teacherId: currentUser?.id || 'guest_teacher' });
            }}
            onDeleteGrade={id => removeRecord('grades', id)}
            onOpenAIWithPrompt={handleOpenAIWithPrompt}
          />
        )}

        {/* Tab 5: Character View (10 Core Values) */}
        {activeTab === 'character' && (
          <CharacterView
            students={students}
            characterLogs={characterLogs}
            onSaveCharacterLog={c => {
              saveRecord('characterLogs', { ...c, teacherId: currentUser?.id || 'guest_teacher' });
            }}
            onOpenAIWithPrompt={handleOpenAIWithPrompt}
          />
        )}

        {/* Tab 6: Discipline View */}
        {activeTab === 'discipline' && (
          <DisciplineView
            students={students}
            disciplineLogs={disciplineLogs}
            onSaveDisciplineLog={d => {
              saveRecord('disciplineLogs', { ...d, teacherId: currentUser?.id || 'guest_teacher' });
            }}
            onOpenAIWithPrompt={handleOpenAIWithPrompt}
          />
        )}

        {/* Tab 7: Achievements View */}
        {activeTab === 'achievements' && (
          <AchievementsView
            students={students}
            achievements={achievements}
            onSaveAchievement={a => {
              saveRecord('achievements', { ...a, teacherId: currentUser?.id || 'guest_teacher' });
            }}
            onDeleteAchievement={id => removeRecord('achievements', id)}
            onOpenAIWithPrompt={handleOpenAIWithPrompt}
          />
        )}

        {/* Tab 8: Communication View */}
        {activeTab === 'communication' && (
          <CommunicationView
            students={students}
            communications={communications}
            onSaveCommunication={c => {
              saveRecord('communications', { ...c, teacherId: currentUser?.id || 'guest_teacher' });
            }}
            onOpenAIWithPrompt={handleOpenAIWithPrompt}
          />
        )}

        {/* Tab 9: Welfare View */}
        {activeTab === 'welfare' && (
          <WelfareView
            students={students}
            welfareCases={welfareCases}
            onSaveWelfareCase={w => {
              saveRecord('welfareCases', { ...w, teacherId: currentUser?.id || 'guest_teacher' });
            }}
            onOpenAIWithPrompt={handleOpenAIWithPrompt}
          />
        )}

        {/* Tab 10: Reports View */}
        {activeTab === 'reports' && (
          <ReportsView
            classroom={currentClass}
            students={students}
            reports={reports}
            attendanceCount={attendance.length}
            attendanceAvg={
              attendance.length > 0
                ? (attendance.filter(a => a.status === 'Hadir' || a.status === 'Terlambat').length / attendance.length) * 100
                : 95
            }
            gradeAvg={
              grades.length > 0
                ? grades.reduce((a, b) => a + b.score, 0) / grades.length
                : 82.5
            }
            achievementsCount={achievements.length}
            violationsCount={disciplineLogs.filter(d => d.category === 'Pelanggaran' || d.category === 'Teguran').length}
            welfareCasesCount={welfareCases.filter(w => w.status !== 'Selesai').length}
            onSaveReport={rep => {
              saveRecord('reports', { ...rep, teacherId: currentUser?.id || 'guest_teacher' });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 text-center print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Sistem Manajemen Wali Kelas Profesional • Kemendikbudristek Edu Standard</p>
          <p className="flex items-center gap-1.5 text-slate-400">
            <CloudCheck className="w-4 h-4 text-emerald-600" />
            <span>Didukung Firebase Firestore Realtime & Google Gemini AI</span>
          </p>
        </div>
      </footer>

      {/* Dedicated AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        initialPrompt={aiInitialPrompt}
        contextDataSummary={contextSummary}
      />
    </div>
  );
}
