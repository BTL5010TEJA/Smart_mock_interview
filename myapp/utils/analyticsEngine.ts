/**
 * Analytics Engine Module
 * Handles performance calculations, trend analysis, and statistical computations
 */

import type { PerformanceMetrics, SkillAssessment, AnalyticsData } from '../types';

/**
 * Calculate performance metrics from interview results
 * @param score - Overall interview score
 * @param criteria - Evaluation criteria scores
 * @returns Performance metrics
 */
export function calculatePerformanceMetrics(
  score: number,
  criteria: { name: string; score: number; maxScore: number }[]
): PerformanceMetrics {
  // Categorize criteria into different skill areas
  const technicalKeywords = ['technical', 'algorithm', 'code', 'system', 'design'];
  const communicationKeywords = ['communication', 'clarity', 'articulation', 'expression'];
  const behavioralKeywords = ['behavioral', 'leadership', 'teamwork', 'problem-solving'];
  
  let technicalScore = 0;
  let communicationScore = 0;
  let behavioralScore = 0;
  let technicalCount = 0;
  let communicationCount = 0;
  let behavioralCount = 0;
  
  criteria.forEach(criterion => {
    const name = criterion.name.toLowerCase();
    const normalizedScore = (criterion.score / criterion.maxScore) * 100;
    
    if (technicalKeywords.some(keyword => name.includes(keyword))) {
      technicalScore += normalizedScore;
      technicalCount++;
    } else if (communicationKeywords.some(keyword => name.includes(keyword))) {
      communicationScore += normalizedScore;
      communicationCount++;
    } else if (behavioralKeywords.some(keyword => name.includes(keyword))) {
      behavioralScore += normalizedScore;
      behavioralCount++;
    } else {
      // Default to behavioral
      behavioralScore += normalizedScore;
      behavioralCount++;
    }
  });
  
  return {
    sessionId: `session_${Date.now()}`,
    date: Date.now(),
    overallScore: score,
    technicalScore: technicalCount > 0 ? Math.round(technicalScore / technicalCount) : 0,
    communicationScore: communicationCount > 0 ? Math.round(communicationScore / communicationCount) : 0,
    behavioralScore: behavioralCount > 0 ? Math.round(behavioralScore / behavioralCount) : 0,
    duration: 0 // Would be calculated from actual interview duration
  };
}

/**
 * Analyze performance trends over time
 * @param history - Array of performance metrics
 * @returns Trend analysis
 */
export function analyzeTrends(history: PerformanceMetrics[]): {
  trend: 'improving' | 'declining' | 'stable';
  changePercentage: number;
  averageScore: number;
} {
  if (history.length === 0) {
    return { trend: 'stable', changePercentage: 0, averageScore: 0 };
  }
  
  const scores = history.map(h => h.overallScore);
  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  if (history.length < 2) {
    return { trend: 'stable', changePercentage: 0, averageScore };
  }
  
  // Compare first half with second half
  const midPoint = Math.floor(history.length / 2);
  const firstHalf = scores.slice(0, midPoint);
  const secondHalf = scores.slice(midPoint);
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const changePercentage = ((secondAvg - firstAvg) / firstAvg) * 100;
  
  let trend: 'improving' | 'declining' | 'stable';
  if (changePercentage > 5) {
    trend = 'improving';
  } else if (changePercentage < -5) {
    trend = 'declining';
  } else {
    trend = 'stable';
  }
  
  return { trend, changePercentage: Math.round(changePercentage), averageScore: Math.round(averageScore) };
}

/**
 * Identify weakness areas from performance history
 * @param history - Array of performance metrics
 * @returns Array of weakness descriptions
 */
export function identifyWeaknesses(history: PerformanceMetrics[]): string[] {
  if (history.length === 0) return [];
  
  const weaknesses: string[] = [];
  
  // Calculate average scores for each category
  const avgTechnical = history.reduce((sum, h) => sum + h.technicalScore, 0) / history.length;
  const avgCommunication = history.reduce((sum, h) => sum + h.communicationScore, 0) / history.length;
  const avgBehavioral = history.reduce((sum, h) => sum + h.behavioralScore, 0) / history.length;
  
  // Identify areas below threshold (65%)
  if (avgTechnical < 65) {
    weaknesses.push('Technical Skills - Consider practicing coding problems and system design');
  }
  if (avgCommunication < 65) {
    weaknesses.push('Communication Skills - Work on articulating thoughts clearly and concisely');
  }
  if (avgBehavioral < 65) {
    weaknesses.push('Behavioral Responses - Practice STAR method for behavioral questions');
  }
  
  // Check for declining trends
  if (history.length >= 3) {
    const recent = history.slice(-3);
    const techTrend = recent[2].technicalScore - recent[0].technicalScore;
    const commTrend = recent[2].communicationScore - recent[0].communicationScore;
    const behTrend = recent[2].behavioralScore - recent[0].behavioralScore;
    
    if (techTrend < -10) weaknesses.push('Technical scores showing decline - review fundamentals');
    if (commTrend < -10) weaknesses.push('Communication effectiveness decreasing - focus on clarity');
    if (behTrend < -10) weaknesses.push('Behavioral responses need attention - prepare more examples');
  }
  
  return weaknesses;
}

/**
 * Generate skill radar chart data
 * @param metrics - Latest performance metrics
 * @returns Radar chart data points
 */
export function generateSkillRadarData(metrics: PerformanceMetrics): {
  skill: string;
  score: number;
}[] {
  return [
    { skill: 'Technical', score: metrics.technicalScore },
    { skill: 'Communication', score: metrics.communicationScore },
    { skill: 'Behavioral', score: metrics.behavioralScore },
    { skill: 'Problem Solving', score: (metrics.technicalScore + metrics.behavioralScore) / 2 },
    { skill: 'Confidence', score: metrics.communicationScore }
  ];
}

/**
 * Compare performance against industry benchmarks
 * @param score - User's score
 * @param role - Job role
 * @returns Benchmark comparison
 */
export function compareWithBenchmark(score: number, role: string): {
  benchmark: number;
  percentile: number;
  comparison: 'above' | 'at' | 'below';
} {
  // Simulated industry benchmarks by role category
  const benchmarks: { [key: string]: number } = {
    'entry': 65,
    'mid': 75,
    'senior': 85,
    'default': 70
  };
  
  // Determine category from role
  let benchmark = benchmarks.default;
  const roleLower = role.toLowerCase();
  
  if (roleLower.includes('senior') || roleLower.includes('lead')) {
    benchmark = benchmarks.senior;
  } else if (roleLower.includes('junior') || roleLower.includes('intern') || roleLower.includes('entry')) {
    benchmark = benchmarks.entry;
  } else if (roleLower.includes('mid') || roleLower.includes('engineer') || roleLower.includes('developer')) {
    benchmark = benchmarks.mid;
  }
  
  // Calculate percentile (simplified)
  const percentile = Math.min(99, Math.round((score / 100) * 100));
  
  const comparison = score > benchmark + 5 ? 'above' : score < benchmark - 5 ? 'below' : 'at';
  
  return { benchmark, percentile, comparison };
}

/**
 * Calculate success prediction score
 * @param history - Performance history
 * @param skillAssessments - Skill assessments
 * @returns Prediction score (0-100)
 */
export function calculateSuccessPrediction(
  history: PerformanceMetrics[],
  skillAssessments: SkillAssessment[]
): number {
  if (history.length === 0) return 50;
  
  // Factor 1: Recent performance (40% weight)
  const recentScores = history.slice(-3).map(h => h.overallScore);
  const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
  
  // Factor 2: Trend (30% weight)
  const trendAnalysis = analyzeTrends(history);
  const trendScore = trendAnalysis.trend === 'improving' ? 80 : 
                     trendAnalysis.trend === 'declining' ? 50 : 65;
  
  // Factor 3: Consistency (20% weight)
  const variance = calculateVariance(recentScores);
  const consistencyScore = Math.max(0, 100 - variance);
  
  // Factor 4: Skill coverage (10% weight)
  const coverageScore = Math.min(100, skillAssessments.length * 20);
  
  const prediction = 
    recentAvg * 0.4 +
    trendScore * 0.3 +
    consistencyScore * 0.2 +
    coverageScore * 0.1;
  
  return Math.round(Math.max(0, Math.min(100, prediction)));
}

/**
 * Calculate variance of scores
 * @param scores - Array of scores
 * @returns Variance value
 */
function calculateVariance(scores: number[]): number {
  if (scores.length === 0) return 0;
  
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const squaredDiffs = scores.map(score => Math.pow(score - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / scores.length;
  
  return Math.sqrt(variance);
}

/**
 * Generate comprehensive analytics data
 * @param history - Performance history
 * @param currentMetrics - Current performance metrics
 * @param role - Job role
 * @returns Complete analytics data
 */
export function generateAnalyticsData(
  history: PerformanceMetrics[],
  currentMetrics: PerformanceMetrics,
  role: string
): AnalyticsData {
  const trendData = history.map(h => ({
    date: new Date(h.date).toLocaleDateString(),
    score: h.overallScore
  }));
  
  return {
    performanceHistory: history,
    skillRadar: generateSkillRadarData(currentMetrics),
    weaknessAreas: identifyWeaknesses(history),
    industryBenchmark: compareWithBenchmark(currentMetrics.overallScore, role).benchmark,
    predictionScore: calculateSuccessPrediction(history, []),
    trendData
  };
}
