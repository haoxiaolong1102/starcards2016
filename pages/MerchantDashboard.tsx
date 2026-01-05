import React, { useState } from 'react';
import { ChevronLeft, Camera, Check, Upload, Sparkles, Box } from 'lucide-react';
import { Car, ArtistSlot, CardResult, CarStatus } from '../types';

interface MerchantDashboardProps {
  cars: Car[];
  onBack: () => void;
  onUpdateCarStatus: (carId: string, status: CarStatus, results: Record<string, CardResult[]>) => void;
  showToast: (msg: string) => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ cars, onBack, onUpdateCarStatus, showToast }) => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  // Temporary storage for uploaded hits: { "白敬亭": [Card1, Card2], "范丞丞": [] }
  const [stagedHits, setStagedHits] = useState<Record<string, CardResult[]>>({});

  // Filter cars that are eligible for opening (RECRUITING for demo purposes, usually FULL)
  const myCars = cars; 

  const handleSelectCar = (car: Car) => {
    setSelectedCar(car);
    setStagedHits({});
  };

  const handleAddHit = (artistName: string) => {
    // Simulate uploading a card image
    const rarities: ('R'|'SR'|'SSR'|'SSP')[] = ['R', 'R', 'SR', 'SSR', 'SSP'];
    const randomRarity = rarities[Math.floor(Math.random() * rarities.length)];
    
    const newHit: CardResult = {
        id: `card_${Date.now()}`,
        name: `${randomRarity} ${artistName}特卡`,
        imageUrl: `https://picsum.photos/seed/${Date.now()}/300/400`, // Random card image
        rarity: randomRarity,
        artistName: artistName
    };

    setStagedHits(prev => ({
        ...prev,
        [artistName]: [...(prev[artistName] || []), newHit]
    }));
  };

  const handleFinishOpening = () => {
    if (!selectedCar) return;
    
    // In a real app, logic would map hits to specific slots/orders accurately.
    // Here we pass the map of Artist -> Cards back to App to distribute.
    onUpdateCarStatus(selectedCar.id, CarStatus.OPENED, stagedHits);
    setSelectedCar(null);
  };

  if (selectedCar) {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                <button onClick={() => setSelectedCar(null)} className="p-1 hover:bg-slate-100 rounded-full"><ChevronLeft /></button>
                <div>
                    <h1 className="font-bold text-lg text-slate-900">开箱录入</h1>
                    <p className="text-xs text-slate-400">正在操作: {selectedCar.title.substring(0, 15)}...</p>
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* Visual Header */}
                <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <div className="text-sm font-bold opacity-80">当前状态</div>
                        <div className="text-xl font-bold flex items-center gap-2">
                             <Box /> 正在拆箱中...
                        </div>
                    </div>
                    <button onClick={() => showToast("已通知买家正在直播")} className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                        发送直播通知
                    </button>
                </div>

                {/* Input Area by Artist */}
                <div>
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <Upload size={16} /> 录入结果 (点击添加图片)
                    </h3>
                    <div className="space-y-3">
                        {selectedCar.slots.map(slot => (
                            <div key={slot.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                        <img src={slot.avatarUrl} className="w-8 h-8 rounded-full" />
                                        <span className="font-bold text-sm">{slot.name}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleAddHit(slot.name)}
                                        className="flex items-center gap-1 text-xs bg-violet-50 text-violet-600 px-3 py-1.5 rounded-full font-bold active:scale-95 transition"
                                    >
                                        <Camera size={14} /> 拍照/上传
                                    </button>
                                </div>
                                
                                {/* Uploaded Cards Display */}
                                <div className="flex gap-2 overflow-x-auto hide-scroll min-h-[10px]">
                                    {(stagedHits[slot.name] || []).map(hit => (
                                        <div key={hit.id} className="relative flex-shrink-0 w-16 group animate-in zoom-in duration-300">
                                            <div className="aspect-[3/4] bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                                <img src={hit.imageUrl} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="text-[9px] text-center mt-1 font-bold text-slate-600 truncate">{hit.name}</div>
                                            <span className="absolute top-0 right-0 bg-yellow-400 text-[8px] font-bold px-1 rounded-bl-md">{hit.rarity}</span>
                                        </div>
                                    ))}
                                    {(stagedHits[slot.name] || []).length === 0 && (
                                        <div className="text-xs text-slate-300 italic py-2 pl-1">暂无卡牌，点击右上角上传</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 pb-8 z-50">
                 <button 
                    onClick={handleFinishOpening}
                    className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3.5 rounded-xl font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                 >
                    <Check size={18} /> 完成开箱，生成结果
                 </button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-10">
        <button onClick={onBack}><ChevronLeft /></button>
        <h1 className="font-bold text-lg">商家工作台</h1>
      </div>

      <div className="p-4">
        <h2 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">我的车队 (待处理)</h2>
        <div className="space-y-4">
            {myCars.map(car => (
                <div key={car.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4">
                    <img src={car.coverImage} className="w-20 h-24 object-cover rounded-lg bg-gray-200" />
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <div className="flex gap-2 mb-1">
                                {car.status === CarStatus.RECRUITING && <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-bold">拼团中</span>}
                                {car.status === CarStatus.OPENED && <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-bold">已开箱</span>}
                            </div>
                            <h3 className="font-bold text-sm text-slate-900 line-clamp-2">{car.title}</h3>
                        </div>
                        
                        <div className="flex justify-end mt-2">
                             {car.status !== CarStatus.OPENED ? (
                                <button 
                                    onClick={() => handleSelectCar(car)}
                                    className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md active:scale-95 transition"
                                >
                                    去开箱录卡
                                </button>
                             ) : (
                                <button disabled className="bg-gray-100 text-gray-400 text-xs font-bold px-4 py-2 rounded-full cursor-not-allowed">
                                    已完成
                                </button>
                             )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};