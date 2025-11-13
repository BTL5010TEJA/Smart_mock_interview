/**
 * Analytics Dashboard Component
 * Displays comprehensive performance metrics, progress tracking, and skill analysis
 */

import React from 'react';
import { LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { AnalyticsData } from '../types';

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  currentScore: number;
  role: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data, currentScore, role }) => {
  return (
    <div className="analytics-dashboard p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">📊 Performance Analytics</h2>
      
      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-sm font-semibold text-slate-600 mb-2">Current Score</h3>
          <p className="text-4xl font-bold text-blue-600">{currentScore}/100</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-sm font-semibold text-slate-600 mb-2">Industry Benchmark</h3>
          <p className="text-4xl font-bold text-green-600">{data.industryBenchmark}/100</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 className="text-sm font-semibold text-slate-600 mb-2">Success Prediction</h3>
          <p className="text-4xl font-bold text-purple-600">{data.predictionScore}%</p>
        </div>
      </div>
      
      {/* Skill Radar Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Skill Assessment Radar</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data.skillRadar}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: '#475569', fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b' }} />
            <Radar name="Your Skills" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Performance Trend */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Performance Trend Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data.trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#64748b' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Performance History Bar Chart */}
      {data.performanceHistory.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Detailed Performance Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.performanceHistory.slice(-5)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="sessionId" 
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickFormatter={(value) => `Session ${value.split('_')[1]?.slice(-4) || ''}`}
              />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="technicalScore" fill="#8b5cf6" name="Technical" />
              <Bar dataKey="communicationScore" fill="#10b981" name="Communication" />
              <Bar dataKey="behavioralScore" fill="#f59e0b" name="Behavioral" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {/* Weakness Areas */}
      {data.weaknessAreas.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">🎯 Areas for Improvement</h3>
          <div className="space-y-3">
            {data.weaknessAreas.map((weakness, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-amber-50 border-l-4 border-amber-400 rounded">
                <span className="text-amber-600 text-xl">⚠️</span>
                <p className="text-slate-700 text-sm">{weakness}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Insights Summary */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
        <h3 className="text-xl font-semibold mb-3">💡 Key Insights</h3>
        <div className="space-y-2 text-sm">
          <p>• You're performing {currentScore >= data.industryBenchmark ? 'above' : 'below'} industry standards for {role}</p>
          <p>• Your success prediction indicates a {data.predictionScore >= 75 ? 'high' : data.predictionScore >= 50 ? 'moderate' : 'developing'} likelihood of interview success</p>
          <p>• {data.weaknessAreas.length === 0 ? 'Great job! No major weaknesses identified.' : `Focus on ${data.weaknessAreas.length} key improvement area${data.weaknessAreas.length > 1 ? 's' : ''}`}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
