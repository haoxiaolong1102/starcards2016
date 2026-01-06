import React, { useState } from 'react';
import { ChevronLeft, Camera, Check, Upload, Box, Tv, X, Wallet, TrendingUp, Megaphone, Plus, Clock, FileText, ChevronRight, DollarSign, PieChart } from 'lucide-react';
import { Car, CardResult, CarStatus, LiveInfo, MerchantWallet, BannerCampaign, BannerSlotId, Transaction } from '../types';

interface MerchantDashboardProps {
  cars: Car[];
  onBack: () => void;
  onUpdateCarStatus: (carId: string, status: CarStatus, results: Record<string, CardResult[]>) => void;
  onSetLive: (carId: string, liveInfo: LiveInfo | undefined) => void;
  showToast: (msg: string) => void;
  wallet: MerchantWallet;
  banners: BannerCampaign[];
  onWithdraw: (amount: number) => void;
  onCreateBanner: (slotId: BannerSlotId, title: string, img: string) => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ 
    cars, onBack, onUpdateCarStatus, onSetLive, showToast, 
    wallet, banners, onWithdraw, onCreateBanner
}) => {
  const [activeTab, setActiveTab] = useState<'CARS' | 'WALLET' | 'MARKETING'>('CARS');
  
  // Existing Car Logic State
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [stagedHits, setStagedHits] = useState<Record<string, CardResult[]>>({});
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [livePlatform, setLivePlatform] = useState("抖音");
  const [liveRoomId, setLiveRoomId] = useState("");

  // Wallet State
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Marketing State
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSlot, setBannerSlot] = useState<BannerSlotId>(BannerSlotId.HOME_TOP);
  
  // Filter cars that belong to me
  const myCars = cars; 

  // --- CAR HANDLERS ---
  const handleSelectCar = (car: Car) => {
    setSelectedCar(car);
    setStagedHits({});
  };

  const handleAddHit = (artistName: string) => {
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
    if (selectedCar.liveInfo?.isLive) {
        onSetLive(selectedCar.id, undefined);
    }
    onUpdateCarStatus(selectedCar.id, CarStatus.OPENED, stagedHits);
    setSelectedCar(null);
  };

  const handleToggleLive = () => {
      if (!selectedCar) return;
      if (selectedCar.liveInfo?.isLive) {
          onSetLive(selectedCar.id, undefined);
      } else {
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

  // --- WALLET HANDLERS ---
  const handleSubmitWithdraw = () => {
      const amt = parseFloat(withdrawAmount);
      if (isNaN(amt) || amt <= 0) return;
      onWithdraw(amt);
      setShowWithdrawModal(false);
      setWithdrawAmount("");
  };

  // --- MARKETING HANDLERS ---
  const handleSubmitBanner = () => {
      if (!bannerTitle) return alert("请输入标题");
      // Simulate image upload result
      const mockImg = `https://picsum.photos/seed/${Date.now()}/800/400`;
      onCreateBanner(bannerSlot, bannerTitle, mockImg);
      setShowBannerForm(false);
      setBannerTitle("");
  };

  // --- RENDER: CAR OPENING MODE ---
  if (selectedCar) {
     const isLive = selectedCar.liveInfo?.isLive;
     // ... (Existing implementation of Opening UI - Keeping it same but abbreviated for clarity in XML)
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
                 {/* Live Status */}
                <div className={`p-4 rounded-xl flex items-center justify-between transition-colors ${isLive ? 'bg-red-500 text-white' : 'bg-slate-900 text-white'}`}>
                    <div>
                        <div className="text-sm font-bold opacity-80 mb-1">当前状态</div>
                        <div className="text-xl font-bold flex items-center gap-2">
                             {isLive ? (<><Tv className="animate-pulse" /> 直播中</>) : (<><Box /> 准备开箱</>)}
                        </div>
                    </div>
                    <button onClick={handleToggleLive} className={`px-4 py-2 rounded-lg text-xs font-bold transition shadow-lg ${isLive ? 'bg-white text-red-500' : 'bg-red-500 hover:bg-red-600 text-white'}`}>
                        {isLive ? '结束直播' : '📣 开启直播'}
                    </button>
                </div>

                {/* Slots */}
                <div className="space-y-3">
                    {selectedCar.slots.map(slot => (
                        <div key={slot.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                    <img src={slot.avatarUrl} className="w-8 h-8 rounded-full" />
                                    <span className="font-bold text-sm">{slot.name}</span>
                                </div>
                                <button onClick={() => handleAddHit(slot.name)} className="flex items-center gap-1 text-xs bg-violet-50 text-violet-600 px-3 py-1.5 rounded-full font-bold active:scale-95 transition">
                                    <Camera size={14} /> 拍照/上传
                                </button>
                            </div>
                            <div className="flex gap-2 overflow-x-auto hide-scroll min-h-[10px]">
                                {(stagedHits[slot.name] || []).map(hit => (
                                    <div key={hit.id} className="relative flex-shrink-0 w-16">
                                        <img src={hit.imageUrl} className="w-16 h-20 object-cover rounded" />
                                        <span className="absolute top-0 right-0 bg-yellow-400 text-[8px] px-1">{hit.rarity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 pb-8 z-50">
                 <button onClick={handleFinishOpening} className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3.5 rounded-xl font-bold shadow-lg">
                    <Check size={18} /> 完成开箱，生成结果
                 </button>
            </div>

            {/* Live Modal */}
            {showLiveModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6">
                    <div className="bg-white w-full max-w-sm rounded-2xl p-5">
                         <h3 className="font-bold text-lg mb-4">📡 设置直播间</h3>
                         <input value={liveRoomId} onChange={e => setLiveRoomId(e.target.value)} placeholder="输入房间号/口令" className="w-full bg-gray-50 border p-3 rounded-lg text-sm mb-4" />
                         <div className="flex gap-2">
                             <button onClick={() => setShowLiveModal(false)} className="flex-1 py-3 text-slate-500 bg-gray-100 rounded-xl">取消</button>
                             <button onClick={handleConfirmLive} className="flex-1 py-3 bg-red-500 text-white rounded-xl">开始</button>
                         </div>
                    </div>
                </div>
            )}
        </div>
     );
  }

  // --- MAIN DASHBOARD VIEW ---
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-10">
        <button onClick={onBack}><ChevronLeft /></button>
        <h1 className="font-bold text-lg">商家工作台</h1>
      </div>

      {/* TABS */}
      <div className="flex border-b border-gray-200 bg-white">
          <button onClick={() => setActiveTab('CARS')} className={`flex-1 py-3 text-sm font-bold border-b-2 ${activeTab === 'CARS' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400'}`}>
              <Box size={16} className="inline mr-1 mb-0.5"/> 拼团管理
          </button>
          <button onClick={() => setActiveTab('WALLET')} className={`flex-1 py-3 text-sm font-bold border-b-2 ${activeTab === 'WALLET' ? 'border-violet-600 text-violet-600' : 'border-transparent text-slate-400'}`}>
              <Wallet size={16} className="inline mr-1 mb-0.5"/> 资产中心
          </button>
          <button onClick={() => setActiveTab('MARKETING')} className={`flex-1 py-3 text-sm font-bold border-b-2 ${activeTab === 'MARKETING' ? 'border-pink-500 text-pink-500' : 'border-transparent text-slate-400'}`}>
              <TrendingUp size={16} className="inline mr-1 mb-0.5"/> 营销推广
          </button>
      </div>

      <div className="p-4">
        
        {/* === TAB 1: CARS === */}
        {activeTab === 'CARS' && (
            <div className="space-y-4">
                {myCars.map(car => (
                    <div key={car.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4">
                        <img src={car.coverImage} className="w-20 h-24 object-cover rounded-lg bg-gray-200" />
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex gap-2 mb-1">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${car.status === CarStatus.RECRUITING ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                        {car.status === CarStatus.RECRUITING ? '拼团中' : '已开箱'}
                                    </span>
                                    {car.liveInfo?.isLive && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold animate-pulse">LIVE</span>}
                                </div>
                                <h3 className="font-bold text-sm text-slate-900 line-clamp-2">{car.title}</h3>
                            </div>
                            <div className="flex justify-end mt-2">
                                {car.status !== CarStatus.OPENED ? (
                                    <button onClick={() => handleSelectCar(car)} className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md active:scale-95 transition">去开箱录卡</button>
                                ) : (
                                    <button disabled className="bg-gray-100 text-gray-400 text-xs font-bold px-4 py-2 rounded-full">已完成</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* === TAB 2: WALLET === */}
        {activeTab === 'WALLET' && (
            <div className="space-y-4 animate-in fade-in">
                {/* Balance Card */}
                <div className="bg-gradient-to-br from-violet-900 to-indigo-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-[50px] opacity-10 translate-x-10 -translate-y-10"></div>
                    
                    <div className="relative z-10">
                        <div className="text-violet-200 text-xs font-medium mb-1 flex items-center gap-1">
                             <Wallet size={12}/> 可提现余额 (元)
                        </div>
                        <div className="text-4xl font-black tracking-tight mb-4">
                            {wallet.availableBalance.toFixed(2)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                             <div>
                                 <div className="text-[10px] text-violet-300">待结算 (未确认收货)</div>
                                 <div className="text-lg font-bold">{wallet.pendingBalance.toFixed(2)}</div>
                             </div>
                             <div>
                                 <div className="text-[10px] text-violet-300">历史总收入</div>
                                 <div className="text-lg font-bold">{wallet.totalIncome.toFixed(2)}</div>
                             </div>
                        </div>

                        <button 
                             onClick={() => setShowWithdrawModal(true)}
                             className="absolute top-6 right-6 bg-white text-violet-900 text-xs font-bold px-4 py-2 rounded-full shadow-lg active:scale-95 transition"
                        >
                            去提现
                        </button>
                    </div>
                </div>

                {/* Benefits / Fee Info */}
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex items-start gap-3">
                    <div className="bg-orange-100 p-2 rounded-full text-orange-600 shrink-0">
                         <PieChart size={16} />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-orange-800">平台费率极低</h3>
                        <p className="text-[10px] text-orange-700 mt-1 leading-snug">
                            技术服务费仅 <span className="font-bold text-lg">2.5%</span> (低于抖音 5%)。
                            每日首笔提现免手续费，T+1 极速到账。
                        </p>
                    </div>
                </div>

                {/* Transactions */}
                <div>
                    <h3 className="font-bold text-slate-800 mb-3 text-sm">账单明细</h3>
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        {wallet.transactions.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-xs">暂无流水</div>
                        ) : (
                            wallet.transactions.map(tx => (
                                <div key={tx.id} className="p-3 border-b border-gray-50 last:border-none flex justify-between items-center">
                                    <div>
                                        <div className="text-xs font-bold text-slate-800">{tx.description}</div>
                                        <div className="text-[10px] text-slate-400 mt-0.5">{tx.date}</div>
                                    </div>
                                    <div className={`text-sm font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* === TAB 3: MARKETING === */}
        {activeTab === 'MARKETING' && (
            <div className="space-y-4 animate-in fade-in">
                 {/* Intro Card */}
                 <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                     <div className="relative z-10">
                         <h2 className="font-bold text-lg mb-1">流量加速包</h2>
                         <p className="text-xs text-pink-100 mb-3 opacity-90">购买首页/大厅 Banner 位，让您的车队曝光量提升 300%</p>
                         <button 
                            onClick={() => setShowBannerForm(true)}
                            className="bg-white text-pink-600 text-xs font-bold px-4 py-2 rounded-full shadow-sm active:scale-95 transition"
                         >
                            申请投放
                         </button>
                     </div>
                     <Megaphone size={80} className="absolute -bottom-4 -right-4 text-white opacity-20 rotate-12" />
                 </div>

                 {/* My Campaigns */}
                 <div>
                    <h3 className="font-bold text-slate-800 mb-3 text-sm">我的推广记录</h3>
                    {banners.filter(b => b.merchantName === wallet.merchantName).length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-xl border border-gray-100 border-dashed">
                             <p className="text-xs text-slate-400">暂无推广记录</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {banners.filter(b => b.merchantName === wallet.merchantName).map(b => (
                                <div key={b.id} className="bg-white p-3 rounded-xl border border-gray-100 flex gap-3">
                                    <img src={b.imageUrl} className="w-24 h-12 object-cover rounded bg-gray-100" />
                                    <div className="flex-1">
                                         <div className="flex justify-between">
                                             <h4 className="font-bold text-xs text-slate-800">{b.title}</h4>
                                             <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${b.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-slate-500'}`}>
                                                 {b.status === 'ACTIVE' ? '投放中' : '审核中'}
                                             </span>
                                         </div>
                                         <div className="flex gap-3 mt-2 text-[10px] text-slate-400">
                                              <span>曝光 {b.impressionCount}</span>
                                              <span>点击 {b.clickCount}</span>
                                         </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                 </div>
            </div>
        )}

      </div>

      {/* WITHDRAW MODAL */}
      {showWithdrawModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-6">
              <div className="bg-white w-full max-w-sm rounded-2xl p-5">
                   <div className="flex justify-between items-center mb-4">
                       <h3 className="font-bold text-lg">提现余额</h3>
                       <button onClick={() => setShowWithdrawModal(false)}><X size={20} className="text-slate-400"/></button>
                   </div>
                   <div className="bg-gray-50 p-4 rounded-xl mb-4">
                       <div className="text-xs text-slate-400 mb-1">提现金额 (元)</div>
                       <div className="flex items-center gap-1">
                           <span className="text-2xl font-bold">¥</span>
                           <input 
                               type="number" 
                               value={withdrawAmount}
                               onChange={e => setWithdrawAmount(e.target.value)}
                               className="bg-transparent text-3xl font-black w-full outline-none" 
                               placeholder="0.00"
                           />
                       </div>
                       <div className="text-[10px] text-slate-400 mt-2 border-t border-gray-200 pt-2 flex justify-between">
                           <span>可提现: {wallet.availableBalance}</span>
                           <button onClick={() => setWithdrawAmount(wallet.availableBalance.toString())} className="text-violet-600 font-bold">全部</button>
                       </div>
                   </div>
                   <button onClick={handleSubmitWithdraw} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold">
                       确认提现
                   </button>
              </div>
          </div>
      )}

      {/* BANNER FORM MODAL */}
      {showBannerForm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-6">
              <div className="bg-white w-full max-w-sm rounded-2xl p-5">
                   <div className="flex justify-between items-center mb-4">
                       <h3 className="font-bold text-lg">申请广告位</h3>
                       <button onClick={() => setShowBannerForm(false)}><X size={20} className="text-slate-400"/></button>
                   </div>
                   <div className="space-y-3 mb-4">
                       <div>
                           <label className="block text-xs font-bold text-slate-600 mb-1">广告标题</label>
                           <input value={bannerTitle} onChange={e => setBannerTitle(e.target.value)} className="w-full bg-gray-50 border p-2 rounded-lg text-sm"/>
                       </div>
                       <div>
                           <label className="block text-xs font-bold text-slate-600 mb-1">投放位置</label>
                           <select className="w-full bg-gray-50 border p-2 rounded-lg text-sm">
                               <option value="HOME_TOP">首页顶部轮播 (热门)</option>
                               <option value="GROUP_TOP">拼盒大厅置顶</option>
                           </select>
                       </div>
                       <div>
                           <label className="block text-xs font-bold text-slate-600 mb-1">上传图片 (模拟)</label>
                           <div className="h-20 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                               点击上传图片
                           </div>
                       </div>
                   </div>
                   <button onClick={handleSubmitBanner} className="w-full py-3 bg-pink-500 text-white rounded-xl font-bold">
                       提交审核
                   </button>
              </div>
          </div>
      )}

    </div>
  );
};
