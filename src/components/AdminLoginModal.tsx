import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  LogIn,
  KeyRound,
  X,
  AlertCircle,
  School,
  Sparkles,
  Check
} from 'lucide-react';
import { UserProfile } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleLogin: () => Promise<void>;
  onPasskeyLogin: (adminProfile: UserProfile) => void;
  currentUser: UserProfile | null;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onGoogleLogin,
  onPasskeyLogin,
  currentUser
}) => {
  const [method, setMethod] = useState<'passkey' | 'google'>('passkey');
  const [passkey, setPasskey] = useState('');
  const [adminName, setAdminName] = useState('Drs. H. Miftahul Huda, M.Pd.');
  const [adminRole, setAdminRole] = useState<'super_admin' | 'admin_kesiswaan' | 'admin_kurikulum'>('super_admin');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const validPasskeys = ['admin123', 'smkn1sidayu', 'kepsek2026', 'admin'];

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <span>Login Administrator Sekolah</span>
              </h3>
              <p className="text-xs text-slate-300">
                Akses Pengawas, Kepala Sekolah & Kesiswaan
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

        {/* Tab Toggle (Passkey vs Google Auth) */}
        <div className="p-5 space-y-4">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMethod('passkey');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                method === 'passkey'
                  ? 'bg-white text-emerald-800 shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Kunci Akses / PIN Admin</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMethod('google');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                method === 'google'
                  ? 'bg-white text-emerald-800 shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Google Admin Login</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* METHOD 1: PASSKEY / PIN */}
          {method === 'passkey' && (
            <form onSubmit={handlePasskeySubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Jabatan / Peran Administrator *
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
                  <span className="text-[10px] text-slate-400 font-normal">Contoh: admin123</span>
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

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 leading-relaxed">
                💡 <strong>Kunci cepat terdaftar:</strong> <code>admin123</code> atau <code>smkn1sidayu</code>. Memungkinkan supervisi rombel seluruh sekolah tanpa hambatan.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Masuk ke Portal Administrator</span>
              </button>
            </form>
          )}

          {/* METHOD 2: GOOGLE AUTH */}
          {method === 'google' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-slate-700 leading-relaxed">
                  Email administrator yang terdaftar otomatis dengan hak akses penuh:
                </p>
                <div className="font-mono font-bold text-emerald-800 bg-white p-2 rounded-lg border border-slate-200 text-center">
                  alamifal@smkn1sidayu.sch.id
                </div>
                <p className="text-[11px] text-slate-500">
                  Setelah login dengan akun di atas, sistem akan mengaktifkan otorisasi admin di Firebase Firestore dan membuka portal supervisi sekolah.
                </p>
              </div>

              <button
                type="button"
                disabled={isLoading}
                onClick={handleGoogleSubmit}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>{isLoading ? 'Menghubungkan Akun...' : 'Masuk dengan Akun Google'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
