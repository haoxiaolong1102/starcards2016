import React from 'react';
import { PlusSquare, User, ShoppingBag, LayoutGrid } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto overflow-hidden relative bg-transparent">
      <main className="flex-1 overflow-y-auto pb-20 scroll-smooth no-scrollbar">
        {children}
      </main>

      <nav className="absolute bottom-0 w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-800 pb-safe pt-3 px-6 z-50 text-white rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
        <div className="flex justify-between items-end pb-3">
          <button 
            onClick={() => onTabChange('home')}
            className={`flex flex-col items-center gap-1.5 w-16 transition-all duration-300 ${activeTab === 'home' ? 'text-violet-400 scale-105' : 'text-slate-400'}`}
          >
            <LayoutGrid size={22} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            <span className="text-[10px] font-medium tracking-wide">拼盒大厅</span>
          </button>
          
          <button 
             onClick={() => onTabChange('merchants')}
             className={`flex flex-col items-center gap-1.5 w-16 transition-all duration-300 ${activeTab === 'merchants' ? 'text-violet-400 scale-105' : 'text-slate-400'}`}
          >
            <ShoppingBag size={22} strokeWidth={activeTab === 'merchants' ? 2.5 : 2} />
            <span className="text-[10px] font-medium tracking-wide">入驻商家</span>
          </button>

          {/* Create Button (Floating Accent) */}
          <button 
             onClick={() => onTabChange('create')}
             className="flex flex-col items-center justify-center -mt-8 group"
          >
             <div className="w-12 h-12 bg-violet-600 rounded-xl rotate-45 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.5)] group-active:scale-90 transition-transform duration-200 border border-violet-400">
                <div className="-rotate-45">
                    <PlusSquare size={24} color="white" />
                </div>
             </div>
             <span className="text-[10px] font-medium text-slate-400 mt-2">发车</span>
          </button>

          <button 
             onClick={() => onTabChange('profile')}
             className={`flex flex-col items-center gap-1.5 w-16 transition-all duration-300 ${activeTab === 'profile' ? 'text-violet-400 scale-105' : 'text-slate-400'}`}
          >
            <User size={22} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
            <span className="text-[10px] font-medium tracking-wide">我的</span>
          </button>
        </div>
      </nav>
    </div>
  );
};