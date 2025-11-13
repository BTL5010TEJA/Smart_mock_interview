/**
 * Gamification Logic Module
 * Handles XP calculations, achievement unlocking, streak tracking, and level progression
 */

import { ACHIEVEMENTS, XP_LEVELS } from '../constants';
import type { Achievement, GamificationState } from '../types';

/**
 * Calculate XP earned from an interview
 * @param score - Interview score (0-100)
 * @param difficulty - Interview difficulty
 * @param duration - Interview duration in minutes
 * @returns XP earned
 */
export function calculateXP(score: number, difficulty: string, duration: number): number {
  // Base XP
  let xp = score;
  
  // Difficulty multiplier
  const difficultyMultipliers: { [key: string]: number } = {
    'Easy': 1.0,
    'Medium': 1.5,
    'Hard': 2.0,
    'Expert': 2.5
  };
  
  const multiplier = difficultyMultipliers[difficulty] || 1.0;
  xp *= multiplier;
  
  // Duration bonus (longer interviews = more XP)
  if (duration > 30) {
    xp += 20;
  } else if (duration > 20) {
    xp += 10;
  }
  
  // Perfect score bonus
  if (score === 100) {
    xp += 50;
  } else if (score >= 90) {
    xp += 25;
  }
  
  return Math.round(xp);
}

/**
 * Calculate current level from XP
 * @param totalXP - Total XP accumulated
 * @returns Current level and XP to next level
 */
export function calculateLevel(totalXP: number): {
  level: number;
  xpToNextLevel: number;
  progressPercentage: number;
} {
  let currentLevel = 1;
  let xpForNextLevel = 0;
  
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= XP_LEVELS[i].xpRequired) {
      currentLevel = XP_LEVELS[i].level;
      
      // Calculate XP needed for next level
      if (i < XP_LEVELS.length - 1) {
        const currentLevelXP = XP_LEVELS[i].xpRequired;
        const nextLevelXP = XP_LEVELS[i + 1].xpRequired;
        const xpInCurrentLevel = totalXP - currentLevelXP;
        const xpNeededForLevel = nextLevelXP - currentLevelXP;
        
        xpForNextLevel = nextLevelXP - totalXP;
        const progressPercentage = (xpInCurrentLevel / xpNeededForLevel) * 100;
        
        return {
          level: currentLevel,
          xpToNextLevel: xpForNextLevel,
          progressPercentage: Math.round(progressPercentage)
        };
      }
      
      break;
    }
  }
  
  // Max level reached
  return {
    level: currentLevel,
    xpToNextLevel: 0,
    progressPercentage: 100
  };
}

/**
 * Check and unlock achievements
 * @param state - Current gamification state
 * @param sessionData - Data from completed interview
 * @returns Updated achievements and newly unlocked ones
 */
export function checkAchievements(
  state: GamificationState,
  sessionData: {
    score: number;
    difficulty: string;
    isFirstInterview: boolean;
  }
): {
  updated: Achievement[];
  newlyUnlocked: Achievement[];
} {
  const updated = [...state.achievements];
  const newlyUnlocked: Achievement[] = [];
  
  // Check each achievement
  updated.forEach((achievement, index) => {
    if (achievement.unlocked) return;
    
    let shouldUnlock = false;
    
    switch (achievement.id) {
      case 'first_interview':
        shouldUnlock = sessionData.isFirstInterview;
        break;
        
      case 'perfect_score':
        shouldUnlock = sessionData.score === 100;
        break;
        
      case 'week_streak':
        shouldUnlock = state.streak >= 7;
        break;
        
      case 'ten_interviews':
        shouldUnlock = state.totalInterviews >= 10;
        break;
        
      case 'all_difficulties':
        // Would need to track completed difficulties
        // Simplified check for now
        shouldUnlock = state.totalInterviews >= 4;
        break;
    }
    
    if (shouldUnlock) {
      updated[index] = {
        ...achievement,
        unlocked: true,
        unlockedAt: Date.now()
      };
      newlyUnlocked.push(updated[index]);
    }
  });
  
  return { updated, newlyUnlocked };
}

/**
 * Update streak based on last interview date
 * @param lastInterviewDate - Timestamp of last interview
 * @param currentStreak - Current streak count
 * @returns Updated streak
 */
export function updateStreak(lastInterviewDate: number, currentStreak: number): number {
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;
  const daysSinceLastInterview = Math.floor((now - lastInterviewDate) / dayInMs);
  
  if (daysSinceLastInterview === 0) {
    // Same day - maintain streak
    return currentStreak;
  } else if (daysSinceLastInterview === 1) {
    // Next day - increment streak
    return currentStreak + 1;
  } else {
    // Streak broken
    return 1;
  }
}

/**
 * Initialize gamification state for new user
 * @returns Initial gamification state
 */
export function initializeGamificationState(): GamificationState {
  return {
    level: 1,
    xp: 0,
    xpToNextLevel: XP_LEVELS[1].xpRequired,
    streak: 0,
    totalInterviews: 0,
    achievements: ACHIEVEMENTS.map(a => ({ ...a })),
    badges: []
  };
}

/**
 * Update gamification state after interview
 * @param currentState - Current gamification state
 * @param sessionData - Interview session data
 * @returns Updated gamification state
 */
export function updateGamificationState(
  currentState: GamificationState,
  sessionData: {
    score: number;
    difficulty: string;
    duration: number;
    lastInterviewDate: number;
  }
): {
  state: GamificationState;
  earnedXP: number;
  leveledUp: boolean;
  newAchievements: Achievement[];
} {
  // Calculate XP earned
  const earnedXP = calculateXP(sessionData.score, sessionData.difficulty, sessionData.duration);
  const newTotalXP = currentState.xp + earnedXP;
  
  // Calculate new level
  const oldLevel = currentState.level;
  const levelInfo = calculateLevel(newTotalXP);
  const leveledUp = levelInfo.level > oldLevel;
  
  // Update streak
  const newStreak = updateStreak(sessionData.lastInterviewDate, currentState.streak);
  
  // Increment total interviews
  const newTotalInterviews = currentState.totalInterviews + 1;
  
  // Check achievements
  const { updated, newlyUnlocked } = checkAchievements(currentState, {
    score: sessionData.score,
    difficulty: sessionData.difficulty,
    isFirstInterview: newTotalInterviews === 1
  });
  
  // Create updated state
  const updatedState: GamificationState = {
    level: levelInfo.level,
    xp: newTotalXP,
    xpToNextLevel: levelInfo.xpToNextLevel,
    streak: newStreak,
    totalInterviews: newTotalInterviews,
    achievements: updated,
    badges: currentState.badges
  };
  
  // Add badge for leveling up
  if (leveledUp) {
    updatedState.badges = [...currentState.badges, `Level ${levelInfo.level}`];
  }
  
  return {
    state: updatedState,
    earnedXP,
    leveledUp,
    newAchievements: newlyUnlocked
  };
}

/**
 * Get daily challenge for user
 * @param date - Current date
 * @param level - User's level
 * @returns Daily challenge description
 */
export function getDailyChallenge(date: Date, level: number): {
  title: string;
  description: string;
  xpReward: number;
} {
  const challenges = [
    {
      title: 'Perfect Score Hunter',
      description: 'Achieve a score of 100 in any interview',
      xpReward: 100
    },
    {
      title: 'Technical Master',
      description: 'Complete a Hard difficulty technical interview',
      xpReward: 150
    },
    {
      title: 'Communication Pro',
      description: 'Score 90+ on communication metrics',
      xpReward: 80
    },
    {
      title: 'Speed Demon',
      description: 'Complete a speed interview challenge',
      xpReward: 75
    },
    {
      title: 'Consistent Performer',
      description: 'Complete 3 interviews in one day',
      xpReward: 120
    }
  ];
  
  // Use date to select challenge (deterministic)
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const challengeIndex = dayOfYear % challenges.length;
  
  return challenges[challengeIndex];
}

/**
 * Calculate leaderboard position (simulated)
 * @param totalXP - User's total XP
 * @returns Leaderboard position
 */
export function calculateLeaderboardPosition(totalXP: number): {
  position: number;
  percentile: number;
} {
  // Simulated leaderboard calculation
  // In production, this would query actual user data
  
  // Assume a distribution where average user has 2000 XP
  const averageXP = 2000;
  const standardDeviation = 1000;
  
  // Calculate z-score
  const zScore = (totalXP - averageXP) / standardDeviation;
  
  // Convert to percentile (0-100)
  const percentile = Math.round(Math.max(0, Math.min(100, 50 + zScore * 20)));
  
  // Estimate position (out of 10000 users)
  const totalUsers = 10000;
  const position = Math.round(totalUsers * (100 - percentile) / 100);
  
  return {
    position: Math.max(1, position),
    percentile
  };
}
