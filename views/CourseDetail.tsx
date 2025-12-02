import React, { useMemo } from 'react';
import { Card, UserSettings, ExamType, CourseData, COURSES } from '../types';
import { ArrowLeft, BookOpen, Lock, PlayCircle, GraduationCap } from 'lucide-react';

interface CourseDetailProps {
  courseId: string;
  settings: UserSettings;
  cards: Card[];
  onBack: () => void;
  onStudy: (courseId: string, unitId?: number) => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({ courseId, settings, cards, onBack, onStudy }) => {
  // Find Course Info
  const courseInfo = Object.values(COURSES).flat().find(c => c.id === courseId);
  const courseName = courseInfo ? courseInfo.name : courseId;

  // Max Unit based on Exam Type
  const maxUnit = settings.examType === ExamType.Midterm ? 4 : 8;

  // Organize cards by unit
  const units = useMemo(() => {
    const unitMap = new Array(8).fill(0).map((_, i) => {
      const unitNum = i + 1;
      const unitCards = cards.filter(c => c.courseId === courseId && c.unit === unitNum);
      const dueCount = unitCards.filter(c => c.due <= Date.now() && c.state !== 0).length;
      const newCount = unitCards.filter(c => c.state === 0).length;
      const totalCount = unitCards.length;
      const learnedCount = unitCards.filter(c => c.state > 1).length; // Review or Relearning
      
      return {
        unit: unitNum,
        totalCards: totalCount,
        dueCards: dueCount,
        newCards: newCount,
        learnedCards: learnedCount,
        isIncluded: unitNum <= maxUnit
      };
    });
    return unitMap;
  }, [cards, courseId, maxUnit]);

  // Overall Course Stats
  const totalDue = units.filter(u => u.isIncluded).reduce((acc, u) => acc + u.dueCards, 0);
  const totalNew = units.filter(u => u.isIncluded).reduce((acc, u) => acc + u.newCards, 0);

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm z-10 sticky top-0 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
            <ArrowLeft size={24} />
        </button>
        <div className="flex-1 min-w-0">
             <h2 className="text-lg font-bold text-slate-800 truncate">{courseName}</h2>
             <p className="text-xs text-slate-500 font-medium">
                {settings.examType === ExamType.Midterm ? 'Vize (Ünite 1-4)' : 'Final (Ünite 1-8)'}
             </p>
        </div>
      </div>

      {/* Main Action Card */}
      <div className="p-4 pb-0">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <GraduationCap size={120} />
             </div>
             
             <div className="relative z-10">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="text-indigo-100 text-sm font-medium mb-1">Toplam Tekrar</p>
                        <h3 className="text-4xl font-bold tracking-tight">{totalDue}</h3>
                    </div>
                     <button 
                        onClick={() => onStudy(courseId)}
                        className="bg-white text-indigo-700 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center gap-2"
                        disabled={totalDue === 0 && totalNew === 0}
                    >
                        <PlayCircle size={18} />
                        Dersi Çalış
                    </button>
                </div>
                <div className="flex gap-4 text-xs font-medium text-indigo-100/80">
                    <span>{totalNew} Yeni Kart Mevcut</span>
                </div>
             </div>
          </div>
      </div>

      {/* Unit List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
        <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider ml-1 mb-2">Üniteler</h3>
        
        {units.map((u) => (
            <div 
                key={u.unit}
                className={`
                    relative rounded-xl p-4 transition-all
                    ${u.isIncluded 
                        ? 'bg-white shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100' 
                        : 'bg-slate-50 border border-slate-100 opacity-70' // Lighter disabled state
                    }
                `}
            >
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                        <div className={`
                            w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg
                            ${u.isIncluded ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-400'}
                        `}>
                            {u.unit}
                        </div>
                        <div>
                            <h4 className={`font-bold ${u.isIncluded ? 'text-slate-800' : 'text-slate-500'}`}>Ünite {u.unit}</h4>
                            <p className="text-xs text-slate-500">
                                {u.isIncluded ? `${u.totalCards} kart` : 'Sınava Dahil Değil'}
                            </p>
                        </div>
                    </div>
                    
                    {u.isIncluded ? (
                        <button 
                            onClick={() => onStudy(courseId, u.unit)}
                            className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 active:bg-indigo-200 transition-colors"
                            aria-label={`Ünite ${u.unit} Çalış`}
                        >
                            <PlayCircle size={20} />
                        </button>
                    ) : (
                        <Lock size={20} className="text-slate-300 mt-2 mr-2" />
                    )}
                </div>

                {/* Progress Bar for Unit */}
                {u.isIncluded && (
                    <div className="mt-3">
                         <div className="flex justify-between text-xs mb-1 text-slate-400 font-medium">
                            <span className={u.dueCards > 0 ? "text-amber-500 font-bold" : ""}>
                                {u.dueCards} Tekrar
                            </span>
                            <span>{Math.round((u.learnedCards / Math.max(u.totalCards, 1)) * 100)}% Tamamlandı</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-green-500 rounded-full" 
                                style={{ width: `${(u.learnedCards / Math.max(u.totalCards, 1)) * 100}%` }} 
                            />
                         </div>
                    </div>
                )}
            </div>
        ))}
      </div>
    </div>
  );
};