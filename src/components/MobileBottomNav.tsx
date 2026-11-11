import React from 'react';
import {
  LayoutGrid,
  Users,
  CalendarCheck,
  GraduationCap,
  Sparkles,
  TrendingUp
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  onOpenAI: () => void;
  studentCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onNavigateTab,
  onOpenAI,
  studentCount
}) => {
  const navItems = [
    { id: 'menu_hub', label: 'Menu Kartu', icon: LayoutGrid },
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'students', label: 'Siswa', icon: Users, badge: studentCount },
    { id: 'attendance', label: 'Presensi', icon: CalendarCheck },
    { id: 'grades', label: 'Nilai', icon: GraduationCap }
  ];

  // When on subpages, hide the menus completely and show ergonomic Android back button
  if (activeTab !== 'menu_hub') {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-[max(0.75rem,env(safe-area-inset-bottom))] print:hidden">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <button
            onClick={() => onNavigateTab('menu_hub')}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Kembali ke Menu Utama</span>
          </button>

          <button
            onClick={onOpenAI}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-slate-900 active:scale-95 text-emerald-400 text-xs font-bold transition-all shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>AI Kelas</span>
          </button>
        </div>
      </nav>
    );
  }

  // On Menu Utama (menu_hub), no bottom menu bar needed as the cards fill the screen
  return null;
};

