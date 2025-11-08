import React from 'react';

export const GestureIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M18 15V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v6" />
    <path d="M11 15H8" />
    <path d="M15 15h-1" />
    <path d="M2 15h4" />
    <path d="M22 15h-4" />
    <path d="M5 15l-1 5" />
    <path d="M19 15l1 5" />
  </svg>
);
