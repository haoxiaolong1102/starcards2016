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
                        <h3 className="font-bold text-sm text-violet-900">平台安全与合规声明</h3>
                        <p className="text-xs text-violet-700 mt-1 leading-relaxed">
                            StarCards 仅提供技术撮合服务，不参与具体交易。发车人需通过严格的实名及资质审核，并独立承担发货、售后及法律责任。所有交易资金将由第三方支付机构托管，待用户确认收货后结算。
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
                             <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded">A类 · 经营性商家</span>
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
                             <span className="bg-pink-100 text-pink-700 text-[10px] font-bold px-2 py-1 rounded">B类 · 个人/粉头</span>
                        </div>
                        <h3 className="font-bold text-base text-slate-900">我是粉头 / 应援会 / 个人</h3>
                        <p className="text-xs text-slate-500 mt-2">
                            有组队号召力，想带自家粉丝拼车。
                        </p>
                        <ul className="mt-3 space-y-1">
                            <li className="flex items-center gap-1.5 text-xs text-slate-600">
                                <CheckCircle2 size={12} className="text-green-500"/> 仅作为发起人
                            </li>
                            <li className="flex items-center gap-1.5 text-xs text-slate-600">
                                <AlertTriangle size={12} className="text-orange-500"/> 需绑定认证商家发货
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
                        {selectedType === UserRole.MERCHANT_A ? 'A类商家实名认证' : 'B类粉头实名认证'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">需提交真实身份信息以供平台风控核实</p>
                </div>

                <div className="bg-white p-4 rounded-xl space-y-4 shadow-sm">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">真实姓名/负责人</label>
                        <input type="text" placeholder="请输入身份证上的真实姓名" className="w-full bg-gray-50 border-none rounded-lg p-3 text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">身份证号/统一社会信用代码</label>
                        <input type="text" placeholder="用于实名认证" className="w-full bg-gray-50 border-none rounded-lg p-3 text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">联系电话</label>
                        <input type="tel" placeholder="用于紧急联系" className="w-full bg-gray-50 border-none rounded-lg p-3 text-sm" />
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
                            <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg mt-2">
                                <p className="text-[10px] text-orange-600 leading-snug">
                                    <span className="font-bold">重要提示：</span>
                                    B类用户严禁以个人名义私下收款发货。所有交易必须通过平台绑定的合作商家（A类）进行履约，否则平台将有权封禁账号并追究法律责任。
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-start gap-2 mb-2 px-1">
                     <input type="checkbox" className="mt-1 rounded text-violet-600" />
                     <p className="text-xs text-slate-500 leading-snug">
                         我已阅读并同意 <span className="text-violet-600 font-bold">《发车人入驻协议》</span>，承诺所提供信息真实有效，并承担相应法律责任。
                     </p>
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