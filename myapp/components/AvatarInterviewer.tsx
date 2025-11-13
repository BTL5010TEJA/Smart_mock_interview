/**
 * Avatar Interviewer Component (Simplified 3D Avatar)
 * Basic 3D avatar representation using Three.js concepts
 */

import React, { useState, useEffect } from 'react';
import type { AvatarConfig } from '../types';

interface AvatarInterviewerProps {
  config: AvatarConfig;
  isSpeaking: boolean;
}

const AvatarInterviewer: React.FC<AvatarInterviewerProps> = ({ config, isSpeaking }) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  
  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setAnimationPhase((prev) => (prev + 1) % 4);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isSpeaking]);
  
  const getPersonalityStyle = () => {
    switch (config.personality) {
      case 'professional':
        return 'Professional & Formal';
      case 'friendly':
        return 'Friendly & Supportive';
      case 'technical':
        return 'Technical & Precise';
      default:
        return 'Neutral';
    }
  };
  
  return (
    <div className="avatar-interviewer bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">🤖 AI Interviewer</h2>
      
      {/* Avatar Display */}
      <div className="relative mb-6">
        <div
          className="w-64 h-64 mx-auto rounded-full flex items-center justify-center transition-all"
          style={{
            backgroundColor: config.appearance.color,
            transform: isSpeaking ? `scale(${1 + animationPhase * 0.02})` : 'scale(1)',
            boxShadow: isSpeaking ? '0 0 30px rgba(59, 130, 246, 0.5)' : '0 0 10px rgba(0,0,0,0.1)'
          }}
        >
          <div className="text-8xl">
            {config.personality === 'professional' ? '👔' : 
             config.personality === 'friendly' ? '😊' : '🤓'}
          </div>
          
          {isSpeaking && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-8 bg-white rounded-full"
                    style={{
                      animation: `pulse 0.6s ease-in-out ${i * 0.1}s infinite`,
                      opacity: 0.8
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Avatar Info */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-slate-800">{config.name}</h3>
        <p className="text-sm text-slate-600">{getPersonalityStyle()}</p>
      </div>
      
      {/* Status */}
      <div className={`p-3 rounded-lg ${isSpeaking ? 'bg-blue-100' : 'bg-slate-100'}`}>
        <p className="text-center text-sm font-medium">
          {isSpeaking ? '🎙️ Speaking...' : '👂 Listening...'}
        </p>
      </div>
      
      {/* Personality Traits */}
      <div className="mt-6 p-4 bg-slate-50 rounded-lg">
        <h4 className="font-semibold text-slate-800 mb-2">Interview Style:</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          {config.personality === 'professional' && (
            <>
              <li>• Focuses on concrete examples</li>
              <li>• Asks direct, structured questions</li>
              <li>• Evaluates leadership potential</li>
            </>
          )}
          {config.personality === 'friendly' && (
            <>
              <li>• Creates comfortable atmosphere</li>
              <li>• Encourages open communication</li>
              <li>• Focuses on culture fit</li>
            </>
          )}
          {config.personality === 'technical' && (
            <>
              <li>• Deep technical questioning</li>
              <li>• Problem-solving focused</li>
              <li>• Tests technical depth</li>
            </>
          )}
        </ul>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { height: 0.5rem; }
          50% { height: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default AvatarInterviewer;
