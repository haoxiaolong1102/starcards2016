import React, { useState } from 'react';
import { ChevronLeft, Store, Users, CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { UserRole } from '../types';

interface MerchantRegistrationProps {
  onBack: () => void;
  onRegister: (role: UserRole) => void;
}

export const MerchantRegistration: React.FC<MerchantRegistrationProps> = ({ onBack, onRegister }) => {
  const [selectedType, setSelectedType] = useState<UserRole | null>(null);
  const [step, setStep] = useState(1); // 1: Select Type, 2: Form, 3: Success

  const handleSelect = (role: UserRole) => {
    setSelectedType(role);
    setStep(2);
  };

  const handleSubmit = () => {
    if (selectedType) {
        // Simulate API call and approval
        setTimeout(() => {
            onRegister(selectedType);
        }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-10">
        <button onClick={onBack}><ChevronLeft /></button>
        <h1 className="font-bold text-lg">申请成为发车人</h1>
      </div>

      <div className="p-4">
        
        {/* Step 1: Selection */}
        {step === 1 && (
            <div className="space-y-6">
                <div className="bg-violet-50 p-4 rounded-xl border border-violet-100 flex items-start gap-3">
                    <ShieldCheck className="text-violet-600 shrink-0 mt-1" />
                    <div>
                        <h3 className="font-bold text-sm text-violet-900">平台安全声明</h3>
                        <p className="text-xs text-violet-700 mt-1 leading-relaxed">
                            为保障买家权益，StarCards 实行严格的准入制度。所有车队资金由平台托管，发车人需通过实名认证及资质审核。
                        </p>
                    </div>
                </div>

                <div>
                    <h2 className="font-bold text-lg text-slate-900 mb-4">请选择入驻身份</h2>
                    
                    {/* Type A */}
                    <div 
                        onClick={() => handleSelect(UserRole.MERCHANT_A)}
                        className="bg-white p-5 rounded-2xl border-2 border-slate-100 hover:border-violet-500 transition-all cursor-pointer shadow-sm mb-4 relative overflow-hidden group"
                    >
                        <div className="flex justify-between items-start mb-2">
                             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <Store size={20} />
                             </div>
                             <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded">A类 · 正规军</span>
                        </div>
                        <h3 className="font-bold text-base text-slate-900">我是直播间 / 卡店 / 基地</h3>
                        <p className="text-xs text-slate-500 mt-2">
                            拥有营业执照、固定货源和仓储能力。
                        </p>
                        <ul className="mt-3 space-y-1">
                            <li className="flex items-center gap-1.5 text-xs text-slate-600">
                                <CheckCircle2 size={12} className="text-green-500"/> 自主发货
                            </li>
                            <li className="flex items-center gap-1.5 text-xs text-slate-600">
                                <CheckCircle2 size={12} className="text-green-500"/> 无箱数上限
                            </li>
                        </ul>
                    </div>

                    {/* Type B */}
                    <div 
                        onClick={() => handleSelect(UserRole.MERCHANT_B)}
                        className="bg-white p-5 rounded-2xl border-2 border-slate-100 hover:border-pink-500 transition-all cursor-pointer shadow-sm relative overflow-hidden group"
                    >
                        <div className="flex justify-between items-start mb-2">
                             <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
                                <Users size={20} />
                             </div>
                             <span className="bg-pink-100 text-pink-700 text-[10px] font-bold px-2 py-1 rounded">B类 · 饭圈</span>
                        </div>
                        <h3 className="font-bold text-base text-slate-900">我是粉头 / 应援会 / 个人</h3>
                        <p className="text-xs text-slate-500 mt-2">
                            有组队号召力，想带自家粉丝拼车。
                        </p>
                        <ul className="mt-3 space-y-1">
                            <li className="flex items-center gap-1.5 text-xs text-slate-600">
                                <CheckCircle2 size={12} className="text-green-500"/> 只负责组队分卡
                            </li>
                            <li className="flex items-center gap-1.5 text-xs text-slate-600">
                                <AlertTriangle size={12} className="text-orange-500"/> 需绑定商家供货
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {/* Step 2: Form (Mock) */}
        {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
                <div>
                    <h2 className="font-bold text-lg text-slate-900">
                        {selectedType === UserRole.MERCHANT_A ? 'A类商家认证' : 'B类粉头认证'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">请提交真实资料，审核将在 1-3 个工作日完成</p>
                </div>

                <div className="bg-white p-4 rounded-xl space-y-4 shadow-sm">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">负责人实名</label>
                        <input type="text" placeholder="请输入真实姓名" className="w-full bg-gray-50 border-none rounded-lg p-3 text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">联系电话</label>
                        <input type="tel" placeholder="用于平台风控核实" className="w-full bg-gray-50 border-none rounded-lg p-3 text-sm" />
                    </div>
                    
                    {selectedType === UserRole.MERCHANT_A && (
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">营业执照 / 店铺链接</label>
                            <div className="h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-slate-400">
                                <Store size={24} className="mb-1" />
                                <span className="text-xs">点击上传执照照片</span>
                            </div>
                        </div>
                    )}

                    {selectedType === UserRole.MERCHANT_B && (
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">社交账号证明 (微博/超话/群主)</label>
                            <div className="h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-slate-400">
                                <Users size={24} className="mb-1" />
                                <span className="text-xs">点击上传主页截图</span>
                            </div>
                            <p className="text-[10px] text-orange-500 mt-2">
                                * B类车头必须绑定 A类商家发货，不得私下收款发货。
                            </p>
                        </div>
                    )}
                </div>

                <button 
                    onClick={handleSubmit}
                    className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold shadow-lg active:scale-95 transition"
                >
                    提交审核
                </button>
            </div>
        )}

      </div>
    </div>
  );
};