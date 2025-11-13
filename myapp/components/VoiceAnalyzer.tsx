/**
 * Voice Analyzer Component
 * Real-time voice recording and analysis with speech metrics
 */

import React, { useState, useRef } from 'react';
import type { VoiceMetrics } from '../types';
import { analyzeVoice } from '../utils/voiceProcessor';

interface VoiceAnalyzerProps {
  onAnalysisComplete?: (metrics: VoiceMetrics) => void;
  transcript?: string;
}

const VoiceAnalyzer: React.FC<VoiceAnalyzerProps> = ({ onAnalysisComplete, transcript = '' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [metrics, setMetrics] = useState<VoiceMetrics | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
        
        // Analyze the recording
        const analysisResult = analyzeVoice(blob, transcript);
        setMetrics(analysisResult);
        if (onAnalysisComplete) {
          onAnalysisComplete(analysisResult);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Microphone access denied or not available');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const getMetricColor = (value: number, optimal: { min: number; max: number }) => {
    if (value >= optimal.min && value <= optimal.max) return 'text-green-600';
    if (value >= optimal.min - 20 && value <= optimal.max + 20) return 'text-amber-600';
    return 'text-red-600';
  };
  
  const getClarityLevel = (clarity: number) => {
    if (clarity >= 90) return 'Excellent';
    if (clarity >= 75) return 'Good';
    if (clarity >= 60) return 'Fair';
    return 'Needs Improvement';
  };
  
  return (
    <div className="voice-analyzer bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">🎤 Voice Analysis</h2>
      
      {/* Recording Control */}
      <div className="mb-6 text-center">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg"
          >
            <span className="flex items-center space-x-2">
              <span className="text-2xl">🎙️</span>
              <span>Start Recording</span>
            </span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-slate-700 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg animate-pulse"
          >
            <span className="flex items-center space-x-2">
              <span className="text-2xl">⏹️</span>
              <span>Stop Recording</span>
            </span>
          </button>
        )}
      </div>
      
      {/* Analysis Results */}
      {metrics && (
        <div className="space-y-4">
          {/* Overall Score */}
          <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-800">Overall Voice Score</h3>
              <span className="text-3xl font-bold text-blue-600">{metrics.overallScore}/100</span>
            </div>
            <div className="mt-2 w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${metrics.overallScore}%` }}
              />
            </div>
          </div>
          
          {/* Speech Rate */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-slate-700">Speech Rate</h3>
              <span className={`font-bold text-lg ${getMetricColor(metrics.speechRate, { min: 130, max: 170 })}`}>
                {metrics.speechRate} WPM
              </span>
            </div>
            <p className="text-xs text-slate-600">Optimal range: 130-170 words per minute</p>
          </div>
          
          {/* Clarity */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-slate-700">Clarity</h3>
              <div className="text-right">
                <span className="font-bold text-lg text-blue-600">{metrics.clarity}/100</span>
                <p className="text-xs text-slate-600">{getClarityLevel(metrics.clarity)}</p>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${metrics.clarity}%` }}
              />
            </div>
          </div>
          
          {/* Volume */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-slate-700">Volume Level</h3>
              <span className="font-bold text-lg text-blue-600">{metrics.volume}/100</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${metrics.volume}%` }}
              />
            </div>
          </div>
          
          {/* Tone */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-slate-700">Detected Tone</h3>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                {metrics.tone}
              </span>
            </div>
          </div>
          
          {/* Filler Words */}
          <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
            <h3 className="font-semibold text-amber-800 mb-2">
              Filler Words Detected: {metrics.fillerWordCount}
            </h3>
            {metrics.fillerWords.length > 0 && (
              <div className="space-y-1">
                {metrics.fillerWords.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-slate-700">"{item.word}"</span>
                    <span className="font-semibold text-amber-700">{item.count}x</span>
                  </div>
                ))}
              </div>
            )}
            {metrics.fillerWordCount === 0 && (
              <p className="text-sm text-green-700">Great! No filler words detected.</p>
            )}
          </div>
          
          {/* Pause Duration */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-slate-700">Average Pause Duration</h3>
              <span className="font-bold text-lg text-blue-600">{metrics.pauseDuration}s</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">Natural pauses show thoughtful communication</p>
          </div>
        </div>
      )}
      
      {/* Tips */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
        <h3 className="font-semibold text-slate-800 mb-2">🎯 Voice Tips</h3>
        <ul className="text-sm text-slate-700 space-y-1">
          <li>• Speak at a moderate pace - not too fast or slow</li>
          <li>• Minimize filler words like "um", "uh", "like"</li>
          <li>• Use natural pauses for emphasis</li>
          <li>• Maintain consistent volume throughout</li>
          <li>• Vary your tone to show enthusiasm</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceAnalyzer;
