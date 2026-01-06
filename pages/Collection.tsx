import React, { useState } from 'react';
import { ChevronLeft, Filter, Image as ImageIcon, X, Calendar, MapPin, Sparkles } from 'lucide-react';
import { Order, CardResult } from '../types';

interface CollectionProps {
  orders: Order[];
  onBack: () => void;
}

export const Collection: React.FC<CollectionProps> = ({ orders, onBack }) => {
  // Extract all cards from orders
  const allCards: (CardResult & { orderDate: string, orderTitle: string })[] = [];
  orders.forEach(o => {
    if (o.hits) {
      o.hits.forEach(h => {
        allCards.push({ ...h, orderDate: o.date, orderTitle: o.carTitle });
      });
    }
  });

  const [filter, setFilter] = useState('ALL');
  const [selectedCard, setSelectedCard] = useState<(CardResult & { orderDate: string, orderTitle: string }) | null>(null);

  // Get unique artists for filter
  const artists = Array.from(new Set(allCards.map(c => c.artistName)));

  const filteredCards = filter === 'ALL'
    ? allCards
    : allCards.filter(c => c.artistName === filter);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
        {/* Header - Fixed */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur z-20 px-4 py-4 border-b border-white/10 flex items-center justify-between shadow-sm">
             <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-1 rounded-full hover:bg-white/10"><ChevronLeft /></button>
                <div>
                    <h1 className="font-bold text-lg">我的卡册</h1>
                    <div className="text-[10px] text-slate-400 font-mono">
                        共 {allCards.length} 张 / {artists.length} 位艺人
                    </div>
                </div>
             </div>
        </div>

        {/* Filters */}
        <div className="px-4 py-3 overflow-x-auto hide-scroll flex gap-2 border-b border-white/5 bg-slate-900">
            <button
                onClick={() => setFilter('ALL')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap border ${filter === 'ALL' ? 'bg-white text-slate-900 border-white' : 'bg-transparent text-slate-400 border-slate-700'}`}
            >
                全部
            </button>
            {artists.map(a => (
                <button
                    key={a}
                    onClick={() => setFilter(a)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap border ${filter === a ? 'bg-violet-600 text-white border-violet-500 shadow-[0_0_10px_rgba(124,58,237,0.5)]' : 'bg-transparent text-slate-400 border-slate-700'}`}
                >
                    {a}
                </button>
            ))}
        </div>

        {/* Album Grid - Phone Style (3 columns, tight gap) */}
        <div className="grid grid-cols-3 gap-0.5 pb-20">
            {filteredCards.map((card, idx) => (
                <div 
                    key={`${card.id}_${idx}`} 
                    onClick={() => setSelectedCard(card)}
                    className="relative aspect-[3/4] bg-slate-800 cursor-pointer overflow-hidden group"
                >
                    <img src={card.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                    
                    {/* Minimal Rarity Badge - Tiny tag in corner */}
                    <div className={`absolute top-1 right-1 text-[8px] font-black px-1 rounded shadow-sm opacity-90 ${
                        card.rarity === 'SSP' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black' :
                        card.rarity === 'SSR' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' :
                        'bg-black/40 text-white backdrop-blur'
                    }`}>
                        {card.rarity}
                    </div>
                </div>
            ))}
        </div>

        {/* Empty State */}
        {filteredCards.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                     <Filter size={24} className="opacity-50" />
                </div>
                <p className="text-sm">暂无该艺人的卡片</p>
            </div>
        )}

        {/* Detail Modal */}
        {selectedCard && (
            <div className="fixed inset-0 z-[60] flex flex-col bg-black animate-in fade-in duration-200">
                {/* Navbar */}
                <div className="absolute top-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
                    <button onClick={() => setSelectedCard(null)} className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white active:bg-white/20 transition">
                        <X size={20} />
                    </button>
                    <span className="font-bold text-sm text-white/90 shadow-sm">{selectedCard.name}</span>
                    <div className="w-9"></div> {/* spacer */}
                </div>

                {/* Main Image Container */}
                <div className="flex-1 flex items-center justify-center p-4" onClick={() => setSelectedCard(null)}>
                    <img 
                        src={selectedCard.imageUrl} 
                        className="max-w-full max-h-full object-contain shadow-2xl rounded-lg" 
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                    />
                </div>

                {/* Bottom Sheet Info */}
                <div className="bg-slate-900 border-t border-white/10 p-6 pb-10 rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{selectedCard.artistName}</h2>
                            <div className="flex gap-2">
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                    selectedCard.rarity === 'SSP' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black' : 
                                    selectedCard.rarity === 'SSR' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' :
                                    'bg-slate-700 text-white'
                                }`}>
                                    {selectedCard.rarity}
                                </span>
                                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-white/10">
                                    {selectedCard.name}
                                </span>
                            </div>
                        </div>
                        {/* Date */}
                        <div className="text-right">
                             <div className="flex items-center justify-end gap-1.5 text-xs text-slate-300 mb-1 font-mono">
                                <Calendar size={12} className="text-violet-400"/>
                                {selectedCard.orderDate}
                             </div>
                             <div className="text-[10px] text-slate-500">获取日期</div>
                        </div>
                    </div>

                    {/* Source Info */}
                    <div className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-xl border border-white/5 mb-5">
                        <div className="p-2 bg-slate-700 rounded-full">
                            <MapPin size={16} className="text-violet-400" />
                        </div>
                        <div>
                            <div className="text-xs text-slate-400 mb-0.5">来源车队</div>
                            <div className="text-sm font-bold text-white leading-tight line-clamp-1">{selectedCard.orderTitle}</div>
                        </div>
                    </div>

                    {/* AI Price Analysis Placeholder */}
                    <button 
                        className="w-full py-3.5 rounded-xl border border-violet-500/30 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 text-violet-300 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition group"
                    >
                        <Sparkles size={14} className="group-hover:animate-pulse" />
                        AI 估价分析 (即将上线)
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};