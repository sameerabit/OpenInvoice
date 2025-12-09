
import React from 'react';

const Logo: React.FC = () => (
  <svg width="200" height="60" viewBox="0 0 200 60" className="inline-block">
    <defs>
      <linearGradient id="metal-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#d1d5db', stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: '#9ca3af', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#d1d5db', stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="red-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#f87171', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#dc2626', stopOpacity: 1 }} />
      </linearGradient>
    </defs>

    {/* L as Wrench */}
    <text x="5" y="40" fontFamily="Arial, sans-serif" fontSize="40" fontWeight="bold" fill="url(#metal-gradient)" transform="scale(1, 1.2) translate(0, -5)">L</text>
    <rect x="2" y="10" width="8" height="3" fill="url(#metal-gradient)" />
    <rect x="2" y="38" width="8" height="3" fill="url(#metal-gradient)" />
    
    {/* A as Spark Plug/Gear */}
    <circle cx="45" cy="30" r="8" fill="none" stroke="url(#metal-gradient)" strokeWidth="2" />
    <text x="35" y="40" fontFamily="Arial, sans-serif" fontSize="40" fontWeight="bold" fill="url(#blue-gradient)">A</text>

    {/* R as Spring */}
    <text x="65" y="40" fontFamily="Arial, sans-serif" fontSize="40" fontWeight="bold" fill="url(#blue-gradient)">R</text>
    <path d="M 67 15 C 72 15, 72 20, 67 20 S 62 20, 62 25 S 67 25, 67 30 S 62 30, 62 35" fill="none" stroke="url(#red-gradient)" strokeWidth="3" strokeLinecap="round" />
    
    {/* A as Tire */}
    <text x="95" y="40" fontFamily="Arial, sans-serif" fontSize="40" fontWeight="bold" fill="url(#metal-gradient)">A</text>
    <path d="M 120 15 A 15 25 0 0 1 120 45" fill="none" stroke="#333" strokeWidth="6" />
    <path d="M 120 18 L 115 22 M 120 25 L 115 29 M 120 32 L 115 36 M 120 39 L 115 43" fill="none" stroke="#444" strokeWidth="1" />
    
    <text x="10" y="55" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#0c4a6e">Auto Services</text>
  </svg>
);

export default Logo;
