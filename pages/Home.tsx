import React, { useState } from 'react';
import { Search, Flame, ChevronsRight } from 'lucide-react';
import { CarCard } from '../components/CarCard';
import { Car } from '../types';

interface HomeProps {
  cars: Car[];
  onCarClick: (car: Car) => void;
}

const CATEGORIES = ["推荐", "综艺", "影视", "爱豆", "动漫", "国乙"];

export const Home: React.FC<HomeProps> = ({ cars, onCarClick }) => {
  const [activeCategory, setActiveCategory] = useState("推荐");
  const [search, setSearch] = useState("");

  const filteredCars = cars.filter(c => {
    return c.title.includes(search) || c.ipName.includes(search) || c.slots.some(s => s.name.includes(search));
  });

  return (
    <div className="pb-10 min-h-screen">
      {/* Top Search Area */}
      <div className="sticky top-0 bg-texture z-40 px-4 pt-4 pb-1">
        <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-black text-slate-900 tracking-tight italic">
                STAR<span className="text-violet-600">CARDS</span>
            </h1>
            <div className="text-[10px] font-bold text-slate-400 border border-slate-200 px-2 py-1 rounded-full">
                1,204 车正在进行
            </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3 shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2.5 border-none rounded-xl leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-600/20 transition-all text-sm font-medium shadow-sm"
            placeholder="搜索 IP / 艺人 / 车头"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-4 overflow-x-auto hide-scroll pb-2 border-b border-slate-200/50">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap pb-2 text-sm font-bold transition-all relative ${
                activeCategory === cat 
                  ? 'text-violet-700 scale-105' 
                  : 'text-slate-400'
              }`}
            >
              {cat}
              {activeCategory === cat && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-violet-600 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Banner */}
      <div className="px-4 mt-4">
        <div className="bg-slate-900 rounded-xl p-4 text-white shadow-lg shadow-slate-200 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600 rounded-full blur-[40px] opacity-40 translate-x-10 -translate-y-10"></div>
           <div className="relative z-10 flex justify-between items-center">
             <div>
                <div className="flex items-center gap-1 text-violet-300 font-bold text-xs mb-1">
                    <Flame size={12} fill="currentColor" />
                    今日爆款
                </div>
                <div className="text-lg font-bold leading-tight">《现在就出发3》</div>
                <div className="text-xs text-slate-400 mt-1">全网 800+ 车队正在拼</div>
             </div>
             <button className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold border border-white/10 active:scale-95 transition">
                去看看
             </button>
           </div>
        </div>
      </div>

      {/* Grid Layout for High Density */}
      <div className="px-4 mt-6">
        <div className="flex justify-between items-end mb-3">
            <h2 className="text-sm font-bold text-slate-900">拼盒大厅</h2>
            <div className="text-xs text-slate-400 flex items-center">
                按热度 <ChevronsRight size={14} />
            </div>
        </div>

        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 pb-24">
            {filteredCars.map(car => (
                <CarCard key={car.id} car={car} onClick={onCarClick} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 text-sm">
            暂无相关车队
          </div>
        )}
      </div>
    </div>
  );
};