import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div 
        className="w-4 h-4 bg-sky-500 rounded-full animate-bounce-delay" 
        style={{ animationDelay: '-0.32s' }}
      ></div>
      <div 
        className="w-4 h-4 bg-sky-500 rounded-full animate-bounce-delay"
        style={{ animationDelay: '-0.16s' }}
      ></div>
      <div 
        className="w-4 h-4 bg-sky-500 rounded-full animate-bounce-delay"
      ></div>
    </div>
  );
};