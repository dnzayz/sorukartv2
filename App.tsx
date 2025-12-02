import React, { useState, useEffect } from 'react';
import { Onboarding } from './views/Onboarding';
import { Dashboard } from './views/Dashboard';
import { CourseDetail } from './views/CourseDetail';
import { StudySession } from './views/StudySession';
import { Stats } from './views/Stats';
import { Settings } from './views/Settings';
import { StorageService } from './services/storage';
import { UserSettings, Card } from './types';

// App Views Type
type ViewState = 'loading' | 'onboarding' | 'dashboard' | 'course-detail' | 'study' | 'stats' | 'settings';

function App() {
  const [view, setView] = useState<ViewState>('loading');
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [studyQueue, setStudyQueue] = useState<Card[]>([]);
  
  // Navigation State
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Initial Load
  useEffect(() => {
    const savedSettings = StorageService.getSettings();
    if (savedSettings && savedSettings.isOnboarded) {
      setSettings(savedSettings);
      refreshData();
      setView('dashboard');
    } else {
      setView('onboarding');
    }
  }, []);

  const refreshData = () => {
    setCards(StorageService.getCards());
  };

  const handleOnboardingComplete = () => {
    const savedSettings = StorageService.getSettings();
    if (savedSettings) {
        setSettings(savedSettings);
        refreshData();
        setView('dashboard');
    }
  };

  // Logic to start studying (handles Quick Review, Unit Study, Course Study)
  const startStudy = (courseId?: string, unitId?: number) => {
    if (!settings) return;
    refreshData();
    
    let queue: Card[] = [];
    const now = Date.now();

    if (courseId) {
        // Study specific course
        let subset = cards.filter(c => c.courseId === courseId);
        
        // Filter by unit if specified
        if (unitId) {
            subset = subset.filter(c => c.unit === unitId);
        } else {
            // Filter by Exam Type limit if studying whole course
            const maxUnit = settings.examType === 'midterm' ? 4 : 8;
            subset = subset.filter(c => c.unit <= maxUnit);
        }

        // Prioritize Due > New > Reviewing Ahead
        const due = subset.filter(c => c.due <= now && c.state !== 0);
        const newCards = subset.filter(c => c.state === 0);
        
        // Simple logic: Mix due and new
        queue = [...due, ...newCards];
    } else {
        // Quick Review (All Due cards from all valid courses/units)
        const maxUnit = settings.examType === 'midterm' ? 4 : 8;
        queue = cards.filter(c => 
            settings.courses.includes(c.courseId) && 
            c.unit <= maxUnit &&
            c.due <= now && 
            c.state !== 0
        );
    }
    
    // Shuffle
    queue = queue.sort(() => Math.random() - 0.5);

    if (queue.length > 0) {
        setStudyQueue(queue);
        setView('study');
    } else {
        alert("No cards to study right now! Good job.");
    }
  };

  // --- Render Views ---

  if (view === 'loading') return <div className="h-screen flex items-center justify-center bg-slate-50 text-indigo-600 font-bold animate-pulse">AceIt</div>;

  if (view === 'onboarding') return <Onboarding onComplete={handleOnboardingComplete} />;

  if (view === 'study') return (
    <StudySession 
        cards={studyQueue} 
        onComplete={() => {
            refreshData();
            // Go back to course detail if we were there, else dashboard
            setView(selectedCourseId ? 'course-detail' : 'dashboard');
        }} 
    />
  );

  if (view === 'stats') return (
    <Stats 
        logs={StorageService.getLogs()} 
        cards={cards}
        onBack={() => setView('dashboard')} 
    />
  );

  if (view === 'settings') return settings ? (
    <Settings 
        settings={settings} 
        onSave={(s) => {
            setSettings(s);
            refreshData();
        }}
        onBack={() => setView('dashboard')}
    />
  ) : null;

  if (view === 'course-detail' && selectedCourseId && settings) return (
      <CourseDetail 
          courseId={selectedCourseId}
          settings={settings}
          cards={cards}
          onBack={() => {
              setSelectedCourseId(null);
              setView('dashboard');
          }}
          onStudy={startStudy}
      />
  );

  return settings ? (
    <Dashboard 
        settings={settings} 
        cards={cards} 
        onNavigateToCourse={(id) => {
            setSelectedCourseId(id);
            setView('course-detail');
        }}
        onNavigate={setView}
        onQuickReview={() => startStudy()}
    />
  ) : null;
}

export default App;