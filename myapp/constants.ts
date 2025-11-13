export const DIFFICULTIES: string[] = ['Easy', 'Medium', 'Hard', 'Expert'];

export const ROLES_CATEGORIZED: Record<string, string[]> = {
  'Software & Tech Roles': [
    'Software Engineer',
    'Full Stack Developer',
    'Frontend Developer (React, Angular, Vue)',
    'Backend Developer (Node.js, Django, Spring Boot)',
    'Python Developer',
    'Java Developer',
    'DevOps Engineer',
    'Machine Learning Engineer',
    'Data Scientist',
    'Data Analyst',
    'AI Research Engineer',
    'Cloud Engineer (AWS / Azure / GCP)',
    'Cybersecurity Analyst',
    'Mobile App Developer (Flutter / React Native)',
    'QA Engineer / Test Automation Engineer',
    'UI/UX Designer',
    'Game Developer',
    'Embedded Systems Engineer',
  ],
  'Management & Product Roles': [
    'Product Manager',
    'Project Manager',
    'Business Analyst',
    'Scrum Master',
    'Technical Program Manager',
    'Product Designer',
  ],
  'Business & Operations Roles': [
    'Marketing Manager',
    'Digital Marketing Executive',
    'Operations Manager',
    'HR Manager',
    'Talent Acquisition Specialist',
    'Sales Executive',
    'Customer Success Manager',
  ],
  'Finance & Data Roles': [
    'Financial Analyst',
    'Investment Analyst',
    'Accountant',
    'Risk & Compliance Officer',
    'Data Engineer',
  ],
  'Student & Entry-Level Roles': [
    'Intern (General / Tech / Marketing / HR / Finance)',
    'Graduate Trainee Engineer',
    'Junior Developer',
    'Research Assistant',
  ],
  'Specialized AI & Data Roles': [
    'NLP Engineer',
    'Computer Vision Engineer',
    'Generative AI Engineer',
    'Prompt Engineer',
    'AI Ethics & Policy Analyst',
  ],
};

// v2.0.0 Constants

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_interview',
    name: 'First Steps',
    description: 'Complete your first mock interview',
    icon: '🎯',
    unlocked: false,
    rarity: 'common'
  },
  {
    id: 'perfect_score',
    name: 'Perfectionist',
    description: 'Score 100/100 in an interview',
    icon: '⭐',
    unlocked: false,
    rarity: 'legendary'
  },
  {
    id: 'week_streak',
    name: 'Consistent Learner',
    description: 'Practice for 7 days in a row',
    icon: '🔥',
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'ten_interviews',
    name: 'Interview Veteran',
    description: 'Complete 10 mock interviews',
    icon: '🏆',
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'all_difficulties',
    name: 'Challenge Master',
    description: 'Complete interviews at all difficulty levels',
    icon: '💎',
    unlocked: false,
    rarity: 'epic'
  }
];

export const INTERVIEW_MODES: InterviewMode[] = [
  {
    id: 'technical',
    name: 'Technical Interview',
    description: 'Coding challenges and algorithmic problems',
    icon: '💻',
    features: ['Code Editor', 'Test Cases', 'Syntax Highlighting']
  },
  {
    id: 'behavioral',
    name: 'Behavioral Interview',
    description: 'STAR method questions and soft skills',
    icon: '💬',
    features: ['STAR Framework', 'Example Stories', 'Communication Tips']
  },
  {
    id: 'hr_round',
    name: 'HR Round',
    description: 'Company culture fit and general questions',
    icon: '🤝',
    features: ['Culture Fit', 'Salary Discussion', 'Company Research']
  },
  {
    id: 'system_design',
    name: 'System Design',
    description: 'Architecture and scalability questions',
    icon: '🏗️',
    features: ['Whiteboard', 'Diagram Tools', 'Scalability Focus']
  },
  {
    id: 'speed_challenge',
    name: 'Speed Interview',
    description: 'Quick-fire questions to test response time',
    icon: '⚡',
    features: ['Time Pressure', 'Quick Thinking', 'Rapid Response']
  },
  {
    id: 'anxiety_friendly',
    name: 'Anxiety-Friendly Mode',
    description: 'Supportive environment with extra time',
    icon: '🌟',
    features: ['Extended Time', 'Calming UI', 'Positive Reinforcement']
  }
];

export const AVATAR_CONFIGS: AvatarConfig[] = [
  {
    id: 'professional',
    name: 'Professional Pete',
    personality: 'professional',
    appearance: {
      color: '#1E40AF',
      style: 'formal'
    }
  },
  {
    id: 'friendly',
    name: 'Friendly Fiona',
    personality: 'friendly',
    appearance: {
      color: '#10B981',
      style: 'casual'
    }
  },
  {
    id: 'technical',
    name: 'Technical Tom',
    personality: 'technical',
    appearance: {
      color: '#7C3AED',
      style: 'tech'
    }
  }
];

export const SKILL_TREE = {
  technical: [
    'Data Structures',
    'Algorithms',
    'System Design',
    'Database Design',
    'API Development'
  ],
  communication: [
    'Clear Articulation',
    'Active Listening',
    'Body Language',
    'Storytelling',
    'Conciseness'
  ],
  behavioral: [
    'Problem Solving',
    'Leadership',
    'Teamwork',
    'Conflict Resolution',
    'Time Management'
  ]
};

export const XP_LEVELS = [
  { level: 1, xpRequired: 0 },
  { level: 2, xpRequired: 100 },
  { level: 3, xpRequired: 250 },
  { level: 4, xpRequired: 500 },
  { level: 5, xpRequired: 1000 },
  { level: 6, xpRequired: 2000 },
  { level: 7, xpRequired: 3500 },
  { level: 8, xpRequired: 5500 },
  { level: 9, xpRequired: 8000 },
  { level: 10, xpRequired: 12000 }
];

export const ANALYSIS_THRESHOLDS = {
  voiceClarity: {
    excellent: 90,
    good: 75,
    fair: 60,
    poor: 0
  },
  speechRate: {
    optimal: { min: 130, max: 170 },
    acceptable: { min: 110, max: 190 }
  },
  eyeContact: {
    excellent: 80,
    good: 60,
    fair: 40,
    poor: 0
  },
  confidenceLevel: {
    high: 75,
    medium: 50,
    low: 0
  }
};

export const FILLER_WORDS = [
  'um', 'uh', 'like', 'you know', 'actually', 'basically', 
  'literally', 'sort of', 'kind of', 'I mean', 'right', 'so'
];

import type { Achievement, InterviewMode, AvatarConfig } from './types';