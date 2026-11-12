import React, { useState } from 'react';
import {
  LayoutGrid,
  TrendingUp,
  Users,
  CalendarCheck,
  GraduationCap,
  Sparkles,
  Scale,
  Award,
  MessageSquare,
  HeartHandshake,
  FileText,
  UserCheck,
  ShieldCheck,
  Bot,
  Home,
  X,
  ChevronLeft,
  ChevronRight,
  Menu,
  LogIn,
  LogOut,
  Sliders,
  Compass
} from 'lucide-react';
import { UserProfile } from '../types';

interface SideNavigationGridProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTab: string;
  onNavigateTab: (tabId: string) => void;
  currentUser: UserProfile | null;
  isAdmin: boolean;
  isAdminView: boolean;
  onToggleAdminView: (show: boolean) => void;
  onOpenAI: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  studentsCount: number;
  achievementsCount: number;
  welfareCount: number;
}

export const SideNavigationGrid: React.FC<SideNavigationGridProps> = ({
  isOpen,
  onToggle,
  activeTab,
  onNavigateTab,
  currentUser,
  isAdmin,
  isAdminView,
  onToggleAdminView,
  onOpenAI,
  onOpenLogin,
  onLogout,
  studentsCount,
  achievementsCount,
  welfareCount
}) => {
  const [filterSection, setFilterSection] = useState<'all' | 'akademik' | 'kesiswaan' | 'portal'>('all');

  // Master Menu Items for Grid
  const menuItems = [
    {
      id: 'landing',
      label: 'Beranda Publik',
      sublabel: 'Diagram Kesiswaan',
      icon: Home,
      section: 'portal',
      color: 'from-slate-700 to-slate-900',
      badge: 'Publik',
      action: () => {
        if (currentUser) {
          onLogout();
        } else {
          onNavigateTab('landing');
        }
      }
    },
    {
      id: 'menu_hub',
      label: 'Menu Kartu',
      sublabel: 'Alur Kerja Utama',
      icon: LayoutGrid,
      section: 'portal',
      color: 'from-emerald-500 to-teal-600',
      badge: 'Hub',
      action: () => {
        if (isAdminView) onToggleAdminView(false);
        onNavigateTab('menu_hub');
      }
    },
    {
      id: 'dashboard',
      label: 'Dashboard Kelas',
      sublabel: 'Statistik & Analitik',
      icon: TrendingUp,
      section: 'akademik',
      color: 'from-teal-600 to-cyan-600',
      action: () => {
        if (isAdminView) onToggleAdminView(false);
        onNavigateTab('dashboard');
      }
    },
    {
      id: 'students',
      label: 'Data Siswa',
      sublabel: 'Buku Induk & Rombel',
      icon: Users,
      section: 'kesiswaan',
      color: 'from-blue-600 to-indigo-600',
      badge: `${studentsCount} Siswa`,
      action: () => {
        if (isAdminView) onToggleAdminView(false);
        onNavigateTab('students');
      }
    },
    {
      id: 'attendance',
      label: 'Presensi Harian',
      sublabel: 'Rekap & Deteksi Alfa',
      icon: CalendarCheck,
      section: 'kesiswaan',
      color: 'from-indigo-600 to-violet-600',
      action: () => {
        if (isAdminView) onToggleAdminView(false);
        onNavigateTab('attendance');
      }
    },
    {
      id: 'grades',
      label: 'Hasil Belajar',
      sublabel: 'PTS, PAS & Nilai KKM',
      icon: GraduationCap,
      section: 'akademik',
      color: 'from-cyan-600 to-blue-700',
      action: () => {
        if (isAdminView) onToggleAdminView(false);
        onNavigateTab('grades');
      }
    },
    {
      id: 'character',
      label: '8 Dimensi Profil',
      sublabel: 'Karakter Lulusan SMK',
      icon: Sparkles,
      section: 'akademik',
      color: 'from-purple-600 to-pink-600',
      badge: '8 Dimensi',
      action: () => {
        if (isAdminView) onToggleAdminView(false);
        onNavigateTab('character');
      }
    },
    {
      id: 'discipline',
      label: 'Kedisiplinan',
      sublabel: 'Tata Tertib & Bimbingan',
      icon: Scale,
      section: 'kesiswaan',
      color: 'from-amber-600 to-orange-600',
      action: () => {
        if (isAdminView) onToggleAdminView(false);
        onNavigateTab('discipline');
      }
    },
    {
      id: 'achievements',
      label: 'Prestasi Juara',
      sublabel: 'Portofolio Kejuaraan',
      icon: Award,
      section: 'kesiswaan',
      color: 'from-amber-500 to-yellow-600',
      badge: `${achievementsCount} Juara`,
      action: () => {
        if (isAdminView) onToggleAdminView(false);
        onNavigateTab('achievements');
      }
    },
    {
      id: 'communication',
      label: 'Komunikasi Ortu',
      sublabel: 'WhatsApp & Surat Resmi',
      icon: MessageSquare,
      section: 'kesiswaan',
      color: 'from-emerald-600 to-green-700',
      action: () => {
        if (isAdminView) onToggleAdminView(false);
        onNavigateTab('communication');
      }
    },
    {
      id: 'welfare',
      label: 'Kesejahteraan BK',
      sublabel: 'Konseling & Advokasi',
      icon: HeartHandshake,
      section: 'kesiswaan',
      color: 'from-rose-500 to-pink-600',
      badge: welfareCount > 0 ? `${welfareCount} Kasus` : undefined,
      action: () => {
        if (isAdminView) onToggleAdminView(false);
        onNavigateTab('welfare');
      }
    },
    {
      id: 'reports',
      label: 'Laporan Kelas',
      sublabel: 'Arsip Bulanan & Rapor',
      icon: FileText,
      section: 'akademik',
      color: 'from-slate-700 to-slate-900',
      action: () => {
        if (isAdminView) onToggleAdminView(false);
        onNavigateTab('reports');
      }
    },
    {
      id: 'admin_portal',
      label: 'Portal Admin',
      sublabel: 'Kelola User & Supervisi',
      icon: ShieldCheck,
      section: 'portal',
      color: 'from-slate-900 to-emerald-950',
      badge: 'Super Admin',
      action: () => {
        if (isAdmin) {
          onToggleAdminView(true);
        } else {
          onOpenLogin();
        }
      }
    },
    {
      id: 'ai_assistant',
      label: 'Asisten AI Kelas',
      sublabel: 'Konsultasi Gemini AI',
      icon: Bot,
      section: 'portal',
      color: 'from-indigo-600 via-purple-600 to-pink-600',
      badge: 'AI Cerdas',
      action: () => {
        onOpenAI();
      }
    }
  ];

  const filteredItems = menuItems.filter(item => {
    if (filterSection === 'all') return true;
    return item.section === filterSection;
  });

  return (
    <>
      {/* 1. FLOATING TOGGLE BUTTON (Selalu muncul di semua tampilan saat side nav disembunyikan) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          title="Tampilkan Side Navigation (Grid Menu)"
          aria-label="Tampilkan Side Navigation Menu"
          className="fixed left-3 top-20 sm:top-24 z-40 p-2.5 sm:px-3.5 sm:py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 text-white shadow-xl hover:shadow-2xl backdrop-blur-md border border-slate-700 flex items-center gap-2 group transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <span className="text-xs font-black tracking-wide hidden sm:inline text-emerald-400">
            Grid Menu
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* 2. BACKDROP OVERLAY ON MOBILE / TABLET */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          title="Klik di luar untuk menyembunyikan navigasi"
        />
      )}

      {/* 3. SIDE NAVIGATION DRAWER / PANEL (BISA DISEMBUNYIKAN) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-80 sm:w-96 bg-white/95 backdrop-blur-xl border-r border-slate-200 shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Side Navigation */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white flex items-center gap-1.5">
                <span>Navigasi Grid Cerdas</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-400/20 text-emerald-300">
                  Semua Akses
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">
                Pilih modul kerja atau navigasi cepat
              </p>
            </div>
          </div>

          {/* Tombol Sembunyikan */}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Sembunyikan Side Navigation"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Section Chips */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-1 text-[11px] font-bold overflow-x-auto">
          <span className="text-slate-400 pl-1 text-[10px] uppercase font-bold tracking-wider">
            Filter:
          </span>
          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'akademik', label: 'Akademik' },
              { id: 'kesiswaan', label: 'Kesiswaan' },
              { id: 'portal', label: 'Portal' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterSection(f.id as any)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterSection === f.id
                    ? 'bg-emerald-600 text-white shadow-2xs font-black'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body Grid of Menu Icons */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4">
          <div className="grid grid-cols-2 gap-2.5">
            {filteredItems.map(item => {
              const Icon = item.icon;
              const isItemActive =
                (item.id === 'admin_portal' && isAdminView) ||
                (activeTab === item.id && !isAdminView);

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    // On mobile, auto-close after clicking
                    if (window.innerWidth < 768) {
                      onToggle();
                    }
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between group cursor-pointer relative overflow-hidden ${
                    isItemActive
                      ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 w-full mb-2">
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {item.badge && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 truncate max-w-[65px]">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
                      {item.label}
                    </h4>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {item.sublabel}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer User Info & Quick Logout / Login */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2 text-xs">
          {currentUser ? (
            <div className="flex items-center justify-between w-full gap-2">
              <div className="flex items-center gap-2 truncate">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0">
                  {currentUser.displayName[0]}
                </div>
                <div className="truncate">
                  <span className="font-bold text-slate-900 block text-xs truncate">
                    {currentUser.displayName}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {currentUser.role === 'admin' ? 'Super Admin' : currentUser.role === 'siswa' ? 'Siswa' : 'Wali Kelas'}
                  </span>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Keluar / Ganti Akun"
                className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] text-slate-500 font-medium">
                Mode Publik (Tanpa Login)
              </span>
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk Sistem</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
