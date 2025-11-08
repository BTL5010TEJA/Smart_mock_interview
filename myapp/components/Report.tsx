import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import type { EvaluationResult } from '../types';
import { BodyIcon } from './icons/BodyIcon';
import { EyeIcon } from './icons/EyeIcon';
import { GestureIcon } from './icons/GestureIcon';
import { ClarityIcon } from './icons/ClarityIcon';
import { ConcisenessIcon } from './icons/ConcisenessIcon';
import { FillerWordsIcon } from './icons/FillerWordsIcon';
import { AlertTriangle } from './icons/AlertTriangle';


interface ReportProps {
  report: EvaluationResult;
  onBackToHome: () => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-xl">
        <p className="text-sky-300 font-bold">{`${label}`}</p>
        <p className="text-white mt-1">{`Score: ${data.score} / ${data.maxScore}`}</p>
        <p className="text-slate-300 mt-2 max-w-xs">{data.reasoning}</p>
      </div>
    );
  }
  return null;
};

const AnalysisCard: React.FC<{icon: React.ReactNode, title: string, text: string}> = ({ icon, title, text }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 bg-sky-100 text-sky-600 rounded-lg p-3">
      {icon}
    </div>
    <div>
      <h4 className="font-semibold text-slate-700">{title}</h4>
      <p className="text-slate-600 text-sm">{text}</p>
    </div>
  </div>
);


const Report: React.FC<ReportProps> = ({ report, onBackToHome }) => {
  const [displayScore, setDisplayScore] = React.useState(0);

  React.useEffect(() => {
      if (report.overallScore === 0) {
        setDisplayScore(0);
        return;
      }

      let startTimestamp: number | null = null;
      const duration = 1500;
      const finalScore = report.overallScore;
      
      const step = (timestamp: number) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          const currentScore = Math.floor(progress * finalScore);
          setDisplayScore(currentScore);
          if (progress < 1) {
              window.requestAnimationFrame(step);
          } else {
              setDisplayScore(finalScore);
          }
      };
      
      const animationFrame = window.requestAnimationFrame(step);
      
      return () => window.cancelAnimationFrame(animationFrame);
  }, [report.overallScore]);

  return (
    <div className="min-h-screen text-slate-800 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-10 opacity-0 animate-[fade-in-up_0.5s_ease-out_forwards]">
          <h1 className="text-4xl font-bold mb-2 text-sky-600">Interview Report</h1>
          <p className="text-slate-500">Here's your AI-powered performance breakdown.</p>
        </header>
        
        <main className="space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-0 animate-[fade-in-up_0.5s_ease-out_forwards]" style={{ animationDelay: '200ms' }}>
            <div className="bg-white p-6 rounded-2xl shadow-xl text-center flex flex-col justify-center">
              <h2 className="text-lg font-semibold text-slate-500">Overall Score</h2>
              <p className={`text-6xl font-bold mt-2 ${report.overallScore > 8 ? 'text-emerald-500' : report.overallScore > 6 ? 'text-amber-500' : 'text-rose-500'}`}>
                {displayScore}<span className="text-3xl text-slate-400">/10</span>
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-xl md:col-span-2">
              <h2 className="text-lg font-semibold text-slate-500 mb-4">Criteria Breakdown</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={report.criteria || []} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis type="number" domain={[0, 5]} tick={{ fill: '#475569' }} stroke="#CBD5E1" />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fill: '#475569' }} stroke="#CBD5E1" interval={0} />
                    <Tooltip
                      cursor={{fill: 'rgba(226, 232, 240, 0.5)'}}
                      content={<CustomTooltip />}
                    />
                    <Bar dataKey="score" fill="#38BDF8" background={{ fill: '#F1F5F9' }} barSize={25} isAnimationActive={true} animationDuration={1000}>
                      <LabelList dataKey="score" position="right" fill="#1E293B" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
            </div>
          </section>

          <section className="opacity-0 animate-[fade-in-up_0.5s_ease-out_forwards]" style={{ animationDelay: '400ms' }}>
            <h2 className="text-2xl font-bold text-slate-700 mb-4 text-center">Detailed Analysis</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-xl">
                  <h3 className="text-xl font-semibold text-slate-700 mb-6">Body Language Analysis</h3>
                  <div className="space-y-6">
                      <AnalysisCard icon={<BodyIcon className="w-6 h-6" />} title="Posture" text={report.bodyLanguageAnalysis.posture} />
                      <AnalysisCard icon={<EyeIcon className="w-6 h-6" />} title="Eye Contact" text={report.bodyLanguageAnalysis.eyeContact} />
                      <AnalysisCard icon={<GestureIcon className="w-6 h-6" />} title="Gestures" text={report.bodyLanguageAnalysis.gestures} />
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-200">
                      <h4 className="font-semibold text-slate-700">Overall Summary</h4>
                      <p className="text-slate-600 text-sm mt-1">{report.bodyLanguageAnalysis.overallSummary}</p>
                  </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-xl">
                  <h3 className="text-xl font-semibold text-slate-700 mb-6">Verbal Analysis</h3>
                  <div className="space-y-6">
                      <AnalysisCard icon={<ClarityIcon className="w-6 h-6" />} title="Clarity" text={report.verbalAnalysis.clarity} />
                      <AnalysisCard icon={<ConcisenessIcon className="w-6 h-6" />} title="Conciseness" text={report.verbalAnalysis.conciseness} />
                      <AnalysisCard icon={<FillerWordsIcon className="w-6 h-6" />} title="Filler Words" text={report.verbalAnalysis.fillerWords} />
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-200">
                      <h4 className="font-semibold text-slate-700">Overall Summary</h4>
                      <p className="text-slate-600 text-sm mt-1">{report.verbalAnalysis.overallSummary}</p>
                  </div>
              </div>
            </div>
          </section>

          {report.malpracticeReport && (
            <section className="bg-rose-50 border border-rose-200 p-6 rounded-2xl shadow-lg opacity-0 animate-[fade-in-up_0.5s_ease-out_forwards]" style={{ animationDelay: '600ms' }}>
                <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-8 h-8 text-rose-500 flex-shrink-0" />
                    <h3 className="text-xl font-semibold text-rose-600">Malpractice Report</h3>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold text-slate-700">Summary of Detections</h4>
                        <p className="text-slate-600 mt-1 text-sm">{report.malpracticeReport.summary}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-700">Impact on Score</h4>
                        <p className="text-slate-600 mt-1 text-sm">{report.malpracticeReport.impactOnScore}</p>
                    </div>
                </div>
            </section>
          )}

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 opacity-0 animate-[fade-in-up_0.5s_ease-out_forwards]" style={{ animationDelay: '800ms' }}>
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-semibold text-emerald-500 mb-4">Strengths</h3>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                {(report.strengths || []).map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-semibold text-amber-500 mb-4">Areas to Polish</h3>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                {(report.weaknesses || []).map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-semibold text-sky-500 mb-4">Your Path to an Unbeatable Interview</h3>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                {(report.improvements || []).map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>
          </section>
        </main>

        <footer className="text-center mt-12">
          <button
            onClick={onBackToHome}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-full transition-transform transform hover:scale-105 shadow-lg"
          >
            Back to Home
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Report;
