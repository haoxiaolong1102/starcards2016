import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Check } from 'lucide-react';

interface RiskWarningModalProps {
  onClose: () => void;
  onAgree: () => void;
}

export const RiskWarningModal: React.FC<RiskWarningModalProps> = ({ onClose, onAgree }) => {
  const [agreed, setAgreed] = useState(false);

  const handleConfirm = () => {
    if (agreed) {
      onAgree();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-full text-orange-600">
                <ShieldAlert size={24} />
            </div>
            <div>
                <h3 className="font-bold text-lg text-slate-900">风险与免责提示</h3>
                <p className="text-xs text-orange-700">交易前请务必阅读</p>
            </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto text-slate-600 text-sm leading-relaxed space-y-4">
            <p className="font-bold text-slate-900">
                欢迎使用 StarCards 拼盒工具。为保障您的权益，请知悉：
            </p>
            
            <div className="space-y-1">
                <span className="font-bold text-slate-800 block">1. 平台定位声明</span>
                <p className="text-xs">
                    本平台仅向用户提供信息发布、组队工具及交易撮合等技术服务，<span className="font-bold text-slate-900">不作为具体交易一方当事人</span>。商品由发车人（商家/粉头）直接提供，平台不对商品质量及履约结果承担保证责任。
                </p>
            </div>

            <div className="space-y-1">
                <span className="font-bold text-slate-800 block">2. 严禁私下交易</span>
                <p className="text-xs">
                    所有资金必须通过平台支付系统进行托管。请<span className="font-bold text-red-500">勿通过微信、支付宝私下转账</span>给发车人。如绕过平台私下交易，产生纠纷平台无法提供交易证明及赔付服务，后果由您自行承担。
                </p>
            </div>

            <div className="space-y-1">
                <span className="font-bold text-slate-800 block">3. 违规举报</span>
                <p className="text-xs">
                    如发现发车人有涉嫌诈骗、虚假宣传、诱导私下交易等行为，请立即通过平台举报。我们将核查并采取封号、冻结资金、协助报警等措施。
                </p>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-gray-50">
            <label className="flex items-start gap-3 cursor-pointer select-none mb-4 group">
                <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${agreed ? 'bg-violet-600 border-violet-600' : 'bg-white border-slate-300'}`}>
                    {agreed && <Check size={14} className="text-white" />}
                </div>
                <input type="checkbox" className="hidden" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                <span className={`text-xs ${agreed ? 'text-slate-900' : 'text-slate-500'}`}>
                    我已阅读并知晓上述风险，同意《用户服务协议》及《拼团免责条款》。
                </span>
            </label>

            <div className="flex gap-3">
                <button 
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl font-bold text-sm text-slate-500 bg-white border border-slate-200"
                >
                    再想想
                </button>
                <button 
                    onClick={handleConfirm}
                    disabled={!agreed}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${agreed ? 'bg-slate-900 text-white active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                    同意并继续
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};