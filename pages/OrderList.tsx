import React from 'react';
import { ChevronLeft, Package, Box, Gift, Truck } from 'lucide-react';
import { Order } from '../types';

interface OrderListProps {
  orders: Order[];
  onBack: () => void;
  showToast: (msg: string) => void;
  onViewResult: (order: Order) => void;
}

export const OrderList: React.FC<OrderListProps> = ({ orders, onBack, showToast, onViewResult }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-10">
        <button onClick={onBack} className="p-1 hover:bg-slate-100 rounded-full"><ChevronLeft /></button>
        <h1 className="font-bold text-lg">我的订单</h1>
      </div>

      <div className="p-4 space-y-4">
        {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Package size={48} className="mb-2 opacity-20" />
                <p className="text-sm">暂无订单，快去上车吧</p>
            </div>
        ) : (
            orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 relative overflow-hidden">
                    {/* Background Status Indicator */}
                    {order.status === 'OPENED' && (
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-yellow-100 to-transparent rounded-bl-full -mr-4 -mt-4 z-0"></div>
                    )}

                    <div className="flex gap-3 mb-3 border-b border-gray-50 pb-3 relative z-10">
                        <img src={order.carImage} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                        <div className="flex-1">
                            <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{order.carTitle}</h3>
                            <div className="text-xs text-slate-400 mt-1">{order.date}</div>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {order.items.map((item, idx) => (
                                    <span key={idx} className="bg-violet-50 text-violet-700 text-[10px] px-1.5 py-0.5 rounded">
                                        {item.name} x{item.count}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                             <span className="text-sm font-bold">¥{order.totalPrice}</span>
                             
                             {order.status === 'PAID' && (
                                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                   <Box size={10} /> 待开箱
                                </span>
                             )}
                             {order.status === 'OPENED' && (
                                <span className="text-[10px] bg-yellow-50 text-yellow-700 border border-yellow-100 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 animate-pulse">
                                   <Gift size={10} /> 已开箱
                                </span>
                             )}
                             {order.status === 'SHIPPED' && (
                                <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                   <Truck size={10} /> 已发货
                                </span>
                             )}
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 relative z-10">
                        <button 
                          onClick={() => showToast("正在连接车头...")}
                          className="text-xs text-slate-500 border border-slate-200 px-3 py-1.5 rounded-full active:bg-slate-50"
                        >
                            联系车头
                        </button>

                        {order.status === 'PAID' && (
                            <button 
                              onClick={() => showToast("暂无物流信息，等待开箱")}
                              className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full font-medium"
                            >
                                等待开箱
                            </button>
                        )}

                        {(order.status === 'OPENED' || order.status === 'SHIPPED') && (
                            <button 
                              onClick={() => onViewResult(order)}
                              className="text-xs text-white bg-slate-900 px-4 py-1.5 rounded-full font-bold shadow-lg shadow-slate-200 active:scale-95 transition flex items-center gap-1"
                            >
                                <Gift size={12} /> 查看欧气
                            </button>
                        )}
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};