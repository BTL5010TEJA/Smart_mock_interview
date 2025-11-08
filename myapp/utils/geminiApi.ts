import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import type { InterviewConfig, InterviewSession } from '../types';

function getAiClient(): GoogleGenAI {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API_KEY environment variable not set.");
        throw new Error("API_KEY environment variable not set. Please set it up in your environment configuration.");
    }
    return new GoogleGenAI({ apiKey });
}

export async function generateInterviewQuestions(config: InterviewConfig): Promise<string[]> {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate 5 interview questions for a ${config.difficulty} ${config.role} position.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        questions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                        },
                    },
                },
            },
        });

        const responseJson = JSON.parse(response.text);
        const questions = responseJson.questions;

        if (!questions || questions.length === 0) {
            throw new Error('API returned no questions.');
        }
        return questions;
    } catch (error) {
        console.error('Error generating interview questions:', error);
        throw new Error('Failed to generate interview questions. Please check the console for details.');
    }
}

export async function evaluateInterview(
    session: InterviewSession,
    answers: string[],
    snapshots: { [questionIndex: number]: string[] },
    malpracticeLogs: { [questionIndex: number]: string[] }
): Promise<GenerateContentResponse> {
    const hasMalpractice = Object.values(malpracticeLogs).some(logs => logs.length > 0 && logs.some(log => !log.includes('background noise')));
    const hasAudioIssues = Object.values(malpracticeLogs).some(logs => logs.some(log => log.includes('background noise')));
      
    let malpracticeLogText = 'No malpractice was detected.';
    if (hasMalpractice || hasAudioIssues) {
        malpracticeLogText = `The system logged the following events: ${JSON.stringify(malpracticeLogs, null, 2)}.
      - Visual malpractice events (like phone use or suspicious gaze) MUST be addressed in the 'malpracticeReport' section. Frame it constructively.
      - Audio disturbances ('Loud background noise detected') should be mentioned as a point for improvement in the 'improvements' section (e.g., 'Finding a quiet space for your interview can help you stay focused and appear more professional.').`
    }

    const systemInstruction = `You are an uplifting and motivational AI interview coach. Your primary goal is to empower the user, build their confidence, and provide actionable feedback for a ${session.config.difficulty} ${session.config.role} role. Your entire tone must be incredibly encouraging and positive.

      **Core Principles:**
      1.  **Celebrate Strengths:** Start with what the candidate did well. Be specific and use examples from their answers to make the praise genuine and impactful.
      2.  **Frame "Weaknesses" as "Opportunities":** Populate the 'weaknesses' field, but reframe the content as "Areas to Polish." The language must be forward-looking and focused on potential. For example, instead of "Your answer was rambling," say "You have great ideas! Let's work on structuring them concisely to make them even more impactful."
      3.  **Actionable & Inspiring Improvements:** For the 'improvements' field, provide clear, actionable tips. End on a high note with phrases like, "Come on, improve these areas and nobody can beat you in an interview!" or "With a little practice here, you'll be unstoppable!"
      4.  **Holistic View:** Consider their transcribed answers and body language from the snapshots to provide a complete picture.

      **Input Data Provided:**
      -   Interview questions.
      -   Transcribed candidate answers.
      -   A series of body language snapshots taken during each answer.
      -   Malpractice & Disturbance Logs: ${malpracticeLogText}

      **Required JSON Output Structure:**
      Provide your entire response as a single JSON object matching the schema below. Do not include any text outside of the JSON structure.`;
    
    const parts: ({ text: string } | { inlineData: { mimeType: string; data: string; } })[] = [
        { text: `Begin Evaluation:\n` },
    ];

    session.questions.forEach((question, index) => {
        parts.push({ text: `\n--- Question ${index + 1}: ${question} ---\n` });
        parts.push({ text: `Candidate's Answer: "${answers[index] || '(No answer provided)'}"\n` });
        parts.push({ text: `Body Language Snapshots during answer:\n` });
        if (snapshots[index]?.length > 0) {
            snapshots[index].forEach(base64Image => {
                parts.push({
                    inlineData: {
                        mimeType: 'image/jpeg',
                        data: base64Image,
                    },
                });
            });
        } else {
            parts.push({ text: `(No snapshots available)\n` });
        }
    });

    try {
        const ai = getAiClient();
        return await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts },
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        criteria: {
                            type: Type.ARRAY,
                            description: "Breakdown of scores across key areas.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING, description: "e.g., 'Technical Depth', 'Communication', 'Problem-Solving'." },
                                    score: { type: Type.NUMBER, description: "Score from 0 to 5 for this criterion." },
                                    maxScore: { type: Type.NUMBER, description: "Always 5." },
                                    reasoning: { type: Type.STRING, description: "Brief, specific justification for the score, framed positively." },
                                }
                            }
                        },
                        strengths: { type: Type.ARRAY, description: "2-3 specific, positive points. Use examples from their answers.", items: { type: Type.STRING } },
                        weaknesses: { type: Type.ARRAY, description: "2-3 areas framed as opportunities to polish. Use encouraging language.", items: { type: Type.STRING } },
                        improvements: { type: Type.ARRAY, description: "Actionable, inspiring tips for improvement, directly linked to weaknesses.", items: { type: Type.STRING } },
                        bodyLanguageAnalysis: {
                            type: Type.OBJECT,
                            description: "Analysis of non-verbal cues from the image snapshots.",
                            properties: {
                                posture: { type: Type.STRING, description: "Comment on their posture (e.g., upright, slouched)." },
                                eyeContact: { type: Type.STRING, description: "Analyze gaze. Are they looking at the camera or away? (e.g., 'Good, mostly focused on the camera', 'Often looked away')."},
                                gestures: { type: Type.STRING, description: "Note use of hand gestures (e.g., 'Used hands effectively to explain points', 'Appeared stiff')." },
                                overallSummary: { type: Type.STRING, description: "A holistic summary of their non-verbal communication and its impact." }
                            }
                        },
                        verbalAnalysis: {
                            type: Type.OBJECT,
                            description: "Analysis of verbal delivery based on the transcript.",
                            properties: {
                               clarity: { type: Type.STRING, description: "Assess the clarity and structure of their sentences."},
                               conciseness: { type: Type.STRING, description: "Did they answer directly or ramble?" },
                               fillerWords: { type: Type.STRING, description: "Comment on apparent use of filler words like 'um', 'uh', 'like' based on transcript flow." },
                               overallSummary: { type: Type.STRING, description: "A summary of their verbal communication style." }
                            }
                        },
                        ...(hasMalpractice && {
                          malpracticeReport: {
                              type: Type.OBJECT,
                              description: "ONLY include this object if malpractice was detected. Otherwise, omit it.",
                              properties: {
                                  summary: { type: Type.STRING, description: "A summary of the detected malpractice incidents."},
                                  impactOnScore: { type: Type.STRING, description: "Explain how this behavior can be perceived negatively and how to avoid it."}
                              }
                          }
                        })
                    }
                }
            },
        });
    } catch (error) {
        console.error('Error evaluating interview:', error);
        throw new Error('Failed to evaluate interview performance. Please check the console for details.');
    }
}

export async function analyzeFrameForMalpractice(base64Image: string): Promise<any> {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
                    { text: `You are a sophisticated AI proctor for a mock interview. Analyze this single webcam frame for malpractice. Your analysis must be strict to avoid false positives.

**Primary Goal: Malpractice Detection**
Analyze the following, in order of priority:
1.  **Other People:** Is there another person visible in the frame, or strong evidence of someone just off-camera (e.g., user is clearly talking to someone to the side)?
2.  **Unauthorized Devices:** Is a phone, tablet, or secondary screen clearly visible and in use? Is the user wearing a visible earpiece or headset that isn't for standard audio?
3.  **Suspicious Gaze (Cheating):** Is the user's gaze unnaturally averted, indicating they are reading from notes?
    - **CRITICAL:** Differentiate from normal thinking. People glance away to think. Flag this ONLY if the gaze is fixed, repetitive (like reading line by line), or directed downwards at a desk for an extended period in an unnatural way. A brief glance up or to the side is NOT malpractice.

**Secondary Goal: Delivery Feedback**
- If NO malpractice is detected, provide a brief, encouraging delivery tip (max 5 words) if applicable (e.g., "Looking confident!", "Great eye contact!"). Otherwise, leave it null.

**Response Rules:**
- Respond ONLY with a single JSON object matching the specified schema.
- If any malpractice is detected, provide a clear 'reason' and set 'deliveryFeedback' to null.` }
                ]
            },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        malpracticeDetected: { type: Type.BOOLEAN },
                        reason: { type: Type.STRING, description: "Reason for the highest-priority malpractice flag. Null if none." },
                        otherPerson: { type: Type.BOOLEAN },
                        deviceDetected: { type: Type.BOOLEAN },
                        suspiciousGaze: { type: Type.BOOLEAN },
                        deliveryFeedback: { type: Type.STRING, description: "A short, actionable delivery tip, or null." }
                    }
                }
            }
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error('Error analyzing frame for malpractice:', error);
        // Return null to avoid breaking the interview analysis loop.
        // The calling function will handle the lack of a response.
        return null;
    }
}