import type { InterviewSession, InProgressInterview } from '../types';

const SESSIONS_KEY = 'ai_mock_interview_sessions';
const DRAFT_KEY = 'ai_mock_interview_draft';

export function loadSessions(): InterviewSession[] {
  try {
    const sessionsJson = localStorage.getItem(SESSIONS_KEY);
    if (!sessionsJson) return [];
    const sessions = JSON.parse(sessionsJson) as InterviewSession[];
    // Sort by timestamp descending (newest first)
    return sessions.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Failed to load sessions from localStorage", error);
    return [];
  }
}

export function saveSession(session: InterviewSession): void {
  try {
    const sessions = loadSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    if (existingIndex > -1) {
      sessions[existingIndex] = session;
    } else {
      // Add to the beginning to keep it sorted
      sessions.unshift(session);
    }
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error("Failed to save session to localStorage", error);
  }
}


export function deleteSession(sessionId: string): void {
  try {
    let sessions = loadSessions();
    sessions = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error("Failed to delete session from localStorage", error);
  }
}

export function saveDraft(draft: InProgressInterview): void {
    try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (error) {
        console.error("Failed to save draft to localStorage", error);
    }
}

export function loadDraft(): InProgressInterview | null {
    try {
        const draftJson = localStorage.getItem(DRAFT_KEY);
        if (!draftJson) return null;
        return JSON.parse(draftJson) as InProgressInterview;
    } catch (error) {
        console.error("Failed to load draft from localStorage", error);
        return null;
    }
}

export function clearDraft(): void {
    try {
        localStorage.removeItem(DRAFT_KEY);
    } catch (error) {
        console.error("Failed to clear draft from localStorage", error);
    }
}
