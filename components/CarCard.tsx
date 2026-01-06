import React from 'react';
import { Car, HostType, CarStatus } from '../types';
import { Star, Zap, ShieldCheck, Users } from 'lucide-react';

interface CarCardProps {
  car: Car;
  onClick: (car: Car) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onClick }) => {
  const totalSpots = car.slots.reduce((acc, s) => acc + s.totalSpots, 0);
  const takenSpots = car.slots.reduce((acc, s) => acc + s.takenSpots, 0);
  const percent = Math.round((takenSpots / totalSpots) * 100);

  // Price calculation
  const prices = car.slots.map(s => s.price);
  const minPrice = Math.min(...prices);
  
  return (
    <div 
      onClick={() => onClick(car)}
      className="group bg-white rounded-lg overflow-hidden border border-slate-100 shadow-sm active:scale-[0.98] transition-all duration-200 cursor-pointer flex flex-col h-full"
    >
      {/* Image Area - Aspect Ratio 1:1 or 4:3 */}
      <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden">
        <img 
            src={car.coverImage} 
            alt={car.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        
        {/* Status Badge */}
        <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
            {car.status === CarStatus.RECRUITING && (
                 <span className="bg-violet-600/90 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded font-bold shadow-sm">
                    {car.boxCount}箱团
                 </span>
            )}
            {/* Tag overlay */}
            {car.tags.slice(0, 1).map((tag, i) => (
                <span key={i} className="bg-black/60 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded">
                    {tag}
                </span>
            ))}
        </div>
        
        {/* Host Avatar Overlay (Bottom Right of Image) */}
        <div className="absolute bottom-2 right-2 flex items-center">
            <div className={`w-6 h-6 rounded-full border border-white overflow-hidden shadow-md flex items-center justify-center ${car.hostType === HostType.MERCHANT ? 'bg-blue-600' : 'bg-pink-500'}`}>
                 <img src={`https://picsum.photos/seed/${car.hostName}/100`} className="w-full h-full object-cover" />
            </div>
            {/* Host Type Badge */}
            <div className={`absolute -bottom-1 -right-1 text-[8px] px-1 rounded-full font-bold border border-white text-white ${car.hostType === HostType.MERCHANT ? 'bg-blue-600' : 'bg-pink-500'}`}>
                {car.hostType === HostType.MERCHANT ? '商' : '粉'}
            </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-2.5 flex flex-col flex-1 justify-between">
        <div>
            <h3 className="font-bold text-slate-900 text-xs leading-4 line-clamp-2 mb-1.5 h-8">
                {car.title.replace(/【.*?】/, '')} {/* Strip brackets for cleaner grid look */}
            </h3>
            
            {/* Host Name & Rating */}
            <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-2">
                <span className="truncate max-w-[80px]">{car.hostName}</span>
                {car.hostType === HostType.MERCHANT && <ShieldCheck size={10} className="text-blue-500" />}
                <div className="flex items-center text-orange-400 bg-orange-50 px-1 rounded-sm ml-auto">
                    <Star size={8} fill="currentColor" />
                    <span className="ml-0.5 font-bold">{car.hostRating}</span>
                </div>
            </div>
            
            {/* Type B Binding Info */}
            {car.hostType === HostType.FAN_LEADER && car.supplierName && (
                <div className="text-[9px] text-slate-400 bg-slate-50 px-1 py-0.5 rounded mb-1 truncate">
                    供货: {car.supplierName}
                </div>
            )}
        </div>

        {/* Footer: Progress & Price */}
        <div>
            {/* Progress Bar */}
            <div className="flex items-center gap-2 mb-1.5">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full ${percent >= 80 ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-slate-300'}`} 
                        style={{ width: `${percent}%` }}
                    ></div>
                </div>
                <span className={`text-[10px] font-bold ${percent >= 80 ? 'text-red-500' : 'text-slate-400'}`}>
                    {percent}%
                </span>
            </div>

            <div className="flex items-end justify-between">
                <div className="flex items-baseline gap-0.5 text-violet-700">
                    <span className="text-[10px]">¥</span>
                    <span className="text-sm font-bold">{minPrice}</span>
                    <span className="text-[10px] text-slate-400 font-normal">起</span>
                </div>
                <div className="text-[10px] text-slate-400">
                    缺{totalSpots - takenSpots}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};