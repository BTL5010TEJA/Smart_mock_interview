/**
 * Resume Parser Component (Simplified)
 * File upload and basic resume analysis
 */

import React, { useState } from 'react';
import type { ResumeData } from '../types';

interface ResumeParserProps {
  onResumeAnalyzed?: (data: ResumeData) => void;
}

const ResumeParser: React.FC<ResumeParserProps> = ({ onResumeAnalyzed }) => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsAnalyzing(true);
    
    // Simulate file processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock resume data
    const mockData: ResumeData = {
      fileName: file.name,
      uploadDate: Date.now(),
      extractedText: 'Sample resume text...',
      skills: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
      experience: [
        { title: 'Software Engineer', company: 'Tech Corp', duration: '2020-2023' },
        { title: 'Junior Developer', company: 'StartUp Inc', duration: '2018-2020' }
      ],
      education: [
        { degree: 'B.S. Computer Science', institution: 'University', year: '2018' }
      ],
      suggestedQuestions: [
        'Tell me about your experience with React and TypeScript',
        'Describe a challenging project you worked on at Tech Corp',
        'How do you approach learning new technologies?',
        'What AWS services have you worked with?'
      ]
    };
    
    setResumeData(mockData);
    setIsAnalyzing(false);
    
    if (onResumeAnalyzed) {
      onResumeAnalyzed(mockData);
    }
  };
  
  return (
    <div className="resume-parser bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">📄 Resume Parser</h2>
      
      {/* File Upload */}
      <div className="mb-6">
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-12 h-12 mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mb-2 text-sm text-slate-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500">PDF, DOC, DOCX (MAX. 10MB)</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
          />
        </label>
      </div>
      
      {/* Analysis Progress */}
      {isAnalyzing && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
            <p className="text-blue-700 font-medium">Analyzing your resume...</p>
          </div>
        </div>
      )}
      
      {/* Analysis Results */}
      {resumeData && !isAnalyzing && (
        <div className="space-y-4">
          {/* File Info */}
          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
            <p className="font-semibold text-green-800">✓ Resume Uploaded Successfully</p>
            <p className="text-sm text-slate-600 mt-1">{resumeData.fileName}</p>
          </div>
          
          {/* Extracted Skills */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">🎯 Identified Skills</h3>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          {/* Experience */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">💼 Experience</h3>
            <div className="space-y-2">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-semibold text-slate-800">{exp.title}</p>
                  <p className="text-sm text-slate-600">{exp.company} • {exp.duration}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Suggested Questions */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">💡 Suggested Interview Questions</h3>
            <div className="space-y-2">
              {resumeData.suggestedQuestions.map((question, index) => (
                <div key={index} className="p-3 bg-purple-50 border-l-4 border-purple-400 rounded">
                  <p className="text-sm text-slate-700">{question}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeParser;
