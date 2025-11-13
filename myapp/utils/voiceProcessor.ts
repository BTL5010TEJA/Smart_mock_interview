/**
 * Voice Processing Module
 * Handles audio recording, speech analysis, filler word detection, and voice metrics
 */

import { FILLER_WORDS } from '../constants';
import type { VoiceMetrics } from '../types';

/**
 * Start audio recording
 * @returns MediaRecorder instance and stream
 */
export async function startAudioRecording(): Promise<{
  recorder: MediaRecorder | null;
  stream: MediaStream | null;
}> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });
    
    const options = { mimeType: 'audio/webm' };
    const recorder = new MediaRecorder(stream, options);
    
    return { recorder, stream };
  } catch (error) {
    console.error('Failed to start audio recording:', error);
    return { recorder: null, stream: null };
  }
}

/**
 * Stop audio recording
 * @param recorder - MediaRecorder instance
 * @param stream - MediaStream to stop
 * @returns Audio blob
 */
export async function stopAudioRecording(
  recorder: MediaRecorder,
  stream: MediaStream
): Promise<Blob> {
  return new Promise((resolve) => {
    const chunks: Blob[] = [];
    
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      stream.getTracks().forEach(track => track.stop());
      resolve(blob);
    };
    
    recorder.stop();
  });
}

/**
 * Analyze audio for voice metrics
 * @param audioBlob - Recorded audio
 * @param transcript - Text transcript of the audio
 * @returns Voice metrics
 */
export function analyzeVoice(audioBlob: Blob, transcript: string): VoiceMetrics {
  // Calculate speech rate (words per minute)
  const words = transcript.trim().split(/\s+/);
  const wordCount = words.length;
  
  // Estimate duration from blob size (rough approximation)
  const estimatedDurationMinutes = audioBlob.size / (1024 * 60); // Very rough estimate
  const speechRate = estimatedDurationMinutes > 0 
    ? Math.round(wordCount / estimatedDurationMinutes)
    : 130; // Default to average speech rate
  
  // Detect filler words
  const fillerWordData = detectFillerWords(transcript);
  
  // Calculate clarity score based on filler words and transcript quality
  const clarity = calculateClarityScore(transcript, fillerWordData.total);
  
  // Simulate volume and tone analysis (would use actual audio processing in production)
  const volume = 60 + Math.random() * 30;
  const tone = determineTone(transcript);
  
  // Calculate pause duration (simulated)
  const pauseDuration = 0.5 + Math.random() * 1.5;
  
  // Calculate overall score
  const overallScore = calculateVoiceScore({
    speechRate,
    clarity,
    volume,
    fillerWordCount: fillerWordData.total
  });
  
  return {
    speechRate,
    clarity,
    volume: Math.round(volume),
    tone,
    fillerWordCount: fillerWordData.total,
    fillerWords: fillerWordData.details,
    pauseDuration: Math.round(pauseDuration * 100) / 100,
    overallScore
  };
}

/**
 * Detect filler words in transcript
 * @param transcript - Text to analyze
 * @returns Filler word counts
 */
export function detectFillerWords(transcript: string): {
  total: number;
  details: { word: string; count: number }[];
} {
  const lowerTranscript = transcript.toLowerCase();
  const details: { word: string; count: number }[] = [];
  let total = 0;
  
  FILLER_WORDS.forEach(fillerWord => {
    const regex = new RegExp(`\\b${fillerWord}\\b`, 'gi');
    const matches = lowerTranscript.match(regex);
    const count = matches ? matches.length : 0;
    
    if (count > 0) {
      details.push({ word: fillerWord, count });
      total += count;
    }
  });
  
  // Sort by count descending
  details.sort((a, b) => b.count - a.count);
  
  return { total, details };
}

/**
 * Calculate clarity score
 * @param transcript - Text transcript
 * @param fillerWordCount - Number of filler words
 * @returns Clarity score (0-100)
 */
function calculateClarityScore(transcript: string, fillerWordCount: number): number {
  const words = transcript.trim().split(/\s+/);
  const wordCount = words.length;
  
  if (wordCount === 0) return 0;
  
  // Base score
  let score = 100;
  
  // Penalty for filler words (max 30 points)
  const fillerRatio = fillerWordCount / wordCount;
  const fillerPenalty = Math.min(30, fillerRatio * 200);
  score -= fillerPenalty;
  
  // Bonus for sentence variety (check for punctuation variety)
  const hasPunctuation = /[.!?]/.test(transcript);
  if (hasPunctuation) score += 5;
  
  // Penalty for very short responses
  if (wordCount < 20) score -= 10;
  
  return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * Determine tone from transcript
 * @param transcript - Text to analyze
 * @returns Tone description
 */
function determineTone(transcript: string): string {
  const lowerTranscript = transcript.toLowerCase();
  
  // Check for enthusiasm indicators
  const enthusiasmWords = ['excited', 'love', 'amazing', 'wonderful', 'fantastic'];
  const hasEnthusiasm = enthusiasmWords.some(word => lowerTranscript.includes(word));
  
  // Check for professional language
  const professionalWords = ['experience', 'skills', 'expertise', 'professional', 'accomplished'];
  const isProfessional = professionalWords.some(word => lowerTranscript.includes(word));
  
  // Check for uncertainty
  const uncertainWords = ['maybe', 'perhaps', 'might', 'possibly', 'not sure'];
  const hasUncertainty = uncertainWords.some(word => lowerTranscript.includes(word));
  
  if (hasEnthusiasm) return 'Enthusiastic';
  if (isProfessional) return 'Professional';
  if (hasUncertainty) return 'Uncertain';
  
  return 'Neutral';
}

/**
 * Calculate overall voice score
 * @param metrics - Voice metrics to evaluate
 * @returns Overall score (0-100)
 */
function calculateVoiceScore(metrics: {
  speechRate: number;
  clarity: number;
  volume: number;
  fillerWordCount: number;
}): number {
  let score = 100;
  
  // Speech rate scoring (optimal 130-170 wpm)
  if (metrics.speechRate < 110 || metrics.speechRate > 190) {
    score -= 15;
  } else if (metrics.speechRate < 130 || metrics.speechRate > 170) {
    score -= 5;
  }
  
  // Clarity contribution (30% weight)
  score = score * 0.7 + metrics.clarity * 0.3;
  
  // Volume check
  if (metrics.volume < 40) score -= 10;
  if (metrics.volume > 90) score -= 5;
  
  // Filler word penalty
  score -= Math.min(20, metrics.fillerWordCount * 2);
  
  return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * Analyze audio waveform data
 * @param audioContext - Web Audio API context
 * @param audioBuffer - Audio buffer to analyze
 * @returns Waveform data points
 */
export async function analyzeWaveform(
  audioContext: AudioContext,
  audioBuffer: AudioBuffer
): Promise<number[]> {
  const channelData = audioBuffer.getChannelData(0);
  const samples = 100; // Number of data points to return
  const blockSize = Math.floor(channelData.length / samples);
  const waveformData: number[] = [];
  
  for (let i = 0; i < samples; i++) {
    const start = blockSize * i;
    let sum = 0;
    
    for (let j = 0; j < blockSize; j++) {
      sum += Math.abs(channelData[start + j]);
    }
    
    waveformData.push(sum / blockSize);
  }
  
  return waveformData;
}

/**
 * Calculate speaking time vs pause time ratio
 * @param audioBuffer - Audio buffer to analyze
 * @param threshold - Amplitude threshold to determine speech
 * @returns Ratio of speaking time to total time
 */
export function calculateSpeakingRatio(
  audioBuffer: AudioBuffer,
  threshold: number = 0.01
): number {
  const channelData = audioBuffer.getChannelData(0);
  let speakingFrames = 0;
  
  for (let i = 0; i < channelData.length; i++) {
    if (Math.abs(channelData[i]) > threshold) {
      speakingFrames++;
    }
  }
  
  return speakingFrames / channelData.length;
}
