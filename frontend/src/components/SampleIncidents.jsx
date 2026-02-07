import React, { useState, useEffect } from 'react';
import { getSampleIncidents } from '../utils/api';

function SampleIncidents({ onLoadSample }) {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    try {
      const data = await getSampleIncidents();
      setSamples(data.samples || []);
    } catch (err) {
      setError('Failed to load sample incidents');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = (sample) => {
    setLoadingId(sample.id);
    setTimeout(() => {
      onLoadSample(sample);
      setLoadingId(null);
    }, 300);
  };

  const getSeverityColor = (severity) => {
    const colors = {
      P0: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
      P1: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
      P2: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
      P3: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    };
    return colors[severity] || colors.P2;
  };

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-atlas-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sample Incidents</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg animate-pulse">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-atlas-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sample Incidents</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">Click to load</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {samples.map((sample) => (
          <button
            key={sample.id}
            onClick={() => handleLoadSample(sample)}
            disabled={loadingId === sample.id}
            className="text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-atlas-300 dark:hover:border-atlas-600 hover:shadow-sm transition-all duration-200 disabled:opacity-50"
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">{sample.title}</h4>
              <span className={`px-2 py-0.5 rounded text-xs font-medium border flex-shrink-0 ${getSeverityColor(sample.severity)}`}>
                {sample.severity}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
              {sample.description?.substring(0, 120)}...
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Duration: {sample.duration}
            </p>
            {loadingId === sample.id && (
              <div className="mt-2 flex items-center gap-2 text-atlas-600 text-sm">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading...
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SampleIncidents;
