/**
 * AI Coach Component
 * Provides personalized feedback, tips, and learning recommendations
 */

import React, { useState } from 'react';

interface AICoachProps {
  performanceScore: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
}

const AICoach: React.FC<AICoachProps> = ({ performanceScore, strengths, weaknesses, improvements }) => {
  const [activeTab, setActiveTab] = useState<'feedback' | 'tips' | 'path'>('feedback');
  
  const getLearningPath = () => {
    if (performanceScore >= 80) {
      return [
        'Advanced System Design Patterns',
        'Leadership & Team Management Skills',
        'Complex Behavioral Scenarios',
        'Executive-level Communication'
      ];
    } else if (performanceScore >= 60) {
      return [
        'Intermediate Data Structures & Algorithms',
        'STAR Method Mastery',
        'Effective Communication Techniques',
        'Mock Interview Practice (3x/week)'
      ];
    } else {
      return [
        'Fundamental Programming Concepts',
        'Basic Interview Etiquette',
        'Resume Building & Optimization',
        'Daily Interview Question Practice'
      ];
    }
  };
  
  const getMotivationalMessage = () => {
    if (performanceScore >= 80) {
      return "Excellent work! You're performing at a high level. Keep refining your skills!";
    } else if (performanceScore >= 60) {
      return "Good progress! You're on the right track. Focus on consistency and improvement.";
    } else {
      return "Every expert was once a beginner. Keep practicing and you'll see improvement!";
    }
  };
  
  const getTips = () => {
    const tips = [];
    
    if (weaknesses.some(w => w.toLowerCase().includes('technical'))) {
      tips.push({
        icon: '💻',
        title: 'Technical Skills',
        tip: 'Dedicate 30 minutes daily to solving coding problems on platforms like LeetCode'
      });
    }
    
    if (weaknesses.some(w => w.toLowerCase().includes('communication'))) {
      tips.push({
        icon: '💬',
        title: 'Communication',
        tip: 'Practice explaining complex concepts in simple terms. Record yourself and review.'
      });
    }
    
    if (weaknesses.some(w => w.toLowerCase().includes('behavioral'))) {
      tips.push({
        icon: '🎯',
        title: 'Behavioral Responses',
        tip: 'Prepare 5-7 STAR stories covering different situations (conflict, leadership, failure, success)'
      });
    }
    
    // Always add general tips
    tips.push({
      icon: '⏰',
      title: 'Consistency',
      tip: 'Set a regular practice schedule. Consistency beats intensity in skill development.'
    });
    
    tips.push({
      icon: '📝',
      title: 'Feedback Loop',
      tip: 'After each practice session, write down 3 things you did well and 2 to improve.'
    });
    
    return tips;
  };
  
  const learningPath = getLearningPath();
  const tips = getTips();
  
  return (
    <div className="ai-coach bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">🤖 AI Interview Coach</h2>
        <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
          Score: {performanceScore}/100
        </div>
      </div>
      
      {/* Motivational Message */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
        <p className="text-slate-700 font-medium">{getMotivationalMessage()}</p>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'feedback'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Feedback
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'tips'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Tips
        </button>
        <button
          onClick={() => setActiveTab('path')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'path'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Learning Path
        </button>
      </div>
      
      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          {/* Strengths */}
          {strengths.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center">
                <span className="mr-2">✅</span>
                Your Strengths
              </h3>
              <div className="space-y-2">
                {strengths.map((strength, index) => (
                  <div key={index} className="flex items-start space-x-2 p-3 bg-green-50 rounded-lg">
                    <span className="text-green-600 mt-1">•</span>
                    <p className="text-slate-700 text-sm">{strength}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Areas to Improve */}
          {improvements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-amber-700 mb-3 flex items-center">
                <span className="mr-2">📈</span>
                Key Improvements
              </h3>
              <div className="space-y-2">
                {improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start space-x-2 p-3 bg-amber-50 rounded-lg">
                    <span className="text-amber-600 mt-1">→</span>
                    <p className="text-slate-700 text-sm">{improvement}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Tips Tab */}
      {activeTab === 'tips' && (
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">{tip.icon}</span>
                <h4 className="font-semibold text-slate-800">{tip.title}</h4>
              </div>
              <p className="text-slate-600 text-sm ml-11">{tip.tip}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Learning Path Tab */}
      {activeTab === 'path' && (
        <div>
          <p className="text-slate-600 mb-4">
            Based on your current performance, here's your personalized learning roadmap:
          </p>
          <div className="space-y-3">
            {learningPath.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <p className="text-slate-700 font-medium">{item}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Pro Tip:</strong> Complete these topics in order for optimal learning progression.
              Aim to spend 2-3 weeks on each area before moving to the next.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AICoach;
