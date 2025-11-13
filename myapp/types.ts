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

// v2.0.0 New Types

export interface AnalyticsData {
  performanceHistory: PerformanceMetrics[];
  skillRadar: { skill: string; score: number }[];
  weaknessAreas: string[];
  industryBenchmark: number;
  predictionScore: number;
  trendData: { date: string; score: number }[];
}

export interface VideoAnalysisResult {
  bodyLanguage: {
    posture: string;
    score: number;
  };
  facialExpression: {
    emotion: string;
    confidence: number;
  };
  eyeContact: {
    percentage: number;
    quality: string;
  };
  confidenceLevel: number;
  overallFeedback: string;
}

export interface VoiceMetrics {
  speechRate: number; // words per minute
  clarity: number; // 0-100
  volume: number; // 0-100
  tone: string;
  fillerWordCount: number;
  fillerWords: { word: string; count: number }[];
  pauseDuration: number; // average pause in seconds
  overallScore: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface InterviewMode {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  difficulty?: string;
}

export interface AvatarConfig {
  id: string;
  name: string;
  personality: 'professional' | 'friendly' | 'technical';
  appearance: {
    color: string;
    style: string;
  };
}

export interface PerformanceMetrics {
  sessionId: string;
  date: number;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  behavioralScore: number;
  duration: number;
}

export interface SkillAssessment {
  skillName: string;
  level: number; // 0-100
  category: string;
  assessmentDate: number;
  improvement: number; // change from last assessment
}

export interface ResumeData {
  fileName: string;
  uploadDate: number;
  extractedText: string;
  skills: string[];
  experience: { title: string; company: string; duration: string }[];
  education: { degree: string; institution: string; year: string }[];
  suggestedQuestions: string[];
}

export interface GamificationState {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  totalInterviews: number;
  achievements: Achievement[];
  badges: string[];
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  accentColor: string;
}

export interface UserSettings {
  theme: ThemeConfig;
  language: string;
  difficulty: string;
  interviewDuration: number; // minutes
  voiceEnabled: boolean;
  videoEnabled: boolean;
  selectedAvatar: string;
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
  };
}
