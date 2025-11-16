import React, { useState } from 'react';
import { Wrench, Hammer, X, Loader2, CheckCircle2, AlertOctagon, Info } from 'lucide-react';
import { attemptCrafting } from '../services/geminiService';
import { CraftedItem } from '../types';

interface CraftingProps {
  inventory: string[];
  onCraftSuccess: (item: CraftedItem) => void;
  craftedHistory: CraftedItem[];
}

export const Crafting: React.FC<CraftingProps> = ({ inventory, onCraftSuccess, craftedHistory }) => {
  const [workbench, setWorkbench] = useState<string[]>([]);
  const [isCrafting, setIsCrafting] = useState(false);
  const [lastResult, setLastResult] = useState<{success: boolean, message: string} | null>(null);

  const addToWorkbench = (item: string) => {
    if (workbench.length < 3 && !workbench.includes(item)) {
      setWorkbench([...workbench, item]);
      setLastResult(null);
    }
  };

  const removeFromWorkbench = (item: string) => {
    setWorkbench(workbench.filter(i => i !== item));
    setLastResult(null);
  };

  const handleCraft = async () => {
    if (workbench.length < 2) return;
    
    setIsCrafting(true);
    setLastResult(null);

    try {
      const result = await attemptCrafting(workbench);
      
      if (result.success) {
        const newItem: CraftedItem = {
          id: `ITEM-${Date.now()}`,
          name: result.itemName,
          description: result.description,
          utility: result.utility,
          ingredients: [...workbench],
          timestamp: Date.now()
        };
        onCraftSuccess(newItem);
        setLastResult({ success: true, message: "Chế tạo thành công!" });
        setWorkbench([]);
      } else {
        setLastResult({ success: false, message: result.description || "Kết hợp thất bại. Không tạo ra vật phẩm hữu ích." });
      }
    } catch (e) {
      setLastResult({ success: false, message: "Hệ thống bị lỗi. Không thể chế tạo." });
    } finally {
      setIsCrafting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-20">
      <header className="mb-8 flex justify-between items-center">
        <div>
             <h2 className="text-2xl font-display text-stone-200 flex items-center gap-3">
                 <Hammer className="text-rust-500" />
                 XƯỞNG CHẾ TẠO
             </h2>
             <p className="text-xs text-stone-600 font-mono mt-1 uppercase tracking-wider">Kết hợp tài nguyên - Tạo công cụ sinh tồn</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inventory Column */}
        <div className="bg-stone-900/30 border border-stone-800 p-4 rounded-sm h-[600px] flex flex-col">
            <h3 className="text-stone-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" /> Kho Tài Nguyên
            </h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {inventory.length === 0 ? (
                    <div className="text-center p-8 text-stone-600 border border-dashed border-stone-800">
                        Chưa tìm thấy tài nguyên nào từ nhật ký.
                    </div>
                ) : (
                    inventory.map((item, idx) => {
                        const isSelected = workbench.includes(item);
                        return (
                            <button
                                key={idx}
                                onClick={() => !isSelected && addToWorkbench(item)}
                                disabled={isSelected || workbench.length >= 3}
                                className={`w-full text-left p-3 border rounded-sm text-sm font-mono transition-all
                                    ${isSelected 
                                        ? 'bg-stone-950 border-stone-800 text-stone-700 opacity-50 cursor-not-allowed' 
                                        : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-rust-500 hover:bg-stone-800'
                                    }`}
                            >
                                {item}
                            </button>
                        );
                    })
                )}
            </div>
            <div className="mt-4 text-xs text-stone-600 text-center">
                *Dữ liệu trích xuất từ nhật ký
            </div>
        </div>

        {/* Workbench Column */}
        <div className="flex flex-col gap-6">
            {/* Slots */}
            <div className="bg-stone-950 border border-stone-800 p-6 rounded-sm relative overflow-hidden min-h-[300px] flex flex-col justify-center items-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-rust-900"></div>
                <div className="absolute top-2 left-2 text-xs text-rust-700 font-mono">WORKBENCH_V1</div>
                
                <div className="flex gap-4 mb-8">
                    {[0, 1, 2].map((slot) => (
                        <div key={slot} className="w-20 h-20 md:w-24 md:h-24 border-2 border-dashed border-stone-700 bg-stone-900/50 flex items-center justify-center relative rounded-sm">
                            {workbench[slot] ? (
                                <div className="absolute inset-0 bg-stone-800 flex flex-col items-center justify-center p-1 text-center group animate-slide-down">
                                    <span className="text-[10px] md:text-xs text-stone-300 break-words w-full">{workbench[slot]}</span>
                                    <button 
                                        onClick={() => removeFromWorkbench(workbench[slot])}
                                        className="absolute -top-2 -right-2 bg-red-900 text-red-200 rounded-full p-0.5 hover:bg-red-700"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ) : (
                                <span className="text-stone-800 text-4xl font-display opacity-20">{slot + 1}</span>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleCraft}
                    disabled={isCrafting || workbench.length < 2}
                    className="relative overflow-hidden group bg-rust-900 border border-rust-600 text-rust-200 px-8 py-3 font-bold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_20px_rgba(217,119,6,0.2)]"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {isCrafting ? <Loader2 className="animate-spin" /> : <Wrench />}
                        {isCrafting ? 'Đang xử lý...' : 'Tiến Hành Ghép'}
                    </span>
                    <div className="absolute inset-0 bg-rust-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0 opacity-20"></div>
                </button>

                {/* Status Message */}
                {lastResult && (
                    <div className={`mt-6 p-3 w-full text-center text-sm border rounded-sm animate-fade-in
                        ${lastResult.success 
                            ? 'bg-emerald-950/30 border-emerald-900 text-emerald-500' 
                            : 'bg-red-950/30 border-red-900 text-red-500'
                        }`}
                    >
                        {lastResult.success ? <CheckCircle2 className="inline w-4 h-4 mr-2"/> : <AlertOctagon className="inline w-4 h-4 mr-2"/>}
                        {lastResult.message}
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="bg-stone-900/20 border border-stone-800 p-4 text-xs text-stone-500 font-mono leading-relaxed">
                HƯỚNG DẪN: Chọn ít nhất 2 nguyên liệu từ kho để thử nghiệm. AI sẽ phân tích khả năng kết hợp dựa trên logic vật lý và bối cảnh sinh tồn.
            </div>
        </div>

        {/* Crafted History Column */}
        <div className="bg-stone-900/30 border border-stone-800 p-4 rounded-sm h-[600px] flex flex-col">
             <h3 className="text-stone-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Vật Phẩm Đã Tạo
            </h3>
            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
                {craftedHistory.length === 0 ? (
                     <div className="text-center p-8 text-stone-600 italic text-sm">
                        Chưa có vật phẩm nào được chế tạo.
                    </div>
                ) : (
                    craftedHistory.map((item) => (
                        <div key={item.id} className="bg-stone-950 border border-stone-700 p-3 rounded-sm group hover:border-rust-500 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-rust-500 font-bold font-display">{item.name}</h4>
                                <span className="text-[10px] text-stone-600">{new Date(item.timestamp).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <p className="text-xs text-stone-400 mb-2 italic border-l-2 border-stone-800 pl-2">{item.description}</p>
                            <div className="text-[10px] text-emerald-600 uppercase tracking-wider mb-2">
                                Utility: {item.utility}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2 border-t border-stone-800 pt-2">
                                {item.ingredients.map((ing, i) => (
                                    <span key={i} className="text-[9px] px-1 bg-stone-800 text-stone-500 rounded">
                                        {ing}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )).reverse()
                )}
            </div>
        </div>
      </div>
    </div>
  );
};