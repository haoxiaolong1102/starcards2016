import React from 'react';
import { ChevronLeft, Share2, Sparkles, Box, Truck } from 'lucide-react';
import { Order, CardResult } from '../types';

interface OrderResultProps {
  order: Order;
  onBack: () => void;
  showToast: (msg: string) => void;
  onRequestShipping: () => void; // Function to trigger shipping
}

export const OrderResult: React.FC<OrderResultProps> = ({ order, onBack, showToast, onRequestShipping }) => {
  const hitCount = order.hits?.length || 0;

  // Group hits by artist for better display
  const hitsByArtist = (order.hits || []).reduce((acc, hit) => {
    if (!acc[hit.artistName]) acc[hit.artistName] = [];
    acc[hit.artistName].push(hit);
    return acc;
  }, {} as Record<string, CardResult[]>);

  return (
    <div className="min-h-screen bg-slate-900 pb-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600 rounded-full blur-[100px] opacity-30"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-fuchsia-600 rounded-full blur-[100px] opacity-30"></div>
      </div>

      <div className="relative z-10">
        {/* Nav */}
        <div className="px-4 py-4 flex items-center justify-between text-white">
            <button onClick={onBack} className="bg-white/10 backdrop-blur-md p-2 rounded-full"><ChevronLeft /></button>
            <h1 className="font-bold text-lg">欧气战报</h1>
            <button onClick={() => showToast("生成长图分享中...")} className="bg-white/10 backdrop-blur-md p-2 rounded-full"><Share2 size={20} /></button>
        </div>

        {/* Content */}
        <div className="px-6 mt-4 text-center">
             <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-black text-xs px-3 py-1 rounded-full mb-4 shadow-lg animate-pulse">
                <Sparkles size={12} fill="currentColor" />
                恭喜老板！欧气爆发
             </div>
             
             <h2 className="text-3xl font-black text-white leading-tight mb-2">
                 共获得 <span className="text-yellow-400 text-5xl">{hitCount}</span> 张
             </h2>
             <p className="text-slate-400 text-xs">
                 来自订单: {order.carTitle.substring(0, 15)}...
             </p>

             {/* Cards Grid */}
             <div className="mt-10 space-y-8">
                 {Object.entries(hitsByArtist).map(([artist, cards]) => (
                     <div key={artist} className="animate-in slide-in-from-bottom-4 duration-700">
                         <div className="flex items-center gap-2 mb-3 px-2">
                             <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-slate-700"></div>
                             <span className="text-slate-300 font-bold text-sm">{artist}</span>
                             <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-slate-700"></div>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4">
                             {(cards as CardResult[]).map(card => (
                                 <div key={card.id} className="group relative perspective-500">
                                     <div className="aspect-[3/4] rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl relative bg-slate-800 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-violet-500/50">
                                         <img src={card.imageUrl} className="w-full h-full object-cover" />
                                         
                                         {/* Rarity Badge */}
                                         <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                             {card.rarity}
                                         </div>
                                     </div>
                                     <div className="mt-2 text-white text-xs font-bold text-center opacity-80">{card.name}</div>
                                 </div>
                             ))}
                         </div>
                     </div>
                 ))}
             </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900/90 backdrop-blur-xl border-t border-white/10 p-4 pb-8 z-50">
         <div className="flex gap-3 max-w-md mx-auto">
             <button className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold text-sm border border-slate-700">
                 存图到相册
             </button>
             {order.status === 'OPENED' ? (
                 <button 
                    onClick={onRequestShipping}
                    className="flex-[2] bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-violet-900/50 flex items-center justify-center gap-2 active:scale-95 transition"
                 >
                    <Truck size={18} /> 申请发货
                 </button>
             ) : (
                 <button disabled className="flex-[2] bg-green-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 opacity-80">
                    <Truck size={18} /> 已申请发货
                 </button>
             )}
         </div>
      </div>
    </div>
  );
};