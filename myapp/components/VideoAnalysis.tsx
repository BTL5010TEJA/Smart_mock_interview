/**
 * Video Analysis Component
 * Displays video analysis results including body language, facial expressions, and confidence metrics
 */

import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import type { VideoAnalysisResult } from '../types';

interface VideoAnalysisProps {
  onAnalysisComplete?: (result: VideoAnalysisResult) => void;
  isRecording: boolean;
}

const VideoAnalysis: React.FC<VideoAnalysisProps> = ({ onAnalysisComplete, isRecording }) => {
  const webcamRef = useRef<Webcam>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VideoAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  useEffect(() => {
    // Check camera permission
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => setHasPermission(true))
      .catch(() => setHasPermission(false));
  }, []);
  
  const performAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis (in production, would use actual ML models)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result: VideoAnalysisResult = {
      bodyLanguage: {
        posture: Math.random() > 0.5 ? 'Excellent - Upright and engaged' : 'Good - Maintain eye level',
        score: 70 + Math.floor(Math.random() * 25)
      },
      facialExpression: {
        emotion: ['Confident', 'Calm', 'Engaged', 'Professional'][Math.floor(Math.random() * 4)],
        confidence: 0.75 + Math.random() * 0.2
      },
      eyeContact: {
        percentage: 65 + Math.floor(Math.random() * 30),
        quality: 'Good'
      },
      confidenceLevel: 70 + Math.floor(Math.random() * 25),
      overallFeedback: 'Your non-verbal communication shows professionalism. Consider maintaining more consistent eye contact.'
    };
    
    result.eyeContact.quality = result.eyeContact.percentage > 80 ? 'Excellent' : 
                                  result.eyeContact.percentage > 60 ? 'Good' : 'Needs Improvement';
    
    setAnalysisResult(result);
    setIsAnalyzing(false);
    
    if (onAnalysisComplete) {
      onAnalysisComplete(result);
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 55) return 'text-amber-600';
    return 'text-red-600';
  };
  
  const getScoreBgColor = (score: number) => {
    if (score >= 85) return 'bg-green-100';
    if (score >= 70) return 'bg-blue-100';
    if (score >= 55) return 'bg-amber-100';
    return 'bg-red-100';
  };
  
  return (
    <div className="video-analysis bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">📹 Video & Body Language Analysis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Webcam Preview */}
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
            {hasPermission ? (
              <>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                  mirrored={true}
                />
                {isRecording && (
                  <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-sm font-semibold">Recording</span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                <div className="text-center">
                  <p className="text-lg mb-2">📷</p>
                  <p className="text-sm">Camera permission required</p>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={performAnalysis}
            disabled={!hasPermission || isAnalyzing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Video Metrics'}
          </button>
        </div>
        
        {/* Analysis Results */}
        <div className="space-y-4">
          {analysisResult ? (
            <>
              {/* Confidence Level */}
              <div className={`p-4 rounded-lg ${getScoreBgColor(analysisResult.confidenceLevel)}`}>
                <h3 className="font-semibold text-slate-700 mb-2">Overall Confidence Level</h3>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${analysisResult.confidenceLevel >= 85 ? 'bg-green-600' : analysisResult.confidenceLevel >= 70 ? 'bg-blue-600' : 'bg-amber-600'}`}
                        style={{ width: `${analysisResult.confidenceLevel}%` }}
                      />
                    </div>
                  </div>
                  <span className={`ml-4 text-2xl font-bold ${getScoreColor(analysisResult.confidenceLevel)}`}>
                    {analysisResult.confidenceLevel}%
                  </span>
                </div>
              </div>
              
              {/* Body Language */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-slate-700 mb-2 flex items-center">
                  <span className="mr-2">🧍</span>
                  Body Language & Posture
                </h3>
                <p className="text-sm text-slate-600 mb-2">{analysisResult.bodyLanguage.posture}</p>
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-slate-700 mr-2">Score:</span>
                  <span className={`font-bold ${getScoreColor(analysisResult.bodyLanguage.score)}`}>
                    {analysisResult.bodyLanguage.score}/100
                  </span>
                </div>
              </div>
              
              {/* Facial Expression */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-slate-700 mb-2 flex items-center">
                  <span className="mr-2">😊</span>
                  Facial Expression
                </h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-600">Detected Emotion:</p>
                    <p className="font-semibold text-slate-800">{analysisResult.facialExpression.emotion}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Confidence:</p>
                    <p className="font-semibold text-blue-600">
                      {Math.round(analysisResult.facialExpression.confidence * 100)}%
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Eye Contact */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-slate-700 mb-2 flex items-center">
                  <span className="mr-2">👁️</span>
                  Eye Contact
                </h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-600">Quality:</p>
                    <p className="font-semibold text-slate-800">{analysisResult.eyeContact.quality}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Percentage:</p>
                    <p className="font-semibold text-blue-600">{analysisResult.eyeContact.percentage}%</p>
                  </div>
                </div>
              </div>
              
              {/* Overall Feedback */}
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-semibold text-blue-800 mb-2">💡 Feedback</h3>
                <p className="text-sm text-slate-700">{analysisResult.overallFeedback}</p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <div className="text-center">
                <p className="text-lg mb-2">📊</p>
                <p className="text-sm">Click "Analyze" to see your video metrics</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Tips Section */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
        <h3 className="font-semibold text-slate-800 mb-2">📚 Video Interview Tips</h3>
        <ul className="text-sm text-slate-700 space-y-1">
          <li>• Maintain eye contact by looking at the camera, not the screen</li>
          <li>• Sit up straight and avoid slouching</li>
          <li>• Use natural hand gestures to emphasize points</li>
          <li>• Ensure good lighting - face should be well-lit</li>
          <li>• Position camera at eye level for best angle</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoAnalysis;
