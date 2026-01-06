import React, { useState, useRef } from 'react';
import { ChevronLeft, Store, Plus, Trash2, Upload, AlertCircle, Info, FileText } from 'lucide-react';
import { UserRole } from '../types';

interface CreateCarProps {
  onBack: () => void;
  onPublish: (data: any) => void;
  userRole?: UserRole;
}

interface DraftSlot {
  id: string;
  name: string; // 艺人名 或 特殊卡名
  price: string;
  quantity: string; // 该位置有多少份
  isSpecial: boolean; // 是否为特殊位（周边/兑换）
}

export const CreateCar: React.FC<CreateCarProps> = ({ onBack, onPublish, userRole = UserRole.MERCHANT_B }) => {
  // 1. 基础信息
  const [ipName, setIpName] = useState("");
  
  // 2. 规格配置
  const [specType, setSpecType] = useState<'BOX' | 'PACK'>('BOX'); // 拼箱还是拼盒
  const [totalUnits, setTotalUnits] = useState("1"); // 总箱数
  const [packsPerBox, setPacksPerBox] = useState("10"); // 一箱多少盒/包
  const [cardsPerPack, setCardsPerPack] = useState("5"); // 一包多少张

  // 3. 车位配置 (自定义)
  const [slots, setSlots] = useState<DraftSlot[]>([
    { id: '1', name: '', price: '', quantity: '1', isSpecial: false }
  ]);

  // 4. 其他
  const [description, setDescription] = useState("");
  const [extraNote, setExtraNote] = useState(""); // 特别说明
  const [coverImage, setCoverImage] = useState<string | null>(null);

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  const handleAddSlot = () => {
    setSlots([...slots, { id: Date.now().toString(), name: '', price: '', quantity: '1', isSpecial: false }]);
  };

  const handleRemoveSlot = (id: string) => {
    if (slots.length > 1) {
      setSlots(slots.filter(s => s.id !== id));
    }
  };

  const handleSlotChange = (id: string, field: keyof DraftSlot, value: string) => {
    setSlots(slots.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishClick = () => {
      // 验证
      if (!ipName) return alert("请填写IP名称");
      if (slots.some(s => !s.name || !s.price)) return alert("请完善车位信息（艺人名和价格）");
      if (!coverImage) return alert("请上传封面图");

      const finalSlots = slots.map(s => ({
          id: s.id,
          name: s.name,
          price: Number(s.price),
          totalSpots: Number(s.quantity),
          takenSpots: 0, // 初始为0
          avatarUrl: `https://ui-avatars.com/api/?name=${s.name}&background=random`, // 自动生成头像
          isHot: s.isSpecial
      }));

      // 计算描述文本
      const specText = specType === 'BOX' 
        ? `${totalUnits}箱团 (每箱${packsPerBox}盒/包)` 
        : `${totalUnits}盒/包团 (每盒${cardsPerPack}张)`;

      onPublish({ 
        ipName, 
        boxCount: Number(totalUnits), 
        description: `${specText}\n\n${description}`,
        extraNote: extraNote,
        customSlots: finalSlots,
        coverImage: coverImage
      });
  };

  // 计算总价预览
  const totalPrice = slots.reduce((acc, s) => acc + (Number(s.price) * Number(s.quantity)), 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <button onClick={onBack}><ChevronLeft /></button>
        <h1 className="font-bold text-lg">发起拼团</h1>
      </div>

      <div className="p-4 space-y-6">
        
        {/* 身份提示 */}
        <div className={`px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold ${userRole === UserRole.MERCHANT_A ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}`}>
            <Store size={14}/>
            {userRole === UserRole.MERCHANT_A ? '当前身份：A类认证商家' : '当前身份：B类车头'}
        </div>

        {/* 1. 基础信息 & 规格 */}
        <section>
          <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              1. 基础信息
          </h2>
          <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5 font-bold">IP 名称 (手动填写)</label>
              <input 
                value={ipName}
                onChange={e => setIpName(e.target.value)}
                placeholder="例如：现在就出发3、封神第二部..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-bold"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="block text-xs text-slate-500 mb-1.5 font-bold">组队模式</label>
                    <div className="flex bg-gray-50 p-1 rounded-lg">
                        <button 
                            onClick={() => setSpecType('BOX')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${specType === 'BOX' ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`}
                        >
                            整箱拼
                        </button>
                        <button 
                            onClick={() => setSpecType('PACK')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${specType === 'PACK' ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`}
                        >
                            散盒拼
                        </button>
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs text-slate-500 mb-1.5 font-bold">总数量 ({specType === 'BOX' ? '箱' : '盒'})</label>
                    <input 
                        type="number"
                        value={totalUnits}
                        onChange={e => setTotalUnits(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm font-bold"
                    />
                 </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg flex gap-4 text-xs">
                 <div className="flex-1">
                    <label className="block text-slate-400 mb-1 scale-90 origin-left">每箱含盒/包数</label>
                    <input 
                        type="number" 
                        value={packsPerBox} 
                        onChange={e => setPacksPerBox(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-center font-medium"
                    />
                 </div>
                 <div className="flex-1">
                    <label className="block text-slate-400 mb-1 scale-90 origin-left">每盒含卡数</label>
                    <input 
                        type="number" 
                        value={cardsPerPack} 
                        onChange={e => setCardsPerPack(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-center font-medium"
                    />
                 </div>
            </div>
          </div>
        </section>

        {/* 2. 车位配置 (动态) */}
        <section>
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-800">2. 配置车位 (艺人/特殊位)</h2>
                <div className="text-xs text-slate-400">
                    预估总价: <span className="text-violet-600 font-bold">¥{totalPrice}</span>
                </div>
            </div>
            
            <div className="space-y-3">
                {slots.map((slot, index) => (
                    <div key={slot.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm relative animate-in slide-in-from-bottom-2">
                        <div className="flex items-start gap-2 mb-2">
                            <div className="flex-1">
                                <label className="block text-[10px] text-slate-400 mb-1">名称 (艺人/兑换/周边)</label>
                                <input 
                                    value={slot.name}
                                    onChange={(e) => handleSlotChange(slot.id, 'name', e.target.value)}
                                    placeholder="例如：白敬亭"
                                    className="w-full bg-gray-50 border-none rounded p-2 text-sm font-bold text-slate-800"
                                />
                            </div>
                            <div className="w-20">
                                <label className="block text-[10px] text-slate-400 mb-1">单价 (¥)</label>
                                <input 
                                    type="number"
                                    value={slot.price}
                                    onChange={(e) => handleSlotChange(slot.id, 'price', e.target.value)}
                                    placeholder="0"
                                    className="w-full bg-gray-50 border-none rounded p-2 text-sm font-bold text-red-500 text-center"
                                />
                            </div>
                            <div className="w-16">
                                <label className="block text-[10px] text-slate-400 mb-1">数量</label>
                                <input 
                                    type="number"
                                    value={slot.quantity}
                                    onChange={(e) => handleSlotChange(slot.id, 'quantity', e.target.value)}
                                    placeholder="1"
                                    className="w-full bg-gray-50 border-none rounded p-2 text-sm text-center"
                                />
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                            <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer select-none">
                                <input 
                                    type="checkbox" 
                                    checked={slot.isSpecial}
                                    onChange={(e) => setSlots(slots.map(s => s.id === slot.id ? { ...s, isSpecial: e.target.checked } : s))}
                                    className="rounded text-violet-600 focus:ring-violet-500" 
                                />
                                特殊位 (兑换/周边)
                            </label>
                            
                            {slots.length > 1 && (
                                <button onClick={() => handleRemoveSlot(slot.id)} className="text-slate-300 hover:text-red-500 p-1">
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                <button 
                    onClick={handleAddSlot}
                    className="w-full py-3 border-2 border-dashed border-violet-200 rounded-xl text-violet-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-violet-50 transition-colors"
                >
                    <Plus size={16} /> 添加一行
                </button>
            </div>
        </section>

        {/* 3. 封面与说明 */}
        <section>
            <h2 className="text-sm font-bold text-slate-800 mb-3">3. 封面与说明</h2>
            <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-4">
                {/* Image Upload */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*"
                />
                <div 
                    onClick={handleImageClick}
                    className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-violet-300 hover:bg-violet-50 transition-all relative overflow-hidden group"
                >
                    {coverImage ? (
                        <>
                            <img src={coverImage} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-bold flex items-center gap-1"><Upload size={14}/> 更换图片</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <Upload size={24} className="mb-2" />
                            <span className="text-xs">点击上传封面图 (本地图片)</span>
                        </>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">详情描述 (规则/开箱时间)</label>
                    <textarea 
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="例如：单人卡归主，CP卡轮流分，周边卡抽奖送..."
                        className="w-full h-24 text-sm text-slate-700 bg-gray-50 p-3 rounded-lg border-none focus:ring-1 focus:ring-violet-200 resize-none"
                    ></textarea>
                </div>
                
                {/* Extra Note */}
                <div>
                     <label className="flex items-center gap-1.5 text-xs font-bold text-orange-600 mb-2">
                        <FileText size={14} /> 详情页特别说明 (重要)
                     </label>
                     <textarea 
                        value={extraNote}
                        onChange={e => setExtraNote(e.target.value)}
                        placeholder="例如：非偏远地区包邮，偏远地区到付。车一旦满员不支持退款..."
                        className="w-full h-20 text-sm text-slate-700 bg-orange-50 p-3 rounded-lg border border-orange-100 focus:ring-1 focus:ring-orange-200 resize-none placeholder-orange-300"
                    ></textarea>
                </div>
            </div>
        </section>

        {/* Footer */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 p-4 z-[60]">
            <button 
                onClick={handlePublishClick}
                className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
            >
                确认发车
            </button>
        </div>

      </div>
    </div>
  );
};