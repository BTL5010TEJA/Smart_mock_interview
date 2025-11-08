import React from 'react';

export const BodyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <circle cx="12" cy="5" r="3" />
    <path d="M12 8v5" />
    <path d="M12 13a4 4 0 0 0-4 4v2h8v-2a4 4 0 0 0-4-4z" />
  </svg>
);
