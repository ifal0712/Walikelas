import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  LogIn,
  KeyRound,
  X,
  AlertCircle,
  Users,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Search,
  UserCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserProfile, Student, ManagedUser } from '../types';

interface UnifiedLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleLogin: () => Promise<void>;
  onLoginManagedUser: (user: ManagedUser) => void;
  onStudentDirectLogin: (student: Student) => void;
  students: Student[];
  managedUsers: ManagedUser[];
  currentUser: UserProfile | null;
  initialRole?: 'guru' | 'siswa' | 'admin';
  initialUsername?: string;
  initialPassword?: string;
}

export const UnifiedLoginModal: React.FC<UnifiedLoginModalProps> = ({
  isOpen,
  onClose,
  onGoogleLogin,
  onLoginManagedUser,
  onStudentDirectLogin,
  students,
  managedUsers,
  currentUser,
  initialRole = 'guru',
  initialUsername = '',
  initialPassword = ''
}) => {
  const [activeRole, setActiveRole] = useState<'guru' | 'siswa' | 'admin'>(initialRole);

  // Form states
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState(initialPassword);
  const [showPassword, setShowPassword] = useState(false);

  // Student specific selection
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [searchStudentQuery, setSearchStudentQuery] = useState('');

  // General state
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sync initial props whenever modal opens or initial values change
  useEffect(() => {
    if (isOpen) {
      setActiveRole(initialRole);
      setUsername(initialUsername);
      setPassword(initialPassword);
      setErrorMsg('');
    }
  }, [isOpen, initialRole, initialUsername, initialPassword]);

  if (!isOpen) return null;

  // Handle Username & Password Submission (Wali Kelas, Siswa, Admin)
  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setErrorMsg('Harap isi username dan password dengan lengkap.');
      return;
    }

    // Find in managedUsers
    const foundUser = managedUsers.find(
      u =>
        u.username.toLowerCase() === cleanUser ||
        (u.nipOrNisn && u.nipOrNisn.trim() === cleanUser) ||
        (u.email && u.email.toLowerCase() === cleanUser)
    );

    if (!foundUser) {
      setErrorMsg('Username tidak terdaftar. Periksa kembali atau gunakan akun demo yang tersedia.');
      return;
    }

    if (foundUser.password !== cleanPass) {
      setErrorMsg('Password salah. Silakan periksa kembali atau minta reset password kepada Admin.');
      return;
    }

    if (foundUser.status === 'Nonaktif') {
      setErrorMsg('Akun ini sedang dinonaktifkan oleh Administrator sekolah.');
      return;
    }

    onLoginManagedUser(foundUser);
    onClose();
  };

  // Handle Google Login fallback for teachers
  const handleGoogleSubmit = async () => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      await onGoogleLogin();
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal masuk dengan akun Google.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Direct Student Selection
  const handleStudentSelectSubmit = (st: Student) => {
    onStudentDirectLogin(st);
    onClose();
  };

  const filteredStudents = students.filter(
    s =>
      s.name.toLowerCase().includes(searchStudentQuery.toLowerCase()) ||
      s.nisn.includes(searchStudentQuery) ||
      s.nis.includes(searchStudentQuery)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-xs">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Masuk Sistem WaliKelasPro
              </h3>
              <p className="text-xs text-slate-300">
                SMKN 1 Sidayu • Autentikasi Pengguna Terdaftar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Unified Role Tabs */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveRole('guru');
                setErrorMsg('');
                if (username === 'siswa_zaky' || username === 'admin') {
                  setUsername('wali_rpl1');
                  setPassword('wali123');
                }
              }}
              className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeRole === 'guru'
                  ? 'bg-white text-emerald-800 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Wali Kelas</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveRole('siswa');
                setErrorMsg('');
                if (username === 'wali_rpl1' || username === 'admin') {
                  setUsername('siswa_zaky');
                  setPassword('siswa123');
                }
              }}
              className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeRole === 'siswa'
                  ? 'bg-white text-indigo-700 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Siswa</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveRole('admin');
                setErrorMsg('');
                if (username === 'wali_rpl1' || username === 'siswa_zaky') {
                  setUsername('admin');
                  setPassword('admin123');
                }
              }}
              className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeRole === 'admin'
                  ? 'bg-slate-900 text-emerald-400 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Admin</span>
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-medium leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {/* Form Login dengan Username & Password */}
          <form onSubmit={handleCredentialSubmit} className="space-y-3.5">
            
            {/* Input Username */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                {activeRole === 'siswa' ? 'Username / NISN Siswa' : 'Username'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder={
                    activeRole === 'guru'
                      ? 'contoh: wali_rpl1'
                      : activeRole === 'siswa'
                      ? 'contoh: siswa_zaky atau 0089123401'
                      : 'contoh: admin'
                  }
                  required
                  className="w-full pl-3.5 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <span className="text-[10px] text-slate-400">
                  Dikelola di Menu Admin
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan password akun Anda"
                  required
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Tombol Submit Masuk */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 px-4 rounded-xl text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 ${
                activeRole === 'guru'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  : activeRole === 'siswa'
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                  : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>
                {activeRole === 'guru'
                  ? 'Masuk Sebagai Wali Kelas'
                  : activeRole === 'siswa'
                  ? 'Masuk ke Portal Siswa'
                  : 'Masuk Sebagai Administrator'}
              </span>
            </button>
          </form>

          {/* Quick Demo Helper Chips */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between font-bold text-slate-600">
              <span className="flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                Akun Demo Terdaftar:
              </span>
              <span className="text-[10px] text-slate-400">Klik untuk isi otomatis</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {activeRole === 'guru' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setUsername('wali_rpl1');
                      setPassword('wali123');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[10px] transition-colors"
                  >
                    XI RPL 1: wali_rpl1 / wali123
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUsername('wali_rpl2');
                      setPassword('wali123');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[10px] transition-colors"
                  >
                    XI RPL 2: wali_rpl2 / wali123
                  </button>
                </>
              )}

              {activeRole === 'siswa' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setUsername('siswa_zaky');
                      setPassword('siswa123');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold text-[10px] transition-colors"
                  >
                    Zaky: siswa_zaky / siswa123
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUsername('siswa_siti');
                      setPassword('siswa123');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold text-[10px] transition-colors"
                  >
                    Siti: siswa_siti / siswa123
                  </button>
                </>
              )}

              {activeRole === 'admin' && (
                <button
                  type="button"
                  onClick={() => {
                    setUsername('admin');
                    setPassword('admin123');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-[10px] transition-colors"
                >
                  Admin: admin / admin123
                </button>
              )}
            </div>
          </div>

          {/* Alternatif Tambahan: Masuk dengan Google Akun Sekolah */}
          {activeRole === 'guru' && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[11px] text-slate-400 block text-center">atau gunakan akun email</span>
              <button
                type="button"
                onClick={handleGoogleSubmit}
                disabled={isLoading}
                className="w-full py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-4 h-4"
                />
                <span>Masuk Akun Google Guru</span>
              </button>
            </div>
          )}

          {/* Quick List Siswa jika mode siswa dipilih */}
          {activeRole === 'siswa' && students.length > 0 && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 block">
                Atau pilih langsung nama siswa dari kelas:
              </span>
              <div className="max-h-32 overflow-y-auto space-y-1.5 divide-y divide-slate-100 pr-1">
                {students.slice(0, 4).map(st => (
                  <div
                    key={st.id}
                    onClick={() => handleStudentSelectSubmit(st)}
                    className="pt-1.5 flex items-center justify-between text-xs hover:bg-indigo-50/50 p-1.5 rounded-lg cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-extrabold text-slate-800 block text-xs">{st.name}</span>
                      <span className="text-[10px] text-slate-400">NISN: {st.nisn || '-'}</span>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-700 hover:underline">
                      Pilih »
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          User &amp; Password dikelola secara terpusat oleh Admin Sekolah SMKN 1 Sidayu
        </div>

      </div>
    </div>
  );
};
