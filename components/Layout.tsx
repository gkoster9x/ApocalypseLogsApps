import React from 'react';
import { Radio, BookOpen, PenTool, Map, Activity, Hammer } from 'lucide-react';
import { AppView } from '../types';

interface LayoutProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, setView, children }) => {
  return (
    <div className="flex h-screen w-full bg-dust-950 text-stone-300 overflow-hidden">
      {/* Sidebar / Navigation */}
      <aside className="w-20 md:w-64 flex-shrink-0 border-r border-stone-800 bg-dust-900 flex flex-col justify-between z-20">
        <div>
          <div className="p-4 md:p-6 flex items-center gap-3 text-rust-500 border-b border-stone-800/50">
            <Radio className="w-6 h-6 animate-pulse-slow" />
            <span className="hidden md:block font-display font-bold tracking-wider text-lg">KÝ ỨC TẬN THẾ</span>
          </div>
          
          <nav className="mt-8 flex flex-col gap-2 px-2">
            <NavButton 
              active={currentView === AppView.DASHBOARD} 
              onClick={() => setView(AppView.DASHBOARD)} 
              icon={<Activity />} 
              label="Tổng Quan" 
            />
            <NavButton 
              active={currentView === AppView.EDITOR} 
              onClick={() => setView(AppView.EDITOR)} 
              icon={<PenTool />} 
              label="Ghi Nhật Ký" 
            />
            <NavButton 
              active={currentView === AppView.ARCHIVE} 
              onClick={() => setView(AppView.ARCHIVE)} 
              icon={<BookOpen />} 
              label="Lưu Trữ" 
            />
            <NavButton 
              active={currentView === AppView.CRAFTING} 
              onClick={() => setView(AppView.CRAFTING)} 
              icon={<Hammer />} 
              label="Chế Tạo" 
            />
            <NavButton 
              active={currentView === AppView.CHAT} 
              onClick={() => setView(AppView.CHAT)} 
              icon={<Map />} 
              label="Trợ Lý AI" 
            />
          </nav>
        </div>

        <div className="p-4 border-t border-stone-800/50 text-xs text-stone-600 text-center md:text-left">
           <span className="hidden md:inline">SYSTEM STATUS: </span>
           <span className="text-emerald-700">ONLINE</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto bg-grid-pattern">
        {/* Scanline overlay effect */}
        <div className="pointer-events-none fixed inset-0 z-50 bg-scanlines opacity-[0.03]"></div>
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full pb-24">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 p-3 rounded-md transition-all duration-200 group
      ${active 
        ? 'bg-stone-800 text-rust-500 shadow-[0_0_10px_rgba(217,119,6,0.1)] border-l-2 border-rust-500' 
        : 'text-stone-500 hover:bg-stone-800/50 hover:text-stone-300'
      }`}
  >
    <span className={`${active ? 'text-rust-500' : 'group-hover:text-stone-300'}`}>{icon}</span>
    <span className="hidden md:block font-medium tracking-tight">{label}</span>
  </button>
);