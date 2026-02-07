import React from 'react';

const MANUAL_EXAMPLE = `Subject: Latency Incident - Jan 15

Hi team,

So we had that latency thing today. Trading API was slow for a few hours. Users complained they couldn't trade.

We think it was a memory leak in the price service. We rolled back and it fixed it.

TODO:
- Fix the memory leak
- Maybe add better monitoring?
- Update load tests I guess

Let me know if you have questions.

- DevOps Team`;

const ATLAS_SECTIONS = {
  summary: "On January 15, 2026, a memory leak in the price aggregation service caused API response times to spike from 50-100ms to over 5 seconds during peak trading hours, impacting trade execution for approximately 2 hours 45 minutes. The incident was resolved by rolling back to the previous stable version.",
  rootCause: "An unbounded cache in the price aggregation service grew indefinitely under sustained high load, consuming available memory and causing garbage collection pauses that degraded API response times.",
  actionItems: [
    { priority: 'URGENT', text: 'Implement bounded cache with LRU eviction policy', owner: 'Backend Team' },
    { priority: 'HIGH', text: 'Add memory usage alerting thresholds to monitoring', owner: 'DevOps' },
    { priority: 'HIGH', text: 'Expand load test suite to include sustained high-load scenarios', owner: 'QA Team' },
    { priority: 'MEDIUM', text: 'Add circuit breaker pattern for price aggregation service', owner: 'Backend Team' },
  ]
};

function ComparisonView({ onClose }) {
  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manual vs ATLAS</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Same incident, dramatically different output</p>
        </div>
        <button onClick={onClose} className="btn-secondary text-sm">
          Close
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manual Side */}
        <div className="border-2 border-red-200 dark:border-red-800 rounded-xl overflow-hidden">
          <div className="bg-red-50 dark:bg-red-900/20 px-4 py-3 border-b border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="font-semibold text-red-700 dark:text-red-400">Manual Post-Mortem</span>
            </div>
            <div className="flex gap-4 mt-2 text-xs text-red-600 dark:text-red-400">
              <span>~2-4 hours to write</span>
              <span>Inconsistent format</span>
              <span>Vague action items</span>
            </div>
          </div>
          <div className="p-4">
            <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-mono leading-relaxed">
              {MANUAL_EXAMPLE}
            </pre>
          </div>
        </div>

        {/* ATLAS Side */}
        <div className="border-2 border-green-200 dark:border-green-800 rounded-xl overflow-hidden">
          <div className="bg-green-50 dark:bg-green-900/20 px-4 py-3 border-b border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-semibold text-green-700 dark:text-green-400">ATLAS Post-Mortem</span>
            </div>
            <div className="flex gap-4 mt-2 text-xs text-green-600 dark:text-green-400">
              <span>~20 seconds</span>
              <span>SRE-standard format</span>
              <span>Prioritized actions</span>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Executive Summary</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{ATLAS_SECTIONS.summary}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Root Cause</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{ATLAS_SECTIONS.rootCause}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Action Items</h4>
              <div className="space-y-2">
                {ATLAS_SECTIONS.actionItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0 ${
                      item.priority === 'URGENT' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      item.priority === 'HIGH' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {item.priority}
                    </span>
                    <div>
                      <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
                      <span className="text-gray-400 dark:text-gray-500 ml-1">- {item.owner}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-lg font-bold text-atlas-600">20s</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">vs 2-4 hours</div>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-lg font-bold text-atlas-600">7 sections</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">vs unstructured email</div>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-lg font-bold text-atlas-600">4 action items</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">vs vague TODOs</div>
        </div>
      </div>
    </div>
  );
}

export default ComparisonView;
