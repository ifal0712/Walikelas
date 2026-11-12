import React, { useState } from 'react';
import {
  ShieldCheck,
  School,
  Users,
  CalendarCheck,
  Award,
  AlertTriangle,
  GraduationCap,
  Plus,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  FileText,
  Settings,
  Sparkles,
  ArrowRight,
  X,
  Check,
  UserPlus,
  KeyRound,
  Edit2,
  Trash2,
  Lock,
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { Classroom, Student, WelfareCase, UserProfile, ManagedUser, UserRoleType } from '../types';

interface AdminPortalProps {
  currentAdmin: UserProfile;
  classes: Classroom[];
  students: Student[];
  welfareCases: WelfareCase[];
  managedUsers: ManagedUser[];
  onSaveUser: (user: ManagedUser) => void;
  onDeleteUser: (userId: string) => void;
  onSelectClass: (c: Classroom) => void;
  onAddClass: (newClass: Classroom) => void;
  onSwitchToTeacherMode: () => void;
  onLogoutAdmin: () => void;
  onOpenAIWithPrompt: (prompt: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentAdmin,
  classes,
  students,
  welfareCases,
  managedUsers,
  onSaveUser,
  onDeleteUser,
  onSelectClass,
  onAddClass,
  onSwitchToTeacherMode,
  onLogoutAdmin,
  onOpenAIWithPrompt
}) => {
  const [adminTab, setAdminTab] = useState<'overview' | 'users' | 'teachers' | 'supervision' | 'reports'>('overview');
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);

  // New Class Form State
  const [newClassName, setNewClassName] = useState('Kelas XI RPL 2');
  const [newGrade, setNewGrade] = useState('XI (Sebelas)');
  const [newMajor, setNewMajor] = useState('Rekayasa Perangkat Lunak');
  const [newTeacherName, setNewTeacherName] = useState('Siti Fatimah, S.Pd.');

  // User Management State
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});

  // User Form State
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formDisplayName, setFormDisplayName] = useState('');
  const [formRole, setFormRole] = useState<UserRoleType>('wali_kelas');
  const [formAssignedClass, setFormAssignedClass] = useState('Kelas XI RPL 1');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formNipOrNisn, setFormNipOrNisn] = useState('');
  const [formStatus, setFormStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');

  // Pre-configured school classes list (combined with live classes)
  const allSchoolClasses: Classroom[] = [
    ...classes,
    ...(classes.some(c => c.name.includes('RPL 2')) ? [] : [{
      id: 'cls_rpl2',
      teacherId: 'teacher_rpl2',
      name: 'Kelas XI RPL 2',
      grade: 'XI (Sebelas)',
      academicYear: '2026/2027',
      semester: 'Ganjil' as const,
      schoolName: 'SMKN 1 Sidayu',
      major: 'Rekayasa Perangkat Lunak',
      targetAttendanceRate: 90,
      createdAt: new Date().toISOString()
    }]),
    ...(classes.some(c => c.name.includes('TKJ 1')) ? [] : [{
      id: 'cls_tkj1',
      teacherId: 'teacher_tkj1',
      name: 'Kelas XII TKJ 1',
      grade: 'XII (Dua Belas)',
      academicYear: '2026/2027',
      semester: 'Ganjil' as const,
      schoolName: 'SMKN 1 Sidayu',
      major: 'Teknik Komputer & Jaringan',
      targetAttendanceRate: 90,
      createdAt: new Date().toISOString()
    }]),
    ...(classes.some(c => c.name.includes('DKV 1')) ? [] : [{
      id: 'cls_dkv1',
      teacherId: 'teacher_dkv1',
      name: 'Kelas X DKV 1',
      grade: 'X (Sepuluh)',
      academicYear: '2026/2027',
      semester: 'Ganjil' as const,
      schoolName: 'SMKN 1 Sidayu',
      major: 'Desain Komunikasi Visual',
      targetAttendanceRate: 90,
      createdAt: new Date().toISOString()
    }])
  ];

  // Teachers directory
  const homeroomTeachers = [
    { name: 'Mohammad Alamifal, S.Pd., M.Kom.', nip: '19850920 201101 1 009', classAssigned: 'Kelas XI RPL 1', email: 'alamifal@smkn1sidayu.sch.id', status: 'Laporan Lengkap' },
    { name: 'Siti Fatimah, S.Pd.', nip: '19890412 201402 2 004', classAssigned: 'Kelas XI RPL 2', email: 'sitifatimah@smkn1sidayu.sch.id', status: 'Laporan Lengkap' },
    { name: 'Drs. Hendro Wibowo', nip: '19740315 199903 1 003', classAssigned: 'Kelas XII TKJ 1', email: 'hendro@smkn1sidayu.sch.id', status: 'Menunggu Review' },
    { name: 'Rina Kusuma Wardhani, M.Ds.', nip: '19920108 201903 2 011', classAssigned: 'Kelas X DKV 1', email: 'rinakusuma@smkn1sidayu.sch.id', status: 'Laporan Lengkap' }
  ];

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    const createdClass: Classroom = {
      id: `cls_${Date.now()}`,
      teacherId: `teacher_${Date.now()}`,
      name: newClassName,
      grade: newGrade,
      academicYear: '2026/2027',
      semester: 'Ganjil',
      schoolName: 'SMKN 1 Sidayu',
      major: newMajor,
      targetAttendanceRate: 90,
      createdAt: new Date().toISOString()
    };
    onAddClass(createdClass);
    setIsAddClassOpen(false);
  };

  // Open User Modal for Add
  const handleOpenAddUser = () => {
    setEditingUserId(null);
    setFormUsername('');
    setFormPassword('smkn1sidayu2026');
    setFormDisplayName('');
    setFormRole('wali_kelas');
    setFormAssignedClass('Kelas XI RPL 1');
    setFormEmail('');
    setFormPhone('');
    setFormNipOrNisn('');
    setFormStatus('Aktif');
    setIsUserModalOpen(true);
  };

  // Open User Modal for Edit
  const handleOpenEditUser = (user: ManagedUser) => {
    setEditingUserId(user.id);
    setFormUsername(user.username);
    setFormPassword(user.password);
    setFormDisplayName(user.displayName);
    setFormRole(user.role);
    setFormAssignedClass(user.assignedClassName || 'Kelas XI RPL 1');
    setFormEmail(user.email || '');
    setFormPhone(user.phone || '');
    setFormNipOrNisn(user.nipOrNisn || '');
    setFormStatus(user.status);
    setIsUserModalOpen(true);
  };

  // Submit User Form (Add or Edit)
  const handleUserFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const userToSave: ManagedUser = {
      id: editingUserId || `usr_${Date.now()}`,
      username: formUsername.trim().toLowerCase(),
      password: formPassword.trim(),
      displayName: formDisplayName.trim(),
      role: formRole,
      assignedClassName: formAssignedClass,
      assignedClassId: formRole === 'wali_kelas' ? (classes.find(c => c.name === formAssignedClass)?.id || 'cls_rpl1') : undefined,
      email: formEmail.trim(),
      phone: formPhone.trim(),
      nipOrNisn: formNipOrNisn.trim(),
      status: formStatus,
      createdAt: editingUserId ? (managedUsers.find(u => u.id === editingUserId)?.createdAt || now) : now,
      updatedAt: now
    };

    onSaveUser(userToSave);
    setIsUserModalOpen(false);
  };

  // Toggle show/hide password
  const toggleRevealPassword = (id: string) => {
    setRevealedPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filtered Users List
  const filteredUsers = managedUsers.filter(u => {
    const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const matchSearch =
      u.displayName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      (u.assignedClassName && u.assignedClassName.toLowerCase().includes(userSearchQuery.toLowerCase())) ||
      (u.nipOrNisn && u.nipOrNisn.includes(userSearchQuery));
    return matchRole && matchSearch;
  });

  return (
    <div className="w-full space-y-6 animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Banner & Title */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Portal Administrator &amp; Pengelolaan Pengguna SMKN 1 Sidayu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang, {currentAdmin.displayName}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
              Panel kendali terpusat untuk Kepala Sekolah, Wakasek Kesiswaan, dan Administrator dalam mengelola akun pengguna (user &amp; password wali kelas, siswa, guru), memantau rombel, dan supervisi kesiswaan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenAIWithPrompt(`Tolong susun analisis eksekutif komprehensif tingkat sekolah untuk Kepala Sekolah dan Tim Pengawas SMKN 1 Sidayu, mencakup koordinasi seluruh rombel kejuruan, akun wali kelas aktif, rekap kasus kesejahteraan BK, dan audit kedisiplinan semester berjalan.`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Analisis Eksekutif AI</span>
            </button>

            <button
              onClick={onSwitchToTeacherMode}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 backdrop-blur-sm transition-all"
            >
              <span>Buka Ruang Wali Kelas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* School KPIs Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Total Rombel Aktif</span>
          <div className="text-2xl font-bold text-slate-900">{allSchoolClasses.length} Kelas</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            Tingkat X, XI, XII
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Akun User Terdaftar</span>
          <div className="text-2xl font-bold text-indigo-700">{managedUsers.length} Akun</div>
          <span className="text-[11px] text-indigo-600 font-semibold mt-1 inline-block">
            Dikelola Admin
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Guru Wali Kelas</span>
          <div className="text-2xl font-bold text-slate-900">
            {managedUsers.filter(u => u.role === 'wali_kelas').length || homeroomTeachers.length} Guru
          </div>
          <span className="text-[11px] text-slate-500 mt-1 inline-block">
            Terhubung &amp; Aktif
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Siswa Terpantau</span>
          <div className="text-2xl font-bold text-slate-900">{students.length} Siswa</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            Rombel XI RPL 1
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Kasus BK &amp; Kesejahteraan</span>
          <div className="text-2xl font-bold text-amber-600">
            {welfareCases.filter(w => w.status !== 'Selesai').length} Kasus
          </div>
          <span className="text-[11px] text-amber-700 font-semibold mt-1 inline-block">
            Pendampingan Suportif
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Standar KKM Sekolah</span>
          <div className="text-2xl font-bold text-slate-900">75.0</div>
          <span className="text-[11px] text-slate-500 mt-1 inline-block">
            Kurikulum Merdeka
          </span>
        </div>
      </div>

      {/* Admin Nav Subtabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2 overflow-x-auto text-xs font-bold">
        <div className="flex items-center gap-1.5">
          {[
            { id: 'overview', label: 'Ringkasan Rombel Sekolah', icon: School },
            { id: 'users', label: 'Kelola Pengguna (User & Password)', icon: KeyRound },
            { id: 'teachers', label: 'Direktori Guru Wali Kelas', icon: Users },
            { id: 'supervision', label: 'Supervisi BK & Kesiswaan', icon: AlertTriangle },
            { id: 'reports', label: 'Audit Dokumen Laporan', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {adminTab === 'users' ? (
          <button
            onClick={handleOpenAddUser}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors shrink-0 shadow-2xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah User &amp; Password</span>
          </button>
        ) : (
          <button
            onClick={() => setIsAddClassOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shrink-0 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Rombel Kelas</span>
          </button>
        )}
      </div>

      {/* TAB 1: KELOLA PENGGUNA (USER & PASSWORD) - FITUR UTAMA PERMINTAAN USER */}
      {adminTab === 'users' && (
        <div className="space-y-5">
          
          {/* Controls Bar: Filter Role, Search, Count */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-500">Filter Peran:</span>
              <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
                {[
                  { id: 'all', label: 'Semua User' },
                  { id: 'wali_kelas', label: 'Wali Kelas' },
                  { id: 'siswa', label: 'Siswa' },
                  { id: 'guru_bk', label: 'Guru BK' },
                  { id: 'admin', label: 'Admin' }
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setUserRoleFilter(r.id)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                      userRoleFilter === r.id
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={e => setUserSearchQuery(e.target.value)}
                placeholder="Cari nama, user, atau kelas..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Table of Users */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Pengguna &amp; Nama Lengkap</th>
                    <th className="p-4">Username Login</th>
                    <th className="p-4">Password</th>
                    <th className="p-4">Peran (Role)</th>
                    <th className="p-4">Penugasan / Kelas</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Aksi Kelola</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                        Tidak ada pengguna ditemukan dengan kriteria pencarian ini.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => {
                      const isRevealed = !!revealedPasswords[user.id];
                      return (
                        <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                          
                          {/* Nama & Email */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                                user.role === 'admin' ? 'bg-slate-900' :
                                user.role === 'wali_kelas' ? 'bg-emerald-600' :
                                user.role === 'siswa' ? 'bg-indigo-600' : 'bg-purple-600'
                              }`}>
                                {user.displayName[0]}
                              </div>
                              <div>
                                <span className="font-extrabold text-slate-900 block text-xs sm:text-sm">
                                  {user.displayName}
                                </span>
                                <span className="text-[11px] text-slate-400 block">
                                  {user.nipOrNisn ? `NIP/NISN: ${user.nipOrNisn}` : user.email || '-'}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Username */}
                          <td className="p-4">
                            <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                              {user.username}
                            </span>
                          </td>

                          {/* Password dengan Show/Hide */}
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                                {isRevealed ? user.password : '••••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleRevealPassword(user.id)}
                                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                                title={isRevealed ? 'Sembunyikan' : 'Tampilkan Password'}
                              >
                                {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>

                          {/* Role Badge */}
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${
                              user.role === 'admin'
                                ? 'bg-slate-900 text-emerald-300 border-slate-800'
                                : user.role === 'wali_kelas'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : user.role === 'siswa'
                                ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                                : 'bg-purple-50 text-purple-800 border-purple-200'
                            }`}>
                              {user.role === 'admin' ? 'Super Admin' :
                               user.role === 'wali_kelas' ? 'Wali Kelas' :
                               user.role === 'siswa' ? 'Siswa / Murid' :
                               user.role === 'guru_bk' ? 'Guru BK' : 'Guru Mapel'}
                            </span>
                          </td>

                          {/* Assigned Class */}
                          <td className="p-4 text-slate-700 font-semibold">
                            {user.assignedClassName || '-'}
                          </td>

                          {/* Status */}
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              user.status === 'Aktif'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Aktif' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                              {user.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditUser(user)}
                                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Edit Username / Password"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Apakah Anda yakin ingin menghapus akun ${user.displayName} (${user.username})?`)) {
                                    onDeleteUser(user.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Hapus User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: OVERVIEW / CLASSES LIST */}
      {adminTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Daftar Rombel &amp; Kelas Binaan SMKN 1 Sidayu
            </h3>
            <span className="text-xs text-slate-500">
              Menampilkan {allSchoolClasses.length} rombel aktif
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {allSchoolClasses.map(cls => {
              const isCurrentSelected = cls.id === classes[0]?.id;
              return (
                <div
                  key={cls.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs transition-all relative ${
                    isCurrentSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {isCurrentSelected && (
                    <span className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      Sedang Aktif
                    </span>
                  )}

                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold mb-3">
                    <School className="w-5 h-5 text-emerald-600" />
                  </div>

                  <h4 className="font-extrabold text-base text-slate-900 mb-0.5">{cls.name}</h4>
                  <p className="text-xs text-slate-500 mb-3">{cls.major || 'Kejuruan Teknologi'}</p>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tingkat:</span>
                      <span className="font-semibold text-slate-800">{cls.grade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Presensi:</span>
                      <span className="font-semibold text-emerald-600">{cls.targetAttendanceRate}%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectClass(cls)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Masuk ke Kelas Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: TEACHERS DIRECTORY */}
      {adminTab === 'teachers' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Direktori Guru Wali Kelas</h3>
              <p className="text-xs text-slate-500">Daftar guru yang ditugaskan sebagai wali kelas tahun ajaran 2026/2027</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {homeroomTeachers.length} Wali Kelas Aktif
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Nama Lengkap &amp; Gelar</th>
                  <th className="p-3">NIP</th>
                  <th className="p-3">Kelas Binaan</th>
                  <th className="p-3">Email Dinas</th>
                  <th className="p-3">Status Laporan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {homeroomTeachers.map((t, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{t.name}</td>
                    <td className="p-3 text-slate-500 font-mono">{t.nip}</td>
                    <td className="p-3 font-semibold text-emerald-700">{t.classAssigned}</td>
                    <td className="p-3 text-slate-600">{t.email}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        t.status === 'Laporan Lengkap'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SUPERVISI BK & KESISWAAN */}
      {adminTab === 'supervision' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Rekap Supervisi Kasus Kesiswaan &amp; BK</h3>
              <p className="text-xs text-slate-500">Monitoring lintas rombel untuk pendampingan siswa dan pencegahan putus sekolah</p>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {welfareCases.length} Kasus Tercatat
            </span>
          </div>

          <div className="space-y-3">
            {welfareCases.map(wc => (
              <div key={wc.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">
                      {students.find(s => s.id === wc.studentId)?.name || 'Siswa Kelas XI RPL 1'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900">
                      {wc.triggerCategory}
                    </span>
                    <span className="text-slate-400 text-[11px]">{wc.date}</span>
                  </div>
                  <p className="text-slate-600 max-w-xl">{wc.indications}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-[11px] block sm:inline">
                    Rekomendasi: {wc.actionRecommendation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT DOKUMEN LAPORAN */}
      {adminTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Audit &amp; Rekap Dokumen Laporan Wali Kelas</h3>
              <p className="text-xs text-slate-500">Pengarsipan laporan bulanan, tengah semester, dan akhir semester dari seluruh rombel</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Semua laporan wali kelas diarsipkan secara real-time di Firestore dan diverifikasi oleh tim kurikulum serta kesiswaan SMKN 1 Sidayu.
          </p>
        </div>
      )}

      {/* MODAL USER MANAGEMENT (TAMBAH / EDIT USER & PASSWORD) */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    {editingUserId ? 'Edit Akun & Password Pengguna' : 'Tambah Akun Pengguna Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Kelola kredensial akses untuk Wali Kelas, Siswa, Guru BK, atau Admin
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUserModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUserFormSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Username Login *</label>
                  <input
                    type="text"
                    required
                    value={formUsername}
                    onChange={e => setFormUsername(e.target.value)}
                    placeholder="contoh: wali_rpl3"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Password *</label>
                  <input
                    type="text"
                    required
                    value={formPassword}
                    onChange={e => setFormPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap &amp; Gelar *</label>
                <input
                  type="text"
                  required
                  value={formDisplayName}
                  onChange={e => setFormDisplayName(e.target.value)}
                  placeholder="contoh: Ahmad Zaidan, S.Pd."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Peran (Role) *</label>
                  <select
                    value={formRole}
                    onChange={e => setFormRole(e.target.value as UserRoleType)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-indigo-600 font-semibold cursor-pointer"
                  >
                    <option value="wali_kelas">Wali Kelas</option>
                    <option value="siswa">Siswa / Wali Murid</option>
                    <option value="guru_bk">Guru BK</option>
                    <option value="guru_mapel">Guru Mata Pelajaran</option>
                    <option value="admin">Administrator / Kepala Sekolah</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Penugasan Kelas / Rombel</label>
                  <input
                    type="text"
                    value={formAssignedClass}
                    onChange={e => setFormAssignedClass(e.target.value)}
                    placeholder="contoh: Kelas XI RPL 1"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIP atau NISN</label>
                  <input
                    type="text"
                    value={formNipOrNisn}
                    onChange={e => setFormNipOrNisn(e.target.value)}
                    placeholder="1985... atau 0089..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-indigo-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Akun</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as 'Aktif' | 'Nonaktif')}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-indigo-600 font-semibold cursor-pointer"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Sekolah / Kontak WA</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  placeholder="user@smkn1sidayu.sch.id"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingUserId ? 'Simpan Perubahan' : 'Buat Akun User'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH KELAS */}
      {isAddClassOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <School className="w-5 h-5 text-emerald-400" />
                <span>Tambah Rombel Kelas Baru</span>
              </h3>
              <button
                onClick={() => setIsAddClassOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Rombel / Kelas *</label>
                <input
                  type="text"
                  required
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                  placeholder="Contoh: Kelas XI RPL 2"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tingkat Kelas *</label>
                <select
                  value={newGrade}
                  onChange={e => setNewGrade(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="X (Sepuluh)">X (Sepuluh)</option>
                  <option value="XI (Sebelas)">XI (Sebelas)</option>
                  <option value="XII (Dua Belas)">XII (Dua Belas)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kompetensi Keahlian / Jurusan *</label>
                <input
                  type="text"
                  required
                  value={newMajor}
                  onChange={e => setNewMajor(e.target.value)}
                  placeholder="Rekayasa Perangkat Lunak"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Wali Kelas yang Ditugaskan</label>
                <input
                  type="text"
                  value={newTeacherName}
                  onChange={e => setNewTeacherName(e.target.value)}
                  placeholder="Nama Guru Wali Kelas"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddClassOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Buat Kelas</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
