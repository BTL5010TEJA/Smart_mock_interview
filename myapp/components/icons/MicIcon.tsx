import React from 'react';

interface MicIconProps extends React.SVGProps<SVGSVGElement> {
  isRecording?: boolean;
}

export const MicIcon: React.FC<MicIconProps> = ({ isRecording = false, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-10 h-10 text-white"
    {...props}
  >
    <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
    <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.75 6.75 0 11-13.5 0v-1.5A.75.75 0 016 10.5zM12 21a.75.75 0 01-.75-.75v-2.69a.75.75 0 011.5 0v2.69a.75.75 0 01-.75.75z" />
  </svg>
);