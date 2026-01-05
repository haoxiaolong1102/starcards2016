import React, { useState } from 'react';
import { ChevronLeft, Share2, Clock, MapPin, Truck, AlertCircle, MessageSquare } from 'lucide-react';
import { Car } from '../types';

interface CarDetailProps {
  car: Car;
  onBack: () => void;
  onPurchase: (items: { name: string; count: number }[], totalCost: number) => void;
}

export const CarDetail: React.FC<CarDetailProps> = ({ car, onBack, onPurchase }) => {
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

  const handleCheckout = () => {
      const items = Object.entries(selectedSlots).map(([id, count]) => {
          const slot = car.slots.find(s => s.id === id);
          return { name: slot?.name || '未知', count };
      });
      onPurchase(items, totalCost);
  };

  return (
    <div className="bg-white min-h-screen relative pb-24">
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
             <button className="bg-black/20 backdrop-blur-md p-2 rounded-full active:scale-90 transition">
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

      {/* Host Info */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
             <img src={`https://picsum.photos/seed/${car.hostName}/200`} className="w-full h-full object-cover" alt="host" />
          </div>
          <div>
            <div className="flex items-center gap-1">
                <span className="font-bold text-sm text-slate-800">{car.hostName}</span>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-1 rounded">信誉 {car.hostRating}</span>
            </div>
            <p className="text-xs text-slate-400">已发车 28 次 · 0 差评</p>
          </div>
        </div>
        <button className="text-violet-600 border border-violet-600 px-3 py-1 rounded-full text-xs font-medium active:bg-violet-50">
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

      {/* Description */}
      <div className="px-4 py-4 border-b border-gray-100">
        <h3 className="font-bold text-sm mb-2 text-slate-800">车头喊话</h3>
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
            const isFull = available === 0;

            return (
              <div key={slot.id} className={`flex items-center justify-between p-3 rounded-xl border ${currentSelected > 0 ? 'border-violet-500 bg-violet-50' : 'border-gray-100 bg-white'}`}>
                <div className="flex items-center gap-3">
                   <div className="relative">
                      <img src={slot.avatarUrl} className={`w-12 h-12 rounded-full object-cover ${isFull ? 'grayscale' : ''}`} alt={slot.name} />
                      {slot.isHot && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] px-1 rounded-full">HOT</span>}
                   </div>
                   <div>
                      <h4 className={`font-bold text-sm ${isFull ? 'text-slate-400' : 'text-slate-800'}`}>{slot.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-violet-600 font-bold text-sm">¥{slot.price}</span>
                          <span className={`text-xs ${available < 3 ? 'text-red-400' : 'text-slate-400'}`}>
                             {isFull ? '已满' : `余 ${available}`}
                          </span>
                      </div>
                   </div>
                </div>

                {/* Counter */}
                {!isFull ? (
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleSlotChange(slot.id, -1, available)}
                      disabled={currentSelected === 0}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-lg leading-none pb-1 transition-colors ${currentSelected === 0 ? 'bg-gray-100 text-gray-400' : 'bg-white border border-violet-200 text-violet-600'}`}
                    >
                      -
                    </button>
                    <span className="w-4 text-center text-sm font-medium">{currentSelected}</span>
                    <button 
                       onClick={() => handleSlotChange(slot.id, 1, available)}
                       disabled={currentSelected >= available}
                       className="w-7 h-7 rounded-full bg-violet-600 text-white flex items-center justify-center text-lg leading-none pb-1 shadow-md active:scale-90 transition"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">满员</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 safe-area-pb z-50 shadow-lg">
         <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex flex-col">
               <span className="text-[10px] text-slate-500">已选 {totalCount} 份</span>
               <div className="flex items-baseline gap-1">
                  <span className="text-xs text-red-500 font-bold">¥</span>
                  <span className="text-xl text-red-500 font-bold">{totalCost}</span>
               </div>
            </div>
            <button 
               onClick={handleCheckout}
               disabled={totalCount === 0}
               className={`px-8 py-3 rounded-full font-bold text-sm shadow-lg transform transition active:scale-95 ${totalCount === 0 ? 'bg-gray-300 text-white cursor-not-allowed' : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'}`}
            >
               立即上车
            </button>
         </div>
      </div>
    </div>
  );
};