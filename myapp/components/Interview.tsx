import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MicIcon } from './icons/MicIcon';
import { AlertTriangle } from './icons/AlertTriangle';
import { PauseIcon } from './icons/PauseIcon';
import { InfoIcon } from './icons/InfoIcon';
import { SaveIcon } from './icons/SaveIcon';
import { InProgressInterview, InterviewSession } from '../types';
import { saveDraft } from '../utils/sessionManager';
import { analyzeFrameForMalpractice } from '../utils/geminiApi';

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const isSpeechRecognitionSupported = !!SpeechRecognition;

interface SpeechRecognitionResult { isFinal: boolean; [index: number]: { transcript: string }; }
interface SpeechRecognitionResultList { [index: number]: SpeechRecognitionResult; length: number; }
interface SpeechRecognitionEvent extends Event { resultIndex: number; results: SpeechRecognitionResultList; }
interface SpeechRecognitionErrorEvent extends Event { error: string; }
interface SpeechRecognitionInstance { continuous: boolean; interimResults: boolean; lang: string; onresult: (event: SpeechRecognitionEvent) => void; onerror: (event: SpeechRecognitionErrorEvent) => void; onend: () => void; start: () => void; stop: () => void; }

interface InterviewProps {
  session: InterviewSession;
  onInterviewComplete: (answers: string[], snapshots: { [key: number]: string[] }, malpracticeLogs: { [key: number]: string[] }) => void;
  draft: InProgressInterview | null;
}

type RecordingState = 'idle' | 'recording' | 'paused';

const Interview: React.FC<InterviewProps> = ({ session, onInterviewComplete, draft }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [interviewerStatus, setInterviewerStatus] = useState('Ready for your answer.');
  const [malpracticeAlert, setMalpracticeAlert] = useState<string | null>(null);
  const [visualFeedback, setVisualFeedback] = useState<string | null>(null);
  const [answerTime, setAnswerTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const answersRef = useRef<string[]>([]);
  const snapshotsRef = useRef<{ [key: number]: string[] }>({});
  const malpracticeLogsRef = useRef<{ [key: number]: string[] }>({});
  const snapshotIntervalRef = useRef<number | null>(null);
  const malpracticeCheckIntervalRef = useRef<number | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // For robust malpractice detection
  const gazeHistoryRef = useRef<boolean[]>([]);
  const alertShownForQuestionRef = useRef<boolean>(false);
  
  // For audio analysis
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioDataArrayRef = useRef<Uint8Array | null>(null);
  const audioCheckIntervalRef = useRef<number | null>(null);

  const recordingStateRef = useRef(recordingState);
  useEffect(() => {
    recordingStateRef.current = recordingState;
  }, [recordingState]);
  
  const visualFeedbackRef = useRef(visualFeedback);
  useEffect(() => {
    visualFeedbackRef.current = visualFeedback;
  }, [visualFeedback]);

  const transcriptRef = useRef(transcript);
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  const currentQuestionIndexRef = useRef(currentQuestionIndex);
  useEffect(() => {
    currentQuestionIndexRef.current = currentQuestionIndex;
  }, [currentQuestionIndex]);

  // Load from draft on initial mount
  useEffect(() => {
    if (draft) {
        setCurrentQuestionIndex(draft.currentQuestionIndex);
        answersRef.current = draft.answers;
        snapshotsRef.current = draft.snapshots;
        malpracticeLogsRef.current = draft.malpracticeLogs;
        setTranscript(draft.currentTranscript);
    }
  }, [draft]);

  // Auto-save draft every minute
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      // Use refs to get the latest state without causing the interval to reset.
      if (recordingStateRef.current === 'recording' || recordingStateRef.current === 'paused') {
        const draftData: InProgressInterview = {
            session, // session prop is stable throughout the interview
            currentQuestionIndex: currentQuestionIndexRef.current,
            answers: answersRef.current,
            snapshots: snapshotsRef.current,
            malpracticeLogs: malpracticeLogsRef.current,
            currentTranscript: transcriptRef.current,
        };
        saveDraft(draftData);
      }
    }, 60000); // 60000 ms = 1 minute

    return () => clearInterval(autoSaveInterval);
  }, [session]); // Re-run if session changes

  // Total time timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Answer time timer
  useEffect(() => {
    let timer: number | null = null;
    if (recordingState === 'recording') {
      timer = window.setInterval(() => {
        setAnswerTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [recordingState]);

  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current || !audioDataArrayRef.current) return;

    analyserRef.current.getByteFrequencyData(audioDataArrayRef.current);
    const sum = audioDataArrayRef.current.reduce((a, b) => a + b, 0);
    const average = sum / audioDataArrayRef.current.length;

    const LOUD_NOISE_THRESHOLD = 85; 
    
    if (average > LOUD_NOISE_THRESHOLD) {
        if (!malpracticeLogsRef.current[currentQuestionIndex]) {
            malpracticeLogsRef.current[currentQuestionIndex] = [];
        }
        malpracticeLogsRef.current[currentQuestionIndex].push('Loud background noise detected.');
    }
  }, [currentQuestionIndex]);
  
  const analyzeFrame = useCallback(async () => {
    if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
    
    const result = await analyzeFrameForMalpractice(base64Image);

    if (!result) return; // Error is logged in the API utility.

    // Handle malpractice with improved, stateful logic
    if (result.malpracticeDetected && result.reason && !alertShownForQuestionRef.current) {
        let showAlarm = false;
        
        // For immediate, less ambiguous flags, show alert right away
        if (result.otherPerson || result.deviceDetected) {
            showAlarm = true;
        }

        // For gaze, use history to be more robust
        if (result.suspiciousGaze) {
            gazeHistoryRef.current.push(true);
        } else {
            gazeHistoryRef.current.push(false);
        }

        if (gazeHistoryRef.current.length > 4) {
            gazeHistoryRef.current.shift();
        }

        const suspiciousGazeCount = gazeHistoryRef.current.filter(Boolean).length;
        if (gazeHistoryRef.current.length >= 4 && suspiciousGazeCount >= 3) {
            showAlarm = true;
        }

        if (showAlarm) {
            setMalpracticeAlert(result.reason);
            if (!malpracticeLogsRef.current[currentQuestionIndex]) {
                malpracticeLogsRef.current[currentQuestionIndex] = [];
            }
            malpracticeLogsRef.current[currentQuestionIndex].push(result.reason);
            alertShownForQuestionRef.current = true; // Show alert only once per question
            setTimeout(() => setMalpracticeAlert(null), 5000);

              if (visualFeedbackRef.current) {
                setVisualFeedback(null);
            }
        }
    } 
    else if (result.deliveryFeedback && !visualFeedbackRef.current) {
        setVisualFeedback(result.deliveryFeedback);
        setTimeout(() => setVisualFeedback(null), 4000); 
    }
  }, [currentQuestionIndex]);

  // Robust malpractice analysis loop
  useEffect(() => {
    let timeoutId: number | null = null;
    
    const analysisLoop = async () => {
      await analyzeFrame();
      // Schedule the next run only if we are still recording
      if (recordingStateRef.current === 'recording') {
        timeoutId = window.setTimeout(analysisLoop, 4000);
        malpracticeCheckIntervalRef.current = timeoutId;
      }
    };

    if (recordingState === 'recording') {
      analysisLoop();
    } else {
      // Clear any pending timeout if state is not 'recording'
      if (malpracticeCheckIntervalRef.current) {
        clearTimeout(malpracticeCheckIntervalRef.current);
        malpracticeCheckIntervalRef.current = null;
      }
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        malpracticeCheckIntervalRef.current = null;
      }
    };
  }, [recordingState, analyzeFrame]);


  useEffect(() => {
    if (!isSpeechRecognitionSupported) {
      alert("Your browser does not support Speech Recognition. Please use Chrome or Edge.");
      return;
    }

    const recognition: SpeechRecognitionInstance = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart + ' ';
        } else {
          interimTranscript = transcriptPart;
        }
      }
      answersRef.current[currentQuestionIndex] = finalTranscript.trim();
      setTranscript(finalTranscript.trim() + ' ' + interimTranscript);
    };
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error === 'no-speech') return;
        console.error('Speech recognition error', event.error);
      
        if (snapshotIntervalRef.current) clearInterval(snapshotIntervalRef.current);
        if (audioCheckIntervalRef.current) clearInterval(audioCheckIntervalRef.current);
        snapshotIntervalRef.current = null;
        audioCheckIntervalRef.current = null;
      
        if (event.error === 'network') {
          setInterviewerStatus("Network issue with mic. Please try again.");
        } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setInterviewerStatus("Microphone access denied.");
        } else {
          setInterviewerStatus("Mic error. Please try again.");
        }
        
        setRecordingState('idle');
    };

    recognition.onend = () => {
        if (recordingStateRef.current === 'recording') {
          try {
            recognitionRef.current?.start();
          } catch (err) {
            console.error("Error restarting recognition:", err);
            setInterviewerStatus("Mic failed to restart. Please try again.");
            if (snapshotIntervalRef.current) clearInterval(snapshotIntervalRef.current);
            if (audioCheckIntervalRef.current) clearInterval(audioCheckIntervalRef.current);
            snapshotIntervalRef.current = null;
            audioCheckIntervalRef.current = null;
            setRecordingState('idle');
          }
        }
    };
    
    recognitionRef.current = recognition;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
         try {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
            const bufferLength = analyserRef.current.frequencyBinCount;
            audioDataArrayRef.current = new Uint8Array(bufferLength);
            source.connect(analyserRef.current);
        } catch (err) {
            console.error("Failed to initialize Web Audio API for noise detection.", err);
        }
      })
      .catch(err => {
        console.error("Error accessing camera/mic:", err);
        setInterviewerStatus("Camera/Mic access denied.");
      });

    return () => {
      if (recognitionRef.current) {
        recordingStateRef.current = 'idle';
        recognitionRef.current.stop();
      }
      if (snapshotIntervalRef.current) clearInterval(snapshotIntervalRef.current);
      if (audioCheckIntervalRef.current) clearInterval(audioCheckIntervalRef.current);
      videoRef.current?.srcObject && (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    };
  }, []);

  const captureSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
        if (!snapshotsRef.current[currentQuestionIndex]) {
          snapshotsRef.current[currentQuestionIndex] = [];
        }
        snapshotsRef.current[currentQuestionIndex].push(base64Image);
      }
    }
  };

  const handleRecordingAction = () => {
    if (isProcessing || !recognitionRef.current) return;

    switch (recordingState) {
        case 'idle':
            setAnswerTime(0);
            answersRef.current[currentQuestionIndex] = '';
            malpracticeLogsRef.current[currentQuestionIndex] = [];
            setTranscript('');
            setMalpracticeAlert(null);
            recognitionRef.current?.start();
            snapshotIntervalRef.current = window.setInterval(captureSnapshot, 5000); 
            audioCheckIntervalRef.current = window.setInterval(analyzeAudio, 2000);
            setRecordingState('recording');
            break;
        case 'recording':
            recognitionRef.current?.stop();
            if (snapshotIntervalRef.current) clearInterval(snapshotIntervalRef.current);
            if (audioCheckIntervalRef.current) clearInterval(audioCheckIntervalRef.current);
            snapshotIntervalRef.current = null;
            audioCheckIntervalRef.current = null;
            setRecordingState('paused');
            break;
        case 'paused':
            recognitionRef.current?.start();
            snapshotIntervalRef.current = window.setInterval(captureSnapshot, 5000); 
            audioCheckIntervalRef.current = window.setInterval(analyzeAudio, 2000);
            setRecordingState('recording');
            break;
    }
  };

  const handleNextQuestion = async () => {
    try {
        if (recordingState !== 'idle' && recognitionRef.current) {
            recognitionRef.current.stop();
            if (snapshotIntervalRef.current) clearInterval(snapshotIntervalRef.current);
            if (audioCheckIntervalRef.current) clearInterval(audioCheckIntervalRef.current);
            snapshotIntervalRef.current = null;
            audioCheckIntervalRef.current = null;
            setMalpracticeAlert(null);
        }
        
        setIsProcessing(true);
        answersRef.current[currentQuestionIndex] = transcript.trim();
        
        await new Promise(resolve => setTimeout(resolve, 500));

        setTranscript('');
        setIsProcessing(false);
        setRecordingState('idle');
        setAnswerTime(0);
        
        // Reset state for the next question
        gazeHistoryRef.current = [];
        alertShownForQuestionRef.current = false;

        if (currentQuestionIndex < session.questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          onInterviewComplete(answersRef.current, snapshotsRef.current, malpracticeLogsRef.current); 
        }
    } catch(err) {
        console.error("Error processing next question:", err);
        setInterviewerStatus("An error occurred. Please refresh.");
        setIsProcessing(false);
    }
  };

  const handleSaveDraft = () => {
    if (!session) return;
    const draftData: InProgressInterview = {
        session,
        currentQuestionIndex,
        answers: answersRef.current,
        snapshots: snapshotsRef.current,
        malpracticeLogs: malpracticeLogsRef.current,
        currentTranscript: transcript,
    };
    saveDraft(draftData);
    setInterviewerStatus('Draft saved!');
    setTimeout(() => {
        // Only reset if it's still 'Draft saved!'
        setInterviewerStatus('Ready for your answer.');
    }, 3000);
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const getButtonProps = () => {
    switch (recordingState) {
        case 'recording':
            return { label: 'Pause Recording', className: 'bg-rose-500 hover:bg-rose-600 focus:ring-rose-400', icon: <PauseIcon /> };
        case 'paused':
            return { label: 'Resume Recording', className: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-400', icon: <MicIcon /> };
        case 'idle':
        default:
            return { label: 'Start Recording', className: 'bg-sky-500 hover:bg-sky-600 focus:ring-sky-400', icon: <MicIcon /> };
    }
  };

  const buttonProps = getButtonProps();
  const progress = ((currentQuestionIndex + 1) / session.questions.length) * 100;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-800">
        <div className="w-full md:w-80 lg:w-96 bg-slate-900 p-6 flex flex-col items-center justify-center relative md:h-screen md:sticky md:top-0">
            <div className={`relative w-64 h-64 md:w-full md:h-auto md:aspect-square bg-slate-800 rounded-2xl overflow-hidden transition-shadow duration-500 ${recordingState === 'recording' ? 'animate-pulse-glow' : 'shadow-lg'}`}>
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scaleX-[-1]"></video>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/50 text-white px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all">
                    {interviewerStatus}
                </div>
                {visualFeedback && (
                    <div key={visualFeedback} className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center text-white opacity-0 animate-[fade-in-up_0.5s_ease-out_forwards]">
                        <InfoIcon className="w-10 h-10 mb-2 text-sky-300" />
                        <p className="font-semibold text-lg">{visualFeedback}</p>
                    </div>
                )}
            </div>
            {malpracticeAlert && (
                 <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-11/12 bg-rose-500 text-white p-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-pulse">
                    <AlertTriangle className="w-8 h-8 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold">Malpractice Alert</h4>
                        <p className="text-sm">{malpracticeAlert}</p>
                    </div>
                </div>
            )}
            <div className="w-full flex justify-around items-center text-slate-400 mt-6 pt-6 border-t border-slate-700/50">
                <div className="text-center">
                    <p className="text-sm font-semibold">Answer Time</p>
                    <p className="font-mono text-xl text-white tracking-wider">{formatTime(answerTime)}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm">Total Time</p>
                    <p className="font-mono text-lg text-slate-300 tracking-wider">{formatTime(totalTime)}</p>
                </div>
            </div>
            <div className="hidden md:block text-center text-slate-400 mt-auto pt-6">
                <p className="font-bold text-lg text-white">AI Mock Interview</p>
                <p className="text-sm">Proctoring Enabled</p>
            </div>
        </div>

        <div className="flex-1 flex flex-col p-4 sm:p-6">
            <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col justify-between">
                <div>
                    <div className="w-full p-4 mb-6">
                        <p className="text-sky-600 font-semibold text-center text-lg">Question {currentQuestionIndex + 1} of {session.questions.length}</p>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2 max-w-lg mx-auto">
                            <div className="bg-sky-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    
                    <div className="w-full bg-white p-8 rounded-2xl shadow-lg flex items-center justify-center min-h-[200px] mb-6">
                        <h2 key={currentQuestionIndex} className="text-2xl md:text-3xl font-semibold text-slate-700 text-center animate-[fade-in-up_0.5s_ease-out]">
                            {session.questions[currentQuestionIndex]}
                        </h2>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 max-w-3xl mx-auto w-full min-h-[120px] overflow-y-auto">
                        <p className="text-slate-500 italic">{transcript || "Your transcribed answer will appear here..."}</p>
                    </div>
                </div>

                <div className="w-full max-w-3xl mx-auto p-4 sticky bottom-0 bg-slate-50/80 backdrop-blur-sm rounded-t-xl">
                    <div className="flex items-center justify-center space-x-4">
                        <button onClick={handleRecordingAction} disabled={isProcessing} aria-label={buttonProps.label}
                            className={`relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 shadow-xl focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-slate-50 ${buttonProps.className}`}>
                            {recordingState === 'recording' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>}
                            {buttonProps.icon}
                        </button>
                        
                        <button onClick={handleSaveDraft} disabled={isProcessing || recordingState === 'recording'}
                            className="bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-slate-600 font-bold p-4 rounded-full transition-transform transform hover:scale-105 shadow-lg flex items-center space-x-2">
                             <SaveIcon className="w-6 h-6" />
                             <span>Save Draft</span>
                        </button>

                        <button onClick={handleNextQuestion} disabled={isProcessing || recordingState === 'recording'}
                            className="bg-slate-700 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-full transition-transform transform hover:scale-105 shadow-lg">
                            {isProcessing ? 'Processing...' : (currentQuestionIndex === session.questions.length - 1 ? 'Finish & Evaluate' : 'Next Question')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Interview;