import React, { useMemo } from 'react';
import { Card, UserSettings, ExamType, COURSES } from '../types';
import { Settings, BookOpen, Clock, ChevronRight, BarChart3, Layers } from 'lucide-react';

interface DashboardProps {
  settings: UserSettings;
  cards: Card[];
  onNavigateToCourse: (courseId: string) => void;
  onNavigate: (view: string) => void;
  onQuickReview: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ settings, cards, onNavigateToCourse, onNavigate, onQuickReview }) => {
  // Global Stats Calculation
  const maxUnit = settings.examType === ExamType.Midterm ? 4 : 8;
  const relevantCards = cards.filter(c => settings.courses.includes(c.courseId) && c.unit <= maxUnit);
  const totalDue = relevantCards.filter(c => c.due <= Date.now() && c.state !== 0).length;
  
  // Calculate days left
  const examDate = new Date(settings.examDate);
  const today = new Date();
  const diffTime = Math.max(0, examDate.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 0;

  // Course List Data
  const myCourses = useMemo(() => {
    const allCourses = Object.values(COURSES).flat();
    return settings.courses.map(courseId => {
        const info = allCourses.find(c => c.id === courseId);
        const courseCards = relevantCards.filter(c => c.courseId === courseId);
        const due = courseCards.filter(c => c.due <= Date.now() && c.state !== 0).length;
        const total = courseCards.length;
        const mastered = courseCards.filter(c => c.state > 1).length;
        
        return {
            id: courseId,
            name: info ? info.name : courseId,
            due,
            total,
            progress: total > 0 ? Math.round((mastered / total) * 100) : 0
        };
    });
  }, [settings.courses, relevantCards]);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Top Section with Gradient */}
      <div className="bg-indigo-600 text-white pb-8 rounded-b-[2.5rem] shadow-xl z-10 relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500 opacity-20 rounded-full translate-x-1/3 translate-y-1/3 blur-xl"></div>

        <div className="p-6 relative z-10">
            {/* Header Nav */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Merhaba, {settings.name.split(' ')[0]}</h1>
                    <p className="text-indigo-200 text-sm font-medium">{settings.department}</p>
                </div>
                <div className="flex gap-3">
                     <button onClick={() => onNavigate('stats')} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
                        <BarChart3 size={20} />
                    </button>
                    <button onClick={() => onNavigate('settings')} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            {/* Main Stats Summary */}
            <div className="flex gap-4">
                <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">
                        <Clock size={12} />
                        <span>Sınava Kalan</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                         <span className="text-3xl font-bold">{diffDays}</span>
                         <span className="text-sm opacity-80">gün</span>
                    </div>
                </div>
                <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                     <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">
                        <Layers size={12} />
                        <span>Tekrar Edilecek</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                         <span className="text-3xl font-bold">{totalDue}</span>
                         <span className="text-sm opacity-80">kart</span>
                    </div>
                </div>
            </div>

            {/* Quick Action */}
             {totalDue > 0 && (
                <button 
                    onClick={onQuickReview}
                    className="w-full mt-6 bg-white text-indigo-600 py-3.5 px-4 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <Layers size={18} />
                    Hızlı Tekrar Yap
                </button>
            )}
        </div>
      </div>

      {/* Courses List */}
      <div className="flex-1 overflow-y-auto -mt-4 pt-6 px-4 pb-20 space-y-4">
        <h3 className="text-slate-800 font-bold text-lg px-1">Derslerim</h3>
        
        {myCourses.map(course => (
            <button 
                key={course.id}
                onClick={() => onNavigateToCourse(course.id)}
                className="w-full bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all active:scale-[0.98] text-left"
            >
                <div className="flex-1 min-w-0 pr-4">
                    <div className="flex justify-between items-start mb-2">
                         <h4 className="font-bold text-slate-800 truncate">{course.name}</h4>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                        <span className="flex items-center gap-1">
                            <BookOpen size={14} className="text-indigo-400"/> {course.total} kart
                        </span>
                        {course.due > 0 && (
                            <span className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                                {course.due} tekrar
                            </span>
                        )}
                    </div>

                    {/* Mini Progress */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${course.progress}%` }}></div>
                    </div>
                </div>

                <div className="bg-slate-50 p-2 rounded-full text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                    <ChevronRight size={20} />
                </div>
            </button>
        ))}

        <div className="h-8"></div> {/* Spacer */}
      </div>
    </div>
  );
};