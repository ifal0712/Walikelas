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
  Users
} from 'lucide-react';
import { Classroom, UserProfile } from '../types';

interface HeaderProps {
  currentClass: Classroom | null;
  classes: Classroom[];
  onSelectClass: (c: Classroom) => void;
  user: UserProfile | null;
  isFirebaseConnected: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onOpenAI: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentClass,
  classes,
  onSelectClass,
  user,
  isFirebaseConnected,
  onLogin,
  onLogout,
  onOpenAI
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                  WaliKelas<span className="text-emerald-600 font-bold">Pro</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  Kemendikbudristek Edu
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Sistem Manajemen & Asisten Cerdas Wali Kelas Indonesia
              </p>
            </div>
          </div>

          {/* Classroom Selector */}
          <div className="hidden md:flex items-center gap-2 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600">
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
                  className="text-xs font-semibold text-slate-800 bg-transparent outline-none cursor-pointer"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-xs font-bold text-slate-800">
                  {currentClass?.name || 'Kelas XI RPL 1'}
                </span>
              )}
            </div>
            <div className="h-4 w-px bg-slate-300" />
            <div className="flex items-center gap-1 px-2 text-xs font-medium text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {currentClass?.academicYear || '2026/2027'} ({currentClass?.semester || 'Ganjil'})
              </span>
            </div>
          </div>

          {/* Right Action Group */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Assistant Button */}
            <button
              onClick={onOpenAI}
              className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white shadow-sm hover:shadow-md hover:brightness-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
              <span>Asisten AI</span>
            </button>

            {/* Cloud Sync Status */}
            <div
              title={
                isFirebaseConnected
                  ? 'Tersinkronisasi Realtime dengan Firestore Database'
                  : 'Mode Sinkronisasi Lokal'
              }
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
                isFirebaseConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {isFirebaseConnected ? (
                <>
                  <CloudCheck className="w-4 h-4 text-emerald-600" />
                  <span className="hidden lg:inline">Firestore Sync</span>
                </>
              ) : (
                <>
                  <CloudOff className="w-4 h-4 text-amber-600" />
                  <span className="hidden lg:inline">Offline</span>
                </>
              )}
            </div>

            {/* User Profile / Auth Button */}
            {user ? (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {user.displayName || 'Wali Kelas'}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                    {user.email}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center ring-2 ring-emerald-200">
                  {(user.displayName || 'WK')[0]}
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
              <button
                onClick={onLogin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors shadow-2xs"
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
