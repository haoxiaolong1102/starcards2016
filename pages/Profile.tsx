import React from 'react';
import { User, Order } from '../types';
import { Settings, Package, Heart, Wallet, ChevronRight } from 'lucide-react';

interface ProfileProps {
  user: User;
  orders: Order[]; // Added prop
  onViewOrders: () => void;
  onViewCollection: () => void; // Added prop
  showToast: (msg: string) => void;
  onOpenMerchant?: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, orders, onViewOrders, onViewCollection, showToast, onOpenMerchant }) => {
  // Calculate Stats
  const joinedCount = orders.length;
  const waitingOpenCount = orders.filter(o => o.status === 'PAID').length;
  const totalCards = orders.reduce((acc, o) => acc + (o.hits?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white pt-10 pb-6 px-6 mb-2">
        <div className="flex items-center gap-4">
          <img src={user.avatar} className="w-16 h-16 rounded-full border-2 border-white shadow-md" alt="Avatar" />
          <div className="flex-1">
             <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
             <div className="flex flex-wrap gap-1 mt-1">
                {user.favoriteArtists.map(a => (
                   <span key={a} className="bg-pink-100 text-pink-600 text-[10px] px-2 py-0.5 rounded-full font-medium">
                     {a}家
                   </span>
                ))}
             </div>
          </div>
          <button onClick={() => showToast("设置功能开发中")}>
            <Settings className="text-slate-400" />
          </button>
        </div>
        
        {/* Stats */}
        <div className="flex justify-between mt-6 px-2">
           <div className="text-center" onClick={onViewOrders}>
              <div className="font-bold text-lg text-slate-800">{joinedCount}</div>
              <div className="text-xs text-slate-400">已上车</div>
           </div>
           <div className="text-center" onClick={onViewOrders}>
              <div className="font-bold text-lg text-slate-800">{waitingOpenCount}</div>
              <div className="text-xs text-slate-400">待开箱</div>
           </div>
           {/* Clickable Collection Stats */}
           <div className="text-center cursor-pointer active:scale-95 transition-transform" onClick={onViewCollection}>
              <div className="font-bold text-lg text-slate-900 flex justify-center items-center gap-1">
                  {totalCards} <ChevronRight size={12} className="text-slate-300" />
              </div>
              <div className="text-xs text-violet-600 font-bold">集卡数</div>
           </div>
           <div className="text-center opacity-40">
              <div className="font-bold text-lg text-slate-800">0</div>
              <div className="text-xs text-slate-400">违约</div>
           </div>
        </div>
      </div>

      {/* Menu */}
      <div className="bg-white px-4 py-2">
         <MenuItem 
            icon={<Package size={20} />} 
            label="我的订单" 
            hasBadge={waitingOpenCount > 0}
            onClick={onViewOrders}
         />
         <MenuItem 
            icon={<Heart size={20} />} 
            label="心愿单 / 蹲好价" 
            onClick={() => showToast("心愿单功能开发中")}
         />
         <MenuItem 
            icon={<Wallet size={20} />} 
            label="钱包 / 退款" 
            onClick={() => showToast("钱包功能开发中")}
         />
      </div>

      {/* Merchant Entry */}
      <div className="px-4 mt-6">
         <div 
            onClick={onOpenMerchant}
            className="bg-slate-800 rounded-xl p-4 text-white flex items-center justify-between shadow-lg active:scale-95 transition cursor-pointer"
         >
            <div>
               <h3 className="font-bold text-sm">我是车头/商家</h3>
               <p className="text-xs text-slate-400 mt-1">点击进入工作台：开箱、录卡、发货</p>
            </div>
            <button className="bg-white text-slate-900 text-xs font-bold px-4 py-2 rounded-full">
               进入
            </button>
         </div>
      </div>
    </div>
  );
};

const MenuItem = ({ icon, label, hasBadge, onClick }: { icon: any, label: string, hasBadge?: boolean, onClick?: () => void }) => (
  <div onClick={onClick} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-none cursor-pointer active:bg-gray-50">
     <div className="flex items-center gap-3 text-slate-600">
        {icon}
        <span className="text-sm font-medium">{label}</span>
     </div>
     {hasBadge && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
  </div>
);