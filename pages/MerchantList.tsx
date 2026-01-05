import React from 'react';
import { Search, Crown, CheckCircle2, ChevronRight } from 'lucide-react';
import { Merchant } from '../types';

interface MerchantListProps {
  onMerchantClick: (merchant: Merchant) => void;
}

export const MOCK_MERCHANTS: Merchant[] = [
    { id: 1, name: "小葵花卡社", rating: 4.9, activeCars: 12, tags: ["发货快", "信誉店"], isLive: true, avatar: "https://picsum.photos/seed/shop1/100", fans: 12040, description: "专注综艺卡3年，官方一级代理，保证正品原箱，每晚8点直播开箱。" },
    { id: 2, name: "芋泥波波", rating: 4.8, activeCars: 5, tags: ["粉头车", "包邮"], isLive: false, avatar: "https://picsum.photos/seed/shop2/100", fans: 3400, description: "主要拼影视剧周边，为爱发电，不搞溢价。" },
    { id: 3, name: "星光拆卡屋", rating: 5.0, activeCars: 28, tags: ["官方代理", "黑钻"], isLive: true, avatar: "https://picsum.photos/seed/shop3/100", fans: 89000, description: "全网最大拆卡直播间之一，信誉保证。" },
    { id: 4, name: "桃桃乐", rating: 4.6, activeCars: 2, tags: ["散车"], isLive: false, avatar: "https://picsum.photos/seed/shop4/100", fans: 500, description: "偶尔开开，随缘上车。" },
    { id: 5, name: "极速卡牌", rating: 4.9, activeCars: 45, tags: ["大商", "秒发"], isLive: true, avatar: "https://picsum.photos/seed/shop5/100", fans: 22000, description: "专业团队运营，仓储物流一体化。" },
];

export const MerchantList: React.FC<MerchantListProps> = ({ onMerchantClick }) => {
    return (
        <div className="min-h-screen pb-20">
             <div className="sticky top-0 bg-texture z-40 px-4 pt-4 pb-2">
                <h1 className="text-xl font-bold text-slate-900 mb-3">入驻商家</h1>
                <div className="relative mb-2">
                    <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                    <input type="text" placeholder="搜索商家 / 直播间" className="w-full bg-white pl-9 py-2 rounded-xl text-sm border-none shadow-sm focus:ring-1 focus:ring-violet-500" />
                </div>
             </div>

             {/* Apply CTA */}
             <div className="px-4 mt-2 mb-4">
                 <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl p-4 text-white shadow-lg flex items-center justify-between">
                     <div>
                         <div className="font-bold text-sm">商家/粉头入驻</div>
                         <div className="text-[10px] text-violet-100 mt-1">已有 1,492 位车头加入</div>
                     </div>
                     <button className="bg-white text-violet-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm active:scale-95 transition">
                         免费入驻
                     </button>
                 </div>
             </div>

             {/* List */}
             <div className="px-4 space-y-3">
                 {MOCK_MERCHANTS.map(m => (
                     <div 
                        key={m.id} 
                        onClick={() => onMerchantClick(m)}
                        className="bg-white rounded-xl p-3 flex items-center justify-between border border-slate-100 shadow-sm active:scale-[0.99] transition cursor-pointer"
                     >
                         <div className="flex items-center gap-3">
                             <div className="relative">
                                 <img src={m.avatar} className="w-12 h-12 rounded-full object-cover border border-slate-100" />
                                 {m.isLive && (
                                     <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full border border-white flex items-center gap-0.5 animate-pulse">
                                         <div className="w-1 h-1 bg-white rounded-full"></div> LIVE
                                     </div>
                                 )}
                             </div>
                             <div>
                                 <div className="flex items-center gap-1">
                                     <h3 className="font-bold text-slate-900 text-sm">{m.name}</h3>
                                     {m.rating >= 4.9 && <Crown size={12} className="text-amber-400 fill-current" />}
                                     <CheckCircle2 size={12} className="text-blue-500" />
                                 </div>
                                 <div className="flex items-center gap-2 mt-1">
                                     <span className="text-[10px] text-slate-500">在开 {m.activeCars} 车</span>
                                     <div className="h-2 w-[1px] bg-slate-200"></div>
                                     <span className="text-[10px] text-orange-500 font-bold">{m.rating}分</span>
                                 </div>
                                 <div className="flex gap-1 mt-1.5">
                                     {m.tags.map(t => (
                                         <span key={t} className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                             {t}
                                         </span>
                                     ))}
                                 </div>
                             </div>
                         </div>
                         <button className="text-slate-300">
                             <ChevronRight size={20} />
                         </button>
                     </div>
                 ))}
             </div>
        </div>
    );
};