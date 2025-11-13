/**
 * Code Interview Component (Simplified)
 * Code editor simulation for technical interviews
 */

import React, { useState } from 'react';

interface CodeInterviewProps {
  question?: string;
  onCodeSubmit?: (code: string, language: string) => void;
}

const CodeInterview: React.FC<CodeInterviewProps> = ({ 
  question = 'Write a function to reverse a string',
  onCodeSubmit
}) => {
  const [code, setCode] = useState('// Write your code here\n\n');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  
  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Running code...');
    
    // Simulate code execution
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setOutput(`Output:\n✓ Test case 1: Passed\n✓ Test case 2: Passed\n✓ Test case 3: Passed\n\nAll tests passed!`);
    setIsRunning(false);
  };
  
  const handleSubmit = () => {
    if (onCodeSubmit) {
      onCodeSubmit(code, language);
    }
    alert('Code submitted successfully!');
  };
  
  return (
    <div className="code-interview bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">💻 Code Interview</h2>
      
      {/* Question */}
      <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <h3 className="font-semibold text-blue-800 mb-2">Problem Statement:</h3>
        <p className="text-slate-700">{question}</p>
      </div>
      
      {/* Language Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Programming Language:
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="typescript">TypeScript</option>
        </select>
      </div>
      
      {/* Code Editor (Simplified) */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Code Editor:
        </label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-64 p-4 font-mono text-sm bg-slate-900 text-green-400 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Write your code here..."
          spellCheck={false}
        />
      </div>
      
      {/* Actions */}
      <div className="flex space-x-3 mb-4">
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {isRunning ? 'Running...' : '▶ Run Code'}
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Submit Solution
        </button>
      </div>
      
      {/* Output */}
      {output && (
        <div className="p-4 bg-slate-900 text-green-400 font-mono text-sm rounded-lg whitespace-pre-wrap">
          {output}
        </div>
      )}
      
      {/* Tips */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <h3 className="font-semibold text-purple-800 mb-2">💡 Coding Tips</h3>
        <ul className="text-sm text-slate-700 space-y-1">
          <li>• Think out loud while coding</li>
          <li>• Start with a brute force solution, then optimize</li>
          <li>• Consider edge cases</li>
          <li>• Test your code with multiple inputs</li>
          <li>• Explain time and space complexity</li>
        </ul>
      </div>
    </div>
  );
};

export default CodeInterview;
