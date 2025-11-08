import React, { useState, useCallback, useEffect } from 'react';
import Home from './components/Home';
import Interview from './components/Interview';
import Report from './components/Report';
import { LoadingSpinner } from './components/icons/LoadingSpinner';
import type { AppState, InterviewConfig, InterviewSession, EvaluationResult, InProgressInterview } from './types';  
import { loadSessions, saveSession, deleteSession, loadDraft, clearDraft } from './utils/sessionManager';
import { generateInterviewQuestions, evaluateInterview } from './utils/geminiApi';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('HOME');
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [pastSessions, setPastSessions] = useState<InterviewSession[]>([]);
  const [draft, setDraft] = useState<InProgressInterview | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPastSessions(loadSessions());
    setDraft(loadDraft());
  }, []);

  const startInterview = useCallback(async (config: InterviewConfig) => {
    if (draft) {
        if (!window.confirm('Starting a new interview will delete your saved draft. Are you sure you want to continue?')) {
            return;
        }
        clearDraft();
        setDraft(null);
    }

    setAppState('LOADING');
    setLoadingMessage('Generating your interview questions...');
    setError(null);
    try {
      const questions = await generateInterviewQuestions(config);
      
      const newSession: InterviewSession = {
        id: `session_${Date.now()}`,
        timestamp: Date.now(),
        config,
        questions,
        answers: [],
        snapshots: {},
        malpracticeLogs: {},
      };

      setSession(newSession);
      setAppState('INTERVIEW');
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Could not generate questions. ${errorMessage}`);
      setAppState('HOME');
    }
  }, [draft]);

  const handleInterviewComplete = useCallback(async (answers: string[], snapshots: { [questionIndex: number]: string[] }, malpracticeLogs: { [questionIndex: number]: string[] }) => {
    if (session) {
      setAppState('LOADING');
      setLoadingMessage('Evaluating your performance... This may take a moment.');
      setError(null);
      
      const updatedSession = { ...session, answers, snapshots, malpracticeLogs };
      const hasMalpractice = Object.values(malpracticeLogs).some(logs => logs.length > 0 && logs.some(log => !log.includes('background noise')));
      
      try {
        const response = await evaluateInterview(updatedSession, answers, snapshots, malpracticeLogs);

        const evaluationResult: Omit<EvaluationResult, 'overallScore'> = JSON.parse(response.text);
        
        let calculatedScore = 0;
        if (evaluationResult.criteria && evaluationResult.criteria.length > 0) {
          const totalScore = evaluationResult.criteria.reduce((acc, criterion) => acc + criterion.score, 0);
          const totalMaxScore = evaluationResult.criteria.reduce((acc, criterion) => acc + criterion.maxScore, 0);
          
          if (totalMaxScore > 0) {
            calculatedScore = (totalScore / totalMaxScore) * 10;
          }
        }

        if (hasMalpractice) {
          calculatedScore *= 0.80; // Apply a 20% penalty for malpractice
        }
        
        const finalEvaluationResult: EvaluationResult = {
          ...evaluationResult,
          overallScore: Math.round(calculatedScore),
        };
        
        const finalSession: InterviewSession = {
          ...updatedSession,
          evaluation: finalEvaluationResult,
        };
        
        setSession(finalSession);
        saveSession(finalSession);
        setPastSessions(loadSessions());
        clearDraft();
        setDraft(null);
        setAppState('REPORT');

      } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`An error occurred during evaluation. ${errorMessage}`);
        setAppState('HOME');
      }
    }
  }, [session]);

  const handleBackToHome = useCallback(() => {
    setSession(null);
    setAppState('HOME');
    setError(null);
  }, 
   []);

  const handleViewReport = useCallback((sessionToView: InterviewSession) => {
    setSession(sessionToView);
    setAppState('REPORT');
  }, []);

  const handleDeleteSession = useCallback((sessionId: string) => {
    deleteSession(sessionId);
    setPastSessions(loadSessions());
  }, []);

  const handleResumeInterview = useCallback(() => {
    if (draft) {
      setSession(draft.session);
      setAppState('INTERVIEW');
    }
  }, [draft]);

  const renderContent = () => {
    switch (appState) {
      case 'HOME':
        return <Home onStartInterview={startInterview} error={error} pastSessions={pastSessions} onViewReport={handleViewReport} onDeleteSession={handleDeleteSession} draft={draft} onResumeInterview={handleResumeInterview} />;
      case 'LOADING':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen text-slate-700">
            <LoadingSpinner />
            <p className="mt-4 text-lg">{loadingMessage}</p>
          </div>
        );
      case 'INTERVIEW':
        if (session) {
          return <Interview session={session} onInterviewComplete={handleInterviewComplete} draft={draft} />;
        }
        return <Home onStartInterview={startInterview} error="An unexpected error occurred." pastSessions={pastSessions} onViewReport={handleViewReport} onDeleteSession={handleDeleteSession} draft={draft} onResumeInterview={handleResumeInterview} />;
      case 'REPORT':
        if (session?.evaluation) {
          return <Report report={session.evaluation} onBackToHome={handleBackToHome} />;
        }
        return <Home onStartInterview={startInterview} error="Failed to load the report." pastSessions={pastSessions} onViewReport={handleViewReport} onDeleteSession={handleDeleteSession} draft={draft} onResumeInterview={handleResumeInterview} />;
      default:
        return <Home onStartInterview={startInterview} pastSessions={pastSessions} onViewReport={handleViewReport} onDeleteSession={handleDeleteSession} draft={draft} onResumeInterview={handleResumeInterview} />;
    }
  };

  return <div>{renderContent()}</div>;
};

export default App;