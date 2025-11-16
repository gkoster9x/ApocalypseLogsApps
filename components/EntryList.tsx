import React, { useState } from 'react';
import { JournalEntry, MOOD_COLORS } from '../types';
import { MapPin, Calendar, AlertCircle, Search } from 'lucide-react';

interface EntryListProps {
  entries: JournalEntry[];
}

export const EntryList: React.FC<EntryListProps> = ({ entries }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = entries.filter(e => 
    e.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
             <h2 className="text-2xl font-display text-stone-300">LƯU TRỮ DỮ LIỆU</h2>
             <p className="text-xs text-stone-600 font-mono mt-1">TRUY XUẤT NHẬT KÝ CÁ NHÂN</p>
        </div>
       
        <div className="relative w-full md:w-64">
            <input 
                type="text" 
                placeholder="Tìm kiếm dữ liệu..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 py-2 pl-9 pr-3 text-sm text-stone-300 focus:outline-none focus:border-stone-600 rounded-sm"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-600" />
        </div>
      </div>

      <div className="space-y-6">
        {filteredEntries.length === 0 ? (
            <div className="text-center py-20 border border-stone-800 border-dashed rounded-sm">
                <p className="text-stone-600 font-mono">KHÔNG TÌM THẤY DỮ LIỆU PHÙ HỢP</p>
            </div>
        ) : (
            filteredEntries.map((entry) => (
                <div key={entry.id} className="bg-stone-900/40 border border-stone-800 rounded-sm overflow-hidden hover:border-stone-700 transition-colors group">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                        {/* Image or Placeholder */}
                        <div className="md:col-span-3 h-48 md:h-auto bg-black relative overflow-hidden border-b md:border-b-0 md:border-r border-stone-800">
                            {entry.imageUrl ? (
                                <img src={entry.imageUrl} alt="Visual record" className="w-full h-full object-cover opacity-70 grayscale group-hover:grayscale-0 transition-all duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-stone-950 text-stone-800 p-4 text-center">
                                    <span className="text-xs uppercase tracking-widest border border-stone-800 p-2">No Visual Data</span>
                                </div>
                            )}
                             <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 text-[10px] font-mono text-stone-400 border border-stone-800">
                                {entry.id}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="md:col-span-9 p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex flex-wrap justify-between items-start mb-3 gap-2">
                                    <div className="flex items-center gap-4 text-xs text-stone-500 font-mono">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {entry.dateDisplay}</span>
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {entry.location}</span>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full border border-stone-800 bg-stone-950 ${MOOD_COLORS[entry.mood] || 'text-stone-400'}`}>
                                        {entry.mood === 'Hopeful' ? 'Hy vọng' : 
                                         entry.mood === 'Desperate' ? 'Tuyệt vọng' : 
                                         entry.mood === 'Scared' ? 'Sợ hãi' : 
                                         entry.mood === 'Angry' ? 'Giận dữ' : 'Bình thường'}
                                    </span>
                                </div>
                                
                                <p className="text-stone-300 text-sm leading-relaxed font-mono whitespace-pre-wrap line-clamp-4">
                                    {entry.content}
                                </p>
                            </div>

                            {entry.aiAnalysis && (
                                <div className="mt-4 pt-4 border-t border-stone-800/50 flex flex-wrap gap-4 items-center">
                                     <div className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-wider">
                                        <AlertCircle className="w-4 h-4 text-rust-600" />
                                        Rủi ro: <span className={`${entry.aiAnalysis.riskLevel > 50 ? 'text-rust-500' : 'text-emerald-600'}`}>{entry.aiAnalysis.riskLevel}%</span>
                                     </div>
                                     <div className="text-xs text-stone-600 italic truncate max-w-md">
                                        "{entry.aiAnalysis.summary}"
                                     </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};