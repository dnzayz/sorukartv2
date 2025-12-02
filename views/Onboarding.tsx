import React, { useState } from 'react';
import { DEPARTMENTS, COURSES, ExamType, UserSettings } from '../types';
import { Button } from '../components/Button';
import { StorageService } from '../services/storage';
import { Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [department, setDepartment] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [examDate, setExamDate] = useState('');
  const [examType, setExamType] = useState<ExamType>(ExamType.Final);
  const [name, setName] = useState('');

  const handleFinish = () => {
    if (!department || selectedCourses.length === 0 || !examDate || !name) return;
    
    const settings: UserSettings = {
      name,
      department,
      courses: selectedCourses,
      examDate,
      examType,
      isOnboarded: true
    };
    
    StorageService.saveSettings(settings);
    onComplete();
  };

  const toggleCourse = (courseId: string) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">AceIt'e Hoşgeldin</h1>
            <p className="text-slate-500">Çalışma planını oluşturalım.</p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Adın nedir?</label>
              <input 
                type="text" 
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 placeholder:text-slate-400"
                placeholder="Öğrenci Adı"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <Button fullWidth onClick={() => name && setStep(2)}>İleri</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bölüm</label>
              <select 
                className="w-full p-3 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                value={department}
                onChange={(e) => {
                    setDepartment(e.target.value);
                    setSelectedCourses([]);
                }}
              >
                <option value="">Bölüm Seçiniz</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            
            {department && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Dersleri Seç (Çoklu)</label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {(COURSES[department] || []).map(c => {
                        const isSelected = selectedCourses.includes(c.id);
                        return (
                            <button
                                key={c.id}
                                onClick={() => toggleCourse(c.id)}
                                className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                                    isSelected 
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                                }`}
                            >
                                <span className="text-sm font-medium text-left">{c.name}</span>
                                {isSelected && <Check size={18} />}
                            </button>
                        );
                    })}
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setStep(1)} fullWidth>Geri</Button>
                <Button fullWidth onClick={() => selectedCourses.length > 0 && setStep(3)}>İleri</Button>
            </div>
          </div>
        )}

        {step === 3 && (
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Sınav Türü</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            className={`p-3 rounded-xl border font-medium transition-all ${examType === ExamType.Midterm ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                            onClick={() => setExamType(ExamType.Midterm)}
                        >
                            Vize
                        </button>
                        <button 
                             className={`p-3 rounded-xl border font-medium transition-all ${examType === ExamType.Final ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                             onClick={() => setExamType(ExamType.Final)}
                        >
                            Final
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                        {examType === ExamType.Midterm ? 'Ünite 1-4 dahildir' : 'Ünite 1-8 dahildir'}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Sınav Tarihi</label>
                    <input 
                        type="date" 
                        className="w-full p-3 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        value={examDate}
                        onChange={(e) => setExamDate(e.target.value)}
                    />
                </div>
                 <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setStep(2)} fullWidth>Geri</Button>
                    <Button fullWidth onClick={handleFinish} disabled={!examDate}>Çalışmaya Başla</Button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};