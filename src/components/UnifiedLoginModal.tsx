import React, { useState } from 'react';
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
  UserCheck
} from 'lucide-react';
import { UserProfile, Student } from '../types';

interface UnifiedLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleLogin: () => Promise<void>;
  onPasskeyLogin: (adminProfile: UserProfile) => void;
  onStudentLogin: (student: Student) => void;
  students: Student[];
  currentUser: UserProfile | null;
}

export const UnifiedLoginModal: React.FC<UnifiedLoginModalProps> = ({
  isOpen,
  onClose,
  onGoogleLogin,
  onPasskeyLogin,
  onStudentLogin,
  students,
  currentUser
}) => {
  const [activeRole, setActiveRole] = useState<'guru' | 'siswa' | 'admin'>('guru');

  // Admin form state
  const [passkey, setPasskey] = useState('');
  const [adminName, setAdminName] = useState('Drs. H. Miftahul Huda, M.Pd.');
  const [adminRole, setAdminRole] = useState<'super_admin' | 'admin_kesiswaan' | 'admin_kurikulum'>('super_admin');

  // Student form state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [nisnInput, setNisnInput] = useState('');

  // General state
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const validPasskeys = ['admin123', 'smkn1sidayu', 'kepsek2026', 'admin'];

  // Handle Admin Passkey Login
  const handlePasskeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validPasskeys.includes(passkey.trim().toLowerCase())) {
      setErrorMsg('Kunci akses admin salah. Coba: admin123 atau smkn1sidayu');
      return;
    }

    const roleTitle =
      adminRole === 'super_admin'
        ? 'Kepala Sekolah (Super Admin)'
        : adminRole === 'admin_kesiswaan'
        ? 'Wakasek Bidang Kesiswaan'
        : 'Wakasek Bidang Kurikulum';

    const adminProfile: UserProfile = {
      id: `admin_${Date.now()}`,
      email: 'alamifal@smkn1sidayu.sch.id',
      displayName: `${adminName} (${roleTitle})`,
      schoolName: 'SMKN 1 Sidayu',
      role: 'admin',
      nip: '19680514 199412 1 002',
      createdAt: new Date().toISOString()
    };

    onPasskeyLogin(adminProfile);
    onClose();
  };

  // Handle Google Login for Guru / Wali Kelas
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

  // Handle Student / Parent Login
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    let foundStudent: Student | undefined;

    if (selectedStudentId) {
      foundStudent = students.find(s => s.id === selectedStudentId);
    } else if (nisnInput.trim()) {
      foundStudent = students.find(
        s => s.nisn.trim() === nisnInput.trim() || s.nis.trim() === nisnInput.trim()
      );
    }

    if (!foundStudent && students.length > 0) {
      foundStudent = students[0];
    }

    if (!foundStudent) {
      setErrorMsg('Data siswa tidak ditemukan. Silakan pilih dari daftar rombel kelas.');
      return;
    }

    onStudentLogin(foundStudent);
    onClose();
  };

  const filteredStudents = students.filter(
    s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery) ||
      s.nis.includes(searchQuery)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-xs">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                Portal Masuk Akun
              </h3>
              <p className="text-xs text-slate-300">
                Wali Kelas • Siswa & Wali Murid • Administrator
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
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveRole('guru');
                setErrorMsg('');
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
              }}
              className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeRole === 'siswa'
                  ? 'bg-white text-indigo-800 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Login Siswa</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveRole('admin');
                setErrorMsg('');
              }}
              className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeRole === 'admin'
                  ? 'bg-white text-slate-900 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Admin</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: GURU / WALI KELAS */}
          {activeRole === 'guru' && (
            <div className="space-y-4 py-1">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Akses Penuh Wali Kelas Terintegrasi</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Kelola buku induk siswa, presensi real-time, buku nilai & KKM, evaluasi 10 karakter Pancasila, komunikasi WhatsApp orang tua, serta penyusunan laporan resmi.
                </p>
              </div>

              <button
                type="button"
                disabled={isLoading}
                onClick={handleGoogleSubmit}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>{isLoading ? 'Menghubungkan Akun...' : 'Masuk dengan Akun Google (Wali Kelas)'}</span>
              </button>

              <p className="text-center text-[11px] text-slate-500">
                Terhubung langsung dengan cloud Firebase Firestore SMKN 1 Sidayu
              </p>
            </div>
          )}

          {/* TAB 2: SISWA & ORANG TUA */}
          {activeRole === 'siswa' && (
            <form onSubmit={handleStudentSubmit} className="space-y-3.5 py-1 text-xs">
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-900 font-bold">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  <span>Portal Transparansi Belajar Siswa</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Siswa dan orang tua dapat memantau kehadiran harian, grafik nilai tugas/ujian, catatan karakter, serta capaian prestasi secara mandiri.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Pilih Nama Siswa (Kelas XI RPL 1) *
                </label>
                {students.length > 0 ? (
                  <select
                    value={selectedStudentId}
                    onChange={e => {
                      setSelectedStudentId(e.target.value);
                      const st = students.find(s => s.id === e.target.value);
                      if (st) setNisnInput(st.nisn);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none font-semibold text-slate-800 bg-white"
                  >
                    <option value="">-- Pilih Nama Siswa dari Rombel --</option>
                    {students.map(st => (
                      <option key={st.id} value={st.id}>
                        {st.name} (NISN: {st.nisn})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-100 text-slate-500 text-xs text-center">
                    Belum ada data siswa terhubung. Masukkan NISN di bawah:
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Atau Masukkan NISN Siswa</span>
                  <span className="text-[10px] text-slate-400 font-normal">Contoh: 0078912345</span>
                </label>
                <input
                  type="text"
                  value={nisnInput}
                  onChange={e => setNisnInput(e.target.value)}
                  placeholder="Masukkan 10 digit NISN siswa"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none font-mono text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <Users className="w-4 h-4" />
                <span>Masuk sebagai Siswa / Wali Murid</span>
              </button>
            </form>
          )}

          {/* TAB 3: ADMINISTRATOR / PENGAWAS */}
          {activeRole === 'admin' && (
            <form onSubmit={handlePasskeySubmit} className="space-y-3.5 py-1 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Jabatan Administrator / Pengawas *
                </label>
                <select
                  value={adminRole}
                  onChange={e => setAdminRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none font-semibold text-slate-800"
                >
                  <option value="super_admin">Kepala Sekolah (Super Admin)</option>
                  <option value="admin_kesiswaan">Wakil Kepala Sekolah Bidang Kesiswaan</option>
                  <option value="admin_kurikulum">Wakil Kepala Sekolah Bidang Kurikulum</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Pejabat / Pengawas *
                </label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={e => setAdminName(e.target.value)}
                  placeholder="Drs. H. Miftahul Huda, M.Pd."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Kunci Akses / PIN Admin Sekolah *</span>
                  <span className="text-[10px] text-slate-400 font-normal">PIN: admin123</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={passkey}
                    onChange={e => setPasskey(e.target.value)}
                    placeholder="Masukkan kunci akses (admin123)"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                💡 <strong>Kunci cepat terdaftar:</strong> <code>admin123</code> atau <code>smkn1sidayu</code>. Memungkinkan supervisi rombel seluruh sekolah tanpa hambatan.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Masuk ke Portal Administrator</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
