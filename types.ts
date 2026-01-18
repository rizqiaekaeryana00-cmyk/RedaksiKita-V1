
export type AppView = 'LOGIN' | 'LOBBY' | 'BRIEFING' | 'ARENA' | 'EVALUATION' | 'INVESTIGATION' | 'WRITING_DESK' | 'HOAX_SHOOTER' | 'INFO';

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
