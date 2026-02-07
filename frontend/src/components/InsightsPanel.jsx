import React from 'react';

function InsightsPanel({ postMortem }) {
  const completeness = checkCompleteness(postMortem);
  const score = Math.round(
    (completeness.filter((c) => c.present).length / completeness.length) * 100
  );

  return (
    <div className="card p-6 border-l-4 border-atlas-500">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-atlas-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Analysis Insights</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Time Saved */}
        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">~2-4 hrs</div>
          <p className="text-sm text-green-700 dark:text-green-400 mt-1">Estimated time saved</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            vs. manual post-mortem writing
          </p>
        </div>

        {/* Completeness Score */}
        <div className="text-center p-4 bg-atlas-50 dark:bg-atlas-900/20 rounded-lg">
          <div className={`text-3xl font-bold ${score >= 80 ? 'text-green-600 dark:text-green-400' : score >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
            {score}%
          </div>
          <p className="text-sm text-atlas-700 dark:text-atlas-400 mt-1">Completeness score</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {score >= 80 ? 'Comprehensive report' : 'Consider adding more detail'}
          </p>
        </div>

        {/* Format Consistency */}
        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">Standard</div>
          <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">SRE-compliant format</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Follows Google SRE best practices
          </p>
        </div>
      </div>

      {/* Completeness Checklist */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Completeness Check</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {completeness.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                item.present
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}
            >
              {item.present ? (
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Follow-up Questions */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Suggested Follow-up Questions</h4>
        <ul className="space-y-2">
          {getFollowUpQuestions(postMortem).map((q, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="text-atlas-500 mt-0.5">?</span>
              {q}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function checkCompleteness(postMortem) {
  return [
    {
      label: 'Root cause',
      present: !!postMortem.root_cause && postMortem.root_cause !== 'Investigation required',
    },
    {
      label: 'Timeline',
      present: postMortem.timeline?.length > 0,
    },
    {
      label: 'Impact assessed',
      present: !!postMortem.impact?.user_impact && postMortem.impact.user_impact !== 'Not assessed',
    },
    {
      label: 'Action items',
      present: postMortem.action_items?.length > 0,
    },
    {
      label: 'Contributing factors',
      present: postMortem.contributing_factors?.length > 0,
    },
    {
      label: 'What went well',
      present: postMortem.what_went_well?.length > 0,
    },
    {
      label: 'Executive summary',
      present: !!postMortem.executive_summary && postMortem.executive_summary !== 'Analysis pending',
    },
    {
      label: 'Severity rating',
      present: !!postMortem.impact?.severity,
    },
  ];
}

function getFollowUpQuestions(postMortem) {
  const questions = [];

  if (postMortem.action_items?.some((a) => a.priority === 'URGENT')) {
    questions.push('Have the URGENT action items been assigned to specific owners with deadlines?');
  }

  if (postMortem.contributing_factors?.length > 2) {
    questions.push('With multiple contributing factors, is there a systemic issue that connects them?');
  }

  questions.push('Were there any early warning signs that could have been caught by monitoring?');
  questions.push('Has a similar incident occurred before? If so, why did previous action items not prevent this?');

  if (postMortem.impact?.severity === 'P0' || postMortem.impact?.severity === 'P1') {
    questions.push('Should this trigger a broader architectural review of the affected systems?');
  }

  return questions.slice(0, 4);
}

export default InsightsPanel;
