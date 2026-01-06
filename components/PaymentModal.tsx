import React, { useEffect, useState } from 'react';
import { Check, Loader2, X, ShieldAlert } from 'lucide-react';

interface PaymentModalProps {
  totalCost: number;
  onClose: () => void;
  onConfirm: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ totalCost, onClose, onConfirm }) => {
  const [step, setStep] = useState<'confirm' | 'processing' | 'success'>('confirm');

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onConfirm();
      }, 1500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        
        {step === 'confirm' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-slate-900">确认订单</h3>
                <button onClick={onClose} className="p-1 bg-slate-100 rounded-full"><X size={16}/></button>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center">
                <span className="text-slate-500 text-sm">支付金额</span>
                <span className="text-2xl font-black text-slate-900">¥{totalCost}</span>
            </div>

            {/* FRAUD WARNING */}
            <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex gap-2">
                <ShieldAlert size={16} className="text-red-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-red-800 leading-snug">
                    <span className="font-bold">安全提醒：</span>
                    请勿私下添加车头微信/支付宝进行转账！私下交易无平台担保，若发生诈骗，平台无法追回损失。
                </p>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 border border-violet-100 bg-violet-50/50 rounded-xl cursor-pointer">
                    <div className="w-5 h-5 rounded-full border-[5px] border-violet-600 bg-white"></div>
                    <span className="font-bold text-sm text-slate-700">微信支付 (资金平台托管)</span>
                </div>
                <div className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl opacity-50">
                    <div className="w-5 h-5 rounded-full border border-slate-300"></div>
                    <span className="font-medium text-sm text-slate-500">支付宝</span>
                </div>
            </div>

            <button 
                onClick={handlePay}
                className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold shadow-lg mt-4 active:scale-95 transition-transform"
            >
                立即支付
            </button>
            
            <p className="text-[10px] text-slate-400 text-center">
                支付后资金将由 StarCards 平台托管，确认收货后结算给卖家
            </p>
          </div>
        )}

        {step === 'processing' && (
           <div className="flex flex-col items-center justify-center py-8">
              <Loader2 size={48} className="text-violet-600 animate-spin mb-4" />
              <p className="font-bold text-slate-700">正在请求支付网关...</p>
           </div>
        )}

        {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-200 animate-in zoom-in duration-300">
                    <Check size={32} className="text-white" strokeWidth={3} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">支付成功</h3>
                <p className="text-sm text-slate-400 mt-1">资金已进入平台托管账户</p>
            </div>
        )}
      </div>
    </div>
  );
};