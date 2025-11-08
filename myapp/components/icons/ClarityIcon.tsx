import React from 'react';

export const ClarityIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="m13 11 3-3-3-3" />
    <path d="M8 11h8" />
    <path d="m13 20 3-3-3-3" />
    <path d="M8 20h8" />
  </svg>
);
