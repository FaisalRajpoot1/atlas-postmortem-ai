import React, { useState, useEffect } from 'react';

const LOADING_MESSAGES = [
  'Analyzing incident data...',
  'Identifying root cause patterns...',
  'Evaluating impact assessment...',
  'Generating timeline analysis...',
  'Formulating action items...',
  'Reviewing contributing factors...',
  'Compiling executive summary...',
  'Finalizing post-mortem report...',
];

function LoadingSpinner() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card p-12 flex flex-col items-center justify-center animate-fade-in">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-20 h-20 rounded-full border-4 border-atlas-100"></div>

        {/* Spinning ring */}
        <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-atlas-600 animate-spin"></div>

        {/* Inner icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-atlas-600 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
      </div>

      <div className="mt-8 text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          AI Analysis in Progress
        </h3>
        <p className="mt-2 text-atlas-600 font-medium animate-pulse">
          {LOADING_MESSAGES[messageIndex]}
        </p>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          This typically takes 10-30 seconds
        </p>
      </div>

      {/* Progress dots */}
      <div className="mt-6 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-atlas-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default LoadingSpinner;
