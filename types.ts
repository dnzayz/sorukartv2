export enum Rating {
  Again = 1,
  Hard = 2,
  Good = 3,
  Easy = 4,
}

export enum State {
  New = 0,
  Learning = 1,
  Review = 2,
  Relearning = 3,
}

export interface FSRSParameters {
  request_retention: number;
  maximum_interval: number;
  w: number[];
}

export interface Card {
  id: string;
  courseId: string;
  unit: number; // 1-8
  question: string;
  answer: string;
  
  // FSRS State
  state: State;
  due: number; // timestamp
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  last_review: number; // timestamp

  isFavorite: boolean;
  isCustom: boolean;
}

export interface ReviewLog {
  id: string;
  cardId: string;
  rating: Rating;
  state: State;
  due: number;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  last_elapsed_days: number;
  scheduled_days: number;
  review: number; // timestamp
}

export enum ExamType {
  Midterm = 'midterm',
  Final = 'final',
}

export interface UserSettings {
  name: string;
  department: string;
  courses: string[];
  examDate: string; // ISO date string
  examType: ExamType;
  isOnboarded: boolean;
}

export interface CourseData {
  id: string;
  department: string;
  name: string;
}

export const DEPARTMENTS = [
  "Tıbbi Dokümantasyon ve Sekreterlik",
  "Bilgisayar Mühendisliği",
  "Psikoloji",
  "Biyoloji",
  "İktisat",
  "Tarih"
];

export const COURSES: Record<string, CourseData[]> = {
  "Tıbbi Dokümantasyon ve Sekreterlik": [
    { id: "ata101", department: "Tıbbi Dokümantasyon ve Sekreterlik", name: "Atatürk İlkeleri Ve İnkılap Tarihi 1" }
  ],
  "Bilgisayar Mühendisliği": [
    { id: "cs101", department: "Bilgisayar Mühendisliği", name: "CS101: Algoritmalara Giriş" },
    { id: "cs202", department: "Bilgisayar Mühendisliği", name: "CS202: Veri Yapıları" }
  ],
  "Psikoloji": [
    { id: "psy101", department: "Psikoloji", name: "PSY101: Psikolojiye Giriş" }
  ],
  "Biyoloji": [
    { id: "bio101", department: "Biyoloji", name: "BIO101: Hücre Biyolojisi" }
  ],
  "İktisat": [
    { id: "eco101", department: "İktisat", name: "ECO101: Mikroekonomi" }
  ],
  "Tarih": [
    { id: "his101", department: "Tarih", name: "HIS101: Dünya Tarihi" }
  ]
};