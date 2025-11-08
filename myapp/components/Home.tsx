import React, { useState } from 'react';
import { ROLES_CATEGORIZED, DIFFICULTIES } from '../constants';
import { InterviewConfig, InterviewSession, InProgressInterview } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface HomeProps {
  onStartInterview: (config: InterviewConfig) => void;
  error?: string | null;
  pastSessions: InterviewSession[];
  onViewReport: (session: InterviewSession) => void;
  onDeleteSession: (sessionId: string) => void;
  draft: InProgressInterview | null;
  onResumeInterview: () => void;
}

const ScoreBadge: React.FC<{ score?: number }> = ({ score }) => {
  if (score === undefined) {
    return <span className="text-sm font-medium text-slate-500">Incomplete</span>;
  }

  const scoreColor = score > 80 ? 'bg-emerald-100 text-emerald-700' : score > 60 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700';

  return (
    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${scoreColor}`}>
      {score}/100
    </span>
  );
};

const ResumeCard: React.FC<{ draft: InProgressInterview; onResume: () => void; }> = ({ draft, onResume }) => {
    const { session, currentQuestionIndex } = draft;
    const progress = `${currentQuestionIndex + 1} / ${session.questions.length}`;

    return (
        <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl text-center mb-12 animate-[fade-in-up_0.5s_ease-out]">
            <h2 className="text-2xl font-bold text-sky-600 mb-2">Welcome Back!</h2>
            <p className="text-slate-500 mb-6">You have an interview in progress.</p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left mb-6">
                <p><span className="font-semibold text-slate-600">Role:</span> {session.config.role}</p>
                <p><span className="font-semibold text-slate-600">Difficulty:</span> {session.config.difficulty}</p>
                <p><span className="font-semibold text-slate-600">Progress:</span> Question {progress}</p>
            </div>
            <button
                onClick={onResume}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
                <span>Resume Interview</span>
                <ArrowRightIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

const Home: React.FC<HomeProps> = ({ onStartInterview, error, pastSessions, onViewReport, onDeleteSession, draft, onResumeInterview }) => {
  const [role, setRole] = useState<string>('Software Engineer');
  const [difficulty, setDifficulty] = useState<string>('Medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartInterview({ role, difficulty });
  };
  
  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation(); // Prevent card click
    if (window.confirm('Are you sure you want to delete this interview session?')) {
      onDeleteSession(sessionId);
    }
  };

  return (
    <div className="min-h-screen text-slate-800 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-sky-600">AI Mock Interview</h1>
            <p className="text-slate-500 mt-2">Hone your skills with an AI-powered interviewer.</p>
        </header>

        {draft ? <ResumeCard draft={draft} onResume={onResumeInterview} /> : null}
        
        <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl text-center mb-12 animate-[fade-in-up_0.5s_ease-out]">
          <h2 className="text-2xl font-bold text-slate-700 mb-6">{draft ? 'Or Start a New Interview' : 'Configure Your Interview'}</h2>
          
          {error && <div className="bg-rose-100 border border-rose-300 text-rose-800 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-slate-600 text-left mb-2">Select Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-100 border border-slate-300 rounded-lg py-3 px-4 text-slate-800 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
              >
                {Object.entries(ROLES_CATEGORIZED).map(([category, roles]) => (
                  <optgroup key={category} label={category}>
                    {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-slate-600 text-left mb-2">Select Difficulty</label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-slate-100 border border-slate-300 rounded-lg py-3 px-4 text-slate-800 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
              >
                {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
              <span>Start Interview</span>
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </form>
        </div>

        <div className="w-full animate-[fade-in-up_0.5s_ease-out_200ms] opacity-0">
            <h2 className="text-2xl font-bold text-slate-700 mb-4 text-center">Past Interviews</h2>
            {pastSessions.length > 0 ? (
                <div className="space-y-4">
                    {pastSessions.map((session, index) => (
                        <div 
                            key={session.id} 
                            onClick={() => session.evaluation && onViewReport(session)} 
                            className={`bg-white p-4 rounded-2xl shadow-lg flex items-center justify-between transition-all duration-200 opacity-0 animate-[fade-in-up_0.5s_ease-out_forwards] ${session.evaluation ? 'cursor-pointer hover:shadow-xl hover:scale-[1.02]' : 'cursor-default'}`}
                            style={{ animationDelay: `${200 + index * 100}ms` }}
                        >
                            <div className="flex-1">
                                <p className="font-bold text-sky-700">{session.config.role}</p>
                                <p className="text-sm text-slate-500">{session.config.difficulty} &middot; {new Date(session.timestamp).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                               <ScoreBadge score={session.evaluation?.overallScore} />
                               <button onClick={(e) => handleDelete(e, session.id)} aria-label="Delete session" className="p-2 rounded-full text-slate-400 hover:bg-rose-100 hover:text-rose-600 transition-colors">
                                  <TrashIcon className="w-5 h-5" />
                               </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
                    <p className="text-slate-500">Your past interview reports will appear here.</p>
                </div>
            )}
        </div>
        <footer className="text-center text-slate-400 mt-8">
            <p>&copy; {new Date().getFullYear()} AI Mock Interview. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
