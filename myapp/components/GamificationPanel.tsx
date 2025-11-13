/**
 * Gamification Panel Component
 * Displays achievements, XP progress, badges, and level information
 */

import React from 'react';
import type { GamificationState } from '../types';

interface GamificationPanelProps {
  state: GamificationState;
}

const GamificationPanel: React.FC<GamificationPanelProps> = ({ state }) => {
  const progressPercentage = state.xpToNextLevel > 0
    ? ((state.xp - (state.xp - state.xpToNextLevel)) / state.xpToNextLevel) * 100
    : 100;
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      default: return 'from-slate-400 to-slate-500';
    }
  };
  
  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-400';
      case 'epic': return 'border-purple-400';
      case 'rare': return 'border-blue-400';
      default: return 'border-slate-300';
    }
  };
  
  return (
    <div className="gamification-panel bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">🎮 Your Progress</h2>
      
      {/* Level and XP */}
      <div className="mb-6 p-6 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl text-white">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm opacity-90">Current Level</p>
            <p className="text-4xl font-bold">Level {state.level}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Total XP</p>
            <p className="text-2xl font-bold">{state.xp}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Level {state.level + 1}</span>
            <span>{state.xpToNextLevel} XP needed</span>
          </div>
          <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
          <p className="text-sm text-slate-600">Current Streak</p>
          <p className="text-3xl font-bold text-orange-600">{state.streak} 🔥</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <p className="text-sm text-slate-600">Total Interviews</p>
          <p className="text-3xl font-bold text-blue-600">{state.totalInterviews}</p>
        </div>
      </div>
      
      {/* Achievements */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">🏆 Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {state.achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-3 rounded-lg border-2 ${
                achievement.unlocked
                  ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} text-white ${getRarityBorder(achievement.rarity)}`
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              } transition-all hover:scale-105`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2 filter ${!achievement.unlocked && 'grayscale'}">
                  {achievement.icon}
                </div>
                <p className={`text-xs font-semibold ${achievement.unlocked ? '' : 'text-slate-500'}`}>
                  {achievement.name}
                </p>
                <p className={`text-xs mt-1 ${achievement.unlocked ? 'opacity-90' : 'text-slate-400'}`}>
                  {achievement.description}
                </p>
                {achievement.unlocked && achievement.unlockedAt && (
                  <p className="text-xs mt-2 opacity-75">
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Badges */}
      {state.badges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">🎖️ Badges</h3>
          <div className="flex flex-wrap gap-2">
            {state.badges.map((badge, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-full shadow"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Motivational Message */}
      <div className="p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
        <p className="text-sm text-slate-700">
          {state.level >= 5
            ? '🌟 You\'re mastering the interview game! Keep up the excellent work!'
            : state.level >= 3
            ? '💪 Great progress! You\'re building strong interview skills!'
            : '🚀 You\'re just getting started! Keep practicing to level up!'}
        </p>
      </div>
    </div>
  );
};

export default GamificationPanel;
