import React from 'react';
import {
  GraduationCap,
  Sparkles,
  CloudCheck,
  CloudOff,
  LogIn,
  LogOut,
  School,
  Calendar,
  Users,
  LayoutGrid
} from 'lucide-react';
import { Classroom, UserProfile } from '../types';

interface HeaderProps {
  currentClass: Classroom | null;
  classes: Classroom[];
  onSelectClass: (c: Classroom) => void;
  user: UserProfile | null;
  isFirebaseConnected: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenAI: () => void;
  isAdmin: boolean;
  isAdminView: boolean;
  onToggleAdminView: () => void;
  activeTab: string;
  onGoToMenuHub: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentClass,
  classes,
  onSelectClass,
  user,
  isFirebaseConnected,
  onOpenLogin,
  onLogout,
  onOpenAI,
  isAdmin,
  isAdminView,
  onToggleAdminView,
  activeTab,
  onGoToMenuHub
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs w-full">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo & Brand (Clickable to return to Menu Utama) */}
          <div
            onClick={onGoToMenuHub}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
            title="Klik untuk kembali ke Menu Utama"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-sm sm:text-lg group-hover:text-emerald-700 transition-colors">
                  WaliKelas<span className="text-emerald-600 font-bold">Pro</span>
                </span>

                {/* Logo Hijau Online Status Indicator (Menggantikan Kemendikbud Edu) */}
                {isAdminView ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-slate-900 text-emerald-400 border border-slate-700 shadow-2xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </span>
                    <span>Pengawas Online</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>Online</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Sistem Manajemen & Asisten Cerdas Wali Kelas Indonesia
              </p>
            </div>
          </div>

          {/* Classroom Selector (Otomatis menyesuaikan layar) */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 font-medium text-slate-600">
              <School className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentClass?.schoolName || 'SMKN 1 Sidayu'}</span>
            </div>
            <div className="h-4 w-px bg-slate-300" />
            <div className="flex items-center gap-1.5 px-2 py-1">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              {classes.length > 1 ? (
                <select
                  value={currentClass?.id}
                  onChange={e => {
                    const found = classes.find(c => c.id === e.target.value);
                    if (found) onSelectClass(found);
                  }}
                  className="font-semibold text-slate-800 bg-transparent outline-none cursor-pointer"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="font-bold text-slate-800">
                  {currentClass?.name || 'Kelas XI RPL 1'}
                </span>
              )}
            </div>
            <div className="h-4 w-px bg-slate-300" />
            <div className="flex items-center gap-1 px-2 font-medium text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {currentClass?.academicYear || '2026/2027'} ({currentClass?.semester || 'Ganjil'})
              </span>
            </div>
          </div>

          {/* Right Action Group */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Admin Portal Toggle Button (Hanya jika admin sudah login) */}
            {isAdmin && (
              <button
                onClick={onToggleAdminView}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-extrabold rounded-xl transition-all shadow-2xs ${
                  isAdminView
                    ? 'bg-slate-900 text-emerald-400 border border-slate-700'
                    : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 border border-emerald-300'
                }`}
              >
                <span>{isAdminView ? 'Ruang Wali Kelas' : 'Portal Pengawas'}</span>
              </button>
            )}

            {/* Tombol Menu Utama di Sub-Halaman */}
            {activeTab !== 'menu_hub' && !isAdminView && (
              <button
                onClick={onGoToMenuHub}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold border border-emerald-200 shadow-2xs transition-all active:scale-95"
                title="Kembali ke Menu Utama"
              >
                <LayoutGrid className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Menu Utama</span>
              </button>
            )}

            {/* Asisten AI Button */}
            <button
              onClick={onOpenAI}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white shadow-sm hover:shadow-md hover:brightness-105 active:scale-95 transition-all shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse text-amber-300" />
              <span className="hidden xs:inline">Asisten AI</span>
              <span className="xs:hidden">AI</span>
            </button>

            {/* Cloud Sync Status */}
            <div
              title={
                isFirebaseConnected
                  ? 'Tersinkronisasi Realtime dengan Firestore Database'
                  : 'Mode Sinkronisasi Lokal'
              }
              className={`hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium border ${
                isFirebaseConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {isFirebaseConnected ? (
                <>
                  <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden xl:inline">Firestore Sync</span>
                </>
              ) : (
                <>
                  <CloudOff className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden xl:inline">Offline</span>
                </>
              )}
            </div>

            {/* User Profile / Unified Auth Button: "masuk akun" dan "login siswa" dijadikan 1 */}
            {user ? (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {user.displayName || (user.role === 'admin' ? 'Admin Sekolah' : user.role === 'siswa' ? 'Siswa / Wali Murid' : 'Wali Kelas')}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[130px]">
                    {user.role === 'siswa' ? `NISN: ${user.nisn || '-'}` : user.email}
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center ring-2 ${
                  user.role === 'admin'
                    ? 'bg-slate-900 ring-emerald-400'
                    : user.role === 'siswa'
                    ? 'bg-indigo-600 ring-indigo-200'
                    : 'bg-emerald-700 ring-emerald-200'
                }`}>
                  {(user.displayName || 'U')[0]}
                </div>
                <button
                  onClick={onLogout}
                  title="Keluar Akun"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* SATU TOMBOL MASUK AKUN TUNGGAL TERPADU */
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold transition-all shadow-2xs active:scale-95"
              >
                <LogIn className="w-4 h-4 text-emerald-600" />
                <span>Masuk Akun</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};
