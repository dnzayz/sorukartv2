import React, { useState } from 'react';
import { UserSettings, ExamType, DEPARTMENTS, COURSES } from '../types';
import { Button } from '../components/Button';
import { ArrowLeft, Check } from 'lucide-react';
import { StorageService } from '../services/storage';

interface SettingsProps {
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
  onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onSave, onBack }) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);

  const handleSave = () => {
    StorageService.saveSettings(localSettings);
    onSave(localSettings);
    onBack();
  };

  const toggleCourse = (courseId: string) => {
    setLocalSettings(prev => {
      const courses = prev.courses || [];
      const newCourses = courses.includes(courseId)
        ? courses.filter(id => id !== courseId)
        : [...courses, courseId];
      return { ...prev, courses: newCourses };
    });
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      <div className="p-4 bg-white shadow-sm flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
            <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-slate-800">Ayarlar</h2>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto pb-8">
        <div className="space-y-4">
            <h3 className="font-bold text-slate-500 text-sm uppercase tracking-wide">Sınav Yapılandırması</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bölüm</label>
              <select 
                className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                value={localSettings.department}
                onChange={(e) => {
                    setLocalSettings(prev => ({ ...prev, department: e.target.value, courses: [] }));
                }}
              >
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Dersleri Seç</label>
                <div className="space-y-2">
                    {(COURSES[localSettings.department] || []).map(c => {
                         const isSelected = localSettings.courses.includes(c.id);
                         return (
                            <button
                                key={c.id}
                                onClick={() => toggleCourse(c.id)}
                                className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                                    isSelected 
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium' 
                                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                                }`}
                            >
                                <span className="text-sm text-left">{c.name}</span>
                                {isSelected && <Check size={18} />}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sınav Türü</label>
                <div className="grid grid-cols-2 gap-2">
                    <button 
                        className={`p-3 rounded-xl border font-medium transition-all ${localSettings.examType === ExamType.Midterm ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        onClick={() => setLocalSettings(prev => ({...prev, examType: ExamType.Midterm}))}
                    >
                        Vize
                    </button>
                    <button 
                            className={`p-3 rounded-xl border font-medium transition-all ${localSettings.examType === ExamType.Final ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                            onClick={() => setLocalSettings(prev => ({...prev, examType: ExamType.Final}))}
                    >
                        Final
                    </button>
                </div>
            </div>

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sınav Tarihi</label>
                <input 
                    type="date" 
                    className="w-full p-3 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    value={localSettings.examDate}
                    onChange={(e) => setLocalSettings(prev => ({...prev, examDate: e.target.value}))}
                />
            </div>
        </div>

        <div className="pt-4">
            <Button fullWidth onClick={handleSave}>Değişiklikleri Kaydet</Button>
        </div>
      </div>
    </div>
  );
};