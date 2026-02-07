import React, { useState } from 'react';
import { getHistory, clearHistory } from '../utils/storage';

function HistoryPanel({ onLoadReport }) {
  const [history, setHistory] = useState(() => getHistory());
  const [expanded, setExpanded] = useState(false);

  if (history.length === 0) return null;

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  const getSeverityColor = (severity) => {
    const colors = {
      P0: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      P1: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      P2: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      P3: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    };
    return colors[severity] || colors.P2;
  };

  const displayItems = expanded ? history : history.slice(0, 3);

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-atlas-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Analyses</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">({history.length})</span>
        </div>
        <button
          onClick={handleClear}
          className="text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-2">
        {displayItems.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onLoadReport(entry)}
            className="w-full text-left flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-atlas-300 dark:hover:border-atlas-600 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${getSeverityColor(entry.severity)}`}>
                {entry.severity}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {entry.title}
              </span>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2">
              {new Date(entry.generatedAt).toLocaleDateString()}
            </span>
          </button>
        ))}
      </div>

      {history.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm text-atlas-600 hover:text-atlas-700 dark:text-atlas-400 font-medium"
        >
          {expanded ? 'Show less' : `Show all ${history.length}`}
        </button>
      )}
    </div>
  );
}

export default HistoryPanel;
