export type AppState = 'HOME' | 'INTERVIEW' | 'REPORT' | 'LOADING';

export interface InterviewConfig {
  role: string;
  difficulty: string;
}

export interface EvaluationCriterion {
  name: string;
  score: number;
  maxScore: number;
  reasoning: string;
}

export interface BodyLanguageAnalysis {
  posture: string;
  eyeContact: string;
  gestures: string;
  overallSummary: string;
}

export interface VerbalAnalysis {
  clarity: string;
  conciseness: string;
  fillerWords: string;
  overallSummary: string;
}

export interface MalpracticeReport {
  summary: string;
  impactOnScore: string;
}

export interface EvaluationResult {
  overallScore: number;
  criteria: EvaluationCriterion[];
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  bodyLanguageAnalysis: BodyLanguageAnalysis;
  verbalAnalysis: VerbalAnalysis;
  malpracticeReport?: MalpracticeReport;
}

export interface InterviewSession {
  id: string;
  timestamp: number;
  config: InterviewConfig;
  questions: string[];
  answers: string[];
  snapshots: { [questionIndex: number]: string[] };
  malpracticeLogs?: { [questionIndex: number]: string[] };
  evaluation?: EvaluationResult;
}

export interface InProgressInterview {
  session: InterviewSession;
  currentQuestionIndex: number;
  answers: string[];
  snapshots: { [questionIndex: number]: string[] };
  malpracticeLogs: { [questionIndex: number]: string[] };
  currentTranscript: string;
}
