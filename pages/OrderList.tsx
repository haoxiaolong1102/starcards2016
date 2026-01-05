import React from 'react';
import { ChevronLeft, Package, Truck, CheckCircle } from 'lucide-react';
import { Order } from '../types';

interface OrderListProps {
  orders: Order[];
  onBack: () => void;
}

export const OrderList: React.FC<OrderListProps> = ({ orders, onBack }) => {
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
                <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex gap-3 mb-3 border-b border-gray-50 pb-3">
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
                             <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                                {order.status === 'PAID' ? '待开箱' : '已完成'}
                             </span>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button className="text-xs text-slate-500 border border-slate-200 px-3 py-1.5 rounded-full">
                            联系车头
                        </button>
                        <button className="text-xs text-white bg-slate-900 px-3 py-1.5 rounded-full font-medium shadow-sm">
                            查看进度
                        </button>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};