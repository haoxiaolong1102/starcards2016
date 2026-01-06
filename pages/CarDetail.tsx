import React, { useState } from 'react';
import { ChevronLeft, Share2, Clock, Truck, AlertCircle, Users, FileText, ChevronRight } from 'lucide-react';
import { Car, CarStatus } from '../types';

interface CarDetailProps {
  car: Car;
  onBack: () => void;
  onPurchase: (items: { name: string; count: number }[], totalCost: number) => void;
  onHostClick: (hostName: string) => void; // Added prop
  showToast: (msg: string) => void;
}

export const CarDetail: React.FC<CarDetailProps> = ({ car, onBack, onPurchase, onHostClick, showToast }) => {
  const [selectedSlots, setSelectedSlots] = useState<Record<string, number>>({});
  
  const handleSlotChange = (slotId: string, delta: number, max: number) => {
    const current = selectedSlots[slotId] || 0;
    const next = Math.max(0, Math.min(current + delta, max));
    
    if (next === 0) {
      const newSlots = { ...selectedSlots };
      delete newSlots[slotId];
      setSelectedSlots(newSlots);
    } else {
      setSelectedSlots({ ...selectedSlots, [slotId]: next });
    }
  };

  const totalCost = car.slots.reduce((acc, slot) => {
    return acc + (selectedSlots[slot.id] || 0) * slot.price;
  }, 0);
  
  const totalCount = Object.values(selectedSlots).reduce((a: number, b: number) => a + b, 0);

  // Stats for Progress
  const totalSpots = car.slots.reduce((acc, s) => acc + s.totalSpots, 0);
  const takenSpots = car.slots.reduce((acc, s) => acc + s.takenSpots, 0);
  const percent = Math.round((takenSpots / totalSpots) * 100);
  const remainingSpots = totalSpots - takenSpots;

  const handleCheckout = () => {
      const items = Object.entries(selectedSlots).map(([id, count]) => {
          const slot = car.slots.find(s => s.id === id);
          return { name: slot?.name || '未知', count };
      });
      onPurchase(items, totalCost);
  };

  const isCarFull = car.status === CarStatus.FULL || car.status === CarStatus.OPENED || car.status === CarStatus.SHIPPED;

  return (
    <div className="bg-white min-h-screen relative pb-32"> 
      {/* Header Image */}
      <div className="relative h-60 bg-gray-200">
        <img src={car.coverImage} className="w-full h-full object-cover" alt="Cover" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>
        
        {/* Nav */}
        <div className="absolute top-4 left-0 w-full px-4 flex justify-between items-center text-white z-10">
          <button onClick={onBack} className="bg-black/20 backdrop-blur-md p-2 rounded-full active:scale-90 transition">
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-3">
             <button onClick={() => showToast("已生成海报链接，请粘贴分享")} className="bg-black/20 backdrop-blur-md p-2 rounded-full active:scale-90 transition">
                <Share2 size={20} />
             </button>
          </div>
        </div>

        {/* Title over Image */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex gap-2 mb-2">
            <span className="bg-violet-600 px-2 py-0.5 rounded text-xs font-bold">拼盒</span>
            <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-xs">{car.ipName}</span>
          </div>
          <h1 className="text-xl font-bold leading-tight">{car.title}</h1>
        </div>
      </div>

      {/* Progress Bar Area (IMPORTANT) */}
      <div className="px-4 py-4 border-b border-gray-100 bg-violet-50/50">
          <div className="flex justify-between items-end mb-2">
              <div className="text-sm font-bold text-slate-800 flex items-center gap-1">
                  <Users size={16} className="text-violet-600" />
                  拼团进度
                  {isCarFull && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded ml-2">已满员</span>}
              </div>
              <div className="text-xs text-slate-500">
                  <span className="text-violet-600 font-bold">{takenSpots}</span> / {totalSpots} 席
              </div>
          </div>
          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden mb-1">
              <div 
                  className={`h-full rounded-full transition-all duration-500 ${isCarFull ? 'bg-green-500' : 'bg-gradient-to-r from-violet-500 to-fuchsia-500'}`} 
                  style={{ width: `${percent}%` }}
              ></div>
          </div>
          <p className="text-[10px] text-slate-400 text-right">
              {isCarFull ? '所有位置已售罄，等待商家开箱' : `还差 ${remainingSpots} 个位置即可开箱`}
          </p>
      </div>

      {/* Host Info - CLICKABLE NOW */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div 
            onClick={() => onHostClick(car.hostName)}
            className="flex items-center gap-2 flex-1 cursor-pointer active:opacity-70 transition-opacity"
        >
          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border border-gray-100">
             <img src={`https://picsum.photos/seed/${car.hostName}/200`} className="w-full h-full object-cover" alt="host" />
          </div>
          <div>
            <div className="flex items-center gap-1">
                <span className="font-bold text-sm text-slate-800">{car.hostName}</span>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-1 rounded">信誉 {car.hostRating}</span>
                <ChevronRight size={14} className="text-slate-300" />
            </div>
            <p className="text-xs text-slate-400">点击查看该商家所有拼团</p>
          </div>
        </div>
        <button 
          onClick={() => showToast("私信功能开发中")}
          className="text-violet-600 border border-violet-600 px-3 py-1 rounded-full text-xs font-medium active:bg-violet-50 ml-2"
        >
          私信
        </button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 px-4 py-4 text-xs text-slate-600 border-b border-gray-100">
        <div className="flex items-center gap-2">
           <Clock size={16} className="text-slate-400"/>
           <span>开箱：9/30 20:00 (直播)</span>
        </div>
        <div className="flex items-center gap-2">
           <Truck size={16} className="text-slate-400"/>
           <span>发货：开箱后3天内</span>
        </div>
        <div className="flex items-center gap-2 col-span-2">
           <AlertCircle size={16} className="text-slate-400"/>
           <span>规则：单人归主，CP卡轮流，周边抽奖</span>
        </div>
      </div>
      
      {/* EXTRA EXPLANATION (Special Note) */}
      {car.extraNote && (
          <div className="mx-4 my-4 bg-orange-50 border border-orange-100 rounded-lg p-3">
              <h3 className="flex items-center gap-1 text-xs font-bold text-orange-700 mb-1">
                  <FileText size={12} /> 特别说明
              </h3>
              <p className="text-xs text-orange-800/80 leading-relaxed whitespace-pre-wrap">
                  {car.extraNote}
              </p>
          </div>
      )}

      {/* Description */}
      <div className="px-4 py-4 border-b border-gray-100">
        <h3 className="font-bold text-sm mb-2 text-slate-800">车头喊话 & 规则</h3>
        <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed bg-gray-50 p-3 rounded-lg">
          {car.description}
        </p>
      </div>

      {/* Slots Selection */}
      <div className="px-4 py-4">
        <h3 className="font-bold text-sm mb-3 text-slate-800">选择位置 (按人头分)</h3>
        <div className="space-y-3">
          {car.slots.map(slot => {
            const available = slot.totalSpots - slot.takenSpots;
            const currentSelected = selectedSlots[slot.id] || 0;
            const isSoldOut = available === 0;

            return (
              <div key={slot.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isSoldOut ? 'bg-gray-50 border-gray-100 opacity-60' : (currentSelected > 0 ? 'border-violet-500 bg-violet-50 shadow-sm' : 'border-gray-100 bg-white')}`}>
                <div className="flex items-center gap-3">
                   <div className="relative">
                      <img src={slot.avatarUrl} className={`w-12 h-12 rounded-full object-cover ${isSoldOut ? 'grayscale' : ''}`} alt={slot.name} />
                      {slot.isHot && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] px-1 rounded-full">HOT</span>}
                   </div>
                   <div>
                      <h4 className={`font-bold text-sm ${isSoldOut ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{slot.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-violet-600 font-bold text-sm">¥{slot.price}</span>
                          <span className={`text-xs ${isSoldOut ? 'text-slate-400' : (available < 3 ? 'text-red-400' : 'text-slate-400')}`}>
                             {isSoldOut ? '已售罄' : `余 ${available}`}
                          </span>
                      </div>
                   </div>
                </div>

                {/* Counter */}
                {!isSoldOut ? (
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleSlotChange(slot.id, -1, available)}
                      disabled={currentSelected === 0}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-lg leading-none pb-1 transition-colors active:scale-90 ${currentSelected === 0 ? 'bg-gray-100 text-gray-400' : 'bg-white border border-violet-200 text-violet-600'}`}
                    >
                      -
                    </button>
                    <span className="w-4 text-center text-sm font-medium">{currentSelected}</span>
                    <button 
                       onClick={() => handleSlotChange(slot.id, 1, available)}
                       disabled={currentSelected >= available}
                       className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-lg leading-none pb-1 shadow-md active:scale-90 transition ${currentSelected >= available ? 'bg-gray-300' : 'bg-violet-600'}`}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
                     被抢光
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 pb-8 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
         <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex flex-col">
               <span className="text-[10px] text-slate-500">已选 {totalCount} 份</span>
               <div className="flex items-baseline gap-1">
                  <span className="text-xs text-red-500 font-bold">¥</span>
                  <span className="text-2xl text-red-500 font-black tracking-tight">{totalCost}</span>
               </div>
            </div>
            
            {/* Logic: If car is FULL, show "Wait for Open". Else if user selected nothing, disable. Else Show "Join". */}
            {isCarFull ? (
               <button 
                  disabled
                  className="px-10 py-3.5 rounded-full font-bold text-sm bg-slate-200 text-slate-500 cursor-not-allowed"
               >
                  已满员，等待开箱
               </button>
            ) : (
               <button 
                  onClick={handleCheckout}
                  disabled={totalCount === 0}
                  className={`px-10 py-3.5 rounded-full font-bold text-sm shadow-xl transform transition active:scale-95 ${totalCount === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white animate-pulse'}`}
               >
                  {totalCount === 0 ? '请先选位置' : '立即上车'}
               </button>
            )}
         </div>
      </div>
    </div>
  );
};