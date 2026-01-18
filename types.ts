
export type AppView = 'LOGIN' | 'LOBBY' | 'BRIEFING' | 'ARENA' | 'EVALUATION' | 'INVESTIGATION' | 'WRITING_DESK' | 'HOAX_SHOOTER' | 'INFO' | 'ADMIN_SETTINGS';

export interface Student {
  name: string;
  school: string;
  role: 'STUDENT' | 'ADMIN';
}

export interface NewsFragment {
  id: string;
  text: string;
  type: 'TITLE' | 'LEAD' | 'BODY' | 'TAIL';
}

export interface PuzzleLevel {
  id: string;
  fragments: NewsFragment[];
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface InvestigationData {
  id: string;
  type: 'PHOTO' | 'INTERVIEW' | 'DOCUMENT';
  content: string;
  title: string;
  isFact: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  url: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  videos: VideoItem[];
  meta: string;
}

export interface WritingEvent {
  id: string;
  title: string;
  icon: string;
}

export interface HoaxPoolItem {
  id: string;
  text: string;
  isHoax: boolean;
}
