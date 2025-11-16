import React from 'react';
import { UserStats, JournalEntry } from '../types';
import { Activity, ShieldAlert, Clock, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface DashboardProps {
  entries: JournalEntry[];
  stats: UserStats;
}

export const Dashboard: React.FC<DashboardProps> = ({ entries, stats }) => {
  const riskData = entries.slice(-7).map(e => ({
    date: e.dateDisplay.split(',')[0], // Simplified date
    risk: e.aiAnalysis?.riskLevel || 0
  })).reverse();

  const recentMoods = entries.slice(-5).map((e, i) => ({
      index: i,
      moodVal: e.mood === 'Hopeful' ? 5 : e.mood === 'Neutral' ? 3 : e.mood === 'Angry' ? 2 : 1
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-display text-stone-200 mb-2">TRẠNG THÁI SINH TỒN</h1>
        <p className="text-stone-500 font-mono text-sm uppercase tracking-widest">Ngày thứ {stats.daysSurvived} kể từ Ngày Z</p>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Clock className="text-rust-500" />} 
          label="Thời Gian Sống Sót" 
          value={`${stats.daysSurvived} Ngày`} 
          subtext="Kiên cường."
        />
        <StatCard 
          icon={<Activity className="text-emerald-600" />} 
          label="Tình Trạng Sức Khỏe" 
          value={`${stats.healthStatus}%`} 
          subtext="Cần thêm thuốc men."
        />
        <StatCard 
          icon={<ShieldAlert className="text-orange-700" />} 
          label="Mức Độ Đe Dọa" 
          value={entries[0]?.aiAnalysis?.riskLevel ? `${entries[0].aiAnalysis.riskLevel}%` : "N/A"}
          subtext="Dựa trên nhật ký gần nhất."
        />
        <StatCard 
          icon={<MapPin className="text-stone-400" />} 
          label="Vị Trí Hiện Tại" 
          value={stats.lastLocation || "Không xác định"}
          subtext="Đang di chuyển."
        />
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-stone-900/50 border border-stone-800 p-6 rounded-sm">
            <h3 className="text-stone-400 text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-rust-500 rounded-full"></span>
                Biểu Đồ Rủi Ro (7 ngày qua)
            </h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#292524" />
                        <XAxis dataKey="date" stroke="#78716c" fontSize={12} tickLine={false} />
                        <YAxis stroke="#78716c" fontSize={12} tickLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1c1917', borderColor: '#44403c', color: '#d6d3d1' }}
                            itemStyle={{ color: '#d97706' }}
                        />
                        <Bar dataKey="risk" fill="#78350f" radius={[2, 2, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

         <div className="bg-stone-900/50 border border-stone-800 p-6 rounded-sm">
            <h3 className="text-stone-400 text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-700 rounded-full"></span>
                Biến Động Tinh Thần
            </h3>
            <div className="h-64 w-full flex items-center justify-center text-stone-600 italic text-sm">
                {recentMoods.length > 0 ? (
                     <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={recentMoods}>
                         <CartesianGrid strokeDasharray="3 3" stroke="#292524" />
                         <YAxis hide domain={[0, 6]} />
                         <Tooltip cursor={{stroke: '#44403c'}} contentStyle={{ backgroundColor: '#1c1917', borderColor: '#44403c' }} />
                         <Line type="monotone" dataKey="moodVal" stroke="#059669" strokeWidth={2} dot={{ fill: '#059669' }} />
                     </LineChart>
                 </ResponsiveContainer>
                ) : "Chưa có dữ liệu nhật ký"}
            </div>
        </div>
      </div>

      {/* Latest Intel */}
      <div className="mt-8">
          <h3 className="text-stone-400 text-sm uppercase tracking-wider mb-4">Phân Tích Mới Nhất Từ AI</h3>
          {entries.length > 0 && entries[0].aiAnalysis ? (
             <div className="bg-gradient-to-r from-stone-900 to-dust-900 border border-stone-800 p-6 rounded-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-rust-600"></div>
                <p className="text-lg text-stone-300 font-display mb-2">"{entries[0].aiAnalysis.summary}"</p>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-xs text-rust-500 uppercase mb-2">Lời Khuyên Sinh Tồn</h4>
                        <ul className="list-disc list-inside text-sm text-stone-400 space-y-1">
                            {entries[0].aiAnalysis.survivalTips.map((tip, idx) => (
                                <li key={idx}>{tip}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs text-emerald-600 uppercase mb-2">Tài Nguyên Phát Hiện</h4>
                         <div className="flex flex-wrap gap-2">
                            {entries[0].aiAnalysis.resourcesDetected.map((res, idx) => (
                                <span key={idx} className="px-2 py-1 bg-stone-800 text-stone-400 text-xs rounded border border-stone-700">
                                    {res}
                                </span>
                            ))}
                            {entries[0].aiAnalysis.resourcesDetected.length === 0 && <span className="text-stone-600 text-sm italic">Không phát hiện</span>}
                        </div>
                    </div>
                </div>
             </div>
          ) : (
              <div className="text-stone-600 border border-stone-800 border-dashed p-6 text-center">
                  Chưa có dữ liệu phân tích. Hãy viết nhật ký đầu tiên.
              </div>
          )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, subtext }: { icon: React.ReactNode, label: string, value: string, subtext: string }) => (
  <div className="bg-stone-900/80 border border-stone-800 p-4 rounded-sm shadow-sm backdrop-blur-sm">
    <div className="flex justify-between items-start mb-2">
      <span className="text-stone-500 text-xs font-bold uppercase tracking-wider">{label}</span>
      {icon}
    </div>
    <div className="text-2xl font-bold text-stone-200 font-display">{value}</div>
    <div className="text-xs text-stone-600 mt-1">{subtext}</div>
  </div>
);