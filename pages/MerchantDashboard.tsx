import React, { useState } from 'react';
import { ChevronLeft, Camera, Check, Upload, Box, Tv, X } from 'lucide-react';
import { Car, CardResult, CarStatus, LiveInfo } from '../types';

interface MerchantDashboardProps {
  cars: Car[];
  onBack: () => void;
  onUpdateCarStatus: (carId: string, status: CarStatus, results: Record<string, CardResult[]>) => void;
  onSetLive: (carId: string, liveInfo: LiveInfo | undefined) => void; // New Prop
  showToast: (msg: string) => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ cars, onBack, onUpdateCarStatus, onSetLive, showToast }) => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  // Temporary storage for uploaded hits: { "白敬亭": [Card1, Card2], "范丞丞": [] }
  const [stagedHits, setStagedHits] = useState<Record<string, CardResult[]>>({});
  
  // Live Settings Modal State
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [livePlatform, setLivePlatform] = useState("抖音");
  const [liveRoomId, setLiveRoomId] = useState("");

  // Filter cars that belong to me (Mocked: in a real app check hostName or ID)
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
    
    // 1. End Live if active
    if (selectedCar.liveInfo?.isLive) {
        onSetLive(selectedCar.id, undefined);
    }

    // 2. Distribute cards
    onUpdateCarStatus(selectedCar.id, CarStatus.OPENED, stagedHits);
    setSelectedCar(null);
  };

  const handleToggleLive = () => {
      if (!selectedCar) return;

      if (selectedCar.liveInfo?.isLive) {
          // Turn Off
          onSetLive(selectedCar.id, undefined);
      } else {
          // Open Modal to Turn On
          setShowLiveModal(true);
      }
  };

  const handleConfirmLive = () => {
      if (!selectedCar) return;
      if (!liveRoomId) {
          alert("请输入房间号或搜索口令");
          return;
      }
      onSetLive(selectedCar.id, {
          platform: livePlatform,
          roomId: liveRoomId,
          isLive: true
      });
      setShowLiveModal(false);
  };

  if (selectedCar) {
    const isLive = selectedCar.liveInfo?.isLive;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 relative">
            <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                <button onClick={() => setSelectedCar(null)} className="p-1 hover:bg-slate-100 rounded-full"><ChevronLeft /></button>
                <div>
                    <h1 className="font-bold text-lg text-slate-900">开箱录入</h1>
                    <p className="text-xs text-slate-400">正在操作: {selectedCar.title.substring(0, 15)}...</p>
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* Control Panel */}
                <div className={`p-4 rounded-xl flex items-center justify-between transition-colors ${isLive ? 'bg-red-500 text-white' : 'bg-slate-900 text-white'}`}>
                    <div>
                        <div className="text-sm font-bold opacity-80 mb-1">当前状态</div>
                        <div className="text-xl font-bold flex items-center gap-2">
                             {isLive ? (
                                 <><Tv className="animate-pulse" /> 直播中 ({selectedCar.liveInfo?.platform})</>
                             ) : (
                                 <><Box /> 准备开箱</>
                             )}
                        </div>
                    </div>
                    <button 
                        onClick={handleToggleLive}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition shadow-lg ${isLive ? 'bg-white text-red-500 hover:bg-red-50' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                    >
                        {isLive ? '结束直播' : '📣 开启直播'}
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

            {/* Live Settings Modal */}
            {showLiveModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6 animate-in fade-in">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">📡 设置直播间信息</h3>
                            <button onClick={() => setShowLiveModal(false)}><X size={20} className="text-slate-400"/></button>
                        </div>
                        <p className="text-xs text-slate-500 mb-4 bg-gray-50 p-2 rounded">
                            请填写第三方平台直播信息，设置后将展示在详情页，引导粉丝前往观看。
                        </p>
                        
                        <div className="space-y-3 mb-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">直播平台</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {["抖音", "小红书", "B站", "快手", "视频号"].map(p => (
                                        <button 
                                            key={p} 
                                            onClick={() => setLivePlatform(p)}
                                            className={`py-2 text-xs font-bold rounded-lg border ${livePlatform === p ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-gray-200'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">房间号 / 搜索口令 / 链接</label>
                                <input 
                                    type="text" 
                                    value={liveRoomId}
                                    onChange={e => setLiveRoomId(e.target.value)}
                                    placeholder="例：搜索 '小葵花卡社' 或房间号 88888"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleConfirmLive}
                            className="w-full bg-red-500 text-white py-3 rounded-xl font-bold"
                        >
                            开始直播
                        </button>
                    </div>
                </div>
            )}
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
                                {car.liveInfo?.isLive && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold animate-pulse flex items-center gap-1 w-fit"><Tv size={8}/> 直播中</span>}
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
