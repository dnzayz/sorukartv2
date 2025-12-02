import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ReviewLog, Card } from '../types';
import { ArrowLeft, Zap, Brain, Calendar, Activity } from 'lucide-react';

interface StatsProps {
  logs: ReviewLog[];
  cards: Card[];
  onBack: () => void;
}

export const Stats: React.FC<StatsProps> = ({ logs, cards, onBack }) => {
  // 1. Distribution Data
  const stateData = useMemo(() => {
    const counts = [0, 0, 0, 0]; // New, Learning, Review, Relearning
    cards.forEach(c => counts[c.state]++);
    return [
      { name: 'Yeni', value: counts[0], color: '#94a3b8' }, // Slate 400
      { name: 'Öğreniliyor', value: counts[1], color: '#f59e0b' }, // Amber 500
      { name: 'Tekrar', value: counts[2], color: '#10b981' }, // Emerald 500
      { name: 'Yeniden Öğr.', value: counts[3], color: '#ef4444' }, // Red 500
    ].filter(d => d.value > 0);
  }, [cards]);

  // 2. Activity Data (Last 7 Days)
  const activityData = useMemo(() => {
    const last7Days = new Array(7).fill(0).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i)); // Correct order from past to present
        return d;
    });

    const data = last7Days.map(date => {
        const dateStr = date.toLocaleDateString();
        // Count logs for this day
        const count = logs.filter(l => new Date(l.review).toLocaleDateString() === dateStr).length;
        // Format for display (Pzt, Sal) - Turkish locale
        const name = date.toLocaleDateString('tr-TR', { weekday: 'short' });
        return { name, count, fullDate: dateStr };
    });
    return data;
  }, [logs]);

  // 3. Averages
  const avgStability = (cards.filter(c => c.state > 0).reduce((acc, c) => acc + c.stability, 0) / (Math.max(1, cards.filter(c => c.state > 0).length))).toFixed(1);
  
  // Retention Rate (simplified)
  const totalReviews = logs.length;
  const successfulReviews = logs.filter(l => l.rating > 1).length; // Hard(2), Good(3), Easy(4) are "pass" in simplified view
  const retention = totalReviews > 0 ? Math.round((successfulReviews / totalReviews) * 100) : 0;

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-white shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
            <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold text-slate-800">İstatistikler</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-12">
        
        {/* Summary Grid */}
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-2">
                    <Brain size={20} />
                </div>
                <p className="text-2xl font-extrabold text-slate-800">%{retention}</p>
                <p className="text-xs text-slate-500 font-medium">Hatırlama Oranı</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-2">
                    <Activity size={20} />
                </div>
                <p className="text-2xl font-extrabold text-slate-800">{logs.length}</p>
                <p className="text-xs text-slate-500 font-medium">Toplam Çalışma</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center col-span-2 flex-row justify-around">
                 <div className="flex flex-col items-center">
                     <p className="text-xl font-bold text-slate-800">{avgStability} g</p>
                     <p className="text-xs text-slate-400 uppercase tracking-wide">Ort. Kalıcılık</p>
                 </div>
                 <div className="h-8 w-px bg-slate-100"></div>
                 <div className="flex flex-col items-center">
                     <p className="text-xl font-bold text-slate-800">{cards.length}</p>
                     <p className="text-xs text-slate-400 uppercase tracking-wide">Toplam Kart</p>
                 </div>
            </div>
        </div>

        {/* Charts */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
                <Calendar size={18} className="text-indigo-500" />
                <h3 className="font-bold text-slate-800">7 Günlük Aktivite</h3>
            </div>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 12, fill: '#94a3b8'}} 
                            dy={10}
                        />
                        <Tooltip 
                            cursor={{fill: '#f1f5f9'}}
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        />
                        <Bar 
                            dataKey="count" 
                            fill="#6366f1" 
                            radius={[6, 6, 6, 6]} 
                            barSize={12}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
                <Zap size={18} className="text-amber-500" />
                <h3 className="font-bold text-slate-800">Kart Durumları</h3>
            </div>
            <div className="flex items-center">
                <div className="h-48 w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={stateData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {stateData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-2">
                    {stateData.map(d => (
                        <div key={d.name} className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 rounded-full" style={{backgroundColor: d.color}}></div>
                            <span className="text-slate-500 flex-1">{d.name}</span>
                            <span className="font-bold text-slate-700">{d.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};