import React from 'react';

export const ConcisenessIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="m17 3-5 5-5-5" />
    <path d="m17 21-5-5-5 5" />
    <path d="M7 12a5 5 0 1 0 10 0 5 5 0 1 0-10 0" />
  </svg>
);
