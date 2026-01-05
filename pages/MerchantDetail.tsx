import React from 'react';
import { ChevronLeft, Star, Users, MapPin, MessageSquare } from 'lucide-react';
import { Merchant, Car } from '../types';
import { CarCard } from '../components/CarCard';

interface MerchantDetailProps {
  merchant: Merchant;
  cars: Car[];
  onBack: () => void;
  onCarClick: (car: Car) => void;
}

export const MerchantDetail: React.FC<MerchantDetailProps> = ({ merchant, cars, onBack, onCarClick }) => {
  // Filter cars that belong to this merchant (mock logic: match by name or return all for demo if random name)
  const merchantCars = cars.filter(c => c.hostName === merchant.name || c.hostName.includes("商家")); 

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Banner */}
      <div className="relative h-40 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900 to-slate-900 opacity-90"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
        
        <div className="absolute top-4 left-4 z-10">
            <button onClick={onBack} className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white"><ChevronLeft size={20}/></button>
        </div>
      </div>

      {/* Merchant Profile Card */}
      <div className="relative px-4 -mt-12 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex justify-between items-start">
                <div className="flex items-end gap-3 -mt-10">
                     <img src={merchant.avatar} className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-white" />
                     <div className="mb-1">
                        <h1 className="font-bold text-lg text-slate-900 flex items-center gap-1">
                            {merchant.name}
                            {merchant.isLive && <span className="bg-red-500 text-white text-[9px] px-1.5 rounded animate-pulse">LIVE</span>}
                        </h1>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="flex items-center text-orange-500 font-bold"><Star size={12} fill="currentColor" className="mr-0.5"/> {merchant.rating}</span>
                            <span>•</span>
                            <span>{merchant.fans} 粉丝</span>
                        </div>
                     </div>
                </div>
                <button className="bg-violet-600 text-white text-xs font-bold px-5 py-2 rounded-full shadow-lg shadow-violet-200 active:scale-95 transition">
                    关注
                </button>
            </div>
            
            <p className="text-xs text-slate-500 mt-4 leading-relaxed line-clamp-2">
                {merchant.description}
            </p>

            <div className="flex gap-2 mt-3">
                 {merchant.tags.map(t => (
                     <span key={t} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded">#{t}</span>
                 ))}
            </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 px-6 mb-6">
         <div className="text-center">
            <div className="font-bold text-lg text-slate-900">{merchant.activeCars}</div>
            <div className="text-[10px] text-slate-400">正在拼团</div>
         </div>
         <div className="text-center border-l border-slate-100">
            <div className="font-bold text-lg text-slate-900">1.2k</div>
            <div className="text-[10px] text-slate-400">累计发车</div>
         </div>
         <div className="text-center border-l border-slate-100">
            <div className="font-bold text-lg text-slate-900">100%</div>
            <div className="text-[10px] text-slate-400">发货率</div>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 px-6 border-b border-gray-200 mb-4">
         <button className="pb-2 border-b-2 border-slate-900 font-bold text-sm text-slate-900">全部车队</button>
         <button className="pb-2 border-b-2 border-transparent font-medium text-sm text-slate-400">动态</button>
         <button className="pb-2 border-b-2 border-transparent font-medium text-sm text-slate-400">评价</button>
      </div>

      {/* Car List */}
      <div className="px-4 grid grid-cols-2 gap-3">
         {merchantCars.map(car => (
             <CarCard key={car.id} car={car} onClick={onCarClick} />
         ))}
      </div>
    </div>
  );
};