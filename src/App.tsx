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
  Database,
  LayoutGrid,
  ArrowLeft
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
  seedDemoDataForTeacher,
  isUserAdmin,
  getInitialSampleData
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
import { UnifiedLoginModal } from './components/UnifiedLoginModal';
import { AdminPortal } from './components/AdminPortal';
import { MenuHubCards } from './components/MenuHubCards';
import { MobileBottomNav } from './components/MobileBottomNav';

const initialDemoData = getInitialSampleData('guest_teacher');

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('menu_hub');
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  // Classroom State
  const [currentClass, setCurrentClass] = useState<Classroom | null>(initialDemoData.classroom);

  // Core Data Collections preloaded with sample data
  const [students, setStudents] = useState<Student[]>(initialDemoData.students);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialDemoData.attendance);
  const [grades, setGrades] = useState<GradeRecord[]>(initialDemoData.grades);
  const [characterLogs, setCharacterLogs] = useState<CharacterLog[]>(initialDemoData.characterLogs);
  const [disciplineLogs, setDisciplineLogs] = useState<DisciplineLog[]>(initialDemoData.disciplineLogs);
  const [achievements, setAchievements] = useState<AchievementRecord[]>(initialDemoData.achievements);
  const [communications, setCommunications] = useState<CommunicationLog[]>(initialDemoData.communications);
  const [reports, setReports] = useState<ClassReport[]>(initialDemoData.reports);
  const [welfareCases, setWelfareCases] = useState<WelfareCase[]>(initialDemoData.welfareCases);

  // Modals & Admin State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState('');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [customAdminProfile, setCustomAdminProfile] = useState<UserProfile | null>(null);
  const [customStudentProfile, setCustomStudentProfile] = useState<UserProfile | null>(null);
  const [isAdminPortalView, setIsAdminPortalView] = useState(false);
  const [extraClasses, setExtraClasses] = useState<Classroom[]>([]);

  const isEffectiveAdmin = isUserAdmin(currentUser) || !!customAdminProfile;
  const effectiveUser = customAdminProfile || customStudentProfile || currentUser;

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        const isAdminEmail = user.email === 'alamifal@smkn1sidayu.sch.id';
        const profile: UserProfile = {
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || (isAdminEmail ? 'Kepala Sekolah / Admin' : 'Wali Kelas'),
          schoolName: 'SMKN 1 Sidayu',
          role: isAdminEmail ? 'admin' : 'wali_kelas',
          createdAt: new Date().toISOString()
        };
        setCurrentUser(profile);
        setIsFirebaseConnected(true);
        if (isAdminEmail) {
          setIsAdminPortalView(true);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Realtime Data Sync from Firestore (only active when signed in to prevent permission error)
  useEffect(() => {
    if (!auth.currentUser) {
      return;
    }

    const teacherId = currentUser?.id || auth.currentUser.uid;
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
    { id: 'menu_hub', label: 'Menu Kartu', icon: LayoutGrid },
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

  // Handle Student Login from Unified Portal
  const handleStudentLogin = (st: Student) => {
    const studentProfile: UserProfile = {
      id: `student_${st.id}`,
      email: `${st.nisn}@siswa.smkn1sidayu.sch.id`,
      displayName: st.name,
      schoolName: 'SMKN 1 Sidayu',
      role: 'siswa',
      nisn: st.nisn,
      studentId: st.id,
      createdAt: new Date().toISOString()
    };
    setCustomStudentProfile(studentProfile);
    setSelectedStudentForModal(st);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden">
      
      {/* Global Header */}
      <Header
        currentClass={currentClass}
        classes={currentClass ? [currentClass, ...extraClasses] : extraClasses}
        onSelectClass={setCurrentClass}
        user={effectiveUser}
        isFirebaseConnected={isFirebaseConnected}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={() => {
          logoutUser();
          setCustomAdminProfile(null);
          setCustomStudentProfile(null);
          setIsAdminPortalView(false);
        }}
        onOpenAI={() => {
          setAiInitialPrompt('');
          setIsAIModalOpen(true);
        }}
        isAdmin={isEffectiveAdmin}
        isAdminView={isAdminPortalView}
        onToggleAdminView={() => setIsAdminPortalView(!isAdminPortalView)}
        activeTab={activeTab}
        onGoToMenuHub={() => setActiveTab('menu_hub')}
      />

      {/* Main Content Area: Ukuran otomatis menyesuaikan layar */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 transition-all">
        
        {/* Banner Khusus jika Siswa / Wali Murid Sedang Login */}
        {effectiveUser?.role === 'siswa' && (
          <div className="mb-5 p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {effectiveUser.displayName[0]}
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-indigo-900">
                  Selamat Datang, {effectiveUser.displayName}!
                </h4>
                <p className="text-[11px] sm:text-xs text-indigo-700 leading-relaxed">
                  Anda login sebagai Siswa / Wali Murid (NISN: {effectiveUser.nisn || '-'}). Anda dapat melihat ringkasan presensi dan evaluasi belajar Anda.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const st = students.find(s => s.id === effectiveUser.studentId);
                if (st) setSelectedStudentForModal(st);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all shrink-0"
            >
              Lihat Rapor Siswa
            </button>
          </div>
        )}
        
        {isAdminPortalView ? (
          <AdminPortal
            currentAdmin={effectiveUser || {
              id: 'admin_default',
              displayName: 'Kepala Sekolah (Super Admin)',
              email: 'alamifal@smkn1sidayu.sch.id',
              role: 'admin',
              schoolName: 'SMKN 1 Sidayu',
              createdAt: new Date().toISOString()
            }}
            classes={currentClass ? [currentClass, ...extraClasses] : extraClasses}
            students={students}
            welfareCases={welfareCases}
            onSelectClass={cls => {
              setCurrentClass(cls);
              setIsAdminPortalView(false);
            }}
            onAddClass={newCls => {
              setExtraClasses(prev => [...prev, newCls]);
              saveRecord('classes', { ...newCls, teacherId: effectiveUser?.id || 'admin_user' });
            }}
            onSwitchToTeacherMode={() => setIsAdminPortalView(false)}
            onLogoutAdmin={() => {
              setCustomAdminProfile(null);
              setIsAdminPortalView(false);
              logoutUser();
            }}
            onOpenAIWithPrompt={handleOpenAIWithPrompt}
          />
        ) : (
          <>
            {/* Sub-Page Navigation Bar: Menu is hidden on subpages, easily return to Menu Utama */}
            {activeTab !== 'menu_hub' && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setActiveTab('menu_hub')}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold border border-emerald-200 shadow-2xs transition-all active:scale-95 group"
                    title="Kembali ke Menu Utama (Tampilan Kartu)"
                  >
                    <ArrowLeft className="w-4 h-4 text-emerald-700 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Kembali ke Menu Utama</span>
                  </button>
                  <div className="h-5 w-px bg-slate-200 hidden sm:block" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                      {navTabs.find(t => t.id === activeTab)?.label || activeTab}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium hidden md:inline">
                      {currentClass?.name || 'Kelas XI RPL 1'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenAIWithPrompt(`Berikan rekomendasi tindak lanjut wali kelas untuk modul ${navTabs.find(t => t.id === activeTab)?.label || activeTab} kelas ${currentClass?.name}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-all active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="hidden sm:inline">Rekomendasi AI Modul</span>
                    <span className="sm:hidden">Analisis AI</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 0: Menu Hub Kartu Berkelompok (Primary View After Login) */}
            {activeTab === 'menu_hub' && (
              <MenuHubCards
                classroom={currentClass}
                students={students}
                attendance={attendance}
                grades={grades}
                characterLogs={characterLogs}
                disciplineLogs={disciplineLogs}
                achievements={achievements}
                welfareCases={welfareCases}
                onNavigateTab={setActiveTab}
                onOpenAIWithPrompt={handleOpenAIWithPrompt}
              />
            )}

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
              setStudents(prev => {
                const idx = prev.findIndex(s => s.id === st.id);
                if (idx >= 0) {
                  const updated = [...prev];
                  updated[idx] = st;
                  return updated;
                }
                return [...prev, st];
              });
              saveRecord('students', { ...st, teacherId: currentUser?.id || 'guest_teacher' });
            }}
            onDeleteStudent={id => {
              setStudents(prev => prev.filter(s => s.id !== id));
              removeRecord('students', id);
            }}
            onOpenAIWithStudent={handleOpenAIWithStudent}
            selectedStudentModal={selectedStudentForModal}
            onCloseStudentModal={() => setSelectedStudentForModal(null)}
            onOpenStudentModal={st => setSelectedStudentForModal(st)}
            currentUser={effectiveUser}
            onOpenAIWithPrompt={handleOpenAIWithPrompt}
          />
        )}

        {/* Tab 3: Attendance View */}
        {activeTab === 'attendance' && (
          <AttendanceView
            students={students}
            attendance={attendance}
            onSaveAttendance={records => {
              setAttendance(prev => {
                const map = new Map(prev.map(a => [a.id, a]));
                records.forEach(r => map.set(r.id, r));
                return Array.from(map.values());
              });
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
              setGrades(prev => {
                const idx = prev.findIndex(item => item.id === g.id);
                if (idx >= 0) {
                  const updated = [...prev];
                  updated[idx] = g;
                  return updated;
                }
                return [...prev, g];
              });
              saveRecord('grades', { ...g, teacherId: currentUser?.id || 'guest_teacher' });
            }}
            onDeleteGrade={id => {
              setGrades(prev => prev.filter(g => g.id !== id));
              removeRecord('grades', id);
            }}
            onOpenAIWithPrompt={handleOpenAIWithPrompt}
          />
        )}

        {/* Tab 5: Character View (10 Core Values) */}
        {activeTab === 'character' && (
          <CharacterView
            students={students}
            characterLogs={characterLogs}
            onSaveCharacterLog={c => {
              setCharacterLogs(prev => {
                const idx = prev.findIndex(item => item.id === c.id);
                if (idx >= 0) {
                  const updated = [...prev];
                  updated[idx] = c;
                  return updated;
                }
                return [...prev, c];
              });
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
              setDisciplineLogs(prev => {
                const idx = prev.findIndex(item => item.id === d.id);
                if (idx >= 0) {
                  const updated = [...prev];
                  updated[idx] = d;
                  return updated;
                }
                return [...prev, d];
              });
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
              setAchievements(prev => {
                const idx = prev.findIndex(item => item.id === a.id);
                if (idx >= 0) {
                  const updated = [...prev];
                  updated[idx] = a;
                  return updated;
                }
                return [...prev, a];
              });
              saveRecord('achievements', { ...a, teacherId: currentUser?.id || 'guest_teacher' });
            }}
            onDeleteAchievement={id => {
              setAchievements(prev => prev.filter(a => a.id !== id));
              removeRecord('achievements', id);
            }}
            onOpenAIWithPrompt={handleOpenAIWithPrompt}
          />
        )}

        {/* Tab 8: Communication View */}
        {activeTab === 'communication' && (
          <CommunicationView
            students={students}
            communications={communications}
            onSaveCommunication={c => {
              setCommunications(prev => {
                const idx = prev.findIndex(item => item.id === c.id);
                if (idx >= 0) {
                  const updated = [...prev];
                  updated[idx] = c;
                  return updated;
                }
                return [...prev, c];
              });
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
              setWelfareCases(prev => {
                const idx = prev.findIndex(item => item.id === w.id);
                if (idx >= 0) {
                  const updated = [...prev];
                  updated[idx] = w;
                  return updated;
                }
                return [...prev, w];
              });
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
              setReports(prev => {
                const idx = prev.findIndex(item => item.id === rep.id);
                if (idx >= 0) {
                  const updated = [...prev];
                  updated[idx] = rep;
                  return updated;
                }
                return [...prev, rep];
              });
              saveRecord('reports', { ...rep, teacherId: currentUser?.id || 'guest_teacher' });
            }}
          />
        )}
        </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 text-center print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Sistem Manajemen Wali Kelas Profesional • SMKN 1 Sidayu</p>
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

      {/* Unified Login Modal ("Masuk Akun" dan "Login Siswa" dijadikan 1) */}
      <UnifiedLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onGoogleLogin={async () => {
          await loginWithGoogle();
        }}
        onPasskeyLogin={profile => {
          setCustomAdminProfile(profile);
          setIsAdminPortalView(true);
        }}
        onStudentLogin={handleStudentLogin}
        students={students}
        currentUser={effectiveUser}
      />

      {/* Mobile Android Bottom Navigation */}
      {!isAdminPortalView && (
        <MobileBottomNav
          activeTab={activeTab}
          onNavigateTab={setActiveTab}
          onOpenAI={() => {
            setAiInitialPrompt('');
            setIsAIModalOpen(true);
          }}
          studentCount={students.length}
        />
      )}
    </div>
  );
}
