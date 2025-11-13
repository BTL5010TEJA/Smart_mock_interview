/**
 * Interview Modes Component
 * Allows users to select different interview types and modes
 */

import React from 'react';
import { INTERVIEW_MODES } from '../constants';
import type { InterviewMode } from '../types';

interface InterviewModesProps {
  onSelectMode: (mode: InterviewMode) => void;
  selectedMode?: string;
}

const InterviewModes: React.FC<InterviewModesProps> = ({ onSelectMode, selectedMode }) => {
  return (
    <div className="interview-modes bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">🎯 Interview Modes</h2>
      <p className="text-slate-600 mb-6">Choose the type of interview you want to practice</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {INTERVIEW_MODES.map((mode) => (
          <div
            key={mode.id}
            onClick={() => onSelectMode(mode)}
            className={`p-5 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
              selectedMode === mode.id
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-slate-200 bg-white hover:border-blue-300'
            }`}
          >
            <div className="text-4xl mb-3">{mode.icon}</div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{mode.name}</h3>
            <p className="text-sm text-slate-600 mb-3">{mode.description}</p>
            
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-700">Features:</p>
              {mode.features.map((feature, index) => (
                <div key={index} className="flex items-center text-xs text-slate-600">
                  <span className="mr-1">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            {selectedMode === mode.id && (
              <div className="mt-3 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full text-center">
                Selected
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Mode Info */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
        <h3 className="font-semibold text-slate-800 mb-2">💡 Pro Tip</h3>
        <p className="text-sm text-slate-700">
          Each mode is designed to simulate real interview scenarios. Start with the mode that matches your target role, 
          then branch out to build comprehensive skills.
        </p>
      </div>
    </div>
  );
};

export default InterviewModes;
