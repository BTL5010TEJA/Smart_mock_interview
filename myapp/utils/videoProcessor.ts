/**
 * Video Processing Module
 * Handles webcam stream management, frame capture, and video recording
 */

/**
 * Start webcam stream
 * @param videoElement - HTML video element to attach stream
 * @returns MediaStream object
 */
export async function startWebcamStream(videoElement: HTMLVideoElement): Promise<MediaStream | null> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user'
      },
      audio: false
    });
    
    videoElement.srcObject = stream;
    return stream;
  } catch (error) {
    console.error('Failed to start webcam stream:', error);
    return null;
  }
}

/**
 * Stop webcam stream
 * @param stream - MediaStream to stop
 */
export function stopWebcamStream(stream: MediaStream | null): void {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
}

/**
 * Capture a frame from video stream
 * @param videoElement - HTML video element
 * @returns Base64 encoded image data
 */
export function captureFrame(videoElement: HTMLVideoElement): string {
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.8);
}

/**
 * Analyze frame for body language indicators
 * This is a placeholder - in production would use ML models
 * @param frameData - Base64 encoded image
 * @returns Analysis results
 */
export async function analyzeBodyLanguage(frameData: string): Promise<{
  posture: string;
  score: number;
}> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Simulated analysis
  const postures = ['Excellent', 'Good', 'Fair', 'Needs Improvement'];
  const randomPosture = postures[Math.floor(Math.random() * postures.length)];
  const score = 60 + Math.random() * 35;
  
  return {
    posture: randomPosture,
    score: Math.round(score)
  };
}

/**
 * Detect eye contact from video frames
 * @param frameData - Base64 encoded image
 * @returns Eye contact percentage
 */
export async function detectEyeContact(frameData: string): Promise<number> {
  // Simulate processing
  await new Promise(resolve => setTimeout(resolve, 50));
  
  // Simulated eye contact detection (60-95%)
  return 60 + Math.random() * 35;
}

/**
 * Analyze facial expressions
 * @param frameData - Base64 encoded image
 * @returns Detected emotion and confidence
 */
export async function analyzeFacialExpression(frameData: string): Promise<{
  emotion: string;
  confidence: number;
}> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const emotions = ['Confident', 'Nervous', 'Calm', 'Engaged', 'Thoughtful'];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  
  return {
    emotion: randomEmotion,
    confidence: 0.7 + Math.random() * 0.25
  };
}

/**
 * Start video recording
 * @param stream - MediaStream to record
 * @returns MediaRecorder instance
 */
export function startVideoRecording(stream: MediaStream): MediaRecorder | null {
  try {
    const options = { mimeType: 'video/webm;codecs=vp9' };
    const mediaRecorder = new MediaRecorder(stream, options);
    
    const chunks: Blob[] = [];
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    
    mediaRecorder.start(1000); // Collect data every second
    
    return mediaRecorder;
  } catch (error) {
    console.error('Failed to start recording:', error);
    return null;
  }
}

/**
 * Stop video recording and get blob
 * @param recorder - MediaRecorder instance
 * @returns Promise with recorded video blob
 */
export async function stopVideoRecording(recorder: MediaRecorder): Promise<Blob> {
  return new Promise((resolve) => {
    const chunks: Blob[] = [];
    
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(blob);
    };
    
    recorder.stop();
  });
}

/**
 * Process video for analysis
 * Extract frames at regular intervals for ML processing
 * @param videoBlob - Recorded video blob
 * @param intervalMs - Frame extraction interval in milliseconds
 * @returns Array of frame data
 */
export async function processVideoForAnalysis(
  videoBlob: Blob,
  intervalMs: number = 1000
): Promise<string[]> {
  // This is a simplified version
  // In production, would use a video processing library
  const frames: string[] = [];
  
  // Create a video element to process the blob
  const video = document.createElement('video');
  video.src = URL.createObjectURL(videoBlob);
  
  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      const duration = video.duration;
      const numFrames = Math.floor(duration * 1000 / intervalMs);
      
      // Simulate frame extraction
      for (let i = 0; i < numFrames; i++) {
        frames.push(`frame_${i}`);
      }
      
      URL.revokeObjectURL(video.src);
      resolve(frames);
    };
  });
}

/**
 * Calculate overall video analysis score
 * @param metrics - Various video metrics
 * @returns Combined score (0-100)
 */
export function calculateVideoScore(metrics: {
  eyeContact: number;
  posture: number;
  expressions: number;
}): number {
  const weights = {
    eyeContact: 0.4,
    posture: 0.35,
    expressions: 0.25
  };
  
  const score = 
    metrics.eyeContact * weights.eyeContact +
    metrics.posture * weights.posture +
    metrics.expressions * weights.expressions;
  
  return Math.round(Math.max(0, Math.min(100, score)));
}
