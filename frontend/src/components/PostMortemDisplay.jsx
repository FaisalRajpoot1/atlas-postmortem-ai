import React, { useState } from 'react';
import ExportButtons from './ExportButtons';
import InsightsPanel from './InsightsPanel';
import TimelineChart from './TimelineChart';

function PostMortemDisplay({ postMortem, incidentTitle, onReset }) {
  const severityClass = `severity-${postMortem.impact?.severity?.toLowerCase() || 'p2'}`;
  const confidence = postMortem.confidence_scores || {};

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {incidentTitle || 'Post-Mortem Report'}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${severityClass}`}>
                {postMortem.impact?.severity || 'P2'}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Generated {new Date(postMortem.generated_at).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={onReset} className="btn-secondary">
              New Analysis
            </button>
            <ExportButtons postMortem={postMortem} title={incidentTitle} />
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <Section title="Executive Summary" icon="clipboard" copyText={postMortem.executive_summary} confidence={confidence.executive_summary}>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{postMortem.executive_summary}</p>
      </Section>

      {/* Root Cause */}
      <Section title="Root Cause" icon="search" copyText={postMortem.root_cause} confidence={confidence.root_cause}>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{postMortem.root_cause}</p>
      </Section>

      {/* Contributing Factors */}
      {postMortem.contributing_factors?.length > 0 && (
        <Section title="Contributing Factors" icon="layers" copyText={postMortem.contributing_factors.join('\n')} confidence={confidence.contributing_factors}>
          <ul className="list-disc list-inside space-y-2">
            {postMortem.contributing_factors.map((factor, i) => (
              <li key={i} className="text-gray-700 dark:text-gray-300">{factor}</li>
            ))}
          </ul>
        </Section>
      )}

      {/* Timeline Chart (Visual) */}
      {postMortem.timeline?.length > 0 && (
        <TimelineChart timeline={postMortem.timeline} severity={postMortem.impact?.severity} />
      )}

      {/* Timeline (Text) */}
      {postMortem.timeline?.length > 0 && (
        <Section title="Timeline" icon="clock" copyText={postMortem.timeline.map(e => `${e.time}: ${e.event}`).join('\n')} confidence={confidence.timeline}>
          <div className="relative">
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
            <div className="space-y-4">
              {postMortem.timeline.map((entry, i) => {
                const phaseColors = {
                  detection: 'bg-red-500',
                  investigation: 'bg-yellow-500',
                  mitigation: 'bg-blue-500',
                  resolution: 'bg-green-500',
                  monitoring: 'bg-purple-500',
                };
                const dotColor = phaseColors[entry.phase] || 'bg-atlas-500';
                return (
                  <div key={i} className="flex gap-4 relative">
                    <div className={`w-4 h-4 rounded-full ${dotColor} border-2 border-white dark:border-gray-800 shadow z-10 mt-1`}></div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-atlas-600 dark:text-atlas-400 font-medium">
                          {entry.time}
                        </span>
                        {entry.phase && (
                          <span className={`text-xs px-1.5 py-0.5 rounded ${dotColor} text-white capitalize`}>
                            {entry.phase}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">{entry.event}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Section>
      )}

      {/* Impact Assessment */}
      <Section title="Impact Assessment" icon="alert" confidence={confidence.impact}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Affected Systems</h4>
            <div className="flex flex-wrap gap-2">
              {postMortem.impact?.affected_systems?.map((system, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300">
                  {system}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Severity</h4>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${severityClass}`}>
              {postMortem.impact?.severity || 'P2'}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">User Impact</h4>
            <p className="text-gray-700 dark:text-gray-300">{postMortem.impact?.user_impact}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Business Impact</h4>
            <p className="text-gray-700 dark:text-gray-300">{postMortem.impact?.business_impact}</p>
          </div>
        </div>
      </Section>

      {/* What Went Well */}
      {postMortem.what_went_well?.length > 0 && (
        <Section title="What Went Well" icon="check" copyText={postMortem.what_went_well.join('\n')} confidence={confidence.what_went_well}>
          <ul className="space-y-2">
            {postMortem.what_went_well.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Action Items */}
      {postMortem.action_items?.length > 0 && (
        <Section title="Action Items" icon="list" copyText={postMortem.action_items.map(a => `[${a.priority}] ${a.description} (Owner: ${a.owner}, Effort: ${a.effort})`).join('\n')} confidence={confidence.action_items}>
          <div className="space-y-4">
            {postMortem.action_items.map((item, i) => (
              <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{item.description}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Owner: <span className="text-gray-700 dark:text-gray-300">{item.owner}</span>
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        Effort: <span className="text-gray-700 dark:text-gray-300">{item.effort}</span>
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium priority-${item.priority?.toLowerCase()}`}>
                    {item.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Analysis Insights */}
      <InsightsPanel postMortem={postMortem} />
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 text-gray-400 dark:text-gray-500 hover:text-atlas-600 dark:hover:text-atlas-400 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

function ConfidenceBadge({ score }) {
  if (score === undefined || score === null) return null;

  const numScore = Number(score);
  let colorClasses, label;

  if (numScore >= 80) {
    colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
    label = 'High confidence';
  } else if (numScore >= 60) {
    colorClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
    label = 'Moderate confidence';
  } else {
    colorClasses = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
    label = 'Low confidence';
  }

  return (
    <div className="relative group">
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${colorClasses}`}>
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        {numScore}%
      </span>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
        AI is {numScore}% confident in this analysis
        {numScore < 60 && <span className="block text-red-300 mt-0.5">Needs human review</span>}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
      </div>
    </div>
  );
}

function Section({ title, icon, children, copyText, confidence }) {
  const icons = {
    clipboard: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    ),
    search: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    ),
    layers: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    ),
    clock: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    alert: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    ),
    check: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    list: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    ),
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-atlas-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {icons[icon]}
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <ConfidenceBadge score={confidence} />
        </div>
        <div className="flex items-center gap-2">
          {confidence !== undefined && confidence < 60 && (
            <span className="text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Needs review
            </span>
          )}
          {copyText && <CopyButton text={copyText} />}
        </div>
      </div>
      {children}
    </div>
  );
}

export default PostMortemDisplay;
