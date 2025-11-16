import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { Save, Loader2, Wand2, Image as ImageIcon, AlertTriangle, FileText } from 'lucide-react';
import { analyzeJournalEntry, generateJournalImage } from '../services/geminiService';

interface JournalEditorProps {
  onSave: (entry: JournalEntry) => void;
  nextId: number;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({ onSave, nextId }) => {
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [mood, setMood] = useState<JournalEntry['mood']>('Neutral');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<JournalEntry['aiAnalysis'] | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!content) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeJournalEntry(content, location || "Không rõ");
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      alert("Hệ thống phân tích gặp lỗi. Vui lòng thử lại.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!content) return;
    setIsGeneratingImage(true);
    try {
      const base64 = await generateJournalImage(content);
      setGeneratedImage(base64);
    } catch (e) {
      console.error(e);
      alert("Hệ thống tạo ảnh gặp lỗi. Vui lòng thử lại.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSave = () => {
    if (!content) return;
    const newEntry: JournalEntry = {
      id: `LOG-${nextId.toString().padStart(3, '0')}`,
      timestamp: Date.now(),
      dateDisplay: new Date().toLocaleString('vi-VN'),
      content,
      location: location || 'Không xác định',
      mood,
      tags: [],
      aiAnalysis: analysisResult || undefined,
      imageUrl: generatedImage || undefined,
    };
    onSave(newEntry);
    // Reset form
    setContent('');
    setLocation('');
    setMood('Neutral');
    setAnalysisResult(null);
    setGeneratedImage(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-slide-up">
      <header className="flex justify-between items-center border-b border-stone-800 pb-4">
        <h2 className="text-xl font-display text-rust-500">GHI CHÉP NHẬT KÝ: LOG #{nextId}</h2>
        <div className="text-xs text-stone-500 font-mono">{new Date().toLocaleString('vi-VN')}</div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Editor Section */}
        <div className="md:col-span-2 space-y-4">
          <div className="space-y-2">
            <label className="text-xs uppercase text-stone-500 tracking-wider">Vị trí hiện tại</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-stone-900/50 border border-stone-800 text-stone-300 p-3 rounded-sm focus:border-rust-500 focus:outline-none font-mono text-sm"
              placeholder="Ví dụ: Khu tàn tích quận 7, Sài Gòn..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase text-stone-500 tracking-wider">Nội dung ghi chép</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 bg-stone-900/50 border border-stone-800 text-stone-300 p-4 rounded-sm focus:border-rust-500 focus:outline-none font-mono leading-relaxed resize-none"
              placeholder="Hôm nay tôi đã tìm thấy..."
            />
          </div>

          <div className="space-y-2">
             <label className="text-xs uppercase text-stone-500 tracking-wider">Tâm trạng</label>
             <div className="flex flex-wrap gap-2">
               {['Hopeful', 'Desperate', 'Neutral', 'Scared', 'Angry'].map((m) => (
                 <button
                   key={m}
                   onClick={() => setMood(m as JournalEntry['mood'])}
                   className={`px-3 py-1 text-xs border rounded-full transition-colors
                     ${mood === m 
                       ? 'bg-stone-700 border-stone-500 text-stone-200' 
                       : 'bg-transparent border-stone-800 text-stone-600 hover:border-stone-600'}`}
                 >
                   {m === 'Hopeful' ? 'Hy vọng' : 
                    m === 'Desperate' ? 'Tuyệt vọng' : 
                    m === 'Scared' ? 'Sợ hãi' : 
                    m === 'Angry' ? 'Giận dữ' : 'Bình thường'}
                 </button>
               ))}
             </div>
          </div>

           {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
             <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !content}
                className="flex items-center gap-2 px-4 py-2 bg-stone-800 border border-stone-700 text-stone-300 hover:bg-stone-700 disabled:opacity-50 text-sm rounded-sm"
             >
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                Phân tích Rủi Ro
             </button>
             <button
                onClick={handleGenerateImage}
                disabled={isGeneratingImage || !content}
                className="flex items-center gap-2 px-4 py-2 bg-stone-800 border border-stone-700 text-stone-300 hover:bg-stone-700 disabled:opacity-50 text-sm rounded-sm"
             >
                {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                Tái hiện Hình Ảnh
             </button>
             <div className="flex-grow"></div>
             <button
                onClick={handleSave}
                disabled={!content}
                className="flex items-center gap-2 px-6 py-2 bg-rust-900 border border-rust-500 text-rust-500 hover:bg-rust-900/80 hover:text-rust-400 disabled:opacity-50 font-bold tracking-wider rounded-sm shadow-[0_0_15px_rgba(217,119,6,0.1)]"
             >
                <Save className="w-4 h-4" />
                LƯU GHI CHÉP
             </button>
          </div>
        </div>

        {/* Preview / Analysis Sidebar */}
        <div className="space-y-6">
            {/* Image Preview */}
            <div className="aspect-video bg-black border border-stone-800 flex items-center justify-center overflow-hidden rounded-sm relative">
                {isGeneratingImage && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
                        <Loader2 className="w-8 h-8 text-rust-500 animate-spin mb-2" />
                        <span className="text-xs text-rust-500 animate-pulse">ĐANG XỬ LÝ DỮ LIỆU HÌNH ẢNH...</span>
                    </div>
                )}
                {generatedImage ? (
                    <img src={generatedImage} alt="Generated visualization" className="w-full h-full object-cover opacity-90" />
                ) : (
                    <div className="text-center p-4">
                        <ImageIcon className="w-12 h-12 text-stone-800 mx-auto mb-2" />
                        <p className="text-xs text-stone-700 uppercase">Chưa có dữ liệu hình ảnh</p>
                    </div>
                )}
            </div>

            {/* Analysis Results */}
            <div className="border border-stone-800 bg-stone-900/30 p-4 min-h-[200px] rounded-sm relative">
                 {isAnalyzing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/90 z-10">
                        <Loader2 className="w-6 h-6 text-emerald-600 animate-spin mb-2" />
                        <span className="text-xs text-emerald-600 animate-pulse">ĐANG PHÂN TÍCH LOG...</span>
                    </div>
                )}
                
                <h3 className="text-stone-500 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3" />
                    Đánh giá AI
                </h3>

                {analysisResult ? (
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-center border-b border-stone-800 pb-2">
                            <span className="text-stone-400">Mức độ nguy hiểm:</span>
                            <span className={`font-bold ${analysisResult.riskLevel > 70 ? 'text-red-500' : analysisResult.riskLevel > 40 ? 'text-orange-500' : 'text-emerald-500'}`}>
                                {analysisResult.riskLevel}%
                            </span>
                        </div>
                        <div>
                            <span className="text-stone-400 block mb-1 text-xs uppercase">Lời khuyên:</span>
                            <ul className="list-disc list-inside text-stone-300 space-y-1 text-xs">
                                {analysisResult.survivalTips.map((tip, i) => (
                                    <li key={i}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <span className="text-stone-400 block mb-1 text-xs uppercase">Tài nguyên:</span>
                             <div className="flex flex-wrap gap-1">
                                {analysisResult.resourcesDetected.length > 0 ? analysisResult.resourcesDetected.map((res, i) => (
                                    <span key={i} className="text-[10px] px-1.5 py-0.5 bg-stone-800 text-stone-400 border border-stone-700 rounded">
                                        {res}
                                    </span>
                                )) : <span className="text-stone-600 italic text-xs">Không tìm thấy</span>}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-stone-700 text-xs text-center mt-8 italic">
                        Chạy phân tích để nhận đánh giá rủi ro và lời khuyên sinh tồn.
                    </p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};