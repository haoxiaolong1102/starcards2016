import React, { useState } from 'react';
import { Sparkles, ChevronLeft, Loader2 } from 'lucide-react';
import { generateRecruitmentCopy } from '../services/geminiService';

interface CreateCarProps {
  onBack: () => void;
  onPublish: (data: any) => void;
}

export const CreateCar: React.FC<CreateCarProps> = ({ onBack, onPublish }) => {
  const [ipName, setIpName] = useState("现在就出发3");
  const [boxCount, setBoxCount] = useState(2);
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const mockArtists = ["沈腾", "白敬亭", "范丞丞", "金晨", "王安宇"];

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    const copy = await generateRecruitmentCopy(
      ipName,
      mockArtists,
      boxCount,
      "单人卡归主，CP卡轮流分，周边卡抽奖送，信誉车头不跑路"
    );
    setDescription(copy);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-10">
        <button onClick={onBack}><ChevronLeft /></button>
        <h1 className="font-bold text-lg">发起拼团 (发车)</h1>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Step 1: Basic Info */}
        <section>
          <h2 className="text-sm font-bold text-slate-800 mb-3">1. 选择 IP & 规格</h2>
          <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">IP 名称</label>
              <select 
                value={ipName} 
                onChange={e => setIpName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-medium"
              >
                <option>现在就出发3</option>
                <option>刺杀小说家2</option>
                <option>大奉打更人</option>
                <option>封神第二部</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-slate-500 mb-1">拼箱数量</label>
              <div className="flex gap-2">
                 {[1, 2, 3, 5, 10].map(num => (
                    <button
                      key={num}
                      onClick={() => setBoxCount(num)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border ${boxCount === num ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-gray-200 bg-white text-slate-600'}`}
                    >
                      {num}箱
                    </button>
                 ))}
              </div>
            </div>
          </div>
        </section>

        {/* Step 2: Rules */}
        <section>
           <h2 className="text-sm font-bold text-slate-800 mb-3">2. 分卡规则</h2>
           <div className="bg-white p-4 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                 <span className="text-sm">组队模式</span>
                 <span className="text-sm font-bold text-violet-600">按艺人位组队</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                 <span className="text-sm">合照分配</span>
                 <span className="text-sm text-slate-600">优先主位，其次轮流</span>
              </div>
              <div className="flex items-center justify-between py-2">
                 <span className="text-sm">特殊卡分配</span>
                 <span className="text-sm text-slate-600">直播抽奖</span>
              </div>
           </div>
        </section>

        {/* Step 3: Copywriting (Gemini) */}
        <section>
          <div className="flex items-center justify-between mb-3">
             <h2 className="text-sm font-bold text-slate-800">3. 招募文案</h2>
             <button 
               onClick={handleAiGenerate}
               disabled={isGenerating}
               className="flex items-center gap-1 text-xs bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-3 py-1.5 rounded-full shadow-md active:scale-95 transition-all"
             >
               {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
               AI 帮我写
             </button>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100">
             <textarea 
               value={description}
               onChange={e => setDescription(e.target.value)}
               placeholder="例如：白敬亭专车，只要白家，其他随便..."
               className="w-full h-32 text-sm text-slate-700 bg-gray-50 p-3 rounded-lg border-none focus:ring-1 focus:ring-violet-200 resize-none"
             ></textarea>
             <p className="text-[10px] text-slate-400 mt-2 text-right">
                AI 生成内容仅供参考，请核对后发布
             </p>
          </div>
        </section>

        <button 
           onClick={() => onPublish({ ipName, boxCount, description })}
           className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
        >
           确认发车 (生成海报)
        </button>

      </div>
    </div>
  );
};